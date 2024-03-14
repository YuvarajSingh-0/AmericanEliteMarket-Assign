import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    // Get token from the header
    const token = req.cookies.token;
    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }
        if (req.user && req.user._id !== decoded.user._id){
            console.log(req.user);
            return res.status(401).json({ msg: 'Token is not valid' });
        }
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default auth;
