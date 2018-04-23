var latitude, longitude;


//when the jQuery Mobile page is initialised
/*$(document).on('pageinit', function() {
	
	//set up listener for button click
	$(document).on("pageshow", "#todopage", homepage);
	
	
});*/

var APPLICATION_ID = 'C53D7B11-1C15-6058-FF51-7ACFFE97EF00';
var API_KEY = '7517A5E0-1DCB-4526-FF91-58DC6C2AFE00';
Backendless.serverURL = "https://api.backendless.com";
Backendless.initApp(APPLICATION_ID, API_KEY);
$(document).on("pageshow","#todopage", onPageShow);



function processResults(tasks) {
    //display the first task in an array of tasks. 
    //alert(tasks[0].Task);
    //alert(tasks[1].Task);
    //wipe the list clean
    $('#taskList').empty();
    //add each tasks

    for (var i = 0; i < tasks.length; i++) { 
        var unixtime = new Date(tasks[i].Deadline);
        var date = unixtime.toDateString();
        $('#taskList').append("<li>"+tasks[i].Task+" end at: "+date+"</li>");
        //refresh the listview
        $('#taskList').listview('refresh');
    }

}

$(document).on("click", "#addTaskButton", onAddTask);

function saved(savedTask) {
console.log( "new Contact instance has been saved" + savedTask);
}

function error(err) {
    alert(err);
}

function onPageShow() {
    getHomepagePosition();
    Backendless.Data.of("TASKS").find().then(processResults).catch(error);
	console.log("page shown");
} 

$(document).on("pageshow","#createpage", onCreatePageShow);

function onCreatePageShow() {
    Backendless.Data.of("POSITION").find().then(processPositionResults).catch(error);
	console.log("page shown");
}

function processPositionResults(position) {
    //display the first task in an array of position. 
    //alert(position[0].PositionName);
    //add each position

    for (var i = 0; i < position.length; i++) { 
        $("#addPosition").append("<option value='"+position[i].PositionName+"'>"+position[i].PositionName+"</option>");
        //refresh the listview
        
    }

}

function onAddTask() {
    console.log("add task button clicked");
    var tasktext = $('#addTaskText').val();
    var deadline = $('#addDeadline').val();
    var position = $('#addPosition').val();
    var newTask = {};
    newTask.Task = tasktext;
    newTask.Deadline = deadline;
    newTask.Position = position;
    Backendless.Data.of("Tasks").save(newTask).then(saved).catch(error); 
    
}

$(document).on("click", "#getLocationButton", getPosition);

//Call this function when you want to get the current position
function getPosition() {
	
    
    alert("getPosition");
    
	//instruct location service to get position with appropriate callbacks
	navigator.geolocation.getCurrentPosition(successPosition, failPosition);
}


//called when the position is successfully determined
function successPosition(position) {
	
    alert("successPosition " + position.coords.latitude);
	//You can find out more details about what the position obejct contains here:
	// http://www.w3schools.com/html/html5_geolocation.asp
	

	//lets get some stuff out of the position object
	//var time = position.timestamp;
	latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    latitude = latitude.toFixed(5);
    longitude = longitude.toFixed(5);
    
	//OK. Now we want to update the display with the correct values
	$('#lattext').val(latitude);
    $('#longtext').val(longitude);
	
}

//called if the position is not obtained correctly
function failPosition(error) {
      alert("failPosition");
	//change time box to show updated message
	$('#lattext').val("Error getting data: " + error);
    $('#longtext').val("Error getting data: " + error);
	
}

$(document).on("click", "#addPositionButton", onAddPosition);

function onAddPosition() {
    console.log("add position button clicked");
    var latitude = $('#lattext').val();
    var longitude = $('#longtext').val();
    var position = $('#position').val();
    var newPosition = {};
    newPosition.PositionName = position;
    newPosition.Latitude = latitude;
    newPosition.Longitude = longitude;
    Backendless.Data.of("Position").save(newPosition).then(saved).catch(error); 
    
}


//Call this function when you want to get the current position
function getHomepagePosition() {
	
    
    //alert("getHomepagePosition");
    
	//instruct location service to get position with appropriate callbacks
	navigator.geolocation.getCurrentPosition(successHomepagePosition, failHomepagePosition);
}


//called when the position is successfully determined
function successHomepagePosition(positions) {
	

	//You can find out more details about what the position obejct contains here:
	// http://www.w3schools.com/html/html5_geolocation.asp
	//alert("successPosition " + positions.coords.latitude);

	//lets get some stuff out of the position object
	//var time = position.timestamp;
	 latitude = positions.coords.latitude;
     longitude = positions.coords.longitude;
    latitude = latitude.toFixed(5);
    longitude = longitude.toFixed(5);
    Backendless.Data.of("POSITION").find().then(changeHeader).catch(error);

	
}


function changeHeader(position){
    //   alert("changeHeader " + longitude);
     //alert(position[0].PositionName);
        for (var i = 0; i < position.length; i++) {       
        if ((Math.abs(latitude - position[i].Latitude) <=0.001) && ((Math.abs(longitude - position[i].Longitude) <=0.001)))
        {
            document.getElementById("header").innerHTML = position[i].PositionName;
            console.log("I am here " + position[i].PositionName);
        
        }
        else
        {console.log("Not in " + position[i].PositionName);}
    }
}

//called if the position is not obtained correctly
function failHomepagePosition(error) {
      alert("failHomepagePosition");
	
}