<?php

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
		} else {
			// Create a generic object similar to JSON
			$object = (object) [
				"result" => "Failure",
			];
			
			echo json_encode($object);
		}

	} 


?>