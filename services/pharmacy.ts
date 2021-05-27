import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import pharmacy from '../models/pharmacy';
import product from '../models/product';
import category from '../models/category';
import { Request } from "express";
import moment from 'moment';
import pharmacyUser from '../models/pharmacyUser';

const getPharmacyService = async (req: Request) => {
    const { pharmacyId } = req.query;
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    let result;
    let getOne = false;
    if(pharmacyId === undefined){
        result = await pharmacy.findAll().catch((error:Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0006'])), error);
            throw _.cloneDeep(externalErrorCode['E0006']);
        });
    }
    else{
        getOne = true;
        result = await pharmacy.findOne({
            pharmacy_id: pharmacyId
        }).catch((error:Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0011'])), error);
            throw _.cloneDeep(externalErrorCode['E0011']);
        });
    }

    let returnResult = _.cloneDeep(result);

    if(getOne){
        const temp = [];
        temp.push(result)
        result = _.cloneDeep(temp);
        returnResult = _.cloneDeep(temp);
    }

    for(let i=0; i<result.length; i++){
        const productIds = result[i].dataValues.product_ids;
        const productIdArray = _.split(productIds, ',');
        const tempProductArray = [];
        for(let k=0; k<productIdArray.length; k++){
            category.hasMany(product, {foreignKey: 'category_id'});
            product.belongsTo(category, {foreignKey: 'category_id'});

            const productResult = await product.findAll({
                where: {
                    product_id: productIdArray[k]
                },
                include:
                [
                    {
                        model: category,
                    }
                ],
            }).catch((error:Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0007'])), error);
                throw _.cloneDeep(externalErrorCode['E0007']);
            });
            tempProductArray.push(productResult[0].dataValues);
        }
        returnResult[i].dataValues['products'] = tempProductArray;
    }

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": returnResult
    };
};

const getProductByPharmacyIdService = async (req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { pharmacyId } = req.query;
    const pharmacyExistResult = await pharmacy.findOne({
        where: {
            pharmacy_id: pharmacyId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0076'])), error);
        throw _.cloneDeep(externalErrorCode['E0076']);
    });

    if(_.isNil(pharmacyExistResult) || pharmacyExistResult.length === 0){
        return _.cloneDeep(externalErrorCode['E0077']);
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

const updatePharmacyInformationService = async (req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { key, value, pharmacyId } = req.body;
    switch(key){
        case "nameEn":
            const resp1 = await pharmacy.update(
                {
                    name_en: value
                },
                {
                    where: {
                        pharmacy_id: pharmacyId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0084'])), error);
                throw _.cloneDeep(externalErrorCode['E0084']);
            });
            break;
        case "nameCn":
            const resp2 = await pharmacy.update(
                {
                    name_cn: value
                },
                {
                    where: {
                        pharmacy_id: pharmacyId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0085'])), error);
                throw _.cloneDeep(externalErrorCode['E0085']);
            });
            break;
        case "addressEn":
            const resp3 = await pharmacy.update(
                {
                    address_en: value
                },
                {
                    where: {
                        pharmacy_id: pharmacyId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0086'])), error);
                throw _.cloneDeep(externalErrorCode['E0086']);
            });
            break;
        case "addressCn":
            const resp4 = await pharmacy.update(
                {
                    address_en: value
                },
                {
                    where: {
                        pharmacy_id: pharmacyId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0087'])), error);
                throw _.cloneDeep(externalErrorCode['E0087']);
            });
            break;
        case "descriptionEn":
            const resp5 = await pharmacy.update(
                {
                    address_en: value
                },
                {
                    where: {
                        description_en: pharmacyId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0088'])), error);
                throw _.cloneDeep(externalErrorCode['E0088']);
            });
            break;
        case "descriptionCn":
            const resp6 = await pharmacy.update(
                {
                    address_en: value
                },
                {
                    where: {
                        description_cn: pharmacyId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0089'])), error);
                throw _.cloneDeep(externalErrorCode['E0089']);
            });
            break;
        case "businessTime":
            const resp7 = await pharmacy.update(
                {
                    address_en: value
                },
                {
                    where: {
                        business_time: pharmacyId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0090'])), error);
                throw _.cloneDeep(externalErrorCode['E0090']);
            });
            break;
        case "contact":
            const resp8 = await pharmacy.update(
                {
                    address_en: value
                },
                {
                    where: {
                        contact: pharmacyId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0091'])), error);
                throw _.cloneDeep(externalErrorCode['E0091']);
            });
            break;
        case "image":
            const resp9 = await pharmacy.update(
                {
                    address_en: value
                },
                {
                    where: {
                        image: pharmacyId
                    }
                }
            ).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0092'])), error);
                throw _.cloneDeep(externalErrorCode['E0092']);
            });
            break;
        default:
            break;
    }

    pharmacy.hasMany(pharmacyUser, {foreignKey: 'pharmacy_id'});
    pharmacyUser.belongsTo(pharmacy, {foreignKey: 'pharmacy_id'});

    const pharmacyUserExistResult = await pharmacyUser.findOne({
        where: {
            pharmacy_id: pharmacyId
        },
        include:
        [
            {
                model: pharmacy,
            }
        ],
    }).catch((error:Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0057'])), error);
        throw _.cloneDeep(externalErrorCode['E0057']);
    });

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": pharmacyUserExistResult
    };
};

export { getPharmacyService, getProductByPharmacyIdService, updatePharmacyInformationService };