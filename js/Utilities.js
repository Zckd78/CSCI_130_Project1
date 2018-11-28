


/* 
	------------------------------[Initializing]------------------------------
	This area is for code that needs to run first.
	Use it for initializing the page
	------------------------------[Initializing]------------------------------
*/

// Sourced from https://stackoverflow.com/questions/4909167/how-to-add-a-custom-right-click-menu-to-a-webpage#4909312
// Runs first to disable the context menu with Right clicking
if (document.addEventListener) { // IE >= 9; other browsers
    document.addEventListener('contextmenu', function(e) {
        // alert("You've tried to open context menu"); //here you draw your own menu
        e.preventDefault();
    }, false);
} else { // IE < 9
    document.attachEvent('oncontextmenu', function() {
        // alert("You've tried to open context menu");
        window.event.returnValue = false;
    });
}



//DY - Function to make a boolean yes/no for random assign.
function coinFlip() {
    return Math.floor(Math.random() * 2); //returns 1 or 0
}


// Derives the coordinates of the pixel from the id given.
// Returns an object with x and y attrs.
function getCoordsFromID(id){

	var xVal = "";
	var yVal = "";

	// Check to make sure we have the correct input
	if(id[0] == 'x'){

		// Start looking at the first value after x
		var i = 1;
		while(i<3){
			if(id[i] == 'y'){
				break;
			}
			else {
				xVal += id[i++];
			}		
		}
		
		// Increment again to skip the "y"
		i++;

		// Start looking for the y value
		while(i<id.length){
			yVal += id[i++];
		}
	}

	// Return an object with both x and y values
	return {
		"x" : xVal,
		"y" : yVal 
	};
}

/* 
    Functions used for onmouseover
*/
function AddHover(obj) {
	obj.classList.add("hover_select");
}

function RemoveHover(obj) {
	obj.classList.remove("hover_select");
}

function UpdatePixelColor(obj) {
    
    // Reset all colors to non-selected
    var pixelColorDivs = document.getElementsByName("color_select_pixel");
    for (var i = 0; i < pixelColorDivs.length; i++) {
        pixelColorDivs[i].classList.remove("hover_select");
    }

    // Get the second class, which should be the background color class.
    var colorClass = obj.classList.item(1);
    // Debugging
    console.log(colorClass + " selected for the Pixel Color.");

    // Set the color of pixels generated.
    colorPixelCorrect = colorClass;

    // Show the color as being selected
    obj.classList.add("hover_select");
}

function UpdateGridColor(obj) {
    
    // Reset all colors to non-selected
    var gridColorDivs = document.getElementsByName("color_select_grid");
    for (var i = 0; i < gridColorDivs.length; i++) {
        gridColorDivs[i].classList.remove("hover_select");
    }

    // Get the second class, which should be the background color class.
    var colorClass = obj.classList.item(1);
    // Debugging
    console.log(colorClass + " selected for the Grid Color.");

    // Set the color of pixels generated.
    colorGridBackground = colorClass;

    // Show the color as being selected
    obj.classList.add("hover_select");

}

// Calls out to the server using the provided arguments
function MakeRequest(method, phpFile, sendData, callback) {
    httpRequest = new XMLHttpRequest(); // create the object
    if (!httpRequest) { // check if the object was properly created
      // issues with the browser, example: old browser
      alert('Cannot create an XMLHTTP instance');
      return false;
    }
    // Assign the function to call when the response comes back
    httpRequest.onreadystatechange = callback; 
    // Open the request as a POST command to server.php
    httpRequest.open(method, phpFile);
    // Set the content type
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // Stringify the data to sent over to the server.
    httpRequest.send(sendData);
}


// Calls out to the server using the provided arguments
function MakeJSONRequest(method, phpFile, jsonObj, callback) {
    httpRequest = new XMLHttpRequest(); // create the object
    if (!httpRequest) { // check if the object was properly created
      // issues with the browser, example: old browser
      alert('Cannot create an XMLHTTP instance');
      return false;
    }
    // Assign the function to call when the response comes back
    httpRequest.onreadystatechange = callback; 
    // Open the request as a POST command to server.php
    httpRequest.open(method, phpFile);
    // Set the content type
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // Stringify the data to sent over to the server.
    var sendString = "json="+JSON.stringify(jsonObj);
    httpRequest.send(sendString);
}


function Logout(){

    document.getElementById("logoutForm").submit();

}