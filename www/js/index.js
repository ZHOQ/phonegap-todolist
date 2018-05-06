var latitude, longitude, nowposition, whereClause, queryBuilder, username;


var APPLICATION_ID = 'C53D7B11-1C15-6058-FF51-7ACFFE97EF00';
var API_KEY = '7517A5E0-1DCB-4526-FF91-58DC6C2AFE00';
Backendless.serverURL = "https://api.backendless.com";
Backendless.initApp(APPLICATION_ID, API_KEY);

if (!APPLICATION_ID || !API_KEY)
    alert("Missing application ID or api key arguments. Login to Backendless Console, select your app and get the ID and key from the Manage > App Settings screen. Copy/paste the values into the Backendless.initApp call located in Todolist-Login.js");
$(document).on("pageshow","#todopage", onPageShow);


function processResults(tasks) {
    //display the first task in an array of tasks. 
    //alert(tasks[0].Task);
    
    //wipe the list clean
    $('#taskList').empty();
    //add each tasks
    
    console.log("now position" + nowposition);
    for (var i = 0; i < tasks.length; i++) { 
        if( tasks[i].PositionID == nowposition){
            var unixtime = new Date(tasks[i].Deadline);
            var date = unixtime.toDateString();
        
            $('#taskList').append("<button  id="+i+" value= '"+i+"' class='ui-btn ui-corner-all ui-shadow w3-block' >"+tasks[i].Task+" end at: "+date+"</button><br>");
            if(tasks[i].State == 0){
                $('#'+i).css('color', 'black');
            }
            if(tasks[i].State == 1){
                $('#'+i).css('color', 'gray');
            }
        //$('#taskList').on("tap",'button',function(){
            // alert("Stop tapping!");
         //   var n = $(this).val();
         //   $(this).css('color', 'red');
        //}); 	
        $('#taskList').on("swipeleft",'button',function(){
            var n = $(this).val();
            var updateTasks = {
                objectId:tasks[n].objectId,
                Task:tasks[n].Task,
                Deadline:tasks[n].Deadline,
                PositionID:tasks[n].PositionID,
                State:1}
            $(this).css('color', 'gray');
           Backendless.Data.of( "TASKS" ).save(updateTasks).then(saved).catch(error);
        });   
        $('#taskList').on("swiperight",'button',function(){
            var n = $(this).val();
            var updateTasks = {
                objectId:tasks[n].objectId,
                State:0}
            $(this).css('color', 'black');
            Backendless.Data.of( "TASKS" ).save(updateTasks).then(saved).catch(error);
        });
        }
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
//    if(nowposition != null)
//    {Backendless.Data.of("TASKS").find().then(processResults).catch(error);}

   
	console.log("page shown");
    
                       

 
} 

$(document).on("pageshow","#createpage", onCreatePageShow);

function onCreatePageShow() {
    
    Backendless.Data.of("POSITION").find(queryBuilder).then(processPositionResults).catch(error);
	console.log("page shown");
}

function processPositionResults(position) {
    //display the first task in an array of position. 
     $('#addPosition').empty();
    //alert(position[0].PositionName);
    //add each position

    for (var i = 0; i < position.length; i++) { 
        $("#addPosition").append("<option value='"+position[i].objectId+"'>"+position[i].PositionName+"</option>");
        //refresh the listview
        console.log(position[i].objectId);
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
    newTask.PositionID = position;
    newTask.State = 0;
    console.log("user is "+ username);
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
    latitude = $('#lattext').val();
    longitude = $('#longtext').val();
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
    Backendless.Data.of("POSITION").find(queryBuilder).then(changeHeader).catch(error);

	
}


function changeHeader(position){
    //   alert("changeHeader " + longitude);
     //alert(position[0].PositionName);
        Backendless.UserService.getCurrentUser()
            .then( function( currentUser ) {
            whereClause = "ownerId = '"+currentUser.objectId+"'" ;  
            queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause( whereClause );
        })
            .catch( function ( error ) {
            
        });
   
        for (var i = 0; i < position.length; i++) {       
        if ((Math.abs(latitude - position[i].Latitude) <=0.002) && ((Math.abs(longitude - position[i].Longitude) <=0.002)))
        {
            document.getElementById("header").innerHTML = position[i].PositionName;
            nowposition = position[i].objectId;
            console.log("I am here " + position[i].PositionName + nowposition);
            Backendless.Data.of("TASKS").find(queryBuilder).then(processResults).catch(error);   
        
        }
        else
        {console.log("Not in " + position[i].PositionName);}
    }
}

//called if the position is not obtained correctly
function failHomepagePosition(error) {
      alert("failHomepagePosition");
	
}
