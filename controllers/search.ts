import { Response, Request } from "express";
import { bodyValidation } from '../util/bodyValidation';
import schemas from '../util/schema';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import { searchService } from '../services/search';
import moment from 'moment';

const search = async (req:Request, res:Response) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const isBodyValidated = bodyValidation(schemas.search, req.query); 
    if(!isBodyValidated){
        logger.debug(today, _.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }

    const resp = await searchService(req).catch((error: Error) => {
        console.log('error', error)
        return res.status(405).send(error);
    });
    return res.status(200).send(resp)
};

export { search };