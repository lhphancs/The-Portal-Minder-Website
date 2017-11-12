function require_login(req, res, next) {
    if (!req.user) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = {
    require_login
}