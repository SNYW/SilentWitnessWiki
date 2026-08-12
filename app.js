/* The Red Library — wiki front end
 *
 * Pipeline: manifest -> tree -> fetch markdown -> marked -> sanitize -> enhance -> render
 *
 * Design notes:
 *  - All markdown output is sanitized against an allowlist before it reaches the
 *    DOM. marked does not sanitize, and these files are written by automated
 *    agents, so raw HTML must never be trusted.
 *  - Content enhancements ([[links]], threat ratings, district codes) operate on
 *    DOM text nodes, never on HTML strings. String regex over generated HTML
 *    corrupts fenced code blocks and can match inside attributes.
 *  - Tags come from manifest.json, baked in at build time. This page used to
 *    fetch every file on load just to read them.
 */
'use strict';

const MOBILE_BREAKPOINT = 768;               // matches @media (max-width: 768px)
const wikiBase = new URL('wiki/', document.baseURI).href;

const els = {
  menuToggle: document.getElementById('menuToggle'),
  sidebar: document.getElementById('sidebar'),
  backdrop: document.getElementById('backdrop'),
  tree: document.getElementById('tree'),
  search: document.getElementById('search'),
  content: document.getElementById('content'),
  status: document.getElementById('status'),
  count: document.getElementById('resultCount'),
};

const welcomeHTML = els.content.innerHTML;
let currentFile = null;
let currentFetch = null;
let cachedChangelog = '';
const wikiLinkMap = new Map();   // normalised page name -> path

/* ------------------------------------------------------------------ utils */

const normaliseKey = s => s.toLowerCase().replace(/[\s\-_'"()]/g, '');

function announce(msg) {
  if (els.status) els.status.textContent = msg;
}

/* ------------------------------------------------------------ sanitizer */

const ALLOWED_TAGS = new Set([
  'A','B','BLOCKQUOTE','BR','CODE','DD','DEL','DIV','DL','DT','EM','H1','H2',
  'H3','H4','H5','H6','HR','I','IMG','LI','OL','P','PRE','S','SPAN','STRONG',
  'SUB','SUP','TABLE','TBODY','TD','TFOOT','TH','THEAD','TR','UL',
]);

const ALLOWED_ATTRS = {
  A:   new Set(['href', 'title']),
  IMG: new Set(['src', 'alt', 'title']),
  TD:  new Set(['colspan', 'rowspan', 'align']),
  TH:  new Set(['colspan', 'rowspan', 'align']),
};

const SAFE_URL = /^(https?:|mailto:|#|\/|\.{0,2}\/)/i;

/** Strip everything not on the allowlist. Returns a safe DocumentFragment. */
function sanitize(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  const doomed = [];

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!ALLOWED_TAGS.has(node.tagName)) { doomed.push(node); continue; }
    const permitted = ALLOWED_ATTRS[node.tagName];
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      if (!permitted || !permitted.has(name)) { node.removeAttribute(attr.name); continue; }
      if ((name === 'href' || name === 'src') && !SAFE_URL.test(attr.value.trim())) {
        node.removeAttribute(attr.name);
      }
    }
  }
  // Unwrap disallowed elements, keeping their text. Deepest first so nesting survives.
  for (const node of doomed.reverse()) {
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') { node.remove(); continue; }
    node.replaceWith(...node.childNodes);
  }

  const frag = document.createDocumentFragment();
  frag.append(...Array.from(doc.body.childNodes));
  return frag;
}

/* ------------------------------------------------------------ enhancers */

const SKIP_ANCESTORS = new Set(['PRE', 'CODE', 'A', 'SCRIPT', 'STYLE']);

function eachTextNode(root, fn) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      for (let p = node.parentNode; p && p !== root; p = p.parentNode) {
        if (SKIP_ANCESTORS.has(p.nodeName)) return NodeFilter.FILTER_REJECT;
      }
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);
  nodes.forEach(fn);
}

/** Replace matches inside a text node with generated elements. */
function replaceInText(textNode, pattern, build) {
  const text = textNode.nodeValue;
  pattern.lastIndex = 0;
  if (!pattern.test(text)) return;
  pattern.lastIndex = 0;

  const frag = document.createDocumentFragment();
  let last = 0, m;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) frag.append(text.slice(last, m.index));
    frag.append(build(m));
    last = m.index + m[0].length;
    if (m[0] === '') pattern.lastIndex++;   // guard against zero-length matches
  }
  if (last < text.length) frag.append(text.slice(last));
  textNode.replaceWith(frag);
}

function enhance(root) {
  // [[Wiki Links]]
  eachTextNode(root, node => replaceInText(node, /\[\[([^\]\n]+)\]\]/g, m => {
    const name = m[1];
    const path = wikiLinkMap.get(normaliseKey(name));
    if (path && path !== currentFile) {
      const el = document.createElement('span');
      el.className = 'wiki-link';
      el.dataset.file = path;
      el.tabIndex = 0;
      el.setAttribute('role', 'link');
      el.textContent = name;
      return el;
    }
    if (path) return document.createTextNode(name);
    const el = document.createElement('span');
    el.className = 'wiki-link-missing';
    el.title = `No page found: ${name}`;
    el.textContent = name;
    return el;
  }));

  // Threat Rating: Extreme
  eachTextNode(root, node => replaceInText(node, /Threat Rating:\s*(\w+)/gi, m => {
    const frag = document.createDocumentFragment();
    frag.append('Threat Rating: ');
    const el = document.createElement('span');
    el.className = `threat-rating threat-${m[1].toLowerCase()}`;
    el.textContent = m[1];
    frag.append(el);
    return frag;
  }));

  // District Code: A  /  (District Code: A)
  eachTextNode(root, node => replaceInText(node, /\(?District Code:\s*([A-Z])\)?/g, m => {
    const el = document.createElement('span');
    el.className = 'district-code';
    el.textContent = m[1];
    return el;
  }));

  // Auto-link bold text matching a page name
  root.querySelectorAll('strong').forEach(strong => {
    if (strong.querySelector('.wiki-link') || strong.closest('a, pre, code')) return;
    const name = strong.textContent.trim();
    const path = wikiLinkMap.get(normaliseKey(name));
    if (!path || path === currentFile) return;
    const link = document.createElement('span');
    link.className = 'wiki-link';
    link.dataset.file = path;
    link.tabIndex = 0;
    link.setAttribute('role', 'link');
    link.textContent = name;
    strong.replaceChildren(link);
  });

  // Long tables should scroll on their own, not push the page sideways
  root.querySelectorAll('table').forEach(table => {
    const wrap = document.createElement('div');
    wrap.className = 'table-scroll';
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Table');
    table.replaceWith(wrap);
    wrap.append(table);
  });
}

/* ---------------------------------------------------------------- badges */

const TYPE_BADGES = [['npc','NPC'],['player','PC'],['session','SESSION'],['location','LOCATION'],['bar','LOCATION']];
const STATUS_BADGES = [
  ['status-alive','status-alive','● ALIVE'], ['status-active','status-alive','● ACTIVE'],
  ['status-deceased','status-deceased','● DECEASED'], ['status-dead','status-deceased','● DECEASED'],
  ['status-missing','status-missing','? MISSING'], ['status-inactive','status-inactive','○ INACTIVE'],
];

function buildMeta(tags) {
  const lower = tags.map(t => t.toLowerCase());
  const badges = document.createElement('div');
  badges.className = 'page-badges';

  for (const [key, label] of TYPE_BADGES) {
    if (lower.includes(key)) {
      const b = document.createElement('span');
      b.className = 'type-badge'; b.textContent = label; badges.append(b); break;
    }
  }
  for (const [tag, css, label] of STATUS_BADGES) {
    if (lower.includes(tag)) {
      const b = document.createElement('span');
      b.className = `status-badge ${css}`; b.textContent = label; badges.append(b); break;
    }
  }

  const pills = document.createElement('div');
  pills.className = 'tag-container';
  for (const tag of tags) {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'tag-pill';
    pill.dataset.tag = tag;
    pill.textContent = tag;
    pills.append(pill);
  }
  return { badges: badges.children.length ? badges : null, pills: tags.length ? pills : null };
}

/* ------------------------------------------------------------ rendering */

function renderMarkdown(text) {
  let tags = [];
  const source = text.replace(/^(?:\*\*Tags:\*\*|Tags:)\s*(.+)$/gim, (_, list) => {
    tags = list.split(',').map(t => t.trim().replace(/[*_`]/g, '')).filter(Boolean);
    return '';
  });

  const body = document.createElement('div');
  body.className = 'content-body';
  body.id = 'rendered-content';
  body.append(sanitize(marked.parse(source)));
  enhance(body);

  const { badges, pills } = buildMeta(tags);
  const h1 = body.querySelector('h1');
  const meta = [badges, pills].filter(Boolean);
  if (meta.length) {
    if (h1) meta.reverse().forEach(el => h1.after(el));
    else meta.reverse().forEach(el => body.prepend(el));
  }

  els.content.replaceChildren(body);
  applyCascade(body);
  const area = document.querySelector('.content-area');
  if (area) area.scrollTop = 0;
}

function applyCascade(container) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  Array.from(container.children).slice(0, 40).forEach((el, i) => {
    el.style.animation = 'lineLoad 0.15s ease-out forwards';
    el.style.animationDelay = `${i * 0.03}s`;
    el.style.opacity = '0';
  });
}

async function loadContent(file) {
  if (currentFetch) currentFetch.abort();
  const controller = new AbortController();
  currentFetch = controller;
  currentFile = file;

  const encoded = encodeURIComponent(file);
  if (window.location.hash !== '#' + encoded) window.location.hash = encoded;

  els.content.replaceChildren(Object.assign(document.createElement('div'), {
    className: 'loading', textContent: 'Decrypting data…',
  }));
  announce('Loading ' + file);
  if (window.innerWidth <= MOBILE_BREAKPOINT && els.sidebar.classList.contains('open')) toggleMenu();

  try {
    const res = await fetch(wikiBase + file, { signal: controller.signal, cache: 'no-cache' });
    if (!res.ok) throw new Error(`${res.status} — data corrupted or missing`);
    renderMarkdown(await res.text());
    document.querySelectorAll('.file-item').forEach(i => {
      const active = i.dataset.file === file;
      i.classList.toggle('active', active);
      i.setAttribute('aria-current', active ? 'page' : 'false');
    });
    announce('Loaded ' + file);
  } catch (err) {
    if (err.name === 'AbortError') return;
    const box = document.createElement('div');
    box.className = 'empty-state';
    const h = document.createElement('h2'); h.textContent = 'Signal lost';
    const p = document.createElement('p'); p.textContent = err.message;
    box.append(h, p);
    els.content.replaceChildren(box);
    announce('Failed to load ' + file);
  } finally {
    if (currentFetch === controller) currentFetch = null;
  }
}

function showWelcome() {
  currentFile = null;
  if (currentFetch) { currentFetch.abort(); currentFetch = null; }
  document.querySelectorAll('.file-item').forEach(i => {
    i.classList.remove('active'); i.setAttribute('aria-current', 'false');
  });
  els.content.innerHTML = welcomeHTML;      // trusted: our own static markup
  const slot = document.getElementById('changelog');
  if (slot && cachedChangelog) slot.replaceChildren(sanitize(cachedChangelog));
}

/* ---------------------------------------------------------------- tree */

function buildTree(nodes, depth = 0) {
  const frag = document.createDocumentFragment();

  for (const node of nodes) {
    if (node.children) {
      const folder = document.createElement('div');
      folder.className = 'tree-folder';
      const name = node.name || 'Unknown';
      folder.dataset.search = name.toLowerCase();

      const open = depth === 0;
      const row = document.createElement('div');
      row.className = 'tree-item folder-toggle';
      row.setAttribute('role', 'treeitem');
      row.setAttribute('aria-expanded', String(open));
      row.tabIndex = -1;

      const arrow = document.createElement('span');
      arrow.className = `arrow ${open ? 'expanded' : 'collapsed'}`;
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '▾';
      const icon = document.createElement('span');
      icon.className = 'icon'; icon.setAttribute('aria-hidden', 'true'); icon.textContent = '▚';
      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = name.charAt(0).toUpperCase() + name.slice(1);

      const count = document.createElement('span');
      count.className = 'folder-count';
      count.textContent = countFiles(node);

      row.append(arrow, icon, label, count);

      const kids = document.createElement('div');
      kids.className = `folder-children${open ? '' : ' collapsed'}`;
      kids.setAttribute('role', 'group');
      kids.append(buildTree(node.children, depth + 1));

      folder.append(row, kids);
      frag.append(folder);
    } else if (node.path) {
      const item = document.createElement('div');
      item.className = 'tree-item file-item';
      item.setAttribute('role', 'treeitem');
      item.setAttribute('aria-current', 'false');
      item.tabIndex = -1;
      item.dataset.file = node.path;
      item.dataset.search = (node.name || '').toLowerCase();
      item.dataset.tags = node.tags || '';

      const icon = document.createElement('span');
      icon.className = 'icon'; icon.setAttribute('aria-hidden', 'true'); icon.textContent = '▸';
      const label = document.createElement('span');
      label.className = 'label';
      label.textContent = (node.name || 'Untitled').replace(/\.md$/i, '');
      item.append(icon, label);
      frag.append(item);
    }
  }
  return frag;
}

function countFiles(node) {
  if (!node.children) return node.path ? 1 : 0;
  return node.children.reduce((n, c) => n + countFiles(c), 0);
}

function buildLinkMap(nodes) {
  for (const node of nodes) {
    if (node.children) { buildLinkMap(node.children); continue; }
    if (!node.path) continue;
    const key = normaliseKey((node.name || '').replace(/\.md$/i, ''));
    if (key) wikiLinkMap.set(key, node.path);
    const stem = node.path.split('/').pop().replace(/\.md$/i, '');
    for (const part of stem.split('-')) {
      if (part.length >= 4 && !wikiLinkMap.has(part)) wikiLinkMap.set(part, node.path);
    }
  }
}

function toggleFolder(row) {
  const expanded = row.getAttribute('aria-expanded') === 'true';
  row.setAttribute('aria-expanded', String(!expanded));
  row.querySelector('.arrow').classList.toggle('collapsed', expanded);
  row.querySelector('.arrow').classList.toggle('expanded', !expanded);
  row.nextElementSibling.classList.toggle('collapsed', expanded);
}

/* --------------------------------------------------------------- search */

function filterTree() {
  const q = els.search.value.toLowerCase().trim();
  const folders = els.tree.querySelectorAll('.tree-folder');
  const files = els.tree.querySelectorAll('.file-item');

  if (!q) {
    files.forEach(f => f.classList.remove('hidden'));
    folders.forEach(folder => {
      folder.classList.remove('hidden');
      const top = !folder.parentElement.closest('.tree-folder');
      const kids = folder.querySelector(':scope > .folder-children');
      const row = folder.querySelector(':scope > .tree-item');
      if (kids) kids.classList.toggle('collapsed', !top);
      if (row) {
        row.setAttribute('aria-expanded', String(top));
        const a = row.querySelector('.arrow');
        a.classList.toggle('collapsed', !top);
        a.classList.toggle('expanded', top);
      }
    });
    if (els.count) els.count.textContent = '';
    return;
  }

  files.forEach(f => f.classList.add('hidden'));
  folders.forEach(f => f.classList.add('hidden'));

  let hits = 0;
  files.forEach(file => {
    const byName = file.dataset.search.includes(q);
    const byTag = file.dataset.tags && file.dataset.tags.includes(q);
    if (!byName && !byTag) return;
    hits++;
    file.classList.remove('hidden');
    for (let f = file.closest('.tree-folder'); f; f = f.parentElement.closest('.tree-folder')) {
      f.classList.remove('hidden');
      const kids = f.querySelector(':scope > .folder-children');
      const row = f.querySelector(':scope > .tree-item');
      if (kids) kids.classList.remove('collapsed');
      if (row) {
        row.setAttribute('aria-expanded', 'true');
        row.querySelector('.arrow').classList.replace('collapsed', 'expanded');
      }
    }
  });

  folders.forEach(folder => {
    if (!folder.dataset.search.includes(q)) return;
    folder.classList.remove('hidden');
    folder.querySelectorAll('.file-item').forEach(f => {
      if (f.classList.contains('hidden')) hits++;
      f.classList.remove('hidden');
    });
    folder.querySelectorAll('.tree-folder').forEach(f => f.classList.remove('hidden'));
  });

  if (els.count) els.count.textContent = hits ? `${hits} match${hits === 1 ? '' : 'es'}` : 'no matches';
  announce(hits ? `${hits} results` : 'No results');
}

function searchByTag(tag) {
  els.search.value = tag;
  if (window.innerWidth <= MOBILE_BREAKPOINT && !els.sidebar.classList.contains('open')) toggleMenu();
  filterTree();
  els.search.focus();
}

/* ------------------------------------------------------- keyboard nav */

function visibleRows() {
  return Array.from(els.tree.querySelectorAll('.tree-item'))
    .filter(el => el.offsetParent !== null);
}

function focusRow(row) {
  if (!row) return;
  els.tree.querySelectorAll('.tree-item').forEach(r => { r.tabIndex = -1; });
  row.tabIndex = 0;
  row.focus();
}

els.tree.addEventListener('keydown', e => {
  const row = e.target.closest('.tree-item');
  if (!row) return;
  const rows = visibleRows();
  const i = rows.indexOf(row);
  const isFolder = row.classList.contains('folder-toggle');

  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); focusRow(rows[i + 1]); break;
    case 'ArrowUp':   e.preventDefault(); focusRow(rows[i - 1]); break;
    case 'Home':      e.preventDefault(); focusRow(rows[0]); break;
    case 'End':       e.preventDefault(); focusRow(rows[rows.length - 1]); break;
    case 'ArrowRight':
      if (isFolder && row.getAttribute('aria-expanded') === 'false') { e.preventDefault(); toggleFolder(row); }
      break;
    case 'ArrowLeft':
      if (isFolder && row.getAttribute('aria-expanded') === 'true') { e.preventDefault(); toggleFolder(row); }
      else { const p = row.parentElement.parentElement.closest('.tree-folder'); if (p) { e.preventDefault(); focusRow(p.querySelector(':scope > .tree-item')); } }
      break;
    case 'Enter': case ' ':
      e.preventDefault();
      if (isFolder) toggleFolder(row); else loadContent(row.dataset.file);
      break;
  }
});

/* ---------------------------------------------------------------- wiring */

function toggleMenu() {
  const open = els.sidebar.classList.toggle('open');
  els.menuToggle.classList.toggle('active', open);
  els.backdrop.classList.toggle('open', open);
  els.menuToggle.setAttribute('aria-expanded', String(open));
}

els.menuToggle.addEventListener('click', toggleMenu);
els.backdrop.addEventListener('click', toggleMenu);
document.querySelector('.header h1').addEventListener('click', () => { window.location.hash = ''; });

els.tree.addEventListener('click', e => {
  const file = e.target.closest('.file-item');
  if (file) { focusRow(file); loadContent(file.dataset.file); return; }
  const folder = e.target.closest('.folder-toggle');
  if (folder) { focusRow(folder); toggleFolder(folder); }
});

els.search.addEventListener('input', filterTree);
els.search.addEventListener('keydown', e => {
  if (e.key === 'Escape') { els.search.value = ''; filterTree(); }
});

els.content.addEventListener('click', e => {
  const link = e.target.closest('.wiki-link');
  if (link && link.dataset.file) { loadContent(link.dataset.file); return; }
  const pill = e.target.closest('.tag-pill');
  if (pill && pill.dataset.tag) searchByTag(pill.dataset.tag);
});
els.content.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const link = e.target.closest('.wiki-link');
  if (link && link.dataset.file) { e.preventDefault(); loadContent(link.dataset.file); }
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (!hash) { showWelcome(); return; }
  const file = decodeURIComponent(hash);
  if (file !== currentFile) loadContent(file);
});

/* ------------------------------------------------------------- startup */

function fatal(msg) {
  els.tree.replaceChildren(Object.assign(document.createElement('p'), {
    className: 'tree-error', textContent: '> SYS_ERR: ' + msg,
  }));
}

if (typeof marked === 'undefined') {
  fatal('markdown renderer failed to load (offline or CDN blocked)');
} else {
  marked.use({ gfm: true, breaks: true });

  els.tree.replaceChildren(Object.assign(document.createElement('p'), {
    className: 'tree-loading', textContent: '> Connecting…',
  }));

  fetch(wikiBase + 'manifest.json', { cache: 'no-cache' })
    .then(res => { if (!res.ok) throw new Error('manifest ' + res.status); return res.json(); })
    .then(data => {
      const root = Array.isArray(data) ? { children: data } : data;
      const nodes = root.children || [];
      buildLinkMap(nodes);
      els.tree.replaceChildren(buildTree(nodes, 0));
      const first = els.tree.querySelector('.tree-item');
      if (first) first.tabIndex = 0;

      const hash = window.location.hash.slice(1);
      if (hash) loadContent(decodeURIComponent(hash));

      return fetch(wikiBase + 'CHANGELOG.md', { cache: 'no-cache' })
        .then(r => (r.ok ? r.text() : ''))
        .then(text => {
          if (!text) return;
          cachedChangelog = marked.parse(text);
          const slot = document.getElementById('changelog');
          if (slot) slot.replaceChildren(sanitize(cachedChangelog));
        })
        .catch(() => {});
    })
    .catch(err => fatal(err.message));
}
