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

  checkFile = async (req, res, next) => {
    new OK({
      message: 'Check file OK!',
      metadata: await LicenseService.checkFile({ file: req.file }),
    }).send(res);
  };

  addOne = async (req, res, next) => {
    new OK({
      message: 'Create license OK!',
      metadata: await LicenseService.addOne({ file: req.file, ...req.body }),
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
