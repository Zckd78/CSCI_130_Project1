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

var gameScore = 0;
var domScore = undefined;

var gameLevel = 1;
var domLevel = undefined;

// Modes:
// 0 = Arcade
// 1 = Time Attack
var gameMode = undefined;


// Used for the suggestions
var suggestedCorrect = false;
var suggestedWrong = false;


// Used for the timer
var time = 0;
var timer;
var timerSet = false;
var timerInt;

// ZS - User for Color selection
// ZS - Changed during game setup
var colorGridBackground = "bgc_grid0";
var colorPixelCorrect = "bgc_pix0";

// Used throughout
var xMaximum = 0;
var yMaximum = 0;

//ZS - The Pixels populate this later
var PixelArray;

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

// Used to configure the size of the grid being played
function setSize(size){

    var size7 = document.getElementById("size7Btn");
    var size13 = document.getElementById("size13Btn");

    if(size == 7 || size == 13){
        // Set the size variables
        xMaximum = size;
        yMaximum = size;

        // Update the Size Buttons
        if( size == 7 ){
            size7.classList.replace("btn-secondary", "btn-dark");
            size13.classList.replace("btn-dark", "btn-secondary");
        } else if( size == 13 ){
            size7.classList.replace("btn-dark", "btn-secondary");
            size13.classList.replace("btn-secondary", "btn-dark");
        }
    }
}


function setGameMode(mode){
    
    var arcadeBtn = document.getElementById("arcadeBtn");
    var attackBtn = document.getElementById("attackBtn");

    if(mode == 0 | mode == 1) {
        gameMode = mode;

        // Update the Size Buttons
        if( mode == 0 ){
            arcadeBtn.classList.replace("btn-secondary", "btn-dark");
            attackBtn.classList.replace("btn-dark", "btn-secondary");
        } else if( mode == 1 ){
            arcadeBtn.classList.replace("btn-dark", "btn-secondary");
            attackBtn.classList.replace("btn-secondary", "btn-dark");
        }

    }
}

function tryStartGame(){

    var setupHint = document.getElementById("setupHint");

    if(gameMode == undefined || xMaximum == undefined) {
        setupHint.classList.remove("hidden");
    } else {
        setupHint.classList.add("hidden");

        startGame();
    }

}



// Top level function for starting the game
function startGame(){
    
    // If new game is clicked again, reset values to 0
    gameTurns = 0;
    gameErrors = 0;
    gameElements = 0;
    gameScore = 0;

    // Create the PixelArray
    PixelArray = Array(xMaximum);

    // ZS - Make each element in the array another array.
    for (var i = 0; i < xMaximum; i++) {
        PixelArray[i] = Array(xMaximum);
    }


	// Remove the table elements before adding more
	var table = document.getElementById("GameTable");
	var rowCount = table.rows.length;
	for (var i = 0; i < rowCount; i++) {
		// Calling deleteRow(-1) deletes the last row
		// so we just call this rowCount times
    	table.deleteRow(-1);
	}

    // Setup DOM objects
    domTurns = document.getElementById("val_turns");
    domElements = document.getElementById("val_elements");
    domErrors = document.getElementById("val_errors");
    domScore = document.getElementById("val_score");


    // Decide here how to proceed.




    

    // ZS - Create the 2D array of Pixel objects before we create the table items
    generateGrid();

    // Pass the args to generateTable
    generateTable();

    // Test Sending the Grid to the server to save.
    SendGrid(xMaximum + "x" + yMaximum + "_Level_" + gameLevel,xMaximum);

    // Testing Level Saving
    gameLevel++;

    // Hide the game info section
    $("#GameInfo").slideUp(250);

    // Reveal the Game board, and hide the configuration section
    // ZS - This is an example of jQuery
    $("#GameContainer").slideDown();
    $("#PreGame_Selections").slideUp(250);


    startTimer();
}


/*
============================================
    Timer Functions 
============================================
*/
//DY - Timer function
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
function generateTable(){
	
    // ZS - Need to incorporate the Hints for top and sides here
    addHintRow();

    // Loop through yMax, and create new rows
	for (var y = 0; y < yMaximum; y++) {
		// Generates the Table, one row at a time
		addRow(y);
	}
    // ZS - Debugging
	console.log(PixelArray);
}

/*
============================================
    Hint Functions 
============================================
*/

// Creates the hints along the top row of the table
function addHintRow() {
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
    for (var i = 0; i < yMaximum; i++) {
        tableData = document.createElement("td");
        var hints = getHints("y", i);
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
function getHints(plane, pos) {
    
    // Counts of hints, plus c as a incrementer
    var counts = Array(yMaximum);
    // Fill the array with zeroes to be incremented
    for (var i = 0; i < 10; i++) {
        counts[i] = 0;
    }
    var c = 0;

    if( plane.toLowerCase() == "y" ){
        // The counts are in order of how we should show them.
        for (var i = 0; i < yMaximum; i++) {
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
        for (var i = 0; i < yMaximum; i++) {
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


/*
============================================
    Grid Generation Functions 
============================================
*/

// Create the entire Grid of Pixels before we generate the table.
function generateGrid(){

    for (var y = 0; y < yMaximum; y++) {
        for (var x = 0; x < xMaximum; x++) {

            //ZS - Create the Pixel object
            var pxl = new Pixel(x,y);

            //DY - Randomly assign elements
            //REMOVE THIS WHEN IMPLEMENTING OTHER POPULATION METHODS
            if (coinFlip()){ 
                domElements.innerHTML = ++gameElements;
                pxl.isCorrect = true;
            } else {
                pxl.isError = true;
            }

            // Add this pixel to the array
            // Pixels can be addressed by [x][y]
            PixelArray[x][y] = pxl; 

        }
    }

}

/*
============================================
    Table building
============================================
*/

// Creates a new row and set the pixels in place.
function addRow( y) {
    // Access the elements from the DOM
    var table = document.getElementById("GameTable");
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
	
    // Dealing with the first row..
    var tableData = document.createElement("td");
    // Build the hints in a span
    var hintData = "<center><span class='fgc_black p-2'> ";
    var hints = getHints("x",y,xMaximum);
    for (var i = 0; i < hints.length; i++) {
         if(hints[i] > 0)
            hintData += hints[i] + "  ";
    }
    hintData += "</span></center>";
    tableData.innerHTML = hintData;
    // Attach the td to tr
    row.appendChild(tableData);
    

    // This create each pixel cell in the row
    for (var x = 0; x < xMaximum; x++) {

    	// Position
    	var coordID = 'x'+x+'y'+y;
    	var coords = x+','+y;
        
    	// Define the pixel div
        var tagStart = '<div';
    	var tagEvents = ' onclick="pixelLeftClick(this)" onauxclick="pixelRightClick(this)"';
    	// ZS - Add Hover effect to the pixels when mouse hovers over
    	tagEvents += ' onmouseenter="AddHover(this)" onmouseleave="RemoveHover(this)"'
    	
        // ZS - Build the class list for this pixel
        // Change the pixel size based on the board size
        var className = "";        
        if(xMaximum == 7){
            className = 'class="pixel_large ' + colorGridBackground + '"';
        } else if (xMaximum == 13){
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
	
    // First check if pixel is solved or not -- if solved we don't want to touch it
    if (!pixel.classList.contains("pixel_correct"))
    {   
    	// Get Pixel Coordinates
    	var coords = getCoordsFromID(pixel.id);
    	console.log('Pixel Clicked: (' + coords.x + ',' + coords.y + ')' )
    	var pix = PixelArray[coords.x][coords.y];
        console.log(pix);

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

    // Check if we've won the game
    if(hasWon()){
        alert("You solved this puzzle in " + time + " seconds!");
        clearTimer();
    } else {
        updateScore();
    }
}

function updateScore(){
    gameScore = (Math.max((gameElements - gameErrors),0) / gameElements).toFixed(2);
    domScore.innerHTML = gameScore;
}


function hasWon(){

    // First check elements reduced to zero
    if(gameElements < 1){
        // Next we check all pixels
        for (var x = 0; x < xMaximum; x++) {
            for (var y = 0; y < yMaximum; y++) {
                var pxl = PixelArray[x][y];
                // Encountering pixel that is Correct but not marked, no win.
                if( !pxl.isError && pxl.isCorrect && !pxl.isMarked ){
                    return false;
                }

            }
        }
        // If reached this far, puzzle completed.
        return true;

    } 
}


// Flips a coin to either give the a viable move, or an incorrect one
function suggestMove(){

    var chance = coinFlip();

    var randX = Math.floor(Math.random() * xMaximum);
    var randY = Math.floor(Math.random() * yMaximum);

    var testPixel = PixelArray[randX][randY];

    var suggestCorrect = false;

    // Determine if given Right or Wrong pixel
    if(chance){
        suggestCorrect = true;
    } 

    // If True, give a correct move
    if(suggestCorrect && suggestedCorrect == false){

        // Keep trying pixels until we find that that isn't marked, and is correct
        while(!testPixel.isCorrect && !testPixel.isMarked){
            randX = Math.floor(Math.random() * xMaximum);
            randY = Math.floor(Math.random() * yMaximum);
            testPixel = PixelArray[randX][randY];
        }

        console.log("Randomly picked the correct Pixel @ (" + randX + "," + randY + ")");

        // Make the Pixel pop out
        var pix = document.getElementById("x" + randX + "y" + randY);
        pix.classList.add("tadaAnimate");
        // Update that we suggested a good move
        suggestedCorrect = true;

    } else if(suggestedWrong == false) {

        // Else give a bad move
        // Keep trying pixels until we find that that isn't marked, and is
        while(testPixel.isCorrect && !testPixel.isMarked){
            randX = Math.floor(Math.random() * xMaximum);
            randY = Math.floor(Math.random() * yMaximum);
            testPixel = PixelArray[randX][randY];
        }

        console.log("Randomly picked the wrong Pixel @ (" + randX + "," + randY + ")");

        // Make the Pixel pop out
        var pix = document.getElementById("x" + randX + "y" + randY);
        pix.classList.add("tadaAnimate");

        // Update that we suggested a bad move
        suggestedWrong = true;

    }   

    // Check if we need to disable the button because 2 suggestions were made
    if(suggestedCorrect && suggestedWrong){
        // Get the Button DOM Object and make it disabled.
        var btn = document.getElementById("btn_suggest")
        btn.classList.add("disabled");
        // remove the onclick event handler
        btn.onclick = null;
    }

}

// Candidate for deletion...
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


/*
============================================
    Server interaction functions 
============================================
*/

function SendGrid(Name, Size){

    // Create the JSON var, supplied with the random array.
    var jsonData = {
        "Name": Name,
        "Size": Size,
        "Grid" : PixelArray
    };

    console.log("Making Request for " + Name);
    MakeRequest("POST", "server.php", "add=1&json="+JSON.stringify(jsonData) , serverReply);
}


function GetGrid(Size, Level) {
    var fileName = "file="+ Size + "x" + Size + "Level_"+ Level;
    console.log("Making Request for " + fileName);
    MakeRequest("POST", "server.php", fileName, retrieveGrid);
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



function retrieveGrid(){
    // Only continue if the response was finished, and returned code 200 for OK
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {      
            
            console.log(httpRequest.responseText);

            var responseObject = JSON.parse(httpRequest.responseText);
            // Set the HTML to this response 
            PixelArray = responseObject.Grid;
            
        }
    }
}




function serverReply(){
    // Only continue if the response was finished, and returned code 200 for OK
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {      
            console.log(httpRequest.responseText);
        }
    }
}

