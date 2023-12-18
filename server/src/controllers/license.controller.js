'use strict';
const LicenseService = require('../services/license.service');
const { OK } = require('../core/success.response');

class LicenseController {
  getPagination = async (req, res, next) => {
    new OK({
      message: 'Get pagination license OK!',
      metadata: await LicenseService.getPagination({ createdBy: req.userId, ...req.query }),
    }).send(res);
  };

  removeOne = async (req, res, next) => {
    new OK({
      message: 'Delete license OK!',
      metadata: await LicenseService.removeOne(req.params),
    }).send(res);
  };

  removeAny = async (req, res, next) => {
    new OK({
      message: 'Delete any license OK!',
      metadata: await LicenseService.removeAny(req.body),
    }).send(res);
  };
}

module.exports = new LicenseController();
