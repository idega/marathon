// =================================================================
// =================================================================
//
// Part one - Common functions and utilities 
//
// =================================================================
// =================================================================

/* MSIE sniffing */
var is_ie/*@cc_on = {
  version : parseFloat(navigator.appVersion.match(/MSIE (.+?);/)[1])
}@*/;

// handle writing and reading of cookie values

var cookieU = {

  set : function(_name, _value, _path, _domain, _expires, _secure)
  {
    if (!_expires || !_expires.getTime) // defaults to 1 year
    {
      _expires = new Date();
      var _tmpBase = new Date(0);
      var _tmpSkew = _tmpBase.getTime();
      if (_tmpSkew > 0) { _expires.setTime(_expires.getTime() - _tmpSkew); }
      _expires.setTime(_expires.getTime() + 365 * 24 * 60 * 60 * 1000);
    }
    var _curCookie = _name + "=" + escape(_value) + ((_expires) ? "; expires=" + _expires.toGMTString() : "") + ((_path) ? "; path=" + _path : "") + ((_domain) ? "; domain=" + _domain : "") + ((_secure) ? "; secure" : "");
    document.cookie = _curCookie;
  },

  getValue : function(_theName)
  {
    var c = document.cookie;
    if (c && _theName)
    {
      c = ";" + c;
      var _regex = new RegExp("(;|; )" + _theName + "=([^;]+)");
      if (c.match(_regex)) { return unescape( c.match(_regex)[2] ); }
    }
    return false;
  }

};



// report the current position of viewport 

var scrollPos = function()
{
  var x,y;
  if (window.pageYOffset) // all except Explorer
  {
    x = window.pageXOffset;
    y = window.pageYOffset;
  }
  else if (document.documentElement && document.documentElement.scrollTop) // Explorer 6 Strict
  {
    x = document.documentElement.scrollLeft;
    y = document.documentElement.scrollTop;
  }
  else if (document.body) // all other Explorers
  {
    x = document.body.scrollLeft;
    y = document.body.scrollTop;
  }
  return {x:x,y:y};
};




// getElementsBySelector and getAllChildren is written by Simon Willison.
// Original source at: http://simon.incutio.com/archive/2003/03/25/getElementsBySelector
//
// See DOM.get() && $()

getAllChildren = function(e)
{
  return e.all ? e.all : e.getElementsByTagName('*');
};

document.getElementsBySelector = function(_selector) {
  if (!document.getElementsByTagName) { return []; }
  var _tokens = _selector.split(' ');
  var _currentContext = [document];
  var i, j, h, len, leng, _length, _item;
  var _elements = [];

  for (i=0, _length = _tokens.length; i<_length; i++)
  {
    var _token = _tokens[i].replace(/^\s+/,'').replace(/\s+$/,'');
    if (_token.indexOf('#') > -1)
    {
      var _bits = _token.split('#');
      var _tagName = _bits[0];
      var id = _bits[1];
      var _element = document.getElementById(id);
      if (!_element) { continue; }
      if (_tagName && _element.nodeName.toLowerCase() != _tagName)
      {
        return [];
      }
      _currentContext = [_element];
      continue;
    }
    if (_token.indexOf('.') > -1)
    {
      _bits = _token.split('.');
      _tagName = _bits[0] || '*';
      var _className = _bits[1];
      var _found = [];
      for (h = 0, len = _currentContext.length; h < len; h++) {
        _elements = (_tagName == '*') ? getAllChildren(_currentContext[h]) : _currentContext[h].getElementsByTagName(_tagName);
        for (j = 0, leng = _elements.length; j < leng; j++) {
          _found.push(_elements[j]);
        }
      }
      _classNamePattern = new RegExp('(^| )'+_className+'( |$)');
      _currentContext = [];
      for (h = 0, len = _found.length; h < len; h++) {
        if (_found[h].className && _classNamePattern.test(_found[h].className)) {
          _currentContext.push(_found[h]);
        }
      }
      continue;
    }
    if (_token.match(/^(\w*|\*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
      _tagName = RegExp.$1;
      var _attrName = RegExp.$2;
      var _attrOperator = RegExp.$3;
      var _attrValue = RegExp.$4;
      if (!_tagName) {
        _tagName = '*';
      }
      _found = [];
      for (h = 0, len= _currentContext.length; h < len; h++) {
        if (_tagName == '*') {
          _elements = [];
          var _tmp = getAllChildren(_currentContext[h]);
          for (j = 0, _item; (_item = _tmp[j]); j++)
          {
            if (_item.nodeType == 1) { _elements.push(_item); }
          }
        } else {
          _elements = _currentContext[h].getElementsByTagName(_tagName);
        }
        for (j = 0, leng = _elements.length; j < leng; j++) {
          _found.push(_elements[j]);
        }
      }
      var _checkFunction;
      switch (_attrOperator) {
        case '=': _checkFunction = function(a) { return (a == _attrValue); }; break;
        case '~': _checkFunction = function(a) { return (a.match(new RegExp('(^| )'+_attrValue+'( |$)'))); }; break;
        case '|': _checkFunction = function(a) { return (a.match(new RegExp('^'+_attrValue+'-?'))); }; break;
        case '^': _checkFunction = function(a) { return (a.indexOf(_attrValue) === 0); }; break;
        case '$': _checkFunction = function(a) { return (a.lastIndexOf(_attrValue) == a.length - _attrValue.length); }; break;
        case '*': _checkFunction = function(a) { return (a.indexOf(_attrValue) > -1); }; break;
        default : _checkFunction = function(a) { return a; };
      }
      _currentContext = [];
      for (h = 0, len = _found.length; h < len; h++) {
        var a = _found[h].getAttribute(_attrName);
        if ( _checkFunction( (a!==null ? a : "") ) ) {
          _currentContext.push(_found[h]);
        }
      }
      continue;
    }
    _tagName = _token;
    _found = [];
    for (h = 0, len = _currentContext.length; h < len; h++) {
      _elements = _currentContext[h].getElementsByTagName(_tagName);
      for (j = 0, leng = _elements.length; j < leng; j++) {
        _found.push(_elements[j]);
      }
    }
    _currentContext = _found;

  }
  return _currentContext;
};

// End of code by Simon Willison





// Based on Dean Edwards' addEvent (http://dean.edwards.name/weblog/2005/10/add-event/)
// Modified and extended by Már Örlygsson.

var Event = {
  _all    : {},

  add : function(_element, type, _handler, _context)
  {
    //;;;alert(_element + " :: "+ _element.id +" :: "+ type);
    var _elmId = DOM.guid(_element);
    var _funcId  = DOM.guid(_handler) + (_context ? "_"+DOM.guid(_context) : "");
    if (_context  || arguments.length>4) {
      var _props = Array.prototype.slice.apply(arguments,[4]);
      var _method = _handler;
      _handler = function(e) { var _params = [e].concat(_props); return _method.apply(_context||_element, _params ); };
      _handler.$$guid = _funcId;
    }
    var _elmev = Event._all[_elmId];
    if (!_elmev) { _elmev = Event._all[_elmId] = {}; }
    var _handlers = _elmev[type];
    if (!_handlers) {
      _handlers = _elmev[type] = {};
      if (_element["on" + type]) {
        _handlers[0] = _element["on" + type];
      }
    }
    _handlers[_funcId] = _handler;
    _element["on" + type] = Event._createHandler(type);
  },

  remove : function(_element, type, _handler, _context)
  {
    //;;;alert("removing handler:\n\n"+ _handler);
    var _elmev, _evs;
    if ((_elmev = Event._all[_element.$$guid]) && (_evs = _elmev[type])) {
      delete _evs[_handler.$$guid + ((_context) ? "_"+_context.$$guid : "")];
      if (Object.isEmpty(_evs))
      {
        delete _evs;
        _element["on" + type] = null;
      }
    }
  },

  _handlerCache : {},
  _createHandler : function(type)
  {
    if (!Event._handlerCache[type])
    {
      Event._handlerCache[type] = function(e)
      {
        var returnValue = true;
        e = e || (window.event && Event._fixEvent(window.event));
        var _handlers = Event._all[this.$$guid][type];
        for (var i in _handlers) {
          this.$$handleEvent = _handlers[i];
          if (this.$$handleEvent(e) === false) {
            returnValue = false;
          }
        }
        this.$$handleEvent = null;
        return returnValue;
      };
    }
    return Event._handlerCache[type];
  },
  
  _fixEvent : function(e)
  {
    e.target          = e.srcElement;
    e.preventDefault  = Event._preventDefault;
    e.stopPropagation = Event._stopPropagation;
    return e;
  },
  _preventDefault  : function() { this.returnValue = false; },
  _stopPropagation : function() { this.cancelBubble = true; }

};



// DOM manipulation functions - Már Örlygsson.

var DOM = {
  innerText     : function(_node) { return _node.innerHTML.replace(/<[^<>]+>/g,""); },  // obj.innerText emulator for non-IE browsers.
  insertBefore  : function(_newNode, _referenceNode) {  _referenceNode.parentNode.insertBefore(_newNode, _referenceNode);  },
  insertAfter   : function(_newNode, _referenceNode) {  _referenceNode.parentNode.insertBefore(_newNode, _referenceNode.nextSibling);  },
  prependChild  : function(_newNode, _parent)        {  _parent.insertBefore(_newNode, _parent.firstChild);  },
  appendChild   : function(_newNode, _parent)        {  _parent.appendChild(_newNode);  },
  replaceNode   : function(_newNode, _oldNode)       {  DOM.insertBefore(_newNode, _oldNode);  DOM.removeNode(_oldNode);  },
  removeNode    : function(_node)                    {  _node.parentNode.removeChild(_node);  },
  firstChildTag : function(_parent)
  {
    for (var i = 0, _node; (_node = _parent.childNodes[i]); i++)
    {
      if (_node.nodeType == 1  &&  DOM.innerText(_node)) { return _node; }
    }
    return null;
  },
  
  makeElement : function(_innerHTML)  // May be used to bypass IE's stupid limitation on _elm.setAttribute("style", myCssRules);
  {                                             // It seems however impossible to use this function to create <link /> elements.
    this._makeElm.innerHTML = _innerHTML;
    var _newNode = this._makeElm.childNodes[0];
    this.removeNode(_newNode); // <-- This bit is important ... can't remember why just now ... but ... don't fuck with it.
    return _newNode;
  },
  _makeElm   : document.createElement("div"),


  hasClass : function(_element, _class)
  {
    if (!_class || !_element.className) { return false; }
    var _re = new RegExp("(^| )" + _class + "( |$)");
    return _re.test(_element.className);
  },

  addClass : function(_element, _class, _skipCheck)
  {
    if (_class && ( !_element.className || _skipCheck || (_element.className.indexOf(_class) == -1) || !this.hasClass(_element, _class) ) )
    {
      if (_element.className) { _element.className += " " + _class; }
      else                   { _element.className = _class; }
      return true;
    }
    return false;
  },

  removeClass : function(_element, _class)
  {
    if (!_class || !_element.className) { return false; }
    var _re = new RegExp("(^| )" + _class + "( |$)");
    var _oldClass = _element.className;
    _element.className = _element.className.replace(_re, "$2");
    return (_oldClass.length - _element.className.length); // yields true if _class was removed
  },

  replaceClass : function(_element, _oldClass, _newClass, _beLiberal)
  {
    if (_beLiberal || this.hasClass(_element, _oldClass))
    {
      this.removeClass(_element, _oldClass);
      this.addClass(_element, _newClass, true);
    }
  },

  toggleClass : function(_element, _class1, _class2, _isStrict)
  {
    if (_class2 && (typeof(_class2) != "string"))
    {
      _isStrict = _class2;
      _class2 = null;
    }
    if (_class1 && _element.className && (_element.className.indexOf(_class1) > -1) && this.hasClass(_element, _class1)) {
      if (_class2) { this.replaceClass(_element, _class1, _class2, true); }
      else         { this.removeClass(_element, _class1, true); }
    }
    else if (_class2 && _element.className && (_element.className.indexOf(_class2) > -1) && this.hasClass(_element, _class2)) {
      if (_class1) { this.replaceClass(_element, _class2, _class1, true); }
      else         { this.removeClass(_element, _class2, true); }
    }
    else if (!_isStrict)
    {
      if      (_class1) { this.addClass(_element, _class1, true); }
      else if (_class2) { this.addClass(_element, _class2, true); }
    }
  },



  guid : function(o)
  {
    if (!o.$$guid ||  o.$$guid >= this._guid  ||  this._guidMap[o.$$guid] != o ) // make sure _obj doesn't have an "invalid" (or already used) $$guid 
    {                                                                               // (this can happen if HTML is built from an element's .innerHTML contents)
      o.$$guid = this._guid++;
      this._guidMap[o.$$guid] = o;
    }
    return o.$$guid;
  },

  aquireId : function(el)  // _elm is an optional parameter.
  {
    var id = this._guidPrefix + this._guid++;
    if (el) { el.id = id; }
    return id;
  },
  _guidPrefix : "glitnir_tempid_"+(new Date()).getTime()+"_",  // suffix and prefix used to generate temporary @id-values for HTMLelements without an @id
  _guid : 1,      // a counter that should be incremented with each use.
  _guidMap : {},                        // used by DOM.guid() to keep track of which _obj has wich $$guid


  // Similar to the prototype function by the same name ... but with a subtle difference.
  // It only accepts two arguments 1) a CSS-style selector and 2) context/scoping element
  // Example:
  //   var _popupMenuLinks = DOM.get("a.popup", myMenuDiv);
  // 
  get : function(_arg, _contextElm)
  {
    if (/^\w+$/.test(_arg))
    {
      return (_contextElm || document).getElementsByTagName(_arg);
    }
    else
    {
      var _hasId = true;
      if (_contextElm)
      {
        if (!(_hasId = _contextElm.id)) { DOM.aquireId(_contextElm); }
        _arg = "#"+_contextElm.id+" "+_arg;
      }
      var _res = document.getElementsBySelector(_arg);
      if (!_hasId) { _contextElm.id = ""; }
      return _res;
    }
  },
  
  // toggle display on/off of an element (or elements)
  toggle : function (_arg) 
  {
    if (!_arg) { return _arg; }
    if (arguments.length > 1) { _arg = Array.from(arguments); }
    _arg = $(arguments);
    for (var i=0,l=_arg.length; i<l; i++)
    {    
      _arg[i].style.display = (_arg[i].style.display == "none") ? "" : "none";
    }
    // force reflow
    if (typeof(document.body.style.maxHeight) == "undefined") {
      document.body.className = document.body.className;
    }
    return false; // pops event propigation if called from a link
  }


};



// Similar to the prototype function by the same name ... but with the addition
// of allowing the first argument to be an Array of _elmIDs or _elmRefs.
// this allows for a much wider range of uses - such as:
//
//   var _blockIdArray = ["myId1", "MyId2", "myId3", "myId4"];
//   var _myBlocks = $(_blockIdArray);
//

var $ = function(_arg) {
  if (!_arg) { return _arg; }
  if (arguments.length > 1) { _arg = Array.from(arguments); }

  if (typeof(_arg) == 'string')  // _arg is a single _elmID  (most common case)
  {
    return document.getElementById(_arg);
  }
  if (_arg.join)  // _arg is an array of _elmIDs or _elmRefs
  {
    var _elms = [];
    for (var i=0,l=_arg.length; i<l; i++)
    {
      var _elm = _arg[i];
      if (typeof(_elm) == 'string') { _elm = document.getElementById(_elm); }
      _elms.push(_elm);
    }
    return _elms;  // since we received an array as an argument - return an array
  }
  return _arg; // _arg is an _elmRef or null/""/undefined (least common case)
};






// Futher utility functions
RegExp.escape = function(s) { return s.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g, '\\$1'); }; // useful when injecting alien strings into new RegExp()es
Object.isEmpty = function(o) { for (var i in o) { return false; } return true; }; // Checks if an associative object is empty or not.
Object.merge = function(a, b, l) {  // Merges the properties of associative object `b` into associative object `a`.
  for (var k in b) {                 // l == true  triggers "Lazy-merge" where the original - non-null - properties of `a` are *not* overloaded.
    if (!l || typeof(a[k]) == "undefined" || a[k]===null) {
      a[k] = b[k];
    }
  }
  return a;
};

if (!Array.from) {  // turns any Array-like object into a real Array.
  Array.from = function(o) { return Array.prototype.slice.call(o,0); };
}
if (!Array.indexOf) {
  Array.indexOf = function(a, o, i)
  {
    for (i=(i||0),l=a.length; i<l; i++) { if (a[i] === o) { return i; } }
    return -1;
  };
}

if (!Array.forEach) {  // Note: this must be defined *BEFORE* `Function.prototype.forEach`
  Array.forEach = function(o,f,t) {
    for (var i=0,l=o.length; i<l; i++) {  // `l` is defined *before* we start looping, by spec.
      if (typeof(o[i]) != "undefined") {  // skip `undefined` items, by spec.
        f.apply(t, [o[i],i,o]);
      }
    }
  };
}
if (!Array.map) {
  Array.map = function(o,f,t) {
    var a = [];
    for (var i=0,l=o.length; i<l; i++) { a[i] = f.apply(t, [o[i],i,o]); }
    return a;
  };
}
if (!Array.filter) {
  Array.filter = function(o,f,t) {
    var a = [];
    for (var i=0,l=o.length; i<l; i++) { if (f.apply(t, [o[i],i,o])) { a.push(o[i]); } }      
    return a;
  };
}

if (!Function.prototype.forEach) {  // Note: this must be defined *AFTER* `Array.forEach`
  Function.prototype.forEach = function(o,f,t) {
    for (var i in o) {
      if (typeof this.prototype[i] == "undefined" || this.prototype[i] !== o[i]) {
        f.apply(t, [o[i],i,o]);
      }
    }
  };
}



// =================================================================
// =================================================================
//
// Part two - Functionalty and effect tools
//
// =================================================================
// =================================================================



// -----------------------------------------------------------------
// Simple, runtime configurable script for adding "virtual-corner" 
// elements to certain page elements.
// -----------------------------------------------------------------
/*

// Usage:

if (typeof(boxRounder) != "undefined") {
  boxRounder.selectors = {
    ".rbox" : {}
  }
  boxRounder.init();
}

*/
boxRounder = {
  init : function(_scopeElm) // _scopeElm is a DOM node to scope the initialization run (useful when your script has added a new "rounded box" to the document)
  {
    for (var _selector in this.selectors)
    {
      var _conf = this.selectors[_selector];
      Object.merge(_conf, this._defaults, true);
      var _activeClass = _conf.handle+"-active";
      Array.forEach(DOM.get(_selector, _scopeElm), function(_elm)
      {
        if (!_elm.corner_tl || _elm.corner_tl.parentNode != _elm)  // Don't construct the corner elements if they seem to be present and in OK condition.
        {
          DOM.addClass(_elm, _activeClass); // notify the CSS that Javascript is active.

          _elm.corner_tl = document.createElement("span");
          _elm.corner_tl.className = "c_tl";
          DOM.prependChild(_elm.corner_tl, _elm);

         _elm.corner_tr = document.createElement("span");
         _elm.corner_tr.className = "c_tr";
          DOM.prependChild(_elm.corner_tr, _elm);

          _elm.corner_bl = document.createElement("span");
          _elm.corner_bl.className = "c_bl";
          DOM.appendChild(_elm.corner_bl, _elm);

          _elm.corner_br = document.createElement("span");
          _elm.corner_br.className = "c_br";
          DOM.appendChild(_elm.corner_br, _elm);
        }
      });
    }

  },
  _defaults : {
    handle : "roundbox"
  },
  selectors : {
    // "div.roundbox" : {}
  }
};



// -----------------------------------------------------------------
// Add the class "odd" to every other item in selected 
// element lists.
//
// Offers a list of classNames for items to exclude and reset the 
// zebra-striping effect, and a list of classNames for items to 
// treat as sub-items and color the same as the previous item...
// -----------------------------------------------------------------
/*

// Usage:

if (typeof(zebraLists) != "undefined")
{
  zebraLists.includes = {
    "table.zebra" : { 
      items : "tr",
      subClasses : {
        "attr" : 1
      },
      excludeClasses : {
        "subtotal" : 1,
        "total" : 1,
        "th"    : 1
      },
      oddClass : "odd",
      handle : "zebra"
    }
  };
  zebraLists.init();
}


*/
var zebraLists = {
  init : function(_scopeElm)
  {
    for (var _blockSelector in this.includes)
    {
      var _conf = this.includes[_blockSelector];
      Object.merge(_conf, this._defaults, true);

      var _blocks = DOM.get(_blockSelector, _scopeElm);
      for (var i=0,i2=_blocks.length; i<i2; i++)
      {
        var _blockElm = _blocks[i];
        
        DOM.addClass(_blockElm, _conf.handle+"-active");

        var _isOdd = false; // Le Zebra Trigger

        var _items = DOM.get(_conf.items, _blockElm);
        _itemLoop:for (var j=0,j2=_items.length; j<j2; j++)
        {
          var _itemElm = _items[j];

          var _className;
          for (_className in _conf.excludeClasses)
          {
            if (DOM.hasClass(_itemElm, _className))
            {
              _isOdd = false; // reset the zebra trigger.
              continue _itemLoop;       // ...and skip over this item entirely
            }
          }
          var _isSubItem = false;
          for (_className in _conf.subClasses)
          {
            if (DOM.hasClass(_itemElm, _className))
            {
              _isSubItem = true;
              break;
            }
          }
          if (!_isSubItem) { _isOdd = !_isOdd; } // for normal items, toggle the trigger. for "sub-items" don't

          if (_isOdd) { DOM.addClass(_itemElm, _conf.oddClass); }
          else { DOM.removeClass(_itemElm, _conf.oddClass); } // in case new list-items have been added since last time, or 

        }
      }
    }
  },

  _defaults : {
    subClasses : {},
    excludeClasses : {},
    oddClass : "odd",
    handle   : "zebra"
  },

  includes : {
  }
};


// -----------------------------------------------------------------
// Handle collapse functionality of a (navigaion) tree.
//
// When activated the script scans through an element-tree adding 
// toggle events, and states to branches. These events handle on/off 
// states of branches which are indicated with the "open" and 
// "closed" classNames.
// -----------------------------------------------------------------
/*

// Usage:

if (typeof(treeCollapse) != "undefined") {
  treeCollapse.init();
}

*/
treeCollapse = {

  config : {
    collapse : {
      nothing : "fool"
    }
  },

  _defaults : {
    handle      : null,          // defaults to _theKey
    menuSelector : "div.mainnav",  // the box containing the tree
    branchSelector : "li.branch",  // the item 
    startOpenClass : "parent|selected" // things that start opened have these/this class
  },

  init : function(config)
  {
  
    for (var _theKey in this.config)
    {
      var tsConfig = this.config[_theKey];
      Object.merge(tsConfig, this._defaults, true);
      if (!tsConfig.handle) { tsConfig.handle = _theKey; }  

      _blocks = DOM.get(tsConfig.menuSelector);
      for (var i = 0, _block; _block = _blocks[i]; i++) 
      {
        var _elms = DOM.get(tsConfig.branchSelector, _block);
        for (var i = 0, _item; _item = _elms[i]; i++) 
        {
          if (DOM.get("ul", _item)[0] && _item.firstChild.tagName == "A") 
          {
            Event.add(_item.firstChild, "click", this.toggle);
            var _cl = (DOM.hasClass(_item, tsConfig.startOpenClass)) ? 'open' : 'closed';
            DOM.addClass(_item, _cl);
          }
        }
        _block = DOM.addClass(_block, "collapse-active");
      }
    }
  },

  toggle : function(event) 
  {
    DOM.toggleClass(this.parentNode, "open", "closed");
    return false;
  }
};





// -----------------------------------------------------------------
// Attach a state to document body indicating the size of the 
// current viewport. 
// -----------------------------------------------------------------
/*

// Usage:

if(typeof(stepPageWidth) != "undefined")
{
  stepPageWidth.init([960]);
}

*/
var stepPageWidth = {
  config : [1000],

  init : function(config)
  {
    if (config) { this.config = config; }
    this.check();
    Event.add(window, "resize", this.check);
  },

  check : function()
  {
    var _bdyWidth = document.body.clientWidth;
    var _s1 = stepPageWidth.config[0] || stepPageWidth.config;
    if ((_bdyWidth < _s1) && DOM.removeClass(document.body, "width\\d+") )
    {
      if (typeof(cookieU) != "undefined") { cookieU.set('winWidth',''); }
    }
    else if ((_bdyWidth > _s1) && DOM.addClass(document.body, "width1") )
    {
      if (typeof(cookieU) != "undefined") { cookieU.set('winWidth','width1'); }
    }
  }

};



// -----------------------------------------------------------------
// Gereric Popup window script
// -----------------------------------------------------------------
/*

// Usage:

if(typeof(popupLinks) != "undefined")
{
  var windowSettings = ["_blank", "width=100,height=100,toolbar=no,menubar=no,status=no,scrollbars=no,location=no"];
  var bigwindowSettings = ["bigpopup", "width=200,height=200,toolbar=no,menubar=no,status=no,scrollbars=no,location=no"];

  popupLinks.init({
    "popup"             : windowSettings,
    "#mysillypopup"      : windowSettings,
    "map area"          : windowSettings,
    "form.popupform"     : windowSettings,
    "form input.small"   : windowSettings,
    "form input.big"     : bigwindowSettings
  });
}

*/
var popupLinks = {

  config : {
    // Example use:
    // strCssSelector : strTargetName, strWindowSettings]
    "popup" : [ "_"+"blank", ""]
  },

  init : function(arg)  // the arg parameter can be one of two things...
                         // A. config object that gets *merged* into the popupLinks.config hash.
                         // B. DOM node to scope the initialization run (useful when your script has added a bunch of popup links to the document)
  {
    if (!document.getElementsByTagName) { return true; }
    var _scopeElm = null;
    if (arg)
    {
      if (arg.parentNode)  // arg is a DOM node to scope the init
      {
        _scopeElm = arg;
      }
      else  // arg is a config object
      {
        Object.merge(this.config, arg);
      }
    }

    var _key, _conf;

    // Lets clean up the config to provide backwards compatibility with the old className config style.
    var _cleanConfig = {};
    for (_key in this.config)
    {
      _conf = this.config[_key];
      if (/^[a-zA-Z0-9_-]+$/.test(_key))  // old school className syntax. We need to transform it into selector syntax
      {
        _conf[0] = _conf[0] || _key;
        _cleanConfig["a."+_key]     = _conf;
        _cleanConfig["."+_key+" a"] = _conf;
      }
      else  // selector syntax
      {
        _cleanConfig[_key] = _conf;
      }
    }
    this.config = _cleanConfig;

    for (_key in this.config)
    {
      _conf = this.config[_key];
      var _elms = DOM.get(_key, _scopeElm);
      for (var i=0,l=_elms.length; i<l; i++)
      {
        var _elm = _elms[i];
        switch(_elm.tagName)
        {
          case 'A':
          case 'AREA':
            Event.add(_elm, "click", this._pop, null, _conf);
            break;
          case 'FORM':
            Event.add(_elm, "submit", this._pop, null, _conf);
            break;
          case 'INPUT':
            Event.add(_elm, "click", this._popButton, null, _conf);
            break;
        }
      }
    }
    return true;
  },

  _pop : function(e, _conf)  // <a> or <area> onClick handling  +  <form> onSubmit handling
  {
    var _elm = this;
    var _target = _elm.target || _conf[0] || "_"+"top";
    var _wasBlank = (_target.toLowerCase() == "_"+"blank");
    if (_wasBlank) {
      _elm.target = "";                          // temporarily disable the _elm.target
      _target = "win"+(new Date()).getTime();  // temporarily set the _target to something "concrete"
    }
    if (_target.indexOf("_") !== 0) // don't do window.open for targets "_top", "_parent", "_self", etc.
    {                               // ...since we're passing the event through (i.e. not stopping it w. `return false;`)
      var _newWin = window.open("about:blank", _target, _conf[1]);
      setTimeout(function(){ _newWin.focus(); }, 150);
    }
    if (!_elm.target)  // if there's no target attribute on the _elm
    {
      _elm.target = _target;  // set it temporarily (while the action is taking place)
      setTimeout(function()  // and then remove/reset it again (after a while)
      {
        _elm.target = (_wasBlank) ? "_"+"blank" : "";
      }, 500);
    }
    return true;
  },

  _popButton : function(e, _conf) // <input> onClick handling
  {
    var _form = this.form;
    Event.add(_form, "submit", popupLinks._pop, null, _conf);
    setTimeout(function()  // and then remove it again (after a while)
    {
      Event.remove(_form, "submit", popupLinks._pop);
    }, 500);
    return true;
  }

};



// -----------------------------------------------------------------
// utility to format numbers to/from the icelandic standard:
// ( -12.345.567,0001 )
// -----------------------------------------------------------------

var formatting = {

  // Takes a string in the Icelandic number format (123.456.789,1234567)
  // and transforms it to the JavaScript Number datatype
  stringToNumber : function(str) 
  {
    if (
      !!str  && // no nulls, falses, or empty strings
      typeof(str) == "string" &&  // must be a string object
      str.constructor == String &&  // must be a string object
      str.match(/^(-?((\d{1,3})(.\d{3})*)|(\d+))(,\d+)?$/)  // strict format
      )
    {
      str = str.replace(/\./g, "");   // discard periods
      str = str.replace(",", ".");  // the comma becomes a period
      return parseFloat(str);
    }
    return null;
  },


  // The function returns a "String"-object with the number formated 
  // in the Icelandic numberformat.
  numberToString : function(num, places) 
  {  
    // Type checking
    if(num == null || 
      typeof(num != "number") && 
      num.constructor != Number) {
      return null;
    }
    
    var _neg = (num < 0) ? "-" : "";
    var _number = Math.abs(num.toFixed(0)).toString();
    
    if (!places) {
      // make something reasonable up
      places = (num.toPrecision().split(".")[1] || "").length;
      places = (places > 8) ? 8 : places; // max 8 
    }
    var _fraction = (num.toFixed(places).split(".")[1] || "");
    var _comma = (!!_fraction) ? "," : "" ;

    var _s = [];
    for (i=_number.length; i>0; i-=3) {
      _s.push(_number.substring(i-3, i));
    }
    
    return "" + _neg + _s.reverse().join(".") + _comma + _fraction;
  },


  stripNonNumeric : function(str)
  { 
    if (!!str && // no nulls, falses, or empty strings
      typeof(str) == "string" &&  // must be a string object
      str.constructor == String)
    {
      return str.replace(/[^0-9]/gi, "");
    }
    else
    {
      return null;
    }
  }

};



// -----------------------------------------------------------------
// tool to add notification flashes (and other simple animations)
// -----------------------------------------------------------------
/*
// usage:

*/
var animate = {

  flash : function(target, interval, classname, times) 
  {
    interval = interval || 800;
    classname = classname || "flash";

    if (times == -1) 
      { times = -1; }  // infinite
    else if (times > 0) 
      { times = (times *2) -1; }  // given number of times 
    else 
      { times = 5; } // default to 3 times

    // generate handler function
    // taking atvantage of JS closures to bypass
    // IE's event/settimeout parameter mess
    var _f = function() {
      DOM.toggleClass(target, classname, "");
      if (times--) {
        setTimeout(_f, interval);
      }
    };
    setTimeout(_f, 10);
  }

};


// -----------------------------------------------------------------
// tab switching functionality
// -----------------------------------------------------------------
/*
// usage:

if(typeof(tabswitcher) != "undefined") {
  tabswitcher.init();
}

// you may init the tabs with fixed focus:




// additionally you can hook tabswitch events:

$("thetabstripid").onchange = function () {
  var _tab = $("thetabstripid");
  if (_tab) {
    alert( "the tab has been swithced to: " _tab.active); 
  };
}

*/
var tabswitcher = {

  config : {
    selector : ".tabs"
  },


  getURIFraction : function(href) 
  {
    // get id from the uri 
    var _id = href.match(/#([a-zA-Z][a-zA-Z0-9_-]*)$/);
    return (_id == null) ? false : _id[1];
  },

  init : function(active) 
  {
    // read position from fraction 
    if (!active || active.length < 1) 
    {
      active = []; 
      if (this.getURIFraction(window.location.href)) 
      { 
        active[0] = this.getURIFraction(window.location.href); 
      }
    }

    // find all tabs and init them
    var _tabs = DOM.get(tabswitcher.config.selector);
    for (var i=0; i<_tabs.length; i++)
    {
      _tabs[i].active = ""; // currently no tab is active
      DOM.addClass(_tabs[i], "tabs-active");
      var _as = _tabs[i].getElementsByTagName('a');
      var activated = false;
      for (a=0; a<_as.length; a++) 
      {
        _id = this.getURIFraction(_as[a].href);
        Event.add(_as[a], "click", tabswitcher.tabFlip, this);
        // close its panel
        DOM.addClass($(_id), "tabs-closed");
        // is this link's id supposed to be active?
        for (n = 0; n < active.length; n++) 
        {
          if (!activated && _id == active[n]) 
          {
            activated = true;
            tabswitcher.tabFlip(_as[a]); // activate
          } 
        }
      }
      if (!activated) { tabswitcher.tabFlip(_as[0]); }
    }
  },


  // DOM.get(".tabs a[href='#new']");
  tabFlip : function(e) 
  {
    var _elm = (typeof(e.target) != "string") ? e.target : e;
    // get id from the uri 
    _id = tabswitcher.getURIFraction(_elm.href);
    if (!_id) return false;

    // get the element link is pointing at
    var _destPane = $(_id);
    if (!_destPane) return false;
    
    // seek top level in tabs
    var _tabs = _elm;
    while (_tabs = _tabs.parentNode) 
    {
      if (typeof(_tabs.active) == "string") // find the tabs container
      { 
        // deactive prev. active panel
        if (_tabs.active) 
        {
          DOM.removeClass($(_tabs.active), "tabs-activepanel");
          DOM.addClass($(_tabs.active), "tabs-closed");
        }
        // unactivate the button
        var _elms = _tabs.getElementsByTagName('li');
        for (i=0; i<_elms.length; i++) 
        {
          DOM.removeClass(_elms[i], "current");
        }
        // remember what is active
        _tabs.active = _id;
        break;
      }
    }

    // pluck the id from the destination elm, set new fraction location
    // and then give id back to dest elm, (prevents document re-focus)
    var _uid = _destPane.id;
    _destPane.id  = "";
    location.hash = _uid;
    _destPane.id  = _uid;
    
    // if this tabstrip is inside a form which posts back to this page
    // then we'll operate on that too...
    var _form = _elm;
    while (_form = _form.parentNode) 
    {
      if (_form.tagName == 'FORM') 
      {
        // is form action = current location?
        var act = _form.action.replace(/(#|\?).*$/i, '');
        if (act == location.protocol + "//" + location.host + location.pathname) 
        {
          act = _form.action.substr(0, _form.action.indexOf("#")) || _form.action;
          _form.action = act + "#" + _uid;
        }
        break;
      }
    }
    
    // activate new pane & clicked button
    DOM.removeClass(_destPane, "tabs-closed");
    DOM.addClass(_destPane, "tabs-activepanel");
    DOM.addClass(_elm.parentNode, "current");
    
    // remove focus of button
    _elm.blur(); 
    
    // cause onchange event on tabstrip
    if (typeof(_tabs.onchange) == "function") { _tabs.onchange(this); }      

    // pop eventbubble
    return false;
  }
  
};




// -----------------------------------------------------------------
// block collapsing unit
// -----------------------------------------------------------------
/*

// usage:
if (typeof(collapser) != "undefined") {
  collapser.init();
}

*/

var collapser = {

  config : {
    collapse : {
      block : ".collapse",
      trigger : "h3"
    }
  },

  init : function(config) 
  {
    if (config) { this.config = config; }
    for (var _confId in this.config)
    {
      var _blocks = DOM.get(this.config[_confId].block);
      for (var i=0; i<_blocks.length; i++)
      {
        var _b = _blocks[i];
        var _trigger = DOM.get(this.config[_confId].trigger, _b);
        if (_trigger && _trigger.length > 0)
        {
          var _triggerElm = _trigger[0];
          // wrap 
          _link = document.createElement("a");
          _link.href = "#";
          _link.innerHTML = DOM.innerText(_triggerElm);
          _triggerElm.innerHTML = "";
          _triggerElm.appendChild(_link);
          DOM.addClass(_b, "collapse-active");
          DOM.addClass(_b, "collapse-closed");
          // hook this link
          Event.add(_link, "click", this.toggle);
          // create relationship
          _link.myBlock = (_b.id != "") ? _b.id : DOM.aquireId(_b);
        }
      }
    }
  },
  
  toggle : function(e) {
    var _bl = $(e.target.myBlock);
    DOM.toggleClass(_bl, "collapse-open", "collapse-closed");
    return false;
  }

}



