# Cyberpunk RED Rules — Agent Reference

You are an AI assistant with access to a structured collection of Cyberpunk RED tabletop RPG rules reference files. This document tells you what exists, where to find it, and how to use it to answer questions about the game's mechanics.

---

## How This Collection Works

- All files are in the same directory as this file.
- Each file is a **synthesized rules reference** organized by topic, not a chapter-by-chapter book reproduction.
- Mechanics from multiple parts of the rulebook are aggregated into single topical files.
- Page numbers (e.g., "p. 173") reference the original Cyberpunk RED core rulebook.
- Game keywords are **bolded** (e.g., **DV**, **SP**, **HP**, **ROF**, **STAT**).
- Tables are in Markdown pipe format and are **not truncated** — they contain complete data.
- Files cross-reference each other in `Related Files` sections at the bottom.

---

## File Map — What to Read for What

### RESOLUTION AND CORE MECHANICS

**`core-resolution-and-skills.md`** — Start here for any question about how the game fundamentally works.
- The 10 STATs (INT, REF, DEX, TECH, COOL, WILL, LUCK, MOVE, BODY, EMP) and what they do
- STAT generation methods (Streetrat/Edgerunner/Complete Package)
- Derived stats: HP formula, Humanity, Death Save
- **Skill Check resolution**: STAT + Skill + 1d10 vs. DV (or vs. opponent's roll)
- Opposed Checks vs. DV-based Checks
- The DV table (9 Simple → 29 Legendary)
- Critical Success and Critical Failure rules
- Negative modifiers, Complementary Skills, Taking Extra Time
- LUCK spending rules
- The **complete Master Skill List** with every Skill, its linked STAT, and category
- Initiative and Turn structure (Move Action + Action)
- Actions in Brief table (what you can do on your turn)
- Reputation and Facedown mechanics

### COMBAT — RANGED

**`ranged-combat.md`** — Read for any question about guns, shooting, or ranged attacks.
- Ranged attack formula: REF + Relevant Skill + 1d10 vs. Range DV
- **Ranged Weapons Table**: all 11 weapon types with damage, ROF, magazine, and cost
- **Single Shot DVs by Range**: the full 8-range × 8-weapon-type DV matrix
- Rate of Fire (ROF) and Split Movement
- Aimed Shots (+1 to damage to specific hit location)
- **Autofire** mechanics and Autofire DV table
- **Suppressive Fire** (area denial)
- Shotgun shells, Arrows, Explosives, Grenades
- Weapon Attachments and Special Ammunition
- Exotic Weapons (summary — full table in `gear-and-economy.md`)
- Draw/Drop/Stow/Reload actions
- Dodging ranged attacks (REF 8+ required)
- Prone rules, Vehicle ranged combat

### COMBAT — MELEE

**`melee-and-brawling.md`** — Read for any question about hand-to-hand, melee weapons, or grappling.
- Melee Weapons Table (Light/Medium/Heavy/Very Heavy with damage dice)
- Melee resolution: DEX + Melee Weapon + 1d10 vs. DEX + Evasion + 1d10
- **Armor halving rule** for melee (halve SP, round up)
- Brawling damage by BODY (Cyberarm exception)
- Grab/Grapple/Choke/Throw rules
- All 4 **Martial Arts Forms** (Aikido, Karate, Judo, Taekwondo) with each form's 2 unique Special Moves
- Relevant cyberware cross-references

### DAMAGE, ARMOR, WOUNDS, AND HEALING

**`damage-and-healing.md`** — Read for any question about taking damage, armor, wound states, dying, critical injuries, healing, or environmental hazards.
- Damage resolution steps (weapon damage → subtract SP → apply to HP)
- **Armor Table** (8 armor types with SP, penalties, and cost)
- Armor stacking, ablation, and penalty rules
- **Wound States**: Not Wounded → Lightly Wounded → Seriously Wounded (-2 all) → Mortally Wounded (unconscious, Death Save)
- **Death Saves**: roll BODY + 1d10 vs. DV (increases each turn)
- **Critical Injuries to Body** table (11 entries with Quick Fix and Treatment)
- **Critical Injuries to Head** table (11 entries with Quick Fix and Treatment)
- Cover HP table with 25+ material examples
- Shields and Human Shields
- **Environmental damage**: Fire, Drowning, Electrocution, Exposure, Falling, Poison, Drugs, Radiation
- Stabilization mechanics, Natural Healing rates
- Quick Fix vs. Treatment distinction
- First Aid, Paramedic, and Surgery Skill comparison
- Trauma Team (service plans, stats, arrival mechanics)
- Hospital costs, Bodybank/replacement parts
- Installation Surgery DVs
- Therapy and Humanity recovery

### ROLES AND ABILITIES

**`roles-and-abilities.md`** — Read for any question about what a specific Role can do, or Role Ability rank progression.
- Multiclassing rules
- All 10 Role Abilities with **complete rank-by-rank progression tables**:
  - **Rockerboy** — Charismatic Impact (Fan mechanics, venue/crowd scaling)
  - **Solo** — Combat Awareness (6 allocatable sub-abilities: Damage Deflection, Fumble Recovery, Initiative Reaction, Precision Attack, Spot Weakness, Threat Detection)
  - **Netrunner** — Interface (NET Actions per Turn table, Interface Abilities summary)
  - **Tech** — Maker (4 specialties: Field, Upgrade, Fabrication, Invention; DV/Time table)
  - **Medtech** — Medicine (Surgery, Pharmaceuticals with 5 drugs, Cryosystem Operation with 5 levels)
  - **Media** — Credibility (Rumors, Publishing; Believability/Impact by rank)
  - **Exec** — Teamwork (Housing, Insurance, Team Members with Loyalty system, 5 Team Member types)
  - **Lawman** — Backup (calling mechanics, 6 tiers with Combat Numbers/SP/HP/equipment)
  - **Fixer** — Operator (Haggle mechanic, Reach/Grease/Contacts by rank)
  - **Nomad** — Moto (Vehicle Familiarity, Family Motorpool, complete Vehicle Upgrades tables for all vehicle categories)

### CYBERWARE

**`cyberware.md`** — Read for any question about cybernetic implants, installation, or Humanity Loss.
- Installation levels (Mall/Clinic/Hospital) with Surgery DVs
- Humanity Loss rules and Cyberpsychosis threshold
- Complete item tables for all 8 categories:
  - Fashionware (7 items)
  - Neuralware (6 items + 6 chipware)
  - Cyberoptics (13 items)
  - Cyberaudio (12 items)
  - Internal Cyberware (13 items)
  - External Cyberware (4 items)
  - Cyberlimbs — Cyberarm (18 options), Cyberleg (7 options), 4 accessories
  - Borgware (5 items)
- Starting Cyberware by Role table

### NETRUNNING

**`netrunning.md`** — Read for any question about hacking, the NET, programs, Black ICE, cyberdecks, or NET architecture.
- Prerequisites for Netrunning
- Meat Actions vs. NET Actions
- NET Actions per Turn by Interface rank
- All NET Actions listed
- All 9 **Interface Abilities** (Scanner, Backdoor, Cloak, Control, Eye-Dee, Pathfinder, Slide, Virus, Zap)
- NET Combat formula
- All **Programs**: 4 Booster, 3 Defender, 8 Attacker
- All **Black ICE**: 9 Anti-Personnel, 3 Anti-Program
- Cyberdeck Hardware (6 items + 2 upgrades)
- NET Architecture structure, Difficulty Ratings, building rules (3 steps)
- Lobby Table (1d6), Body Table (3d6 × 4 difficulties)
- Demons (3 types with stats)
- All Defense types: Active (5), Emplaced (3), Environmental (5)

### VEHICLES

**`vehicles-and-chases.md`** — Read for any question about vehicles, driving, or vehicular combat.
- Vehicle tables: all Land (5), Sea (4), and Air (5) vehicles with SDP, Seats, Combat Speed, Narrative Speed, Cost
- SDP rules (destruction at 0, no dodge, glass has no HP)
- Aiming for weak points (-8 penalty, ×2 damage)
- Starting, stopping, Interface Plugs, hands-on-wheel rules
- Basic Driving (REF + Control Skill threshold)
- Maneuver DV table (7 maneuvers)
- Losing Control, Ramming (6d6 + Whiplash), Dodging a ram
- Cross-reference to Nomad Vehicle Upgrades in `roles-and-abilities.md`

### GEAR, ECONOMY, AND LIFESTYLE

**`gear-and-economy.md`** — Read for any question about buying things, item costs, equipment, drugs, housing, or money.
- **Price Categories** table (Cheap 10eb → Super Luxury 10,000eb+)
- Availability rule (Expensive+ requires a Fixer)
- Job pay table (Easy/Typical/Dangerous)
- Hustle tables by Role and Rank
- **Master Armor List** (8 types with SP, penalties, cost)
- **Master Gear List** (50+ items with costs and mechanical effects)
- **Exotic Weapons** table (12 weapons with unique rules)
- **Street Drugs** table (5 drugs with primary/secondary effects, addiction DV)
- Services and Entertainment price list
- **Lifestyle** table (Kibble/Generic Prepak/Good Prepak/Fresh Food)
- **Housing** table (Street → McMansion, rent and buy prices)
- Sleep and fatigue rules
- Fashion style price table
- Starting gear by creation method

### CHARACTER CREATION AND LIFEPATH

**`character-creation-and-lifepath.md`** — Read for any question about making a new character or the Lifepath backstory system.
- Three creation methods (Streetrat/Edgerunner/Complete Package) and step-by-step flows
- The 10 Roles summarized
- **Complete Lifepath tables**: Cultural Origins, Personality, Clothing Style, Hairstyle, Affectation, Values, Feelings About People, Valued Person, Valued Possession
- Background tables: Family, Childhood Environment, Family Crisis
- Friends, Enemies, and Tragic Love Affairs (with sub-tables for type, cause, resources, revenge)
- Life Goals table
- Role-Based Lifepath overview (which pages for each Role)
- STATs generation for all 3 methods
- Derived Statistics (HP, Seriously Wounded, Death Save, Humanity)
- Skills at creation (rules per method)
- Starting gear and money per method
- Starting housing and lifestyle

### GM TOOLS — ENCOUNTERS AND ADVENTURE BUILDING

**`gm-tools-and-encounters.md`** — Read for any question about running the game, building encounters, NPC stats, or random encounters.
- **Adversary tier system**: Mook (1:1), Lieutenant (1:2), Mini Boss (1:3), Cyberpsycho (boss)
- Encounter scaling guidelines
- **7 complete NPC stat blocks** with full STATs, HP, armor, weapons, skill bases, cyberware:
  - Mooks: Bodyguard, Boosterganger, Road Ganger, Security Operative
  - Lieutenants: Netrunner, Reclaimer Chief, Security Officer
  - Mini Bosses: Outrider, Pyro
  - Boss: Cyberpsycho
- **d100 Encounter Tables** for Daytime, Evening, and Midnight (each with 15-20 entries)
- Zone Threat Rating guidelines (Corporate/Moderate/Combat/Hot/Executive)
- **Beat Chart adventure system**: Hooks, Cliffhangers, Developments, Climaxes, Resolutions — all types listed
- Caper Crew role descriptions (Mastermind, Runner, Tech, Medtech, Ninja, Face, Driver, Muscle, Killer, Scrounger)

### IMPROVEMENT POINTS (LEVELING UP)

**`improvement-points.md`** — Read for any question about XP, leveling, or character advancement.
- 4 Playstyle types (Warrior, Socializer, Explorer, Roleplayer)
- **Full I.P. earning table** (10-80 I.P. across 5 columns: Group, Warrior, Socializer, Explorer, Roleplayer)
- **I.P. spending tables**: Typical Skill, Difficult (×2) Skill, Role Ability
- Cumulative I.P. cost reference (total cost to reach any Level/Rank from 0)
- Rule: cannot skip Levels/Ranks

### QUICK REFERENCE

**`quick-reference-index.md`** — A condensed lookup table. Read for a quick pointer to where something lives, but prefer the full topical file for complete rules.
- File directory with topic summaries
- "How do I...?" lookup table (30+ common questions → file + section)
- Key formulas (Skill Check, Ranged Attack, Melee, Damage, HP, Humanity, Initiative, NET combat)
- DV reference table
- Wound State quick reference
- Armor SP quick reference

---

## Routing Guide — When a User Asks About...

Use this to decide which file(s) to consult:

| User is asking about... | Primary file | Also check |
|---|---|---|
| How to make a check / roll dice | `core-resolution-and-skills.md` | |
| A specific Skill | `core-resolution-and-skills.md` (Master Skill List) | |
| Initiative / turn order | `core-resolution-and-skills.md` | |
| What they can do on their turn | `core-resolution-and-skills.md` (Actions in Brief) | |
| Shooting / guns / ranged weapons | `ranged-combat.md` | `gear-and-economy.md` (Exotic Weapons) |
| Autofire / suppressive fire | `ranged-combat.md` | |
| Grenades / explosives | `ranged-combat.md` | |
| Melee / punching / kicking | `melee-and-brawling.md` | |
| Martial arts | `melee-and-brawling.md` | |
| Grappling / choking / throwing | `melee-and-brawling.md` | |
| Damage / how much HP they lose | `damage-and-healing.md` | |
| Armor / SP / ablation | `damage-and-healing.md` | `gear-and-economy.md` (Armor List) |
| Wound states / Seriously Wounded | `damage-and-healing.md` | |
| Death / dying / Death Saves | `damage-and-healing.md` | |
| Critical injuries | `damage-and-healing.md` | |
| Healing / stabilization / first aid | `damage-and-healing.md` | |
| Trauma Team | `damage-and-healing.md` | `gear-and-economy.md` (service costs) |
| Fire / drowning / falling / poison | `damage-and-healing.md` | |
| Cover / hiding behind things | `damage-and-healing.md` | |
| What a Role can do / Role Abilities | `roles-and-abilities.md` | |
| Rockerboy / Solo / Netrunner / Tech / Medtech / Media / Exec / Lawman / Fixer / Nomad | `roles-and-abilities.md` | |
| Multiclassing / changing Roles | `roles-and-abilities.md` | |
| Cyberware / implants | `cyberware.md` | `roles-and-abilities.md` (starting cyberware) |
| Humanity / Cyberpsychosis | `cyberware.md` | `damage-and-healing.md` (Therapy) |
| Hacking / the NET / Netrunning | `netrunning.md` | `roles-and-abilities.md` (Interface rank table) |
| Programs / Black ICE / Cyberdecks | `netrunning.md` | |
| NET Architecture | `netrunning.md` | |
| Vehicles / driving / chases | `vehicles-and-chases.md` | `roles-and-abilities.md` (Nomad upgrades) |
| Ramming / vehicular combat | `vehicles-and-chases.md` | |
| Buying gear / item prices | `gear-and-economy.md` | |
| Night Markets / Fixers | `gear-and-economy.md` | `roles-and-abilities.md` (Fixer: Operator) |
| Drugs / addiction | `gear-and-economy.md` | `damage-and-healing.md` (drug damage) |
| Housing / rent / lifestyle | `gear-and-economy.md` | |
| Making money / hustling | `gear-and-economy.md` | |
| Fashion / clothing styles | `gear-and-economy.md` | `character-creation-and-lifepath.md` |
| Creating a character | `character-creation-and-lifepath.md` | `core-resolution-and-skills.md` (STATs/Skills) |
| Lifepath / backstory | `character-creation-and-lifepath.md` | |
| Starting gear / starting money | `character-creation-and-lifepath.md` | `gear-and-economy.md` |
| XP / leveling up / improvement | `improvement-points.md` | |
| I.P. costs for Skills or Roles | `improvement-points.md` | |
| NPC stats / enemy stat blocks | `gm-tools-and-encounters.md` | |
| Building encounters / balancing fights | `gm-tools-and-encounters.md` | |
| Random encounters | `gm-tools-and-encounters.md` | |
| Adventure structure / Beat Charts | `gm-tools-and-encounters.md` | |
| Reputation / Facedowns | `core-resolution-and-skills.md` | |

---

## Important Caveats

1. **This is a synthesized reference**, not the complete rulebook. It covers the mechanical systems comprehensively but does not include lore chapters, fiction, Night City location descriptions, gang lore, or the full text of GM advice sections.
2. **Tables are complete** — if a table exists in a file, it has all rows from the source material. Do not assume data is missing.
3. **Page numbers** reference the original Cyberpunk RED core rulebook (R. Talsorian Games, 2020). Use them to direct users to the source for exact wording if disputes arise.
4. **Cross-references between files are intentional**. Some mechanics span multiple files (e.g., armor appears in both `damage-and-healing.md` and `gear-and-economy.md`). The damage file has the mechanical rules; the gear file has the shopping list. Follow cross-references when a question touches multiple systems.
5. When a user asks a question, **read the relevant file(s) first** before answering. Do not guess from memory — the tables and specifics in these files are precise.
