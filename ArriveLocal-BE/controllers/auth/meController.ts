import { Request, Response } from 'express';
import User from '../../models/UserRegister';

import { AuthRequest } from '../../models/AuthRequest';

const handleGetMe = async (req: AuthRequest, res: Response) => {
  try {
    // User info is already available from the verifyAccessToken middleware
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please provide a valid access token'
      });
    }

    // Get full user details from database
    const user = await User.findByEmail(req.user.email);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    // Return user profile without sensitive data
    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Add addresses when you implement them
      addresses: [] // Placeholder for future address implementation
    };

    res.status(200).json({
      message: 'User profile retrieved successfully',
      user: userProfile
    });

  } catch (error: any) {
    console.error('Error in handleGetMe:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
  }
};

module.exports = { handleGetMe };


