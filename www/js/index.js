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
        $('#taskList').append("<li>"+tasks[i].Task+"</li>");
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
    var newTask = {};
    newTask.Task = tasktext;
    Backendless.Data.of("Tasks").save(newTask).then(saved).catch(error); 
    
}
