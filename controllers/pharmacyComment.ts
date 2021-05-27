import { Response, Request, NextFunction } from "express";
import schemas from '../util/schema';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import { bodyValidation } from '../util/bodyValidation';
import moment from 'moment';
import {  getAllPharmacyCommentService, postPharmacyCommentService } from '../services/pharmacyComment';

const getAllPharmacyComment = async (req:Request, res:Response, next: NextFunction) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.getAllPharmacyComment, req.query); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const result = await getAllPharmacyCommentService(req).catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

const postPharmacyComment = async (req:Request, res:Response, next: NextFunction) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.postPharmacyComment, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const result = await postPharmacyCommentService(req).catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

const getAllPharmacyCommentForPharmacy = async (req:Request, res:Response, next: NextFunction) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.postPharmacyComment, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const result = await postPharmacyCommentService(req).catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};


export { getAllPharmacyComment, postPharmacyComment, getAllPharmacyCommentForPharmacy }
