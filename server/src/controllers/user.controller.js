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
}

module.exports = new UserController();
