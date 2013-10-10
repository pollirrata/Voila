﻿(function () {
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

                var recipes = jQuery.parseJSON(response);
                //for(var i= 0; i<recipes.lenght; i++){
                for (var i in recipes) {
                    recipes[i].favorita = recipesComponent.checkIfFavorited(recipes[i]._id);
                    if (recipes[i].favorita) {
                        recipes[i].iconoFavorita = "../../images/favorito - 20.png";
                    } else {
                        recipes[i].iconoFavorita = "../../images/fav - 20.png";
                    }
                }

                WinJS.Navigation.navigate("/pages/search/results.html", new WinJS.Binding.List(recipes));
            }

            $("#go").click(onRecipesSearch);
        },
        unload: function () {
            $("body").css("background-color", "white");
        }
    });
})();
