import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import product from '../models/product';
import category from '../models/category';
import pharmacy from '../models/pharmacy';
import { Request } from "express";
import { Op } from "Sequelize";
const Sequelize = require('sequelize');

const searchService = async (req:Request) => {
    const { searchKey }:any = req.query;
    const lowerCaseSearchKey = searchKey.toLowerCase();

    // found product
    category.hasMany(product, {foreignKey: 'category_id'});
    product.belongsTo(category, {foreignKey: 'category_id'});

    const productResult = await product.findAll({
        where: {
            [Op.or]: [
                Sequelize.fn('LOWER', {'$product.title_en$':  {[Op.like]: '%' + lowerCaseSearchKey + '%'}}),
                Sequelize.fn('LOWER', { '$product.title_cn$':  {[Op.like]: '%' + lowerCaseSearchKey + '%'}}),
                Sequelize.fn('LOWER', { '$product.description_en$':  {[Op.like]: '%' + lowerCaseSearchKey + '%'}}),
                Sequelize.fn('LOWER', { '$product.description_cn$':  {[Op.like]: '%' + lowerCaseSearchKey + '%'}}),
                Sequelize.fn('LOWER', { '$category.category_en$':  {[Op.like]: '%' + lowerCaseSearchKey + '%'}}),
                Sequelize.fn('LOWER', { '$category.category_cn$':  {[Op.like]: '%' + lowerCaseSearchKey + '%'}}),
            ],
        },
        include:
        [
            {
                model: category,
            }
        ],
    }).catch((error: Error) => {
        logger.error(JSON.stringify(_.cloneDeep(internalErrorCode['I0012'])), error);
        throw _.cloneDeep(externalErrorCode['E0012']);
    });

    // found pharmacy
    const pharmacyResult = await pharmacy.findAll({
        where: {
            [Op.or]: [
                Sequelize.fn('LOWER', {'$pharmacy.name_en$':  {[Op.like]: '%' + lowerCaseSearchKey + '%'}}),
                Sequelize.fn('LOWER', { '$pharmacy.name_cn$':  {[Op.like]: '%' + lowerCaseSearchKey + '%'}}),
                Sequelize.fn('LOWER', { '$pharmacy.description_en$':  {[Op.like]: '%' + lowerCaseSearchKey + '%'}}),
                Sequelize.fn('LOWER', { '$pharmacy.description_cn$':  {[Op.like]: '%' + lowerCaseSearchKey + '%'}}),
            ]
        },
    }).catch((error: Error) => {
        logger.error(JSON.stringify(_.cloneDeep(internalErrorCode['I0013'])), error);
        throw _.cloneDeep(externalErrorCode['E0013']);
    });

    const result = {
        product: productResult,
        pharmacy: pharmacyResult,
    };

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": result
    };
};

export { searchService };