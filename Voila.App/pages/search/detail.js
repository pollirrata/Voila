// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var recipe = null;
    
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

    var addFavorites = function () {
        var recipesComponent = new Voila.Component.Recipes();

        var settings = Windows.Storage.ApplicationData.current.localSettings;
        //Si la receta no se pudo agregar a favoritos, el icono en la parte superior no se cambia
        if (recipesComponent.addToFavorites(settings.values["userIdentifier"], recipe._id)) {
            $(".favorite img").attr("src", "images/favorito - 20.png")
        }
    }

    WinJS.UI.Pages.define("/pages/search/detail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.

        ready: function (element, options) {
            recipe = WinJS.Navigation.state;

            var recipeDiv = document.getElementById("recipeDetail");

            WinJS.Binding.processAll(recipeDiv, recipe);

            $("#goSearch").click(goSearch);
            $("#goFavorites").click(goFavorites);
            $("#goPopular").click(goPopular);
            $("#goInfo").click(goInfo);
            $("#addFavorites").click(addFavorites);

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
