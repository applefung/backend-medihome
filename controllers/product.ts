import { Response, Request } from "express";
import { getProductService, createProductService, updateProductInformationService } from '../services/product';
import { bodyValidation } from '../util/bodyValidation';
import schemas from '../util/schema';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import moment from 'moment';

const getProduct = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.getProduct, req.query); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }

    const result = await getProductService(req).catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

const createProduct = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.createProduct, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }

    const result = await createProductService(req).catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

const updateProductInformation = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.updateProductInformation, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }

    const result = await updateProductInformationService(req).catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

export { getProduct, createProduct, updateProductInformation};