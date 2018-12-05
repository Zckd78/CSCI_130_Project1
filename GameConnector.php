<?php

require_once 'Database.php';

// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){

	// Check if we're uploading a random level
	if(isset($_POST["add"])) {

		// Get the contents of the JSON object sent only, and decode it
		if(isset($_POST["json"])) {
			$jsonObject = json_decode($_POST["json"]);
		} else {
			die("Could not read the json sent");
		}

		if(isset($jsonObject)){
			// open a file
			$FileName = $jsonObject->Name;

			$file = fopen($FileName.".json","w");
			fwrite($file,$_POST["json"]);
			// Always close the file
			fclose($file);

			// Create a generic object similar to JSON
			$object = (object) [
				"result" => "Success",
			];

			echo json_encode($object);
			exit();
		} else {
			// Create a generic object similar to JSON
			$object = (object) [
				"result" => "Failure",
			];
			
			echo json_encode($object);
			exit();
		}

	} 
}


// Processing requests for data
if($_SERVER["REQUEST_METHOD"] == "GET"){

	// Make sure we've supplied the level and size
	if(isset($_GET["level"]) && isset($_GET["size"])) {
		

		// Get the level and size
		$level = $_GET["level"];
		$size = $_GET["size"];


		// Create a Database Object
		$sqlConn = new SQLConnector();

		// Execute the Query
		$sqlConn->Execute("select leveldata from levels where LevelNumber = $level and GridSize = $size");

		$results = $sqlConn->GetResults();

		// Proceed when rows > 0
		if( $sqlConn->GetNumRows() > 0){

			// Get the first row
			$result = $sqlConn->FetchRow();

			// Decode the JSON string, then reencode it for transfer back to page
			$jObj = json_decode($result['leveldata']);
			echo json_encode($jObj);
			exit();
		}

	}


}

?>