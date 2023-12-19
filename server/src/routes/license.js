'use strict';

const express = require('express');
const licenseController = require('../controllers/license.controller');
const asyncHandler = require('../helpers/asyncHandler');
const auth = require('../middlewares/auth');
const router = express.Router();

// authentication
router.use(auth);
router.get('', asyncHandler(licenseController.getPagination));
router.delete('/:id', asyncHandler(licenseController.removeOne));
router.delete('', asyncHandler(licenseController.removeAny));


module.exports = router;
