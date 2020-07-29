/*
Copyright 2019, James J. Hayes

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

"use strict";

/*
 * This module loads the Prestige class rules from the System Reference
 * Documents v3.5.  Member methods can be called independently in order to use
 * a subset of the rules.  Similarly, the constant fields of SRDPrestige
 * (CLASSES, COMPANIONS) can be thined to limit the user's choices.
 */
function SRD35Prestige() {
  if(window.SRD35 == null) {
    alert('The SRD35Prestige module requires use of the SRD35 module');
    return;
  }
  SRD35Prestige.identityRules(SRD35.rules, SRD35Prestige.CLASSES);
  SRD35Prestige.talentRules(SRD35.rules, SRD35Prestige.FEATURES);
}

SRD35Prestige.CLASSES = {
  'Arcane Archer':
    'Require=' +
      '"baseAttack >= 6","casterLevelArcane >= 1",' +
      '"features.Point-Blank Shot","features.Precise Shot",' +
      '"features.Weapon Focus (Longbow) || features.Weapon Focus (Shortbow)",' +
      '"race =~ /Elf/" ' +
    'HitDie=d8 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=Craft,Hide,Listen,"Move Silently",Ride,Spot,Survival,"Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)","1:Enhance Arrow","2:Imbue Arrow",' +
      '"4:Seeker Arrow","6:Phase Arrow","8:Hail Of Arrows",' +
      '"10:Arrow Of Death"',
  'Arcane Trickster':
    'Require=' +
      '"alignment !~ /Lawful/","features.Sneak Attack >= 2",' +
      '"skills.Decipher Script >= 7","skills.Disable Device >= 7",' +
      '"skills.Escape Artist >= 7","skills.Knowledge (Arcana) >= 4",' +
      '"Sum /^spells.Mage Hand/ >= 1","Sum /^spells.*[BW]3/ >= 1" ' +
    'HitDie=d4 Attack=1/2 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Appraise,Balance,Bluff,Climb,Concentration,Craft,"Decipher Script",' +
      'Diplomacy,"Disable Device",Disguise,"Escape Artist",' +
      '"Gather Information",Hide,Jump,Knowledge,Listen,"Move Silently",' +
      '"Open Lock",Profession,"Sense Motive",Search,"Sleight Of Hand",' +
      '"Speak Language",Spellcraft,Spot,Swim,Tumble,"Use Rope" ' +
    'Features=' +
       '"1:Caster Level Bonus","1:Ranged Legerdemain","2:Sneak Attack",' +
       '"3:Impromptu Sneak Attack"',
  'Archmage':
    'Require=' +
      '"features.Skill Focus (Spellcraft)","Sum /^features.Spell Focus/ >= 2",'+
      '"skills.Knowledge (Arcana) >= 15","skills.Spellcraft >= 15",' +
      '"Sum /^spells.*[BW]7/ >= 1" ' +
      // TODO level 5 from 5 schools
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=Concentration,"Craft (Alchemy)",Knowledge,Profession,Search,' +
    'Spellcraft ' +
    'Features="1:Caster Level Bonus" ' +
    'Selectables=' +
      '"1:Arcane Fire","1:Arcane Reach","1:Improved Arcane Reach",' +
      '"1:Mastery Of Counterspelling","1:Mastery Of Elements",' +
      '"1:Mastery Of Shaping","1:Spell Power","1:Spell-Like Ability"',
  'Assassin':
    'Require=' +
      '"alignment =~ /Evil/","skills.Disguise >= 4","skills.Hide >= 8",' +
      '"skills.Move Silently >= 8" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Bluff,Climb,Craft,"Decipher Script",Diplomacy,' +
      '"Disable Device",Disguise,"Escape Artist",Forgery,' +
      '"Gather Information"Hide,Intimidate,Jump,Listen,"Move Silently",' +
      '"Open Lock",Search,"Sense Motive","Sleight Of Hand",Spot,Swim,Tumble,' +
      '"Use Magic Device","Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Dagger/Dart/Hand Crossbow/Heavy Crossbow/Light Crossbow/Punching Dagger/Rapier/Sap/Shortbow/Composit Shortbow/Short Sword)",' +
      '"1:Death Attack","1:Poison Use","1:Sneak Attack","2:Poison Tolerance",' +
      '"2:Uncanny Dodge","5:Improved Uncanny Dodge","8:Hide In Plain Sight" ' +
    'CasterLevelArcane=Level ' +
    'SpellAbility=intelligence ' +
    'SpellsPerDay=' +
      'AS1:1=0;2=1;3=2;4=3,' +
      'AS2:3=0;4=1;5=2;6=3,' +
      'AS3:5=0;6=1;7=2;8=3,' +
      'AS4:7=0;8=1;9=2;10=3 ' +
    'Spells=' +
      '"AS1:Detect Poison;Disguise Self;Feather Fall;Ghost Sound;Jump;' +
      'Obscuring Mist;Sleep;True Strike",' +
      '"AS2:Alter Self;Cat\'s Grace;Darkness;Fox\'s Cunning;Illusory Script;' +
      'Invisibility;Pass Without Trace;Spider Climb;Undetectable Alignment",' +
      '"AS3:Deep Slumber;Deeper Darkness;False Life;' +
      'Magic Circle Against Good;Misdirection;Nondetection",' +
      '"AS4:Clairaudience/Clairvoyance;Dimension Door;Freedom Of Movement;' +
      'Glibness;Greater Invisibility;Locate Creature;Modify Memory;Poison"',
  'Blackguard':
    'Require=' +
      '"alignment =~ /Evil/","baseAttack >= 6",features.Cleave,' +
      '"features.Improved Sunder","features.Power Attack","skills.Hide >= 5",' +
      '"skills.Knowledge (Religion) >= 2" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Concentration,Craft,Diplomacy,"Handle Animal",Heal,Hide,Intimidate,' +
      '"Knowledge (Religion)",Profession,Ride ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)","1:Aura Of Evil",' +
      '"1:Blackguard Hands","1:Detect Good","1:Fiendish Summoning",' +
      '"1:Poison Use","2:Smite Good","2:Dark Blessing","3:Aura Of Despair",' +
      '"3:Turn Undead","4:Sneak Attack","5:Fiendish Servant",' +
      '"5:Undead Companion" ' +
    'CasterLevelDivine=Level ' +
    'SpellAbility=wisdom ' +
    'SpellsPerDay=' +
      'BL1:1=0;2=1;7=2,' +
      'BL2:3=0;4=1;9=2,' +
      'BL3:5=0;6=1;10=2,' +
      'BL4:7=0;8=1 ' +
    'Spells=' +
      '"BL1:Cause Fear;Corrupt Weapon;Cure Light Wounds;Detect Good;Doom;' +
      'Inflict Light Wounds;Magic Weapon;Summon Monster I",' +
      '"BL2:Bull\'s Strength;Cure Moderate Wounds;Darkness;Death Knell;' +
      'Eagle\'s Splendor;Inflict Moderate Wounds;Shatter;Summon Monster II",' +
      '"BL3:Contagion;Cure Serious Wounds;Deeper Darkness;' +
      'Inflict Serious Wounds;Protection From Energy;Summon Monster III",' +
      '"BL4:Cure Critical Wounds;Freedom Of Movement;Inflict Critical Wounds;' +
      'Poison;Summon Monster IV"',
  'Dragon Disciple':
    'Require=' +
      'languages.Draconic,"race !~ /Dragon/",' +
      '"skills.Knowledge (Arcana) >= 8" ' +
      // TODO arcane spells w/out prep
    'HitDie=d12 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Diplomacy,"Escape Artist","Gather Information",' +
      'Knowledge,Listen,Profession,Search,"Speak Language",Spellcraft,Spot ' +
    'Features=' +
      '"1:Bonus Spells","1:Dragon Armor","2:Bite Attack","2:Claw Attack",' +
      '"2:Strength Boost","3:Breath Weapon","5:Blindsense",' +
      '"6:Constitution Boost","8:Intelligence Boost","9:Wings",' +
      '"10:Darkvision","10:Dragon Apotheosis","10:Low-Light Vision"',
  'Duelist':
    'Require=' +
      '"baseAttack >= 6",features.Dodge,features.Mobility,' +
      '"features.Weapon Finesse","Sum /^skills.Perform/ >= 6",' +
      '"skills.Tumble >= 5" ' +
    'HitDie=d10 Attack=1 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Bluff,"Escape Artist",Jump,Listen,Perform,"Sense Motive",' +
      'Spot,Tumble ' +
    'Features=' +
      '"1:Weapon Proficiency (Martial)","1:Canny Defense",' +
      '"2:Improved Reaction","3:Enhanced Mobility",4:Grace,' +
      '"5:Precise Strike","6:Acrobatic Charge","7:Elaborate Parry",' +
      '"9:Deflect Arrows"',
  'Dwarven Defender':
    'Require=' +
      '"alignment =~ /Lawful/","baseAttack >= 7",features.Dodge,' +
      'features.Endurance,features.Toughness,"race =~ /Dwarf/" ' +
    'HitDie=d12 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=Craft,Listen,"Sense Motive",Spot ' +
    'Features=' +
      '"1:Armor Proficiency (Heavy)","1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)","1:Defender Armor",' +
      '"1:Defensive Stance","2:Uncanny Dodge","4:Trap Sense",' +
      '"6:Damage Reduction","6:Improved Uncanny Dodge","8:Mobile Defense"',
  'Eldritch Knight':
    'Require=' +
      '"features.Weapon Proficiency (Martial)","Sum /^spells.*[BW]3/ >= 1" ' +
    'HitDie=d6 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Concentration,Craft,"Decipher Script",Jump,"Knowledge (Arcana)",' +
      '"Knowledge (Nobility)",Ride,"Sense Motive",Spellcraft,Swim ' +
    'Features="2:Caster Level Bonus"',
  'Hierophant':
    'Require=' +
      '"skills.Knowledge (Religion) >= 15","Sum /^spells.*[CD]7/ >= 1" ' +
      // TODO any metamagic feat
    'HitDie=d8 Attack=1/2 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Diplomacy,Heal,"Knowledge (Arcana)",' +
      '"Knowledge (Religion)",Profession,Spellcraft ' +
    'Selectables=' +
      '"1:Blast Infidel","1:Divine Reach","1:Faith Healing",' +
      '"1:Gift Of The Divine","1:Improved Divine Reach",' +
      '"1:Mastery Of Energy","1:Spell Power","1:Spell-Like Ability",' +
      '"levels.Druid > 0 ? 1:Power Of Nature"',
  'Horizon Walker':
    'Require=features.Endurance,"skills.Knowledge (Geography) >= 8" ' +
    'HitDie=d8 Attack=1 SkillPoints=4 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Balance,Climb,Diplomacy,"Handle Animal",Hide,"Knowledge (Geography)",' +
      'Listen,"Move Silently",Profession,Ride,"Speak Language",Spot,Survival ' +
    'Selectables=' +
      '"1:Terrain Mastery (Aquatic)","1:Terrain Mastery (Desert)",' +
      '"1:Terrain Mastery (Forest)","1:Terrain Mastery (Hills)",' +
      '"1:Terrain Mastery (Marsh)","1:Terrain Mastery (Mountains)",' +
      '"1:Terrain Mastery (Plains)","1:Terrain Mastery (Underground)",' +
      '"6:Terrain Mastery (Aligned)","6:Terrain Mastery (Cavernous)",' +
      '"6:Terrain Mastery (Cold)","6:Terrain Mastery (Fiery)",' +
      '"6:Terrain Mastery (Shifting)","6:Terrain Mastery (Weightless)"',
  'Loremaster':
    'Require=' +
      '"Sum /^features.Skill Focus .Knowledge/ >= 1",' +
      '"Sum /^spells.*Divi/ >= 7","Sum /^spells.*3 Divi/ >= 1" ' +
      // TODO 2 skills.Knowledge >= 10,3 Item Creation/Metamagic feats
    'HitDie=d4 Attack=1/2 SkillPoints=4 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Appraise,Concentration,"Craft (Alchemy)","Decipher Script",' +
      '"Gather Information","Handle Animal",Heal,Knowledge,Perform,' +
      'Profession,"Speak Language",Spellcraft,"Use Magic Device" ' +
    'Features=' +
      '"1:Caster Level Bonus",2:Lore,"4:Bonus Language","6:Greater Lore",' +
      '"10:True Lore" ' +
    'Selectables=' +
      '"1:Applicable Knowledge","1:Dodge Trick","1:Instant Mastery",' +
      '"1:More Newfound Arcana","1:Newfound Arcana","1:Secret Health",' +
      '"1:Secret Knowledge Of Avoidance","1:Secrets Of Inner Strength",' +
      '"1:The Lore Of True Stamina","1:Weapon Trick"',
  'Mystic Theurge':
    'Require=' +
      '"casterLevelArcane >= 2","casterLevelDivine >= 2",' +
      '"skills.Knowledge (Arcana) >= 6","skills.Knowlege (Religion) >= 6" ' +
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/2 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,"Decipher Script","Knowledge (Arcana)",' +
      '"Knowledge (Religion)",Profession,"Sense Motive",Spellcraft ' +
    'Features="1:Caster Level Bonus"',
  'Shadowdancer':
    'Require=' +
      '"Combat Reflexes",Dodge,Mobility,"skills.Hide >= 10",' +
      '"skills.Move Silently >= 8","skills.Perform (Dance) >= 5" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Balance,Bluff,"Decipher Script",Diplomacy,Disguise,"Escape Artist",' +
      'Hide,Jump,Listen,"Move Silently",Perform,Profession,Search,' +
      '"Sleight Of Hand",Spot,Tumble,"Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Club/Composite Shortbow/Dagger/Dart/Hand Crossbow/Heavy Crossbow/Light Crossbow/Mace/Morningstar/Punching Dagger/Quaterstaff/Rapier/Sap/Shortbow/Short Sword)",' +
      '"1:Hide In Plain Sight",2:Darkvision,2:Evasion,"2:Uncanny Dodge",' +
      '"3:Shadow Illusion","3:Summon Shadow","4:Shadow Jump",' +
      '"5:Defensive Roll","5:Improved Uncanny Dodge","7:Slippery Mind",' +
      '"10:Improved Evasion"',
  'Thaumaturgist':
    'Require="features.Spell Focus (Conjuration)",' +
    '"features.Lesser Planar Ally" ' +
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      'Concentration,Craft,Diplomacy,"Knowledge (Planes)",' +
      '"Knowledge (Religion)",Profession,"Sense Motive","Speak Language",' +
      'Spellcraft ' +
    'Features="1:Caster Level Bonus","1:Improved Ally","2:Augment Summoning",' +
      '"3:Extended Summoning","4:Contingent Conjuration","5:Planar Cohort"'
};
SRD35Prestige.FEATURES = {
  'Acrobatic Charge':'combat:May charge in difficult terrain',
  'Applicable Knowledge':'feature:Bonus feat',
  'Arcane Fire':'magic:Transform arcane spell into bolt of fire',
  'Arcane Reach':"magic:Use arcane touch spell 30' away",
  'Arrow Of Death':
    'combat:Special arrow requires foe DC 20 fortitude check or die',
  'Aura Of Despair':"combat:All foes within 10' -2 all saves",
  'Aura Of Evil':'magic:Visible to <i>Detect Evil</i>',
  'Bite Attack':'combat:Attack with bite',
  'Blackguard Hands':'magic:Heal %V HP/dy to self or servant',
  'Blast Infidel':
    'magic:Negative energy spells vs. opposed-alignment foe have max effect',
  'Blindsense':
    "feature:Other senses allow detection of unseen objects w/in 30'",
  'Blood Bond':
    'companion:+2 attack, checks, and saves when seeing master threatened',
  'Bonus Language':'feature:%V additional language(s)',
  'Bonus Spells':'magic:%V',
  'Breath Weapon':'combat:Breathe %Vd8 HP (DC %1 Ref half) 1/dy',
  'Canny Defense':'combat:Add %V to melee AC when unarmored',
  'Caster Level Bonus':
    'magic:+%V base class level for spells known and spells per day',
  'Claw Attack':'combat:Attack with claws',
  'Constitution Boost':'ability:+2 Constitution',
  'Contingent Conjuration':'magic:<i>Contingency</i> on summoning spell',
  'Dark Blessing':'save:+%V Fortitude/+%V Reflex/+%V Will',
  'Death Attack':
    'combat:Foe DC %V fortitude save on successful sneak attack after 3 rd of study or die/paralyzed d6+%1 rd',
  'Defender Armor':'combat:+%V AC',
  'Defensive Stance':
     'feature:+2 Str, +4 Con, +2 saves, +4 AC while unmoving %V rd %1/dy',
  'Detect Good':'magic:<i>Detect Good</i> at will',
  'Divine Reach':"magic:Use divine touch spell 30' away",
  'Dodge Trick':'combat:+1 AC',
  'Dragon Apotheosis':[
    'ability:+4 Strength/+2 Charisma',
    'save:Immune sleep/paralysis/breath weapon energy'
  ],
  'Dragon Armor':'combat:+%V AC',
  'Elaborate Parry':'combat:+%V AC when fighting defensively',
  'Enhance Arrow':'combat:Arrows treated as +%V magic weapons',
  'Enhanced Mobility':'combat:+4 AC vs. movement AOO when unarmored',
  'Extended Summoning':'magic:Summoning spells last twice as long',
  'Faith Healing':
    'magic:Healing spells on same-aligned creature have max effect',
  'Fiendish Servant':'feature:Animal servant w/special abilities',
  'Fiendish Summoning':'magic:<i>Summon Monster I</i> as level %V caster 1/dy',
  'Gift Of The Divine':
    'feature:Transfer undead turn/rebuke to another 1-7 days',
  'Grace':'save:+2 Reflex when unarmored',
  'Greater Lore':'magic:<i>Identify</i> at will',
  'Hail Of Arrows':'combat:Simultaneously fire arrows at %V targets 1/dy',
  'Imbue Arrow':'magic:Center spell where arrow lands',
  'Impromptu Sneak Attack':'combat:Declare any attack a sneak attack %V/dy',
  'Improved Ally':'magic:Planar ally for 1/2 usual payment',
  'Improved Arcane Reach':"magic:Use arcane touch spell 60' away",
  'Improved Divine Reach':"magic:Use divine touch spell 60' away",
  'Improved Reaction':'combat:+%V Initiative',
  'Instant Mastery':'skill:+4 Skill Points in untrained skill',
  'Intelligence Boost':'ability:+2 Intelligence',
  'Lore':'skill:+%V Knowledge checks with local history',
  'Mastery Of Counterspelling':'magic:Counterspell turns effect back on caster',
  'Mastery Of Elements':'magic:Change energy type of spell',
  'Mastery Of Energy':'combat:+4 undead turning checks and damage',
  'Mastery Of Shaping':'magic:Create holes in spell effect area',
  'Mobile Defense':"combat:Allowed 5' step during Defensive Stance",
  'More Newfound Arcana':'magic:Bonus level 2 spell',
  'Newfound Arcana':'magic:Bonus level 1 spell',
  'Phase Arrow':'combat:Arrow passes through normal obstacles 1/dy',
  'Planar Cohort':'magic:Summoned creature serves as cohort',
  'Poison Tolerance':'save:+%V vs. poison',
  'Poison Use':'feature:No chance of self-poisoning when applying to blade',
  'Power Of Nature':'feature:Transfer druid feature to another 1-7 days',
  'Precise Strike':'combat:Extra %Vd6 HP with light piercing weapon',
  'Ranged Legerdemain':
    "combat:+5 DC on Disable Device, Open Lock, and Sleight Of Hand at 30' %V/dy",
  'Secret Health':'combat:+3 HP',
  'Secret Knowledge Of Avoidance':'save:+2 Reflex',
  'Secrets Of Inner Strength':'save:+2 Will',
  'Seeker Arrow':'combat:Arrow maneuvers to target 1/dy',
  'Shadow Illusion':'magic:<i>Silent Image</i> 1/dy',
  'Shadow Jump':"magic:<i>Dimension Door</i> %V'/dy",
  'Smite Good':'combat:+%V attack/+%1 damage vs. good foe %2/dy',
  'Spell Power':'magic:+1 caster level for spell effects',
  'Spell-Like Ability':'magic:Use spell as ability 2+/dy',
  'Strength Boost':'ability:+%V Strength',
  'Summon Shadow':'magic:Summon unturnable %V HD Shadow companion',
  'Terrain Mastery (Aligned)':'feature:Mimic dominant alignment of any plane',
  'Terrain Mastery (Aquatic)':[
    'combat:+1 attack and damage vs. aquatic creatures',
    "feature:+10' swim speed",
    'skill:+4 Swim'
  ],
  'Terrain Mastery (Cavernous)':'feature:Tremorsense',
  'Terrain Mastery (Cold)':[
    'combat:+1 attack and damage vs. cold elementals/outsiders',
    'save:20 DC cold resistance'
  ],
  'Terrain Mastery (Desert)':[
    'combat:+1 attack and damage vs. desert creatures',
    'save:Immune fatigue, resist exhaustion'
  ],
  'Terrain Mastery (Fiery)':[
    'combat:+1 attack and damage vs. fire elementals and fire outsiders',
    'save:20 DC fire resistance'
  ],
  'Terrain Mastery (Forest)':[
    'combat:+1 attack and damage vs. forest creatures',
    'skill:+4 Hide'
  ],
  'Terrain Mastery (Hills)':[
    'combat:+1 attack and damage vs. hill creatures',
    'skill:+4 Listen'
  ],
  'Terrain Mastery (Marsh)':[
    'combat:+1 attack and damage vs. marsh creatures',
    'skill:+4 Move Silently'
  ],
  'Terrain Mastery (Mountains)':[
    'combat:+1 attack and damage vs. mountain creatures',
    "feature:+10' climb speed",
    'skill:+4 Climb'
  ],
  'Terrain Mastery (Plains)':[
    'combat:+1 attack and damage vs. plain creatures',
    'skill:+4 Spot'
  ],
  'Terrain Mastery (Shifting)':[
    'combat:+1 attack and damage vs. shifting plane elementals and outsiders',
    'magic:<i>Dimension Door</i> every 1d4 rd'
  ],
  'Terrain Mastery (Underground)':[
    'combat:+1 attack and damage vs. underground creatures',
    "feature:+60' Darkvision"
  ],
   'Terrain Mastery (Weightless)':[
     'combat:+1 attack and damage vs. astral, elemental air, and ethereal creatures',
   "feature:+30' fly speed on gravityless planes",
  ],
  'The Lore Of True Stamina':'save:+2 Fortitude',
  'Tremorsense':"feature:Detect creatures in contact w/ground w/in 30'",
  'True Lore':'magic:<i>Legend Lore</i>, <i>Analyze Dweomer</i> 1/dy',
  'Undead Companion':
    'feature:Unturnable undead servant w/fiendish servant abilities',
  'Weapon Trick':'combat:+1 Melee Attack/+1 Ranged Attack',
  'Wings':'feature:Fly at normal land speed'
};

/* Defines the rules related to SRDv3.5 Prestige Classes. */
SRD35Prestige.identityRules = function(rules, classes) {
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
    SRD35Prestige.classRulesExtra(rules, clas);
  }
};

/* Defines rules related to character features. */
SRD35Prestige.talentRules = function(rules, features) {
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
};

/*
 * Defines in #rules# the rules associated with class #name# that are not
 * directly derived from the parmeters passed to classRules.
 */
SRD35Prestige.classRulesExtra = function(rules, name) {

  var spells = null;

  if(name == 'Arcane Archer') {

    rules.defineRule('combatNotes.enhanceArrow',
      'levels.Arcane Archer', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule
      ('combatNotes.hailOfArrows', 'levels.Arcane Archer', '+=', null);

  } else if(name == 'Arcane Trickster') {

    rules.defineRule('combatNotes.impromptuSneakAttack',
      'levels.Arcane Trickster', '+=', 'source < 7 ? 1 : 2'
    );
    rules.defineRule('combatNotes.rangedLegerdemain',
      'levels.Arcane Trickster', '+=', 'Math.floor((source + 3) / 4)'
    );
    rules.defineRule('combatNotes.sneakAttack',
      'levels.Arcane Trickster', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Arcane Trickster', '+=', null
    );

  } else if(name == 'Archmage') {

    rules.defineRule
      ('magicNotes.casterLevelBonus', 'levels.Archmage', '+=', null);
    rules.defineRule
      ('selectableFeatureCount.Archmage', 'levels.Archmage', '+=', null);

  } else if(name == 'Assassin') {

    rules.defineRule('combatNotes.deathAttack',
      'levels.Assassin', '+=', '10 + source',
      'intelligenceModifier', '+', null
    );
    rules.defineRule
      ('combatNotes.deathAttack.1', 'levels.Assassin', '+=', null);
    rules.defineRule('combatNotes.sneakAttack',
      'levels.Assassin', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('saveNotes.poisonTolerance',
      'levels.Assassin', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('assassinFeatures.Improved Uncanny Dodge',
      'assassinFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      'levels.Assassin', '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Assassin', '+=', 'source >= 2 ? 1 : null'
    );

  } else if(name == 'Blackguard') {

    rules.defineRule('combatNotes.smiteGood',
      'charismaModifier', '=', 'source > 0 ? source : 0'
    );
    rules.defineRule('combatNotes.smiteGood.1', 'levels.Blackguard', '=', null);
    rules.defineRule('combatNotes.smiteGood.2',
      'levels.Blackguard', '+=', 'source<2 ? null : 1 + Math.floor(source/5)'
    );
    rules.defineRule('combatNotes.sneakAttack',
      'levels.Blackguard', '+=', 'source<4 ? null : Math.floor((source-1)/3)'
    );
    rules.defineRule('magicNotes.blackguardHands',
      'level', '+=', null,
      'charismaModifier', '*', null
    );
    rules.defineRule('magicNotes.fiendishSummoning',
      'levels.Blackguard', '=', 'source * 2'
    );
    rules.defineRule('saveNotes.darkBlessing',
      'charismaModifier', '=', 'source > 0 ? source : null'
    );
    rules.defineRule('turningLevel',
      'levels.Blackguard', '+=', 'source > 2 ? source - 2 : null'
    );
    // Fallen paladin features
    rules.defineRule('blackguardFeatures.Blackguard Hands',
      'levels.Paladin', '?', 'source >= 3'
    );
    rules.defineRule('blackguardFeatures.Fiendish Summoning',
      'levels.Paladin', '?', 'source >= 7'
    );
    rules.defineRule('blackguardFeatures.Undead Companion',
      'levels.Paladin', '?', 'source >= 9'
    );
    rules.defineRule('combatNotes.smiteGood',
      'levels.Paladin', '+', 'source >= 9 ? 3 : source >= 5 ? 2 : 1'
    );
    // NOTE: Minor bug: this will also effect the sneak attack feature of
    // some unlikely combinations, e.g., rogue/paladin
    rules.defineRule('combatNotes.sneakAttack',
      'levels.Paladin', '+', 'source >= 5 ? 1 : null'
    );

    // Adapt Blackguard servant rules to make it a form of animal companion.
    var features = [
      '5:Companion Evasion', '5:Companion Improved Evasion', 
      '5:Empathic Link', '5:Share Saving Throws', '5:Share Spells',
      '13:Speak With Master', '16:Blood Bond', '19:Companion Resist Spells'
    ];
    SRD35.featureListRules
      (rules, features, 'Animal Companion', 'fiendishServantMasterLevel', false);
    rules.defineRule('fiendishServantMasterBaseSaveFort',
      'fiendishServantMasterLevel', '?', null,
      'levels.Blackguard', '=', SRD35.SAVE_BONUS_GOOD,
      'levels.Barbarian', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Bard', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Cleric', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Druid', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Fighter', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Monk', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Ranger', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Rogue', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Sorcerer', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Wizard', '+', SRD35.SAVE_BONUS_POOR
    );
    rules.defineRule('fiendishServantMasterBaseSaveRef',
      'fiendishServantMasterLevel', '?', null,
      'levels.Blackguard', '=', SRD35.SAVE_BONUS_POOR,
      'levels.Barbarian', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Bard', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Cleric', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Druid', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Fighter', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Monk', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Ranger', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Rogue', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Sorcerer', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Wizard', '+', SRD35.SAVE_BONUS_POOR
    );
    rules.defineRule('fiendishServantMasterBaseSaveWill',
      'fiendishServantMasterLevel', '?', null,
      'levels.Blackguard', '=', SRD35.SAVE_BONUS_POOR,
      'levels.Barbarian', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Bard', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Cleric', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Druid', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Fighter', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Monk', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Ranger', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Rogue', '+', SRD35.SAVE_BONUS_POOR,
      'levels.Sorcerer', '+', SRD35.SAVE_BONUS_GOOD,
      'levels.Wizard', '+', SRD35.SAVE_BONUS_GOOD
    );
    rules.defineRule('animalCompanionStats.AC',
      'fiendishServantMasterLevel', '+',
      'Math.max(Math.floor((source - 10) / 3) * 2 + 1, 1)'
    );
    rules.defineRule('animalCompanionStats.HD',
      'fiendishServantMasterLevel', '+',
      'Math.max(Math.floor((source - 7) / 3) * 2, 2)'
    );
    rules.defineRule('animalCompanionStats.Int',
      'fiendishServantMasterLevel', '^',
      'Math.max(Math.floor((source - 7) / 3) + 5, 6)'
    );
    rules.defineRule('animalCompanionStats.Str',
      'fiendishServantMasterLevel', '+',
      'Math.max(Math.floor((source - 7) / 3), 1)'
    );
    rules.defineRule('companionNotes.shareSavingThrows.1',
      'fiendishServantMasterBaseSaveFort', '=', null
    );
    rules.defineRule('companionNotes.shareSavingThrows.2',
      'fiendishServantMasterBaseSaveRef', '=', null
    );
    rules.defineRule('companionNotes.shareSavingThrows.3',
      'fiendishServantMasterBaseSaveWill', '=', null
    );
    rules.defineRule('fiendishServantMasterLevel',
      'levels.Blackguard', '?', 'source < 5 ? null : source',
      'level', '=', null
    );
    // Add fiendish servants choices not in the standard animal companion list
    rules.choiceRules(rules, 'Animal Companion', 'Bat', SRD35.FAMILIARS['Bat']);
    rules.choiceRules(rules, 'Animal Companion', 'Cat', SRD35.FAMILIARS['Cat']);
    rules.choiceRules
      (rules, 'Animal Companion', 'Raven', SRD35.FAMILIARS['Raven']);
    rules.choiceRules
      (rules, 'Animal Companion', 'Toad', SRD35.FAMILIARS['Toad']);

  } else if(name == 'Dragon Disciple') {

    rules.defineRule('abilityNotes.strengthBoost',
      'levels.Dragon Disciple', '+=', 'source>=4 ? 4 : source>=2 ? 2 : null'
    );
    rules.defineRule('combatNotes.breathWeapon',
      'levels.Dragon Disciple', '=', 'source < 7 ? 2 : source < 10 ? 4 : 6'
    );
    rules.defineRule('combatNotes.breathWeapon.1',
      'levels.Dragon Disciple', '=', '10 + source',
      'constitutionModifier', '+', null
    );
    rules.defineRule('combatNotes.dragonArmor',
      'levels.Dragon Disciple', '+=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('magicNotes.bonusSpells',
      'levels.Dragon Disciple', '+=',
        'source - (source == 10 ? 3 : source >= 7 ? 2 : source >= 3 ? 1 : 0)'
    );
    rules.choiceRules(rules, 'Weapon', 'Bite', 'Level=1 Category=Un Damage=d6');
    rules.choiceRules(rules, 'Weapon', 'Claw', 'Level=1 Category=Un Damage=d4');
    rules.defineRule('weapons.Bite', 'combatNotes.biteAttack', '=', '1');
    rules.defineRule('weapons.Claw', 'combatNotes.clawAttack', '=', '1');

  } else if(name == 'Duelist') {

    rules.defineRule('armorClass', 'combatNotes.cannyDefense.1', '+', null);
    rules.defineRule('combatNotes.cannyDefense',
      'intelligenceModifier', '+=', 'Math.max(source, 0)',
      'levels.Duelist', 'v', null
    );
    rules.defineRule('combatNotes.cannyDefense.1',
      'armor', '?', 'source == "None"',
      'shield', '?', 'source == "None"',
      'combatNotes.cannyDefense', '=', null
    );
    rules.defineRule
      ('combatNotes.elaborateParry', 'levels.Duelist', '+=', null);
    rules.defineRule('combatNotes.improvedReaction',
      'levels.Duelist', '+=', 'source < 2 ? null : source < 8 ? 2 : 4'
    );
    rules.defineRule('combatNotes.preciseStrike',
      'levels.Duelist', '=', 'Math.floor(source / 5)'
    );
    rules.defineRule('saveNotes.grace.1',
      'armor', '?', 'source == "None"',
      'shield', '?', 'source == "None"',
      'saveNotes.grace', '=', '2'
    );
    rules.defineRule('save.Reflex', 'saveNotes.grace.1', '+', null);

  } else if(name == 'Dwarven Defender') {

    rules.defineRule('combatNotes.damageReduction',
      'levels.Dwarven Defender', '+=', 'source<6 ? null : source<10 ? 3 : 6'
    );
    rules.defineRule('combatNotes.defenderArmor',
      'levels.Dwarven Defender', '+=', 'Math.floor((source + 2) / 3)'
    );
    rules.defineRule('featureNotes.defensiveStance',
      'constitutionModifier', '+=', 'source + 5'
    );
    rules.defineRule('featureNotes.defensiveStance.1',
      'levels.Dwarven Defender', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('saveNotes.trapSense',
      'levels.Dwarven Defender', '+=', 'Math.floor(source / 4)'
    );
    rules.defineRule('dwarvenDefenderFeatures.Improved Uncanny Dodge',
      'dwarvenDefenderFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      'levels.Dwarven Defender', '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Dwarven Defender', '+=', 'source >= 2 ? 1 : null'
    );

  } else if(name == 'Eldritch Knight') {

    rules.defineRule('featCount.Fighter', 'levels.Eldritch Knight', '+=','1');
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Eldritch Knight', '+=', 'source > 1 ? source - 1 : null'
    );
    rules.defineRule('validationNotes.eldritchKnightClassSpells',
      'levels.Eldritch Knight', '=', '-1',
      /^spellsPerDay\.(AS|B|S|W)3/, '+', '1',
      '', 'v', '0'
    );
 
  } else if(name == 'Hierophant') {

    rules.defineRule('casterLevelDivine', 'levels.Hierophant', '+=', null);
    rules.defineRule
      ('selectableFeatureCount.Hierophant', 'levels.Hierophant', '=', null);
    rules.defineRule('combatNotes.turnUndead.1',
      'combatNotes.masteryOfEnergy', '+', '4'
    );
    rules.defineRule('combatNotes.turnUndead.2',
      'combatNotes.masteryOfEnergy', '+', '4'
    );

  } else if(name == 'Horizon Walker') {

    rules.defineRule('casterLevels.Horizon Walker',
      'horizonWalkerFeatures.Terrain Mastery (Shifting)', '?', null,
      'levels.Horizon Walker', '=', null
    );
    rules.defineRule('casterLevels.Dimension Door',
      'casterLevels.Horizon Walker', '^=', null
    );
    // Set casterLevels.W to a minimal value so that spell DC will be
    // calcuated even for non-Wizard Horizon Walkers.
    rules.defineRule
      ('casterLevels.W', 'casterLevels.Horizon Walker', '^=', '1');
    rules.defineRule('features.Tremorsense',
      'features.Terrain Mastery (Cavernous)', '=', '1'
    );
    rules.defineRule('selectableFeatureCount.Horizon Walker',
      'levels.Horizon Walker', '+=', null
    );

  } else if(name == 'Loremaster') {

    rules.defineRule('casterLevelArcane', 'levels.Loremaster', '+=', null);
    rules.defineRule('featureNotes.bonusLanguage',
      'levels.Loremaster', '+=', 'Math.floor(source / 4)'
    );
    rules.defineRule
      ('magicNotes.casterLevelBonus', 'levels.Loremaster', '+=', null);
    rules.defineRule('selectableFeatureCount.Loremaster',
      'levels.Loremaster', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('skillNotes.lore',
      'levels.Loremaster', '+=', null,
      'intelligenceModifier', '+=', null
    );

  } else if(name == 'Mystic Theurge') {

    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Mystic Theurge', '+=', null
    );

  } else if(name == 'Shadowdancer') {

    rules.defineRule('casterLevels.Dimension Door',
      'levels.Shadowdancer', '^=', 'source < 4 ? null : source'
    );
    rules.defineRule('casterLevels.Silent Image',
      'levels.Shadowdancer', '^=', 'source < 3 ? null : source'
    );
    // Set casterLevels.W to a minimal value so that spell DC will be
    // calcuated even for non-Wizard Shadowdancers.
    rules.defineRule
      ('casterLevels.W', 'levels.Shadowdancer', '^=', 'source<3 ? null : 1');
    rules.defineRule('featureNotes.darkvision',
      'shadowdancerFeatures.Darkvision', '^=', '60'
    );
    rules.defineRule('magicNotes.shadowJump',
      'levels.Shadowdancer', '=',
         'source < 4 ? null : (10 * Math.pow(2, Math.floor((source-2)/2)))'
    );
    rules.defineRule('magicNotes.summonShadow',
      'levels.Shadowdancer', '=',
      'source >= 3 ? Math.floor(source / 3) * 2 : null'
    );
    rules.defineRule('shadowdancerFeatures.Improved Uncanny Dodge',
      'shadowdancerFeatures.Uncanny Dodge', '?', null,
      'uncannyDodgeSources', '=', 'source >= 2 ? 1 : null'
    );
    rules.defineRule('combatNotes.improvedUncannyDodge',
      'levels.Shadowdancer', '+=', 'source >= 2 ? source : null',
      '', '+', '4'
    );
    rules.defineRule('uncannyDodgeSources',
      'levels.Shadowdancer', '+=', 'source >= 2 ? 1 : null'
    );

  } else if(name == 'Thaumaturgist') {

    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Thaumaturgist', '+=', null
    );
  }

};
