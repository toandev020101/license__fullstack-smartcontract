'use strict';
const UserService = require('../services/user.service');
const { OK } = require('../core/success.response');

class UserController {
  getOneById = async (req, res, next) => {
    new OK({
      message: 'Get User OK!',
      metadata: await UserService.getOneById(req.params),
    }).send(res);
  };

  updateOne = async (req, res, nex) => {
    new OK({
      message: 'Update User OK!',
      metadata: await UserService.updateOne({ id: req.userId, file: req.file, ...req.body }),
    }).send(res);
  };

  changePassword = async (req, res, nex) => {
    new OK({
      message: 'Change password User OK!',
      metadata: await UserService.changePassword({ id: req.userId, ...req.body }),
    }).send(res);
  };
}

module.exports = new UserController();
