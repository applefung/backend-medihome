import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import moment from 'moment';
import { Request } from "express";
import order from '../models/order';
import customerUser from '../models/customerUser';
import pharmacy from '../models/pharmacy';
import product from '../models/product';
import { Op } from 'Sequelize';

const createOrderService = async (req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { customerUserId, pharmacyIds, productIds, address, contact, remark, deliveryDate, sumOfTotal } = req.body;
    const productIdsJson = JSON.parse(productIds);
    const resp = await order.create({
        customer_user_id: customerUserId,
        pharmacy_ids: pharmacyIds,
        product_ids: productIdsJson,
        address: address,
        contact: contact,
        remark: remark,
        delivery_date: deliveryDate,
        sum_of_total: sumOfTotal,
        order_date: today
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0048'])), error);
        throw _.cloneDeep(externalErrorCode['E0048']);
    });

    // remove from shopping cart
    const customerUserExistResult = await customerUser.findOne({
        customer_user_id: customerUserId
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0049'])), error);
        throw _.cloneDeep(externalErrorCode['E0049']);
    });

    // if no user then return
    if(_.isNil(customerUserExistResult)){
        return _.cloneDeep(externalErrorCode['E0050']);
    }

    let oldShoppingCartItems = customerUserExistResult.dataValues.shopping_cart_items;
    const keys = Object.keys(productIdsJson);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        oldShoppingCartItems = _.omit(oldShoppingCartItems, [key]);
    }
    
    const updateShoppingCart = await customerUser.update(
        {
            shopping_cart_items: oldShoppingCartItems
        },
        {
            where: {
                customer_user_id: customerUserId
            }
        }
    ).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0051'])), error);
        throw _.cloneDeep(externalErrorCode['E0051']);
    });

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": "E0000"
    };
};

const getCustomerOrderService = async (req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { customerUserId } = req.query;
    const orderExistResult = await order.findAll({
        where: {
            customer_user_id: customerUserId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0063'])), error);
        throw _.cloneDeep(externalErrorCode['E0063']);
    });

    // if no user then return
    if(_.isNil(orderExistResult) || orderExistResult.length === 0){
        return _.cloneDeep(externalErrorCode['E0064']);
    }
    
    const orderResult:any = [];
    for(let i=0; i<orderExistResult.length; i++){
        const tempOrderResult = _.cloneDeep(orderExistResult[i].dataValues);
        tempOrderResult.pharmacy = [];
        const pharmacyIds = orderExistResult[i].dataValues.pharmacy_ids;
        const pharmacyIdsArray = _.split(pharmacyIds, ',');
        const tempPharmacyResult = [];
        for(let i=0; i<pharmacyIdsArray.length; i++){
            const pharmacyExistResult = await pharmacy.findOne({
                where: {
                    pharmacy_id: pharmacyIdsArray[i]
                }
            }).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0065'])), error);
                throw _.cloneDeep(externalErrorCode['E0065']);
            });

            if(_.isNil(pharmacyExistResult || pharmacyExistResult.length === 0)){
                continue;
            }
            const tempResult = _.cloneDeep(pharmacyExistResult.dataValues);
            tempResult.products = [];
            tempOrderResult.pharmacy.push(tempResult);
        }


        const productIdsJson = orderExistResult[i].dataValues.product_ids;
        // loop json keys
        const keys = Object.keys(productIdsJson);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            // get product info
            const productExistResult = await product.findOne({
                where: {
                    product_id: key
                }
            }).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0066'])), error);
                throw _.cloneDeep(externalErrorCode['E0066']);
            });

            if(_.isNil(productExistResult) || productExistResult.length === 0){
                continue;
            }


            // split keys
            const productPharmacyId = key.split('-')[0];
            // put to the specific pharmacy
            tempOrderResult.pharmacy.forEach((pharmacyElement:any)=> {
                if(pharmacyElement.pharmacy_id === parseInt(productPharmacyId)){
                    const tempProductResult = _.cloneDeep(productExistResult.dataValues);
                    tempProductResult.amount = productIdsJson[key];
                    pharmacyElement.products.push(tempProductResult);
                }
            });
        }
        orderResult.push(tempOrderResult);
    }
    

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": orderResult
    };
};

const getPharmacyOrderService = async (req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { pharmacyId } = req.query;

    customerUser.hasMany(order, {foreignKey: 'customer_user_id'});
    order.belongsTo(customerUser, {foreignKey: 'customer_user_id'});

    const orderExistResult = await order.findAll({
        where: {
            [Op.or]: [
              {
                pharmacy_ids: {
                  [Op.like]: "%" + pharmacyId + "%"
                }
              },
            ]
          },
        include:
        [
            {
                model: customerUser,
            }
        ],
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0066'])), error);
        throw _.cloneDeep(externalErrorCode['E0066']);
    });

    const tempResult = [];

    for(let i=0; i<orderExistResult.length; i++){
        const tempOrderResult = _.cloneDeep(orderExistResult[i].dataValues);
        const productIdsJson = orderExistResult[i].dataValues.product_ids;
        tempOrderResult.products = [];
        const tempProductResult = [];
        const keys = Object.keys(productIdsJson);

        for (let k = 0; k < keys.length; k++) {
            const key = keys[k];
            const productExistResult = await product.findOne({
                where: {
                    product_id: key
                }
            }).catch((error: Error) => {
                logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0066'])), error);
                throw _.cloneDeep(externalErrorCode['E0066']);
            });
            if(_.isNil(productExistResult) || productExistResult.length === 0){
                continue;
            }
            tempProductResult.push(productExistResult.dataValues);
        }
        tempOrderResult.products = tempProductResult;
        tempResult.push(tempOrderResult);
    }

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": tempResult
    };
};

export { createOrderService, getCustomerOrderService, getPharmacyOrderService }