var btn = document.querySelector("#btn");
var price = document.querySelector("#price");

btn.addEventListener("click", function(){
	//make  the request
	var XHR = new XMLHttpRequest();
	
	XHR.onreadystatechange =function(){
		if(XHR.readyState == 4 && XHR.status == 200){
			var data = JSON.parse(XHR.responseText).bpi;
			
			price.innerText = data.EUR.rate+" "+data.EUR.code;
		}
	}

	XHR.open("GET","https://api.coindesk.com/v1/bpi/currentprice.json");
	XHR.send();
});
