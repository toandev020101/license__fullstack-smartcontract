const { AuthFailureError } = require('../core/error.response');
const { verify } = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');

const auth = asyncHandler((req, res, next) => {
  try {
    // authHeader here is "Bearer accessToken"
    const accessToken = req.headers.authorization?.split(' ')[1];

    // check access token
    if (!accessToken) throw new AuthFailureError('Không có token!');

    // verify access token
    const decodedUser = verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedUser) throw new AuthFailureError('Token không hợp lệ!');

    req.userId = decodedUser.userId;

    return next();
  } catch (error) {
    return next();
  }
});

module.exports = auth;
