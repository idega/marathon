if (typeof(stepPageWidth) != "undefined")
{
  stepPageWidth.config = [985]; // set the page-width snap-limit at 985px.
}


if (typeof(boxRounder) != "undefined")
{
  boxRounder.selectors["div.rbox"] = { handle : "rbox" };
  boxRounder.selectors["div.attention"] = { handle : "attention" };
  // depricated ... to be removed
  boxRounder.selectors["div.Error"] = { handle : "Error" };
  boxRounder.selectors["div.Attention"] = { handle : "Attention" };
  boxRounder.selectors["div.Info"] = { handle : "Info" };
  // boxRounder.selectors["div.mainfooter"] = { handle : "mainfooter" };
}


if (typeof(zebraLists) != "undefined")
{
  zebraLists.includes = {
//   "ul.zebra" : {
//     items  : "li",
//     handle : "zebraul"
//   },
    "table" : {
      items : "tr",
      // oddClass : "odd",             // defaults to: "odd"
      // handle : "zebra",             // defaults to: "zebra"
      // subClasses : { "child" : 1 }, // defaults to: {}
      excludeClasses : {              // defaults to: {}
        "hd" : 1,
        "total" : 1
      }
    }
  }
}


if (typeof(popupLinks) != "undefined") {
  // Usage:
  // popupLinks.config[cssSelector] = [windowName, windowSettings];
  popupLinks.config["popup"] = [ "_blank", "width=600,height=500"];
  // popupLinks.config["#mySubmitButton"] = [ "invoicewindow", "width=600,height=500"];
  // popupLinks.config["form.popup"] = [ "popupwindow", "width=600,height=500"];
}
