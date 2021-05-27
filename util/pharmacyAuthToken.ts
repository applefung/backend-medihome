import { Response, Request, NextFunction } from "express";
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import moment from 'moment';
import pharmacyAuthorizationToken from '../models/pharmacyAuthorizationToken';

const pharmacyAuthToken = async (req: Request, res: Response, next: NextFunction )=> {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");

    const pharmacyUserId  = req.body.pharmacyUserId===undefined?req.query.pharmacyUserId:req.body.pharmacyUserId;
    const pharmacyId  = req.body.pharmacyId===undefined?req.query.pharmacyId:req.body.pharmacyId;

    const bearerToken = req.headers.authorization;

    const token = bearerToken?.split(' ')[1];

    const pharmacyAuthTokenResult = await pharmacyAuthorizationToken.findOne({
        where: {
            token: token,
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0038'])), error);
        return res.status(405).send(_.cloneDeep(externalErrorCode['E0038']));
    });

    // if token exist
    if(_.isNil(pharmacyAuthTokenResult) || pharmacyAuthTokenResult.length === 0){
        return res.status(405).send(externalErrorCode['E0039']);
    }
    // if token expired

    const isExpired = moment(today).isAfter(pharmacyAuthTokenResult.dataValues.expired_date);
    if(isExpired){
        return res.status(405).send(externalErrorCode['E0040']);
    }

    // if token pharmacy_user_id match with the pharmacy_user_id
    if(parseInt(pharmacyUserId) !== pharmacyAuthTokenResult.dataValues.pharmacy_user_id && parseInt(pharmacyId) !== pharmacyAuthTokenResult.dataValues.pharmacy_user_id){
        return res.status(405).send(externalErrorCode['E0041']);
    }

    next();
};

export default pharmacyAuthToken;