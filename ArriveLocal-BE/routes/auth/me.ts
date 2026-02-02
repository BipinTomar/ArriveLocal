const express = require('express');
import { Express } from "express";
const router = express.Router();
const meController = require('../../controllers/auth/meController');
const { verifyAccessToken } = require('../../middleware/authMiddleware');

// GET /auth/me - Get current user profile (requires authentication)
router.get('/', verifyAccessToken, meController.handleGetMe);

module.exports = router;
