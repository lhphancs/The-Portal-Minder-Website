function require_login(req, res, next) {
    if (!req.user) {
        req.session.reset();
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = {
    require_login
}