'use strict';
const { BadRequestError } = require('../core/error.response');
const db = require('../models');
const { Op } = require('sequelize');

class LicenseService {
  static getPagination = async ({ createdBy, _page, _limit, searchTerm }) => {
    const findOptions = {
      attributes: ['id', 'image', 'imageName', 'authorName'],
      where: { createdBy },
      order: [['createdAt', 'DESC']],
      limit: parseInt(_limit),
      offset: parseInt(_page) * parseInt(_limit),
    };

    if (searchTerm) {
      findOptions.where[Op.or] = [
        { imageName: { [Op.like]: `%${searchTerm.toLowerCase()}%` } },
        { authorName: { [Op.like]: `%${searchTerm.toLowerCase()}%` } },
      ];
    }

    if (parseInt(_limit) !== -1) {
      findOptions.limit = parseInt(_limit);
      findOptions.offset = parseInt(_page) * parseInt(_limit);
    }
    let result = await db.License.findAndCountAll(findOptions);

    const { _count, rows } = result;
    const licenses = rows.map((row) => row.dataValues);
    const total = await db.License.count();

    return { licenses, total };
  };

  static removeOne = async ({ id }) => {
    const delCount = await db.License.destroy({
      where: {
        id,
      },
      force: true,
    });
    if (delCount === 0) {
      throw new BadRequestError('Bản quyền không tồn tại!');
    }
    return true;
  };

  static removeAny = async ({ ids }) => {
    const delCount = await db.License.destroy({
      where: {
        id: ids,
      },
      force: true,
    });
    if (delCount === 0) {
      throw new BadRequestError('Bản quyền không tồn tại!');
    }
    return true;
  };
}

module.exports = LicenseService;
