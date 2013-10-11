(function () {
    WinJS.Namespace.define("Jericalla.UI", {
        PagedList: WinJS.Class.define(function (element, options) {
            options = options || {};
            this._setElement(element);
            this._setItems(options.itemList);
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
            _setOrdered: function (ordered) {
                this._ordered = ordered;
            },
            _setItems: function (itemList) {
                itemList = itemList || [];
                this._itemList = itemList;
            },
            _create: function () {
                var i = 0,
                len = this._itemList.length,
                bulletList = document.createElement('ol');
                bulletList.id = 'bulletList_' + this._element.id;
                for (; i < len; i += 1) {
                    var listItem = document.createElement('li');
                    listItem.innerText = this._itemList[i];
                    bulletList.appendChild(listItem);
                }
                this._element.appendChild(bulletList);
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

    //WinJS.Namespace.define("jericalla.UI", {
    //    AutoComplete: WinJS.Class.define(function (element, options) {
    //        if (!element || element.tagName.toLowerCase() !== "input")
    //            throw "input type must be provided";
    //        options = options || {};
    //        this._setElement(element);
    //        this._setitemList(options.itemList);
    //        this._element.winControl = this;
    //        WinJS.UI.setOptions(this, options);
    //        this._createDataList();
    //    },
    //    { // instance members 
    //    },
    //    { // static members 
    //    })
    //});
});