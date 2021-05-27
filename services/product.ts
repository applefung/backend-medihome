import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import product from '../models/product';
import category from '../models/category';
import pharmacy from '../models/pharmacy';
import { Request } from "express";
import moment from 'moment';
import { Op } from 'Sequelize';

const getProductService = async (req: Request) => {
    const { productId, categoryName, lang } = req.query;
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    let result;
    if(productId === undefined && categoryName === undefined){
        result = await product.findAll().catch((error:Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0002'])), error);
            throw _.cloneDeep(externalErrorCode['E0002']);
        });
    }
    else if(productId !== undefined && categoryName === undefined){
        result = await product.findAll({
            where: {
                product_id: productId
            }
        }).catch((error:Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0003'])), error);
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
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0008'])), error);
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
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0009'])), error);
                throw _.cloneDeep(externalErrorCode['E0009']);
            });
        }

        if(categoryResult !== null){
            result = await product.findAll({
                where: {
                    category_id: categoryResult.dataValues.category_id
                }
            }).catch((error:Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0004'])), error);
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

const createProductService = async (req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { categoryId, titleEn, titleCn, descriptionEn, descriptionCn, price, image, pharmacyId } = req.body;
    const productExistResult = await product.findAll({
        where: {
            [Op.or]: [
              {
                product_id: {
                  [Op.like]: pharmacyId + "%"
                }
              },
            ]
        },
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0103'])), error);
        throw _.cloneDeep(externalErrorCode['E0103']);
    });

    const tempProductIdsArray = [];
    for(let i=0; i<productExistResult.length; i++){
        const currentProductIds = productExistResult[i].dataValues.product_id;
        const tempProductId = currentProductIds.split('-')[1];
        tempProductIdsArray.push(parseInt(tempProductId));
    }
    tempProductIdsArray.sort();
    const maxProductId = tempProductIdsArray[tempProductIdsArray.length - 1];
    const newProductIdNumber = maxProductId + 1;
    const newProductId = pharmacyId + "-" + newProductIdNumber;

    const resp = await product.create({
        product_id: newProductId,
        category_id: categoryId,
        title_en: titleEn,
        title_cn: titleCn,
        description_en: descriptionEn,
        description_cn: descriptionCn,
        price: price,
        image: image
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0079'])), error);
        throw _.cloneDeep(externalErrorCode['E0079']);
    });

    const pharmacyExistResultOld = await pharmacy.findOne({
        where: {
            pharmacy_id: pharmacyId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0103'])), error);
        throw _.cloneDeep(externalErrorCode['E0103']);
    });

    if(_.isNil(pharmacyExistResultOld) || pharmacyExistResultOld.length === 0){
        return _.cloneDeep(externalErrorCode['E0077']);
    }

    const pharmacyProductIds = pharmacyExistResultOld.dataValues.product_ids;
    const pharmacyProductIdsArray = _.split(pharmacyProductIds, ',');
    pharmacyProductIdsArray.push(newProductId);

    const pharmacyExistResultuUpdate = await pharmacy.update(
        {
            product_ids: pharmacyProductIdsArray.toString()
        },
        {
            where: {
                pharmacy_id: pharmacyId
            }
        }
    ).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0105'])), error);
        throw _.cloneDeep(externalErrorCode['E0105']);
    });

    const pharmacyExistResult = await pharmacy.findOne({
        where: {
            pharmacy_id: pharmacyId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0076'])), error);
        throw _.cloneDeep(externalErrorCode['E0076']);
    });

    const productIds = pharmacyExistResult.dataValues.product_ids;

    const productIdsArray = productIds.split(',');
    const temp = [];
    for (let i=0; i<productIdsArray.length; i++){
        const productResult = await product.findOne({
            where: {
                product_id: productIdsArray[i]
            }
        }).catch((error: Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0078'])), error);
            throw _.cloneDeep(externalErrorCode['E0078']);
        });

        if(_.isNil(productResult) || productResult.length === 0){
            continue;
        }

        temp.push(productResult);
    }

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": temp
    };
}

const updateProductInformationService = async (req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { key, value, productId, pharmacyId } = req.body;
    switch(key){
        case "categoryId":
            const resp0 = product.update(
                {
                    category_id: value
                },
                {
                    where: {
                        product_id: productId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0083'])), error);
                throw _.cloneDeep(externalErrorCode['E0083']);
            });
            break;
        case "titleEn":
            const resp1 = product.update(
                {
                    title_en: value
                },
                {
                    where: {
                        product_id: productId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0094'])), error);
                throw _.cloneDeep(externalErrorCode['E0094']);
            });
            break;
        case "titleCn":
            const resp2 = product.update(
                {
                    title_cn: value
                },
                {
                    where: {
                        product_id: productId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0095'])), error);
                throw _.cloneDeep(externalErrorCode['E0095']);
            });
            break;
        case "descriptionEn":
            const resp4 = product.update(
                {
                    description_en: value
                },
                {
                    where: {
                        product_id: productId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0096'])), error);
                throw _.cloneDeep(externalErrorCode['E0096']);
            });
            break;
        case "descriptionCn":
            const resp5 = product.update(
                {
                    description_cn: value
                },
                {
                    where: {
                        product_id: productId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0097'])), error);
                throw _.cloneDeep(externalErrorCode['E0097']);
            });
            break;
        case "price":
            const resp6 = product.update(
                {
                    price: value
                },
                {
                    where: {
                        product_id: productId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0098'])), error);
                throw _.cloneDeep(externalErrorCode['E0098']);
            });
            break;
        case "image":
            const resp7 = product.update(
                {
                    image: value
                },
                {
                    where: {
                        product_id: productId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0099'])), error);
                throw _.cloneDeep(externalErrorCode['E0099']);
            });
            break;
        default:
            break;
    }

    const pharmacyExistResult = await pharmacy.findOne({
        where: {
            pharmacy_id: pharmacyId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0106'])), error);
        throw _.cloneDeep(externalErrorCode['E0106']);
    });

    if(_.isNil(pharmacyExistResult) || pharmacyExistResult.length === 0){
        return _.cloneDeep(externalErrorCode['E0107']);
    }

    const productIds = pharmacyExistResult.dataValues.product_ids;
    const productIdsArray = productIds.split(',');
    const temp = [];
    for (let i=0; i<productIdsArray.length; i++){
        const productResult = await product.findOne({
            where: {
                product_id: productIdsArray[i]
            }
        }).catch((error: Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0108'])), error);
            throw _.cloneDeep(externalErrorCode['E0108']);
        });

        if(_.isNil(productResult) || productResult.length === 0){
            continue;
        }

        temp.push(productResult);
    }

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": temp
    };
}
export { getProductService, createProductService, updateProductInformationService };