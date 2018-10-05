function addRow() {         
    // Access the elements from the DOM
    let objname = document.getElementById("objname"); // based on the ID !!!
    let price = document.getElementById("price");
    let table = document.getElementById("myTableData");
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
	// creation of the elements
    row.insertCell(0).innerHTML= '<input type="button" value = "Delete" onClick="deleteRow(this)">';
    row.insertCell(1).innerHTML= objname.value;
    row.insertCell(2).innerHTML= price.value;
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
