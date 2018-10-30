
// ZS - User for Color selection
// ZS - Changed during game setup
var colorGridBackground = "bgc_grid0";
var colorPixelCorrect = "bgc_pix0";

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

// Given an element id, will cause the element to disappear from the page.
function hideElement(id){
	if(id != ""){
		var obj = document.getElementById(id);
		obj.classList.add("hidden");
	}
}

/* 
    Functions used for onmouseover
*/
function addHover(obj) {
	obj.classList.add("pixel_hover");
}

function removeHover(obj) {
	obj.classList.remove("pixel_hover");
}

function UpdatePixelColor(obj) {
    
    // Reset all colors to non-selected
    var pixelColorDivs = document.getElementsByName("color_select_pixel");
    for (var i = 0; i < pixelColorDivs.length; i++) {
        pixelColorDivs[i].classList.remove("pixel_hover");
    }

    // Get the second class, which should be the background color class.
    var colorClass = obj.classList.item(1);
    // Debugging
    console.log(colorClass + " selected for the Pixel Color.");

    // Set the color of pixels generated.
    colorPixelCorrect = colorClass;

    // Show the color as being selected
    obj.classList.add("pixel_hover");
}

function UpdateGridColor(obj) {
    
    // Reset all colors to non-selected
    var gridColorDivs = document.getElementsByName("color_select_grid");
    for (var i = 0; i < gridColorDivs.length; i++) {
        gridColorDivs[i].classList.remove("pixel_hover");
    }

    // Get the second class, which should be the background color class.
    var colorClass = obj.classList.item(1);
    // Debugging
    console.log(colorClass + " selected for the Grid Color.");

    // Set the color of pixels generated.
    colorGridBackground = colorClass;

    // Show the color as being selected
    obj.classList.add("pixel_hover");

}
