import { Response, Request } from "express";
import { bodyValidation } from '../util/bodyValidation';
import schemas from '../util/schema';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import { loginService, signUpSendVerificationCodeService, signUpService, forgotPasswordSendVerificationCodeService, forgotPasswordService, editPersonalInformationService, createNewBookmarkService } from '../services/customerUser';
import moment from 'moment';

const login = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.login, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }

    const resp:any = await loginService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });

    if(resp.errCode !== "E0000"){
        return res.status(405).send(resp);
    };

    return res.status(200).send(resp)
};

const signUpSendVerificationCode = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.signupVerificationCode, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const resp = await signUpSendVerificationCodeService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
};

const signUp = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.signup, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const resp = await signUpService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
};

const forgotPasswordSendVerificationCode = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.forgotPasswordVerificationCode, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const resp = await forgotPasswordSendVerificationCodeService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
};

const forgotPassword = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.forgotPassword, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const resp = await forgotPasswordService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
};

const editPersonalInformation = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.editPersonalInformation, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const resp = await editPersonalInformationService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
};

const createNewBookmark = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.createNewBookmark, req.body); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }
    const resp = await createNewBookmarkService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp);
};
export { login, signUp, signUpSendVerificationCode, forgotPasswordSendVerificationCode, forgotPassword, editPersonalInformation, createNewBookmark };