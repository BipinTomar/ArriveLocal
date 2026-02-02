const express = require("express");
import { Express } from "express";
const router = express.Router();
const refreshController = require('../../controllers/auth/refreshController');
const { validateRequest } = require('../../middleware/validateRequest');
const { refreshSchema } = require('../../validators/authSchemas');

router.post('/', validateRequest({ cookies: refreshSchema }), refreshController.handleRefresh);

module.exports = router;
