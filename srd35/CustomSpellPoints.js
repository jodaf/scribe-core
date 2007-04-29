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
 * Defines an alternate approach to learning and casting spells that allocates
 * one spell point for each level of spell that can be cast in a day (i.e., 1
 * point for a first level spell, 2 for a second level spell, etc.)
 */
function SpellPoints() {
  // Define the spell point attribute.
  PH35.defineRule('spellPoints',
    'casterLevel', '?', null,
    null, '=', '0'
  );
  // Define rules to add the spellsPerDay values to the spellPoints attribute.
  var ruleTargets = PH35.rules.allTargets();
  for(var i = 0; i < ruleTargets.length; i++) {
    var attr = ruleTargets[i];
    var matchInfo = attr.match(/^spellsPerDay\.[A-Za-z]+([0-9]+)/);
    if(matchInfo != null) {
      PH35.defineRule('spellPoints', attr, '+', 'source * ' + matchInfo[1]);
    }
  }
  // Add spell point and remove spells per day from the character sheet.
  PH35.defineSheetElement('Spell Points', 'Spell Difficulty Class');
  PH35.defineSheetElement('Spells Per Day');
}
