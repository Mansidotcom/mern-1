const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.status(401).json({ message: 'access denied, admin only' });
};

module.exports = { admin };

