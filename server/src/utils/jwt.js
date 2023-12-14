const { sign } = require('jsonwebtoken');

const createToken = (type, user) =>
  sign(
    { userId: user.id, ...(type === 'refreshToken' ? { tokenVersion: user.tokenVersion } : {}) },
    type === 'accessToken' ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: type === 'accessToken' ? '15m' : '1h',
    },
  );

const sendRefreshToken = (res, user) => {
  const refreshToken = createToken('refreshToken', user);
  res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/v1/api/refresh-token',
  });
};

module.exports = {
  createToken,
  sendRefreshToken,
};
