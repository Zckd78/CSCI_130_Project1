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


	// Handle Requests for the leaderboard
	// Make sure we've supplied the params
	if(isset($_GET["getLeaderboard"]) && isset($_GET["size"]) && isset($_GET["order"]) && isset($_GET["dir"])) {
		
		$orderVar = $_GET["order"];
		$gridSize = $_GET["size"];
		$dir = $_GET["dir"];

		// Create a Database Object
		$sqlConn = new SQLConnector();

		// Execute the Query
		$sqlConn->Execute("select p.Username, g.Duration, g.Score, l.LevelNumber, l.GridSize from game as g 
							inner join players as p on p.Key = g.PlayerKey 
							inner join levels as l on l.Key = g.LevelKey
							where l.GridSize = $gridSize
							order by g.$orderVar $dir");

		$results = $sqlConn->GetResults();

		// Proceed when rows > 0
		$rowCount = $sqlConn->GetNumRows();
		if( $rowCount > 0){

			$results = (object) [ "Rows" => $rowCount, "Results" => [] ];

			for ($i=0; $i < $rowCount; $i++) { 

				// Get the first row
				$result = $sqlConn->FetchRow($i);

				// Create a generic object to convert into JSON
				$object = (object) [
					"LevelNumber" => $result['LevelNumber'],
					"GridSize" => $result['GridSize'],
					"Username" => $result['Username'],
					"Duration" => $result['Duration'],
					"Score" => $result['Score']
				];

				// Add the result row
				$results->Results[$i] = json_encode($object);
			}			

			echo json_encode($results);
			exit();
		}
	}




	// Handle Requests for specific levels in the data
	// Make sure we've supplied the params
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
			$result = $sqlConn->FetchRow(0);

			// Decode the JSON string, then reencode it for transfer back to page
			$jObj = json_decode($result['leveldata']);
			echo json_encode($jObj);
			exit();
		}
	}


}

?>