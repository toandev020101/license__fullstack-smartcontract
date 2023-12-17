'use strict';
const { BadRequestError } = require('../core/error.response');
const db = require('../models');
const bcrypt = require('bcrypt');

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

  static changePassword = async ({ id, password, newPassword }) => {
    let findUser = await db.User.findByPk(id);
    if (!findUser) {
      throw new BadRequestError('Tài khoản không tồn tại !');
    }
    findUser = findUser.get({ plain: true });

    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Mật khẩu cũ không chính xác!');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.User.update({ password: hashedPassword }, { where: { id } });

    return null;
  };
}

module.exports = UserService;
