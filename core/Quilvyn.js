"use strict";

var COPYRIGHT = 'Copyright 2021 James J. Hayes';
var VERSION = '2.2.25';
var ABOUT_TEXT =
'Quilvyn Character Editor version ' + VERSION + '\n' +
'The Quilvyn Character Editor is ' + COPYRIGHT + '\n' +
'This program is free software; you can redistribute it and/or modify it ' +
'under the terms of the GNU General Public License as published by the Free ' +
'Software Foundation; either version 2 of the License, or (at your option) ' +
'any later version.\n' +
'This program is distributed in the hope that it will be useful, but WITHOUT ' +
'ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or ' +
'FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for ' +
'more details.\n' +
'You should have received a copy of the GNU General Public License along ' +
'with this program; if not, write to the Free Software Foundation, Inc., 59 ' +
'Temple Place, Suite 330, Boston, MA 02111-1307 USA. ' +
'Click <a href="core/gpl.txt">here</a> to see it.\n' +
'System Reference Document material is Open Game Content released by Wizards ' +
'of the Coast under the Open Gaming License.  You should have received a ' +
'copy of the Open Gaming License with this program; if not, you can obtain ' +
'one from http://www.wizards.com/d20/files/OGLv1.0a.rtf. Click ' +
'<a href="plugins/ogl.txt">here</a> to see the license.\n' +
'Thanks to my dungeon crew, especially Rich Hakesley, Norm Jacobson, and ' +
'Caroline Rider, for patient testing of Quilvyn and for suggestions that have '+
'greatly improved it.';

var FEATURES_OF_EDIT_WINDOW =
  'height=750,width=500,menubar,resizable,scrollbars';
var FEATURES_OF_SHEET_WINDOW =
  'height=750,width=750,menubar,resizable,scrollbars,toolbar';
var FEATURES_OF_OTHER_WINDOWS =
  'height=750,width=750,menubar,resizable,scrollbars,toolbar';
var PERSISTENT_CHARACTER_PREFIX = 'QuilvynCharacter.';
var PERSISTENT_CUSTOM_PREFIX = 'QuilvynCustom.';
var PERSISTENT_CUSTOM_PLACEHOLDER = '_user';
var PERSISTENT_INFO_PREFIX = 'QuilvynInfo.';
var TIMEOUT_DELAY = 1000; // One second
// HTML tags allowed in user input; 's' and 'u' allowed though HTML deprecated
const ALLOWED_TAGS = [
  'b', 'div', 'i', 'li', 'ol', 'p', 'sub', 'sup', 'table', 'td', 'th', 'tr',
  'ul', 's', 'u'
];

var character = {};     // Displayed character attrs
var characterCache = {};// Attrs of all displayed characters, indexed by path
var characterPath = ''; // Path to most-recently opened/generated character
var characterUndo = []; // Stack of copies of character for undoing changes
var customCollection = null; // Name of current custom item collection
var customCollections = {}; // Defined custom collections, indexed by name
var editForm;           // Character editing form (editWindow.document.forms[0])
var editWindow = null;  // Window where editor is shown
var ruleSet = null;     // The rule set currently in use
var ruleSets = {};      // Registered rule sets, indexed by name
var quilvynTab = null;  // Menu/sheet tab, if requested
var sheetWindow = null; // Window where character sheet is shown
var userOptions = {     // User-settable options
  bgColor: 'wheat',     // Window background color
  bgImage: 'Images/parchment.jpg', // URL for window background
  extras: 1,            // Show extra attributes on sheet?
  hidden: 0,            // Show information marked "hidden" on sheet?
  italics: 1,           // Show italicized notes on sheet?
  separateEditor: 0,    // Display editor in separate window?
  spell: 'Slots',       // Display spell slots, points, or both
  style: 'Standard',    // Sheet style
  warnAboutDiscard: 1   // Warn before discarding character changes?
};

/* Launch routine called after all Quilvyn scripts are loaded. */
function Quilvyn() {

  if(InputGetValue == null || ObjectViewer == null || RuleEngine == null ||
     QuilvynRules == null || QuilvynUtils == null) {
    alert('JavaScript modules needed by Quilvyn are missing; exiting');
    return;
  }

  for(var a in userOptions) {
    var stored = STORAGE.getItem(PERSISTENT_INFO_PREFIX + a);
    if(stored)
      userOptions[a] = stored.match(/^\d+$/) ? stored - 0 : stored;
  }

  if(CustomizeQuilvyn != null)
    CustomizeQuilvyn();

  for(var path in STORAGE) {
    if(!path.startsWith(PERSISTENT_CUSTOM_PREFIX))
      continue;
    customCollections[path.split('.')[1].replaceAll('%2E', '.')] = '';
  }

  if(!Quilvyn.redrawUI())
    return;
  Quilvyn.refreshEditor(true);
  Quilvyn.newCharacter();

}

/* Adds #rs# to Quilvyn's list of supported rule sets. */
Quilvyn.addRuleSet = function(rs) {
  // Add a rule for handling hidden information
  rs.defineRule('hiddenNotes', 'hidden', '?', null);
  ruleSets[rs.getName()] = rs;
  ruleSet = rs;
  customCollection = rs.getName();
  customCollections[customCollection] = '';
  var prefix =
    PERSISTENT_CUSTOM_PREFIX + customCollection.replaceAll('.', '%2E') + '.';
  for(var path in STORAGE) {
    if(!path.startsWith(prefix))
      continue;
    var pieces = path.split('.');
    ruleSet.choiceRules(
      ruleSet, pieces[2].replaceAll('%2E', '.'),
      pieces[3].replaceAll('%2E', '.'), STORAGE.getItem(path)
    );
  }
};

Quilvyn.applyV2Changes = function(character) {
  var result = {};
  var npcClasses = ruleSet.getChoices('npcs');
  var prestigeClasses = ruleSet.getChoices('prestiges');
  for(var attr in character) {
    var value = character[attr];
    if(attr == 'deity')
      value = value.replace(/ \(.*/, '');
    else if(attr.match(/^domains\./))
      attr = attr.replace('domains.', 'selectableFeatures.Cleric - ') + ' Domain';
    else if(attr.match(/^levels\./)) {
      var clas = attr.replace('levels.', '');
      if(npcClasses != null && clas in npcClasses)
        attr = 'npc.' + clas;
      else if(prestigeClasses != null && clas in prestigeClasses)
        attr = 'prestige.' + clas;
    } else if(attr.match(/^prohibit\./))
      attr = attr.replace('prohibit.', 'selectableFeatures.Wizard - School Opposition (') + ')';
    else if(attr.match(/^specialize\./))
      attr = attr.replace('specialize.', 'selectableFeatures.Wizard - School Specialization (') + ')';
    attr = attr.replace(/(half) ?(elf|orc)/i, '$1-$2');
    attr = attr.replace(/(blind) ?(fight)/i, '$1-$2');
    attr = attr.replace(/(point) ?(blank)/i, '$1-$2');
    value = value.replace(/(half) ?(elf|orc)/i, '$1-$2');
    value = value.replace(/(blind) ?(fight)/i, '$1-$2');
    value = value.replace(/(point) ?(blank)/i, '$1-$2');
    result[attr] = value;
  }
  return result;
};

/* Returns HTML attributes for Quilvyn's windows body tags. */
Quilvyn.htmlBackgroundAttr = function() {
  var result = 'bgcolor="' + userOptions.bgColor + '"';
  if(userOptions.bgImage) {
    result += ' background="' + userOptions.bgImage;
    if(!result.match(/\.\w+$/))
      result += '.jpg';
    result += '"';
  }
  return result;
};

/* Interacts with the user to add custom items to the current collection. */
Quilvyn.customAddItems = function(focus) {

  if(focus && Quilvyn.customAddItems.win != null) {
    // Prior add still active
    Quilvyn.customAddItems.win.focus();
    return;
  } else if(Quilvyn.customAddItems.win == null) {
    // New custom add
    var choices = QuilvynUtils.getKeys(ruleSet.getChoices('choices'));
    var htmlBits = [
      '<html><head><title>Add Custom Items</title></head>',
      '<body ' + Quilvyn.htmlBackgroundAttr() + '>',
      '<img src="' + LOGO_URL + '"/><br/>'
    ];
    htmlBits.push(
      '<form>',
      '<table><tr>',
      '<th>Type</th><td>' + InputHtml('_type', 'select-one', choices).replace('>', ' onchange="update=true">') + '</td>',
      '</tr><tr>',
      '<th>Name</th><td>' + InputHtml('_name', 'text', [30]) + '</td>',
      '</tr></table>',
      '<hr style="width:25%;text-align:center"/>',
      '<table name="variableFields">',
      '</table>',
      '<input type="button" name="Add" value="Add" onclick="okay=true;"/>',
      '<input type="button" name="Close" value="Close" onclick="done=true;"/>',
      '<p id="message"> </p>',
      '</form></body></html>'
    );
    var html = htmlBits.join('\n') + '\n';
    Quilvyn.customAddItems.win = editWindow;
    Quilvyn.customAddItems.win.document.write(html);
    Quilvyn.customAddItems.win.document.close();
    Quilvyn.customAddItems.win.canceled = false;
    Quilvyn.customAddItems.win.done = false;
    Quilvyn.customAddItems.win.update = true;
    Quilvyn.customAddItems.win.focus();
    Quilvyn.customAddItems(false);
    return;
  } else if(Quilvyn.customAddItems.win.done) {
    // User done making additions
    Quilvyn.customAddItems.win = null;
    Quilvyn.refreshEditor(true);
    return;
  } else if(!Quilvyn.customAddItems.win.okay) {
    // Try again later, after updating the input fields as necessary
    if(Quilvyn.customAddItems.win.update) {
      var typeInput =
        Quilvyn.customAddItems.win.document.getElementsByName('_type')[0];
      var typeValue = InputGetValue(typeInput);
      var elements = ruleSet.choiceEditorElements(ruleSet, typeValue);
      var htmlBits = [];
      for(var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var label = element[1];
        var name = element[0];
        var params = element[3];
        var type = element[2];
        htmlBits.push(
          '<tr><th>' + (label ? label : '&nbsp;') + '</th><td>' +
          InputHtml(name, type, params) + '</td></tr>'
        );
      }
      Quilvyn.customAddItems.win.document.getElementsByName('variableFields')[0].innerHTML = htmlBits.join('\n');
      Quilvyn.customAddItems.win.update = false;
    }
    setTimeout('Quilvyn.customAddItems(false)', TIMEOUT_DELAY);
    return;
  }

  // Ready to add a custom item
  var inputForm = Quilvyn.customAddItems.win.document.forms[0];
  var attrs = [];
  var name = '';
  var type = '';
  for(i = 0; i < inputForm.elements.length; i++) {
    var input = inputForm.elements[i];
    var inputName = input.name;
    var inputValue = InputGetValue(input);
    if(inputName == '_name')
      // For consistency with text attrs, allow optional quotes around name
      name = inputValue.replace(/^(['"])(.*)\1$/, '$2');
    else if(inputName == '_type')
      type = inputValue;
    else if(inputName == 'Add' || inputName == 'Close')
      continue;
    else {
      // Quote values that contain spaces.
      var tokens = inputValue.match(/'[^']*'|"[^"]*"|[^,]+|,/g);
      if(tokens) {
        inputValue = '';
        for(var j = 0; j < tokens.length; j++) {
          var token = tokens[j];
          if(token.charAt(0) == '"' || token.charAt(0) == "'" ||
             token.indexOf(' ') < 0)
            inputValue += tokens[j];
          else if(token.indexOf('"') >= 0)
            inputValue += "'" + token + "'";
          else
            inputValue += '"' + token + '"';
        }
      }
      if(inputValue != '')
        attrs.push(inputName + '=' + inputValue);
    }
  }
  attrs = attrs.join(' ');
  STORAGE.setItem(
    PERSISTENT_CUSTOM_PREFIX +
    customCollection.replaceAll('.', '%2E') + '.' +
    type.replaceAll('.', '%2E') + '.' +
    name.replaceAll('.', '%2E'), attrs
  );
  Quilvyn.customAddItems.win.document.getElementById('message').innerHTML =
    'Added ' + type + ' ' + name + ' to custom collection ' + customCollection;

  Quilvyn.customAddItems.win.okay = false;
  if(customCollection == ruleSet.getName()) {
    ruleSet.choiceRules(ruleSet, type, name, attrs);
  }
  setTimeout('Quilvyn.customAddItems(false)', TIMEOUT_DELAY);
  return;

};

/* Applies the current custom collection to the current rule set. */
Quilvyn.customApplyCollection = function() {
  if(!(editWindow.confirm('Apply custom collection ' + customCollection + ' to ' + ruleSet.getName() + ' rules?')))
    return; // User cancel
  var prefix =
    PERSISTENT_CUSTOM_PREFIX + customCollection.replaceAll('.', '%2E') + '.';
  for(var path in STORAGE) {
    if(!path.startsWith(prefix))
      continue;
    var pieces = path.split('.');
    if(pieces[2] != PERSISTENT_CUSTOM_PLACEHOLDER)
      ruleSet.choiceRules(ruleSet, pieces[2].replaceAll('%2E', '.'), pieces[3].replaceAll('%2E', '.'), STORAGE.getItem(path));
  }
  Quilvyn.refreshEditor(true);
};

/* Removes the current custom collection and all items in it. */
Quilvyn.customDeleteCollection = function() {
  var collection = editWindow.prompt
    ('Enter custom collection to delete:\n' + QuilvynUtils.getKeys(customCollections).sort().join('\n'), '');
  if(collection == null)
    return; // User cancel
  if(!(collection in customCollections)) {
    editWindow.alert('No such custom collection ' + collection);
    return;
  }
  var prefix =
    PERSISTENT_CUSTOM_PREFIX + collection.replaceAll('.', '%2E') + '.';
  for(var path in STORAGE) {
    if(path.startsWith(prefix))
      STORAGE.removeItem(path);
  }
  if(!(collection in ruleSets))
    delete customCollections[collection];
  if(customCollection == collection)
    customCollection = ruleSet.getName();
  Quilvyn.refreshEditor(true);
};

/*
 * Interacts with the user to delete a custom item from the current collection.
 */
Quilvyn.customDeleteItem = function() {
  var paths = {};
  var prefix =
    PERSISTENT_CUSTOM_PREFIX + customCollection.replaceAll('.', '%2E') + '.';
  for(var path in STORAGE) {
    if(path.startsWith(prefix) &&
       path.split('.')[2] != PERSISTENT_CUSTOM_PLACEHOLDER)
      paths[path.substring(prefix.length).replace('.', ' ').replaceAll('%2E', '.')] = path;
  }
  var item = editWindow.prompt
    ('Enter custom item to delete:\n' + QuilvynUtils.getKeys(paths).sort().join('\n'), '');
  if(item == null)
    return; // User cancel
  if(!(item in paths)) {
    editWindow.alert('No such custom item ' + item);
    return;
  }
  STORAGE.removeItem(paths[item]);
};

/*
 * Displays all custom items in a format that can be imported into Quilvyn.
 */
Quilvyn.customExportCollections = function() {
  var htmlBits = [];
  for(var path in STORAGE) {
    if(!path.startsWith(PERSISTENT_CUSTOM_PREFIX))
      continue;
    var pieces = path.split('.');
    for(var i = 1; i <= 3; i++) {
      var quote = pieces[i].indexOf(' ') < 0 ? '' : pieces[i].indexOf('"') < 0 ? '"' : "'";
      pieces[i] = quote + pieces[i].replaceAll('%2E', '.') + quote;
    }
    var text = '_collection=' + pieces[1] + ' _type=' + pieces[2] + ' _name=' + pieces[3] + ' ' + STORAGE.getItem(path).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    htmlBits.push(text);
  }
  htmlBits.sort();
  htmlBits.unshift(
    '<html><head><title>Export Custom Items</title></head>',
    '<body ' + Quilvyn.htmlBackgroundAttr() + '>',
    '<img src="' + LOGO_URL + ' "/><br/>',
    '<pre>'
  );
  htmlBits.push('</pre>', '</body></html>');
  var html = htmlBits.join('\n') + '\n';
  var exportPopup = window.open('', '', FEATURES_OF_OTHER_WINDOWS);
  exportPopup.document.write(html);
  exportPopup.document.close();
  exportPopup.focus();
};

/*
 * Interacts with the user to import a set of custom items into the current
 * collection.
 */
Quilvyn.customImportCollections = function(focus) {

  if(focus && Quilvyn.customImportCollections.win != null) {
    // Prior import still pending
    Quilvyn.customImportCollections.win.focus();
    return;
  } else if(Quilvyn.customImportCollections.win == null) {
    // New import
    var htmlBits = [
      '<html><head><title>Import Custom Items</title></head>',
      '<body ' + Quilvyn.htmlBackgroundAttr() + '>',
      '<img src="' + LOGO_URL + ' "/><br/>',
      '<h2>Enter item definitions from export window</h2>',
      '<form name="frm"><table>',
      '<tr><td><textarea name="code" rows="20" cols="50"></textarea></td></tr>',
      '</table></form>',
      '<form>',
      '<input type="button" value="Ok" onclick="okay=true;"/>',
      '<input type="button" value="Cancel" onclick="canceled=true;"/>',
      '</form></body></html>'
    ];
    var html = htmlBits.join('\n') + '\n';
    Quilvyn.customImportCollections.win = editWindow;
    Quilvyn.customImportCollections.win.document.write(html);
    Quilvyn.customImportCollections.win.document.close();
    Quilvyn.customImportCollections.win.canceled = false;
    Quilvyn.customImportCollections.win.okay = false;
    Quilvyn.customImportCollections.win.focus();
    setTimeout('Quilvyn.customImportCollections(false)', TIMEOUT_DELAY);
    return;
  } else if(Quilvyn.customImportCollections.win.canceled) {
    // User cancel
    Quilvyn.customImportCollections.win = null;
    Quilvyn.refreshEditor(true);
    return;
  } else if(!Quilvyn.customImportCollections.win.okay) {
    // Try again later
    setTimeout('Quilvyn.customImportCollections(false)', TIMEOUT_DELAY);
    return;
  }

  // Ready to import
  var imported = [];
  var lines = Quilvyn.customImportCollections.win.document.frm.elements[0].value.split('\n');

  for(var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if(line.match(/^\s*$/))
      continue;
    var collection = QuilvynUtils.getAttrValue(line, '_collection');
    var name = QuilvynUtils.getAttrValue(line, '_name');
    var type = QuilvynUtils.getAttrValue(line, '_type');
    if(!collection || !name || !type) {
      editWindow.alert('Bad format for item "' + line + '"');
      continue;
    }
    line = line.replace
      (new RegExp('_collection=["\']?' + collection + '["\']?'), '');
    line = line.replace(new RegExp('_name=["\']?' + name + '["\']?'), '');
    line = line.replace(new RegExp('_type=["\']?' + type + '["\']?'), '');
    line = line.replace(/^\s+|\s+$/g, '');
    STORAGE.setItem(
      PERSISTENT_CUSTOM_PREFIX +
      collection.replaceAll('.', '%2E') + '.' +
      type.replaceAll('.', '%2E') + '.' +
      name.replaceAll('.', '%2E'), line
    );
    customCollections[collection] = '';
    if(collection in ruleSets)
      ruleSets[collection].choiceRules(ruleSets[collection], type, name, line);
    imported.push('Imported ' + type + ' ' + name + ' into ' + collection);
  }

  Quilvyn.customImportCollections.win = null;
  Quilvyn.refreshEditor(true);
  editWindow.alert(imported.join('\n'));

};

/* Interacts with the user to define a new custom item collection. */
Quilvyn.customNewCollection = function() {
  var name = editWindow.prompt('Custom Collection Name?');
  if(!name)
    return;
  customCollection = name;
  if(name in customCollections)
    return;
  customCollections[name] = '';
  STORAGE.setItem(
    PERSISTENT_CUSTOM_PREFIX +
    name.replaceAll('.', '%2E') + '.' +
    PERSISTENT_CUSTOM_PLACEHOLDER + '.' +
    name.replaceAll('.', '%2E'), ''
  );
  Quilvyn.refreshEditor(true);
};

/* Interacts w/user to delete a character from persistent storage. */
Quilvyn.deleteCharacter = function(focus) {

  var i;
  var paths;

  if(focus && Quilvyn.deleteCharacter.win != null) {
    // Prior delete still pending
    Quilvyn.deleteCharacter.win.focus();
    return;
  } else if(Quilvyn.deleteCharacter.win == null) {
    // New delete
    var htmlBits = [
      '<html><head><title>Delete Characters</title></head>',
      '<body ' + Quilvyn.htmlBackgroundAttr() + '>',
      '<img src="' + LOGO_URL + ' "/><br/>',
      '<h2>Select characters to delete</h2>',
      '<form name="frm"><table>'];
    paths = [];
    for(var path in STORAGE) {
      if(path.startsWith(PERSISTENT_CHARACTER_PREFIX))
        paths.push(path.substring(PERSISTENT_CHARACTER_PREFIX.length));
    }
    paths.sort();
    for(i = 0; i < paths.length; i++) {
      htmlBits.push(
        '<tr><td>' + InputHtml(paths[i], 'checkbox', null) + '</td><td>' + paths[i] + '</td></tr>'
      );
    }
    htmlBits.push(
      '</table></form>',
      '<form>',
      '<input type="button" value="Ok" onclick="okay=true;"/>',
      '<input type="button" value="Cancel" onclick="canceled=true;"/>',
      '</form></body></html>'
    );
    var html = htmlBits.join('\n') + '\n';
    Quilvyn.deleteCharacter.win = editWindow;
    Quilvyn.deleteCharacter.win.document.write(html);
    Quilvyn.deleteCharacter.win.document.close();
    Quilvyn.deleteCharacter.win.canceled = false;
    Quilvyn.deleteCharacter.win.okay = false;
    Quilvyn.deleteCharacter.win.focus();
    setTimeout('Quilvyn.deleteCharacter(false)', TIMEOUT_DELAY);
    return;
  } else if(Quilvyn.deleteCharacter.win.canceled) {
    // User cancel
    Quilvyn.deleteCharacter.win = null;
    Quilvyn.refreshEditor(true);
    return;
  } else if(!Quilvyn.deleteCharacter.win.okay) {
    // Try again later
    setTimeout('Quilvyn.deleteCharacter(false)', TIMEOUT_DELAY);
    return;
  }

  // Ready to delete
  var form = Quilvyn.deleteCharacter.win.document.forms[0];
  for(i = 0; i < form.elements.length; i++) {
    if(form.elements[i].checked)
      STORAGE.removeItem(PERSISTENT_CHARACTER_PREFIX + form.elements[i].name);
  }
  Quilvyn.deleteCharacter.win = null;
  Quilvyn.refreshEditor(true);

};

/* Returns HTML for the character editor form. */
Quilvyn.editorHtml = function() {
  var quilvynElements = [
    ['about', ' ', 'button', ['About']],
    ['help', '', 'button', ['Help']],
    ['options', '', 'button', ['Options']],
    ['rules', 'Rules', 'select-one', []],
    ['rulesNotes', '', 'button', ['Notes']],
    ['ruleRules', '', 'button', ['Rules']],
    ['custom', 'Custom Items', 'select-one', [
      'New Collection...', 'Delete Collection...', 'View/Export All',
      'Import...', 'Add Items...', 'Delete Item...', 'Apply Collection...'
    ]],
    ['character', 'Character', 'select-one', []],
    ['clear', 'Clear', 'select-one', 'bags'],
    ['randomize', 'Randomize', 'select-one', 'random']
  ];
  var elements = quilvynElements.concat(ruleSet.getEditorElements());
  var htmlBits = ['<form name="frm"><table>'];
  var i;
  var bagNames = [];
  for(i = 0; i < elements.length; i++)
    if(elements[i][2].match(/^f?(bag|set)$/))
      // Set options to combined attr and label; refreshEditor will split them
      // once the widget is created.
      bagNames.push(elements[i][0] + ',' + elements[i][1]);
  bagNames.sort();
  for(i = 0; i < elements.length; i++) {
    var element = elements[i];
    var label = element[1];
    var name = element[0];
    var params = element[3];
    var type = element[2];
    if(name == 'character')
      htmlBits.push('<tr><td colspan=2><hr/></td></tr>');
    if(params == 'bags') {
      params = ['---choose one---'].concat(bagNames);
    } else if(typeof(params) == 'string') {
      if(ruleSet.getChoices(params) == null)
        continue;
      params = QuilvynUtils.getKeys(ruleSet.getChoices(params));
      if(name == 'randomize') {
        // Set options to combined attr and label; refreshEditor will split
        // them once the widget is created.
        for(var j = 0; j < params.length; j++)
          params[j] += ',' + params[j].charAt(0).toUpperCase() + params[j].substring(1).replace(/([a-z])([A-Z])/g, '$1 $2');
        params = ['---choose one---'].concat(params);
      }
    }
    if(label != '' || i == 0) {
      if(i > 0) {
        htmlBits[htmlBits.length] = '</td></tr>';
      }
      htmlBits[htmlBits.length] = '<tr><th>' + label + '</th><td>';
    }
    if(type.match(/^f?(bag|set)$/)) {
      // type = type.replace('f', ''); // Sub-menus largely supplant filters
      var widget = type.match(/bag/) ? InputHtml(name, 'text', [3]) :
                                       InputHtml(name, 'checkbox', null);
      var needSub = params.filter(x => x.includes('(')).length > 0;
      // Intially put full parameter list, including sub-options, into _sel.
      // refreshEditor will handle splitting the values later.
      // Note: Inner table needed to prevent line break between _sel and _sub?!?
      htmlBits[htmlBits.length] =
        '  <table cellspacing="0" cellpadding="0"><tr><td>' +
        InputHtml(name + '_sel', 'select-one', params) +
        (needSub ? '</td><td>' + InputHtml(name + '_sub', 'select-one', ['...']) : '') +
        '</td><td>' + widget + '</td></tr></table>' +
        (type.charAt(0)=='f' ? '</td></tr><tr><th>Filter</th><td>' + InputHtml(name + '_filter', 'text', [15]) : '');
    } else {
      htmlBits[htmlBits.length] = '  ' + InputHtml(name, type, params);
    }
  }
  htmlBits = htmlBits.concat(['</td></tr>', '</table></form>']);
  var result = htmlBits.join('\n');
  return result;
};

/* Pops a window containing the attribues of all stored characters. */
Quilvyn.exportCharacters = function() {
  var htmlBits = [
    '<html><head><title>Export Characters</title></head>',
    '<body ' + Quilvyn.htmlBackgroundAttr() + '>',
    '<img src="' + LOGO_URL + ' "/><br/>'];
  for(var path in STORAGE) {
    if(!path.startsWith(PERSISTENT_CHARACTER_PREFIX))
      continue;
    var toExport = Quilvyn.retrieveCharacterFromStorage(path);
    // In case character saved before _path attr use
    toExport['_path'] = path.substring(PERSISTENT_CHARACTER_PREFIX.length);
    var text = ObjectViewer.toCode(toExport).
      replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    htmlBits.push('<pre>\n' + text + '\n</pre><br/>\n');
  }
  htmlBits.push('</body></html>');
  var html = htmlBits.join('\n') + '\n';
  var exportPopup = window.open('', '', FEATURES_OF_OTHER_WINDOWS);
  exportPopup.document.write(html);
  exportPopup.document.close();
  exportPopup.focus();
};

/*
 * Interacts w/user to import characters from external sources. If an import
 * window is already open, places focus on it if #focus# is true.
 */
Quilvyn.importCharacters = function(focus) {

  if(focus && Quilvyn.importCharacters.win != null) {
    // Prior import still pending
    Quilvyn.importCharacters.win.focus();
    return;
  } else if(Quilvyn.importCharacters.win == null) {
    // New import
    var htmlBits = [
      '<html><head><title>Import Character</title></head>',
      '<body ' + Quilvyn.htmlBackgroundAttr() + '>',
      '<img src="' + LOGO_URL + ' "/><br/>',
      '<h2>Enter attribute definition from character sheet source</h2>',
      '<form name="frm"><table>',
      '<tr><td><textarea name="code" rows="20" cols="50"></textarea></td></tr>',
      '</table></form>',
      '<form>',
      '<input type="button" value="Ok" onclick="okay=true;"/>',
      '<input type="button" value="Cancel" onclick="canceled=true;"/>',
      '</form></body></html>'
    ];
    var html = htmlBits.join('\n') + '\n';
    Quilvyn.importCharacters.win = editWindow;
    Quilvyn.importCharacters.win.document.write(html);
    Quilvyn.importCharacters.win.document.close();
    Quilvyn.importCharacters.win.canceled = false;
    Quilvyn.importCharacters.win.okay = false;
    Quilvyn.importCharacters.win.focus();
    setTimeout('Quilvyn.importCharacters(false)', TIMEOUT_DELAY);
    return;
  } else if(Quilvyn.importCharacters.win.canceled) {
    // User cancel
    Quilvyn.importCharacters.win = null;
    Quilvyn.refreshEditor(true);
    return;
  } else if(!Quilvyn.importCharacters.win.okay) {
    // Try again later
    setTimeout('Quilvyn.importCharacters(false)', TIMEOUT_DELAY);
    return;
  }

  // Ready to import
  var text = Quilvyn.importCharacters.win.document.frm.elements[0].value;
  var index = text.indexOf('{');

  if(index < 0) {
    Quilvyn.importCharacters.win.alert('Syntax error: missing {');
    Quilvyn.importCharacters.win.focus();
    Quilvyn.importCharacters.win.okay = false;
    setTimeout('Quilvyn.importCharacters(false)', TIMEOUT_DELAY);
    return;
  }

  while(index >= 0) {
    text = text.substring(index + 1);
    var attrPat = /^\s*"((?:\\"|[^"])*)"\s*:\s*(\d+|"((?:\\"|[^"])*)"|\{)/;
    var matchInfo;
    var nesting = '';
    var importedCharacter = {};
    while((matchInfo = text.match(attrPat)) != null) {
      text = text.substring(matchInfo[0].length);
      var attr = matchInfo[1];
      var value = matchInfo[3] || matchInfo[2];
      value = value.replace(/\\"/g, '"').replace(/\\n/g, '\n');
      if(value == '{') {
        nesting += attr + '.';
      } else {
        importedCharacter[nesting + attr] = value;
      }
      while(nesting != '' && (matchInfo = text.match(/^\s*\}/)) != null) {
        text = text.substring(matchInfo[0].length);
        nesting = nesting.replace(/[^\.]*\.$/, '');
      }
      if((matchInfo = text.match(/^\s*,/)) != null) {
        text = text.substring(matchInfo[0].length);
      }
    }
    if(!text.match(/^\s*\}/)) {
      Quilvyn.importCharacters.win.alert('Syntax error: missing } at "' + text + '"');
      Quilvyn.importCharacters.win.focus();
      Quilvyn.importCharacters.win.okay = false;
      setTimeout('Quilvyn.importCharacters(false)', TIMEOUT_DELAY);
      return;
    }
    character = Quilvyn.applyV2Changes(importedCharacter);
    characterPath = character['_path'] || '';
    characterUndo = [];
    characterCache[characterPath] = QuilvynUtils.clone(character);
    Quilvyn.saveCharacter(characterPath);
    index = text.indexOf('{');
  }

  Quilvyn.importCharacters.win = null;
  Quilvyn.refreshEditor(true);
  Quilvyn.refreshSheet();

};

/*
 * Interacts w/user to change display options. If an options window is already
 * open, places focus on it if #focus# is true.
 */
Quilvyn.modifyOptions = function(focus) {

  if(focus && Quilvyn.modifyOptions.win != null) {
    // Prior modify still pending
    Quilvyn.modifyOptions.win.focus();
    return;
  } else if(Quilvyn.modifyOptions.win == null) {
    // New modify
    var htmlBits = [
      '<html><head><title>Quilvyn Options</title></head>',
      '<body ' + Quilvyn.htmlBackgroundAttr() + '>',
      '<h2>Quilvyn Options</h2>',
      '<form name="frm"><table>',
      '<tr><td><b>Background Color</b></td><td>' + InputHtml('bgColor', 'text', [10]) + '</td></tr>',
      '<tr><td><b>Background Image URL</b></td><td>' + InputHtml('bgImage', 'text', [30]) + '</td></tr>',
      '<tr><td><b>Separate Editor</b></td><td>' + InputHtml('separateEditor', 'checkbox', null) + '</td></tr>',
      '<tr><td><b>Show Extras</b></td><td>' + InputHtml('extras', 'checkbox', null) + '</td></tr>',
      '<tr><td><b>Show Hidden</b></td><td>' + InputHtml('hidden', 'checkbox', null) + '</td></tr>',
      '<tr><td><b>Show Italic Notes</b></td><td>' + InputHtml('italics', 'checkbox', null) + '</td></tr>',
      '<tr><td><b>Show Spell</b></td><td>' + InputHtml('spell', 'select-one', ['Points', 'Slots', 'Both']) + '</td></tr>',
      '<tr><td><b>Sheet Style</b></td><td>' + InputHtml('style', 'select-one', ['Collected Notes', 'Compact', 'Standard']) + '</td></tr>',
      '<tr><td><b>Warn About Discard<b></td><td>' + InputHtml('warnAboutDiscard', 'checkbox', null) + '</td></tr>',
      '</table>',
      '<input type="button" value="Ok" onclick="okay=true;"/>',
      '<input type="button" value="Cancel" onclick="canceled=true;"/>',
      '</form></body></html>'
    ];
    var html = htmlBits.join('\n') + '\n';
    Quilvyn.modifyOptions.win = editWindow;
    Quilvyn.modifyOptions.win.document.write(html);
    Quilvyn.modifyOptions.win.document.close();
    Quilvyn.modifyOptions.win.canceled = false;
    Quilvyn.modifyOptions.win.okay = false;
    Quilvyn.modifyOptions.win.focus();
    for(var opt in userOptions) {
      InputSetValue
        (Quilvyn.modifyOptions.win.document.frm[opt], userOptions[opt]);
    }
    setTimeout('Quilvyn.modifyOptions(false)', TIMEOUT_DELAY);
    return;
  } else if(Quilvyn.modifyOptions.win.canceled) {
    // User cancel
    Quilvyn.modifyOptions.win = null;
    Quilvyn.refreshEditor(true);
    return;
  } else if(!Quilvyn.modifyOptions.win.okay) {
    // Try again later
    setTimeout('Quilvyn.modifyOptions(false)', TIMEOUT_DELAY);
    return;
  }

  // Ready to modify
  var oldSeparateEditor = userOptions.separateEditor;
  var form = Quilvyn.modifyOptions.win.document.frm;
  for(var option in userOptions) {
    var value = InputGetValue(form[option]);
    userOptions[option] = value === true ? 1 : value === false ? 0 : value;
  }
  Quilvyn.modifyOptions.win = null;
  Quilvyn.storePersistentInfo();
  if(userOptions.separateEditor != oldSeparateEditor)
    Quilvyn.redrawUI();
  Quilvyn.refreshEditor(true);
  Quilvyn.refreshSheet();

};

/* Loads character specified by #path# from persistent storage. */
Quilvyn.openCharacter = function(path) {
  character =
    Quilvyn.retrieveCharacterFromStorage(PERSISTENT_CHARACTER_PREFIX + path);
  character = Quilvyn.applyV2Changes(character);
  character['_path'] = path; // In case character saved before _path attr use
  characterPath = path;
  characterUndo = [];
  characterCache[characterPath] = QuilvynUtils.clone(character);
  Quilvyn.refreshEditor(false);
  Quilvyn.refreshSheet();
};

/* Replaces the current character with one with empty attributes. */
Quilvyn.newCharacter = function() {
  character = {};
  characterPath = '';
  characterUndo = [];
  var i;
  // Skip to first character-related editor input
  for(i = 0;
      i < editForm.elements.length && editForm.elements[i].name != 'name';
      i++)
    ; /* empty */
  for( ; i < editForm.elements.length; i++) {
    var input = editForm.elements[i];
    var name = input.name;
    var type = input.type;
    if(type == 'select-one' && !name.match(/_sel|_sub/)) {
      character[name] = input.options[0].text;
      for(var j = 1; j < input.options.length; j++)
        if(input.options[j].text == 'None')
          character[name] = 'None';
    } else if(name == 'experience' || name == 'hitPoints') {
      character[name] = 0;
    }
  }
  characterCache[characterPath] = QuilvynUtils.clone(character);
  Quilvyn.refreshEditor(false);
  Quilvyn.refreshSheet();
};

/*
 * Interacts w/user to replace the current character with one that has all
 * randomized attributes. If a randomize prompt window is already open, places
 * focus on it if #focus# is true.
 */
Quilvyn.randomizeCharacter = function(focus) {

  var presets = ruleSet.getChoices('preset');

  if(presets == null) {
    // No window needed
  } else if(focus && Quilvyn.randomizeCharacter.win != null) {
    // Prior randomize still pending
    Quilvyn.randomizeCharacter.win.focus();
    return;
  } else if(Quilvyn.randomizeCharacter.win == null) {
    // New randomize
    var htmlBits = [
      '<html><head><title>Random Character</title></head>',
      '<body ' + Quilvyn.htmlBackgroundAttr() + '>',
      '<img src="' + LOGO_URL + ' "/><br/>',
      '<h2>Character Attributes</h2>',
      '<form name="frm"><table>'];
    for(var preset in presets) {
      var label;
      var presetHtml = '';
      if(presets[preset]) {
        var pieces = presets[preset].split(',');
        label = pieces[0];
        presetHtml =
          pieces[1].match(/bag|set/) ?
            InputHtml(preset + '_sel', 'select-one',
                      QuilvynUtils.getKeys(ruleSet.getChoices(pieces[2]))) +
            '</td><td>' +
            InputHtml(preset, 'text', [2])
          : pieces[1] == 'select-one' ?
            InputHtml(preset, 'select-one',
                      QuilvynUtils.getKeys(ruleSet.getChoices(pieces[2])))
          : InputHtml(preset, 'text', [2]);
      } else {
        console.log('No formatting specified for preset "' + preset + '"');
        continue;
      }
      presetHtml =
        '<tr><td><b>' + label + '</b></td><td>' + presetHtml + '</td></tr>';
      htmlBits[htmlBits.length] = presetHtml;
    }
    htmlBits = htmlBits.concat([
      '</table></form>',
      '<form>',
      '<input type="button" value="Ok" autofocus="y" onclick="okay=true;"/>',
      '<input type="button" value="Cancel" onclick="canceled=true;"/>',
      '</form></body></html>'
    ]);
    var html = htmlBits.join('\n') + '\n';
    Quilvyn.randomizeCharacter.win = editWindow;
    Quilvyn.randomizeCharacter.win.document.write(html);
    Quilvyn.randomizeCharacter.win.document.close();
    // Add callbacks that store user input in a property named attrs for
    // retrieval once the user hits Ok.
    var callbackForSetSel =
      function() {InputSetValue(this.val, this.form.attrs[this.name.replace('_sel', '') + '.' + InputGetValue(this)])};
    var callbackForSetVal =
      function() {this.form.attrs[this.name + '.' + InputGetValue(this.sel)] = InputGetValue(this)};
    var callbackForNonSet =
      function() {this.form.attrs[this.name] = InputGetValue(this);};
    var form = Quilvyn.randomizeCharacter.win.document.frm;
    form.attrs = {};
    for(var i = 0; i < form.elements.length; i++) {
      var widget = form.elements[i];
      if(widget.name.match(/_sel/))
        continue; // Callback set at the same time as the value widget
      InputSetCallback(widget, callbackForNonSet);
      if(form[widget.name + '_sel'] != null) {
        var selWidget = form[widget.name + '_sel'];
        InputSetCallback(widget, callbackForSetVal);
        InputSetCallback(selWidget, callbackForSetSel);
        // Give set widgets references to each other for callback use
        widget.sel = selWidget;
        selWidget.val = widget;
      } else if(widget.type == 'select-one') {
        // Set to a random choice
        widget.selectedIndex = QuilvynUtils.random(0, widget.options.length-1);
        form.attrs[widget.name] = InputGetValue(widget);
      }
    }
    Quilvyn.randomizeCharacter.win.okay = false;
    Quilvyn.randomizeCharacter.win.canceled = false;
    Quilvyn.randomizeCharacter.win.focus();
    setTimeout('Quilvyn.randomizeCharacter(false)', TIMEOUT_DELAY);
    return;
  } else if(Quilvyn.randomizeCharacter.win.canceled) {
    Quilvyn.randomizeCharacter.win = null;
    Quilvyn.refreshEditor(true);
    return;
  } else if(!Quilvyn.randomizeCharacter.win.okay) {
    // Try again later
    setTimeout('Quilvyn.randomizeCharacter(false)', TIMEOUT_DELAY);
    return;
  }

  // Ready to generate
  var fixedAttributes = {};
  if(Quilvyn.randomizeCharacter.win != null) {
    var form = Quilvyn.randomizeCharacter.win.document.frm;
    for(var a in form.attrs) {
      var value = form.attrs[a];
      if(typeof(value) == 'string' && value.match(/^[\+\-]?\d+$/))
        value -= 0;
      if(value)
        fixedAttributes[a] = value;
    }
    // Quilvyn.randomizeCharacter.win.close();
    Quilvyn.randomizeCharacter.win = null;
  }
  character = ruleSet.randomizeAllAttributes(fixedAttributes);
  characterPath = '';
  characterUndo = [];
  characterCache[characterPath] = QuilvynUtils.clone(character);
  Quilvyn.refreshEditor(true);
  Quilvyn.refreshSheet();

};

/*
 * (Re)opens the editor and sheet windows as appropriate. Returns false if
 * window opening fails; otherwise, true.
 */
Quilvyn.redrawUI = function() {
  if(quilvynTab) {
    quilvynTab.close();
    quilvynTab = null;
  } else {
    if(editWindow) {
      editWindow.close();
      editWindow = null;
    }
    if(sheetWindow) {
      sheetWindow.close();
      sheetWindow = null;
    }
  }
  if(userOptions.separateEditor) {
    try {
      editWindow = window.open('', '', FEATURES_OF_EDIT_WINDOW);
    } catch(err) {
      // empty
    }
    if(!editWindow) {
      alert('Window open failed.\nPlease enable popup windows in your browser settings, then try running Quilvyn again.');
      return false;
    }
    try {
      sheetWindow = window.open('', '', FEATURES_OF_SHEET_WINDOW);
    } catch(err) {
      // empty
    }
    if(!sheetWindow) {
      alert('Window open failed.\nPlease enable popup windows in your browser settings, then try running Quilvyn again.');
      return false;
    }
  } else {
    try {
      quilvynTab = window.open('', '');
    } catch(err) {
      // empty
    }
    if(!quilvynTab) {
      alert('Window open failed.\nPlease enable popup windows in your browser settings, then try running Quilvyn again.');
      return false;
    }
    quilvynTab.document.write(
      '<html>\n' +
      '<head>\n' +
      '  <title>Quilvyn</title>\n' +
      '  <style>\n' +
      '    .edit {\n' +
      '      float: left;\n' +
      '      width: 35%;\n' +
      '      height: 90%;\n' +
      '    }\n' +
      '    .sheet {\n' +
      '      float: left;\n' +
      '      width: 64%;\n' +
      '      height: 90%;\n' +
      '    }\n' +
      '  </style>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <iframe class="edit"></iframe>\n' +
      '  <iframe class="sheet"></iframe>\n' +
      '</body>\n' +
      '</html>\n'
    );
    quilvynTab.document.close();
    quilvynTab.focus();
    editWindow = quilvynTab.frames[0];
    sheetWindow = quilvynTab.frames[1];
  }
  return true;
};

/*
 * Resets the editing window fields to the values of the current character.
 * First redraws the editor if #redraw# is true.
 */
Quilvyn.refreshEditor = function(redraw) {

  var i;

  if(redraw) {
    var editHtml =
      '<html><head><title>Quilvyn Editor Window</title></head>\n' +
      '<body ' + Quilvyn.htmlBackgroundAttr() + '>\n' +
      '<img src="' + LOGO_URL + ' "/><br/>\n' +
      '<div style="text-align:center"><i>Version ' + VERSION + '</i></div>\n' +
      Quilvyn.editorHtml() + '\n' +
      '</body></html>\n';
    editWindow.document.write(editHtml);
    editWindow.document.close();
    editForm = editWindow.document.forms[0];
    var updateListener = function() {Quilvyn.update(this);};
    var selectSpellsListener = function(e) {
      if(event.code == 'KeyY' && (event.ctrlKey || event.metaKey)) {
        Quilvyn.selectSpells();
      }
    }
    var undoListener = function(e) {
      if(event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
        Quilvyn.undo();
      }
    };
    for(i = 0; i < editForm.elements.length; i++) {
      InputSetCallback(editForm.elements[i], updateListener);
    }
    editWindow.document.addEventListener('keydown', selectSpellsListener);
    editWindow.document.addEventListener('keydown', undoListener);
    // Split attr,label pairs editorHtml set as params for Clear and Randomize
    // menus, storing the attrs in a field of the widget
    var widget = editForm.clear;
    widget.attrs = InputGetParams(widget).map(x=>x.replace(/,.*/, ''));
    InputSetOptions
      (widget, InputGetParams(widget).map(x => x.replace(/.*,/, '')));
    widget = editForm.randomize;
    widget.attrs = InputGetParams(widget).map(x=>x.replace(/,.*/, ''));
    InputSetOptions
      (widget, InputGetParams(widget).map(x=>x.replace(/.*,/, '')));
  }

  var characterOpts = [];
  for(var path in STORAGE) {
    if(path.startsWith(PERSISTENT_CHARACTER_PREFIX))
      characterOpts.push(path.substring(PERSISTENT_CHARACTER_PREFIX.length));
  }
  characterOpts = characterOpts.sort();
  characterOpts.unshift(
    '---choose one---', 'New', 'Random...', 'Save', 'Save As...', 'Print...',
    'Delete...', 'HTML', 'Import...', 'Export', 'Summary'
  );
  var customOpts = QuilvynUtils.getKeys(customCollections).sort();
  customOpts.unshift(
    'New Collection...', 'Delete Collection...', 'View/Export All',
    'Import...', 'Add Items...', 'Delete Item...', 'Apply Collection...'
  );
  InputSetOptions(editForm.rules, QuilvynUtils.getKeys(ruleSets));
  InputSetOptions(editForm.custom, customOpts);
  InputSetValue(editForm.custom, customCollection);
  InputSetOptions(editForm.character, characterOpts);

  // Skip to first character-related editor input
  for(i = 0;
      i < editForm.elements.length && editForm.elements[i].name != 'name';
      i++)
    ; /* empty */
  for( ; i < editForm.elements.length; i++) {
    var input = editForm.elements[i];
    var name = input.name;
    var sel = editForm[name + '_sel'];
    var value = null;
    if(name.match(/_sel|_sub/)) {
      if(name.includes('_sel') && !input.allOpts)
        // editorHtml gave us the full options in _sel; save for later filtering
        input.allOpts = InputGetParams(input);
      var prefix = name.substring(0, name.indexOf('_s'));
      sel = name.includes('_sel') ? input : editForm[prefix + '_sel'];
      var filter = character[prefix + '_filter'] || '';
      var options = sel.allOpts.filter(x => x.includes(filter));
      // Seek an option for which character contains a non-null value
      for(var a in character) {
        if(a.startsWith(prefix) &&
           options.includes(a.replace(prefix + '.', ''))) {
          value = a;
          break;
        }
      }
      if(name.includes('_sel')) {
        // Strip sub-selections and use Set to determine unique options
        options =
          Array.from(new Set(options.map(x => x.replace(/\(.*\)$/, ''))));
        if(options.length == 0)
          options.push('--- empty ---');
        InputSetOptions(input, options);
        value = value ? value.replace(prefix + '.', '').replace(/\(.*\)$/, '') : options[0];
      } else {
        // Grab any sub-options of the current value of _sel
        var selValue = InputGetValue(sel);
        options = options.filter(x => x.startsWith(selValue + '(')).map(x => x.replace(/^[^(]*\(|\)$/g, ''));
        InputSetOptions(input, options);
        if(options.length > 0) {
          input.style.display = 'block';
          value = value ? value.replace(/^[^(]*\(|\)$/g, '') : options[0];
        } else {
          // Remove the sub-menu from the display
          input.style.display = 'none';
        }
      }
    } else if(sel == null) {
      value = character[name];
    } else {
      var sub = editForm[name + '_sub'];
      // Construct full attr name from the current sel value and any sub value
      var attrName = name + '.' + InputGetValue(sel) + (sub && sub.options.length > 0 ? '(' + InputGetValue(sub) + ')' : '');
      value = character[attrName];
    }
    InputSetValue(input, value);
  }

  InputSetValue(editForm.rules, ruleSet.getName());
  editWindow.focus();

};

/* Draws the sheet for the current character in the character sheet window. */
Quilvyn.refreshSheet = function() {
  sheetWindow.document.write(Quilvyn.sheetHtml(character));
  sheetWindow.document.close();
  sheetWindow.document.title = character.name;
  if(quilvynTab != null)
    quilvynTab.document.title = 'Quilvyn - ' + character.name;
  sheetWindow.focus();
};

/* Creates and returns a character from the contents of a storage path. */
Quilvyn.retrieveCharacterFromStorage = function(path) {
  var result = {};
  var attrs = STORAGE.getItem(path).split('\t');
  for(var i = 0; i < attrs.length; i++) {
    var pieces = attrs[i].split('=', 2);
    if(pieces.length == 2)
      result[pieces[0]] = pieces[1];
  }
  return result;
};

/* Interacts w/user to preserve current character in persistent storage. */
Quilvyn.saveCharacter = function(path) {
  if(!path) {
    var defaultPath = character['_path'] || character['name'];
    path = editWindow.prompt('Save ' + character['name'] + ' as', defaultPath);
    if(!path)
      return;
  }
  character['_path'] = path;
  character['_timestamp'] = Date.now();
  var stringified = '';
  for(var attr in character) {
    stringified += attr + '=' + character[attr] + '\t';
  }
  STORAGE.setItem(PERSISTENT_CHARACTER_PREFIX + path, stringified);
  characterPath = path;
  characterCache[characterPath] = QuilvynUtils.clone(character);
  Quilvyn.refreshEditor(false);
};

// Selects all spells that match the character's spell filter
Quilvyn.selectSpells = function() {
  console.log('selectSpells');
  var filter = character['spells_filter'] || '';
  for(var spell in ruleSet.getChoices('spells')) {
    if(spell.includes(filter))
      character['spells.' + spell] = 1;
  }
  Quilvyn.refreshEditor(true);
  Quilvyn.refreshSheet();
  editWindow.focus();
};

/* Returns the character sheet HTML for the current character. */
Quilvyn.sheetHtml = function(attrs) {

  var a;
  var computedAttributes;
  var enteredAttributes = QuilvynUtils.clone(attrs);
  var i;
  var rulesExtras = ruleSet.getChoices('extras') || {};
  var sheetAttributes = {};

  enteredAttributes.hidden = userOptions.hidden;
  for(a in enteredAttributes) {
    if(typeof(enteredAttributes[a]) == 'string') {
      enteredAttributes[a] = enteredAttributes[a].replaceAll('<', '&lt;').
        replace(new RegExp('&lt;(?=/?(' + ALLOWED_TAGS.join('|') + ')\\b)', 'g'), '<');
    }
  }
  computedAttributes = ruleSet.applyRules(enteredAttributes);
  var formats = ruleSet.getFormats(ruleSet, userOptions.style);
  for(a in computedAttributes) {
    if(a.match(/\.\d+$/))
      continue; // Ignore format multi-values
    var isNote = a.indexOf('Notes') > 0;
    var name = a.replace(/([a-z\)])([A-Z\(])/g, '$1 $2')
                .replace(/([A-Z])\(/, '$1 (');
    name = name.substring(0, 1).toUpperCase() + name.substring(1);
    var value = computedAttributes[a];
    if(isNote && value == 0)
      continue; // Suppress notes with zero value
    if((a.match(/^spellSlots/) && userOptions.spell == 'Points') ||
       (a == 'spellPoints' && userOptions.spell == 'Slots'))
      continue;
    if(formats[a] != null) {
      value = formats[a].replace(/%V/g, value);
      for(var j = 1; computedAttributes[a + '.' + j] != null; j++) {
        value = value.replace(new RegExp('%' + j, 'g'), computedAttributes[a + '.' + j]);
      }
      var interpolations = value.match(/%\{[^}]+\}/g);
      if(interpolations) {
        for(var i = 0; i < interpolations.length; i++) {
          var interp = interpolations[i];
          var expr = new Expr(interp.substring(2, interp.length - 1));
          value = value.replace(interp, expr.eval(computedAttributes));
        }
      }
    } else if(isNote && typeof(value) == 'number') {
      value = QuilvynUtils.signed(value);
    }
    if(!userOptions.extras &&
       (a in rulesExtras || a.split('.')[0] in rulesExtras))
      continue;
    if((i = name.indexOf('.')) < 0) {
      sheetAttributes[name] = value;
    } else {
      var object = name.substring(0, i);
      name = name.substring(i + 1, i + 2).toUpperCase() + name.substring(i + 2);
      value = name + ': ' + value;
      if(isNote && ruleSet.isSource(a)) {
        if(userOptions.italics)
          value = '<i>' + value + '</i>';
        else
          continue;
      }
      if(sheetAttributes[object] == null)
        sheetAttributes[object] = [];
      sheetAttributes[object][sheetAttributes[object].length] = value;
    }
  }

  for(a in sheetAttributes) {
    var attr = sheetAttributes[a];
    if(typeof(attr) == 'object') {
      attr.sort();
      // If all values in the array are 1|true, assume that it's a set and
      // suppress display of the values
      if(attr.join(',').replace(/: (1|true)(,|$)/g, '').indexOf(':') < 0)
        for(i = 0; i < attr.length; i++)
          attr[i] = attr[i].replace(/:.*/, '');
      sheetAttributes[a] = attr;
    }
  }

  var attrImage = 'var attributes = ' + ObjectViewer.toCode(attrs) + ';\n';
  if(attrs.notes && attrs.notes.indexOf('+COMPUTE') >= 0) {
    attrImage +=
      'var computed = ' + ObjectViewer.toCode(computedAttributes) + ';\n';
  }

  var versions =
    'Quilvyn version ' + VERSION + '; ' + [ruleSet.getName() + ' version ' + ruleSet.getVersion()].concat(ruleSet.getPlugins().map(x => x.name + ' version ' + x.VERSION)).join('; ');

  return '<!DOCTYPE html>\n' +
         '<' + '!' + '-- Generated ' + new Date().toString() +
           ' by ' + versions + ' --' + '>\n' +
         '<html lang="en">\n' +
         '<head>\n' +
         '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>\n' +
         '  <title>' + sheetAttributes.Name + '</title>\n' +
         '  <script>\n' +
         attrImage +
         // Careful: don't want to close quilvyn.html's script tag here!
         '  </' + 'script>\n' +
         '</head>\n' +
         '<body>\n' +
         ruleSet.getViewer(userOptions.style).getHtml(sheetAttributes, '_top') + '\n' +
         '</body>\n' +
         '</html>\n';

};

/* Opens a window that contains HTML for #html# in readable/copyable format. */
Quilvyn.showHtml = function(html) {
  if(Quilvyn.showHtml.htmlWindow==null || Quilvyn.showHtml.htmlWindow.closed) {
    Quilvyn.showHtml.htmlWindow =
      window.open('', '', FEATURES_OF_OTHER_WINDOWS);
  }
  html = html.replace(/</g, '&lt;');
  html = html.replace(/>/g, '&gt;');
  Quilvyn.showHtml.htmlWindow.document.write(
    '<html><head><title>HTML</title></head>\n' +
    '<body><pre>' + html + '</pre></body></html>\n'
  );
  Quilvyn.showHtml.htmlWindow.document.close();
  Quilvyn.showHtml.htmlWindow.focus();
};

/* Stores the current values of options in the browser. */
Quilvyn.storePersistentInfo = function() {
  for(var a in userOptions) {
    STORAGE.setItem(PERSISTENT_INFO_PREFIX + a, userOptions[a] + '');
  }
};

/*
 * Opens a window that displays a summary of the attributes of all characters
 * that have been loaded into the editor.
 */
Quilvyn.summarizeCachedAttrs = function() {
  var combinedAttrs = { };
  var htmlBits = [
    '<head><title>Quilvyn Character Attribute Summary</title></head>',
    '<body ' + Quilvyn.htmlBackgroundAttr() + '>',
    '<h1>Quilvyn Character Attribute Summary</h1>',
    '<table border="1">'
  ];
  var formats = ruleSet.getFormats(ruleSet, userOptions.style);
  for(var character in characterCache) {
    if(character == '')
      continue;
    var attrs = ruleSet.applyRules(characterCache[character]);
    for(var attr in attrs) {
      if(ruleSet.isSource(attr) ||
         attr.indexOf('features.') >= 0 ||
         attr.match(/\.[0-9]+$/))
        continue;
      var value = attrs[attr];
      if(attr.indexOf('Notes.') >= 0 && value == 0)
        continue;
      if(combinedAttrs[attr] == null)
        combinedAttrs[attr] = [];
      var format = formats[attr];
      if(format != null)
        value = format.replace(/%V/g, value);
      combinedAttrs[attr].push(value);
    }
  }
  var keys = QuilvynUtils.getKeys(combinedAttrs);
  keys.sort();
  for(var i = 0; i < keys.length; i++) {
    var attr = keys[i];
    var values = combinedAttrs[attr];
    values.sort();
    var unique = [];
    for(var j = 0; j < values.length; j++) {
      var value = values[j];
      var count = 1;
      while(j < values.length && values[j + 1] == value) {
        count++;
        j++;
      }
      if(count > 1)
        value = count + '@' + value;
      unique.push(value);
    }
    htmlBits[htmlBits.length] =
      '<tr><th>' + attr + '</th><td>' + unique.join(',') + '</td></tr>';
  }
  htmlBits[htmlBits.length] = '</table>';
  htmlBits[htmlBits.length] = '</body></html>\n';
  if(Quilvyn.summarizeCachedAttrs.win == null ||
     Quilvyn.summarizeCachedAttrs.win.closed)
    Quilvyn.summarizeCachedAttrs.win =
      window.open('', '', FEATURES_OF_OTHER_WINDOWS);
  else
    Quilvyn.summarizeCachedAttrs.win.focus();
  Quilvyn.summarizeCachedAttrs.win.document.write(htmlBits.join('\n'));
  Quilvyn.summarizeCachedAttrs.win.document.close();
  Quilvyn.summarizeCachedAttrs.win.focus();
};

/* Undoes the most recent change to the the displayed character. */
Quilvyn.undo = function() {
  if(characterUndo.length > 0) {
    character = characterUndo.pop();
    Quilvyn.refreshEditor(true);
    Quilvyn.refreshSheet();
    editWindow.focus();
  } else {
    editWindow.alert("No changes to undo");
  }
};

/* Callback invoked when the user changes the editor value of Input #input#. */
Quilvyn.update = function(input) {

  var name = input.name;
  var value = InputGetValue(input);
  if(value === true)
    value = 1;
  else if(value === false)
    value = 0;
  else if(typeof(value) == 'string' && value.match(/^-?\d+$/))
    value -= 0;
  if(name == 'about') {
    if(Quilvyn.aboutWindow == null || Quilvyn.aboutWindow.closed) {
      Quilvyn.aboutWindow = window.open('', '', FEATURES_OF_OTHER_WINDOWS);
      Quilvyn.aboutWindow.document.write(
        '<html>\n',
        '<head>\n',
        '<title>About Quilvyn</title>\n',
        '</head>\n',
        '<body ' + Quilvyn.htmlBackgroundAttr() + '>\n',
        ABOUT_TEXT.replace(/\n/g, '<br/>\n<br/>\n'),
        '\n</body>\n',
        '</html>\n'
      );
      Quilvyn.aboutWindow.document.close();
    }
    Quilvyn.aboutWindow.focus();
  } else if(name == 'help') {
    if(Quilvyn.helpWindow == null || Quilvyn.helpWindow.closed) {
      Quilvyn.helpWindow = window.open(HELP_URL, '');
      // NOTE: The following lines have no effect--url body properties override
      Quilvyn.helpWindow.document.body.style.background =
        userOptions.bgColor;
      if(userOptions.bgImage)
        Quilvyn.helpWindow.document.body.style.background =
          userOptions.bgImage;
    }
    Quilvyn.helpWindow.focus();
  } else if(name == 'options') {
    Quilvyn.modifyOptions(true);
  } else if(name == 'rules') {
    ruleSet = ruleSets[value];
    Quilvyn.refreshEditor(true);
    Quilvyn.refreshSheet();
  } else if(name == 'rulesNotes') {
    if(Quilvyn.rulesNotesWindow == null || Quilvyn.rulesNotesWindow.closed) {
      Quilvyn.rulesNotesWindow = window.open('', '', FEATURES_OF_OTHER_WINDOWS);
    }
    Quilvyn.rulesNotesWindow.document.write(
      '<html>\n',
      '<head>\n',
      '<title>Rule Notes for ' + InputGetValue(editForm.rules) + '</title>\n',
      '</head>\n',
      '<body ' + Quilvyn.htmlBackgroundAttr() + '>\n',
      ruleSet.ruleNotes()
    );
    ruleSet.getPlugins().map
      (x => Quilvyn.rulesNotesWindow.document.write(x.rules.ruleNotes()));
    Quilvyn.rulesNotesWindow.document.write(
      '\n</body>\n',
      '</html>\n'
    );
    Quilvyn.rulesNotesWindow.document.close();
    Quilvyn.rulesNotesWindow.focus();
  } else if(name == 'ruleRules') {
    var awin = window.open('', '', FEATURES_OF_OTHER_WINDOWS);
    awin.document.write
      ('<html><head><title>RULES</title></head><body><pre>\n');
    awin.document.write(ruleSet.toHtml());
    awin.document.write('</pre></body></html>');
    awin.document.close();
    awin.focus();
  } else if(name == 'character') {
    input.selectedIndex = 0;
    if(value == '---select one---')
      ; /* empty--Safari bug workaround */
    else if(value == 'Delete...')
      Quilvyn.deleteCharacter(true);
    else if(value == 'Print...')
      sheetWindow.print();
    else if(value == 'Save')
      Quilvyn.saveCharacter(characterPath);
    else if(value == 'Save As...')
      Quilvyn.saveCharacter('');
    else if(value == 'Export')
      Quilvyn.exportCharacters();
    else if(value == 'Summary')
      Quilvyn.summarizeCachedAttrs();
    else if(value == 'HTML') {
      var html = Quilvyn.sheetHtml(character);
      if('DEBUG' in customCollections) {
        var group = editWindow.prompt('Group?');
        if(group) {
          html = '';
          for(var path in STORAGE) {
            if(path.startsWith(PERSISTENT_CHARACTER_PREFIX) &&
               path.includes(group))
              html +=
                Quilvyn.sheetHtml(Quilvyn.retrieveCharacterFromStorage(path));
          }
        }
      }
      Quilvyn.showHtml(html);
    } else if(userOptions.warnAboutDiscard &&
       !QuilvynUtils.clones(character, characterCache[characterPath]) &&
       !editWindow.confirm('Discard changes to character?'))
      ; /* empty */
    else if(value == 'Import...')
      Quilvyn.importCharacters(true);
    else if(value == 'New')
      Quilvyn.newCharacter();
    else if(value == 'Random...')
      Quilvyn.randomizeCharacter(true);
    else
      Quilvyn.openCharacter(value);
  } else if(name == 'custom') {
    InputSetValue(input, customCollection);
    if(value == 'Add Items...')
      Quilvyn.customAddItems(true);
    else if(value == 'Apply Collection...')
      Quilvyn.customApplyCollection();
    else if(value == 'Delete Collection...')
      Quilvyn.customDeleteCollection();
    else if(value == 'Delete Item...')
      Quilvyn.customDeleteItem();
    else if(value == 'Import...')
      Quilvyn.customImportCollections(true);
    else if(value == 'New Collection...')
      Quilvyn.customNewCollection();
    else if(value == 'View/Export All')
      Quilvyn.customExportCollections(null);
    else {
      customCollection = value;
      InputSetValue(input, customCollection);
    }
  } else if(name == 'randomize') {
    value = input.attrs[input.selectedIndex]; // Get attr for selected label
    input.selectedIndex = 0;
    characterUndo.push(QuilvynUtils.clone(character));
    ruleSet.randomizeOneAttribute(character, value);
    Quilvyn.refreshEditor(false);
    Quilvyn.refreshSheet();
  } else if(name == 'clear') {
    value = input.attrs[input.selectedIndex]; // Get attr for selected label
    input.selectedIndex = 0;
    characterUndo.push(QuilvynUtils.clone(character));
    for(var a in character) {
      if(a.indexOf(value + '.') == 0)
        delete character[a];
    }
    Quilvyn.refreshEditor(false);
    Quilvyn.refreshSheet();
  } else if(name.indexOf('_filter') >= 0) {
    character[name] = value;
    Quilvyn.refreshEditor(false);
  } else if(name.indexOf('_sel') >= 0) {
    name = name.replace('_sel', '');
    var sub = editForm[name + '_sub'];
    if(sub) {
      // Update the sub-menu any suboptions of the new _sel value
      var filter = character[name + '_filter'] || '';
      var subOpts = input.allOpts
          .filter(x => x.startsWith(value + '(') && x.includes(filter))
          .map(x => x.replace(/^[^(]*\(|\)$/g, ''));
      InputSetOptions(sub, subOpts);
      if(subOpts.length > 0) {
        sub.style.display = 'block';
        value += '(' + subOpts[0] + ')';
      } else {
        // Remove the sub-menu from the display
        sub.style.display = 'none';
      }
    }
    if(editForm[name] != null)
      InputSetValue(editForm[name], character[name + '.' + value]);
  } else if(name.indexOf('_sub') >= 0) {
    name = name.replace(/_sub/, '');
    if(editForm[name] != null)
      InputSetValue(editForm[name], character[name + '.' + InputGetValue(editForm[name + '_sel']) + '(' + value + ')']);
  } else {
    var selector = editForm[name + '_sel'];
    if(selector != null) {
      var subselector = editForm[name + '_sub'];
      name += '.' + InputGetValue(selector) + (subselector && subselector.options.length > 0 ? '(' + InputGetValue(subselector) + ')' : '');
    }
    characterUndo.push(QuilvynUtils.clone(character));
    if(!value && (value === '' || input.type == 'checkbox'))
      delete character[name];
    else if(typeof(value) == 'string' &&
            value.match(/^\+-?\d+$/) &&
            (typeof(character[name]) == 'number' ||
             (typeof(character[name]) == 'string' &&
              character[name].match(/^\d+$/)))) {
      character[name] = (character[name] - 0) + (value.substring(1) - 0);
      InputSetValue(input, character[name]);
    }
    else
      character[name] = value;
    Quilvyn.refreshSheet();
  }

};
