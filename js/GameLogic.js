/* 
	------------------------------[Variables]------------------------------
	This area is for initializing global variables
	------------------------------[Variables]------------------------------
*/


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
    // ZS - This is an example of jQuery
    $("#GameContainer").slideDown();

    $("#PreGame_Selections").slideUp();

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

        // Only mark the Pixel if unmarked
    	if(pix.isCorrect && !pix.isMarked){
    		//Mark correct
            pixel.classList.replace(colorGridBackground,colorPixelCorrect);
            // Update the pixel
            pix.isMarked = true;
            // Increment turns
            domTurns.innerHTML = ++gameTurns;
            // Decrement elements
            domElements.innerHTML = --gameElements;
    	} else if(!pix.isCorrect) {
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

