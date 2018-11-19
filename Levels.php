<?php 

	// Load the level file
	$jsonFile = file_get_contents('superheroes.json');
	echo json_encode($jsonFile);
	

?>