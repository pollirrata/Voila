// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var itemClicked = function (e) {
        e.detail.itemPromise.then(function (item) {
            WinJS.Navigation.navigate("/pages/search/detail.html", item.data);
        });
    }

    var settings = Windows.Storage.ApplicationData.current.localSettings;

    var itemList = new WinJS.Binding.List(jQuery.parseJSON(settings.values["favorites"]));

    // Create a namespace to make the data publicly
    // accessible. 
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
