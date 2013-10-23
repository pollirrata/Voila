// For an introduction to the Navigation template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232506
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.addEventListener("checkpoint", function (args) {
        // The app is about to be suspended, so we save the current
        // navigation history.
        nav.history.current = null;
        nav.history.backStack = null;
        app.sessionState.history = nav.history;
    }, false);

    var settingsPane = Windows.UI.ApplicationSettings.SettingsPane.getForCurrentView();

    function commandsRequested(eventArgs) {
        var applicationCommands = eventArgs.request.applicationCommands;
        var privacyCommand = new Windows.UI.ApplicationSettings.SettingsCommand('privacy', 'Política de privacidad', function () {
            window.open('http://jericallaapps.azurewebsites.net/voila/privacy.txt');
        });
        applicationCommands.append(privacyCommand);
    }

    settingsPane.addEventListener("commandsrequested", commandsRequested);

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }

            var settings = Windows.Storage.ApplicationData.current.localSettings;
            var localFolder = Windows.Storage.ApplicationData.current.localFolder;
            var recipesComponent = new Voila.Component.Recipes();

            if (!settings.values["userIdentifier"]) {
                var userComponent = new Voila.Component.User();
                var uuid = userComponent.getNewUUID();
                settings.values["userIdentifier"] = uuid;
            }


            var popular = [];
            var recipes = [];

            //Agregar los populares al local storage
            recipesComponent.getPopularAsync()
            .then(function (list) {
                if (list && list != "") {
                    popular = jQuery.parseJSON(list);
                }
            }).done(function () {
                localFolder.createFileAsync("popular.txt", Windows.Storage.CreationCollisionOption.replaceExisting)
                  .then(function (file) {
                      return Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(popular));
                  }).then(function () {
                      recipesComponent.updatePopularCache();
                  }).done(function () {
                      //*************************************************************************
                      //Agregar los favoritos al local storage
                      recipesComponent.getFavoritesAsync(settings.values["userIdentifier"])
                          .then(function (dataList) {
                              if (dataList && dataList != "") {
                                  recipes = jQuery.parseJSON(dataList);

                                  for (var i in recipes) {
                                      recipes[i].favorita = true;
                                      recipes[i].iconoFavorita = "../../images/favorito - 20.png";
                                      var stars = recipesComponent.getStars(recipes[i]._id).toString();
                                      recipes[i].stars = "../../images/pop" + stars + " - 20.png";
                                  }
                              }
                          }).done(function () {
                              localFolder.createFileAsync("favorites.txt", Windows.Storage.CreationCollisionOption.replaceExisting)
                                .then(function (file) {
                                    return Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(recipes));
                                }).done(function () {
                                    recipesComponent.updateFavoritesCache();
                                });
                          });
                      //**************************************************************************
                  });
            });

            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));

        }
    });

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.start();
})();
