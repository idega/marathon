// if you make any major changes to the DOM (i.e. add popup-links or page elements that require rounded corners), then make sure you run this 
var updateDom = function(_scopeElm) // if _scopeElm is undefined (or false) then the whole document is refreshed - which may take a bit longer.
{
  if (typeof(boxRounder) != "undefined") { boxRounder.init(_scopeElm); }
  if (typeof(popupLinks) != "undefined") { popupLinks.init(_scopeElm); }
  if (typeof(zebraLists) != "undefined") { zebraLists.init(_scopeElm); }
};


if (typeof(stepPageWidth) != "undefined") { stepPageWidth.init(); }
updateDom(); // initialize the dom modification functions


(function()
{
  // create the white "pseudo-shadow" element for the topbox header
  var topboxHead = DOM.get(".topbox .boxhead")[0];
  if (topboxHead)
  {
    var innerText = DOM.innerText(topboxHead).replace(/(^\s+|\s+$)/, "");
    if (innerText)
    {
      DOM.prependChild( document.createTextNode(" "), topboxHead);
      DOM.prependChild( DOM.makeElement('<span class="screen shadow">'+DOM.innerText(topboxHead)+'</span>'), topboxHead);
    }
  }

  // insert an empty <i> after each main menu-item that has a submenu. (used for adding extra icons to the menu.)
  var _menuItems = DOM.get("div.mainnav li.branch");
  for (var i=0,l=_menuItems.length; i<l; i++)
  {
    DOM.insertAfter(document.createElement("i"), _menuItems[i].getElementsByTagName("a")[0]);
  }

})();


