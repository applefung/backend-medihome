import { Response, Request } from "express";
import { getProductService } from '../services/product';
import { bodyValidation } from '../util/bodyValidation';
import schemas from '../util/schema';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';

const getProduct = async (req:Request, res:Response) => {
    const isBodyValidated = bodyValidation(schemas.getProduct, req.query); 
    if(!isBodyValidated){
        logger.debug(_.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }

    const result = await getProductService(req).catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

export {getProduct};