(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/search/search.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var recipesComponent = new Voila.Component.Recipes();

            var onRecipesSearch = function () {
                $("#noresults").css("visibility", "hidden");

                var ingredients = $("#query").val();

                if (ingredients == "") {
                    return;
                }

                var response = recipesComponent.searchByIngredients(ingredients);

                if (response == "" || response == "[]") {
                    $("#noresults").css("visibility", "visible");
                    return;
                }

                
                //var mySessionState = WinJS.Application.sessionState;

                var dataList = new WinJS.Binding.List(jQuery.parseJSON(response));

                //mySessionState["searchResults"] = dataList

                WinJS.Navigation.navigate("/pages/search/results.html", dataList);
            }

            $("#go").click(onRecipesSearch);
        },
        unload: function () {
            $("body").css("background-color", "white");
        }
    });
})();
