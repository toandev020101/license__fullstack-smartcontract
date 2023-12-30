'use strict';

const express = require('express');
const router = express.Router();

router.use('/v1/api/licenses', require('./license'));
router.use('/v1/api/users', require('./user'));
router.use('/v1/api', require('./auth'));

module.exports = router;
