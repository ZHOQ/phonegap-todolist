//when the jQuery Mobile page is initialised
$(document).on('pageinit', function() {
	
	//set up listener for button click
	$(document).on('click', getPosition);
	
	
});

var APPLICATION_ID = 'C53D7B11-1C15-6058-FF51-7ACFFE97EF00';
var API_KEY = '7517A5E0-1DCB-4526-FF91-58DC6C2AFE00';

Backendless.initApp(APPLICATION_ID, API_KEY);
$(document).on("pageshow","#todopage", onPageShow);

function processResults(tasks) {
    //display the first task in an array of tasks. 
    alert(tasks[0].Task);
    alert(tasks[1].Task);
    //wipe the list clean
    $('#taskList').empty();
    //add each tasks
    
    for (var i = 0; i < tasks.length; i++) { 

        $('#taskList').append("<li>"+tasks[i].Task+" end at: "+tasks[i].Deadline+"</li>");
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
    Backendless.Data.of("TASKS").find().then(processResults).catch(error);
	console.log("page shown");
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
	var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;


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