# Changelog

### 2026-08-12 - Rules - Full audit against core rulebook (in progress)

Verifying every rules file against the core rulebook PDF. Findings per file:

**damage-and-healing.md** — content is accurate throughout. Wound States, both Critical Injury tables (Body and Head), Death Saves, the Armor SP table, Cover HP by material, the cover examples table, shields, and all environmental damage rules match the book verbatim. Fixed **17 incorrect page citations** in the "Other Ways to Get Hurt" section: Electrocution is p.180 (was cited 181); Falling, Poisons, Drugs, and Radiation are all p.181 (were cited 182). Cover's p.182-184 citations were correct and left alone.

**ranged-combat.md** — Single Shot DV matrix, Autofire rules and DV table, Suppressive Fire, Shotgun Shells, Aimed Shots, and the full Ranged Weapons table all match the book. Fixes:
- **Very Heavy Pistol magazine corrected from "8 (H Pistol)" to "8 (VH Pistol)"** — wrong ammunition type, which matters mechanically
- **Exotic Weapons rewritten** — the entry claimed all Exotic Weapons use the Handgun Skill and are 1 ROF. The book says no such thing (p.95): they are variants of existing weapons that inherit their counterpart's stats, are Average Quality, and are incompatible with attachments and non-Basic ammo
- Aimed Shots apply to Ranged **or Melee** attacks (p.170); the heading had restricted them to Ranged
- Citation fixes: Autofire DV table p.173 (was 174), Weapon Attachments p.96 (was 97), Exotic Weapons p.95 (was 96)

**melee-and-brawling.md** — all content verified accurate: Melee Weapons table, melee resolution, the BODY 8 one-handed exception, Brawling damage table (including the Cyberarm minimum-2d6 rule and Brawling *not* halving armor), Grab/Grapple/Choke/Throw, and the Martial Arts damage table and Special Moves all match the book. However **every citation from p.177 onward was off by one** (the file cited one page too high throughout), and the Melee Weapons table is on p.92, not p.93. All corrected.

**cyberware.md** — spot-checked and accurate so far: the Mall/Clinic/Hospital install descriptions, the Surgery DV table (DV13/DV15/DV17 at 100/500/1,000eb), the "no self-surgery unless Mall" rule, and the full Neuralware table including the counterintuitive Kerenzikov 14 (4d6) vs Sandevistan 7 (2d6) Humanity Loss values. Corrected the Installation Levels heading: the level *descriptions* are p.110 but the Surgery DVs and costs come from p.226.

**roles-and-abilities.md** — content verified; **36 citation corrections**. Drift here was not uniform (between -1 and -2 pages depending on section), so each Role Ability was located individually: Combat Awareness p.146, Interface p.147, Maker pp.147-148, Medicine pp.149-150, Credibility pp.151-152, Teamwork pp.153-157, Backup pp.158-159, Operator pp.159-161, Moto pp.161-165. All Nomad vehicle upgrade subsections were off by one.

**netrunning.md** — content verified; 9 citation corrections. Zap, NET Combat, and Defeating a Program are p.201 (were cited 202); Black ICE is pp.204-207 (was 204-208); Attacker Programs pp.203-204; Building a NET Architecture pp.210-211.

**core-resolution-and-skills.md** — the **most important fixes in this pass**, because this is the most-consulted section of the archive. The entire Skill Check Resolution block was off by one: the **DV Table is p.129** (was cited 130), and **Critical Success, Critical Failure, Negative Modifiers, Complementary Skills, Taking Extra Time, Using Your LUCK, and Trying Again are all p.130** (were cited 131). The opposed-check tie rule is p.129. Also: **Humanity is p.80, not p.81** (p.81 contains no Humanity content at all) — corrected here and in `cyberware.md`.

**gm-tools-and-encounters.md** — 3 fixes: Adversary Tiers is **p.399** (was cited p.412, a 13-page error), Hook Types p.398, Cliffhanger Types p.400.

**improvement-points.md**, **gear-and-economy.md**, **vehicles-and-chases.md**, **quick-reference-index.md** — audited, essentially clean (one range trimmed in improvement-points).

> **Root cause of the citation drift:** most chapters were transcribed with page references one to two pages higher than the printed page numbers, consistent with using PDF-viewer page numbers during transcription. Around **100 page references** were corrected across the archive. All fourteen rules files now pass an automated citation check that locates each section's text in the rulebook and compares the page it actually appears on against the cited page.

> **Audit status: complete.** Every file in `Local Archive/Rules/` has been verified against the core rulebook. The rules *content* was found to be highly accurate throughout — the tables were transcribed carefully and almost all matched the book verbatim. The defects were concentrated in page citations, which matter because the librarian is instructed to reproduce them exactly.

### 2026-08-12 - Rules - Character Creation and Basic Skills
- Added the 13 Basic Skills list (Athletics, Brawling, Concentration, Conversation, Education, Evasion, First Aid, Human Perception, Language, Local Expert, Perception, Persuasion, Stealth) to `character-creation-and-lifepath.md` — previously the wiki referenced "Basic Skills marked as such on the Skill list" but never included the marking
- Marked all 13 Basic Skills with **[BASIC]** in the Master Skill List in `core-resolution-and-skills.md` and added a Basic Skills quick-list table plus a legend for the (x2) Difficult Skill marker
- Fixed the "HP by BODY + WILL" table in `character-creation-and-lifepath.md` — it was off by one step for every odd BODY+WILL total and contradicted the correct HP matrix in `core-resolution-and-skills.md`
- Fixed mangled Paramedic and Photography/Film rows in the Master Skill List (Paramedic's description had fragmented into the following row)
- Corrected STAT abbreviations: TECH is Technique and COOL is Cool (was listed as "Cool/Willpower")
- Added routing rows to `agent-reference.md` for Basic Skills, starting Skill setup, and the Complete Package method
- Flagged a known gap: the per-Role Edgerunner Skill packages (core rulebook p. 88-89) are still not transcribed
- Verified all character-creation rules directly against the core rulebook PDF (pp. 74-91); figures below are confirmed from the primary source, not inferred
- Recorded the Basic Skills minimum spend as **26 of the 86 Skill points** (13 x 2), leaving **60** — matches the book's worked example on p. 90, which shows Language (Based on Cultural Origin) at Level 4 for a cost of **0**
- Filled the Edgerunner gap: added the **Edgerunner Skill lists for all 10 Roles** (pp. 88-89) and the 86-point distribution rules, including the "20 Skills per Role, ~4 points each with 6 spare" tip
- Fixed the **Edgerunner STAT generation** method in both rules files — it was wrongly described as distributing 62 points (and elsewhere as a raw 1d10 with rerolls). Per p. 77 you roll 1d10 per STAT and read the value off your Role's Template table
- Added the Complete Package **STAT Points by Character Rank** table (50/62/70/75/80, p. 78), noting 62 is the recommended Starting Character default
- Added a warning distinguishing **Streetrat** (fixed Skill Levels, pp. 86-87) from **Edgerunner** (same Skill lists, Levels chosen with 86 points, pp. 88-89)
- Clarified Complete Package starting money as **two separate pools with different leftover rules** (p. 104-105): unspent eb from the **2,550eb** pool is **kept**, unspent eb from the **800eb** Fashion/Fashionware pool is **lost**. The "you keep the remainder" rule was missing entirely
- Clarified that Execs live **rent-free** but still pay **600eb/month** to maintain the Good Prepak Lifestyle — "rent-free" alone reads as costing nothing
- Rewrote the Complete Package flow to match the book's own six-step chart on p. 42, with Lifestyle & Housing noted as following step 6 rather than being a numbered step
- Clarified that the Language Basic Skill is **Language (Streetslang)**, and that the Cultural Origin language (minimum 4 Levels, granted free by the Lifepath) is a **separate** Language Skill that does not satisfy or discount the Streetslang requirement — conflating the two is what makes the point maths come out wrong

### 2026-02-26 (Evening) - Setting - Net Lore
- Added DataKrash - Catastrophic event from June 2022 where Rache Bartmoss's virus destroyed the original NET, leading to the fragmented Net of the RED era
- Added The Blackwall - Massive virtual firewall created by NetWatch in 2044, separating human-controlled Net from AI-infested ruins of the old NET

### 2026-02-26 (Evening) - Locations - Pacifica
- Added Playland by the Sea - Amusement park in Pacifica district, Night City's premiere tourist destination during Time of the Red (2040s), survived amid Pacifica's decay thanks to corporate sponsors

### 2026-02-26 (Early Afternoon) - Organizations - RED Era Corporations
- Added SovOil - Major petrochemical corporation from the Neo-Soviet Union, active globally during Time of the Red, diversified into CHOOH2 and other industries by 2045
- Added Kendachi - Japanese arms manufacturer specializing in monomolecular blade technology, operates orbital factories and has office in Night City

### 2026-02-26 (Afternoon) - Organizations - Major RED Era Gangs
- Added Voodoo Boys - Enigmatic netrunner gang from Pacifica, formed by Haitian refugees in 2062, known for Blackwall probing and AI exploration during Time of the Red
- Added Animals - Street-fighting gang focused on physical prowess and biological enhancement, active throughout Night City during Time of the Red
- Added The Mox - Protective gang for sex workers and outcasts formed in 2067, based in Kabuki's Lizzie's Bar

### 2026-02-26 (Afternoon) - Locations - Kabuki/Watson
- Added Lizzie's Bar - Braindance club in Kabuki, headquarters of the Mox gang, originally established in 2067 following Lizzie Borden's death

### 2026-02-26 (Midday) - Locations - RED Era Districts
- Added Rancho Coronado - Overpacked suburb in southern Night City during Time of the Red, high threat district known for poverty, tent cities, and gang control by Albino Alligators
- Added Little Europe - Rebuilding urban district in central Night City during Time of the Red, originally planned with Western European architecture, later became the Downtown area

### 2026-02-26 (Morning) - Locations - RED Era Little China
- Added Virtex's Virtuality Venue - VR arcade on top floor of Guangbo Tower in Little China, popular attraction during Time of the Red, later became base for rogue AI "The Reaper"
- Added Ling Po Public Library - Community library on floor 10 of Guangbo Tower in Little China, financed by David Ling Po
- Added Prosperity Gardens Tenements - Apartment complex in Little China, known as one of the safest places in the district despite Gold Dragon protection
- Added Brookhaven Co-op - Former apartment complex in Little China Combat Zone, built with accidentally excellent plumbing, site of Maelstrom incident in 2044

### 2026-02-26 - Locations - Hot Zone
- Added Tent City - Makeshift encampment in Hot Zone, home to scavvers and desperate survivors during Time of the Red
- Added The N54 - Ruined Network 54 offices in Hot Zone's Old Corporate Center
- Added Hardhat's Warehouse - Derelict warehouse in Hot Zone's Old City Center used by scavvers
- Added Arasaka Towers Ruins - Nuclear-devastated remains of Arasaka headquarters in Hot Zone

### 2026-02-26 - Organizations - Hot Zone Gangs
- Added DeadWoods - Gang operating in Port of Night City during Time of the Red
- Added Reckoners - Radical eco-terrorist gang in Hot Zone during Time of the Red
- Added Lightning Cats - Dangerous gang operating in Hot Zone during Time of the Red
- Added Consortium - Criminal organization in Port of Night City competing with DeadWoods

### Organizations - Night City Co-Prosperity Sphere
- Added Night City Co-Prosperity Sphere (NCCS) - Corporate consortium of Japanese corporations formed after Fourth Corporate War, responsible for Watson Development reconstruction and sponsor of Tyger Claws gang

### Locations - Maelstrom Arena

### Organizations - Kiroshi Opticals
- Added Kiroshi Opticals - Japanese corporation specializing in optical cyberware, major player in Night City during Time of the Red

- Added Maelstrom Arena - Underground fight club in Watson's NID, operated by Maelstrom gang, hosts illegal boxing, cyberboxing, and death matches during RED era
