/* 
	------------------------------[Variables]------------------------------
	This area is for initializing global variables
	------------------------------[Variables]------------------------------
*/

// ZS - User for Color selection
// ZS - Changed during game setup
var colorGridBackground = "bgc_grid0";
var colorPixelCorrect = "bgc_pix0";

// ZS - Globalizing Sidebar variables
var gameTurns = 0;
var domTurns = undefined;

var gameElements = 0;
var domElements = undefined;

var gameErrors = 0;
var domErrors = undefined;

// Used for the timer
var time = 0;
var timer;
var timerSet = false;
var timerInt;

//ZS - The Pixels populate this later in addRow()
var PixelArray = Array(13);

// ZS - Make each element in the array another array.
for (var i = 0; i < 13; i++) {
	PixelArray[i] = Array(13);
}

// ZS - Attempting to make a Pixel class to use in an array
function Pixel(x,y) {

	//ZS - Only accept numbers.
	if( !isNaN(x) && !isNaN(y) )
	{
		this.x = x;
		this.y = y;	
	}
	// Defaults all false
	this.isCorrect = false;
	this.isMarked = false;
	this.isError = false;
}
	

/* 
	------------------------------[Initializing]------------------------------
	This area is for code that needs to run first.
	Use it for initializing the page
	------------------------------[Initializing]------------------------------
*/


// Handle updating the Color sliders 
var rangeRed = document.getElementById("color_range_red");
var rangeGreen = document.getElementById("color_range_green");
var rangeBlue = document.getElementById("color_range_blue");



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


/* 
	------------------------------[FUNCTIONS]------------------------------
	This area is functions
	Use it for initializing the page
	------------------------------[FUNCTIONS]------------------------------
*/

// Top level function for starting the game
function startGame(xMax, yMax){
    
    // If new game is clicked again, reset values to 0
    gameTurns = 0;
    gameErrors = 0;
    gameElements = 0;

	// Remove the table elements before adding more
	var table = document.getElementById("GameTable");
	var rowCount = table.rows.length;
	for (var i = 0; i < rowCount; i++) {
		// Calling deleteRow(-1) deletes the last row
		// so we just call this rowCount times
    	table.deleteRow(-1);
	}
	    

    // Use this space to trigger other actions when the game starts.

    // Setup DOM objects
    domTurns = document.getElementById("val_turns");
    domElements = document.getElementById("val_elements");
    domErrors = document.getElementById("val_errors");

    // Reveal the status bar on the side
    $("#GameContainer").fadeIn();

    // Pass the args to generateTable
    generateTable(xMax,yMax);
}

//DY - Timer function
// -- >> PROBLEM << --
// Multiple clicks = multiple timers
function startTimer() {
    time = 0;
    clearTimer();    
    timerInt = setInterval(incTimer, 10);
}

function incTimer() { //DY - function for timer
    time += 0.01;
    timer = document.getElementById("val_timer");
    timer.innerHTML = parseFloat(time).toFixed(2);
}

function clearTimer(){
	clearInterval(timerInt)
}

// Generates the Table based on the x and y Max args.
function generateTable(xMax,yMax){
	
    // Loop through yMax, and create new rows
	for (var y = 0; y < yMax; y++) {
		// Generates the Table, one row at a time
		addRow(xMax, y);
	}
    // ZS - Debugging
	console.log(PixelArray);
}

// Creates a new row and set the pixels in place.
function addRow(xMax, y) {
    // Access the elements from the DOM
    var table = document.getElementById("GameTable");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
	// creation of the elements
    
    // row.insertCell(0).innerHTML= '<div id="'+id+'"></div>';
    // This create each pixel cell in the row
    for (var x = 0; x < xMax; x++) {

    	//ZS - Create the Pixel object
    	var pxl = new Pixel(x,y);

    	// Position
    	var coordID = 'x'+x+'y'+y;
    	var coords = x+','+y;
        
    	// Define the pixel div
        var tagStart = '<div';
    	var tagEvents = ' onclick="pixelLeftClick(this)" onauxclick="pixelRightClick(this)"';
    	// ZS - Add Hover effect to the pixels when mouse hovers over
    	tagEvents += ' onmouseenter="addHover(this)" onmouseleave="removeHover(this)"'
    	
        // ZS - Build the class list for this pixel
        // Change the pixel size based on the board size
        var className = "";        
        if(xMax == 7){
            className = 'class="pixel_large ' + colorGridBackground + '"';
        } else if (xMax == 13){
            var className = 'class="pixel_small ' + colorGridBackground + '"';
        }

        //DY - Randomly assign elements
        //REMOVE THIS WHEN IMPLEMENTING OTHER POPULATION METHODS
        if (coinFlip()){ 
            domElements.innerHTML = ++gameElements;
            pxl.isCorrect = true;
        }
        else
            className += '"'; //Otherwise add nothing
        
        var tagID = ' id="' + coordID + '">';
    	var contents = "";
    	var tagEnd = '</div>';


    	/* --------------------------------------------------
    	  !!ATTENTION!! 
    	  Continue to update the div tags from HERE!
    	  This space is what places the pixels in a line.
    	 -------------------------------------------------- */ 
    	// Place the pixel
        row.insertCell(x).innerHTML= tagStart + tagEvents + className + tagID + contents + tagEnd;
    	

    	// Add this pixel to the array
    	// Pixels can be addressed by [x][y]
    	PixelArray[x][y] = pxl;        
        
	}
}

//DY - Function to make a boolean yes/no for random assign.
function coinFlip() {
    return Math.floor(Math.random() * 2); //returns 1 or 0
}

/* 	Since the pixels pass themselves as (this), we can use their properties, and access
	their children through the DOM.
*/
function pixelLeftClick(pixel){
	// I'm alerting the id, although we have access to more.
	// alert(pixel.id+" was left clicked");
	
    //DY - First check if pixel is solved or not -- if solved we don't want to touch it
    if (!pixel.classList.contains("pixel_correct"))
    {   
    	// Get Pixel Coordinates
    	var coords = getCoordsFromID(pixel.id);
    	console.log('Pixel Clicked: (' + coords.x + ',' + coords.y + ')' )
    	var pix = PixelArray[coords.x][coords.y];

    	if(pix.isCorrect){
    		//Mark correct
            pixel.classList.replace(colorGridBackground,colorPixelCorrect);
            // Increment turns
            domTurns.innerHTML = ++gameTurns;
            // Decrement elements
            domElements.innerHTML = --gameElements;
    	} else {
    		//DY - If already an error, do nothing
            if (!pixel.classList.contains("pixel_incorrect")) {
                //DY - Else it's a miss, mark incorrect
                pixel.classList.add("pixel_incorrect");
                //DY - increment turns
                domTurns.innerHTML = ++gameTurns;
                //DY Increment errors
                domErrors.innerHTML = ++gameErrors;
            }   
    	}
    }
}
    
    
    
    


function pixelRightClick(pixel){
	// I'm alerting the id, although we have access to more.
	// alert(pixel.id+" was right clicked");

	// Add a class to the pixel
	pixel.classList.add("pixel_marked");

	// Remove other classes
	pixel.classList.remove("pixel_selected");

	// Get the coordinate object
	var coords = getCoordsFromID(pixel.id);

	// Alert the coordinates.
	// alert("Coords of this pixel: (" + coords.x + "," + coords.y + ")");
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




/*

Code Graveyard - Dig this up later if needed. 


function ToggleTextColor() {
    colorText = (colorText == 0) ? 1 : 0 ;
    var allText = Array(10);

    // ZS - Generate the tags and gather their DOM objects.
    for (var i = 0; i < 6; i++) {
        var tag = "h" + i;
        allText[i] = document.getElementsByTagName(tag);
    }

    // ZS - DEBUG 
    console.log(allText);
        
    if(colorText == 0) {
        ReplaceClasses(allText,"fgc_white", "fgc_black");    
    } else {

        ReplaceClasses(allText,"fgc_black", "fgc_white");
    }
    
}


// ZS - When given a list, can replace all classes on 
//      DOM objects in aboth 1D and 2D arrays
function ReplaceClasses(elems, oldClass, newClass){

    for (var i = 0; i < elems.length; i++) {
        // ZS - Hangle multiple hits    
        if(elems instanceof HTMLCollection) {
            if ( elems[i] instanceof Array) {
                for (var j = 0; j < elems[i].length; j++) {
                    elems[i][j].classList.Remove(oldClass);
                    elems[i][j].classList.Add(newClass);
                    console.log("2D Class " + oldClass + " replaced with " + newClass);
                }
            }
        } else {
            if(elems instanceof Array) {
                console.log(elems);
                elems[i].classList.Remove(oldClass);
                elems[i].classList.Add(newClass);
                console.log("1D Class " + oldClass + " replaced with " + newClass);
            } else {
                elems.classList.Remove(oldClass);
                elems.classList.Add(newClass);
                console.log("Class " + oldClass + " replaced with " + newClass);
            }
        }
    }
}



Sourced from https://blackboard.learn.fresnostate.edu/bbcswebdav/pid-2341195-dt-content-rid-49956440_1/courses/CSCI130-02-76194-2187/class_javascript_dom_dynatable.html


function deleteRow(obj) {
    let index = obj.parentNode.parentNode.rowIndex;
    let table = document.getElementById("myTableData");
    table.deleteRow(index);
}

// It creates automaticlally a new table with it fills it with elements
function addTable() {
    let myTableDiv = document.getElementById("myDynamicTable"); // need a handle to an element   
    let table = document.createElement('TABLE'); // creation of HTML code , notice you dont close the table !
	
	// Easy to get confused between CSS and DOM syntac to manipulate the attributes
    table.border='1';
	table.style.borderCollapse='collapse';
    let tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
	let sizerow=6;
	let sizecol=10;
    for (let i=0; i<sizerow; i++){
       let tr = document.createElement('TR');
       tableBody.appendChild(tr);
      
       for (let j=0; j<sizecol; j++){
           let td = document.createElement('TD');
           td.width='75'; // you can set some elements related to the style directly through the DOM
           td.appendChild(document.createTextNode("cell (" + i + "," + j + ")"));
           tr.appendChild(td);
       }
    }
    myTableDiv.appendChild(table); // add the table that was created in the DOM 
}


	// Add a class to the pixel
	//pixel.classList.add("pixel_selected");
    
    

	// Remove other classes
	//pixel.classList.remove("pixel_marked");

	// Try adding new attribute
	//pixel.xCoord = "Test";


*/