(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/search/search.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var recipesComponent = new Voila.Component.Recipes();

            var onRecipesSearch = function () {
                var ingredients = $("#query").val();
                var response = recipesComponent.searchByIngredients(ingredients);

                if (response == "") {
                    //no se encontraron recetas
                    return;
                }

                
                var mySessionState = WinJS.Application.sessionState;

                var dataList = new WinJS.Binding.List(jQuery.parseJSON(response));

                mySessionState["searchResults"] = dataList

                WinJS.Navigation.navigate("/pages/search/results.html");
            }

            $("#go").click(onRecipesSearch);
        }
    });
})();
