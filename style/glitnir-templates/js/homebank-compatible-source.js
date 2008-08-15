
// -- glitnir/eplicalib overlay

function MM_preloadImages() //v3.0
{
  var d = document; 
  if (d.images)
  { 
    if (!d.MM_p) 
    {
      d.MM_p = new Array();
      var i;
      var j = d.MM_p.length;
      var a = MM_preloadImages.arguments;
      for(i = 0; i < a.length; i++)
      {
        if (a[i].indexOf("#") != 0) 
        {
          d.MM_p[j] = new Image;
          d.MM_p[j++].src = a[i]; 
        }
      }
    }
  }
}





// -- GetElement = DOM.Get;
function GetElement(uid) 
{
	if (document.getElementById) 
  {
		return document.getElementById(uid);
	}
	else if (document.all) 
  {
		return document.all(uid);
	}
  return null;
}



SetCssClass = DOM.addClass;  // old func replaces entire attribute .. this is not 100% compatible

ToggleCssClass = DOM.toggleClass;

ShowHide = function (uid) { return DOM.toggle(GetElement(uid)); };

ToggleValue = DOM.toggleValue;






// dom element attribute functions

var DOM = {

  toggleValue : function(elm, value)
  {
    if (elm)
    {
      if (elm.value == value)
      {
        elm.value = "";
      }
      else if (elm.value == "")
      {
        elm.value = value;
      }
    }  
    return elm;
  },


  toggle : function (elm) 
  {
    var elm = GetElement(elm);
    if (elm) 
    {
      elm.style.display = (elm.style.display == "none") ? "" : "none";
    }
  },
  
};





/* --- string manipulations functions --- */


function tdl(str) 
{ 
	var sep = ""; 
  var res = "";
  var str = res + str; 
	while (str.length > 0)	
	{ 
		if (str.length > 3) 
		{ 
			res = str.substring(str.length-3, str.length) + sep + res; 
			str = str.substring(0,str.length-3); 
		} 	
		else 
		{  
			res = str + sep + res;
      str = ""; 
		} 
		sep = "."; 
	} 
	return res;
} 


function formatitNumeric(svaedi)
{ 
	val = svaedi.value; 
	val = StripNonNumeric(val); 
	svaedi.value = val; 
}



function FormatNumber(pFld, pEvent, pKeyCode)
{
	if (myKey == 'undefined' || myKey == null) {
		docOnKeypress(event);
	}
	
  if ( myKey == 16 || myKey == 37 || myKey == 38 || myKey == 39 || myKey == 40 || myKey == 46 || myKey == 32 ) 
  {
		return true;
	}
	else{
		formatit(pFld, true);
		return true;
	}
}



function formatit(svaedi, keyPressed) 
{
	if (keyPressed) 
  {
		if(myKey == 'undefined' || myKey == null) 
    {
			docOnKeypress(event);
		}
		if(myKey == 16 || myKey == 37 || myKey == 38 || myKey == 39 || myKey == 40 || myKey == 46 || myKey == 32) 
    {
			return;
		}
		//Verð að gera þetta af IE
		myKey = null;
	}
	val = svaedi.value; 
	val = StripNonNumeric(val); 
	svaedi.value = tdl(val); 	
} 





function StripNonNumeric( str )
{ 
	var resultStr = ""; 
	if (str+"" == "undefined" || str == null) 
		return null; str += ""; 
	for (var i=0; i < str.length; i++) 
	{ 
		if ( (str.charAt(i) >= "0") && (str.charAt(i) <= "9") ) 
			resultStr = resultStr + str.charAt(i);  	
	} 
	return resultStr; 
}




function MaxChars(oElement, nMaxChars)
{
	var lengd = 0;

		lengd = oElement.value.length;
		lengdLeft = nMaxChars - lengd;
		if(lengdLeft > nMaxChars)
		{
			lengdLeft = nMaxChars;
		}
		if(lengdLeft < 0)
		{
			lengdLeft = 0;
		}

	if (lengd > nMaxChars ){
		lengdLeft = 0;		
		oElement.value = oElement.value.substring(0,nMaxChars);
		return false;
	}
	return true;
}

function popUp(link, winWidth, winHeight) {

	if((winWidth == null) || (winWidth =="")) {
		winWidth = 250;
	}
	if((winHeight == null) || (winHeight =="")) {
		winHeight = 300;
	}
	
	var theSettings = "toolbar=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,directories=no,location=no,width=" +winWidth+",height=" +winHeight+",left=0,top=0";	
	
	var theTarget = "_blank"; // Set default value for the link target	
	if ((link.target != null) && (link.target != "")) {
		theTarget = link.target;
	}
	
	newWin = window.open(link.href, theTarget, theSettings);
	newWin.focus(); // make sure the new window has focus.
	
	return false;
}


/* Pop up gluggi Ã­ miÃ°ju skjÃ¡sins */
function PopUpCenter(link, winName, width, height){
	PopUpCenter(link, winName, width, height, null)
}
function PopUpCenter(link, winName, width, height, features){
	var top = screen.height/2 - height/2;
	var left = screen.width/2 - width/2;
	
	if(features == null){
		features = 'toolbar=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,directories=no,location=no,width=' + width + ', height=' + height + ', top=' + top + ', left=' + left;
	}
	
	var newWin = window.open(link,winName, features);
	newWin.focus();
	
	return false;
}


// -- deprecated functions --

 
// function PopUpPicture(winName, imageName, imageWidth, imageHeight, alt)
// function ReiknaAr(sElementName, afborganir, afborganirAri)
// >> Reason: "Not in common"



// function SetTableAltRows() 
// >> Reason: "Use ZebraLists library"
// -- if (typeof(zebraLists) != "undefined") { SetTableAltRows = zebraLists.init; }


if (typeof(DOM) != "undefined") { hasClass = DOM.hasClass; }



/*	
DefaultButton
Originally created by Janus Kamp Hansen - http://www.kamp-hansen.dk
// Extended by Darrell Norton - http://dotnetjunkies.com/weblog/darrell.norton/
//   -- added Mozilla support, fixed a few issues, improved performance
*/

function fnTrapKD(btnID, event)
{
  btn = GetElement(btnID);
  if (document.all) 
  {
    if (event.keyCode == 13)
    {
      event.returnValue=false;
      event.cancel = true;
      btn.click();
    }
  }
  else if (document.getElementById)
  {
    if (event.which == 13) 
    {
      event.returnValue=false;
      event.cancel = true;
      btn.focus();
      btn.click();
    }
  }
  else if (document.layers)
  {
    if(event.which == 13)
    {
      event.returnValue=false;
      event.cancel = true;
      btn.focus();
      btn.click();
    }
  }
}


var myKey;
function docOnKeypress(evt)
{
	var e = evt ? evt : window.event;
	if (!e) return;
	var key = 0;
	if (e.keyCode)  // for moz/fb, if keyCode==0 use 'which'
  {
    myKey = e.keyCode;
  } 
	else if (typeof(e.which) != 'undefined')
  {
    myKey = e.which; 
  }
}
