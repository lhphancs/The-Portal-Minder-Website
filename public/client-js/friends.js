//This is used to load friends list, pending fl, and blocked users
var load_list = function(info){
    $.ajax({
        url: "http://localhost:3000/friends/get-" + info,
        data: {},
        dataType: "json",
        type: "GET"
    }).done(function(json){
        $(`#header-${info} > span`).text(json.length);
        var attachment;
        switch(info){
            case "friends-list": attachment = `<button type="button" class="btn btn-outline-danger btn-sm btn_remove_friend">Remove</button>`; break;
            case "friend-requests-list":
                attachment = `<button type="button" class="btn btn-outline-success btn-sm btn_accept_friend_request">Accept</button>
                                <button type="button" class="btn btn-outline-danger btn-sm btn_reject_friend_request">Reject</button>`;
                break;
            case "pending-friends-list":
                attachment = `<button type="button" class="btn btn-outline-danger btn-sm btn_remove_pending">Remove</button>`;
                break;
            default:
                alert("Error: Check switch/case for attachment");
        }           
        for(var i=0; i<json.length; ++i){
            var name = json[i].firstName + " " + json[i].lastName;
            var user_id = json[i]._id;
            $(`#${info}`).append(
                `<li class="list-group-item d-flex justify-content-between" data-user-id="${user_id}">
                <a href="http://localhost:3000/discover/profile/${user_id}">${name}</a>
                <div>
                    ${attachment}
                </div>
                </li>`
            );
        }
    }).fail(function(){
        alert("Failed to retrieve " + info + " from database");   
    });
};

var set_remove_friend_response = function(){
    $("#friends-list").on("click", ".btn_remove_friend", function(){
        //Add to database for both users
        $.ajax({
            url:"http://localhost:3000/friends/remove-friend",
            data:{
                select_user_id: $(this).parent().parent().attr("data-user-id")
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
    });
};

var set_accept_friend_request_response = function(){
    $("#friend-requests-list").on("click", ".btn_accept_friend_request", function(){
        //Add to database for both users
        $.ajax({
            url:"http://localhost:3000/friends/add-friend",
            data:{
                select_user_id: $(this).parent().parent().attr("data-user-id")
            },
            dataType:"json",
            type:"PATCH"
        }).fail(function(){
            alert("Failed to add friend to database!!");
        });
        //Now update the screen by removing the accepted user
        $(this).parent().parent().remove();
        //Update count
        var count = $("#friend_requests_count_badge").text();
        $("#friend_requests_count_badge").text(--count);
    });
};

var set_reject_friend_request_response = function(){
    $("#friend-requests-list").on("click", ".btn_reject_friend_request", function(){
        //Update pendingFriend and requestFriend to database for both users
        $.ajax({
            url:"http://localhost:3000/friends/reject-friend-request",
            data:{
                select_user_id: $(this).parent().parent().attr("data-user-id")
            },
            dataType:"json",
            type:"PATCH"
        }).fail(function(){
            alert("Failed to update reject friend request for database!!");
        });
        //Now update the screen by removing the accepted user
        $(this).parent().parent().remove();
        //Update count
        var count = $("#friend_requests_count_badge").text();
        $("#friend_requests_count_badge").text(--count);
    });
};

var set_remove_pending_friend_response = function(){
    
    $("#pending-friends-list").on("click", ".btn_remove_pending", function(){
        //Update pendingFriend and requestFriend to database for both users
        $.ajax({
            url:"http://localhost:3000/friends/remove-pending-friend",
            data:{
                select_user_id: $(this).parent().parent().attr("data-user-id")
            },
            dataType:"json",
            type:"PATCH"
        }).fail(function(){
            alert("Failed to update reject friend request for database!!");
        });
        //Now update the screen by removing the accepted user
        $(this).parent().parent().remove();
        //Update count
        var count = $("#pending_friends_count_badge").text();
        $("#pending_friends_count_badge").text(--count);
    });
};

var main = function(){
    load_list("friends-list");
    load_list("friend-requests-list");
    load_list("pending-friends-list");

    set_remove_friend_response();
    set_accept_friend_request_response();
    set_remove_pending_friend_response();
    set_reject_friend_request_response();
};

$(document).ready(function(){
    main();
});
