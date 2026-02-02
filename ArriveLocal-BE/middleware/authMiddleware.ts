import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
import User from '../models/UserRegister';

import { AuthRequest } from '../models/AuthRequest';

/**
 * Middleware to verify JWT access token
 * This middleware should be used for protected routes that require authentication
 */
export const verifyAccessToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    console.log("Auth Header :  ", authHeader);
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log("Auth ME TOKEN :  ", token);

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid access token in Authorization header'
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
    
    // Add user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your access token has expired. Please refresh your token.'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided access token is invalid.'
      });
    } else {
      return res.status(500).json({ 
        error: 'Token verification failed',
        message: 'An error occurred while verifying your token.'
      });
    }
  }
};

/**
 * Middleware to verify refresh token from cookies
 * This middleware should be used for refresh token endpoint
 */
export const verifyRefreshToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ 
        error: 'Refresh token required',
        message: 'Please provide a valid refresh token'
      });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
    
    // Check if token exists in user's refresh tokens list
    const user = await User.findByEmail(decoded.email);
    
    if (!user || !user.refreshTokens?.includes(refreshToken)) {
      return res.status(403).json({ 
        error: 'Invalid refresh token',
        message: 'The refresh token is not valid or has been revoked.'
      });
    }

    // Add user info to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: user.role
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Refresh token expired',
        message: 'Your refresh token has expired. Please login again.'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid refresh token',
        message: 'The provided refresh token is invalid.'
      });
    } else {
      return res.status(500).json({ 
        error: 'Refresh token verification failed',
        message: 'An error occurred while verifying your refresh token.'
      });
    }
  }
};

/**
 * Middleware to check if user has required role
 * This should be used after verifyAccessToken
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please authenticate first'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * This middleware will add user info if token is present, but won't fail if it's not
 * Useful for endpoints that work for both authenticated and non-authenticated users
 */
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
    }
  } catch (error) {
    // Silently ignore errors for optional auth
  }
  
  next();
};
