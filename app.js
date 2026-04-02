// #14: Mobile breakpoint constant — matches @media (max-width: 768px) in style.css
const MOBILE_BREAKPOINT = 768;
// #16: Resolve wiki base against document location for subdirectory safety
const wikiBase = new URL('wiki/', document.baseURI).href;

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('backdrop');

function toggleMenu() { menuToggle.classList.toggle('active'); sidebar.classList.toggle('open'); backdrop.classList.toggle('open'); }
menuToggle.addEventListener('click', toggleMenu);
backdrop.addEventListener('click', toggleMenu);
document.querySelector('.header h1').addEventListener('click', () => { window.location.hash = ''; });
// #11: Event delegation replaces inline onclick on every tree item
document.getElementById('tree').addEventListener('click', e => {
const fileItem = e.target.closest('.file-item');
if (fileItem) { loadContent(fileItem.dataset.file); return; }
const folderToggle = e.target.closest('.folder-toggle');
if (folderToggle) toggleFolder(folderToggle);
});
// #11: addEventListener replaces oninput attribute on search input
document.getElementById('search').addEventListener('input', filterTree);

// #15: Array-join pattern replaces string concatenation in loop
function buildTreeHTML(node, level = 0) {
if ((node.name || '') === '.') { return (node.children || []).map(c => buildTreeHTML(c, level)).join(''); }
const parts = [];
if (node.type === 'folder' || node.children) {
const children = node.children || [];
const displayName = (node.name || 'Unknown').charAt(0).toUpperCase() + (node.name || 'Unknown').slice(1);
const isTopLevel = (level === 0);
const arrowClass = isTopLevel ? 'expanded' : 'collapsed';
const childrenClass = isTopLevel ? '' : 'collapsed';
parts.push(`<div class="tree-folder" data-search="${displayName.toLowerCase()}"><div class="tree-item folder-toggle"><span class="arrow ${arrowClass}">▼</span><span class="icon">📁</span><span>${displayName}</span></div><div class="folder-children ${childrenClass}">`);
for (const child of children) { parts.push(buildTreeHTML(child, level + 1)); }
parts.push('</div></div>');
} else {
const searchName = (node.name || '').toLowerCase();
const fileName = (node.name || 'Untitled').replace(/\.md$/i, '');
const filePath = node.path || '';
parts.push(`<div class="tree-item file-item" data-file="${filePath}" data-search="${searchName}" data-tags=""><span class="icon">📄</span><span>${fileName}</span></div>`);
}
return parts.join('');
}

function toggleFolder(el) {
const arrow = el.querySelector('.arrow');
const children = el.nextElementSibling;
arrow.classList.toggle('collapsed');
arrow.classList.toggle('expanded');
children.classList.toggle('collapsed');
}

function searchByTag(tag) {
const searchBox = document.getElementById('search');
searchBox.value = tag;
if (window.innerWidth <= MOBILE_BREAKPOINT && !sidebar.classList.contains('open')) { toggleMenu(); }
filterTree();
searchBox.focus();
}

function filterTree() {
const search = document.getElementById('search').value.toLowerCase().trim();
const folders = document.querySelectorAll('.tree-folder');
const files = document.querySelectorAll('.file-item');
if (!search) {
files.forEach(f => f.classList.remove('hidden'));
folders.forEach(folder => {
folder.classList.remove('hidden');
const isTopLevel = !folder.parentElement.closest('.tree-folder');
const childrenDiv = folder.querySelector(':scope > .folder-children');
const arrow = folder.querySelector(':scope > .tree-item > .arrow');
if (childrenDiv) childrenDiv.classList.toggle('collapsed', !isTopLevel);
if (arrow) { arrow.classList.toggle('collapsed', !isTopLevel); arrow.classList.toggle('expanded', isTopLevel); }
});
return;
}
files.forEach(f => f.classList.add('hidden'));
folders.forEach(f => f.classList.add('hidden'));
files.forEach(file => {
const matchesName = file.dataset.search.includes(search);
const matchesTag = file.dataset.tags && file.dataset.tags.includes(search);
if (matchesName || matchesTag) {
file.classList.remove('hidden');
let parentFolder = file.closest('.tree-folder');
while (parentFolder) {
parentFolder.classList.remove('hidden');
const childrenDiv = parentFolder.querySelector('.folder-children');
const arrow = parentFolder.querySelector('.arrow');
if (childrenDiv) childrenDiv.classList.remove('collapsed');
if (arrow) { arrow.classList.remove('collapsed'); arrow.classList.add('expanded'); }
parentFolder = parentFolder.parentElement.closest('.tree-folder');
}
}
});
folders.forEach(folder => {
if (folder.dataset.search.includes(search)) {
folder.classList.remove('hidden');
folder.querySelectorAll('.file-item').forEach(f => f.classList.remove('hidden'));
folder.querySelectorAll('.tree-folder').forEach(f => f.classList.remove('hidden'));
}
});
}

// #13: marked.use() instead of marked.setOptions()
marked.use({ gfm: true, breaks: true });
const contentDiv = document.getElementById('content');
const welcomeHTML = contentDiv.innerHTML;
let cachedChangelogHTML = '';
let currentFile = null;
let currentFetch = null;

// Wiki link lookup: normalized name -> file path, built from manifest on load
const wikiLinkMap = {};
function buildWikiLinkMap(nodes) {
for (const node of nodes) {
if (node.children) { buildWikiLinkMap(node.children); continue; }
if (!node.path) continue;
const baseName = (node.name || '').replace(/\.md$/i, '');
const key = baseName.toLowerCase().replace(/[\s\-_'"()]/g, '');
if (key) wikiLinkMap[key] = node.path;
// Alias each hyphen-separated segment of the actual filename (not display name)
// so e.g. "ronnie-pickering-roadblock.md" registers "roadblock" as an alias
const fileName = node.path.split('/').pop().replace(/\.md$/i, '');
for (const part of fileName.split('-')) {
if (part.length >= 4 && !wikiLinkMap[part]) wikiLinkMap[part] = node.path;
}
}
}

// Event delegation for wiki-links and tag-pills rendered inside content
contentDiv.addEventListener('click', e => {
const wikiLink = e.target.closest('.wiki-link');
if (wikiLink && wikiLink.dataset.file) { loadContent(wikiLink.dataset.file); return; }
const tagPill = e.target.closest('.tag-pill');
if (tagPill && tagPill.dataset.tag) { searchByTag(tagPill.dataset.tag); }
});

function showWelcome() {
currentFile = null;
if (currentFetch) { currentFetch.abort(); currentFetch = null; }
document.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
contentDiv.innerHTML = welcomeHTML;
if (cachedChangelogHTML) {
const changelogDiv = document.getElementById('changelog');
if (changelogDiv) changelogDiv.innerHTML = cachedChangelogHTML;
}
}

async function loadContent(file) {
if (currentFetch) { currentFetch.abort(); }
const controller = new AbortController();
currentFetch = controller;
currentFile = file;
const encoded = encodeURIComponent(file);
if (window.location.hash !== '#' + encoded) { window.location.hash = encoded; }
contentDiv.innerHTML = '<div class="loading">Decrypting Data...</div>';
if (window.innerWidth <= MOBILE_BREAKPOINT && sidebar.classList.contains('open')) { toggleMenu(); }
try {
const response = await fetch(wikiBase + file, { signal: controller.signal });
if (!response.ok) throw new Error('Data corrupted or missing');
const text = await response.text();
renderMarkdown(text);
document.querySelectorAll('.file-item').forEach(i => i.classList.remove('active'));
document.querySelectorAll(`.file-item[data-file="${file}"]`).forEach(i => i.classList.add('active'));
currentFetch = null; // #18: clear reference after successful load
} catch (e) {
if (e.name === 'AbortError') return;
currentFetch = null; // #18: clear reference after error
contentDiv.innerHTML = `<div class="empty-state"><h2>Error 404</h2><p>${e.message}</p></div>`;
}
}

window.addEventListener('hashchange', () => {
const hash = window.location.hash.slice(1);
if (hash) { const file = decodeURIComponent(hash); if (file !== currentFile) loadContent(file); }
else { showWelcome(); }
});

function applyCascadeAnimation(containerId) {
const container = document.getElementById(containerId);
if (!container) return;
const elements = container.querySelectorAll(':scope > *');
elements.forEach((el, index) => {
el.style.opacity = '0';
el.style.animation = 'lineLoad 0.15s ease-out forwards';
el.style.animationDelay = `${index * 0.04}s`;
});
}

function renderMarkdown(text) {
let tagHtml = '';
let badgeHtml = '';
text = text.replace(/^(?:\*\*Tags:\*\*|Tags:)\s*(.+)$/gim, (match, tagsString) => {
const tags = tagsString.split(',').map(t => t.trim().replace(/[*_`]/g, ''));
// Use data-tag attribute; clicks handled by contentDiv delegation
const pills = tags.map(t => `<span class="tag-pill" data-tag="${t}">${t}</span>`).join('');
tagHtml = `<div class="tag-container">${pills}</div>`;
// Generate page-type and status badges from tags
const lowerTags = tags.map(t => t.toLowerCase());
const badges = [];
const typeMap = [['npc','NPC'],['player','PC'],['session','SESSION'],['location','LOCATION'],['bar','LOCATION']];
for (const [key, label] of typeMap) { if (lowerTags.includes(key)) { badges.push(`<span class="type-badge">${label}</span>`); break; } }
const statusMap = [
['status-alive','status-alive','● ALIVE'],['status-active','status-alive','● ACTIVE'],
['status-deceased','status-deceased','● DECEASED'],['status-dead','status-deceased','● DECEASED'],
['status-missing','status-missing','? MISSING'],['status-inactive','status-inactive','○ INACTIVE']
];
for (const [tag, css, label] of statusMap) { if (lowerTags.includes(tag)) { badges.push(`<span class="status-badge ${css}">${label}</span>`); break; } }
if (badges.length) badgeHtml = `<div class="page-badges">${badges.join('')}</div>`;
return '';
});
let html = marked.parse(text);
// Insert badges then tags after h1, or prepend if no h1
if (html.includes('</h1>')) {
const insertions = [badgeHtml, tagHtml].filter(Boolean).join('\n');
if (insertions) html = html.replace('</h1>', '</h1>\n' + insertions);
} else if (badgeHtml || tagHtml) {
html = [badgeHtml, tagHtml].filter(Boolean).join('\n') + '\n' + html;
}
html = html.replace(/Threat Rating:\s*(\w+)/gi, (match, rating) => `Threat Rating: <span class="threat-rating threat-${rating.toLowerCase()}">${rating}</span>`);
html = html.replace(/\(District Code: ([A-Z])\)/gi, '<span class="district-code">$1</span>');
html = html.replace(/District Code:\s*([A-Z])/gi, '<span class="district-code">$1</span>');
// [[Wiki Links]] — explicit link syntax
html = html.replace(/\[\[([^\]]+)\]\]/g, (match, name) => {
const key = name.toLowerCase().replace(/[\s\-_'"()]/g, '');
const path = wikiLinkMap[key];
if (path && path !== currentFile) return `<span class="wiki-link" data-file="${path}">${name}</span>`;
if (path) return name;
return `<span class="wiki-link-missing" title="No page found: ${name}">${name}</span>`;
});
// Auto-link bold names that match a wiki page
html = html.replace(/<strong>([^<]+)<\/strong>/g, (match, name) => {
const key = name.toLowerCase().replace(/[\s\-_'"()]/g, '');
const path = wikiLinkMap[key];
if (path && path !== currentFile) return `<strong><span class="wiki-link" data-file="${path}">${name}</span></strong>`;
return match;
});
contentDiv.innerHTML = `<div class="content-body" id="rendered-content">${html}</div>`;
applyCascadeAnimation('rendered-content');
document.querySelector('.content-area').scrollTop = 0;
}

async function runBackgroundIndexer() {
const files = document.querySelectorAll('.file-item');
for (const file of files) {
try {
const response = await fetch(wikiBase + file.dataset.file);
const text = await response.text();
const match = text.match(/(?:\*\*Tags:\*\*|Tags:)\s*(.+)/i);
if (match) { file.dataset.tags = match[1].toLowerCase(); }
} catch (e) { console.warn('Failed to index tags for:', file.dataset.file); }
}
console.log('> DATABANK INDEXED: Search by tags enabled.');
}

// #17: Show loading state while manifest is fetched
document.getElementById('tree').innerHTML = '<p style="padding:20px;color:var(--teal);font-family:\'Fira Code\',monospace;font-size:0.9rem;animation:pulse 1.5s infinite;">> Connecting...</p>';

fetch(wikiBase + 'manifest.json?t=' + Date.now())
.then(res => { if (!res.ok) throw new Error('Failed to interface with manifest: ' + res.status); return res.json(); })
.then(data => {
const treeData = Array.isArray(data) ? { children: data } : data;
if (!treeData.children) treeData.children = [];
buildWikiLinkMap(treeData.children);
document.getElementById('tree').innerHTML = treeData.children.map(c => buildTreeHTML(c, 0)).join('') || '<p style="padding:20px;color:#71717a;">No files found in directory.</p>';
const initialHash = window.location.hash.slice(1);
if (initialHash) { loadContent(decodeURIComponent(initialHash)); }
runBackgroundIndexer();
fetch(wikiBase + 'CHANGELOG.md?t=' + Date.now())
.then(r => r.ok ? r.text() : '')
.then(text => {
if (text) {
cachedChangelogHTML = `<div class="content-body" id="rendered-changelog">${marked.parse(text)}</div>`;
const changelogDiv = document.getElementById('changelog');
if (changelogDiv) { changelogDiv.innerHTML = cachedChangelogHTML; applyCascadeAnimation('rendered-changelog'); }
}
})
.catch(() => {});
})
.catch(err => {
console.error('Error:', err);
document.getElementById('tree').innerHTML = `<p style="padding:20px;color:#f87171;font-family:'Fira Code', monospace;">> SYS_ERR: ${err.message}</p>`;
});
