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

    WinJS.UI.Pages.define("/pages/search/results.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var abstractDiv = document.getElementById("abstract");

            var state = WinJS.Navigation.state;

            WinJS.Binding.processAll(abstractDiv, { qty: state.qty, query: state.query });

            $(".win-backbutton").click(function () {
                $("body").css("background-color", "#D24726");
            });

            resultsListView.addEventListener("iteminvoked", itemClicked);

            $("#goSearch").click(goSearch);
            $("#goFavorites").click(goFavorites);
            $("#goPopular").click(goPopular);
            $("#goInfo").click(goInfo);
        },

        unload: function (e) {

        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
