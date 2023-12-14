'use strict';
const { BadRequestError } = require('../core/error.response');
const db = require('../models');

class UserService {
  static getOneById = async ({ id }) => {
    let findUser = await db.User.findByPk(id);
    if (!findUser) {
      throw new BadRequestError('Tài khoản không tồn tại !');
    }
    return { user: findUser.get({ plain: true }) };
  };
}

module.exports = UserService;
