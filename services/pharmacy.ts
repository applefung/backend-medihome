import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import pharmacy from '../models/pharmacy';
import product from '../models/product';
import category from '../models/category';
import { Request } from "express";


const getPharmacyService = async (req: Request) => {
    const { pharmacyId } = req.query;
    let result;
    let getOne = false;
    if(pharmacyId === undefined){
        result = await pharmacy.findAll().catch((error:Error) => {
            logger.error(JSON.stringify(_.cloneDeep(internalErrorCode['I0006'])), error);
            throw _.cloneDeep(externalErrorCode['E0006']);
        });
    }
    else{
        getOne = true;
        result = await pharmacy.findOne({
            pharmacy_id: pharmacyId
        }).catch((error:Error) => {
            logger.error(JSON.stringify(_.cloneDeep(internalErrorCode['I0011'])), error);
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
                logger.error(JSON.stringify(_.cloneDeep(internalErrorCode['I0007'])), error);
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

export { getPharmacyService };