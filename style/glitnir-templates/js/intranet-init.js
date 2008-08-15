
if (typeof(treeCollapse) != "undefined") { treeCollapse.init(); }
// updateDom(); // initialize the dom modification functions

if (typeof(boxRounder) != "undefined") {
  boxRounder.selectors = {
    ".rbox" : {},
    ".topbox" : {}
  }
  boxRounder.init();
}

if (typeof(currencyCalculator) != "undefined") {
  currencyCalculator.mtab = {
    ISK : 1,
    USD : 75.32,
    GBP : 133.48,
    CAD : 61.83,
    DKK : 12.1,
    NOK : 10.99,
    SEK : 9.943,
    CHF : 56.55,
    JPY : 0.5983,
    EUR : 90.25
  };
  currencyCalculator.init('isk');
}