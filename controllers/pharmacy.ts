import { Response, Request, NextFunction } from "express";
import { getPharmacyService } from '../services/pharmacy';
import schemas from '../util/schema';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import { bodyValidation } from '../util/bodyValidation';

const getPharmacy= async (req:Request, res:Response, next: NextFunction) => {
    const isBodyValidated = bodyValidation(schemas.getPharmacy, req.query); 
    if(!isBodyValidated){
        logger.debug(_.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const result = await getPharmacyService(req).catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

export {getPharmacy};