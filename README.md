Fancy Settings 1.2
==================

*Create fancy, chrome-look-alike settings for your Chrome or Safari extension in minutes!*


Rationale
---------

The goal of this project is to provide a simple way to generate chrome-like settings pages for use in projects like 
chrome extensions. Settings generation is done all via a javascript object, the "manifest", and event binding can be 
easily customized via javascript.

Ideally this framework contains enough variety of [setting types](#setting-types) that one only needs to edit [the "Manifest" 
(`/source/manifest.js`)](#the-manifest) and the [settings initialization script (`/source/settings.js`)](#settings-initialization) 
such that 


How It Works
---------------

#### Project Structure
```
├── css ─────────────────────────├─( framework css; if you're extending the framework you should add to these )
│   ├── main.css ────────────────├─( main layout )
│   └── setting.css ─────────────├─( styles for each "setting" (ListBox, Button, etc.) )
├── custom.css ──────────────────├─( your css should go here, probably overriding default styles  )
├── i18n.js ─────────────────────├─( your internationalization data )
├── icon.png ────────────────────├─( favicon shown on the settings tab in chrome )
├── index.html ──────────────────├─( index page; loads all javascript and establishes main layout )
├── js ──────────────────────────├─( framework javascript; if you're extending the framework you should add to these )
│   ├── classes ─────────────────├─( mootools-backed framework classes )
│   │   ├── fancy-settings.js    ├─( main entry point; contains `FancySettings.initWithManifest` function, used to 
│   │   │                        │       build all settings and add them to the DOM )
│   │   ├── search.js ───────────├─( provides management interface for the search index )
│   │   ├── setting.js ──────────├─( classes for all setting types (e.g. ListBox, Button, etc.) and the Setting class
│   │   │                        │       itself; includes DOM creation and event logic )
│   │   └── tab.js ──────────────├─( class for `Tab`; includes DOM creation and tab switching )
│   └── i18n.js ─────────────────├─( internationalization interface; retrieves i18n values registered in `/source/i18n.js` )
├── lib ─────────────────────────├─( dependencies
│   ├── default.css ─────────────├─( base css for elements and utility classes )
│   ├── mootools-core.js ────────├─( mootools )
│   └── store.js ────────────────├─( localStorage interface )
├── manifest.js ─────────────────├─( your settings manifest; see [The "Manifest"](#the--manifest)
└── settings.js ─────────────────└─( your settings pre-initialization; `FancySettings.initWithManifest` is called here 
                                         after any prerequisite async event (e.g. domready, retrieving values from 
                                         `chrome.storage`, etc.); see [Settings Initialization](#settings-initialization) )
```

#### The "Manifest"
The "Manifest" (`/source/manifest.js`) is a simple javascript file with registers a global object: `manifest`. This 
object contains the following properties:

* `name`: Name of the manifest
* `icon`: Filename of the favicon to show for the options tab in chrome
* `alignment` _(optional)_: _WIP - not sure how to explain this yet_
* `settings`:

  An array of a "flattened" settings structure; each element in this array describes one setting. All setting objects, 
  regardless of type have the following properties:
  
  * `tab`: The name (and text) of the tab which this setting will belong to; multiple settings will use the same value here to be on the same tab
  * `name`: The name of this setting; this name will be used to reference it later via javascript, usually as the key of an object
  * `type`: The type of setting, see [setting types](#setting-types) below
  * `label` _(optional)_: The text of a `<label>` element which will be rendered before the setting element
  * `group` _(optional)_: The name (and text) of a group which this setting will belong to within a tab; multiple settings can use the same value here to be in the same group

#### Events
###### **(WIP)**

#### Setting Types

| Type | Description | Additional Properties | Events |
|------|-------------|-----------------------|--------|
| `description` | renders a `<p>` element containing block of text | <ul><li>`text`: the text contents of the `<p>` element</li></ul> | |
| `button` | renders a `<button>` element | <ul><li>`text`: the text of the `<button>` element</li></ul> | <ul><li>`action`: fires on button `click`</li></ul> |
| `text` | renders an `<input>` element with a `type` attribute of either `text` (default) or `password` | <ul><li>`text`: the value of the `placeholder` attribute of the `<input>` element</li><li>`masked`: a boolean property; if true, sets the `type` attribute of the `<input>` element to `password`</li></ul> | |
| `textarea` | renders an `<input type='textarea'>` element | <ul><li>`text`: _not sure what this does yet_</li><li>`value`: _not sure what this does yet_</li></ul> | `action`: fires on textarea `change` & `keyup` |
| `checkbox` | renders an `<input type='checkbox'>` element | _HINT: use `label` with this setting type_ | <ul><li>`action`: fires on checkbox `change`</li></ul> |
| `slider` | renders an `<input type='range'>` element | <ul><li>`min`: sets the `min` attribute</li><li>`max`: sets the `max` attribute</li><li>`step`: sets the `step` attribute</li><li>`display`: a boolean property; if true (default), renders the value of the range beside it (unless modified by `displayModifier`)</li><li>`displayModifier`: a function which receives the value of the range and whose return value is rendered beside the range if `display` is true</li></ul> | <ul><li>`action`: fires on range `change`</li></ul> |
| `popupButton` | a bit of a misnomer; render's a `<select>` element with `<option>` childred corresponding to the `options` array | <ul><li>`options`: an object with `groups` and `values` properties<ul><li>`groups`: an array of strings; each renders an `<optgroup>` element whose `label` attribute is the value of the string</li><li>`values`: array of objects which correspond to the `<option>` elements to go inside the `<optgroup>`s; each object should have a `text` property which renders as the text node inside of the `<option>`, a `value` property which is the value of the `value` attribute on the `<option>` element, and a `group` property which detmines which `<optgroup>` a given `<option>` is placed</li></ul></li></ul> | `action`: fires on select `change` |
| `listbox` | renders a `<select>` element in listBox mode with `<option>` elements corresponding to the `options` array | <ul><li>`multiple`: adds the `multiple` attribute, allowing for multiple options to be selected simultaneously</li><li>`options`: an array of objects which correspond to the `<option>` elements to go inside the `<select>`; each object should have a `text` property which renders as the text node inside of the `<option>` and a `value` property which is the value of the `value` attribute on the `<option>` element<\li><\ul> | <ul><li>`action`: fires on select `change`</li></ul> |
| `radioButtons` | renders a set of `<input type='radio'>` elements corresponding to the `options` array | <ul><li>`options`: an array of objects which correspond to the `<input type='radio'>`; each object should have a `text` property which renders as the text node inside of the `<input type='radio'>` and a `value` property which is the value of the `value` attribute on the `<input type='radio'>` element</li></ul> | <ul><li>`action`: fires on select `change`</li></ul> |
| `modalButton` | renders a button which, when clicked, opens a modal over the current settings tab, containing nested settings | <ul><li>`text`: the text of the `<button>` element</li><li>`modal`: an object with `title` and `contents` properties<ul><li>`title`: the text which is rendered in an `<h2>` at the top of the modal</li><li>`contents`: an array of nested [settings](#setting-types) which will be rendered inside the modal</li></ul></li></ul> | <ul><li>`action`: fires on button `click`</li><li>`modal_done`: fires on "done" button `click` (inside modal)</li></ul> |
| `fileButton` | **WIP** | | |


#### Settings Initialization
###### **(WIP)**

#### Using Settings Values

All values in the settings page are automatically persisted via `localStorage` objects with the prefix of 
`store.settings.` (e.g. `store.settings.myButton`). You can then retrieve the values via javascript and operate on them 
and ultimately store your chrome extension settings via [`chrome.storage`](https://developer.chrome.com/extensions/storage) 
for use in you extension.

In the sample code of this repo, this logic resides in the [`settings`](#settings-initialization) file as well but could 
just as easily be factored out.


How To Use **(WIP)**
----------

1. `npm i --save or something`...
1. add things to your build process...
1. customize [`manifest.js`](#the-manifest)
1. customize [`settings.js`](#settings-initialization)
1. ...


