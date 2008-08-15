
var currencyCalculator = {

  mtab : {
    ISK : 1,
    USD : 70.32,
    GBP : 133.48,
    CAD : 61.83,
    DKK : 12.1,
    NOK : 10.99,
    SEK : 9.943,
    CHF : 56.55,
    JPY : 0.5983,
    EUR : 90.25
  },

  getInput : function(name) 
  {
    _elm = DOM.get("input[name="+name+"]")[0];
    if (_elm) 
    {
      return formatting.stringToNumber(_elm.value);
    }
  },

	calc : function(e, mynt)
	{
    var _val = 1;
    mynt = mynt.toUpperCase('isk');
    _val = this.getInput("TextBox"+mynt) * this.mtab[mynt];
    for (var _key in this.mtab) 
    {
      _div = this.mtab[_key];
      if (_key != mynt) 
      {
        _elm = DOM.get("input[name=TextBox"+_key.toUpperCase()+"]")[0];
        if (_elm) 
        {
          _elm.value = formatting.numberToString(_val / _div, 2);
        }
      }
    }
    return false;
  },
  
  keyLock : function (e) {
    kk = e.keyCode;
    if (kk == 9 || kk == 13) // don't tab or submit please
    {
      e.stopPropagation();
      return false;
    }
  },
  
  init : function()
  {
    for (var _key in this.mtab) 
    {
      _elm = DOM.get("input[name=TextBox"+_key.toUpperCase()+"]")[0];
      if (_elm) 
      {
        Event.add(_elm, "keyup", this.calc, this, _key);
        Event.add(_elm, "keypress", this.keyLock);
      }
    }
    this.calc(null,'isk');
  }
  
}

