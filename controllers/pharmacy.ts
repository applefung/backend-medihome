import { Response, Request, NextFunction } from "express";
import { getPharmacyService, getProductByPharmacyIdService, updatePharmacyInformationService } from '../services/pharmacy';
import schemas from '../util/schema';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import { bodyValidation } from '../util/bodyValidation';
import moment from 'moment';

const getPharmacy= async (req:Request, res:Response, next: NextFunction) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.getPharmacy, req.query); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const result = await getPharmacyService(req).catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

const getProductByPharmacyId = async (req:Request, res:Response, next: NextFunction) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.getProductByPharmacyId, req.query); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const result = await getProductByPharmacyIdService(req).catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

const updatePharmacyInformation = async (req:Request, res:Response, next: NextFunction) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.updatePharmacyInformation, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const result = await updatePharmacyInformationService(req).catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

export { getPharmacy, getProductByPharmacyId, updatePharmacyInformation };