/* $Id: SRD35.js,v 1.63 2006/12/15 06:01:42 Jim Exp $ */

/*
Copyright 2005, James J. Hayes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA.
*/

/*
 * This module loads the rules from the Player's Handbook v3.5 Edition.
 * The PH35 function contains methods that load rules for particular
 * parts/chapters of the PH; raceRules for character races, magicRules for
 * spells, etc.  Any of these member methods can be set to null or overridden
 * before calling PH35 in order to use a subset of the PH v3.5 rules.
 * Similarly, the constant fields of PH35--ALIGNMENTS, FEATS, etc.--can be
 * manipulated in order to trim the choices offered.
 */
function PH35() {
  var rules = new ScribeRules('Core v3.5');
  if(PH35.createViewer != null) {
    PH35.viewer = new ObjectViewer();
    PH35.createViewer(PH35.viewer);
    rules.defineViewer("Standard", PH35.viewer);
  }
  if(PH35.abilityRules != null) PH35.abilityRules(rules);
  if(PH35.raceRules != null) PH35.raceRules(rules);
  if(PH35.classRules != null) PH35.classRules(rules);
  if(PH35.skillRules != null) PH35.skillRules(rules);
  if(PH35.featRules != null) PH35.featRules(rules);
  if(PH35.descriptionRules != null) PH35.descriptionRules(rules);
  if(PH35.equipmentRules != null) PH35.equipmentRules(rules);
  if(PH35.combatRules != null) PH35.combatRules(rules);
  if(PH35.adventuringRules != null) PH35.adventuringRules(rules);
  if(PH35.magicRules != null) PH35.magicRules(rules);
  rules.defineChoice('random', PH35.RANDOMIZABLE_ATTRIBUTES);
  // A rule for handling DM-only information
  rules.defineRule('dmNotes', 'dmonly', '?', null);
  rules.randomizeAllAttributes = PH35.randomizeAllAttributes;
  rules.randomizeOneAttribute = PH35.randomizeOneAttribute;
  Scribe.addRuleSet(rules);
  PH35.rules = rules;
}

// JavaScript expressions for several (mostly class-based) attributes.
PH35.ATTACK_BONUS_GOOD = 'source';
PH35.ATTACK_BONUS_AVERAGE = 'source - Math.floor((source + 3) / 4)';
PH35.ATTACK_BONUS_POOR = 'Math.floor(source / 2)'
PH35.PROFICIENCY_HEAVY = '3';
PH35.PROFICIENCY_LIGHT = '1';
PH35.PROFICIENCY_MEDIUM = '2';
PH35.PROFICIENCY_NONE = '0';
PH35.PROFICIENCY_TOWER = '4';
PH35.SAVE_BONUS_GOOD = '2 + Math.floor(source / 2)';
PH35.SAVE_BONUS_POOR = 'Math.floor(source / 3)';

// Arrays of choices passed to Scribe.
PH35.ALIGNMENTS = [
  'Chaotic Evil', 'Chaotic Good', 'Chaotic Neutral', 'Neutral', 'Neutral Evil',
  'Neutral Good', 'Lawful Evil', 'Lawful Good', 'Lawful Neutral'
];
PH35.ARMORS = [
  'None', 'Padded', 'Leather', 'Studded Leather', 'Chain Shirt', 'Hide',
  'Scale Mail', 'Chainmail', 'Breastplate', 'Splint Mail', 'Banded Mail',
  'Half Plate', 'Full Plate'
];
PH35.CLASSES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin',
  'Ranger', 'Rogue', 'Sorcerer', 'Wizard'
];
PH35.DEITIES = [
  'Boccob (N Magic):Knowledge/Magic/Trickery',
  'Corellon Larethian (CG Elves):Chaos/Good/Protection/War',
  'Ehlonna (NG Woodlands):Animal/Good/Plant/Sun',
  'Erythnul (CE Slaughter):Chaos/Evil/Trickery/War',
  'Fharlanghn (N Roads):Luck/Protection/Travel',
  'Garl Glittergold (NG Gnomes):Good/Protection/Trickery',
  'Gruumsh (CE Orcs):Chaos/Evil/Strength/War',
  'Heironeous (LG Valor):Good/Law/War',
  'Hextor (LE Tyranny):Destruction/Evil/Law/War',
  'Kord (CG Strength):Chaos/Good/Luck/Strength',
  'Moradin (LG Dwarves):Earth/Good/Law/Protection',
  'Nerull (NE Death):Death/Evil/Trickery',
  'Obad-Hai (N Nature):Air/Animal/Earth/Fire/Plant/Water',
  'Olidammara (CN Thieves):Chaos/Luck/Trickery',
  'Pelor (NG Sun):Good/Healing/Strength/Sun',
  'St. Cuthbert (LN Retribution):Destruction/Law/Protection/Strength',
  'Wee Jas (LN Death And Magic):Death/Law/Magic',
  'Yondalla (LG Halflings):Good/Law/Protection',
  'Vecna (NE Secrets):Evil/Knowledge/Magic'
];
PH35.DOMAINS = [
  'Air', 'Animal', 'Chaos', 'Death', 'Destruction', 'Earth', 'Evil', 'Fire',
  'Good', 'Healing', 'Knowledge', 'Law', 'Luck', 'Magic', 'Plant',
  'Protection', 'Strength', 'Sun', 'Travel', 'Trickery', 'War', 'Water'
];
PH35.FEATS = [
  'Acrobatic', 'Agile', 'Alertness', 'Animal Affinity',
  'Armor Proficiency Heavy', 'Armor Proficiency Light',
  'Armor Proficiency Medium', 'Athletic', 'Augment Summoning', 'Blind Fight',
  'Brew Potion', 'Cleave', 'Combat Casting', 'Combat Expertise',
  'Combat Reflexes', 'Craft Magic Arms And Armor', 'Craft Rod', 'Craft Staff',
  'Craft Wand', 'Craft Wondrous Item', 'Deceitful', 'Deflect Arrows',
  'Deft Hands', 'Diehard', 'Diligent', 'Dodge', 'Empower Spell', 'Endurance',
  'Enlarge Spell', 'Eschew Materials', 'Extend Spell', 'Extra Turning',
  'Far Shot', 'Forge Ring', 'Great Cleave', 'Great Fortitude',
  'Greater Spell Penetration', 'Greater Two Weapon Fighting', 'Heighten Spell',
  'Improved Bull Rush', 'Improved Counterspell', 'Improved Disarm',
  'Improved Feint', 'Improved Grapple', 'Improved Initiative',
  'Improved Overrun', 'Improved Precise Shot', 'Improved Shield Bash',
  'Improved Sunder', 'Improved Trip', 'Improved Turning',
  'Improved Two Weapon Fighting', 'Improved Unarmed Strike', 'Investigator',
  'Iron Will', 'Leadership', 'Lightning Reflexes', 'Magical Aptitude',
  'Manyshot', 'Maximize Spell', 'Mobility', 'Mounted Archery',
  'Mounted Combat', 'Natural Spell', 'Negotiator', 'Nimble Fingers',
  'Persuasive', 'Point Blank Shot', 'Power Attack', 'Precise Shot',
  'Quick Draw', 'Quicken Spell', 'Rapid Reload', 'Rapid Shot',
  'Ride By Attack', 'Run', 'Scribe Scroll', 'Self Sufficient',
  'Shield Proficiency', 'Shield Proficiency Tower', 'Shot On The Run',
  'Silent Spell', 'Snatch Arrows', 'Spell Penetration', 'Spirited Charge',
  'Spring Attack', 'Stealthy', 'Still Spell', 'Stunning Fist', 'Toughness',
  'Track', 'Trample', 'Two Weapon Defense', 'Two Weapon Fighting',
  'Weapon Finesse', 'Weapon Proficiency Simple', 'Whirlwind Attack',
  'Widen Spell'
];
PH35.GENDERS = ['Female', 'Male'];
PH35.GOODIES = [
  'Ring Of Protection +1',
  'Ring Of Protection +2',
  'Ring Of Protection +3',
  'Ring Of Protection +4'
];
PH35.LANGUAGES = [
  'Abyssal', 'Aquan', 'Avian', 'Celestial', 'Common', 'Draconic', 'Druidic',
  'Dwarven', 'Elven', 'Giant', 'Gnoll', 'Gnome', 'Goblin', 'Halfling',
  'Ignan', 'Infernal', 'Orc', 'Sylvan', 'Terran', 'Undercommon'
];
PH35.RACES =
  ['Dwarf', 'Elf', 'Gnome', 'Half Elf', 'Half Orc', 'Halfling', 'Human'];
// Note: the order here handles dependencies among attributes when generating
// random characters
PH35.RANDOMIZABLE_ATTRIBUTES = [
  'charisma', 'constitution', 'dexterity', 'intelligence', 'strength', 'wisdom',
  'name', 'race', 'gender', 'alignment', 'deity', 'levels', 'features', 'feats',
  'skills', 'languages', 'hitPoints', 'armor', 'shield', 'weapons', 'spells'
];
PH35.SCHOOLS = [
  'Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation',
  'Illusion', 'Necromancy', 'Transmutation'
];
PH35.SHIELDS = [
  'Buckler', 'Heavy Steel', 'Heavy Wooden', 'Light Steel', 'Light Wooden',
  'None', 'Tower'
];
PH35.SKILLS = [
  'Appraise:int', 'Balance:dex', 'Bluff:cha', 'Climb:str', 'Concentration:con',
  'Decipher Script:int/trained', 'Diplomacy:cha', 'Disable Device:int/trained',
  'Disguise:cha', 'Escape Artist:dex', 'Forgery:int', 'Gather Information:cha',
  'Handle Animal:cha/trained', 'Heal:wis', 'Hide:dex', 'Intimidate:cha',
  'Jump:str', 'Knowledge (Arcana):int/trained',
  'Knowledge (Dungeoneering):int/trained',
  'Knowledge (Engineering):int/trained', 'Knowledge (Geography):int/trained',
  'Knowledge (History):int/trained', 'Knowledge (Local):int/trained',
  'Knowledge (Nature):int/trained', 'Knowledge (Nobility):int/trained',
  'Knowledge (Planes):int/trained', 'Knowledge (Religion):int/trained',
  'Listen:wis', 'Move Silently:dex', 'Open Lock:dex/trained',
  'Perform (Act):cha', 'Perform (Comedy):cha', 'Perform (Dance):cha',
  'Perform (Keyboard):cha', 'Perform (Oratory):cha', 'Perform (Percussion):cha',
  'Perform (Sing):cha', 'Perform (String):cha', 'Perform (Wind):cha',
  'Ride:dex', 'Search:int', 'Sense Motive:wis', 'Sleight Of Hand:dex/trained',
  'Speak Language:/trained', 'Spellcraft:int/trained', 'Spot:wis',
  'Survival:wis', 'Swim:str', 'Tumble:dex/trained',
  'Use Magic Device:cha/trained', 'Use Rope:dex'
];
PH35.SPELLS = [
  'Acid Fog:W6/Wa7/Conjuration',
  'Acid Splash:W0/Conjuration',
  'Aid:C2/Go2/Lu2/Enchantment',
  'Air Walk:Ai4/C4/D4/Transmutation',
  'Alarm:B1/R1/W1/Abjuration',
  'Align Weapon:C2/Transmutation',
  'Alter Self:B2/W2/Transmutation',
  'Analyze Dweomer:B6/W6/Divination',
  'Animal Growth:D5/R4/W5/Transmutation',
  'Animal Messenger:B2/D2/R1/Enchantment',
  'Animal Shapes:An7/D8/Transmutation',
  'Animal Trance:B2/D2/Enchantment',
  'Animate Dead:C3/De3/W4/Necromancy',
  'Animate Objects:B6/C6/Ch6/Transmutation',
  'Animate Plants:D7/Pl7/Transmutation',
  'Animate Rope:B1/W1/Transmutation',
  'Antilife Shell:An6/C6/D6/Abjuration',
  'Antimagic Field:C8/Ma6/Pr6/W6/Abjuration',
  'Antipathy:D9/W8/Enchantment',
  'Antiplant Shell:D4/Abjuration',
  'Arcane Eye:W4/Divination',
  'Arcane Lock:W2/Abjuration',
  'Arcane Mark:W0/Universal',
  'Arcane Sight:W3/Divination',
  'Astral Projection:C9/Tl9/W9/Necromancy',
  'Atonement:C5/D5/Abjuration',
  'Augury:C2/Divination',
  'Awaken:D5/Transmutation',
  'Baleful Polymorph:D5/W5/Transmutation',
  'Bane:C1/Enchantment',
  'Banishment:C6/W7/Abjuration',
  'Barkskin:D2/Pl2/R2/Transmutation',
  'Bear\'s Endurance:C2/D2/R2/W2/Transmutation',
  'Bestow Curse:C3/W4/Necromancy',
  'Bigby\'s Clenched Fist:St8/W8/Evocation',
  'Bigby\'s Crushing Hand:St9/W9/Evocation',
  'Bigby\'s Forceful Hand:W6/Evocation',
  'Bigby\'s Grasping Hand:St7/W7/Evocation',
  'Bigby\'s Interposing Hand:W5/Evocation',
  'Binding:W8/Enchantment',
  'Blade Barrier:C6/Go6/Wr6/Evocation',
  'Blasphemy:C7/Ev7/Evocation',
  'Bless:C1/P1/Enchantment',
  'Bless Water:C1/P1/Transmutation',
  'Bless Weapon:P1/Transmutation',
  'Blight:D4/W5/Necromancy',
  'Blindness/Deafness:B2/C3/W2/Necromancy',
  'Blink:B3/W3/Transmutation',
  'Blur:B2/W2/Illusion',
  'Break Enchantment:B4/C5/Lu5/P4/W5/Abjuration',
  'Bull\'s Strength:C2/D2/P2/St2/W2/Transmutation',
  'Burning Hands:Fi1/W1/Evocation',
  'Call Lightning:D3/Evocation',
  'Call Lightning Storm:D5/Evocation',
  'Calm Animals:An1/D1/R1/Enchantment',
  'Calm Emotions:B2/C2/La2/Enchantment',
  'Cat\'s Grace:B2/D2/R2/W2/Transmutation',
  'Cause Fear:B1/C1/De1/W1/Necromancy',
  'Chain Lightning:Ai6/W6/Evocation',
  'Changestaff:D7/Transmutation',
  'Chaos Hammer:Ch4/Evocation',
  'Charm Animal:D1/R1/Enchantment',
  'Charm Monster:B3/W4/Enchantment',
  'Charm Person:B1/W1/Enchantment',
  'Chill Metal:D2/Transmutation',
  'Chill Touch:W1/Necromancy',
  'Circle Of Death:W6/Necromancy',
  'Clairaudience/Clairvoyance:B3/Kn3/W3/Divination',
  'Cloak Of Chaos:C8/Ch8/Abjuration',
  'Clone:W8/Necromancy',
  'Cloudkill:W5/Conjuration',
  'Color Spray:W1/Illusion',
  'Command:C1/Enchantment',
  'Command Plants:D4/Pl4/R3/Transmutation',
  'Command Undead:W2/Necromancy',
  'Commune:C5/Divination',
  'Commune With Nature:An5/D5/R4/Divination',
  'Comprehend Languages:B1/C1/W1/Divination',
  'Cone Of Cold:W5/Wa6/Evocation',
  'Confusion:B3/Ty4/W4/Enchantment',
  'Consecrate:C2/Evocation',
  'Contact Other Plane:W5/Divination',
  'Contagion:C3/Dn3/D3/W4/Necromancy',
  'Contingency:W6/Evocation',
  'Continual Flame:C3/W2/Evocation',
  'Control Plants:D8/Pl8/Transmutation',
  'Control Undead:W7/Necromancy',
  'Control Water:C4/D4/W6/Wa4/Transmutation',
  'Control Weather:Ai7/C7/D7/W7/Transmutation',
  'Control Winds:Ai5/D5/Transmutation',
  'Create Food And Water:C3/Conjuration',
  'Create Greater Undead:C8/De8/W8/Necromancy',
  'Create Undead:C6/De6/Ev6/W6/Necromancy',
  'Create Water:C0/D0/P1/Conjuration',
  'Creeping Doom:D7/Conjuration',
  'Crushing Despair:B3/W4/Enchantment',
  'Cure Critical Wounds:B4/C4/D5/He4/Conjuration',
  'Cure Light Wounds:B1/C1/D1/He1/P1/R2/Conjuration',
  'Cure Minor Wounds:C0/D0/Conjuration',
  'Cure Moderate Wounds:B2/C2/D3/He2/P3/R3/Conjuration',
  'Cure Serious Wounds:B3/C3/D4/He3/P4/R4/Conjuration',
  'Curse Water:C1/Necromancy',
  'Dancing Lights:B0/W0/Evocation',
  'Darkness:B2/C2/W2/Evocation',
  'Darkvision:R3/W2/Transmutation',
  'Daylight:B3/C3/D3/P3/W3/Evocation',
  'Daze:B0/W0/Enchantment',
  'Daze Monster:B2/W2/Enchantment',
  'Death Knell:C2/De2/Necromancy',
  'Death Ward:C4/De4/D5/P4/Necromancy',
  'Deathwatch:C1/Necromancy',
  'Deep Slumber:B3/W3/Enchantment',
  'Deeper Darkness:C3/Evocation',
  'Delay Poison:B2/C2/D2/P2/R1/Conjuration',
  'Delayed Blast Fireball:W7/Evocation',
  'Demand:W8/Enchantment',
  'Desecrate:C2/Ev2/Evocation',
  'Destruction:C7/De7/Necromancy',
  'Detect Animals Or Plants:D1/R1/Divination',
  'Detect Chaos:C1/Divination',
  'Detect Evil:C1/Divination',
  'Detect Good:C1/Divination',
  'Detect Law:C1/Divination',
  'Detect Magic:B0/C0/D0/W0/Divination',
  'Detect Poison:C0/D0/P1/R1/W0/Divination',
  'Detect Scrying:B4/W4/Divination',
  'Detect Secret Doors:B1/Kn1/W1/Divination',
  'Detect Snares And Pits:D1/R1/Divination',
  'Detect Thoughts:B2/Kn2/W2/Divination',
  'Detect Undead:C1/P1/W1/Divination',
  'Dictum:C7/La7/Evocation',
  'Dimension Door:B4/Tl4/W4/Conjuration',
  'Dimensional Anchor:C4/W4/Abjuration',
  'Dimensional Lock:C8/W8/Abjuration',
  'Diminish Plants:D3/R3/Transmutation',
  'Discern Lies:C4/P3/Divination',
  'Discern Location:C8/Kn8/W8/Divination',
  'Disguise Self:B1/Ty1/W1/Illusion',
  'Disintegrate:Dn7/W6/Transmutation',
  'Dismissal:C4/W5/Abjuration',
  'Dispel Chaos:C5/La5/P4/Abjuration',
  'Dispel Evil:C5/Go5/P4/Abjuration',
  'Dispel Good:C5/Ev5/Abjuration',
  'Dispel Law:C5/Ch5/Abjuration',
  'Dispel Magic:B3/C3/D4/Ma3/P3/W3/Abjuration',
  'Displacement:B3/W3/Illusion',
  'Disrupt Undead:W0/Necromancy',
  'Disrupting Weapon:C5/Transmutation',
  'Divination:C4/Kn4/Divination',
  'Divine Favor:C1/P1/Evocation',
  'Divine Power:C4/Wr4/Evocation',
  'Dominate Animal:An3/D3/Enchantment',
  'Dominate Monster:W9/Enchantment',
  'Dominate Person:B4/W5/Enchantment',
  'Doom:C1/Necromancy',
  'Drawmij\'s Instant Summons:W7/Conjuration',
  'Dream:B5/W5/Illusion',
  'Eagle\'s Splendor:B2/C2/P2/W2/Transmutation',
  'Earthquake:C8/Dn8/D8/Ea7/Evocation',
  'Elemental Swarm:Ai9/D9/Ea9/Fi9/Wa9/Conjuration',
  'Endure Elements:C1/D1/P1/R1/Su1/W1/Abjuration',
  'Energy Drain:C9/W9/Necromancy',
  'Enervation:W4/Necromancy',
  'Enlarge Person:St1/W1/Transmutation',
  'Entangle:D1/Pl1/R1/Transmutation',
  'Enthrall:B2/C2/Enchantment',
  'Entropic Shield:C1/Lu1/Abjuration',
  'Erase:B1/W1/Transmutation',
  'Ethereal Jaunt:C7/W7/Transmutation',
  'Etherealness:C9/W9/Transmutation',
  'Evard\'s Black Tentacles:W4/Conjuration',
  'Expeditious Retreat:B1/W1/Transmutation',
  'Explosive Runes:W3/Abjuration',
  'Eyebite:B6/W6/Necromancy',
  'Fabricate:W5/Transmutation',
  'Faerie Fire:D1/Evocation',
  'False Life:W2/Necromancy',
  'False Vision:B5/Ty5/W5/Illusion',
  'Fear:B3/W4/Necromancy',
  'Feather Fall:B1/W1/Transmutation',
  'Feeblemind:W5/Enchantment',
  'Find The Path:B6/C6/D6/Kn6/Tl6/Divination',
  'Find Traps:C2/Divination',
  'Finger Of Death:D8/W7/Necromancy',
  'Fire Seeds:D6/Fi6/Su6/Conjuration',
  'Fire Shield:Fi5/Su4/W4/Evocation',
  'Fire Storm:C8/D7/Fi7/Evocation',
  'Fire Trap:D2/W4/Abjuration',
  'Fireball:W3/Evocation',
  'Flame Arrow:W3/Transmutation',
  'Flame Blade:D2/Evocation',
  'Flame Strike:C5/D4/Su5/Wr5/Evocation',
  'Flaming Sphere:D2/W2/Evocation',
  'Flare:B0/D0/W0/Evocation',
  'Flesh To Stone:W6/Transmutation',
  'Fly:Tl3/W3/Transmutation',
  'Fog Cloud:D2/W2/Wa2/Conjuration',
  'Forbiddance:C6/Abjuration',
  'Forcecage:W7/Evocation',
  'Foresight:D9/Kn9/W9/Divination',
  'Fox\'s Cunning:B2/W2/Transmutation',
  'Freedom:W9/Abjuration',
  'Freedom Of Movement:B4/C4/D4/Lu4/R4/Abjuration',
  'Gaseous Form:Ai3/B3/W3/Transmutation',
  'Gate:C9/W9/Conjuration',
  'Geas/Quest:B6/C6/W6/Enchantment',
  'Gentle Repose:C2/W3/Necromancy',
  'Ghost Sound:B0/W0/Illusion',
  'Ghoul Touch:W2/Necromancy',
  'Giant Vermin:C4/D4/Transmutation',
  'Glibness:B3/Transmutation',
  'Glitterdust:B2/W2/Conjuration',
  'Globe Of Invulnerability:W6/Abjuration',
  'Glyph Of Warding:C3/Abjuration',
  'Good Hope:B3/Enchantment',
  'Goodberry:D1/Transmutation',
  'Grease:B1/W1/Conjuration',
  'Greater Arcane Sight:W7/Divination',
  'Greater Command:C5/Enchantment',
  'Greater Dispel Magic:B5/C6/D6/W6/Abjuration',
  'Greater Glyph Of Warding:C6/Abjuration',
  'Greater Heroism:B5/W6/Enchantment',
  'Greater Invisibility:B4/W4/Illusion',
  'Greater Magic Fang:D3/R3/Transmutation',
  'Greater Magic Weapon:C4/P3/W3/Transmutation',
  'Greater Planar Ally:C8/Conjuration',
  'Greater Planar Binding:W8/Conjuration',
  'Greater Prying Eyes:W8/Divination',
  'Greater Restoration:C7/Conjuration',
  'Greater Scrying:B6/C7/D7/W7/Divination',
  'Greater Shadow Conjuration:W7/Illusion',
  'Greater Shadow Evocation:W8/Illusion',
  'Greater Shout:B6/W8/Evocation',
  'Greater Spell Immunity:C8/Abjuration',
  'Greater Teleport:W7/Tl7/Conjuration',
  'Guards And Wards:W6/Abjuration',
  'Guidance:C0/D0/Divination',
  'Gust Of Wind:D2/W2/Evocation',
  'Hallow:C5/D5/Evocation',
  'Hallucinatory Terrain:B4/W4/Illusion',
  'Halt Undead:W3/Necromancy',
  'Harm:C6/Dn6/Necromancy',
  'Haste:B3/W3/Transmutation',
  'Heal:C6/D7/He6/Conjuration',
  'Heal Mount:P3/Conjuration',
  'Heat Metal:D2/Su2/Transmutation',
  'Helping Hand:C3/Evocation',
  'Heroes\' Feast:B6/C6/Conjuration',
  'Heroism:B2/W3/Enchantment',
  'Hide From Animals:D1/R1/Abjuration',
  'Hide From Undead:C1/Abjuration',
  'Hold Animal:An2/D2/R2/Enchantment',
  'Hold Monster:B4/La6/W5/Enchantment',
  'Hold Person:B2/C2/W3/Enchantment',
  'Hold Portal:W1/Abjuration',
  'Holy Aura:C8/Go8/Abjuration',
  'Holy Smite:Go4/Evocation',
  'Holy Sword:P4/Evocation',
  'Holy Word:C7/Go7/Evocation',
  'Horrid Wilting:W8/Wa8/Necromancy',
  'Hypnotic Pattern:B2/W2/Illusion',
  'Hypnotism:B1/W1/Enchantment',
  'Ice Storm:D4/W4/Wa5/Evocation',
  'Identify:B1/Ma2/W1/Divination',
  'Illusionary Script:B3/W3/Illusion',
  'Illusionary Wall:W4/Illusion',
  'Imbue With Spell Ability:C4/Ma4/Evocation',
  'Implosion:C9/Dn9/Evocation',
  'Imprisonment:W9/Abjuration',
  'Incendiary Cloud:Fi8/W8/Conjuration',
  'Inflict Critical Wounds:C4/Dn4/Necromancy',
  'Inflict Light Wounds:C1/Dn1/Necromancy',
  'Inflict Minor Wounds:C0/Necromancy',
  'Inflict Moderate Wounds:C2/Necromancy',
  'Inflict Serious Wounds:C3/Necromancy',
  'Insanity:W7/Enchantment',
  'Insect Plague:C5/D5/Conjuration',
  'Invisibility:B2/Ty2/W2/Illusion',
  'Invisibility Purge:C3/Evocation',
  'Invisibility Sphere:B3/W3/Illusion',
  'Iron Body:Ea8/W8/Transmutation',
  'Ironwood:D6/Transmutation',
  'Jump:D1/R1/W1/Transmutation',
  'Keen Edge:W3/Transmutation',
  'Knock:W2/Transmutation',
  'Know Direction:B0/D0/Divination',
  'Legend Lore:B4/Kn7/W6/Divination',
  'Leomund\'s Secret Chest:W5/Conjuration',
  'Leomund\'s Secure Shelter:B4/W4/Conjuration',
  'Leomund\'s Tiny Hut:B3/W3/Evocation',
  'Leomund\'s Trap:W2/Illusion',
  'Lesser Confusion:B1/Enchantment',
  'Lesser Geas:B3/W4/Enchantment',
  'Lesser Globe Of Invulnerability:W4/Abjuration',
  'Lesser Planar Ally:C4/Conjuration',
  'Lesser Planar Binding:W5/Conjuration',
  'Lesser Restoration:C2/D2/P1/Conjuration',
  'Levitate:W2/Transmutation',
  'Light:B0/C0/D0/W0/Evocation',
  'Lightning Bolt:W3/Evocation',
  'Limited Wish:W7/Universal',
  'Liveoak:D6/Transmutation',
  'Locate Creature:B4/W4/Divination',
  'Locate Object:B2/C3/Tl2/W2/Divination',
  'Longstrider:D1/R1/Tl1/Transmutation',
  'Lullaby:B0/Enchantment',
  'Mage Armor:W1/Conjuration',
  'Mage Hand:B0/W0/Transmutation',
  'Magic Circle Against Chaos:C3/La3/P3/W3/Abjuration',
  'Magic Circle Against Evil:C3/Go3/P3/W3/Abjuration',
  'Magic Circle Against Good:C3/Ev3/W3/Abjuration',
  'Magic Circle Against Law:C3/Ch3/W3/Abjuration',
  'Magic Fang:D1/R1/Transmutation',
  'Magic Jar:W5/Necromancy',
  'Magic Missile:W1/Evocation',
  'Magic Mouth:B1/W2/Illusion',
  'Magic Stone:C1/D1/Ea1/Transmutation',
  'Magic Vestment:C3/St3/Wr3/Transmutation',
  'Magic Weapon:C1/P1/W1/Wr1/Transmutation',
  'Major Creation:W5/Conjuration',
  'Major Image:B3/W3/Illusion',
  'Make Whole:C2/Transmutation',
  'Mark Of Justice:C5/P4/Necromancy',
  'Mass Bear\'s Endurance:C6/D6/W6/Transmutation',
  'Mass Bull\'s Strength:C6/D6/W6/Transmutation',
  'Mass Cat\'s Grace:B6/D6/W6/Transmutation',
  'Mass Charm Monster:B6/W8/Enchantment',
  'Mass Cure Critical Wounds:C8/D9/He8/Conjuration',
  'Mass Cure Light Wounds:B5/C5/D6/He5/Conjuration',
  'Mass Cure Moderate Wounds:B6/C6/D7/Conjuration',
  'Mass Cure Serious Wounds:C7/D8/Conjuration',
  'Mass Eagle\'s Splendor:B6/C6/W6/Transmutation',
  'Mass Enlarge Person:W4/Transmutation',
  'Mass Fox\'s Cunning:B6/W6/Transmutation',
  'Mass Heal:C9/He9/Conjuration',
  'Mass Hold Monster:W9/Enchantment',
  'Mass Hold Person:W7/Enchantment',
  'Mass Inflict Critical Wounds:C8/Necromancy',
  'Mass Inflict Light Wounds:C5/Dn5/Necromancy',
  'Mass Inflict Moderate Wounds:C6/Necromancy',
  'Mass Inflict Serious Wounds:C7/Necromancy',
  'Mass Invisibility:W7/Illusion',
  'Mass Owl\'s Wisdom:C6/D6/W6/Transmutation',
  'Mass Reduce Person:W4/Transmutation',
  'Mass Suggestion:B5/W6/Enchantment',
  'Maze:W8/Conjuration',
  'Meld Into Stone:C3/D3/Transmutation',
  'Melf\'s Acid Arrow:W2/Conjuration',
  'Mending:B0/C0/D0/W0/Transmutation',
  'Message:B0/W0/Transmutation',
  'Meteor Swarm:W9/Evocation',
  'Mind Blank:Pr8/W8/Abjuration',
  'Mind Fog:B5/W5/Enchantment',
  'Minor Creation:W4/Conjuration',
  'Minor Image:B2/W2/Illusion',
  'Miracle:C9/Lu9/Evocation',
  'Mirage Arcana:B5/W5/Illusion',
  'Mirror Image:B2/W2/Illusion',
  'Misdirection:B2/W2/Illusion',
  'Mislead:B5/Lu6/Ty6/W6/Illusion',
  'Modify Memory:B4/Enchantment',
  'Moment Of Prescience:Lu8/W8/Divination',
  'Mordenkainen\'s Disjunction:Ma9/W9/Abjuration',
  'Mordenkainen\'s Faithful Hound:W5/Conjuration',
  'Mordenkainen\'s Lucubration:W6/Transmutation',
  'Mordenkainen\'s Magnificent Mansion:W7/Conjuration',
  'Mordenkainen\'s Private Sanctum:W5/Abjuration',
  'Mordenkainen\'s Sword:W7/Evocation',
  'Mount:W1/Conjuration',
  'Move Earth:D6/W6/Transmutation',
  'Neutralize Poison:B4/C4/D3/P4/R3/Conjuration',
  'Nightmare:B5/W5/Illusion',
  'Nondetection:R4/Ty3/W3/Abjuration',
  'Nystul\'s Magic Aura:B1/Ma1/W1/Illusion',
  'Obscure Object:B1/C3/W2/Abjuration',
  'Obscuring Mist:Ai1/C1/D1/W1/Wa1/Conjuration',
  'Open/Close:B0/W0/Transmutation',
  'Order\'s Wrath:La4/Evocation',
  'Otiluke\'s Freezing Sphere:W6/Evocation',
  'Otiluke\'s Resilient Sphere:W4/Evocation',
  'Otiluke\'s Telekinetic Sphere:W8/Evocation',
  'Otto\'s Irresistible Dance:B6/W8/Enchantment',
  'Overland Flight:W5/Transmutation',
  'Owl\'s Wisdom:C2/D2/P2/R2/W2/Transmutation',
  'Pass Without Trace:D1/R1/Transmutation',
  'Passwall:W5/Transmutation',
  'Permanency:W5/Universal',
  'Permanent Image:B6/W6/Illusion',
  'Persistent Image:B5/W5/Illusion',
  'Phantasmal Killer:W4/Illusion',
  'Phantom Steed:B3/W3/Conjuration',
  'Phase Door:Tl8/W7/Conjuration',
  'Planar Ally:C6/Conjuration',
  'Planar Binding:W6/Conjuration',
  'Plane Shift:C5/W7/Conjuration',
  'Plant Growth:D3/Pl3/R3/Transmutation',
  'Poison:C4/D3/Necromancy',
  'Polar Ray:W8/Evocation',
  'Polymorph:W4/Transmutation',
  'Polymorph Any Object:Ty8/W8/Transmutation',
  'Power Word, Blind:W7/Wr7/Enchantment',
  'Power Word, Kill:W9/Wr9/Enchantment',
  'Power Word, Stun:W8/Wr8/Enchantment',
  'Prayer:C3/P3/Enchantment',
  'Prestidigitation:B0/W0/Universal',
  'Prismatic Sphere:Pr9/Su9/W9/Abjuration',
  'Prismatic Spray:W7/Evocation',
  'Prismatic Wall:W8/Abjuration',
  'Produce Flame:D1/Fi2/Evocation',
  'Programmed Image:B6/W6/Illusion',
  'Project Image:B6/W7/Illusion',
  'Protection From Arrows:W2/Abjuration',
  'Protection From Chaos:C1/La1/P1/W1/Abjuration',
  'Protection From Energy:C3/D3/Lu3/Pr3/R2/W3/Abjuration',
  'Protection From Evil:C1/Go1/P1/W1/Abjuration',
  'Protection From Good:C1/Ev1/W1/Abjuration',
  'Protection From Law:C1/Ch1/W1/Abjuration',
  'Protection From Spells:Ma8/W8/Abjuration',
  'Prying Eyes:W5/Divination',
  'Purify Food And Drink:C0/D0/Transmutation',
  'Pyrotechnics:B2/W2/Transmutation',
  'Quench:D3/Transmutation',
  'Rage:B2/W3/Enchantment',
  'Rainbow Pattern:B4/W4/Illusion',
  'Raise Dead:C5/Conjuration',
  'Rary\'s Mnemonic Enhancer:W4/Transmutation',
  'Rary\'s Telepathic Bond:W5/Divination',
  'Ray Of Enfeeblement:W1/Necromancy',
  'Ray Of Exhaustion:W3/Necromancy',
  'Ray Of Frost:W0/Evocation',
  'Read Magic:B0/C0/D0/P1/R1/W0/Divination',
  'Reduce Animal:D2/R3/Transmutation',
  'Reduce Person:W1/Transmutation',
  'Refuge:C7/W9/Conjuration',
  'Regenerate:C7/D9/He7/Conjuration',
  'Reincarnate:D4/Transmutation',
  'Remove Blindness/Deafness:C3/P3/Conjuration',
  'Remove Curse:B3/C3/P3/W4/Abjuration',
  'Remove Disease:C3/D3/R3/Conjuration',
  'Remove Fear:B1/C1/Abjuration',
  'Remove Paralysis:C2/P2/Conjuration',
  'Repel Metal Or Stone:D8/Abjuration',
  'Repel Vermin:B4/C4/D4/R3/Abjuration',
  'Repel Wood:D6/Pl6/Transmutation',
  'Repulsion:C7/Pr7/W6/Abjuration',
  'Resist Energy:C2/D2/Fi3/P2/R1/W2/Abjuration',
  'Resistance:B0/C0/D0/P1/W0/Abjuration',
  'Restoration:C4/P4/Conjuration',
  'Resurrection:C7/Conjuration',
  'Reverse Gravity:D8/W7/Transmutation',
  'Righteous Might:C5/St5/Transmutation',
  'Rope Trick:W2/Transmutation',
  'Rusting Grasp:D4/Transmutation',
  'Sanctuary:C1/Pr1/Abjuration',
  'Scare:B2/W2/Necromancy',
  'Scintillating Pattern:W8/Illusion',
  'Scorching Ray:W2/Evocation',
  'Screen:Ty7/W8/Illusion',
  'Scrying:B3/C5/D4/W4/Divination',
  'Sculpt Sound:B3/Transmutation',
  'Searing Light:C3/Su3/Evocation',
  'Secret Page:B3/W3/Transmutation',
  'See Invisibility:B3/W2/Divination',
  'Seeming:B5/W5/Illusion',
  'Sending:C4/W5/Evocation',
  'Sepia Snake Sigil:B3/W3/Conjuration',
  'Sequester:W7/Abjuration',
  'Shades:W9/Illusion',
  'Shadow Conjuration:B4/W4/Illusion',
  'Shadow Evocation:B5/W5/Illusion',
  'Shadow Walk:B5/W6/Illusion',
  'Shambler:D9/Pl9/Conjuration',
  'Shapechange:An9/D9/W9/Transmutation',
  'Shatter:B2/C2/Ch2/Dn2/W2/Evocation',
  'Shield:W1/Abjuration',
  'Shield Of Faith:C1/Abjuration',
  'Shield Of Law:C8/La8/Abjuration',
  'Shield Other:C2/P2/Pr2/Abjuration',
  'Shillelagh:D1/Transmutation',
  'Shocking Grasp:W1/Evocation',
  'Shout:B4/W4/Evocation',
  'Shrink Item:W3/Transmutation',
  'Silence:B2/C2/Illusion',
  'Silent Image:B1/W1/Illusion',
  'Simulacrum:W7/Illusion',
  'Slay Living:C5/De5/Necromancy',
  'Sleep:B1/W1/Enchantment',
  'Sleet Storm:D3/W3/Conjuration',
  'Slow:B3/W3/Transmutation',
  'Snare:D3/R2/Transmutation',
  'Soften Earth And Stone:D2/Ea2/Transmutation',
  'Solid Fog:W4/Conjuration',
  'Song Of Discord:B5/Enchantment',
  'Soul Bind:C9/W9/Necromancy',
  'Sound Burst:B2/C2/Evocation',
  'Speak With Animals:B3/D1/R1/Divination',
  'Speak With Dead:C3/Necromancy',
  'Speak With Plants:B4/D3/R2/Divination',
  'Spectral Hand:W2/Necromancy',
  'Spell Immunity:C4/Pr4/St4/Abjuration',
  'Spell Resistance:C5/Ma5/Pr5/Abjuration',
  'Spell Turning:Lu7/Ma7/W7/Abjuration',
  'Spellstaff:D6/Transmutation',
  'Spider Climb:D2/W2/Transmutation',
  'Spike Growth:D3/R2/Transmutation',
  'Spike Stones:D4/Ea4/Transmutation',
  'Spiritual Weapon:C2/Wr2/Evocation',
  'Statue:W7/Transmutation',
  'Status:C2/Divination',
  'Stinking Cloud:W3/Conjuration',
  'Stone Shape:C3/D3/Ea3/W5/Transmutation',
  'Stone Tell:D6/Divination',
  'Stone To Flesh:W6/Transmutation',
  'Stoneskin:D5/Ea6/St6/W4/Abjuration',
  'Storm Of Vengeance:C9/D9/Conjuration',
  'Suggestion:B2/W3/Enchantment',
  'Summon Instrument:B0/Conjuration',
  'Summon Monster I:B1/C1/W1/Conjuration',
  'Summon Monster II:B2/C2/W2/Conjuration',
  'Summon Monster III:B3/C3/W3/Conjuration',
  'Summon Monster IV:B4/C4/W4/Conjuration',
  'Summon Monster IX:C9/Ch9/Ev9/Go9/La9/W9/Conjuration',
  'Summon Monster V:B5/C5/W5/Conjuration',
  'Summon Monster VI:B6/C6/W6/Conjuration',
  'Summon Monster VII:C7/W7/Conjuration',
  'Summon Monster VIII:C8/W8/Conjuration',
  'Summon Nature\'s Ally I:D1/R1/Conjuration',
  'Summon Nature\'s Ally II:D2/R2/Conjuration',
  'Summon Nature\'s Ally III:D3/R3/Conjuration',
  'Summon Nature\'s Ally IV:An4/D4/R4/Conjuration',
  'Summon Nature\'s Ally IX:D9/Conjuration',
  'Summon Nature\'s Ally V:D5/Conjuration',
  'Summon Nature\'s Ally VI:D6/Conjuration',
  'Summon Nature\'s Ally VII:D7/Conjuration',
  'Summon Nature\'s Ally VIII:An8/D8/Conjuration',
  'Summon Swarm:B2/D2/W2/Conjuration',
  'Sunbeam:D7/Su7/Evocation',
  'Sunburst:D8/Su8/W8/Evocation',
  'Symbol Of Death:C8/W8/Necromancy',
  'Symbol Of Fear:C6/W6/Necromancy',
  'Symbol Of Insanity:C8/W8/Enchantment',
  'Symbol Of Pain:C5/W5/Necromancy',
  'Symbol Of Persuasion:C6/W6/Enchantment',
  'Symbol Of Sleep:C5/W5/Enchantment',
  'Symbol Of Stunning:C7/W7/Enchantment',
  'Symbol Of Weakness:C7/W7/Necromancy',
  'Sympathetic Vibration:B6/Evocation',
  'Sympathy:D9/W8/Enchantment',
  'Tasha\'s Hideous Laughter:B1/W2/Enchantment',
  'Telekinesis:W5/Transmutation',
  'Teleport:Tl5/W5/Conjuration',
  'Teleport Object:W7/Conjuration',
  'Teleportation Circle:W9/Conjuration',
  'Temporal Stasis:W8/Transmutation',
  'Tenser\'s Floating Disk:W1/Evocation',
  'Tenser\'s Transformation:W6/Transmutation',
  'Time Stop:Ty9/W9/Transmutation',
  'Tongues:B2/C4/W3/Divination',
  'Touch Of Fatigue:W0/Necromancy',
  'Touch Of Idiocy:W2/Enchantment',
  'Transmute Metal To Wood:D7/Transmutation',
  'Transmute Mud To Rock:D5/W5/Transmutation',
  'Transmute Rock To Mud:D5/W5/Transmutation',
  'Transport Via Plants:D6/Transmutation',
  'Trap The Soul:W8/Conjuration',
  'Tree Shape:D2/R3/Transmutation',
  'Tree Stride:D5/R4/Conjuration',
  'True Resurrection:C9/Conjuration',
  'True Seeing:C5/D7/Kn5/W6/Divination',
  'True Strike:W1/Divination',
  'Undeath To Death:C6/W6/Necromancy',
  'Undetectable Alignment:B1/C2/P2/Abjuration',
  'Unhallow:C5/D5/Evocation',
  'Unholy Aura:C8/Ev8/Abjuration',
  'Unholy Blight:Ev4/Evocation',
  'Unseen Servant:B1/W1/Conjuration',
  'Vampiric Touch:W3/Necromancy',
  'Veil:B6/W6/Illusion',
  'Ventriloquism:B1/W1/Illusion',
  'Virtue:C0/D0/P1/Transmutation',
  'Vision:W7/Divination',
  'Wail Of The Banshee:De9/W9/Necromancy',
  'Wall Of Fire:D5/Fi4/W4/Evocation',
  'Wall Of Force:W5/Evocation',
  'Wall Of Ice:W4/Evocation',
  'Wall Of Iron:W6/Conjuration',
  'Wall Of Stone:C5/D6/Ea5/W5/Conjuration',
  'Wall Of Thorns:D5/Pl5/Conjuration',
  'Warp Wood:D2/Transmutation',
  'Water Breathing:C3/D3/Wa3/W3/Transmutation',
  'Water Walk:C3/R3/Transmutation',
  'Waves Of Exhaustion:W7/Necromancy',
  'Waves Of Fatigue:W5/Necromancy',
  'Web:W2/Conjuration',
  'Weird:W9/Illusion',
  'Whirlwind:Ai8/D8/Evocation',
  'Whispering Wind:B2/W2/Transmutation',
  'Wind Walk:C6/D7/Transmutation',
  'Wind Wall:Ai2/C3/D3/R2/W3/Evocation',
  'Wish:W9/Universal',
  'Wood Shape:D2/Transmutation',
  'Word Of Chaos:C7/Ch7/Evocation',
  'Word Of Recall:C6/D8/Conjuration',
  'Zone Of Silence:B4/Illusion',
  'Zone Of Truth:C2/P2/Enchantment'
];
PH35.WEAPONS = [
  'Bastard Sword:d10@19', 'Battleaxe:d8x3', 'Bolas:d4r10', 'Club:d6r10',
  'Composite Longbow:d8x3r110', 'Composite Shortbow:d6x3r70',
  'Dagger:d4@19r10', 'Dart:d4r20', 'Dire Flail:d8/d8',
  'Dwarven Urgosh:d8x3/d6x3', 'Dwarven Waraxe:d10x3', 'Falchion:2d4@18',
  'Gauntlet:d3', 'Glaive:d10x3', 'Gnome Hooked Hammer:d8x3/d6x4',
  'Greataxe:d12x3', 'Greatclub:d10', 'Greatsword:2d6@19', 'Guisarme:2d4x3',
  'Halberd:d10x3', 'Handaxe:d6x3', 'Hand Crossbow:d4@19r30',
  'Heavy Crossbow:d10@19r120', 'Heavy Flail:d10@19', 'Heavy Mace:d8',
  'Heavy Pick:d6', 'Heavy Shield:d4', 'Heavy Spiked Shield:d6',
  'Javelin:d6r30', 'Kama:d6', 'Kukri:d4@18', 'Lance:d8x3',
  'Light Crossbow:d8@19r80', 'Light Flail:d8', 'Light Hammer:d4r20',
  'Light Mace:d6', 'Light Pick:d4x4', 'Light Shield:d3',
  'Light Spiked Shield:d4', 'Longbow:d8x3r100', 'Longspear:d8x3',
  'Longsword:d8@19', 'Morningstar:d8', 'Net:d0r10', 'Nunchaku:d6',
  'Orc Double Axe:d8/d8', 'Punching Dagger:d4x3', 'Quarterstaff:d6/d6',
  'Rapier:d6@18', 'Ranseur:2d4x3', 'Repeating Heavy Crossbow:d10@19r120',
  'Repeating Light Crossbow:d8@19r80', 'Sai:d4r10', 'Sap:d6', 'Scimitar:d6@18',
  'Scythe:2d4x4', 'Short Sword:d6@19', 'Shortbow:d6x3r60', 'Shortspear:d6r20',
  'Shuriken:d2r10', 'Siangham:d6', 'Sickle:d6', 'Sling:d4r50', 'Spear:d8r20',
  'Spiked Chain:2d4', 'Spiked Gauntlet:d4', 'Throwing Axe:d6r10',
  'Trident:d8r10', 'Two-Bladed Sword:d8@19/d8@19', 'Unarmed:d3',
  'Warhammer:d8x3', 'Whip:d3'
];
PH35.PROFICIENCY_LEVEL_NAMES = ["None", "Light", "Medium", "Heavy", "Tower"];

// Related information used internally by PH35
PH35.armorsArcaneSpellFailurePercentages = {
  'None': null, 'Padded': 5, 'Leather': 10, 'Studded Leather': 15,
  'Chain Shirt': 20, 'Hide': 20, 'Scale Mail': 25, 'Chainmail': 30,
  'Breastplate': 25, 'Splint Mail': 40, 'Banded Mail': 35, 'Half Plate': 40,
  'Full Plate': 35
};
PH35.armorsArmorClassBonuses = {
  'None': null, 'Padded': 1, 'Leather': 2, 'Studded Leather': 3,
  'Chain Shirt': 4, 'Hide': 3, 'Scale Mail': 4, 'Chainmail': 5,
  'Breastplate': 5, 'Splint Mail': 6, 'Banded Mail': 6, 'Half Plate': 7,
  'Full Plate': 8
};
PH35.armorsMaxDexBonuses = {
  'None': null, 'Padded': 8, 'Leather': 6, 'Studded Leather': 5,
  'Chain Shirt': 4, 'Hide': 4, 'Scale Mail': 3, 'Chainmail': 2,
  'Breastplate': 3, 'Splint Mail': 0, 'Banded Mail': 1, 'Half Plate': 0,
  'Full Plate': 1
};
PH35.armorsSkillCheckPenalties = {
  'None': null, 'Padded': null, 'Leather': null, 'Studded Leather': -1,
  'Chain Shirt': -2, 'Hide': -3, 'Scale Mail': -4, 'Chainmail': -5,
  'Breastplate': -4, 'Splint Mail': -7, 'Banded Mail': -6, 'Half Plate': -7,
  'Full Plate': -6
};
PH35.armorsWeightClasses = {
  'None': 'Light', 'Padded': 'Light', 'Leather': 'Light',
  'Studded Leather': 'Light', 'Chain Shirt': 'Light', 'Hide': 'Medium',
  'Scale Mail': 'Medium', 'Chainmail': 'Medium', 'Breastplate': 'Medium',
  'Splint Mail': 'Heavy', 'Banded Mail': 'Heavy', 'Half Plate': 'Heavy',
  'Full Plate': 'Heavy'
};
PH35.deitiesFavoredWeapons = {
  'Corellon Larethian (CG Elves)': 'Longsword',
  'Erythnul (CE Slaughter)': 'Morningstar',
  'Gruumsh (CE Orcs)': 'Spear',
  'Heironeous (LG Valor)': 'Longsword',
  'Hextor (LE Tyranny)': 'Heavy Flail/Light Flail'
};
PH35.domainsNotes = [
  'combatNotes.airDomain:Turn earth/rebuke air',
  'combatNotes.destructionDomain:Smite (+4 attack/+level damage) 1/day',
  'combatNotes.earthDomain:Turn air/rebuke earth',
  'combatNotes.fireDomain:Turn water/rebuke fire',
  'combatNotes.plantDomain:Rebuke plants',
  'combatNotes.sunDomain:Destroy turned undead 1/day',
  'combatNotes.waterDomain:Turn fire/rebuke water',
  'featureNotes.warDomain:Weapon Proficiency/Weapon Focus (%V)',
  'magicNotes.animalDomain:<i>Speak With Animals</i> 1/Day',
  'magicNotes.chaosDomain:+1 caster level chaos spells',
  'magicNotes.deathDomain:<i>Death Touch</i> 1/Day',
  'magicNotes.evilDomain:+1 caster level evil spells',
  'magicNotes.goodDomain:+1 caster level good spells',
  'magicNotes.healingDomain:+1 caster level heal spells',
  'magicNotes.knowledgeDomain:+1 caster level divination spells',
  'magicNotes.lawDomain:+1 caster level law spells',
  'magicNotes.protectionDomain:Protective ward 1/day',
  'magicNotes.strengthDomain:Add level to strength 1 round/day',
  'magicNotes.travelDomain:<i>Freedom of Movement</i> 1 round/level/day',
  'saveNotes.luckDomain:Reroll 1/day',
  'skillNotes.animalDomain:Knowledge (Nature) is a class skill',
  'skillNotes.knowledgeDomain:All Knowledge skills are class skills',
  'skillNotes.magicDomain:Use Magic Device at level/2',
  'skillNotes.plantDomain:Knowledge (Nature) is a class skill',
  'skillNotes.travelDomain:Survival is a class skill',
  'skillNotes.trickeryDomain:Bluff/Disguise/Hide are class skills'
];
PH35.domainsSpellCodes = {
  'Air': 'Ai', 'Animal': 'An', 'Chaos': 'Ch', 'Death': 'De',
  'Destruction': 'Dn', 'Earth': 'Ea', 'Evil': 'Ev', 'Fire': 'Fi', 'Good': 'Go',
  'Healing': 'He', 'Knowledge': 'Kn', 'Law': 'La', 'Luck': 'Lu', 'Magic': 'Ma',
  'Plant': 'Pl', 'Protection': 'Pr', 'Strength': 'St', 'Sun': 'Su',
  'Travel': 'Tl', 'Trickery': 'Ty', 'War': 'Wr', 'Water': 'Wa'
};
PH35.featsNotes = [
  'combatNotes.blindFightFeature:' +
    'Reroll concealed miss/no bonus to invisible foe/half penalty for impaired vision',
  'combatNotes.cleaveFeature:Extra attack when foe drops',
  'combatNotes.combatExpertiseFeature:Up to -5 attack/+5 AC',
  'combatNotes.combatReflexesFeature:Add dexterity mod to AOO count',
  'combatNotes.deflectArrowsFeature:Deflect ranged 1/round',
  'combatNotes.diehardFeature:Remain conscious w/HP <= 0',
  'combatNotes.dodgeFeature:+1 AC vs. designated foe',
  'combatNotes.extraTurningFeature:+4/day',
  'combatNotes.farShotFeature:x1.5 projectile range; x2 thrown',
  'combatNotes.greatCleaveFeature:Cleave w/out limit',
  'combatNotes.greaterTwoWeaponFightingFeature:Second off-hand -10 attack',
  'combatNotes.improvedBullRushFeature:Bull rush w/out foe AOO; +4 strength',
  'combatNotes.improvedDisarmFeature:Disarm w/out foe AOO; +4 attack',
  'combatNotes.improvedFeintFeature:Bluff check to feint as move action',
  'combatNotes.improvedGrappleFeature:Grapple w/out foe AOO; +4 grapple',
  'combatNotes.improvedInitiativeFeature:+4 initiative',
  'combatNotes.improvedOverrunFeature:Foe cannot avoid; +4 strength',
  'combatNotes.improvedPreciseShotFeature:' +
    'No foe bonus for partial concealment; attack grappling w/no penalty',
  'combatNotes.improvedShieldBashFeature:Shield bash w/out AC penalty',
  'combatNotes.improvedSunderFeature:Sunder w/out foe AOO; +4 attack',
  'combatNotes.improvedTripFeature:' +
    'Trip w/out foe AOO; +4 strength; attack immediately after trip',
  'combatNotes.improvedTurningFeature:+1 turning level',
  'combatNotes.improvedTwoWeaponFightingFeature:Additional -5 attack',
  'combatNotes.improvedUnarmedStrikeFeature:Unarmed attack w/out foe AOO',
  'combatNotes.manyshotFeature:Fire multiple arrows simultaneously',
  'combatNotes.mobilityFeature:+4 AC vs. movement AOO',
  'combatNotes.mountedArcheryFeature:x.5 mounted ranged penalty',
  'combatNotes.mountedCombatFeature:Ride skill save vs. mount damage 1/round',
  'combatNotes.pointBlankShotFeature:+1 ranged attack/damage w/in 30 ft',
  'combatNotes.powerAttackFeature:Attack base -attack/+damage',
  'combatNotes.preciseShotFeature:Shoot into melee w/out penalty',
  'combatNotes.quickDrawFeature:Draw weapon as free action',
  'combatNotes.rapidReloadFeature:' +
    'Reload light/heavy crossbow as free/move action',
  'combatNotes.rapidShotFeature:Normal and extra ranged -2 attacks',
  'combatNotes.rideByAttackFeature:Move before and after mounted attack',
  'combatNotes.runFeature:Add 1 to speed multiplier; +4 running jump',
  'combatNotes.shotOnTheRunFeature:Move before and after ranged attack',
  'combatNotes.snatchArrowsFeature:Catch ranged weapons',
  'combatNotes.spiritedChargeFeature:x2 damage (x3 lance) from mounted charge',
  'combatNotes.springAttackFeature:Move before and after melee attack',
  'combatNotes.stunningFistFeature:' +
    'Foe %V Fortitude save or stunned 1/4 level/day',
  'combatNotes.toughnessFeature:+3 HP',
  'combatNotes.trampleFeature:Mounted overrun unavoidable/bonus hoof attack',
  'combatNotes.twoWeaponDefenseFeature:+1 AC w/two weapons',
  'combatNotes.twoWeaponFightingFeature:' +
    'Reduce on-hand penalty by 2/off-hand by 6',
  'combatNotes.weaponFinesseFeature:' +
    'Light weapons use dexterity mod instead of strength mod on attacks',
  'combatNotes.whirlwindAttackFeature:Attack all foes w/in reach',
  'featureNotes.leadershipFeature:Attract followers',
  'magicNotes.augmentSummoningFeature:' +
    'Summoned creatures +4 strength/constitution',
  'magicNotes.brewPotionFeature:Create potion for up to 3rd level spell',
  'magicNotes.craftMagicArmsAndArmorFeature:Create magic weapon/armor/shield',
  'magicNotes.craftRodFeature:Create magic rod',
  'magicNotes.craftStaffFeature:Create magic staff',
  'magicNotes.craftWandFeature:Create wand for up to 4th level spell',
  'magicNotes.craftWondrousItemFeature:Create miscellaneous magic item',
  'magicNotes.empowerSpellFeature:x1.5 designated spell variable effects',
  'magicNotes.enlargeSpellFeature:x2 designated spell range',
  'magicNotes.extendSpellFeature:x2 designated spell duration',
  'magicNotes.eschewMaterialsFeature:Cast spells w/out materials',
  'magicNotes.forgeRingFeature:Create magic ring',
  'magicNotes.greaterSpellPenetrationFeature:' +
    '+2 caster level vs. resistance checks',
  'magicNotes.heightenSpellFeature:Increase designated spell level',
  'magicNotes.improvedCounterspellFeature:Counter w/higher-level spell',
  'magicNotes.maximizeSpellFeature:' +
    'Maximize all designated spell variable effects',
  'magicNotes.naturalSpellFeature:Cast spell during <i>Wild Shape</i>',
  'magicNotes.quickenSpellFeature:Cast spell as free action 1/round',
  'magicNotes.scribeScrollFeature:Create scroll of any known spell',
  'magicNotes.silentSpellFeature:Cast designated spell w/out speech',
  'magicNotes.spellPenetrationFeature:+2 caster level vs. resistance checks',
  'magicNotes.stillSpellFeature:Cast designated spell w/out movement',
  'magicNotes.widenSpellFeature:Double area of affect',
  'saveNotes.enduranceFeature:+4 extended physical action',
  'saveNotes.greatFortitudeFeature:+2 Fortitude',
  'saveNotes.ironWillFeature:+2 Will',
  'saveNotes.lightningReflexesFeature:+2 Reflex',
  'skillNotes.acrobaticFeature:+2 Jump/Tumble',
  'skillNotes.agileFeature:+2 Balance/Escape Artist',
  'skillNotes.alertnessFeature:+2 Listen/Spot',
  'skillNotes.animalAffinityFeature:+2 Handle Animal/Ride',
  'skillNotes.athleticFeature:+2 Climb/Swim',
  'skillNotes.combatCastingFeature:+4 Concentration when casting on defensive',
  'skillNotes.deceitfulFeature:+2 Disguise/Forgery',
  'skillNotes.deftHandsFeature:+2 Sleight Of Hand/Use Rope',
  'skillNotes.diligentFeature:+2 Appraise/Decipher Script',
  'skillNotes.investigatorFeature:+2 Gather Information/Search',
  'skillNotes.magicalAptitudeFeature:+2 Spellcraft/Use Magic Device',
  'skillNotes.negotiatorFeature:+2 Diplomacy/Sense Motive',
  'skillNotes.nimbleFingersFeature:+2 Disable Device/Open Lock',
  'skillNotes.persuasiveFeature:+2 Bluff/Intimidate',
  'skillNotes.selfSufficientFeature:+2 Heal/Survival',
  'skillNotes.stealthyFeature:+2 Hide/Move Silently',
  'skillNotes.trackFeature:Survival to follow creatures at 1/2 speed'
];
PH35.featsPrerequisites = [
  '{feats.Armor Proficiency Medium} == null || {armorProficiencyLevel} > 0',
  '{feats.Armor Proficiency Heavy} == null || {armorProficiencyLevel} > 1',
  '{feats.Brew Potion} == null || {casterLevel} >= 3',
  '{feats.Cleave} == null || {features.Power Attack} != null',
  '{feats.Combat Expertise} == null || {intelligence} >= 13',
  '{feats.Craft Magic Arms And Armor} == null || {casterLevel} >= 5',
  '{feats.Craft Rod} == null || {casterLevel} >= 9',
  '{feats.Craft Staff} == null || {casterLevel} >= 12',
  '{feats.Craft Wand} == null || {casterLevel} >= 5',
  '{feats.Craft Wondrous Item} == null || {casterLevel} >= 3',
  '{feats.Deflect Arrows} == null || {dexterity} >= 13',
  '{feats.Deflect Arrows}==null || {features.Improved Unarmed Strike}!=null',
  '{feats.Diehard} == null || {features.Endurance} != null',
  '{feats.Dodge} == null || {dexterity} >= 13',
  '{feats.Empower Spell} == null || {casterLevel} >= 1',
  '{feats.Enlarge Spell} == null || {casterLevel} >= 1',
  '{feats.Extend Spell} == null || {casterLevel} >= 1',
  '{feats.Extra Turning} == null || {turningLevel} >= 1',
  '{feats.Far Shot} == null || {features.Point Blank Shot} != null',
  '{feats.Forge Ring} == null || {casterLevel} >= 12',
  '{feats.Great Cleave} == null || {baseAttack} >= 4',
  '{feats.Great Cleave} == null || {features.Cleave} != null',
  '{feats.Greater Spell Penetration} == null || ' +
    '{features.Spell Penetration} != null',
  '{feats.Greater Two Weapon Fighting} == null || {baseAttack} >= 11',
  '{feats.Greater Two Weapon Fighting} == null || {dexterity} >= 19',
  '{feats.Greater Two Weapon Fighting} == null || ' +
    '{features.Improved Two Weapon Fighting} != null',
  '{feats.Heighten Spell} == null || {casterLevel} >= 1',
  '{feats.Improved Bull Rush} == null || {features.Power Attack} != null',
  '{feats.Improved Disarm} == null || ' +
    '{levels.Monk} >= 6 || {features.Combat Expertise} != null',
  '{feats.Improved Feint} == null || {features.Combat Expertise} != null',
  '{feats.Improved Grapple} == null || ' + 
    '{levels.Monk} >= 1 || ' +
    '({dexterity} >= 13 && {features.Improved Unarmed Strike} != null)',
  '{feats.Improved Overrun} == null || {features.Power Attack} != null',
  '{feats.Improved Precise Shot} == null || {dexterity} >= 19',
  '{feats.Improved Precise Shot} == null || {baseAttack} >= 11',
  '{feats.Improved Precise Shot} == null || {features.Precise Shot} != null',
  '{feats.Improved Shield Bash} == null || ' +
    '{features.Shield Proficiency} != null',
  '{feats.Improved Sunder} == null || {features.Power Attack} != null',
  '{feats.Improved Trip} == null || ' +
    '{levels.Monk} >= 6 || {features.Combat Expertise} != null',
  '{feats.Improved Two Weapon Fighting} == null || {baseAttack} >= 6',
  '{feats.Improved Two Weapon Fighting} == null || {dexterity} >= 17',
  '{feats.Improved Two Weapon Fighting} == null || ' +
    '{features.Two Weapon Fighting} != null',
  '{feats.Improved Turning} == null || {turningLevel} >= 1',
  '{feats.Leadership} == null || {level} >= 6',
  '{feats.Manyshot} == null || {dexterity} >= 17',
  '{feats.Manyshot} == null || {baseAttack} >= 6',
  '{feats.Manyshot} == null || {features.Rapid Shot} != null',
  '{feats.Maximize Spell} == null || {casterLevel} >= 1',
  '{feats.Mobility} == null || {features.Dodge} != null',
  '{feats.Mounted Archery} == null || {features.Mounted Combat} != null',
  '{feats.Mounted Combat} == null || {skills.Ride} >= 1',
  '{feats.Natural Spell} == null || {wisdom} >= 13',
  '{feats.Natural Spell} == null || {features.Wild Shape} != null',
  '{feats.Power Attack} == null || {strength} >= 13',
  '{feats.Precise Shot} == null || {features.Point Blank Shot} != null',
  '{feats.Quick Draw} == null || {baseAttack} >= 1',
  '{feats.Quicken Spell} == null || {casterLevel} >= 1',
  '{feats.Rapid Shot} == null || {dexterity} >= 13',
  '{feats.Rapid Shot} == null || {features.Point Blank Shot} != null',
  '{feats.Ride By Attack} == null || {features.Mounted Combat} != null',
  '{feats.Scribe Scroll} == null || {casterLevel} >= 1',
  '{feats.Shield Proficiency Tower} == null || {shieldProficiencyLevel} > 0',
  '{feats.Shot On The Run} == null || {features.Mobility} != null',
  '{feats.Shot On The Run} == null || {features.Point Blank Shot} != null',
  '{feats.Shot On The Run} == null || {baseAttack} >= 4',
  '{feats.Silent Spell} == null || {casterLevel} >= 1',
  '{feats.Snatch Arrows} == null || {dexterity} >= 15',
  '{feats.Snatch Arrows} == null || {features.Deflect Arrows} != null',
  '{feats.Spell Penetration} == null || {casterLevel} >= 1',
  '{feats.Spirited Charge} == null || {features.Ride By Attack} != null',
  '{feats.Spring Attack} == null || {baseAttack} >= 4',
  '{feats.Spring Attack} == null || {features.Mobility} != null',
  '{feats.Still Spell} == null || {casterLevel} >= 1',
  '{feats.Stunning Fist} == null || {dexterity} >= 13',
  '{feats.Stunning Fist} == null || {wisdom} >= 13',
  '{feats.Stunning Fist} == null || {features.Improved Unarmed Strike}!=null',
  '{feats.Trample} == null || {features.Mounted Combat} != null',
  '{feats.Two Weapon Defense} == null || ' +
    '{features.Two Weapon Fighting} != null',
  '{feats.Two Weapon Defense} == null || ' +
    '{features.Two Weapon Fighting} != null',
  '{feats.Two Weapon Fighting} == null || {dexterity} >= 15',
  '{feats.Weapon Finesse} == null || {baseAttack} >= 1',
  '{feats.Whirlwind Attack} == null || {features.Combat Expertise} != null',
  '{feats.Whirlwind Attack} == null || {features.Spring Attack} != null',
  '{feats.Widen Spell} == null || {casterLevel} >= 1'
];
PH35.skillsSynergies = {
  'Bluff': 'Diplomacy/Intimidate/Sleight Of Hand',
  'Decipher Script': 'Use Magic Device (scrolls)',
  'Escape Artist': 'Use Rope (bindings)',
  'Handle Animal': 'Ride',
  'Jump': 'Tumble',
  'Knowledge (Arcana)': 'Spellcraft',
  'Knowledge (Dungeoneering)': 'Survival (underground)',
  'Knowledge (Engineering)': 'Search (secret doors)',
  'Knowledge (Geography)': 'Survival (lost/hazards)',
  'Knowledge (History)': 'Bardic knowledge',
  'Knowledge (Local)': 'Gather Information',
  'knowledge (Nature)': 'Survival (outdoors)',
  'Knowledge (Nobility)': 'Diplomacy',
  'Knowledge (Planes)': 'Survival (other planes)',
  'Knowledge (Religion)': 'Turning check',
  'Search': 'Survival (tracking)',
  'Sense Motive': 'Diplomacy',
  'Spellcraft': 'Use Magic Device (scroll)',
  'Survival': 'Knowledge (Nature)',
  'Tumble': 'Balance/Jump',
  'Use Magic Device': 'Spellcraft (scrolls)',
  'Use Rope': 'Climb (rope)/Escape Artist (rope)'
};
// Filled in by the classes that define selectable features.
PH35.selectableFeatures = {
};
PH35.strengthMaxLoads = [0,
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 115, 130, 150, 175,  200, 230, 260,
  300, 350, 400, 460, 520, 600, 700, 800, 920, 1040, 1200, 1400
];

/* Defines the rules related to PH Chapter 1, Abilities. */
PH35.abilityRules = function(rules) {

  var tests = [
    '{strengthModifier} + {intelligenceModifier} + {wisdomModifier} + ' +
      '{dexterityModifier} + {constitutionModifier} + {charismaModifier} > 0',
    '{strength} > 13 || {intelligence} > 13 || {wisdom} > 13 || ' +
      '{dexterity} > 13 || {constitution} > 13 || {charisma} > 13'
  ];
  rules.defineTest(tests);

  // Ability modifier computation
  rules.defineRule
    ('charismaModifier', 'charisma', '=', 'Math.floor((source - 10) / 2)');
  rules.defineRule
    ('constitutionModifier', 'constitution', '=', 'Math.floor((source-10)/2)');
  rules.defineRule
    ('dexterityModifier', 'dexterity', '=', 'Math.floor((source - 10) / 2)');
  rules.defineRule
    ('intelligenceModifier', 'intelligence', '=', 'Math.floor((source-10)/2)');
  rules.defineRule
    ('strengthModifier', 'strength', '=', 'Math.floor((source - 10) / 2)');
  rules.defineRule
    ('wisdomModifier', 'wisdom', '=', 'Math.floor((source - 10) / 2)');

  // Effects of ability modifiers
  rules.defineRule('combatNotes.constitutionHitPointsAdjustment',
    'constitutionModifier', '=', 'source == 0 ? null : source',
    'level', '*', null
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'dexterityModifier', '=', 'source == 0 ? null : source'
  );
  rules.defineRule('combatNotes.dexterityRangedAttackAdjustment',
    'dexterityModifier', '=', 'source == 0 ? null : source'
  );
  rules.defineRule('skillNotes.intelligenceSkillPointsAdjustment',
    'intelligenceModifier', '=', null,
    'level', '*', 'source + 3'
  );
  rules.defineRule('combatNotes.strengthDamageAdjustment',
    'strengthModifier', '=', 'source == 0 ? null : source'
  );
  rules.defineRule('combatNotes.strengthMeleeAttackAdjustment',
    'strengthModifier', '=', 'source == 0 ? null : source'
  );
  rules.defineRule('languageCount',
    'intelligenceModifier', '+', 'source > 0 ? source : null'
  );
  rules.defineRule('turningBase', 'charismaModifier', '+', 'source / 3');
  rules.defineRule('turningDamageModifier', 'charismaModifier', '+', null);
  rules.defineRule('turningFrequency', 'charismaModifier', '+', null);

  // Effects of the notes computed above
  rules.defineRule
    ('armorClass', 'combatNotes.dexterityArmorClassAdjustment', '+', null);
  rules.defineRule
    ('hitPoints', 'combatNotes.constitutionHitPointsAdjustment', '+', null);
  rules.defineRule
    ('meleeAttack', 'combatNotes.strengthMeleeAttackAdjustment', '+', null);
  rules.defineRule
    ('rangedAttack', 'combatNotes.dexterityRangedAttackAdjustment', '+', null);
  rules.defineRule
    ('skillPoints', 'skillNotes.intelligenceSkillPointsAdjustment', '+', null);

};

/* Defines the rules related to PH Chapter 9, Adventuring. */
PH35.adventuringRules = function(rules) {
  rules.defineRule('loadLight', 'loadMax', '=', 'Math.floor(source / 3)');
  rules.defineRule('loadMax','strength','=','PH35.strengthMaxLoads[source]');
  rules.defineRule('loadMedium', 'loadMax', '=', 'Math.floor(source * 2 / 3)');
  rules.defineRule('runSpeed',
    'speed', '=', null,
    'runSpeedMultiplier', '*', null
  );
  rules.defineRule('runSpeedMultiplier',
    'armorWeightClass', '=', 'source == "Heavy" ? 3 : 4'
  );
  rules.defineRule('speed', null, '=', '30');
};

/* Defines the rules related to PH Chapter 3, Classes. */
PH35.classRules = function(rules) {

  // Experience- and level-dependent attributes
  rules.defineRule('classSkillMaxRanks', 'level', '=', 'source + 3');
  rules.defineRule('crossSkillMaxRanks', 'classSkillMaxRanks', '=', 'source/2');
  rules.defineRule
    ('experienceNeeded', 'level', '=', '1000 * source * (source + 1) / 2');
  rules.defineRule('featCount', 'level', '=', '1 + Math.floor(source / 3)');
  rules.defineRule('level',
    'experience', '=', 'Math.floor((1 + Math.sqrt(1 + source / 125)) / 2)'
  );
  rules.defineRule('skillPoints',
    null, '=', '0',
    'level', '^', 'source + 3'
  );
  rules.defineTest('+/{^levels} == {level}');

  for(var i = 0; i < PH35.CLASSES.length; i++) {

    var baseAttack, features, hitDie, notes, prerequisites, profArmor,
        profShield, profWeapon, saveFortitude, saveReflex, saveWill,
        skillPoints, skills, spellsKnown, spellsPerDay, spellsPerDayAbility;
    var klass = PH35.CLASSES[i];

    if(klass == 'Barbarian') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        '1:Fast Movement', '1:Illiteracy', '1:Rage', '2:Uncanny Dodge',
        '3:Trap Sense', '5:Improved Uncanny Dodge', '7:Damage Reduction',
        '11:Greater Rage', '14:Indomitable Will', '17:Tireless Rage',
        '20:Mighty Rage'
      ];
      hitDie = 12;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'combatNotes.damageReductionFeature:%V subtracted from damage taken',
        'combatNotes.greaterRageFeature:+6 strength/constitution; +3 Will',
        'combatNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'combatNotes.mightyRageFeature:+8 strength/constitution; +4 Will save',
        'combatNotes.rageFeature:' +
          '+4 strength/constitution/+2 Will save/-2 AC 5+conMod rounds %V/day',
        'combatNotes.tirelessRageFeature:Not fatigued after rage',
        'combatNotes.uncannyDodgeFeature:Always adds dexterity modifier to AC',
        'saveNotes.trapSenseFeature:+%V Reflex and AC vs. traps',
        'saveNotes.indomitableWillFeature:' +
          '+4 enchantment resistance during rage',
        'skillNotes.illiteracyFeature:Must spend 2 skill points to read/write'
      ];
      prerequisites = ['{alignment}.indexOf("Lawful") < 0'];
      profArmor = PH35.PROFICIENCY_MEDIUM;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 4;
      skills = [
        'Climb', 'Handle Animal', 'Intimidate', 'Jump', 'Listen', 'Ride',
        'Survival', 'Swim'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      rules.defineRule
        ('abilityNotes.fastMovementFeature', 'levels.Barbarian', '+=', '10');
      rules.defineRule('combatNotes.damageReductionFeature',
        'levels.Barbarian', '+=', 'source>=7 ? Math.floor((source-4)/3) : null'
      );
      rules.defineRule('combatNotes.rageFeature',
        'levels.Barbarian', '+=', '1 + Math.floor(source / 4)'
      );
      rules.defineRule('saveNotes.trapSenseFeature',
        'levels.Barbarian', '+=', 'source >= 3 ? Math.floor(source / 3) : null'
      );
      rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', null);

    } else if(klass == 'Bard') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Bardic Knowledge', '1:Bardic Music', '1:Countersong', '1:Fascinate',
        '1:Inspire Courage', '3:Inspire Competence', '6:Suggestion',
        '9:Inspire Greatness', '12:Song Of Freedom', '15:Inspire Heroics',
        '18:Mass Suggestion'
      ];
      hitDie = 6;
      notes = [
        'featureNotes.bardicMusicFeature:Bardic music effect %V/day',
        'magicNotes.countersongFeature:' +
          'Perform check vs. sonic magic w/in 30 ft for 10 rounds',
        'magicNotes.fascinateFeature:' +
          'Hold %V creatures within 90 ft spellbound 1 round/bard level',
        'magicNotes.inspireCompetenceFeature:' +
          '+2 allies skill checks while performing up to 2 minutes',
        'magicNotes.inspireCourageFeature:' +
          '+%V attack/damage and charm/fear saves to allies while performing',
        'magicNotes.inspireGreatnessFeature:' +
           '%V allies get +2 HD/attack/+1 Fortitude save while performing',
        'magicNotes.inspireHeroicsFeature:' +
          'Single ally +4 AC and saves while performing',
        'magicNotes.massSuggestionFeature:' +
          'Make suggestion to all fascinated creatures',
        'magicNotes.songOfFreedomFeature:Break enchantment through performing',
        'magicNotes.suggestionFeature:' +
          'Make suggestion to a fascinated creature',
        'skillNotes.bardicKnowledgeFeature:' +
          '+%V Knowledge checks on local history'
      ];
      prerequisites = ['{alignment}.indexOf("Lawful") < 0'];
      profArmor = PH35.PROFICIENCY_LIGHT;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 6;
      skills = [
        'Appraise', 'Balance', 'Bluff', 'Climb', 'Concentration',
        'Decipher Script', 'Diplomacy', 'Disguise', 'Escape Artist',
        'Gather Information', 'Hide', 'Jump', 'Knowledge (Arcana)',
        'Knowledge (Architecture)', 'Knowledge (Engineering)',
        'Knowledge (Dungeoneering)', 'Knowledge (Geography)',
        'Knowledge (History)', 'Knowledge (Local)', 'Knowledge (Nature)',
        'Knowledge (Nobility)', 'Knowledge (Planes)', 'Knowledge (Religion)',
        'Listen', 'Move Silently', 'Perform (Act)', 'Perform (Comedy)',
        'Perform (Dance)', 'Perform (Keyboard)', 'Perform (Oratory)',
        'Perform (Percussion)', 'Perform (Sing)', 'Perform (String)',
        'Perform (Wind)', 'Sense Motive', 'Sleight Of Hand', 'Speak Language',
        'Spellcraft', 'Swim', 'Tumble', 'Use Magic Device'
      ];
      spellsKnown = [
        'B0:1:4/2:5/3:6',
        'B1:2:1/3:2/5:3/16:4',
        'B2:4:1/5:2/7:3/17:4',
        'B3:7:1/8:2/10:3/18:4',
        'B4:10:1/11:2/13:3/19:4',
        'B5:13:1/14:2/16:3/20:4',
        'B6:16:1/17:2/19:3'
      ];
      spellsPerDay = [
        'B0:1:2/2:3/14:4',
        'B1:2:0/3:1/4:2/5:3/15:4',
        'B2:4:0/5:1/6:2/8:3/16:4',
        'B3:7:0/8:1/9:2/11:3/17:4',
        'B4:10:0/11:1/12:2/14:3/18:4',
        'B5:13:0/14:1/15:2/17:3/19:4',
        'B6:16:0/17:1/18:2/19:3/20:4'
      ];
      spellsPerDayAbility = 'charisma';
      rules.defineRule
        ('casterLevelArcane', 'spellsPerDayLevels.Bard', '^=', null);
      rules.defineRule
        ('featureNotes.bardicMusicFeature', 'levels.Bard', '=', null);
      rules.defineRule
        ('features.Countersong', 'performRanks', '?', 'source >= 3');
      rules.defineRule
        ('features.Fascinate', 'performRanks', '?', 'source >= 3');
      rules.defineRule
        ('features.Inspire Competence', 'performRanks', '?', 'source >= 6');
      rules.defineRule
        ('features.Inspire Courage', 'performRanks', '?', 'source >= 3');
      rules.defineRule
        ('features.Inspire Greatness', 'performRanks', '?', 'source >= 12');
      rules.defineRule
        ('features.Inspire Heroics', 'performRanks', '?', 'source >= 18');
      rules.defineRule
        ('features.Mass Suggestion', 'performRanks', '?', 'source >= 21');
      rules.defineRule
        ('features.Song Of Freedom', 'performRanks', '?', 'source >= 15');
      rules.defineRule
        ('features.Suggestion', 'performRanks', '?', 'source >= 9');
      rules.defineRule('magicNotes.fascinateFeature',
        'levels.Bard', '+=', 'Math.floor((source + 2) / 3)'
      );
      rules.defineRule('magicNotes.inspireCourageFeature',
        'levels.Bard', '+=', 'source >= 8 ? Math.floor((source + 4) / 6) : 1'
      );
      rules.defineRule('magicNotes.inspireGreatnessFeature',
        'levels.Bard', '+=', 'source >= 9 ? Math.floor((source - 6) / 3) : null'
      );
      rules.defineRule('performRanks',
        'skills.Perform (Act)', '^=', null,
        'skills.Perform (Comedy)', '^=', null,
        'skills.Perform (Dance)', '^=', null,
        'skills.Perform (Keyboard)', '^=', null,
        'skills.Perform (Oratory)', '^=', null,
        'skills.Perform (Percussion)', '^=', null,
        'skills.Perform (Sing)', '^=', null,
        'skills.Perform (String)', '^=', null,
        'skills.Perform (Wind)', '^=', null
      );
      rules.defineRule('skillNotes.bardicKnowledgeFeature',
        'levels.Bard', '+=', null,
        'intelligenceModifier', '+', null
      );

    } else if(klass == 'Cleric') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = ['1:Spontaneous Cleric Spell', '1:Turn Undead'];
      hitDie = 8;
      notes = [
        'combatNotes.turnUndeadFeature:' +
          'Turn (good) or rebuke (evil) undead creatures',
        'magicNotes.spontaneousClericSpellFeature:%V'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_HEAVY;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      spellsKnown = [
        'C0:1:"all"', 'C1:1:"all"', 'C2:3:"all"', 'C3:5:"all"',
        'C4:7:"all"', 'C5:9:"all"', 'C6:11:"all"', 'C7:13:"all"',
        'C8:15:"all"', 'C9:17:"all"',
        'Dom1:1:"all"', 'Dom2:3:"all"', 'Dom3:5:"all"', 'Dom4:7:"all"',
        'Dom5:9:"all"', 'Dom6:11:"all"', 'Dom7:13:"all"', 'Dom8:15:"all"',
        'Dom9:17:"all"'
      ];
      spellsPerDay = [
        'C0:1:3/2:4/4:5/7:6',
        'C1:1:1/2:2/4:3/7:4/11:5',
        'C2:3:1/4:2/6:3/9:4/13:5',
        'C3:5:1/6:2/8:3/11:4/15:5',
        'C4:7:1/8:2/10:3/13:4/17:5',
        'C5:9:1/10:2/12:3/15:4/19:5',
        'C6:11:1/12:2/14:3/17:4',
        'C7:13:1/14:2/16:3/19:4',
        'C8:15:1/16:2/18:3/20:4',
        'C9:17:1/18:2/19:3/20:4'
      ];
      spellsPerDayAbility = 'wisdom';
      skillPoints = 2;
      skills = [
        'Concentration', 'Diplomacy', 'Heal', 'Knowledge (Arcana)',
        'Knowledge (History)', 'Knowledge (Planes)', 'Knowledge (Religion)',
        'Spellcraft'
      ];
      rules.defineRule
        ('casterLevelDivine', 'spellsPerDayLevels.Cleric', '^=', null);
      rules.defineRule
        ('classSkills.Bluff', 'skillNotes.trickeryDomain', '=', '1');
      rules.defineRule
        ('classSkills.Disguise', 'skillNotes.trickeryDomain', '=', '1');
      rules.defineRule
        ('classSkills.Hide', 'skillNotes.trickeryDomain', '=', '1');
      for(var j = 0; j < PH35.SKILLS.length; j++) {
        var skill = PH35.SKILLS[j].split(/:/)[0];
        if(skill.substring(0, 9) == "Knowledge")
          rules.defineRule
            ('classSkills.' + skill, 'skillNotes.knowledgeDomain', '=', '1');
      }
      rules.defineRule('classSkills.Knowledge (Nature)',
        'skillNotes.animalDomain', '=', '1',
        'skillNotes.plantDomain', '=', '1'
      );
      rules.defineRule
        ('classSkills.Survival', 'skillNotes.travelDomain', '=', '1');
      rules.defineRule('domainCount', 'levels.Cleric', '+=', '2');
      rules.defineRule('magicNotes.spontaneousClericSpellFeature',
        'alignment', '=', 'source.indexOf("Evil") >= 0 ? "Inflict" : "Heal"'
      );
      for(var j = 1; j < 10; j++) {
        rules.defineRule('spellsPerDay.Dom' + j,
          'spellsPerDayLevels.Cleric', '=',
          'source >= ' + (j * 2 - 1) + ' ? 1 : null');
      }
      rules.defineRule('turningLevel', 'levels.Cleric', '+=', null);

    } else if(klass == 'Druid') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Animal Companion', '1:Nature Sense', '1:Spontaneous Druid Spell',
        '1:Wild Empathy', '2:Woodland Stride', '3:Trackless Step',
        '4:Resist Nature', '5:Wild Shape', '9:Venom Immunity',
        '13:Thousand Faces', '15:Timeless Body'
      ];
      hitDie = 8;
      notes = [
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'featureNotes.timelessBodyFeature:No aging penalties',
        'featureNotes.tracklessStepFeature:Untrackable outdoors',
        'featureNotes.woodlandStrideFeature:' +
          'Normal movement through undergrowth',
        'magicNotes.spontaneousDruidSpellFeature:' +
          '<i>Summon Nature\'s Ally</i>',
        'magicNotes.thousandFacesFeature:<i>Alter Self</i> at will',
        'magicNotes.wildShapeFeature:Change into creature of size %V',
        'saveNotes.resistNatureFeature:+4 vs. spells of feys',
        'saveNotes.venomImmunityFeature:Immune to poisons',
        'skillNotes.natureSenseFeature:+2 Knowledge (Nature)/Survival',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals'
      ];
      prerequisites = ['{alignment}.indexOf("Neutral") >= 0'];
      profArmor = PH35.PROFICIENCY_MEDIUM;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Concentration', 'Diplomacy', 'Handle Animal', 'Heal',
        'Knowledge (Nature)', 'Listen', 'Ride', 'Spellcraft', 'Spot',
        'Survival', 'Swim'
      ];
      spellsKnown = [
        'D0:1:"all"', 'D1:1:"all"', 'D2:3:"all"', 'D3:5:"all"',
        'D4:7:"all"', 'D5:9:"all"', 'D6:11:"all"', 'D7:13:"all"',
        'D8:15:"all"', 'D9:17:"all"'
      ];
      spellsPerDay = [
        'D0:1:3/2:4/4:5/7:6',
        'D1:1:1/2:2/4:3/7:4/11:5',
        'D2:3:1/4:2/6:3/9:4/13:5',
        'D3:5:1/6:2/8:3/11:4/15:5',
        'D4:7:1/8:2/10:3/13:4/17:5',
        'D5:9:1/10:2/12:3/15:4/19:5',
        'D6:11:1/12:2/14:3/17:4',
        'D7:13:1/14:2/16:3/19:4',
        'D8:15:1/16:2/18:3/20:4',
        'D9:17:1/18:2/19:3/20:4'
      ];
      spellsPerDayAbility = 'wisdom';
      rules.defineRule
        ('casterLevelDivine', 'spellsPerDayLevels.Druid', '^=', null);
      rules.defineRule('languageCount', 'levels.Druid', '+', '1');
      rules.defineRule('languages.Druidic', 'levels.Druid', '=', '1');
      rules.defineRule('magicNotes.wildShapeFeature',
        'levels.Druid', '=',
          'source <  5 ? null : ' +
          'source == 5 ? "small-medium 1/day" : ' +
          'source == 6 ? "small-medium 2/day" : ' +
          'source == 7 ? "small-medium 3/day" : ' +
          'source <  10 ? "small-large 3/day" : ' +
          'source == 10 ? "small-large 4/day" : ' +
          'source == 11 ? "tiny-large 4/day" : ' +
          'source <  14 ? "tiny-large/plant 4/day" : ' +
          'source == 14 ? "tiny-large/plant 5/day" : ' +
          'source == 15 ? "tiny-huge/plant 5/day" : ' +
          'source <  18 ? "tiny-huge/plant 5/day; elemental 1/day" : ' +
          'source <  20 ? "tiny-huge/plant 6/Day; elemental 2/day" : ' +
          '"tiny-huge/plant 6/day; elemental 3/day"'
      );
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'levels.Druid', '+=', null,
        'charismaModifier', '+', null
      );

    } else if(klass == 'Fighter') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = null;
      hitDie = 10;
      notes = null;
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_HEAVY;
      profShield = PH35.PROFICIENCY_TOWER;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 2;
      skills = [
        'Climb', 'Handle Animal', 'Intimidate', 'Jump', 'Ride', 'Swim'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      rules.defineRule
        ('featCount', 'featureNotes.fighterFeatCountBonus', '+', null);
      rules.defineRule('featureNotes.fighterFeatCountBonus',
        'levels.Fighter', '=', '1 + Math.floor(source / 2)'
      );

    } else if(klass == 'Monk') {

      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Flurry Of Blows', '1:Improved Unarmed Strike', '2:Evasion',
        '3:Fast Movement', '3:Still Mind', '4:Ki Strike', '4:Slow Fall',
        '5:Purity Of Body', '7:Wholeness Of Body', '9:Improved Evasion',
        '10:Lawful Ki Strike', '11:Diamond Body', '11:Greater Flurry',
        '12:Abundant Step', '13:Diamond Soul', '15:Quivering Palm',
        '16:Adamantine Ki Strike', '17:Timeless Body',
        '17:Tongue Of The Sun And Moon', '19:Empty Body', '20:Perfect Self'
      ];
      hitDie = 8;
      notes = [
        'abilityNotes.fastMovementFeature:+%V speed',
        'combatNotes.adamantineKiStrikeFeature:' +
          'Treat unarmed as adamantine weapon',
        'combatNotes.flurryOfBlowsFeature:Take %V penalty for extra attack',
        'combatNotes.greaterFlurryFeature:Extra attack',
        'combatNotes.improvedUnarmedStrikeFeature:Unarmed attack w/out foe AOO',
        'combatNotes.kiStrikeFeature:Treat unarmed as magic weapon',
        'combatNotes.lawfulKiStrikeFeature:Treat unarmed as lawful weapon',
        'combatNotes.perfectSelfFeature:' +
          'Ignore first 10 points of non-magical damage',
        'combatNotes.quiveringPalmFeature:' +
          'Foe makes DC %V Fortitude save or dies 1/week',
        'featureNotes.timelessBodyFeature:No aging penalties',
        'featureNotes.tongueOfTheSunAndMoonFeature:Speak w/any living creature',
        'magicNotes.abundantStepFeature:<i>Dimension Door</i> 1/day',
        'magicNotes.emptyBodyFeature:Ethereal %V rounds/day',
        'magicNotes.wholenessOfBodyFeature:Heal %V damage to self/day',
        'saveNotes.diamondBodyFeature:Immune to poison',
        'saveNotes.diamondSoulFeature:+%V spell resistance',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of 1/2',
        'saveNotes.improvedEvasionFeature:Failed save yields 1/2 damage',
        'saveNotes.perfectSelfFeature:Treat as outsider for magic saves',
        'saveNotes.purityOfBodyFeature:Immune to normal disease',
        'saveNotes.slowFallFeature:' +
          'Subtract %V ft from falling damage distance',
        'saveNotes.stillMindFeature:+2 vs. enchantment'
      ];
      prerequisites = ['{alignment}.indexOf("Lawful") >= 0'];
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 4;
      skills = [
        'Balance', 'Climb', 'Concentration', 'Diplomacy', 'Escape Artist',
        'Hide', 'Jump', 'Knowledge (Arcana)', 'Knowledge (Religion)', 'Listen',
        'Move Silently', 'Perform (Act)', 'Perform (Comedy)',
        'Perform (Dance)', 'Perform (Keyboard)', 'Perform (Oratory)',
        'Perform (Percussion)', 'Perform (Sing)', 'Perform (String)',
        'Perform (Wind)', 'Sense Motive', 'Spot', 'Swim', 'Tumble'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      rules.defineRule('abilityNotes.fastMovementFeature',
        'levels.Monk', '+=', '10 * Math.floor(source / 3)'
      );
      rules.defineRule
        ('armorClass', 'combatNotes.monkArmorClassAdjustment', '+', null);
      rules.defineRule('combatNotes.flurryOfBlowsFeature',
        'levels.Monk', '=', 'source < 5 ? -2 : source < 9 ? -1 : 0'
      );
      rules.defineRule('combatNotes.monkArmorClassAdjustment',
        'levels.Monk', '=', 'source >= 5 ? Math.floor(source / 5) : null',
        'wisdomModifier', '+', 'source > 0 ? source : null'
      );
      rules.defineRule('combatNotes.quiveringPalmFeature',
        'levels.Monk', '+=', '10 + Math.floor(source / 2)',
        'wisdomModifier', '+', null
      );
      rules.defineRule
        ('featCount', 'featureNotes.monkFeatCountBonus', '+', null);
      rules.defineRule('featureNotes.monkFeatCountBonus',
        'levels.Monk', '=', 'source < 2 ? 1 : source < 6 ? 2 : 3'
      );
      rules.defineRule
        ('magicNotes.emptyBodyFeature', 'levels.Monk', '+=', null);
      rules.defineRule
        ('magicNotes.wholenessOfBodyFeature', 'levels.Monk', '+=', '2*source');
      rules.defineRule
        ('resistance.Enchantment', 'saveNotes.stillMindFeature', '+=', '2');
      rules.defineRule
        ('resistance.Magic', 'saveNotes.diamondSoulFeature', '+=', null);
      rules.defineRule
        ('saveNotes.diamondSoulFeature', 'levels.Monk', '+=', '10 + source');
      rules.defineRule('saveNotes.slowFallFeature',
        'levels.Monk', '=',
        'source < 4 ? null : source < 20 ? Math.floor(source / 2) * 10 : "all"'
      );
      rules.defineRule('speed', 'abilityNotes.fastMovementFeature', '+', null);
      rules.defineRule('weaponDamage.Unarmed',
        'levels.Monk', '=',
        'source < 12 ? ("d" + (6 + Math.floor(source / 4) * 2)) : ' +
        '              ("2d" + (6 + Math.floor((source - 12) / 4) * 2))'
      );

    } else if(klass == 'Paladin') {

      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        '1:Aura Of Good', '1:Detect Evil', '1:Smite Evil', '2:Divine Grace',
        '2:Lay On Hands', '3:Aura Of Courage', '3:Divine Health',
        '4:Turn Undead', '5:Special Mount', '6:Remove Disease'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.smiteEvilFeature:' +
          '%V/day add conMod to attack, paladin level to damage vs. evil foe',
        'combatNotes.turnUndeadFeature:' +
          'Turn (good) or rebuke (evil) undead creatures',
        'featureNotes.specialMountFeature:Magical mount w/special abilities',
        'magicNotes.auraOfGoodFeature:Visible to <i>Detect Good</i>',
        'magicNotes.detectEvilFeature:<i>Detect Evil</i> at will',
        'magicNotes.layOnHandsFeature:Harm undead or heal %V HP/day',
        'magicNotes.removeDiseaseFeature:<i>Remove Disease</i> %V/week',
        'saveNotes.auraOfCourageFeature:Immune fear; +4 to allies w/in 30 ft',
        'saveNotes.divineGraceFeature:Add %V to saves',
        'saveNotes.divineHealthFeature:Immune to disease'
      ];
      prerequisites = ['{alignment} == "Lawful Good"'];
      profArmor = PH35.PROFICIENCY_HEAVY;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 2;
      skills = [
        'Concentration', 'Diplomacy', 'Handle Animal', 'Heal',
        'Knowledge (Nobility)', 'Knowledge (Religion)', 'Ride', 'Sense Motive'
      ];
      spellsKnown = [
        'P1:4:"all"', 'P2:8:"all"', 'P3:11:"all"', 'P4:14:"all"'
      ];
      spellsPerDay = [
        'P1:4:0/6:1/14:2/18:3',
        'P2:8:0/10:1/16:2/19:3',
        'P3:11:0/12:1/17:2/19:3',
        'P4:14:0/15:1/19:2/20:3'
      ];
      spellsPerDayAbility = 'wisdom';
      rules.defineRule('casterLevelDivine',
        'spellsPerDayLevels.Paladin', '^=',
        'source < 4 ? null : Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.smiteEvilFeature',
        'levels.Paladin', '=', '1 + Math.floor(source / 5)'
      );
      rules.defineRule('magicNotes.layOnHandsFeature',
        'levels.Paladin', '+=', null,
        'charismaModifier', '*', null
      );
      rules.defineRule('magicNotes.removeDiseaseFeature',
        'levels.Paladin', '+=', 'Math.floor((source - 3) / 3)'
      );
      rules.defineRule
        ('save.Fortitude', 'saveNotes.divineGraceFeature', '+', null);
      rules.defineRule
        ('save.Reflex', 'saveNotes.divineGraceFeature', '+', null);
      rules.defineRule('save.Will', 'saveNotes.divineGraceFeature', '+', null);
      rules.defineRule
        ('saveNotes.divineGraceFeature', 'charismaModifier', '=', null);
      rules.defineRule
        ('turningLevel', 'levels.Paladin', '+=', 'source>3 ? source-3 : null');

    } else if(klass == 'Ranger') {

      PH35.selectableFeatures[klass] =
        'Combat Style (Archery)/Combat Style (Two Weapon Combat)';
      baseAttack = PH35.ATTACK_BONUS_GOOD;
      features = [
        '1:Favored Enemy', '1:Track', '1:Wild Empathy', '2:Rapid Shot',
        '2:Two Weapon Fighting', '3:Endurance', '4:Animal Companion',
        '6:Manyshot', '6:Improved Two Weapon Fighting', '7:Woodland Stride',
        '8:Swift Tracker', '9:Evasion', '11:Improved Precise Shot',
        '11:Greater Two Weapon Fighting', '13:Camouflage',
        '17:Hide In Plain Sight'
      ];
      hitDie = 8;
      notes = [
        'featureNotes.animalCompanionFeature:Special bond/abilities',
        'combatNotes.favoredEnemyFeature:' +
          '+2 or more damage vs. %V type(s) of creatures',
        'combatNotes.greaterTwoWeaponFightingFeature:' +
          'Second off-hand -10 attack',
        'combatNotes.improvedPreciseShotFeature:' +
          'No foe bonus for partial concealment; attack grappling w/no penalty',
        'combatNotes.improvedTwoWeaponFightingFeature:Additional -5 attack',
        'combatNotes.manyshotFeature:Fire multiple arrows simultaneously',
        'combatNotes.rapidShotFeature:Normal and extra ranged -2 attacks',
        'combatNotes.twoWeaponFightingFeature:' +
          'Reduce on-hand penalty by 2/off-hand by 6',
        'featureNotes.woodlandStrideFeature:' +
          'Normal movement through undergrowth',
        'saveNotes.enduranceFeature:+4 extended physical action',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of 1/2',
        'skillNotes.camouflageFeature:Hide in any natural terrain',
        'skillNotes.favoredEnemyFeature:' +
          '+2 or more vs. %V type(s) of creatures on ' +
          'Bluff/Listen/Sense Motive/Spot/Survival',
        'skillNotes.hideInPlainSightFeature:Hide even when observed',
        'skillNotes.swiftTrackerFeature:Track at full speed',
        'skillNotes.trackFeature:Survival to follow creatures at 1/2 speed',
        'skillNotes.wildEmpathyFeature:+%V Diplomacy check with animals'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_LIGHT;
      profShield = PH35.PROFICIENCY_HEAVY;
      profWeapon = PH35.PROFICIENCY_MEDIUM;
      saveFortitude = PH35.SAVE_BONUS_GOOD;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 6;
      skills = [
        'Climb', 'Concentration', 'Handle Animal', 'Heal', 'Hide', 'Jump',
        'Knowledge (Dungeoneering)', 'Knowledge (Geography)',
        'Knowledge (Nature)', 'Listen', 'Move Silently', 'Ride', 'Search',
        'Spot', 'Survival', 'Swim', 'Use Rope'
      ];
      spellsKnown = [
        'R1:4:"all"', 'R2:8:"all"', 'R3:11:"all"', 'R4:14:"all"'
      ];
      spellsPerDay = [
        'R1:4:0/6:1/14:2/18:3',
        'R2:8:0/10:1/16:2/19:3',
        'R3:11:0/12:1/17:2/19:3',
        'R4:14:0/15:1/19:2/20:3'
      ];
      spellsPerDayAbility = 'wisdom';
      rules.defineRule('casterLevelDivine',
        'spellsPerDayLevels.Ranger', '^=',
        'source < 4 ? null : Math.floor(source / 2)'
      );
      rules.defineRule('combatNotes.favoredEnemyFeature',
        'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
      );
      rules.defineRule('rangerFeatures.Rapid Shot',
        'selectableFeatures.Combat Style (Archery)', '?', null
      );
      rules.defineRule('rangerFeatures.Manyshot',
        'selectableFeatures.Combat Style (Archery)', '?', null
      );
      rules.defineRule('rangerFeatures.Improved Precise Shot',
        'selectableFeatures.Combat Style (Archery)', '?', null
      );
      rules.defineRule('rangerFeatures.Two Weapon Fighting',
        'selectableFeatures.Combat Style (Two Weapon Combat)', '?', null
      );
      rules.defineRule('rangerFeatures.Improved Two Weapon Fighting',
        'selectableFeatures.Combat Style (Two Weapon Combat)', '?', null
      );
      rules.defineRule('rangerFeatures.Greater Two Weapon Fighting',
        'selectableFeatures.Combat Style (Two Weapon Combat)', '?', null
      );
      rules.defineRule('selectableFeatureCount.Ranger',
        'levels.Ranger', '=', 'source >= 2 ? 1 : null'
      );
      rules.defineRule('skillNotes.favoredEnemyFeature',
        'levels.Ranger', '+=', '1 + Math.floor(source / 5)'
      );
      rules.defineRule('skillNotes.wildEmpathyFeature',
        'levels.Ranger', '+=', null,
        'charismaModifier', '+', null
      );

    } else if(klass == 'Rogue') {

      PH35.selectableFeatures[klass] =
        'Crippling Strike/Defensive Roll/Feat Bonus/Improved Evasion/' +
        'Opportunist/Skill Mastery/Slippery Mind';
      baseAttack = PH35.ATTACK_BONUS_AVERAGE;
      features = [
        '1:Sneak Attack', '1:Trapfinding', '2:Evasion', '3:Trap Sense',
        '4:Uncanny Dodge', '8:Improved Uncanny Dodge'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.cripplingStrikeFeature: ' +
          '2 points strength damage from sneak attack',
        'combatNotes.defensiveRollFeature:' +
          'DC damage Reflex save vs. lethal blow for half damage',
        'combatNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'combatNotes.opportunistFeature:AOO vs. foe struck by ally',
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'combatNotes.uncannyDodgeFeature:Always adds dexterity modifier to AC',
        'saveNotes.evasionFeature:Reflex save yields no damage instead of 1/2',
        'saveNotes.improvedEvasionFeature:Failed save yields 1/2 damage',
        'saveNotes.slipperyMindFeature:Second save vs. enchantment',
        'saveNotes.trapSenseFeature:+%V Reflex and AC vs. traps',
        'skillNotes.skillMasteryFeature:' +
          'Never distracted from designated skills',
        'skillNotes.trapfindingFeature:' +
          'Use Search/Disable Device to find/remove DC 20+ traps'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_LIGHT;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_GOOD;
      saveWill = PH35.SAVE_BONUS_POOR;
      skillPoints = 8;
      skills = [
        'Appraise', 'Balance', 'Bluff', 'Climb', 'Decipher Script',
        'Diplomacy', 'Disable Device', 'Disguise', 'Escape Artist', 'Forgery',
        'Gather Information', 'Hide', 'Intimidate', 'Jump',
        'Knowledge (Local)', 'Listen', 'Move Silently', 'Open Lock',
        'Perform (Act)', 'Perform (Comedy)', 'Perform (Dance)',
        'Perform (Keyboard)', 'Perform (Oratory)', 'Perform (Percussion)',
        'Perform (Sing)', 'Perform (String)', 'Perform (Wind)', 'Search',
        'Sense Motive', 'Sleight Of Hand', 'Spot', 'Swim', 'Tumble',
        'Use Magic Device', 'Use Rope'
      ];
      spellsKnown = null;
      spellsPerDay = null;
      spellsPerDayAbility = null;
      rules.defineRule('combatNotes.sneakAttackFeature',
        'levels.Rogue', '+=', 'Math.floor((source + 1) / 2)'
      );
      rules.defineRule('featCount', 'features.Feat Bonus', '+=', 'null');
      rules.defineRule('saveNotes.trapSenseFeature',
        'levels.Rogue', '+=', 'source >= 3 ? Math.floor(source / 3) : null'
      );
      rules.defineRule('selectableFeatureCount.Rogue',
        'levels.Rogue', '+=', 'source>=10 ? Math.floor((source-7)/3) : null'
      );

    } else if(klass == 'Sorcerer') {

      baseAttack = PH35.ATTACK_BONUS_POOR;
      features = ['1:Summon Familiar'];
      hitDie = 4;
      notes = [
        'magicNotes.summonFamiliarFeature:Special bond/abilities'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_LIGHT;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 2;
      skills = [
        'Bluff', 'Concentration', 'Knowledge (Arcana)', 'Spellcraft'
      ];
      spellsKnown = [
        'W0:1:4/2:5/4:6/6:7/8:8/10:9',
        'W1:1:2/3:3/5:4/7:5',
        'W2:4:1/5:2/7:3/9:4/11:5',
        'W3:6:1/7:2/9:3/11:4',
        'W4:8:1/9:2/11:3/13:4',
        'W5:10:1/11:2/13:3/15:4',
        'W6:12:1/13:2/15:3',
        'W7:14:1/15:2/17:3',
        'W8:16:1/17:2/19:3',
        'W9:18:1/19:2/20:3'
      ];
      spellsPerDay = [
        'S0:1:5/2:6',
        'S1:1:3/2:4/3:5/4:6',
        'S2:4:3/5:4/6:5/7:6',
        'S3:6:3/7:4/8:5/9:6',
        'S4:8:3/9:4/10:5/11:6',
        'S5:10:3/11:4/12:5/13:6',
        'S6:12:3/13:4/14:5/15:6',
        'S7:14:3/15:4/16:5/17:6',
        'S8:16:3/17:4/18:5/19:6',
        'S9:18:3/19:4/20:6'
      ];
      spellsPerDayAbility = 'charisma';
      rules.defineRule
        ('casterLevelArcane', 'spellsPerDayLevels.Sorcerer', '^=', null);

    } else if(klass == 'Wizard') {

      baseAttack = PH35.ATTACK_BONUS_POOR;
      features = ['1:Scribe Scroll', '1:Summon Familiar'];
      hitDie = 4;
      notes = [
        'magicNotes.scribeScrollFeature:Create scroll of any known spell',
        'magicNotes.summonFamiliarFeature:Special bond/abilities',
        'magicNotes.wizardSpecialization:Extra %V spell/day each spell level',
        'skillNotes.wizardSpecialization:+2 Spellcraft (%V)'
      ];
      prerequisites = null;
      profArmor = PH35.PROFICIENCY_NONE;
      profShield = PH35.PROFICIENCY_NONE;
      profWeapon = PH35.PROFICIENCY_NONE;
      saveFortitude = PH35.SAVE_BONUS_POOR;
      saveReflex = PH35.SAVE_BONUS_POOR;
      saveWill = PH35.SAVE_BONUS_GOOD;
      skillPoints = 2;
      skills = [
        'Concentration', 'Decipher Script', 'Knowledge (Arcana)',
        'Knowledge (Dungeoneering)', 'Knowledge (Engineering)',
        'Knowledge (Geography)', 'Knowledge (History)', 'Knowledge (Local)',
        'Knowledge (Nature)', 'Knowledge (Nobility)', 'Knowledge (Planes)',
        'Knowledge (Religion)', 'Spellcraft'
      ];
      spellsKnown = [
        'W0:1:"all"', 'W1:1:3/2:5', 'W2:3:2/4:4', 'W3:5:2/6:4',
        'W4:7:2/8:4', 'W5:9:2/10:4', 'W6:11:2/12:4', 'W7:13:2/14:4',
        'W8:15:2/16:4', 'W9:17:2/18:4/19:6/20:8'
      ];
      spellsPerDay = [
        'W0:1:3/2:4',
        'W1:1:1/2:2/4:3/7:4',
        'W2:3:1/4:2/6:3/9:4',
        'W3:5:1/6:2/8:3/11:4',
        'W4:7:1/8:2/10:3/13:4',
        'W5:9:1/10:2/12:3/15:4',
        'W6:11:1/12:2/14:3/17:4',
        'W7:13:1/14:2/16:3/19:4',
        'W8:15:1/16:2/18:3/20:4',
        'W9:17:1/18:2/19:3/20:4'
      ];
      spellsPerDayAbility = 'intelligence';
      rules.defineRule
        ('casterLevelArcane', 'spellsPerDayLevels.Wizard', '^=', null);
      rules.defineRule
        ('featCount', 'featureNotes.wizardFeatCountBonus', '+', null);
      rules.defineRule('featureNotes.wizardFeatCountBonus',
        'levels.Wizard', '=', 'source >= 5 ? Math.floor(source / 5) : null'
      );
      for(var j = 0; j < PH35.SCHOOLS.length; j++) {
        var school = PH35.SCHOOLS[j];
        rules.defineRule('magicNotes.wizardSpecialization',
         'specialize.' + school, '=', '"' + school + '"'
        );
        rules.defineRule('skillNotes.wizardSpecialization',
          'specialize.' + school, '=', '"' + school + '"'
        );
      }
      for(var j = 0; j < 10; j++) {
        rules.defineRule
          ('spellsPerDay.W' + j, 'magicNotes.wizardSpecialization', '+', '1');
      }

    } else
      continue;

    rules.defineClass
      (klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       prerequisites, spellsKnown, spellsPerDay, spellsPerDayAbility);
    if(notes != null)
      rules.defineNote(notes);

  }

};

/* Defines the rules related to PH Chapter 8, Combat. */
PH35.combatRules = function(rules) {
  rules.defineRule('armorClass',
    null, '=', '10',
    'armor', '+', 'PH35.armorsArmorClassBonuses[source]',
    'shield', '+', 'source=="None" ? null : ' +
                   'source=="Tower" ? 4 : source.indexOf("Light") >= 0 ? 1 : 2'
  );
  rules.defineRule
    ('attacksPerRound', 'baseAttack', '=', '1 + Math.floor((source - 1) / 5)');
  rules.defineRule('baseAttack', null, '=', '0');
  rules.defineRule('initiative', 'dexterityModifier', '=', null);
  rules.defineRule('meleeAttack', 'baseAttack', '=', null);
  rules.defineRule('rangedAttack', 'baseAttack', '=', null);
  rules.defineRule('save.Fortitude', 'constitutionModifier', '=', null);
  rules.defineRule('save.Reflex', 'dexterityModifier', '=', null);
  rules.defineRule('save.Will', 'wisdomModifier', '=', null);
  rules.defineRule('turningBase', 'turningLevel', '=', null)
  rules.defineRule('turningDamageModifier', 'turningLevel', '=', null);
  rules.defineRule('turningFrequency', 'turningLevel', '+=', '3');
  rules.defineRule('turningMax',
    'turningBase', '=', 'Math.floor(source + 10 / 3)',
    'turningLevel', 'v', 'source + 4'
  );
  rules.defineRule('turningMin',
    'turningBase', '=', 'Math.floor(source - 3)',
    'turningLevel', '^', 'source - 4'
  );
  rules.defineRule('weapons.Unarmed', null, '=', '1');
};

/* Returns an ObjectViewer loaded with the default character sheet format. */
PH35.createViewer = function(viewer) {
  viewer.addElements(
    {name: '_top', borders: 1, separator: '\n'},
    {name: 'Header', within: '_top'},
      {name: 'Identity', within: 'Header', separator: ''},
        {name: 'Name', within: 'Identity', format: '<b>%V</b>'},
        {name: 'Race', within: 'Identity', format: ' -- <b>%V</b>'},
        {name: 'Levels', within: 'Identity', format: ' <b>%V</b>',
         separator: '/'},
      {name: 'Image Url', within: 'Header', format: '<img src="%V">'},
    {name: 'Attributes', within: '_top', separator: '\n'},
      {name: 'Abilities', within: 'Attributes'},
        {name: 'StrInfo', within: 'Abilities', separator: ''},
          {name: 'Strength', within: 'StrInfo'},
          {name: 'Strength Modifier', within: 'StrInfo', format: ' (%V)'},
        {name: 'IntInfo', within: 'Abilities', separator: ''},
          {name: 'Intelligence', within: 'IntInfo'},
          {name: 'Intelligence Modifier', within: 'IntInfo',format: ' (%V)'},
        {name: 'WisInfo', within: 'Abilities', separator: ''},
          {name: 'Wisdom', within: 'WisInfo'},
          {name: 'Wisdom Modifier', within: 'WisInfo', format: ' (%V)'},
        {name: 'DexInfo', within: 'Abilities', separator: ''},
          {name: 'Dexterity', within: 'DexInfo'},
          {name: 'Dexterity Modifier', within: 'DexInfo', format: ' (%V)'},
        {name: 'ConInfo', within: 'Abilities', separator: ''},
          {name: 'Constitution', within: 'ConInfo'},
          {name: 'Constitution Modifier', within: 'ConInfo',format: ' (%V)'},
        {name: 'ChaInfo', within: 'Abilities', separator: ''},
          {name: 'Charisma', within: 'ChaInfo'},
          {name: 'Charisma Modifier', within: 'ChaInfo', format: ' (%V)'},
      {name: 'Description', within: 'Attributes'},
        {name: 'Alignment', within: 'Description'},
        {name: 'Deity', within: 'Description'},
        {name: 'Origin', within: 'Description'},
        {name: 'Gender', within: 'Description'},
        {name: 'Player', within: 'Description'},
      {name: 'AbilityStats', within: 'Attributes'},
        {name: 'ExperienceInfo', within: 'AbilityStats', separator: ''},
          {name: 'Experience', within: 'ExperienceInfo'},
          {name: 'Experience Needed', within: 'ExperienceInfo', format: '/%V'},
        {name: 'Level', within: 'AbilityStats'},
        {name: 'SpeedInfo', within: 'AbilityStats', separator: ''},
          {name: 'Speed', within: 'SpeedInfo',
            format: '<b>Speed/Run</b>: %V'},
          {name: 'Run Speed', within: 'SpeedInfo', format: '/%V'},
        {name: 'LoadInfo', within: 'AbilityStats', separator: ''},
          {name: 'Load Light', within: 'LoadInfo',
            format: '<b>Light/Med/Max Load:</b> %V'},
          {name: 'Load Medium', within: 'LoadInfo', format: '/%V'},
          {name: 'Load Max', within: 'LoadInfo', format: '/%V'},
      {name: 'Ability Notes', within: 'Attributes', separator: ' * '},
    {name: 'FeaturesAndSkills', within: '_top', separator: '\n',
      format: '<b>Features/Skills</b><br/>%V'},
      {name: 'FeatStats', within: 'FeaturesAndSkills'},
        {name: 'Feat Count', within: 'FeatStats'},
        {name: 'Selectable Feature Count', within: 'FeatStats',
         separator: ' * '},
      {name: 'Feats', within: 'FeaturesAndSkills', separator: ' * '},
      {name:'Selectable Features', within:'FeaturesAndSkills', separator:' * '},
      {name: 'Feature Notes', within: 'FeaturesAndSkills', separator: ' * '},
      {name: 'SkillStats', within: 'FeaturesAndSkills'},
        {name: 'Skill Points', within: 'SkillStats'},
        {name: 'SkillRanksInfo', within: 'SkillStats', separator: ''},
          {name: 'Class Skill Max Ranks', within: 'SkillRanksInfo',
            format: '<b>Class/Cross Skill Max Ranks</b>: %V'},
          {name: 'Cross Skill Max Ranks', within: 'SkillRanksInfo',
            format: '/%V'},
      {name: 'Skills', within: 'FeaturesAndSkills', separator: ' * '},
      {name: 'Skill Notes', within: 'FeaturesAndSkills', separator: ' * '},
      {name: 'LanguageStats', within: 'FeaturesAndSkills'},
        {name: 'Language Count', within: 'LanguageStats'},
      {name: 'Languages', within: 'FeaturesAndSkills', separator: ' * '},
    {name: 'Combat', within: '_top', separator: '\n',
      format: '<b>Combat</b><br/>%V'},
      {name: 'CombatStats', within: 'Combat'},
        {name: 'Hit Points', within: 'CombatStats'},
        {name: 'Initiative', within: 'CombatStats'},
        {name: 'Armor Class', within: 'CombatStats'},
        {name: 'Attacks Per Round', within: 'CombatStats'},
        {name: 'AttackInfo', within: 'CombatStats', separator: ''},
          {name: 'Base Attack', within: 'AttackInfo',
            format: '<b>Base/Melee/Ranged Attack</b>: %V'},
          {name: 'Melee Attack', within: 'AttackInfo', format: '/%V'},
          {name: 'Ranged Attack', within: 'AttackInfo', format: '/%V'},
      {name: 'Turning', within: 'Combat'},
        {name: 'Turning Frequency', within: 'Turning',
          format: '<b>%N</b>: %V/Day'},
        {name: 'TurningMinMaxInfo', within: 'Turning', separator: ''},
          {name: 'Turning Min', within: 'TurningMinMaxInfo',
            format: '<b>Turning Min/Max HD</b>: %V'},
          {name: 'Turning Max', within: 'TurningMinMaxInfo', format: '/%V'},
        {name: 'Turning Damage Modifier', within: 'Turning',
          format: '<b>Turning Damage</b>: 2d6+%V'},
      {name: 'Weapons', within: 'Combat', separator: ' * '},
      {name: 'Gear', within: 'Combat'},
        {name: 'Armor Proficiency', within: 'Gear'},
        {name: 'Armor', within: 'Gear'},
        {name: 'Shield Proficiency', within: 'Gear'},
        {name: 'Shield', within: 'Gear'},
        {name: 'Weapon Proficiency', within: 'Gear'},
      {name: 'Combat Notes', within: 'Combat', separator: ' * '},
      {name: 'SaveAndResistance', within: 'Combat'},
        {name: 'Save', within: 'SaveAndResistance', separator: ' * '},
        {name: 'Resistance', within: 'SaveAndResistance', separator: ' * '},
      {name: 'Save Notes', within: 'Combat', separator: ' * '},
    {name: 'Magic', within: '_top', separator: '\n',
      format: '<b>Magic</b><br/>%V'},
      {name: 'SpellStats', within: 'Magic'},
        {name: 'Spells Known', within: 'SpellStats', separator: ' * '},
        {name: 'Spells Per Day', within: 'SpellStats', separator: ' * '},
        {name: 'Spell Difficulty Class', within: 'SpellStats',
         format: '<b>Spell DC</b>: %V', separator: ' * '},
      {name: 'SpellSpecialties', within: 'Magic'},
        {name: 'Domains', within: 'SpellSpecialties', separator: ' * '},
        {name: 'Specialize', within: 'SpellSpecialties'},
        {name: 'Prohibit', within: 'SpellSpecialties', separator: ' * '},
      {name: 'Spells', within: 'Magic', separator: ' * '},
      {name: 'Goodies', within: 'Magic', separator: ' * '},
      {name: 'Magic Notes', within: 'Magic', separator: ' * '},
    {name: 'Notes Area', within: '_top', separator: '\n',
      format: '<b>Notes</b><br/>%V'},
      {name: 'Notes', within: 'Notes Area', format: '%V'},
      {name: 'Dm Notes', within: 'Notes Area', format: '%V'}
  );
};

/* Defines the rules related to PH Chapter 6, Description. */
PH35.descriptionRules = function(rules) {
  rules.defineChoice('alignments', PH35.ALIGNMENTS);
  rules.defineChoice('deities', PH35.DEITIES, 'None:');
  rules.defineChoice('genders', PH35.GENDERS);
};

/* Defines the rules related to PH Chapter 7, Equipment. */
PH35.equipmentRules = function(rules) {

  rules.defineChoice('armors', PH35.ARMORS);
  rules.defineChoice('goodies', PH35.GOODIES);
  rules.defineChoice('shields', PH35.SHIELDS);
  rules.defineChoice('weapons', PH35.WEAPONS);
  rules.defineNote('magicNotes.arcaneSpellFailure:%V%'),
  rules.defineRule('abilityNotes.armorSpeedAdjustment',
    'armorWeightClass', '=', 'source == "Light" ? null : -10',
    'features.Slow', '+', '5'
  );
  rules.defineRule('armorWeightClass',
    'armor', '=',
      'PH35.armorsWeightClasses[source] == null ? "Light" : ' +
      'PH35.armorsWeightClasses[source]'
  );
  rules.defineRule('combatNotes.dexterityArmorClassAdjustment',
    'armor', 'v', 'PH35.armorsMaxDexBonuses[source]'
  );
  rules.defineRule('magicNotes.arcaneSpellFailure',
    'casterLevelArcane', '?', null,
    'armor', '+=', 'PH35.armorsArcaneSpellFailurePercentages[source]',
    'shield', '+=', 'source == "None" ? 0 : ' +
                    'source == "Tower" ? 50 : ' +
                    'source.indexOf("Heavy") >= 0 ? 15 : 5'
  );
  rules.defineRule('skillNotes.armorSkillCheckPenalty',
    'armor', '=', 'PH35.armorsSkillCheckPenalties[source]'
  );
  rules.defineRule('speed', 'abilityNotes.armorSpeedAdjustment', '+', null);
  // TODO combatNotes.strengthDamageAdjustment handled directly by Scribe
  // Hack to get it to appear in italics
  rules.defineRule
    ('level', 'combatNotes.strengthDamageAdjustment', '=', 'null');

};

/* Defines the rules related to PH Chapter 5, Feats. */
PH35.featRules = function(rules) {

  rules.defineChoice('feats', PH35.FEATS);
  rules.defineNote(PH35.featsNotes);
  for(var i = 0; i < PH35.FEATS.length; i++) {
    rules.defineRule
      ('features.' + PH35.FEATS[i], 'feats.' + PH35.FEATS[i], '=', null);
  }
  rules.defineTest(PH35.featsPrerequisites, '+/{^feats} == {featCount}');
  var allSelectable = {};
  for(var a in PH35.selectableFeatures) {
    var prefix = a.substring(0, 1).toLowerCase() +
                 a.substring(1).replace(/ /g, '');
    var features = PH35.selectableFeatures[a].split('/');
    for(var i = 0; i < features.length; i++) {
      selectable = features[i];
      rules.defineRule('features.' + selectable,
        'selectableFeatures.' + selectable, '+=', null
      );
      allSelectable[selectable] = '';
    }
  }
  rules.defineChoice('selectableFeatures', ScribeUtils.getKeys(allSelectable));
  rules.defineTest('+/{^selectableFeatures} == +/{^selectableFeatureCount}');

  // TODO Find a way to test whether the feats these rules implement are def'd
  rules.defineRule('armorClass', 'combatNotes.dodgeFeature', '+', '1');
  rules.defineRule('armorProficiency',
    'armorProficiencyLevel', '=', 'PH35.PROFICIENCY_LEVEL_NAMES[source]'
  );
  rules.defineRule('armorProficiencyLevel',
    null, '=', PH35.PROFICIENCY_NONE,
    'features.Armor Proficiency Light', '^', PH35.PROFICIENCY_LIGHT,
    'features.Armor Proficiency Medium', '^', PH35.PROFICIENCY_MEDIUM,
    'features.Armor Proficiency Heavy', '^', PH35.PROFICIENCY_HEAVY
  );
  rules.defineRule('combatNotes.dexterityMeleeAttackAdjustment',
    'combatNotes.weaponFinesseFeature', '?', null,
    'dexterityModifier', '=', 'source == 0 ? null : source'
  );
  rules.defineRule('combatNotes.strengthMeleeAttackAdjustment',
    'combatNotes.weaponFinesseFeature', '*', '0'
  );
  rules.defineRule('combatNotes.stunningFistFeature',
    'level', '=', '10 + Math.floor(source / 2)',
    'wisdomModifier', '+', null
  );
  rules.defineRule
    ('hitPoints', 'combatNotes.toughnessFeature', '+', '3 * source');
  rules.defineRule
    ('initiative', 'combatNotes.improvedInitiativeFeature', '+', '4');
  rules.defineRule
    ('magicNotes.arcaneSpellFailure', 'features.Still Spell', 'v', '0');
  rules.defineRule
    ('meleeAttack', 'combatNotes.dexterityMeleeAttackAdjustment', '+', null);
  rules.defineRule('runSpeedMultiplier', 'combatNotes.runFeature', '+', '1');
  rules.defineRule
    ('save.Fortitude', 'saveNotes.greatFortitudeFeature', '+', '2');
  rules.defineRule
    ('save.Reflex', 'saveNotes.lightningReflexesFeature', '+', '2');
  rules.defineRule('save.Will', 'saveNotes.ironWillFeature', '+', '2');
  rules.defineRule('shieldProficiency',
    'shieldProficiencyLevel', '=', 'PH35.PROFICIENCY_LEVEL_NAMES[source]'
  );
  rules.defineRule('shieldProficiencyLevel',
    null, '=', PH35.PROFICIENCY_NONE,
    'features.Shield Proficiency', '^', PH35.PROFICIENCY_HEAVY,
    'features.Shield Proficiency Tower', '^', PH35.PROFICIENCY_TOWER
  );
  rules.defineRule
    ('turningFrequency', 'combatNotes.extraTurningFeature', '+', '4 * source');
  rules.defineRule
    ('turningLevel', 'combatNotes.improvedTurningFeature', '+', '1');
  rules.defineRule('weaponProficiency',
    'weaponProficiencyLevel', '=',
      'source==' + PH35.PROFICIENCY_LIGHT + ' ? "Simple" : ' +
      'source==' + PH35.PROFICIENCY_MEDIUM + ' ? "Martial" : ' +
      '"None"'
  );
  rules.defineRule('weaponProficiencyLevel',
    null, '=', PH35.PROFICIENCY_NONE,
    'features.Weapon Proficiency Simple', '^', PH35.PROFICIENCY_LIGHT
  );

};

/* Defines the rules related to PH Chapter 10, Magic and Chapter 11, Spells. */
PH35.magicRules = function(rules) {
  rules.defineChoice('domains', PH35.DOMAINS);
  rules.defineChoice('schools', PH35.SCHOOLS);
  for(var i = 0; i < PH35.SPELLS.length; i++) {
    var pieces = PH35.SPELLS[i].split(':');
    var codes = pieces[1].split('/');
    var school = codes[codes.length - 1].substring(0, 4);
    for(var j = 0; j < codes.length - 1; j++) {
      var spell =
        pieces[0] + '(' + codes[j] + ' ' + school + ')';
      rules.defineChoice('spells', spell);
    }
  }
  rules.defineNote(PH35.domainsNotes);
  rules.defineRule
    ('armorClass', 'combatNotes.goodiesArmorClassAdjustment', '+', null);
  rules.defineRule('casterLevel',
    'casterLevelArcane', '^=', null,
    'casterLevelDivine', '^=', null
  );
  rules.defineRule('combatNotes.goodiesArmorClassAdjustment',
    'goodies.Ring Of Protection +1', '+=', null,
    'goodies.Ring Of Protection +2', '+=', 'source * 2',
    'goodies.Ring Of Protection +3', '+=', 'source * 3',
    'goodies.Ring Of Protection +4', '+=', 'source * 4'
  );
  for(var i = 0; i < PH35.DOMAINS.length; i++) {
    if(PH35.DOMAINS[i] != 'War')
      continue;
    rules.defineRule('featureNotes.warDomain',
      'deity', '=', 'PH35.deitiesFavoredWeapons[source]'
    );
    for(var a in PH35.deitiesFavoredWeapons) {
      var weapons = a.split(/\//);
      for(var j = 0; j < weapons.length; j++) {
        var weapon = weapons[j];
        var weaponNoSpace = weapon.replace(/ /g, '');
        rules.defineNote
          ('combatNotes.weaponFocus(' + weaponNoSpace + ')Feature:+1 attack');
        rules.defineRule('clericFeatures.Weapon Focus (' + weapon + ')',
          'featureNotes.warDomain', '=',
          'source.indexOf("' + weapon + '") >= 0 ? 1 : null'
        );
      }
    }
  }
};

/* Defines the rules related to PH Chapter 2, Races. */
PH35.raceRules = function(rules) {

  rules.defineRule('languageCount', 'race', '=', 'source != "Human" ? 2 : 1');
  rules.defineRule('languages.Common', null, '=', '1');

  for(var i = 0; i < PH35.RACES.length; i++) {

    var adjustment, features, notes;
    var race = PH35.RACES[i];

    if(race == 'Dwarf') {

      adjustment = '+2 constitution/-2 charisma';
      features = [
        'Darkvision', 'Dodge Giants', 'Dwarf Favored Enemy', 'Know Depth',
        'Magic Resistance', 'Natural Smith', 'Poison Resistance', 'Slow',
        'Stability', 'Stonecunning'
      ];
      notes = [
        'abilityNotes.dwarfArmorSpeedAdjustment:No speed penalty in armor',
        'combatNotes.dodgeGiantsFeature:+4 AC vs. giant creatures',
        'combatNotes.dwarfFavoredEnemyFeature:' +
          '+1 vs. bugbear/goblin/hobgoblin/orc',
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness',
        'featureNotes.knowDepthFeature:Intuit approximate depth underground',
        'saveNotes.magicResistanceFeature:+2 vs. spells',
        'saveNotes.poisonResistanceFeature:+%V vs. poison',
        'saveNotes.stabilityFeature:+4 vs. Bull Rush/Trip',
        'skillNotes.naturalSmithFeature:' +
           '+2 Appraise/Craft involving stone or metal',
        'skillNotes.stonecunningFeature:' +
          '+2 Search involving stone or metal/automatic check w/in 10 ft'
      ];
      rules.defineRule('abilityNotes.armorSpeedAdjustment',
        'abilityNotes.dwarfArmorSpeedAdjustment', '^', '0'
      );
      rules.defineRule('abilityNotes.dwarfArmorSpeedAdjustment',
        'race', '=', 'source == "Dwarf" ? 1 : null'
      );
      rules.defineRule
        ('resistance.Magic', 'saveNotes.magicResistanceFeature', '+=', '2');
      rules.defineRule
        ('resistance.Poison', 'saveNotes.poisonResistanceFeature', '+=', null);
      // TODO This cooperates with the Assassin's variable poison resistance,
      // but precludes another race with poison resistance
      rules.defineRule('saveNotes.poisonResistanceFeature',
        'race', '+=', 'source == "Dwarf" ? 2 : null'
      );
      rules.defineRule('speed', 'features.Slow', '+', '-10');

    } else if(race == 'Elf') {

      adjustment = '+2 dexterity/-2 constitution';
      features = [
        'Enchantment Resistance', 'Keen Senses', 'Low Light Vision',
        'Sense Secret Doors', 'Sleep Immunity'
      ];
      notes = [
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'featureNotes.senseSecretDoorsFeature:' +
          'Automatic Search when within 5 ft',
        'saveNotes.enchantmentResistanceFeature:+2 vs. enchantment',
        'saveNotes.sleepImmunityFeature:Immune <i>Sleep</i>',
        'skillNotes.keenSensesFeature:+2 Listen/Search/Spot'
      ];
      rules.defineRule('resistance.Enchantment',
        'saveNotes.enchantmentResistanceFeature', '+=', '2'
      );

    } else if(race == 'Gnome') {

      adjustment = '+2 constitution/-2 strength';
      features = [
        'Dodge Giants', 'Gnome Favored Enemy', 'Gnome Spells',
        'Illusion Resistance', 'Keen Ears', 'Keen Nose', 'Low Light Vision',
        'Natural Illusionist', 'Slow', 'Small'
      ];
      notes = [
        'combatNotes.dodgeGiantsFeature:+4 AC vs. giant creatures',
        'combatNotes.gnomeFavoredEnemyFeature:' +
           '+1 vs. bugbear/goblin/hobgoblin/kobold',
        'combatNotes.smallFeature:+1 AC/attack',
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'magicNotes.gnomeSpellsFeature:%V 1/day',
        'magicNotes.naturalIllusionistFeature:+1 DC on illusion spells',
        'saveNotes.illusionResistanceFeature:+2 vs. illusions',
        'skillNotes.keenEarsFeature:+2 Listen',
        'skillNotes.smallFeature:+4 Hide',
        'skillNotes.keenNoseFeature:+2 Craft (Alchemy)'
      ];
      rules.defineRule('armorClass', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('magicNotes.gnomeSpellsFeature',
        'charisma', '=',
        '(source >= 10 ? "<i>Dancing Lights</i>/<i>Ghost Sound</i>/' +
        '<i>Prestidigitation</i>/" : "") + "<i>Speak With Animals</i>"'
      );
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('resistance.Illusion',
        'saveNotes.illusionResistanceFeature', '+=', '2'
      );
      rules.defineRule('speed', 'features.Slow', '+', '-10');

    } else if(race == 'Half Elf') {

      adjustment = null;
      features = [
        'Alert Senses', 'Enchantment Resistance', 'Low Light Vision',
        'Sleep Immunity', 'Tolerance'
      ];
      notes = [
        'featureNotes.lowLightVisionFeature:' +
          'Double normal distance in poor light',
        'saveNotes.enchantmentResistanceFeature:+2 vs. enchantment',
        'saveNotes.sleepImmunityFeature:Immune <i>Sleep</i>',
        'skillNotes.alertSensesFeature:+1 Listen/Search/Spot',
        'skillNotes.toleranceFeature:+2 Diplomacy/Gather Information'
      ];
      rules.defineRule('resistance.Enchantment',
        'saveNotes.enchantmentResistanceFeature', '+=', '2'
      );

    } else if(race == 'Half Orc') {

      adjustment = '+2 strength/-2 intelligence/-2 charisma';
      features = ['Darkvision'];
      notes = [
        'featureNotes.darkvisionFeature:60 ft b/w vision in darkness'
      ];

    } else if(race == 'Halfling') {

      adjustment = '+2 dexterity/-2 strength';
      features = [
        'Accurate', 'Fortunate', 'Keen Ears', 'Slow', 'Small', 'Spry',
        'Unafraid'
      ];
      notes = [
        'combatNotes.accurateFeature:+1 attack with slings/thrown',
        'combatNotes.smallFeature:+1 AC/attack',
        'saveNotes.fortunateFeature:+1 all saves',
        'saveNotes.unafraidFeature:+2 vs. fear',
        'skillNotes.keenEarsFeature:+2 Listen',
        'skillNotes.smallFeature:+4 Hide',
        'skillNotes.spryFeature:+2 Climb/Jump/Move Silently'
      ];
      rules.defineRule('armorClass', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('meleeAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule('rangedAttack', 'combatNotes.smallFeature', '+', '1');
      rules.defineRule
        ('resistance.Fear', 'saveNotes.unafraidFeature', '+=', '2');
      rules.defineRule('speed', 'features.Slow', '+', '-10');
      rules.defineRule('save.Fortitude','saveNotes.fortunateFeature','+','1');
      rules.defineRule('save.Reflex', 'saveNotes.fortunateFeature', '+', '1');
      rules.defineRule('save.Will', 'saveNotes.fortunateFeature', '+', '1');

    } else if(race == 'Human') {

      adjustment = null;
      features = null;
      notes = null;
      rules.defineRule
        ('featCount', 'featureNotes.humanFeatCountBonus', '+', null);
      rules.defineRule('featureNotes.humanFeatCountBonus',
        'race', '+=', 'source == "Human" ? 1 : null'
      );
      rules.defineRule('skillNotes.humanSkillPointsBonus',
        'race', '?', 'source == "Human"',
        'level', '=', 'source + 3'
      );
      rules.defineRule
        ('skillPoints', 'skillNotes.humanSkillPointsBonus', '+', null);

    } else
      continue;

    rules.defineRace(race, adjustment, features);
    if(notes != null) {
      rules.defineNote(notes);
    }

  }

};

/* Defines the rules related to PH Chapter 4, Skills. */
PH35.skillRules = function(rules) {

  var abilityNames = {
    'cha':'charisma', 'con':'constitution', 'dex':'dexterity',
    'int':'intelligence', 'str':'strength', 'wis':'wisdom'
  };
  rules.defineChoice('skills', PH35.SKILLS);
  for(var a in PH35.skillsSynergies) {
    var prefix = a.substring(0, 1).toLowerCase() +
                 a.substring(1).replace(/ /g, '');
    rules.defineNote
      ('skillNotes.' + prefix + 'Synergy:+2 ' + PH35.skillsSynergies[a]);
    // Second notes for a couple synergies to distinguish bonuses automatically
    // applied by Scribe from those the DM must apply.
    if(a == 'Bluff') {
      rules.defineNote('skillNotes.bluffSynergy2:+2 Disguise (acting)');
      rules.defineRule('skillNotes.bluffSynergy2',
        'skills.Bluff', '=', 'source >= 5 ? 1 : null'
      );
    } else if(a == 'Handle Animal') {
      rules.defineNote
        ('skillNotes.handleAnimalSynergy2:+2 Wild Empathy checks');
      rules.defineRule('skillNotes.handleAnimalSynergy2',
        'skills.Handle Animal', '=', 'source >= 5 ? 1 : null'
      );
    }
  }
  rules.defineRule('skillNotes.bardicKnowledgeFeature',
    'skillNotes.knowledge(History)Synergy', '+', '2'
  );
  rules.defineRule('skillNotes.wildEmpathyFeature',
    'skillNotes.handleAnimalSynergy', '+', '2'
  );
  rules.defineRule('turningBase',
    'skillNotes.knowledge(Religion)Synergy', '+', '2/3'
  );
  for(var i = 0; i < PH35.SKILLS.length; i ++) {
    var pieces = PH35.SKILLS[i].split(/[:\/]/);
    var ability = pieces[1] == null ? '' : pieces[1];
    if(abilityNames[ability] != null) {
      var modifier = abilityNames[ability] + 'Modifier';
      rules.defineRule('skills.' + pieces[0], modifier, '+', null);
    }
  }

  // Speak Language-related rules
  rules.defineChoice('languages', PH35.LANGUAGES);
  rules.defineTest('+/{^languages} == {languageCount}');
  rules.defineRule('languageCount', 'skills.Speak Language', '+', null);

};

/* Returns a random name for a character of race #race#. */
PH35.randomName = function(race) {

  /* Return a random character from #string#. */
  function randomChar(string) {
    return string.charAt(ScribeUtils.random(0, string.length - 1));
  }

  if(race == null)
    race = 'Human';
  else if(race == 'Half Elf')
    race = ScribeUtils.random(0, 99) < 50 ? 'Elf' : 'Human';
  else if(race.indexOf('Dwarf') >= 0)
    race = 'Dwarf';
  else if(race.indexOf('Elf') >= 0)
    race = 'Elf';
  else if(race.indexOf('Gnome') >= 0)
    race = 'Gnome';
  else if(race.indexOf('Halfling') >= 0)
    race = 'Halfling';
  else if(race.indexOf('Orc') >= 0)
    race = 'Orc';
  else
    race = 'Human';

  var clusters = {
    B:'lr', C:'hlr', D:'r', F:'lr', G:'lnr', K:'lnr', P:'lr', S:'chklt', T:'hr',
    W:'h',
    c:'hkt', l:'cfkmnptv', m: 'p', n:'cgkt', r: 'fv', s: 'kpt', t: 'h'
  };
  var consonants =
    {'Dwarf': 'dgkmnprst', 'Elf': 'fhlmnpqswy', 'Gnome': 'bdghjlmnprstw',
     'Halfling': 'bdfghlmnprst', 'Human': 'bcdfghjklmnprstvwz',
     'Orc': 'dgjkprtvxz'}[race];
  var endConsonant = '';
  var leading = 'ghjqvwy';
  var vowels =
    {'Dwarf': 'aeiou', 'Elf': 'aeioy', 'Gnome': 'aeiou',
     'Halfling': 'aeiou', 'Human': 'aeiou', 'Orc': 'aou'}[race];
  var diphthongs = {a:'wy', e:'aei', o: 'aiouy', u: 'ae'};
  var syllables = ScribeUtils.random(0, 99);
  syllables = syllables < 50 ? 2 :
              syllables < 75 ? 3 :
              syllables < 90 ? 4 :
              syllables < 95 ? 5 :
              syllables < 99 ? 6 : 7;
  var result = '';
  var vowel;

  for(var i = 0; i < syllables; i++) {
    if(ScribeUtils.random(0, 99) <= 80) {
      endConsonant = randomChar(consonants).toUpperCase();
      if(clusters[endConsonant] != null && ScribeUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
      if(endConsonant == 'Q')
        result += 'u';
    }
    else if(endConsonant.length == 1 && ScribeUtils.random(0, 99) < 10) {
      result += endConsonant;
      endConsonant += endConsonant;
    }
    vowel = randomChar(vowels);
    if(endConsonant.length > 0 && diphthongs[vowel] != null &&
       ScribeUtils.random(0, 99) < 15)
      vowel += randomChar(diphthongs[vowel]);
    result += vowel;
    endConsonant = '';
    if(ScribeUtils.random(0, 99) <= 60) {
      while(leading.indexOf((endConsonant = randomChar(consonants))) >= 0)
        ; /* empty */
      if(clusters[endConsonant] != null && ScribeUtils.random(0, 99) < 15)
        endConsonant += randomChar(clusters[endConsonant]);
      result += endConsonant;
    }
  }
  return result.substring(0, 1).toUpperCase() +
         result.substring(1).toLowerCase();

};

/*
 * Returns a character with randomized settings for all randomizable attributes
 * except for those in #fixedAttributes#, which are copied to the result.
 */
PH35.randomizeAllAttributes = function(fixedAttributes) {
  var result = { };
  for(var a in fixedAttributes) {
    result[a] = fixedAttributes[a];
  }
  for(var i = 0; i < PH35.RANDOMIZABLE_ATTRIBUTES.length; i++) {
    var a = PH35.RANDOMIZABLE_ATTRIBUTES[i];
    if(a == 'levels') {
      var totalLevels = ScribeUtils.sumMatching(result, /^levels\./);
      if(ScribeUtils.sumMatching(result, /^levels\./) == 0) {
        PH35.randomizeOneAttribute(result, a);
      }
      var totalLevels = ScribeUtils.sumMatching(result, /^levels\./);
      result.experience = totalLevels * (totalLevels - 1) * 1000 / 2;
    } else if(result[a] == null) {
      PH35.randomizeOneAttribute(result, a);
    }
  }
  return result;
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
PH35.randomizeOneAttribute = function(attributes, attribute) {

  /*
   * Randomly selects #howMany# elements of the array #choices#, prepends
   * #prefix# to each, and sets those attributes in #attributes# to #value#.
   */
  function pickAttrs(attributes, prefix, choices, howMany, value) {
    var remaining = [].concat(choices);
    for(var i = 0; i < howMany && remaining.length > 0; i++) {
      var which = ScribeUtils.random(0, remaining.length - 1);
      attributes[prefix + remaining[which]] = value;
      remaining = remaining.slice(0, which).concat(remaining.slice(which + 1));
    }
  }

  var attr;
  var attrs;
  var choices;
  var howMany;
  var i;

  if(attribute == 'deity') {
    /* Pick a deity that's no more than one alignment position removed. */
    var aliInfo = attributes.alignment.match(/^([CLN]).* ([GEN])/);
    var aliPat;
    if(aliInfo == null) /* Neutral character */
      aliPat = '\\((N |N.|.N)';
    else if(aliInfo[1] == 'N')
      aliPat = '\\((N |.' + aliInfo[2] + ')';
    else if(aliInfo[2] == 'N')
      aliPat = '\\((N |' + aliInfo[1] + '.)';
    else
      aliPat = '\\(([N' + aliInfo[1] + '][N' + aliInfo[2] + '])';
    choices = [];
    for(attr in PH35.rules.getChoices('deities')) {
      if(attr.match(aliPat))
        choices[choices.length] = attr;
    }
    if(choices.length > 0) {
      attributes['deity'] = choices[ScribeUtils.random(0, choices.length - 1)];
    }
  } else if(attribute == 'feats') {
    attrs = PH35.rules.applyRules(attributes);
    howMany = attrs.featCount;
    var selections = {};
    for(attr in PH35.rules.getChoices('feats')) {
      if(attrs['feats.' + attr] != null)
        howMany--;
      else if(attrs['features.' + attr] == null)
        selections['feats.' + attr] = 1;
    }
    while(howMany > 0 &&
          (choices = ScribeUtils.getKeys(selections)).length > 0) {
      attr = choices[ScribeUtils.random(0, choices.length - 1)];
      attrs[attr] = 1;
      var invalid = Scribe.validate(attrs);
      for(i = 0; i < invalid.length && invalid[i].indexOf(attr) < 0; i++)
        ; /* empty */
      if(i < invalid.length) {
        delete attrs[attr];
      } else {
        attributes[attr] = true;
        delete selections[attr];
        howMany--;
      }
    }
  } else if(attribute == 'hitPoints') {
    attributes.hitPoints = 0;
    for(var klass in PH35.rules.getChoices('classes')) {
      if((attr = attributes['levels.' + klass]) == null)
        continue;
      var matchInfo =
        PH35.rules.getChoices('classes')[klass].match(/^((\d+)?d)?(\d+)$/);
      var number = matchInfo == null || matchInfo[2] == null ? 1 : matchInfo[2];
      var sides = matchInfo == null || matchInfo[3] == null ? 6 : matchInfo[3];
      attributes.hitPoints += number * sides;
      while(--attr > 0)
        attributes.hitPoints += ScribeUtils.random(number, number * sides);
    }
  } else if(attribute == 'languages') {
    attrs = PH35.rules.applyRules(attributes);
    var race = attributes.race;
    race = race == null ? '' : attributes.race.replace(/.* /, '');
    attributes['languages.Common'] = 1;
    if(race != 'Human')
      attributes['languages.' + race] = 1;
    choices = [];
    for(attr in PH35.rules.getChoices('languages')) {
      if(attributes['languages.' + attr] == null)
        choices[choices.length] = attr;
    }
    howMany = attrs.languageCount;
    pickAttrs(attributes, 'languages.', choices,
              howMany - ScribeUtils.sumMatching(attributes, /^languages\./),
              true);
  } else if(attribute == 'levels') {
    for(attr in attributes) {
      if(attr.indexOf('levels.') == 0)
        delete attributes[attr];
    }
    choices = ScribeUtils.getKeys(PH35.rules.getChoices('classes'));
    var classes = ScribeUtils.random(1, 100);
    classes = classes <= 85 ? 1 : classes <= 95 ? 2 : 3;
    for(i = 0; i < classes; i++) {
      var level = ScribeUtils.random(1, 100);
      level = level<=50 ? 1 : level<=75 ? 2 : level<=87 ? 3 :
              level<=93 ? 4 : level<=96 ? 5 : level<=98 ? 6 : level<=99 ? 7 : 8;
      pickAttrs(attributes, 'levels.', choices, 1, level);
    }
    attrs = PH35.rules.applyRules(attributes);
    howMany = attrs.domainCount;
    if(howMany != null) {
      if((choices = PH35.rules.getChoices('deities')[attributes.deity]) == null)
        choices = ScribeUtils.getKeys(PH35.rules.getChoices('domains'));
      else
        choices = choices.split('/');
      pickAttrs(attributes, 'domains.', choices,
                howMany - ScribeUtils.sumMatching(/^domains\./), true);
    }
  } else if(attribute == 'name') {
    attributes['name'] = PH35.randomName(attributes['race']);
  } else if(attribute == 'features') {
    attrs = PH35.rules.applyRules(attributes);
    for(attr in attrs) {
      if(!attr.match(/^selectableFeatureCount\./))
        continue;
      choices = PH35.selectableFeatures[attr.substring(attr.indexOf('.') + 1)];
      if(choices == null)
        continue;
      choices = choices.split('/');
      howMany = attrs[attr];
      var selections = {};
      for(i = 0; i < choices.length; i++) {
        attr = choices[i];
        if(attrs['selectableFeatures.' + attr] != null)
          howMany--;
        else if(attrs['features.' + attr] == null)
          selections['selectableFeatures.' + attr] = 1;
      }
      while(howMany > 0 &&
            (choices = ScribeUtils.getKeys(selections)).length > 0) {
        attr = choices[ScribeUtils.random(0, choices.length - 1)];
        attrs[attr] = 1;
        var invalid = Scribe.validate(attrs);
        for(i = 0; i < invalid.length && invalid[i].indexOf(attr) < 0; i++)
          ; /* empty */
        if(i < invalid.length) {
          delete attrs[attr];
        } else {
          attributes[attr] = 1;
          delete selections[attr];
          howMany--;
        }
      }
    }
  } else if(attribute == 'skills') {
    attrs = PH35.rules.applyRules(attributes);
    var maxRanks = attrs.classSkillMaxRanks;
    var skillPoints = attrs.skillPoints;
    choices = [];
    for(attr in PH35.rules.getChoices('skills')) {
      if(attrs['skills.' + attr] == null)
        choices[choices.length] = attr;
      else
        skillPoints -= attrs['skills.' + attr] *
                       (attrs['classSkills.' + attr] != null ? 1 : 2);
    }
    while(skillPoints > 0 && choices.length > 0) {
      var pickClassSkill = ScribeUtils.random(0, 99) >= 15;
      i = ScribeUtils.random(0, choices.length - 1);
      attr = choices[i];
      if((attrs['classSkills.' + attr] != null) != pickClassSkill)
        continue;
      var points = ScribeUtils.random(0, 99) < 60 ?
        maxRanks : ScribeUtils.random(1, maxRanks - 1);
      if(points > skillPoints)
        points = skillPoints;
      if(pickClassSkill)
        attributes['skills.' + attr] = points;
      else {
        if(points % 2 == 1)
          points--;
        if(points == 0)
          continue;
        attributes['skills.' + attr] = points / 2;
      }
      skillPoints -= points;
      choices = choices.slice(0, i).concat(choices.slice(i + 1));
      if((i = attr.indexOf(' (')) >= 0) {
        /* Select only one of a set of subskills (Craft, Perform, etc.) */
        attr = attr.substring(0, i);
        for(i = choices.length - 1; i >= 0; i--)
          if(choices[i].search(attr) == 0)
            choices = choices.slice(0, i).concat(choices.slice(i + 1));
      }
    }
  } else if(attribute == 'spells') {
    var matchInfo;
    var prohibitPat = ' (xxxx';
    var spellLevel;
    var unknownSpellsByLevel = {};
    attrs = PH35.rules.applyRules(attributes);
    for(attr in PH35.rules.getChoices('schools')) {
      if(attrs['prohibit.' + attr])
         prohibitPat += '|' + attr.substring(0, 4);
    }
    prohibitPat += ')\\)';
    for(attr in PH35.rules.getChoices('spells')) {
      if(attrs['spells.' + attr] != null || attr.match(prohibitPat)) {
        continue;
      }
      spellLevel = attr.split(/\(/)[1].split(/ /)[0];
      if(unknownSpellsByLevel[spellLevel] == null)
        unknownSpellsByLevel[spellLevel] = [];
      unknownSpellsByLevel[spellLevel]
        [unknownSpellsByLevel[spellLevel].length] = attr;
    }
    for(attr in attrs) {
      if((matchInfo = attr.match(/^spellsKnown.(.*)/)) == null) {
        continue;
      }
      spellLevel = matchInfo[1];
      howMany = attrs[attr];
      if(spellLevel.substring(0, 3) == 'Dom') {
        choices = [];
        for(var a in PH35.rules.getChoices('domains')) {
          if(attrs['domains.' + a] != null) {
            var domainLevel =
              PH35.domainsSpellCodes[a] + spellLevel.substring(3);
            if(unknownSpellsByLevel[domainLevel] != null) {
              choices = choices.concat(unknownSpellsByLevel[domainLevel]);
            }
          }
        }
      } else {
        choices = unknownSpellsByLevel[spellLevel];
      }
      if(choices != null) {
        if(howMany == 'all') {
          howMany = choices.length;
        }
        pickAttrs
          (attributes, 'spells.', choices, howMany -
           ScribeUtils.sumMatching(attributes, '^spells\\..*' + spellLevel),
           true);
      }
    }

  } else if(attribute == 'weapons') {
    choices = [];
    for(attr in PH35.rules.getChoices('weapons'))
      choices[choices.length] = attr;
    pickAttrs(attributes, 'weapons.', choices,
              2 - ScribeUtils.sumMatching(attributes, /^weapons\./), 1);
  } else if(attribute == 'charisma' || attribute == 'constitution' ||
     attribute == 'dexterity' || attribute == 'intelligence' ||
     attribute == 'strength' || attribute == 'wisdom') {
    var rolls = [];
    for(i = 0; i < 4; i++)
      rolls[i] = ScribeUtils.random(1, 6);
    rolls.sort();
    attributes[attribute] = rolls[1] + rolls[2] + rolls[3];
  } else if(PH35.rules.getChoices(attribute + 's') != null) {
    attributes[attribute] =
      ScribeUtils.randomKey(PH35.rules.getChoices(attribute + 's'));
  }

};

/* Convenience functions that invoke ScribeRules methods on the PH35 rules. */
PH35.defineChoice = function() {
  return ScribeRules.prototype.defineChoice.apply(PH35.rules, arguments);
};

PH35.defineClass = function() {
  return ScribeRules.prototype.defineClass.apply(PH35.rules, arguments);
};

PH35.defineEditorElement = function() {
  return ScribeRules.prototype.defineEditorElement.apply(PH35.rules, arguments);
};

PH35.defineNote = function() {
  return ScribeRules.prototype.defineNote.apply(PH35.rules, arguments);
};

PH35.defineRace = function() {
  return ScribeRules.prototype.defineRace.apply(PH35.rules, arguments);
};

PH35.defineRule = function() {
  return ScribeRules.prototype.defineRule.apply(PH35.rules, arguments);
};

PH35.defineSheetElement = function() {
  return ScribeRules.prototype.defineSheetElement.apply(PH35.rules, arguments);
};

PH35.defineTest = function() {
  return ScribeRules.prototype.defineTest.apply(PH35.rules, arguments);
};

PH35.getChoices = function() {
  return ScribeRules.prototype.getChoices.apply(PH35.rules, arguments);
};

PH35.getTests = function() {
  return ScribeRules.prototype.getTests.apply(PH35.rules, arguments);
};

PH35.isSource = function() {
  return ScribeRules.prototype.isSource.apply(PH35.rules, arguments);
};
