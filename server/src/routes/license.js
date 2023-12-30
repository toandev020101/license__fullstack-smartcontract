'use strict';

const express = require('express');
const licenseController = require('../controllers/license.controller');
const asyncHandler = require('../helpers/asyncHandler');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const router = express.Router();

// authentication
router.use(auth);
router.get('/:id', asyncHandler(licenseController.getOneById));
router.get('', asyncHandler(licenseController.getPagination));
router.post('/file', upload.single('file'), asyncHandler(licenseController.checkFile));
router.post('', upload.single('file'), asyncHandler(licenseController.addOne));
router.put('', asyncHandler(licenseController.updateOne));
router.delete('/:id', asyncHandler(licenseController.removeOne));
router.delete('', asyncHandler(licenseController.removeAny));

module.exports = router;
