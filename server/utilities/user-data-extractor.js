module.exports = {
    extractUserData(req){
        return {
            _id: req.user._id,
            username: req.user.username,
            image: req.user.image,
            email: req.user.email,
            courses: req.user.courses,
            isBlocked: req.user.isBlocked,
            isAdmin: req.user.roles.indexOf('admin') != -1,
        }
    }
};
