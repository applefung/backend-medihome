import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import product from '../models/product';
import category from '../models/category';
import { Request } from "express";

const getProductService = async (req: Request) => {
    const { productId, categoryName, lang } = req.query;
    let result;
    if(productId === undefined && categoryName === undefined){
        result = await product.findAll().catch((error:Error) => {
            logger.error(JSON.stringify(_.cloneDeep(internalErrorCode['I0002'])), error);
            throw _.cloneDeep(externalErrorCode['E0002']);
        });
    }
    else if(productId !== undefined && categoryName === undefined){
        result = await product.findAll({
            where: {
                product_id: productId
            }
        }).catch((error:Error) => {
            logger.error(JSON.stringify(_.cloneDeep(internalErrorCode['I0003'])), error);
            throw _.cloneDeep(externalErrorCode['E0003']);
        });
    }
    else if(productId === undefined && categoryName !== undefined){
        let categoryResult;
        if(lang === 'en'){
            categoryResult = await category.findOne({
                where: {
                    category_en: categoryName
                },
                attributes: ['category_id']
            }).catch((error: Error) => {
                logger.error(JSON.stringify(_.cloneDeep(internalErrorCode['I0008'])), error);
                throw _.cloneDeep(externalErrorCode['E0008']);
            });
        }
        else{
            categoryResult = await category.findOne({
                where: {
                    category_cn: categoryName
                },
                attributes: ['category_id']
            }).catch((error: Error) => {
                logger.error(JSON.stringify(_.cloneDeep(internalErrorCode['I0009'])), error);
                throw _.cloneDeep(externalErrorCode['E0009']);
            });
        }

        if(categoryResult !== null){
            result = await product.findAll({
                where: {
                    category_id: categoryResult.dataValues.category_id
                }
            }).catch((error:Error) => {
                logger.error(JSON.stringify(_.cloneDeep(internalErrorCode['I0004'])), error);
                throw _.cloneDeep(externalErrorCode['E0004']);
            });
        }
        else{
            result = [];
        }

    }

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": result
    };
};

export { getProductService };