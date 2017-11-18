/*NOTE: These are from the perspective of the person doing the action
ex) remove_pending
User 1: remove_pending  ie) User 1 is cancelling friend request
User 2: Means other person withdrew friend request

Using this to try to update friend list in real time.
*/
var NOTIFY_TYPE = {
    add_pending: 0,
    remove_pending: 1,
    accept_friend: 2,
    reject_friend: 3,
    remove_friend: 4
}

//Setup for toast
function show_toast() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar")

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
} 

$(document.body).append(`<div id="snackbar"></div>`);

//Load the badge number for notification using database
$.ajax({
    url: "/notifications/get-unread-count",
    data: {},
    type: "GET",
    dataType: "json"
}).done(function(json){
    $("#notification_badge").text(json.count);
});


//Set the socket to listen for notifications
var socket = io();
socket.emit("on_connect", self_id );
socket.on('notify', function(data){
    //Update notification badge count
    var notification_badge = $("#notification_badge");
    var count = notification_badge.text();
    notification_badge.text(++count);
    notification_badge.fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);

    //Show toast
    $("#snackbar").text(data.msg)
    show_toast();
});

