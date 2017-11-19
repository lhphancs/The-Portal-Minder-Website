var TOAST_TYPE = {
    admin: 0,
    notification: 1
}

// ########## START Setup for toast ##########
function show_toast(toast_type, msg) {
    var toast_id = toast_type === TOAST_TYPE.admin?"admin_snackbar":"snackbar";
    $(`#${toast_id}`).text(msg);

    // Get the snackbar DIV
    var x = document.getElementById(toast_id)

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
} 

$(document.body).append(`<div id="snackbar"></div>`);
$(document.body).append(`<div id="admin_snackbar"></div>`);
// ########## End Setup for toast ##########

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
    notification_badge.fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);

    //Show toast
    show_toast(TOAST_TYPE.notification, data.msg);

    //Now handle page specific stuff
    switch(page){
        case PAGE.discover_results:
            if(data.type === NOTIFY_TYPE.accept_friend){
                //Remove box for that user
            }
            else if(data.type === NOTIFY_TYPE.reject_friend || data.type === NOTIFY_TYPE.remove_pending){
                //Set box to "add mode"
            }
            else if(data.type === NOTIFY_TYPE.remove_friend){
                //Re-add box for that user
            }
            console.log("discover_results");
            break;
        case PAGE.friends:
            if(data.type === NOTIFY_TYPE.accept_friend){
                //Add to friend, remove friend_request+pending
            }
            else if(data.type === NOTIFY_TYPE.reject_friend || data.type === NOTIFY_TYPE.remove_pending){
                //Remove friend_request+pending
            }
            else if(data.type === NOTIFY_TYPE.remove_friend){
                //Remove from friend
                console.log("friends");
            }
            else if(data.type === NOTIFY_TYPE.add_pending){
                //Add to friend request
            }
            break;
        case PAGE.chat:
            //If any chat features in future
        default:
            console.log("None");
    }
});