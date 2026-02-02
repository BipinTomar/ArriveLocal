const express = require('express');
import { Express } from "express";
const router = express.Router();
const logoutController = require('../../controllers/auth/logoutController');
const { validateRequest } = require('../../middleware/validateRequest');
const { logoutSchema } = require('../../validators/authSchemas');

router.post('/', validateRequest({ cookies: logoutSchema }), logoutController.handleLogout);

module.exports = router;