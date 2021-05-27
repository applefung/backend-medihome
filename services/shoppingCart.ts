import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import customerUser from '../models/customerUser';
import product from '../models/product';
import category from '../models/category';
import pharmacy from '../models/pharmacy';
import { Request } from "express";
import moment from 'moment';

const addToShoppingCartService = async (req:Request) => {
    const { customerUserId, productId, type } = req.body;
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    // get shopping cart from by customer user Id
    const customerUserResult = await customerUser.findOne({
        where: {
            customer_user_id: customerUserId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0033'])), error);
        throw _.cloneDeep(externalErrorCode['E0033']);
    });

    // if no user then return
    if(_.isNil(customerUserResult)){
        return _.cloneDeep(externalErrorCode['E0034']);
    }

    // check if product exist
    const productExistResult = await product.findOne({
        where: {
            product_id: productId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0036'])), error);
        throw _.cloneDeep(externalErrorCode['E0036']);
    });

    if(_.isNil(productExistResult)){
        return _.cloneDeep(externalErrorCode['E0037']);
    }

    // check if the product exist
    // if yes then add 1
    let tempShoppingCartItems = _.cloneDeep(customerUserResult.dataValues.shopping_cart_items);
    if(type === 0){
        if(tempShoppingCartItems[productId]>1){
            tempShoppingCartItems[productId] = parseInt(tempShoppingCartItems[productId]) - 1;
        }
        else{
            // if not then make it as 1
            tempShoppingCartItems = _.omit(tempShoppingCartItems, [productId]);
        }
    }
    else{
        if(_.has(tempShoppingCartItems, productId)){
            tempShoppingCartItems[productId] = parseInt(tempShoppingCartItems[productId]) + 1;
        }
        else{
            // if not then make it as 1
            tempShoppingCartItems[productId] = 1;
        }
    }

    // update db
    const resp = await customerUser.update(
        {
            shopping_cart_items: tempShoppingCartItems
        },
        {
            where: {
                customer_user_id: customerUserId
            }
        }
        ).catch((error: Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0035'])), error);
            throw _.cloneDeep(externalErrorCode['E0035']);
    });

    const returnCustomerUserResult = await customerUser.findOne({
        where: {
            customer_user_id: customerUserId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0047'])), error);
        throw _.cloneDeep(externalErrorCode['E0047']);
    });
    
    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": returnCustomerUserResult
    };
};

const getShoppingCartItemsService = async (req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { customerUserId } = req.query;

    const customerUserResult = await customerUser.findOne({
        where: {
            customer_user_id: customerUserId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0042'])), error);
        throw _.cloneDeep(externalErrorCode['E0042']);
    });

    // if null then return
    if(_.isNil(customerUserResult)){
        return _.cloneDeep(externalErrorCode['E0043']);
    }
    // if yes continue
    // loop json
    const shoppingCartItems = customerUserResult.dataValues.shopping_cart_items;
    const returnResult:any = [];

    let currentIndex = -1;
    const keys = Object.keys(shoppingCartItems);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const pharmacyId = key.split('-')[0];
        const pharmacyResult = await pharmacy.findOne({
            where: {
                pharmacy_id: pharmacyId
            }
        }).catch((error: Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0044'])), error);
            throw _.cloneDeep(externalErrorCode['E0044']);
        });

        // if not null
        if(_.isNil(pharmacyResult)){
            return _.cloneDeep(externalErrorCode['E0045']);
        }
        
        const tempPharmacyArray = _.cloneDeep(pharmacyResult);
        tempPharmacyArray.dataValues.products = [];

        if(!_.some(returnResult, tempPharmacyArray)){
            returnResult.push(tempPharmacyArray);
            currentIndex++;
        }

        
        category.hasMany(product, {foreignKey: 'category_id'});
        product.belongsTo(category, {foreignKey: 'category_id'});

        const productResult = await product.findAll({
            where: {
                product_id: key
            },
            include:
            [
                {
                    model: category,
                }
            ],
        }).catch((error:Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0046'])), error);
            throw _.cloneDeep(externalErrorCode['E0046']);
        });
        returnResult[currentIndex].dataValues.products.push(productResult[0]);

    }

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": returnResult
    };
};


export { addToShoppingCartService, getShoppingCartItemsService };