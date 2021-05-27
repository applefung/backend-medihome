import { Response, Request } from "express";
import { bodyValidation } from '../util/bodyValidation';
import schemas from '../util/schema';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import moment from 'moment';
import { getRoomService, getPharmacyFriendListService, getCustomerFriendListService } from '../services/chat';

const getRoom = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.chat, req.query); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    };

    const resp = await getRoomService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
};

const getPharmacyFriendList = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.getPharmacyFriendList, req.query); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    };

    const resp = await getPharmacyFriendListService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
}

const getCustomerFriendList = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.getCustomerFriendList, req.query); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    };

    const resp = await getCustomerFriendListService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
}

export { getRoom, getPharmacyFriendList, getCustomerFriendList };