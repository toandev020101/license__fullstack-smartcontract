'use strict';
const db = require('../models');
const bcrypt = require('bcrypt');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { sendRefreshToken, createToken } = require('../utils/jwt');
const { verify } = require('jsonwebtoken');

class AuthService {
  static login = async ({ username, password }, res) => {
    // step 1: check username exists ?
    let findUser = await db.User.findOne({ where: { username } });
    if (!findUser) {
      throw new BadRequestError('Tài khoản hoặc mật khẩu không chính xác!');
    }
    findUser = findUser.get({ plain: true });

    // step 2: verify password
    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid) {
      throw new BadRequestError('Tài khoản hoặc mật khẩu không chính xác!');
    }

    // step3: hide password
    findUser.password = '';

    // send refresh token
    sendRefreshToken(res, findUser);

    return {
      user: findUser,
      accessToken: createToken('accessToken', findUser),
    };
  };

  static register = async ({ username, password, confirmPassword, ...others }, res) => {
    // step 1: check username exists ?
    const findUser = await db.User.findOne({ where: { username } });
    if (findUser) {
      throw new BadRequestError('Tài khoản đã được đăng ký!');
    }

    // step 2: hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // step 3: create user
    let newUser = await db.User.create({
      username,
      password: hashedPassword,
      tokenVersion: 0,
      ...others,
    });

    newUser = newUser.get({ plain: true });

    // step 4: create token, refreshToken
    sendRefreshToken(res, newUser);

    return {
      user: newUser,
      accessToken: createToken('accessToken', newUser),
    };
  };

  static refreshToken = async (req, res) => {
    // step 1: check refresh token
    const token = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME];
    if (!token) {
      throw new AuthFailureError('Bạn không có quyền truy cập !');
    }

    // step 2: verify refresh token
    const decodedUser = verify(token, process.env.REFRESH_TOKEN_SECRET);
    let findUser = await db.User.findByPk(decodedUser.userId);

    if (!findUser || findUser.get({ plain: true }).tokenVersion !== decodedUser.tokenVersion) {
      throw new AuthFailureError('Bạn không có quyền truy cập !');
    }

    findUser = findUser.get({ plain: true });

    // step 3: send refresh token
    sendRefreshToken(res, findUser);

    return {
      accessToken: createToken('accessToken', findUser),
    };
  };

  static logout = async ({ id }) => {
    // step 1: check username exists ?
    let findUser = await db.User.findByPk(id);
    if (!findUser) {
      throw new BadRequestError('Tài khoản không tồn tại!');
    }

    findUser = findUser.get({ plain: true });

    // step 2: logout
    await db.User.update({ tokenVersion: findUser.tokenVersion + 1 }, { where: { id } });

    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/v1/api/refresh-token',
    });

    return;
  };
}

module.exports = AuthService;
