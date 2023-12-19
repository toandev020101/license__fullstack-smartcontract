'use strict';
const { BadRequestError } = require('../core/error.response');
const db = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
const crypto = require('node:crypto');

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

  static checkFile = async ({ file }) => {
    const filePath = path.join(__dirname, '../../uploads/' + file.filename);

    const res = await pinata.pinFromFS(filePath);
    fs.unlinkSync(filePath);
    if (res.isDuplicate) {
      throw new BadRequestError('Hình ảnh đã đăng ký bản quyền!');
    }

    await pinata.unpin(res.IpfsHash);
    return true;
  };

  static addOne = async ({ file, ...others }) => {
    const filePath = path.join(__dirname, '../../uploads/' + file.filename);

    const res = await pinata.pinFromFS(filePath);
    let newLicense = await db.License.create({
      image: process.env.PINATA_GET_ENDPOINT + '/' + res.IpfsHash,
      ...others,
    });

    newLicense = newLicense.get({ plain: true });

    // Tạo đối tượng hash
    const hash = crypto.createHash('sha256');

    // Cập nhật dữ liệu cần hash
    hash.update(JSON.stringify(newLicense));

    // Tính toán và lấy giá trị hash dưới dạng hex
    const hashed = hash.digest('hex');

    return {
      id: newLicense.id,
      hash: hashed,
    };
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
