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
var PixelArray = Array(14);

// ZS - Make each element in the array another array.
for (var i = 0; i < 14; i++) {
	PixelArray[i] = Array(14);
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

    // Reveal the Game board, and hide the configuration section
    // ZS - This is an example of jQuery
    $("#GameContainer").slideDown();

    $("#PreGame_Selections").slideUp();

    // Pass the args to generateTable
    generateTable(xMax,yMax);

    // Testing the Hint system
    // alert("Hints for first Column: " + getHints("y",0,xMax));
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
	
    // ZS - Create the 2D array of Pixel objects before we create the table items
    generateGrid(xMax,yMax);

    // ZS - Need to incorporate the Hints for top and sides here
    addHintRow(yMax);

    // Loop through yMax, and create new rows
	for (var y = 0; y < yMax; y++) {
		// Generates the Table, one row at a time
		addRow(xMax, y);
	}
    // ZS - Debugging
	console.log(PixelArray);
}

// Creates the hints along the top row of the table
function addHintRow(yMax) {
    var table = document.getElementById("GameTable");
    var tableHead = document.createElement("thead");
    var tableRow = document.createElement("tr");

    // Create an empty space for the Horizontal hints
    var tableData = document.createElement("td");
    // Add styling classes
    tableData.classList.add("bgc_foreground");
    tableData.classList.add("no_border");
    // Attach the td to tr
    tableRow.appendChild(tableData);

    // Create a Table Data for each pixel
    for (var i = 0; i < yMax; i++) {
        tableData = document.createElement("td");
        var hints = getHints("y", i, yMax);
        console.log("Hints at column " + i + " are: " + hints );
        var list = document.createElement("ul"); 
        list.classList.add("list_hints");
        // Place the hints in a list.
        for (var j = 0; j < hints.length; j++) {
            if(hints[j] > 0){
                // Create a list item, fill it with hint number, and attach to list.
                var item = document.createElement("li");
                item.innerHTML = hints[j];
                list.appendChild(item);
            }            
        }
        // Attach List to Table data
        tableData.appendChild(list);

        // Attach the td to tr
        tableRow.appendChild(tableData);
    }

    // Attach the row to the table head
    tableHead.appendChild(tableRow);

    // Finally, attach the Table Head to the table.
    table.appendChild(tableHead);

}

// Expects either "x" or "y" as the plane to operate.
// Returns an array of the hints
function getHints(plane, pos, max) {
    
    // Counts of hints, plus c as a incrementer
    var counts = Array(max);
    // Fill the array with zeroes to be incremented
    for (var i = 0; i < 10; i++) {
        counts[i] = 0;
    }
    var c = 0;

    if( plane.toLowerCase() == "y" ){
        // The counts are in order of how we should show them.
        for (var i = 0; i <= max; i++) {
            // Add a count of pixels in a row
            if(PixelArray[pos][i] && PixelArray[pos][i].isCorrect){
                counts[c]++;
            } else if(PixelArray[pos][i] && !PixelArray[pos][i].isCorrect && counts[c] > 0){
                // If found an incorrect one, move into the next counts space.
                c++;
            }            
        }
    } else if( plane.toLowerCase() == "x" ){
        // The counts in order reflect how we should show them.
        for (var i = 0; i <= max; i++) {
            // Add a count of pixels in a row
            if(PixelArray[i][pos] && PixelArray[i][pos].isCorrect){
                counts[c]++;
            } else if(PixelArray[i][pos] && !PixelArray[i][pos].isCorrect && counts[c] > 0){
                // If found an incorrect one, move into the next counts space.
                c++;
            }            
        }

    }
    return counts;
}


// Create the entire Grid of Pixels before we generate the table.
function generateGrid(xMax,yMax){

    for (var y = 0; y < yMax; y++) {
        for (var x = 0; x < xMax; x++) {

            //ZS - Create the Pixel object
            var pxl = new Pixel(x,y);

            //DY - Randomly assign elements
            //REMOVE THIS WHEN IMPLEMENTING OTHER POPULATION METHODS
            if (coinFlip()){ 
                domElements.innerHTML = ++gameElements;
                pxl.isCorrect = true;
            }

            // Add this pixel to the array
            // Pixels can be addressed by [x][y]
            PixelArray[x][y] = pxl; 

        }
    }

}

// Creates a new row and set the pixels in place.
function addRow(xMax, y) {
    // Access the elements from the DOM
    var table = document.getElementById("GameTable");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
	
    // Dealing with the first row..
    var tableData = document.createElement("td");
    // Build the hints in a span
    var hintData = "<center><span class='fgc_black p-2'> ";
    var hints = getHints("x",y,xMax);
    for (var i = 0; i < hints.length; i++) {
         if(hints[i] > 0)
            hintData += hints[i] + "  ";
    }
    hintData += "</span></center>";
    tableData.innerHTML = hintData;
    // Attach the td to tr
    row.appendChild(tableData);
    

    // This create each pixel cell in the row
    for (var x = 0; x < xMax; x++) {

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
        
        var tagID = ' id="' + coordID + '">';
    	var contents = "";
    	var tagEnd = '</div>';


    	/* --------------------------------------------------
    	  !!ATTENTION!! 
    	  Continue to update the div tags from HERE!
    	  This space is what places the pixels in a line.
    	 -------------------------------------------------- */ 
    	// Place the pixel, x+1 user since we have to insert the Hint cell first.
        var pos = x+1;
        row.insertCell(pos).innerHTML= tagStart + tagEvents + className + tagID + contents + tagEnd;
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

