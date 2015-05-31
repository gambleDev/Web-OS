//NOTIFICATIONS
function notification(message, time){
	if(time == null){time=1500;}
	var div = document.createElement("div");
	div.className = "notification-box";
	div.innerHTML = message;
	document.body.insertBefore(div, document.body.firstChild);
	
	setTimeout(function(){document.body.removeChild(document.body.firstChild)},time);
}

//LOCK SCREEN FUNCTION - CALL TO LOCK
function checkLockScreenLogin(){
	var password = document.getElementsByName("lock-screen-password")[0].value;
	var lockScreen = document.getElementsByClassName("lock-screen")[0];
	if(password != "reddit"){
		notification("Incorrect password!");
		document.getElementsByName("lock-screen-password")[0].value = "";
	}else{
		lockScreen.parentNode.removeChild(lockScreen);
	}
	return false;
}

function lockScreen(failed){
	var div = document.createElement("div");
	div.className = "lock-screen";
	div.innerHTML = "<div class='lock-screen-login'>"+
						"Login<hr>"+
						"Please enter your password below:<br><br>"+
						"<form onsubmit='return checkLockScreenLogin();'>"+
							"<input type='text' name='lock-screen-password'><br>"+
							"<input type='submit'>"+
						"</form>"+
					"</div>";
	document.body.insertBefore(div, document.body.firstChild);
}

//DESKTOP TIME IN MENU
function startTime() {
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	var dd=today.getDate();
	var mm=today.getMonth()+1;
	var yyyy=today.getFullYear();
	//AM/PM Calculation
	var twentyFourHourClock = (h+24-2)%24;
	if(twentyFourHourClock > 12){ ampm = 'PM'; } else{ ampm = 'AM'; }
	
	m = checkTime(m);
	s = checkTime(s);
	document.getElementsByClassName('menu-time')[0].innerHTML = h+":"+m+":"+s+" "+ampm+"<br>"+mm+"/"+dd+"/"+yyyy;
	var t = setTimeout(function(){startTime()},500);
}

function checkTime(i) {
	if (i<10) {i = "0" + i};
	return i;
}
startTime();

//LAUNCHING APPLICATIONS
function launch(title, path, height, width){
	desktop = document.getElementsByClassName('desktop')[0];
	
	if(height == null){ height = '100px'; } else{ height = height+'px'; }
	if(width == null){ width = '250px'; } else{ width = width+'px'; }
	
	desktop.innerHTML = desktop.innerHTML+
		"<div class='window' style='left:260px;top:0px;width:"+width+";height:"+height+"'>"+
			"<div class='title-bar'>"+title+"</div>"+
			"<iframe src='"+path+"' frameborder='0'></iframe>"+
		"</div>"
}

//FOR MAXIMISING THE WINDOW - AND UN MAXIMISING
document.addEventListener('dblclick', function(e) { 
	var target = e.target != null ? e.target : e.srcElement;
	var fullScreenExactWidth = screen.width-55;
	var fullScreenExactHeight = '100%';
	if(e.detail === 2 && target.className == 'title-bar') {
		if(target.parentNode.style.width != fullScreenExactWidth && target.parentNode.style.height != fullScreenExactHeight){
			target.parentNode.style.top = '0px';
			target.parentNode.style.left = '55px';
			target.parentNode.style.width = fullScreenExactWidth;
			target.parentNode.style.height = fullScreenExactHeight;
		}else{
			target.parentNode.style.width = '250px';
			target.parentNode.style.height = '100px';
		}
	}
}, false);

//THIS AND BELOW IS FOR DRAG AND DROP! DONT TOUCH!
var _startX = 0;
var _startY = 0;
var _offsetX = 0;
var _offsetY = 0;
var _dragElement;
var _newZIndex = 1;

InitDragDrop();

function InitDragDrop(){
	document.onmousedown = OnMouseDown;
	document.onmouseup = OnMouseUp;
}

function OnMouseDown(e){
	if (e == null){
		e = window.event; 
	}
	
	var target = e.target != null ? e.target.parentNode : e.srcElement.parentNode;
  
	if ((e.button == 1 && window.event != null || e.button == 0) && target.className == 'window'){
		_startX = e.clientX;
		_startY = e.clientY;
	
		_offsetX = ExtractNumber(target.style.left);
		_offsetY = ExtractNumber(target.style.top);
	
		target.style.zIndex = 1000;
		
		_dragElement = target;

		document.onmousemove = OnMouseMove;
	
		document.body.focus();

		document.onselectstart = function () { return false; };

		target.ondragstart = function() { return false; };
		
		return false;
	}
}

function OnMouseMove(e){
	if (e == null){ 
		var e = window.event; 
	}
	
	// DRAGGING
	_dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
	_dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
}

function OnMouseUp(e)
{
	if (_dragElement != null){
		//CLOSE THE WINOW
		var rect = _dragElement.getBoundingClientRect();
		var offScreenRight = screen.width-rect.right;
		if(offScreenRight <= -10 && rect.top <= -10){
			var closeWindow = confirm("Would you like to close this window?");
			if(closeWindow == true){
				_dragElement.parentNode.removeChild(_dragElement);
			}else{
				_dragElement.style.top = '0px';
			}
		}
		
		//PLACE NEW ACTIVE WINDOW ON TOP
		_dragElement.style.zIndex = _newZIndex;
		_newZIndex++;

		document.onmousemove = null;
		document.onselectstart = null;
		_dragElement.ondragstart = null;
   
		_dragElement = null;
	}
}

function ExtractNumber(value){
	var n = parseInt(value);
	return n == null || isNaN(n) ? 0 : n;
}

function $(id){
	return document.getElementById(id);
}
