

function generateTable(xMax,yMax){


	for (var y = 0; y < yMax; y++) {
		addRow(xMax, y);
	}

}

// Creates a new row and set
function addRow(xMax, y) {
    // Access the elements from the DOM
    let table = document.getElementById("GameTable");
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
	// creation of the elements
    
    // row.insertCell(0).innerHTML= '<div id="'+id+'"></div>';
    for (var x = 0; x < xMax; x++) {
		row.insertCell(x).innerHTML= '<div class="block" id="x'+x+'y'+x+'"></div>';
	}
}


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
