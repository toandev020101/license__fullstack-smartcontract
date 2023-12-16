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

  static updateOne = async ({ id, file, ...others }) => {
    let findUser = await db.User.findByPk(id);
    if (!findUser) {
      throw new BadRequestError('Tài khoản không tồn tại !');
    }

    const avatar = file ? process.env.UPLOAD_URL + '/' + file.filename : '';
    await db.User.update({ avatar, ...others }, { where: { id } });

    return null;
  };
}

module.exports = UserService;
