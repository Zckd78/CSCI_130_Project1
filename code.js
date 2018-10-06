
// Generates the Table based on the x and y Max args.
function generateTable(xMax,yMax){
	
	for (var y = 0; y < yMax; y++) {
		// Generates the Table, one row at a time
		addRow(xMax, y);
	}
}

// Creates a new row and set the pixels in place.
function addRow(xMax, y) {
    // Access the elements from the DOM
    let table = document.getElementById("GameTable");
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
	// creation of the elements
    
    // row.insertCell(0).innerHTML= '<div id="'+id+'"></div>';
    for (var x = 0; x < xMax; x++) {

    	let tagID = 'x'+x+'y'+y;
    	let coords = x+','+y;
    	/* --------------------------------------------------
    	  TODO Continue to update the div tags from HERE!
    	  This space is what places the pixels in a line.
    	 -------------------------------------------------- */ 
    	if(xMax == 7){
			row.insertCell(x).innerHTML= '<div onclick="testLeftClick(this)" class="pixel_large" id="' + tagID + '">' + coords + '</div>';
    	} else if (xMax == 13){
			row.insertCell(x).innerHTML= '<div onclick="testLeftClick(this)" class="pixel_small" id="' + tagID + '">' + coords + '</div>';
    	}
	}
}

/* 	Since the pixels pass themselves as (this), we can use their properties, and access
	their children through the DOM.
*/
function testLeftClick(pixel){
	// I'm alerting the id, although we have access to more.
	alert(pixel.id+" was left clicked");
}

function testRightClick(id){
	// I'm alerting the id, although we have access to more.
	alert(pixel.id+" was right clicked");
}

/*
Sourced from https://blackboard.learn.fresnostate.edu/bbcswebdav/pid-2341195-dt-content-rid-49956440_1/courses/CSCI130-02-76194-2187/class_javascript_dom_dynatable.html
*/

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
