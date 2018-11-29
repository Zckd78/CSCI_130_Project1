
// Javascript File to handle Login Page logic.

function ShowRegister(){
	$('#Register').slideDown(); 
	$('#Login').slideUp();
}

function ShowLogin(){
	$('#Register').slideUp(); 
	$('#Login').slideDown();
}

function ToggleLoginRegister(){
	// Slide Toggle both sections
	$('#Register').slideToggle(); 
	$('#Login').slideToggle();
}


function serverReply(){
    // Only continue if the response was finished, and returned code 200 for OK
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {      
            console.log(httpRequest.responseText);
        }
    }
}

function ProcessLogin(){

	var username = document.getElementById("Log_UserName");
	var password = document.getElementById("Log_PassWord");

	if(username.value == ""){
		username.classList.add("border-danger");
		alert("Please enter a username. I mean, really? You need to be reminded to do this?");
		return;
	}

	if(password.value == ""){
		password.classList.add("border-danger");
		alert("Please enter a password. The password isn't [blank], I promise.");
		return;
	}

	// Remove the already appended Registration form child if found
	if(document.getElementsByName("RegistrationSubmit").length > 0){
		var input = document.getElementsByName("RegistrationSubmit");
		input.remove();
	}

	// Add the Registration Submit input
	var regFormInput = document.createElement("input");
	regFormInput.type = "hidden";
	regFormInput.name = "LoginSubmit";
	document.getElementById("Log_Form").appendChild(regFormInput);
	

	document.getElementById("Log_Form").submit();

}

function ProcessRegistration(){

	// Get our DOM vars
	var username = document.getElementById("Reg_UserName");
	var password1 = document.getElementById("Reg_InputPassword1");
	var password2 = document.getElementById("Reg_InputPassword2");

	if(password1.value != password2.value){
		password1.classList.add("border-danger");
		password2.classList.add("border-danger");
		alert("The passwords do not match!");
	} else {

		if(password1.classList.contains("border-danger")){
			password1.classList.remove("border-danger");
			password2.classList.remove("border-danger");
		}

		// Add the Registration Submit input
		var regFormInput = document.createElement("input");
		regFormInput.type = "hidden";
		regFormInput.name = "RegistrationSubmit";
		document.getElementById("Reg_Form").appendChild(regFormInput);

		// Submit the form
		document.getElementById("Reg_Form").submit();

	}

	/*
		Retired the JSON way of sending.

	// Continue collecting DOM elements
	var firstname = document.getElementById("Reg_FirstName");
	var lastname = document.getElementById("Reg_LastName");
	var gender = document.getElementById("Reg_Gender");
	var age = document.getElementById("Reg_Age");
	var location = document.getElementById("Reg_Location");

	// Create the JSON object
	jsonData = {
		"RegistrationSubmit": true,
		"UserName": username.value,
		"Password": password1.value,
		"FirstName": firstname.value,
		"LastName": lastname.value,
		"Age": age.value,
		"Gender":gender.value,
		"Location":location.value
	}

	console.log("Sending JSON for registration.");
	console.log(jsonData);
	
	MakeJSONRequest("POST", "Authentication.php", jsonData, serverReply);
	*/


}


