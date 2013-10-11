// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    var recipe = null;

    WinJS.Namespace.define("Jericalla.UI", {
        PagedList: WinJS.Class.define(function (element, options) {
            options = options || {};
            this._setElement(element);
            this._setItems(options.itemList);
            this._setListType(options.listType);
            this._setPageSize(options.pageSize);
            this._element.winControl = this;
            WinJS.UI.setOptions(this, options);
            this._create();
        },
        {
            //Private
            _element: null,
            _itemList: null,
            _ordered: false,
            _setElement: function (element) {
                this._element = element;
            },
            _setListType: function (listType) {
                this._listType = listType;
            },
            _setPageSize: function (pageSize) {
                this._pageSize = pageSize;
            },
            _setItems: function (itemList) {
                itemList = itemList || [];
                this._itemList = itemList;
            },
            _create: function () {
                var i = 0,
                len = this._itemList.length;
                //bulletList = document.createElement(this._listType);
                //bulletList.id = 'bulletList_' + this._element.id;
                //this._element.setAttribute("list", bulletList.id);

                var bulletList = {};

                if (this._pageSize >= len) {

                    bulletList = document.createElement(this._listType);
                    bulletList.id = 'bulletList_' + this._element.id;
                    bulletList.setAttribute("class", "t1");

                    for (; i < len; i += 1) {
                        var listItem = document.createElement('li');
                        listItem.innerText = this._itemList[i];
                        bulletList.appendChild(listItem);
                    }
                    this._element.appendChild(bulletList);
                } else {
                    var pages = len / this._pageSize;
                    if (len % this._pageSize > 0) {
                        pages = Math.floor(len / this._pageSize) + 1;
                    }

                    for (var p = 2; p <= pages; p++) {
                        var tab = document.createElement("div");
                        tab.setAttribute("class", "tab");
                        tab.setAttribute("data-val", p);
                        tab.innerText = p;
                        this._element.appendChild(tab);
                    }

                    var ulClass = "";
                    for (; i < pages; i += 1) {
                        bulletList = document.createElement(this._listType);
                        if (this._listType == "ol") {
                            bulletList.setAttribute("start", i * this._pageSize + 1);
                        }

                        bulletList.id = 'bulletList_' + this._element.id + "_" + i;

                        for (var j = i * this._pageSize; j < this._pageSize * (i + 1) && j < len; j += 1) {
                            var listItem = document.createElement('li');
                            listItem.innerText = this._itemList[j];
                            bulletList.appendChild(listItem);
                        }
                        bulletList.setAttribute("class", ulClass +  " t"  + (i + 1).toString());
                        this._element.appendChild(bulletList);
                        ulClass = "invisible";
                    }
                }
            },

            //Public
            element: {
                get: function () {
                    return this._element;
                }
            }
        },
        { // static members 
        })
    });



    WinJS.UI.Pages.define("/pages/search/detail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.

        ready: function (element, options) {

            var recipe = WinJS.Navigation.state;

            var recipeDiv = document.getElementById("recipeDetail");

            WinJS.Binding.processAll(recipeDiv, recipe);

            //$("ul").css("background-color", "red");
            $("#recipeDetail .ingredients div").click(function () {
                $("#recipeDetail .ingredients div").removeClass("selected");
                $(this).addClass("selected");

                $("#recipeDetail .ingredients ul").addClass("invisible");
                var id = $(this).attr("data-val");
                $("#recipeDetail .ingredients ul.t" + id).removeClass("invisible");
            })

            $("#recipeDetail .preparation div").click(function () {
                $("#recipeDetail .preparation div").removeClass("selected");
                $(this).addClass("selected");

                $("#recipeDetail .preparation ol").addClass("invisible");
                var id = $(this).attr("data-val");
                $("#recipeDetail .preparation ol.t" + id).removeClass("invisible");
            })


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
                var localFolder = Windows.Storage.ApplicationData.current.localFolder;

                if (!recipe.favorita) {
                    //Si la receta no se pudo agregar a favoritos, el icono en la parte superior no se cambia
                    //ni se agrega al local storage
                    if (recipesComponent.addToFavorites(settings.values["userIdentifier"], recipe._id)) {

                        //cambiar el icono
                        $(".favorite img").attr("src", "images/favorito - 20.png")

                        //agregar al local storage
                        recipe.favorita = true;
                        recipe.iconoFavorita = "../../images/favorito - 20.png";

                        //var stars = recipesComponent.getStars(recipes[i]._id).toString();
                        //recipes[i].stars = "../../images/pop" + stars + " - 20.png";

                        var recipes = jQuery.parseJSON(recipesComponent.getFavoritesCacheString());
                        recipes.push(recipe);

                        localFolder.createFileAsync("favorites.txt", Windows.Storage.CreationCollisionOption.replaceExisting)
                          .then(function (file) {
                              return Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(recipes));
                          }).done(function () {
                              recipesComponent.updateFavoritesCache();
                          });
                    }
                }
            }

            $("#goSearch").click(goSearch);
            $("#goFavorites").click(addFavorites);
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
