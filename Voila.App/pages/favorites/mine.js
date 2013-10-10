﻿// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var itemClicked = function (e) {
        e.detail.itemPromise.then(function (item) {
            WinJS.Navigation.navigate("/pages/search/detail.html", item.data);
        });
    }

    var goSearch = function () {
        WinJS.Navigation.history = {};
        $("body").css("background-color", "#D24726");
        WinJS.Navigation.navigate("/pages/search/search.html")
    };

    var goFavorites = function () {
        WinJS.Navigation.navigate("/pages/favorites/mine.html")
    };

    var goPopular = function () {
        WinJS.Navigation.navigate("/pages/favorites/lastmonth.html")
    };

    var goInfo = function () {
        WinJS.Navigation.navigate("/pages/info/home.html")
    };

    //var settings = Windows.Storage.ApplicationData.current.localSettings;
    //var localFolder = Windows.Storage.ApplicationData.current.localFolder;

    //localFolder.getFileAsync("favorites.txt")
    //   .then(function (file) {
    //       return Windows.Storage.FileIO.readTextAsync(file);
    //   }).done(function (favs) {
    //       var recipes = jQuery.parseJSON(favs);

    //       for (var i in recipes) {
    //           recipes[i].favorita = true;
    //           recipes[i].iconoFavorita = "../../images/favorito - 20.png";
    //       }

    //       var itemList = new WinJS.Binding.List(recipes);

    //       //var publicMembers =
    //       //    {
    //       //        itemList: itemList
    //       //    };
    //       WinJS.Namespace.define("Favorites", itemList);
    //   }, function () {
    //       // data not found
    //   });

    var recipesComponent = new Voila.Component.Recipes();
    var itemList = new WinJS.Binding.List(jQuery.parseJSON(recipesComponent.getFavoritesCacheString()));

    var publicMembers =
        {
            itemList: itemList
        };
    WinJS.Namespace.define("Favorites", publicMembers);


    WinJS.UI.Pages.define("/pages/favorites/mine.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.

            resultsListView.addEventListener("iteminvoked", itemClicked);

            $("#goSearch").click(goSearch);
            $("#goFavorites").click(goFavorites);
            $("#goPopular").click(goPopular);
            $("#goInfo").click(goInfo);
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();