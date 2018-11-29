<?php

/*
	LOGIN PAGE
*/

	
// Include Database Connection
require_once 'Database.php';

// Used for Login and Registration
$username = "";
$password = "";
$firstname = "";
$lastname = "";
$age = "";
$gender = "";
$location = "";
$icon = "";

// File Upload
$target = "uploads/";
$file_name = "";
$tmp_dir = "";

// Errors
$usernameError = "";
$passwordError = "";

// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){

	if(isset($_POST['LoginSubmit'])){

		// Check if username is empty
	    if(isset($_POST["Log_UserName"])){
	        $username = trim($_POST["Log_UserName"]);
	    }

	    // Check if password is empty
	    if(isset($_POST["Log_PassWord"])){
	        $password = trim($_POST["Log_PassWord"]);
	    }


	    if(empty($username)){
	    	$usernameError = "Please enter your username!";
	    }
	    
	    if(empty($password)){
	    	$passwordError = "Please enter your password!";
	    }	

	    $sqlConn = new SQLConnector();

	    // Execute the Query
	    $sqlConn->Execute("SELECT username, password FROM players WHERE username = '$username' LIMIT 1");

	    if( $sqlConn->GetNumRows() > 0){

		    // Get the first row
		    $result = $sqlConn->FetchRow();

		    if(password_verify($password, $result['password'])){

		    	// Start the session as their Username
			    session_start();
			    $_SESSION['username'] = $username;

			    // Forward the Browser to the game page   
			    header("location: game.php");

			    CloseConnection();
		    } else {
		    	$passwordError = "Wrong Password!";
		    }

		} else {
			// No Username found
			$usernameError = "User not found!";
		}
	    

	} // End of Login Handling

	// Registration Handling
	else if(isset($_POST['RegistrationSubmit'])){

		// Check if username is empty
	    if(isset($_POST["Reg_UserName"])){
	        $username = trim($_POST["Reg_UserName"]);
	    }
	    
	    // Check if password is empty
	    if(isset($_POST['Reg_InputPassword1'])){
	        $password = trim($_POST['Reg_InputPassword1']);
	    }

		// Check if firstname is empty
	    if(isset($_POST['Reg_FirstName'])){
	        $firstname = trim($_POST['Reg_FirstName']);
	    }

	    // Check if lastname is empty
	    if(isset($_POST['Reg_LastName'])){
	        $lastname = trim($_POST['Reg_LastName']);
	    }

	    // Check if age is empty
	    if(isset($_POST['Reg_Age'])){
	        $age = trim($_POST['Reg_Age']);
	    }

	    // Check if gender is empty
	    if(isset($_POST['Reg_Gender'])){
	        $gender = trim($_POST['Reg_Gender']);
	    }

	    // Check if location is empty
	    if(isset($_POST['Reg_Location'])){
	        $location = trim($_POST['Reg_Location']);
	    }

	    // Check if location is empty
	    if(isset($_POST['Reg_Location'])){
	        $location = trim($_POST['Reg_Location']);
	    }

	    // Check if Icon is empty
	    if(isset($_FILES['Reg_Icon'])){
	        $file_name = $_FILES['Reg_Icon']['name'];
			$tmp_dir = $_FILES['Reg_Icon']['tmp_name'];
	    } else {
	    	die(" Upload of file failed! ");
	    }	


	    // Check if the username exists
	    $sqlConn = new SQLConnector();

	    // Execute the Query
	    $sqlConn->Execute("SELECT username FROM players WHERE username = '$username' LIMIT 1");

	    if( $sqlConn->GetNumRows() > 0){
	    	// Username exists 
	    	$usernameError = "User already exists!";
	    } else {

		    // Name the Users Icon after them
		    $userIcon = $username . "_Icon_" . $file_name;

		    // Append the uploads folder
		    $userIcon = "uploads/" . $userIcon;

		    // Hash the password
		    $password = password_hash($password, PASSWORD_DEFAULT);

		    // Prepare a insert statement
	        $sql = "INSERT INTO players (Username, Password, FirstName, LastName, Age, Gender, Location, icon) VALUES ('$username', '$password', '$firstname', '$lastname', $age, '$gender', '$location', '$userIcon');" ;
	        
	        // Get the connector
	        $sqlConn = new SQLConnector();

		    // Execute the Query
		    $sqlConn->Execute($sql);
			
	    	// User has registered!
		    //set permissible file types
		    if(preg_match('/(gif|jpe?g|png)$/i', $file_name))
		    {
		        move_uploaded_file($tmp_dir, $userIcon);
		    } 

			echo "Registration Completed!";

			// Start the session as their Username
		    session_start();
		    $_SESSION['username'] = $username;   

		    // Forward the Browser to the game page   
		    header("location: game.php");

		    CloseConnection();
		}
	}  // End Registration Handler

}// End POST Method

?>

<!DOCTYPE html>
<html lang="en">
<style>

</style>
	<head>
		<title> Picross - Team 20</title>
		<!-- Import Utilities.js first, as GameLogic.js uses functions from within it -->
		<script type="text/javascript" src="js/Utilities.js"></script>
		<script type="text/javascript" src="js/jquery-3.3.1.min.js" ></script>
		<script type="text/javascript" src="js/Login.js"></script>
		<link rel="stylesheet" type="text/css" href="css/PicrossStyle.css">
		<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="css/Animations.css">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet"> 
	</head>
	<body class="bgc_background">
		<div id="TopContainer" class="container-fluid rounded">
			<div id="TopRow" class="row align-items-center">
				<div class="col-lg-2"> </div>
				<div id="TitleDiv" class="col-lg-8 bgc_foreground fgc_lightblue rounded pl-0 pr-0 ">	
					<div class="container-fluid bgc_primary4 pb-4 rounded">
						<div class="col-12"> 
							<center>
								<h1> Team 20's Picross Game </h1> 
								<h3> written by David Yates & Zachary Scott </h3>					
							</center>
						</div>					

						<!-- Navigation Container -->
						<div class="container-fluid pl-0 pr-0">
							<div class="row pt-2 "> 
								<div class="col-12"> 
									<nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg">
										<div class="collapse navbar-collapse" id="navbarNav">
											<ul class="navbar-nav">
										  		<li class="nav-item">
										    		<a class="nav-link" onclick="ShowLogin();" href="#"> <b>Login</b> </a>
										  		</li>
										  		<li class="nav-item">
										    		<a class="nav-link" onclick="ShowRegister();" href="#">Register</a>
										  		</li>
											</ul>
										</div>
									</nav>
								</div>
							</div>
						</div>
						<!-- End of Navigation Row -->


					<!-- Register Section -->
					<div id="Register" class="container bgc_primary1  hidden">
						<div class="row justify-content-center">
							<div class="col-md-5 ml-5 p-3"> 
								<div class="jumbotron">
									<form enctype="multipart/form-data" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" id="Reg_Form">
										<h3 class="fgc_black"> Register </h3>
										<div class="form-group">
										    <label for="Reg_UserName">UserName</label>
										    <input required="true" type="text" class="form-control"  name="Reg_UserName"id="Reg_UserName" placeholder="UserName">
									  	</div>
										<div class="form-group">
											<label for="Reg_InputPassword1">Password</label>
											<input required="true" type="password" class="form-control" id="Reg_InputPassword1" name="Reg_InputPassword1"placeholder="Password">
										</div>
										<div class="form-group">
											<label for="Reg_InputPassword2">Confirm Password</label>
											<input required="true" type="password" class="form-control" id="Reg_InputPassword2" name="Reg_InputPassword2"placeholder="Password">
										</div>
										<div class="form-group">
											<label for="Reg_FirstName">First Name</label>
											<input required="true" type="text" class="form-control" id="Reg_FirstName" name="Reg_FirstName" placeholder="First Name">
											</div>
										<div class="form-group">
											<label for="Reg_LastName">Last Name</label>
											<input required="true" type="text" class="form-control" id="Reg_LastName" name="Reg_LastName" placeholder="Last Name">
											</div>
										<div class="form-group">
											<label for="Reg_Age">Age</label>
											<input required="true" type="number" class="form-control" id="Reg_Age" name="Reg_Age"placeholder="Age">
										</div>
										<div class="form-group">
											<label for="Reg_Gender">Gender</label>
											<input required="true" type="text" class="form-control" name="Reg_Gender" id="Reg_Gender" placeholder="Gender">
										</div>
										<div class="form-group">
											<label for="Reg_Location">Location</label>
											<input required="true" type="text" class="form-control" id="Reg_Location" name="Reg_Location"placeholder="Location">
										</div>
										<div class="form-group">
											<label for="Reg_Icon">Icon</label>
											<input required="true" type="file" class="form-control-file" id="Reg_Icon" name="Reg_Icon">
										</div>
									  	<button onclick="ProcessRegistration();" type="button" class="btn btn-success">Register</button>
									</form>
								</div>
							</div>							
						</div>
					</div>
					<!-- End of Register Section -->

					<!-- Login Section -->
					<div id="Login" class="container bgc_primary1">
						<div class="row justify-content-center">
							<div class="col-md-5 ml-5 p-3"> 
								<div class="jumbotron">
									<form enctype="multipart/form-data" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" id="Log_Form">
										<span class="text-danger"> <?php echo $usernameError; ?> </span>
									    <span class="text-danger"> <?php echo $passwordError; ?> </span>
										<h3 class="fgc_black"> Login</h3>
										<div class="form-group">
										    <label for="InputUsername">UserName</label>
										    <input required="true" type="text" class="form-control" id="Log_UserName" name="Log_UserName" placeholder="UserName" value="<?php if (empty($usernameError)) { echo $username; } ?>">
										  </div>
										  <div class="form-group">
										    <label for="InputPassword">Password</label>
										    <input required="true" type="password" class="form-control" id="Log_PassWord" name="Log_PassWord" placeholder="Password">
										  </div>
										  <button onclick="ProcessLogin()" type="button" class="btn btn-success">Login</button>
										  	<button onclick="ToggleLoginRegister()" type="button" class="btn btn-primary">Register</button>
									</form>
								</div>
							</div>							
						</div>
					</div>
					<!-- End of Login Section -->


				</div> 
				<!-- End of TitleDiv --> 
				<div class="col-lg-2"> </div>
			</div> 
			<!-- End of row div -->
		</div>
		<!-- End of Main Container -->
	</body>
</html>