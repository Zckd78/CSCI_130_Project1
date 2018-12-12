<?php 
	
require_once 'Database.php';

// Initialize the session
session_start();
// Redirect to login page if session is not set
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: index.php");
  exit;
}

// Local vars
$username = $_SESSION['username'];
$firstname = "";
$icon = "";


// Create a Database Object
$sqlConn = new SQLConnector();

// Execute the Query
$sqlConn->Execute("SELECT username, firstname, icon FROM players WHERE username = '$username' LIMIT 1");

$results = $sqlConn->GetResults();

// Proceed when rows > 0
if( $sqlConn->GetNumRows() > 0){
	
	// Get the first row
	$result = $sqlConn->FetchRow(0);

	// Set vars
	$firstname = $result['firstname'];
	$icon = $result['icon'];

} else {
	echo "Could not find rows!";
}


?>


<!DOCTYPE html>
<html lang="en">
<style>

</style>
	<head>
		<title> Picross - Team 20</title>
		<!-- Import Utilities.js first, as GameLogic.js uses functions from within it -->
		<script type="text/javascript" src="js/Utilities.js"></script>
		<script type="text/javascript" src="js/GameLogic.js"></script>
		<script type="text/javascript" src="js/jquery-3.3.1.min.js" ></script>
		<link rel="stylesheet" type="text/css" href="css/PicrossStyle.css">
		<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="css/Animations.css">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet"> 
	</head>
	<body class="bgc_background">
		<div id="TopContainer" class="container-fluid rounded">
			<div id="TopRow" class="row align-items-center">
				<div class="col-lg-1"> </div>
				<div id="TitleDiv" class="col-10 bgc_foreground fgc_lightblue rounded pl-0 pr-0 ">	
					<div class="container-fluid bgc_primary4 pb-4 rounded">						
						<div class="row">
							<div class="col-3"> </div>
							<div class="col-6"> 
								<header>
									<center>
										<h1> Team 20's Picross Game </h1> 
										<h3> written by David Yates & Zachary Scott </h3>					
									</center>
								</header>
							</div>
							<div class="col-3">
								<!-- User Area -->
								<div class="container">
									<div class="row">
										<div class="col-8 col-md-6"></div>
										<div class="col-4 col-md-6 bgc_primary1 rounded shadow-lg">
											<center>
												<b><?php echo $_SESSION['username']; ?></b> 
												<img style="height: 65px; width: 65px;" src="<?php echo $icon; ?>">
												<form enctype="multipart/form-data" id="logoutForm" action="logout.php" method="post">
													<input type="hidden" name="logout" value="true">
													<a href="#" value="" onclick="Logout()" class="text-danger">
														Logout
													</a>
												</form>											
											</center>
										</div>

									</div>
								</div>
							</div>
						</div>
						
						<!-- Navigation Container -->
						<div class="container-fluid pl-0 pr-0">
							<div class="row pt-2 "> 
								<div class="col-12"> 
									<nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg">
										<div class="collapse navbar-collapse" id="navbarNav">
											<ul class="navbar-nav">
										  		<li class="nav-item">
										    		<a class="nav-link" onclick="GameClick()" href="#"> Play Picross </a>
										  		</li>
										  		<li class="nav-item">
										    		<a class="nav-link" onclick="HowToClick()" href="#">How to Play</a>
										  		</li>
										  		<li class="nav-item">
										    		<a class="nav-link" onclick="RequestLeaderBoard()" href="#">Leaderboard</a>
										  		</li>
										  		<li class="nav-item">
										    		<a class="nav-link" onclick="AboutClick()" href="#">About Us</a>
										  		</li>
											</ul>
										</div>
									</nav>
								</div>
							</div>
						</div>
						<!-- End of Navigation Row -->

						<!-- This Div below is used for Pre-Game choices -->
						<div id="PreGame_Selections" class="container-fluid bgc_primary1 rounded pt-2">
							<div class="row">
								<div id="setupHint"  class="col-12 hidden p-4">
									<div class="card">
										<div class="card-header fgc_black bg-danger"> Select at least the size and mode to play before beginning. </div>
									</div>
								</div>
							</div>
							<div class="row justify-content-center p-1">
								<div class="col-5 col-md-4">
									<!-- Color Selection -->
									<div class="form-group form-check-inline">
										<label class="form-check-label pr-2" for="color_select_pixel">Pixel Color</label> <br>
										<div class="pixel_small bgc_pix0 pixel_border hover_select" name="color_select_pixel" onclick="UpdatePixelColor(this);"> </div>
										<div class="pixel_small bgc_pix1 pixel_border" name="color_select_pixel" onclick="UpdatePixelColor(this);"> </div>
										<div class="pixel_small bgc_pix2 pixel_border" name="color_select_pixel" onclick="UpdatePixelColor(this);"> </div>
										<div class="pixel_small bgc_pix3 pixel_border" name="color_select_pixel" onclick="UpdatePixelColor(this);"> </div>
										<div class="pixel_small bgc_pix4 pixel_border" name="color_select_pixel" onclick="UpdatePixelColor(this);"> </div>
									</div>
									<div class="form-group form-check-inline">
										<label class="form-check-label pr-2" for="color_select_grid">Grid Color</label> <br>
										<div class="pixel_small bgc_grid0 pixel_border hover_select" name="color_select_grid" onclick="UpdateGridColor(this);"> </div>
										<div class="pixel_small bgc_grid1 pixel_border" name="color_select_grid" onclick="UpdateGridColor(this);"> </div>
										<div class="pixel_small bgc_grid2 pixel_border" name="color_select_grid" onclick="UpdateGridColor(this);"> </div>
										<div class="pixel_small bgc_grid3 pixel_border" name="color_select_grid" onclick="UpdateGridColor(this);"> </div>
										<div class="pixel_small bgc_grid4 pixel_border" name="color_select_grid" onclick="UpdateGridColor(this);"> </div>
									</div>
									<!-- End Color selection -->
								</div>
								<div class="col-2"> 
									<!-- Grid Size Selection -->
									<div class="form-group"> 
										<label> Choose a grid size:  </label> <br>
										<input class="btn btn-secondary" id="size7Btn" type="button" value="7x7" onclick="setSize(7);">
										<input class="btn btn-secondary" id="size13Btn" type="button" value="13x13" onclick="setSize(13)">
									</div>									
								</div>
								<div class="col-3"> 
									<div class="form-group"> 
									<label> Choose a game mode:  </label> <br>
									<input class="btn btn-secondary" id="arcadeBtn" type="button" value="Arcade" onclick="setGameMode(0)">
									<input class="btn btn-secondary" id="attackBtn" type="button" value="Time-Attack" onclick="setGameMode(1)">
									</div>
								</div>
								<div class="col-2"> 
									<div class="form-group"> 
									<label> Start the game?  </label> <br>
									<input class="btn btn-success" type="button" value="Start!" onclick="tryStartGame();">
									</div>
								</div>
							</div>
						</div>
					</div>
					<!-- End of the PreGame choices -->

					<!-- Beginning of the Game stage -->
					<div id="GameContainer" class="container hidden mt-4">
						<div class="row"  style="margin-bottom: 30px;">
							<div class="col-1"> </div>
							<div class="col-3 justify-content-center">
								<div class="jumbotron p-4">
									<h1 class="fgc_black"> Level: <span id="val_level"></span> </h1>
									<ul class="list-group">
										<!-- Adding spans with ids to tap into for updating during the game -->
										<li class="list-group-item status" >Timer: <span id="val_timer" class="StatusText">0</span></li>
										<li class="list-group-item status" >Elements: <span id="val_elements" class="StatusText">0</span></li>
										<li class="list-group-item status" >Turns: <span id="val_turns" class="StatusText">0</span></li>
										<li class="list-group-item status" >Errors: <span id="val_errors" class="StatusText">0</span></li>
										<li class="list-group-item status" >Score: <span id="val_score" class="StatusText">0</span></li>
									</ul>
									<br>
									<div class="form-group"> 
										<input class="btn btn-lg btn-info" id="btn_suggest" type="button" value="Make Suggestion" onclick="suggestMove();">
									</div>
								</div>
							</div>
							<div id="GameDiv" class="col-8"> 
								<!-- The game table, propogated by javascript -->
								<center>
									<table id="GameTable" class="bgc_white"></table>
								</center>
							</div>
							
						</div>
					</div> 
					<!-- End of GameContainer -->

					<!-- Game Information -->
					<div id="GameInfo" class="container hidden justify-content-center">
						<div class="row">
							<div class="col-md-5 p-4"> 
								<p>
									Nonograms, also known as Picross or Griddlers, are picture logic puzzles in which cells in a grid must be colored or left blank according to numbers at the side of the grid to reveal a hidden picture. 
									<br> <br> In this puzzle type, the numbers are a form of discrete tomography that measures how many unbroken lines of filled-in squares there are in any given row or column. For example, a clue of "4 8 3" would mean there are sets of four, eight, and three filled squares, in that order, with at least one blank square between successive groups. 
									<br> <br> In this version, you can select the color of the unmarked grid blocks (Grid Color), and the color of correctly chosen blocks (Pixel Color). The color of incorrect blocks is always Red.
								</p>
							</div>
							<div class="col-md-7 justify-content-center">
								<img src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Nonogram_wiki.svg" height="90%" width="100%">
								<h6 class="ml-5 pt-1"> Example of a completed Nonogram puzzle </h6>
							</div>
						</div>
					</div>
					<!-- End of Game Information section -->


					<!-- About Us Information -->
					<div id="DevInfo" class="hidden pt-2">
						<div class="container justify-content-center">
							<center>
								<h1> About Us</h1>
							</center>
							<div class="row">
								<!-- Zack -->
								<div class="col-md-6">
									<center>
										<h3>
											Zachary Scott
										</h3>
									</center>
									<p>
										A Fresno native with a passion for technology, Zachary began his journey at the now defunct Heald College. From humble beginnings of delivering pizzas back in 2009, to being a Site Reliabilty Engineer today, started when he enrolled in a visual basic programming class at Heald. He became fascinated by what was possible through code. In 2011, after graduating Heald with an Associates Degree, he landed an intership, which ultimately turned into a job at Decade Software Company. Zack quickly began teaching myself how to code in C# and C++ through online videos and tutorials in his spare time. After writing a program to automate a once manual program compilation process, he was promoted from Quality Assurance to Junior Developer. There, amongst veteran programmers, he quickly became immersed in production software engineering. A wise Development Manager told him that in order to be taken seriously in the industry, he would need to obtain a B.S. of Computer Science. Taking this advice, Zack transferred his Associates Degree to Fresno State in 2016, and now 2 years later is set to graduate. 
									</p>
								</div>
								<!-- END Zack Section -->

								<!-- David -->
								<div class="col-md-6">
									<center>
										<h3>
											David Yates
										</h3>
									</center>
										<p>
											Another Fresno native (and American native!) who was booted out from the cold workforce of the callcenter back in 2011.  Though promoted through the ranks while there, it had given him no useful skills other than customer service and a lot of patience.  Knowing he could do better, he reaffirmed himself to completing a Computer Science Degree at Fresno State University, while working odd jobs along the way.  Learning skills in odd trades like AutoCAD, Architecture and computer building and hardware, David gained knowledge while churning through school.  Set to graduate this year, David Yates has built up more fruitful Computer Science skills such as languages like C# and C++, as well as gaining an understanding of the software development work-environment.  At this point in his life, he is at a crossroads in determining whether or not to continue towards a Masters in a field he has discovered much he is in connection with, or to start the ever-growing competition that was a fulfilling career in software development.
										</p>
								</div>
								<!-- END David Section -->
							</div>
						</div>
					</div>
					<!-- End of About Us section -->

					<!-- Leaderboard Section -->
					<div id="Leaderboard" class="container hidden justify-content-center pt-3">
						<!-- Selecting the size and order -->
						<div class="row">
							<div class="col-1"></div>
							<div class="col-2 col-md-2"> 
								<div class="form-group"> 
									<label> Grid size:  </label> <br>
									<input class="btn btn-dark" id="LeadBtnsize7" type="button" value="7x7" onclick="ChangeLeaderBoardList(7);">
									<input class="btn btn-secondary" id="LeadBtnsize13" type="button" value="13x13" onclick="ChangeLeaderBoardList(13)">
								</div>									
							</div>
							<div class="col-3 col-md-3"> 
								<div class="form-group"> 
									<label> Order of Results:</label> <br>
									<input class="btn btn-dark" id="LeadBtnscore" type="button" value="By Score" onclick="ChangeLeaderBoardOrder('score');">
									<input class="btn btn-secondary" id="LeadBtntime" type="button" value="By Time" onclick="ChangeLeaderBoardOrder('duration')">
								</div>									
							</div>
							<div class="col-3 col-md-3"> 
								<div class="form-group"> 
									<label> Order Direction:  </label> <br>
									<input class="btn btn-dark" id="ascLeadBtn" type="button" value="Ascending" onclick="ChangeLeaderBoardDirection('asc');">
									<input class="btn btn-secondary" id="descLeadBtn" type="button" value="Decending" onclick="ChangeLeaderBoardDirection('desc')">
								</div>									
							</div>
							<div class="col-1 col-md-1"> 
								<br>								
								<div class="form-group"> 
									<input class="btn btn-info" id="ascLeadBtn" type="button" value="Refresh" onclick="RequestLeaderBoard()">									
								</div>									
							</div>
						</div>
						<!-- The Leaderboard Table -->
						<div class="row pt-4">
							<div class="col-1"></div>
							<div class="col-10 "> 
								<table class="table table-striped" id="LeaderTable">
									<thead class="thead-light" >
										<tr> 
											<th scope="col"> Level # </th>
											<th scope="col"> Username </th>
											<th scope="col"> Duration </th>
											<th scope="col"> Score </th>
										</tr>
									</thead>
									<tbody id="LeaderTableBody">
										
									</tbody>
								</table>							
							</div>
							<div class="col-1"></div>
						</div>

					</div>
					<!-- End of Leaderboard section -->

				</div> 
				<!-- End of TitleDiv --> 
				<div class="col-lg-1"> </div>
			</div> 
			<!-- End of row div -->
		</div>
		<!-- End of Main Container -->
	</body>
</html>