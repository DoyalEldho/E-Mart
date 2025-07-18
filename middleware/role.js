module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(401).json({ message: 'Access denied: wrong role' });
    }
    next();
  };
};
