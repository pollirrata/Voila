// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
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

    WinJS.UI.Pages.define("/pages/info/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var infoComponent = new Voila.Component.Info();
            var consejos = jQuery.parseJSON(infoComponent.getAdviceTitles());


            var titlesbox = document.getElementById("titles");
            for (var i in consejos) {
                var element = document.createElement("div");
                element.innerText = consejos[i].titulo;
                element.setAttribute("data-val-id", consejos[i].id);
                element.setAttribute("data-val-consejo", consejos[i].consejo);
                titlesbox.appendChild(element);
            };

            $("#rightside #titles div").click(function () {
                $("#rightside #advice h3").text($(this).text());
                $("#rightside #advice div").text($(this).attr("data-val-consejo"));

            });

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
