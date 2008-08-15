
function heightFix() {
	var _elms = DOM.get("div.loginform");
	if (_elms && _elms.length > 0) {
		var _h = _elms[0].offsetHeight -150;
		var _elms = DOM.get("div.infobox .boxbody");
		for (i = 0; i < _elms.length; i++) {
			if (_elms[i].offsetHeight < _h) {
				_elms[i].style.height = _h + "px";
			}
		}
	}
}

if (typeof(Event) == "object") {
  Event.add(window, "resize", heightFix);
  heightFix();
}
