window.addEvent('domready', function () {
  // Option 1: Use the manifest:
  new FancySettings.initWithManifest(function (settings) {
    //-- register 'action' event callback on the `myButton` setting from ./manifest:78
    settings.manifest.myButton.addEvent('action', function () {
      alert('You clicked me!');
    });

    //-- register 'action' event callback on the `myButton` setting from ./manifest:78
    settings.manifest.removeKey.addEvent('action', function () {
      var removeIds = [];

      [].slice.call(settings.manifest.storedKeys.element.options).forEach(function (option) {
        if (option.selected) removeIds.push(option.value)
      });

      options.keys = options.keys.filter(function (key) {
        return removeIds.every(function (id) {
          return id !== key.id;
        })
      });

      chrome.storage.sync.set({options: options}, function () {
        location.reload();
      })
    });

    //-- register 'modal_done' event callback on the `addKey` setting from ./manifest:17
    settings.manifest.addKey.addEvent('modal_done', function () {
      var keyName = JSON.parse(localStorage.getItem('store.settings.keyName'))
        , keyText = JSON.parse(localStorage.getItem('store.settings.keyText'))
        ;

      //-- error if keyName or keyText is empty
      if (!keyName || !keyText) {
        return alert('Key name and key text must be provided!');
      }

      //-- add key to encrypted storage
      var newKey = {
        email: keyName,
        id   : keyName
      };

      if (options.keys && options.keys.length > 0) {
        options.keys.push(newKey);
      } else {
        options.keys = [newKey]
      }

      //-- persist options from setting page in `chrome.storage` (see https://developer.chrome.com/extensions/storage)
      chrome.storage.sync.set({options: options}, function () {
        //-- cleanup entered key from localStorage
        localStorage.removeItem('store.settings.keyName');
        localStorage.removeItem('store.settings.keyText');

        //-- reload page so storage retrieval can happen before `FancySettings` is init'ed
        location.reload();
      })
    })
  });

  // Option 2: Do everything manually:
  /*
  var settings = new FancySettings('My Extension', 'icon.png');

  var username = settings.create({
    tab  : i18n.get('information'),
    group: i18n.get('login'),
    name : 'username',
    type : 'text',
    label: i18n.get('username'),
    text : i18n.get('x-characters')
  });

  var password = settings.create({
    tab   : i18n.get('information'),
    group : i18n.get('login'),
    name  : 'password',
    type  : 'text',
    label : i18n.get('password'),
    text  : i18n.get('x-characters-pw'),
    masked: true
  });

  var myDescription = settings.create({
    tab  : i18n.get('information'),
    group: i18n.get('login'),
    name : 'myDescription',
    type : 'description',
    text : i18n.get('description')
  });

  var myButton = settings.create({
    tab  : 'Information',
    group: 'Logout',
    name : 'myButton',
    type : 'button',
    label: 'Disconnect:',
    text : 'Logout'
  });

  // ...

  myButton.addEvent('action', function () {
    alert('You clicked me!');
  });

  settings.align([
    username,
    password
  ]);
  */
});
