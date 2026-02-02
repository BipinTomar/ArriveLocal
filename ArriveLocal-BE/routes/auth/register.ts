const express = require('express');
import { Express } from "express";
const registerRouter = express.Router();

const registerController = require('../../controllers/auth/registerController');
const { validateRequest } = require('../../middleware/validateRequest');
const { registerSchema } = require('../../validators/authSchemas');

registerRouter.post('/', validateRequest({ body: registerSchema }), registerController.handleRegister);

module.exports = registerRouter;