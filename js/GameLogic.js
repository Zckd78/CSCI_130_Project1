/* 
	------------------------------[Variables]------------------------------
	This area is for initializing global variables
	------------------------------[Variables]------------------------------
*/

// Used for the timer
var time = 0;
var timer;
var timerSet = false;
var timerInt;

//ZS - The Pixels populate this later in addRow()
var PixelArray = Array(13);

// Make each element in the array another array.
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
    
    //DY - If new game is clicked again, reset values to 0
    document.getElementById("val_elements").innerHTML = 0;
    document.getElementById("val_turns").innerHTML = 0;
    document.getElementById("val_errors").innerHTML = 0;
    
	// Remove the table elements before adding more
	var table = document.getElementById("GameTable");
	var rowCount = table.rows.length;
	for (var i = 0; i < rowCount; i++) {
		// Calling deleteRow(-1) deletes the last row
		// so we just call this rowCount times
    	table.deleteRow(-1);
	}
	
    

    // Use this space to trigger other actions when the game starts.
    // Start the game timer
    // Randomize the correct pixels
    // Do other stuff before the game starts...

    // Reveal the status bar on the side
    var statusBar = document.getElementById("GameStatus");
    statusBar.classList.remove("hidden");

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
// TODO - Make this function remove the existing table before generating the next one.
function generateTable(xMax,yMax){
	
    // Loop through yMax, and create new rows
	for (var y = 0; y < yMax; y++) {
		// Generates the Table, one row at a time
		addRow(xMax, y);
	}
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
    	var className = ' class="pixel_large';        

        //DY - Randomly assign elements
        //REMOVE THIS WHEN IMPLEMENTING OTHER POPULATION METHODS
        if (coinFlip()){ 
            className += ' hasElement"'; //Add 'class: hasElement;
            document.getElementById("val_elements").innerHTML++;
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
    	if(xMax == 7){
			row.insertCell(x).innerHTML= tagStart + tagEvents + className + tagID + contents + tagEnd;
    	} else if (xMax == 13){
    		var className = 'class="pixel_small"';
			row.insertCell(x).innerHTML= tagStart + tagEvents + className + tagID + contents + tagEnd;
    	}

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
    		//DY - mark correct
            pixel.classList.add("pixel_correct");
            //DY - increment turns
            document.getElementById("val_turns").innerHTML++;
            //DY Decrement elements
            document.getElementById("val_elements").innerHTML--;
    	} else {
    		//DY - If already an error, do nothing
            if (!pixel.classList.contains("pixel_incorrect")) {
                //DY - Else it's a miss, mark incorrect
                pixel.classList.add("pixel_incorrect");
                //DY - increment turns
                document.getElementById("val_turns").innerHTML++;
                //DY Increment errors
                document.getElementById("val_errors").innerHTML++;
            }   
    	}

    	/* ZS - Removing this section as I implement the Array checking

        //DY - Next check if it has an element -- if it does, mark solved
        if (pixel.classList.contains("hasElement")) {
            //DY - mark correct
            pixel.classList.add("pixel_correct");
            //DY - increment turns
            document.getElementById("val_turns").innerHTML++;
            //DY Decrement elements
            document.getElementById("val_elements").innerHTML--;
        } else {
            //DY - If already an error, do nothing
            if (!pixel.classList.contains("pixel_incorrect")) {
                //DY - Else it's a miss, mark incorrect
                pixel.classList.add("pixel_incorrect");
                //DY - increment turns
                document.getElementById("val_turns").innerHTML++;
                //DY Increment errors
                document.getElementById("val_errors").innerHTML++;
            }    
        }

        */

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


function addHover(obj) {
	obj.classList.add("pixel_hover");
}

function removeHover(obj) {
	obj.classList.remove("pixel_hover");
}

/*

Code Graveyard - Dig this up later if needed. 

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