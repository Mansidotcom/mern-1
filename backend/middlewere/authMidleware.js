const jwt = require('jsonwebtoken');
const User = require('../model/User');

const getTokenFromHeader = (headerValue) => {
    if (!headerValue) return null;

    const cleanValue = String(headerValue)
        .trim()
        .replace(/^['"]|['"]$/g, '');

    if (!cleanValue) return null;

    const bearerMatch = cleanValue.match(/^Bearer\s+(.+)$/i);
    if (bearerMatch) return bearerMatch[1].trim();

    const tokenMatch = cleanValue.match(/^Token\s+(.+)$/i);
    if (tokenMatch) return tokenMatch[1].trim();

    return cleanValue.includes('.') ? cleanValue : null;
};

const getUserIdentifier = (decoded) => {
    if (!decoded || typeof decoded !== 'object') return null;

    const candidates = [
        decoded.id,
        decoded._id,
        decoded.userId,
        decoded.user?.id,
        decoded.user?._id,
        decoded.user?.userId,
        decoded.email
    ];

    return candidates.find((value) => value !== undefined && value !== null && String(value).trim() !== '') || null;
};

const protect = async (req, res, next) => {
    const authHeader =
        req.headers.authorization ||
        req.headers.Authorization ||
        req.headers['x-auth-token'] ||
        req.headers.token;

    const token = getTokenFromHeader(authHeader);

    if (!token) {
        return res.status(401).json({
            message: 'Not authorized, no token'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userIdentifier = getUserIdentifier(decoded);
        const maybeUserId = userIdentifier && typeof userIdentifier === 'string' ? userIdentifier : null;

        let user = null;

        if (maybeUserId) {
            user = await User.findById(maybeUserId).select('-password');
        }

        if (!user && decoded?.email) {
            user = await User.findOne({ email: decoded.email }).select('-password');
        }

        if (!user) {
            return res.status(401).json({
                message: 'Not authorized, user not found',
                tokenUserId: maybeUserId || decoded?.email || null
            });
        }

        req.user = user;
        return next();

    } catch (error) {
        console.error('AUTH ERROR:', error.message);

        return res.status(401).json({
            message: 'Not authorized, token failed',
            error: error.message
        });
    }
};

module.exports = { protect };