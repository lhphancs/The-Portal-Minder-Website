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
};

/* This is to allow for page specific socket actions */
var PAGE = {
    discover_results: 0,
    friends: 1
};