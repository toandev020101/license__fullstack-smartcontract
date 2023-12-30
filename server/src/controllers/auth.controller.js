'use strict';

const { OK } = require('../core/success.response');
const AuthService = require('../services/auth.service');

class AuthController {
  login = async (req, res, next) => {
    new OK({
      message: 'Login OK!',
      metadata: await AuthService.login(req.body, res),
    }).send(res);
  };

  register = async (req, res, next) => {
    new OK({
      message: 'Register OK!',
      metadata: await AuthService.register(req.body, res),
    }).send(res);
  };

  refreshToken = async (req, res, next) => {
    new OK({
      message: 'RefreshToken OK!',
      metadata: await AuthService.refreshToken(req, res),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new OK({
      message: 'Logout OK!',
      metadata: await AuthService.logout({ id: req.userId }, res),
    }).send(res);
  };
}

module.exports = new AuthController();
