import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization? req.headers.authorization.split(' ')[1] : null; // Token: "Bearer <token>"

    if(!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.twoFactorEnabled) {
            return res.status(401).json({ message: 'Two-factor authentication is not enabled, Please log in again' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

export default authMiddleware;