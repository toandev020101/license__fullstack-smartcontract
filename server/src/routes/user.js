'use strict';

const express = require('express');
const userController = require('../controllers/user.controller');
const asyncHandler = require('../helpers/asyncHandler');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const router = express.Router();

router.get('/:id', asyncHandler(userController.getOneById));
router.post('', asyncHandler(userController.addOne));

// authentication
router.use(auth);
router.put('', upload.single('file'), asyncHandler(userController.updateOne));

module.exports = router;
