var numSquare=6;
	//Generate Color variable
var colors = [];
var pickedColor;

	//All selector variables
var squares= document.querySelectorAll(".square");
var colorDisplay=document.querySelector("#colorDisplay");
var messageDisplay=document.querySelector("#message");
var h1=document.querySelector("h1");
var resetButton=document.querySelector("#reset");
var modeButton=document.querySelectorAll(".mode");
	//Generate picked color and display it
	
	// colorDisplay.textContent=pickedColor;

	//Loop for change color to .square
init();

function init(){
	for(var i=0; i<modeButton.length; i++){
		modeButton[i].addEventListener("click", function(){
			modeButton[0].classList.remove("selected");
			modeButton[1].classList.remove("selected");
			this.classList.add("selected");
			this.textContent === "Easy" ? numSquare=3 : numSquare=6;
			resetColor();
		});
	}
	
	for(var i=0; i<squares.length; i++){
		squares[i].addEventListener("click", function(){
			var clickedColor=this.style.backgroundColor;
				if(clickedColor===pickedColor){
					messageDisplay.textContent="Corect!!!";
					changeColor(clickedColor);
					resetButton.textContent="Play again";
					h1.style.backgroundColor=clickedColor;
				}else{
					this.style.backgroundColor="#232323";
					messageDisplay.textContent="Try again";
				}
			});
	}
	
	resetButton.addEventListener("click",function(){
		resetColor();
	});
	resetColor();
}	
	
	
	//reset color game


function resetColor(){
	colors=genarateRandomColors(numSquare);
	pickedColor = pickColor();
	colorDisplay.textContent = pickedColor;
	messageDisplay.textContent="";
	h1.style.backgroundColor="steelblue";
	this.textContent="New color";

	for(var i=0; i<squares.length; i++){
	// add initial colors to square
		if(colors[i]){
			squares[i].style.display="block";
			squares[i].style.backgroundColor=colors[i];
		} else{
			squares[i].style.display="none";
		}
	}
}


function changeColor(color){
		for(var i=0; i<squares.length; i++){
			squares[i].style.backgroundColor=color;
		}
}
function pickColor(){
	var random=Math.floor(Math.random()*colors.length);
	return colors[random];
}
function genarateRandomColors(num){
	var arr = [];
	for(var i=0; i<num; i++){
		arr.push(randomColor());
	}
	return arr
}
function randomColor(){
	var r=Math.floor(Math.random()*256);
	var g=Math.floor(Math.random()*256);
	var b=Math.floor(Math.random()*256);
	"rgb(255, 255, 2)"
	return ("rgb(" + r +", " + g +", " + b+ ")");
}