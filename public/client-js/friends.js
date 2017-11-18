/*Note, LISTID values must match html "container list's id".
ex) id of 'friend list container' must equal LISTID.friends*/
var LISTID = {
    friends: "friends-list", //id of friend's list container
    friend_requests: "friend-requests-list", //id of friend requests list container
    pending_friends: "pending-friends-list", //id of pending friends list container
  };

//Adds user to right list-container based on 'list_id': {friends-list, friend_requests-list, pending-friends-list}
var add_user_to_container = function(list_id, user){
    var attachment; //Attachment that goes right besides their name, ie) btns: Remove/Accept/Reject...
    switch(list_id){
        case LISTID.friends:
            attachment = `<button type="button" class="btn btn-outline-danger btn-sm btn_remove_friend">Remove</button>`;
            break;
        case LISTID.friend_requests:
            attachment = `<button type="button" class="btn btn-outline-success btn-sm btn_accept_friend_request">Accept</button>
                            <button type="button" class="btn btn-outline-danger btn-sm btn_reject_friend_request">Reject</button>`;
            break;
        case LISTID.pending_friends:
            attachment = `<button type="button" class="btn btn-outline-danger btn-sm btn_remove_pending">Remove</button>`;
            break;
        default:
            alert("Error: Check switch/case for attachment");
    }
    var user_name = user.firstName + " " + user.lastName;
    var user_id = user._id;
    $(`#${list_id}`).append(
        `<li class="list-group-item d-flex justify-content-between list_row" data-user-id="${user_id}">
        <a href="/discover/profile/${user_id}">${user_name}</a>
        <div>
            ${attachment}
        </div>
        </li>`
    );
};

//Load friends list, pending fl, and blocked users
var load_list = function(list_id){
    var get_url;
    switch(list_id){
        case LISTID.friends: get_url = "/friends/get-friends-list"; break;
        case LISTID.friend_requests: get_url = "/friends/get-friend-requests-list"; break;
        case LISTID.pending_friends: get_url = "/friends/get-pending-friends-list"; break;
        default: alert("Switch/case error: Check load_list function");
    }

    $.ajax({
        url: get_url,
        data: {},
        dataType: "json",
        type: "GET"
    }).done(function(json){
        for(var i=0; i<json.length; ++i){
            add_user_to_container(list_id, json[i]);
        }
        $(`#header-${list_id} > span`).text(json.length);
    }).fail(function(){
        alert("Failed to retrieve " + list_id + " from database");   
    });
};

var set_remove_friend_response = function(){
    $(`#${LISTID.friends}`).on("click", ".btn_remove_friend", function(){
        //Add to database for both users
        var select_user_id = $(this).parent().parent().attr("data-user-id")
        $.ajax({
            url:"/friends/remove-friend",
            data:{
                select_user_id: select_user_id
            },
            dataType:"json",
            type:"PATCH"
        }).fail(function(){
            alert("Failed to add friend to database!!");
        });
        //Now update the screen by removing the accepted user
        $(this).parent().parent().remove();
        //Update count
        var count = $("#friends_count_badge").text();
        $("#friends_count_badge").text(--count);

        socket.emit('notify', {
            self_id: self_id,
            select_user_id: select_user_id,
            type: NOTIFY_TYPE.remove_friend,
            msg: "Friend removed you: " + self_name
        });
    });
};

var set_accept_friend_request_response = function(){
    $(`#${LISTID.friend_requests}`).on("click", ".btn_accept_friend_request", function(){
        var select_user_id = $(this).parent().parent().attr("data-user-id");
        $(this).parent().parent().remove();
        //Add to database for both users
        $.ajax({
            url:"/friends/add-friend",
            data:{
                select_user_id: select_user_id
            },
            dataType:"json",
            type:"PATCH"
        }).done(function(user){
            //Update count
            var friend_requests_count = $("#friend_requests_count_badge").text();
            $("#friend_requests_count_badge").text(--friend_requests_count);
            var friends_count = $("#friends_count_badge").text();
            $("#friends_count_badge").text(++friends_count);

            //Update user's screen
            add_user_to_container(LISTID.friends, user);

            //If selected user is in pending list as well, remove that too
            var return_removal = $(`#pending-friends-list > li[data-user-id='${select_user_id}']`).remove();
            if(return_removal.length != 0){
                var pending_friends_count = $("#pending_friends_count_badge").text();
                $("#pending_friends_count_badge").text(--pending_friends_count);
            }

            //Now notify other user
            socket.emit('notify', {
                self_id: self_id,
                select_user_id: select_user_id,
                type: NOTIFY_TYPE.accept_friend,
                msg: "Friend Accepted: " + self_name
            });
        }).fail(function(){
            alert("Failed to add friend to database!!");
        });
        
    });
};

var set_reject_friend_request_response = function(){
    $(`#${LISTID.friend_requests}`).on("click", ".btn_reject_friend_request", function(){
        //Update pendingFriend and requestFriend to database for both users
        var select_user_id = $(this).parent().parent().attr("data-user-id");
        $(this).parent().parent().remove();
        $.ajax({
            url:"/friends/reject-friend-request",
            data:{
                select_user_id: select_user_id
            },
            dataType:"json",
            type:"PATCH"
        }).done(function(){
            //Update count
            var count = $("#friend_requests_count_badge").text();
            $("#friend_requests_count_badge").text(--count);

            //If selected user is in pending list as well, remove that too
            var return_removal = $(`#pending-friends-list > li[data-user-id='${select_user_id}']`).remove();
            if(return_removal.length != 0){
                var pending_friends_count = $("#pending_friends_count_badge").text();
                $("#pending_friends_count_badge").text(--pending_friends_count);
            }

            //Now notify other user
            socket.emit('notify', {
                self_id: self_id,
                select_user_id: select_user_id,
                type: NOTIFY_TYPE.reject_friend,
                msg: "Friend Rejected: " + self_name
            });
        }).fail(function(){
            alert("Failed to update reject friend request for database!!");
        });
    });
};

var set_remove_pending_friend_response = function(){
    $(`#${LISTID.pending_friends}`).on("click", ".btn_remove_pending", function(){
        //Update pendingFriend and requestFriend to database for both users
        var select_user_id = $(this).parent().parent().attr("data-user-id");
        $(this).parent().parent().remove();
        $.ajax({
            url:"/friends/remove-pending-friend",
            data:{
                select_user_id: select_user_id
            },
            dataType:"json",
            type:"PATCH"
        }).done(function(){
            //Now update the screen by removing the accepted user
            $(this).parent().parent().remove();
            //Update count
            var count = $("#pending_friends_count_badge").text();
            $("#pending_friends_count_badge").text(--count);

            //Now notify other user
            socket.emit('notify', {
                self_id: self_id,
                select_user_id: select_user_id,
                type: NOTIFY_TYPE.remove_pending,
                msg: "Friend request cancelled: " + self_name
            });
        }).fail(function(){
            alert("Failed to update reject friend request for database!!");
        });
        
    });
};

var main = function(){
    load_list(LISTID.friends);
    load_list(LISTID.friend_requests);
    load_list(LISTID.pending_friends);

    set_remove_friend_response();
    set_accept_friend_request_response();
    set_remove_pending_friend_response();
    set_reject_friend_request_response();
};

$(document).ready(function(){
    main();
});
