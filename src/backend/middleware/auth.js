// Authentication middleware

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ 
    error: { message: 'Authentication required' } 
  });
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  
  res.status(400).json({ 
    error: { message: 'Already authenticated' } 
  });
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated
};
