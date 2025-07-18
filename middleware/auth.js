
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
     const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid token" });
    }
}
