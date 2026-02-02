const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/auth/loginController');
const { validateRequest } = require('../../middleware/validateRequest');
const { loginSchema } = require('../../validators/authSchemas');

//a bridge for the login request to the login controller
router.post('/', validateRequest({ body: loginSchema }), loginController.handleLogin);

module.exports = router;