<?php 

// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){

	echo "Post Recieved";

	if(isset($_POST['logout'])){

		// Initialize the session
		session_start();

		// Erase the session
		session_destroy();
		echo "Session Destroyed!";

		// Redirect to login page
		header("location: index.php");
		exit;

	}
}
?>