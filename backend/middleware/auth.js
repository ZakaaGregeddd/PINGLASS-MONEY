// backend/middleware/auth.js
// Authentication Middleware

const { supabase } = require('../utils/database');

/**
 * Verify JWT token dan attach user ke request
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          message: 'Missing or invalid Authorization header',
          status: 401
        }
      });
    }
    
    const token = authHeader.substring(7); // Remove "Bearer "
    
    // Verify token dengan Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({
        error: {
          message: 'Invalid or expired token',
          status: 401
        }
      });
    }
    
    // Attach user ke request
    req.user = data.user;
    req.userId = data.user.id;
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({
      error: {
        message: 'Authentication failed',
        status: 401
      }
    });
  }
}

module.exports = authMiddleware;
