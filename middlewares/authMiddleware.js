const jwt = require('jsonwebtoken');
const secret = 'mysecret'; // Use environment variable for production

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer token"

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token' });
        }

        req.userId = decoded.userId; // Attach user ID to request
        next(); // Proceed to the next middleware or route handler
    });
};
