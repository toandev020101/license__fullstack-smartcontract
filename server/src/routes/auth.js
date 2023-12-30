'use strict';

const express = require('express');
const authController = require('../controllers/auth.controller');
const asyncHandler = require('../helpers/asyncHandler');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/login', asyncHandler(authController.login));
router.post('/register', asyncHandler(authController.register));
router.get('/refresh-token', asyncHandler(authController.refreshToken));

router.use(auth);

router.get('/logout', asyncHandler(authController.logout));
module.exports = router;
