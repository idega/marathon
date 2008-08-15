new function() {
  var A = Array.prototype,
      F = Function.prototype;

  A.push = function() {
    for (var i = 0; i < arguments.length; i++) {
      this[this.length] = arguments[i];
    }
    return this.length;
  };

  A.pop = function() {
    if (this.length) {
      var i = this[this.length - 1];
      this.length--;
      return i;
    }
  };

  A.shift = function() {
    var r = this[0];
    if (this.length) {
      var a = this.slice(1), i = a.length;
      while (i--) this[i] = a[i];
      this.length--;
    }
    return r;
  };

  A.unshift = function() {
    var a = A.concat.call(A.slice.apply(arguments, [0]), this), i = a.length;
    while (i--) this[i] = a[i];
    return this.length;
  };

  A.splice = function(i, c) {
    var r = c ? this.slice(i, i + c) : [];
    var a = this.slice(0, i).concat(A.slice.apply(arguments, [2])).concat(this.slice(i + c)), i = a.length;
    this.length = i;
    while (i--) this[i] = a[i];
    return r;
  };

  F.apply = function(o, a) {
    var r,
        $ = "__apply__";
    o = o || window;
    o[$] = this;
    switch (a.length) { // unroll for speed
      case 0: r = o[$](); break;
      case 1: r = o[$](a[0]); break;
      case 2: r = o[$](a[0], a[1]); break;
      case 3: r = o[$](a[0], a[1], a[2]); break;
      case 4: r = o[$](a[0], a[1], a[2], a[3]); break;
      default:
        var aa = [], i = a.length - 1;
        do aa[i] = "a[" + i + "]"; while (i--);
        eval("r=o[$](" + aa + ")");
    }
    try {
      delete o[$];
    } catch (e) {
      o[$] = null;
    }
    return r;
  };

  F.call = function(o) {
    return this.apply(o, A.slice.apply(arguments, [1]));
  };
};
