// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var itemClicked = function (e) {
        e.detail.itemPromise.then(function (item) {

            var recipe = item.data;

            WinJS.Navigation.navigate("/pages/search/detail.html", recipe);

            WinJS.Namespace.define("Data", {
                ingredients: recipe.ingredientes,
                preparation: recipe.preparacion
            });
        });
    }

    var goSearch = function () {
        WinJS.Navigation.history = {};
        $("body").css("background-color", "#D24726");
        WinJS.Navigation.navigate("/pages/search/search.html")
    };

    var goFavorites = function () {
        var recipesComponent = new Voila.Component.Recipes();

        //recipesComponent.updateFavoritesCache();

        var itemList = new WinJS.Binding.List(jQuery.parseJSON(recipesComponent.getFavoritesCacheString()));

        var publicMembers =
            {
                itemList: itemList
            };
        WinJS.Namespace.define("Favorites", publicMembers);

        WinJS.Navigation.navigate("/pages/favorites/mine.html", Date.toString())
    };

    var goPopular = function () {
        WinJS.Navigation.navigate("/pages/favorites/lastmonth.html")
    };

    var goInfo = function () {
        WinJS.Navigation.navigate("/pages/info/home.html")
    };


    var recipesComponent = new Voila.Component.Recipes();

    var recipes = jQuery.parseJSON(recipesComponent.getPopularList(8));

    for (var i in recipes) {
        var id = recipes[i]._id;
        recipes[i].favorita = recipesComponent.checkIfFavorited(id);
        if (recipes[i].favorita) {
            recipes[i].iconoFavorita = "../../images/favorito - 20.png";
        } else {
            recipes[i].iconoFavorita = "../../images/fav - 20.png";
        }
        var stars = recipesComponent.getStars(id).toString();
        recipes[i].stars = "../../images/pop" + stars + " - 20.png";
    }

    var itemList = new WinJS.Binding.List(recipes);

    var publicMembers =
        {
            itemList: itemList
        };
    WinJS.Namespace.define("Popular", publicMembers);

    WinJS.UI.Pages.define("/pages/favorites/lastmonth.html", {
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
