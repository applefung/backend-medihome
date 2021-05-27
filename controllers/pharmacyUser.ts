import { Response, Request } from "express";
import { bodyValidation } from '../util/bodyValidation';
import schemas from '../util/schema';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import moment from 'moment';
import { loginService } from '../services/pharmacyUser';

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

export { login };