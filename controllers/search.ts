import { Response, Request } from "express";
import { getProductService } from '../services/product';
import { bodyValidation } from '../util/bodyValidation';
import schemas from '../util/schema';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import { searchService } from '../services/search';

const search = async (req:Request, res:Response) => {
    const isBodyValidated = bodyValidation(schemas.search, req.query); 
    if(!isBodyValidated){
        logger.debug(_.cloneDeep(internalErrorCode['I0010']));
        res.status(403).send( _.cloneDeep(externalErrorCode['E0010']));
        return;
    }

    const resp = await searchService(req).catch((error: Error) => {
        return res.status(405).send(error);
    });
    return res.status(200).send(resp)
};

export { search };