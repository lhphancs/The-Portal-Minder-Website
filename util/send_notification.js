function send_notification(from_id, msg) {
    if (!req.user) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = {
    require_login
}