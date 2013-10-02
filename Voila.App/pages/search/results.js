// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/search/results.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            //var mySessionState = WinJS.Application.sessionState;

            //var dataList = new WinJS.Binding.List(mySessionState["searchResults"])

            //var publicMembers =
            //{
            //    data: dataList
            //};

            //var computeIngredients = function (ingredients) {

            //    return ingredients.length;
            //}

            //WinJS.Namespace.define("SearchResults", publicMembers);

            
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
