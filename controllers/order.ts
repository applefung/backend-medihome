import { Response, Request } from "express";
import { bodyValidation } from '../util/bodyValidation';
import schemas from '../util/schema';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import moment from 'moment';
import { createOrderService, getCustomerOrderService, getPharmacyOrderService } from '../services/order';

const createOrder = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.createOrder, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    };

    const resp = await createOrderService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
};

const getCustomerOrder = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.getOrder, req.query); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    };

    const resp = await getCustomerOrderService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
};

const getPharmacyOrder = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.getPharmacyOrder, req.query); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    };

    const resp = await getPharmacyOrderService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
};

export { createOrder, getCustomerOrder, getPharmacyOrder };