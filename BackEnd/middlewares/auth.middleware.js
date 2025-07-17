import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        req.userId = decoded.id;

        next();
    } catch (err) {
        console.error('JWT Verification Error:', err.message);
        return res.status(403).json({ message: 'Forbidden - Invalid token' });
    }
}

export default authMiddleware;
