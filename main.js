var shiftPressed = false;
var log = [0];
var resLog = [];
var searchIndex = 0, searchValue = 0;
$(document).ready(function(){
	console.log("%c Ready ", "background-color: #164134; color: #dcb932; font-weight: bolder;");
	fixIntro1Height();
	adjustReport();
	buttonClick();
	$(document).keydown(function(){
		checkKey();
	});
	$(document).on('keyup keydown', function(e){
		//is true when shift is pressed, else false
    	shiftPressed = e.shiftKey; 
	});
	$(window).on("resize", function(){
		console.log("RES")
		fixIntro1Height();
	});
	$("#get-started").click(function(){
		$("#intro").fadeTo(500,0,function(){
			$("#intro").css("display", "none");
		});
	})
});
function fixIntro1Height(){
	var height = $("#intro-part-2").height();
	var width = $(window).width();
	if (width < 992){
		height = $("#intro-part-1 h1").height() + $("#intro-part-1 h2").height();
	}
	$("#intro-part-1-box").css("height", height);
}
function adjustReport(){
	var height = $("#navbar").height();
	var objHeight = $("#navbar li").height();
	var marginTop = (height - objHeight)/2;
	$("#navbar li").css("marginTop", marginTop);
}
function appendToCurrent(value){
	var numbers = [0,1,2,3,4,5,6,7,8,9];
	var safeOperators = ["-","+","(",")"]
	if (value == "="){
		var current = $("#current-typing").val();
		var res = eval($("#current-typing").val());
		resLog.push(res);
		searchIndex = resLog.length-1;
		searchValue = resLog[searchIndex]
		$("#current-typing").val(res);
		var currentTypingHistory = $("#current-typing-history").val();
		$("#current-typing-history").prepend("<div>" + current + " = " + res + "</div>");
		$("#b-clear").html("C");
	} else if (value == "del8"){
		var value = $("#current-typing").val();
		var length = value.length;
		value = value.substring(0, length-1);
		$("#current-typing").val(value);
	} else {
		if (numbers.indexOf(parseInt(value)) != -1 || safeOperators.indexOf(value) != -1){
			var current = $("#current-typing").val();
			$("#current-typing").val(current + value);
		} else {
			// console.log(value);
			var current = $("#current-typing").val();
			var test = value.charCodeAt(0);
			// console.log(test);
			switch (test){
				case 10799: //multiply
					// console.log("MULT", test);
					$("#current-typing").val(current + "*");
					break;
				case 247: //divide
					// console.log("DIV", test);
					$("#current-typing").val(current + "/");
					break;
				case 183: //dot, point
					// console.log("POINT", test);
					$("#current-typing").val(current + ".");
					break;
				case 67: //just clear
					$("#current-typing").val(" ");
					$("#b-clear").html("AC");
					break;
				case 65: //all clear
					$("#current-typing").val(" ");
					$("#current-typing-history").html(" ");
					break;
				default:
					console.log(test, value == "⨯", value == "·", value == "÷");
					console.log("DEF");
			}
		}
	}
}
function buttonClick(){
	$(".button").click(function(){
		var id = this.id;
		var value = $("#"+id).html();
		// $("#current-typing").val(value);
		appendToCurrent(value);
		// console.log($("#current-typing").val());
	});
}
function checkKey(e) {
	var event = window.event ? window.event : e;
	var key = event.keyCode;
	var numbers = [48,49,50,51,52,53,54,55,56,57];
	var operators = {
		shift: {13:"b-equal", 48:"b-parenthesis-close", 56:"b-multiply", 57:"b-parenthesis-open", 187:"b-plus", 189:"b-minus", 190:"b-point", 191:"b-divide"},
		noShift: {13:"b-equal", 187:"b-equal", 189:"b-minus", 190:"b-point", 191:"b-divide"}
	};
	var operatorKeysShift = Object.keys(operators.shift);
	var operatorKeysNoShift = Object.keys(operators.noShift);
	if (key == 38){
		//do stuff, load the last result
		if (resLog.length > 0){
			if (searchIndex > 0) searchIndex--;
			searchValue = resLog[searchIndex];
			console.log(searchIndex, searchValue);
		}
	} else if (key == 40){
		if (resLog.length > 0){
			if (searchIndex < resLog.length-1) searchIndex++;
			searchValue = resLog[searchIndex];
			console.log(searchIndex, searchValue);
		}
	} else if (!shiftPressed){
		if (numbers.indexOf(key) != -1){
			var val = numbers.indexOf(key);
			var id = "b-"+val;
			toggleButtonPress(id, "reg");
			var value = $("#"+id).html();
			appendToCurrent(value);
		} else if (operatorKeysNoShift.indexOf(key.toString()) != -1) {
			var id = operators.noShift[key];
			toggleButtonPress(id, true);
			var value = $("#"+id).html();
			appendToCurrent(value);
		} else if (key == 67){
			var id = "b-clear";
			toggleButtonPress(id, true);
			var value = $("#"+id).html();
			appendToCurrent(value);
		} else if (key == 69) {
			var id = "b-e";
			toggleButtonPress(id, false, true);
			var value = $("#"+id).html();
			appendToCurrent(value);
		} else if (key == 8) {
			var value = "del8";
			appendToCurrent(value);
		}
	}
	else {
		if (operatorKeysShift.indexOf(key.toString()) != -1) {
			var id = operators.shift[key];
			toggleButtonPress(id, true);
			var value = $("#"+id).html();
			appendToCurrent(value);
		} else if (key == 67){
			id = "b-clear";
			toggleButtonPress(id, true);
			var value = $("#"+id).html();
			appendToCurrent(value);
		} else if (key == 69) {
			var value = "E";
			appendToCurrent(value);
		}
	}
	log.push(key);
}
function toggleButtonPress(id, special, next){
	if (special == "reg"){
		document.getElementById(id).style.borderBottom = "0.2rem solid rgba(22,65,52,0.5)";
		document.getElementById(id).style.padding = "2.15rem 0rem";
		document.getElementById(id).style.background = "rgba(213,241,233,0.8)";
		setTimeout(function(){
			document.getElementById(id).style.borderBottom = "0.5rem solid rgba(22,65,52,0.5)";
			document.getElementById(id).style.padding = "2rem 0rem";
			document.getElementById(id).style.background = "rgba(22,65,52,0.1)";
		},150);
	} else if (special == true){
		document.getElementById(id).style.borderBottom = "0.2rem solid rgba(22,65,52,0.5)";
		document.getElementById(id).style.padding = "2.15rem 0rem";
		document.getElementById(id).style.background = "rgba(213,241,233,1)";
		setTimeout(function(){
			document.getElementById(id).style.padding = "2rem 0rem";
			document.getElementById(id).style.borderBottom = "0.5rem solid rgba(22,65,52,0.5)";
			if (id == "b-equal"){
				document.getElementById(id).style.background = "rgba(255,255,255,0.85)";
			}
			else if (id == "b-parenthesis-open" || id == "b-parenthesis-close" || id == "b-clear") {
				document.getElementById(id).style.background = "rgba(22,65,52,0.4)";
			} else if (id == "b-point") {
				document.getElementById(id).style.background = "rgba(22,65,52,0.1)";
			} else {
				document.getElementById(id).style.background = "rgba(255,121,7,0.85)";
			}
		},300);
	} else if (special == false && next == true) {
		console.log("NEXT");
		document.getElementById(id).style.borderBottom = "0.2rem solid rgba(0,0,0,1)";
		document.getElementById(id).style.padding = "2.15rem 0rem";
		document.getElementById(id).style.background = "rgba(22,65,52,1)";
		setTimeout(function(){
			document.getElementById(id).style.borderBottom = "0.5rem solid rgba(0,0,0,0.3)";
			document.getElementById(id).style.padding = "2rem 0rem";
			document.getElementById(id).style.background = "rgba(22,65,52,0.8)";
		},300);
	}
}