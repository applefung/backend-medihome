import { Response, Request, NextFunction } from "express";
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import moment from 'moment';
import authenticationToken from '../models/authenticationToken';

const authToken = async (req: Request, res: Response, next: NextFunction )=> {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");

    const customerUserId  = req.body.customerUserId===undefined?req.query.customerUserId:req.body.customerUserId;

    const bearerToken = req.headers.authorization;
    const token = bearerToken?.split(' ')[1];

    const result = await authenticationToken.findOne({
        where: {
            token: token,
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0038'])), error);
        return res.status(405).send(_.cloneDeep(externalErrorCode['E0038']));
    });

    // if token exist
    if(_.isNil(result)){
        return res.status(405).send(externalErrorCode['E0039']);
    }
    // if token expired
    const isExpired = moment(today).isAfter(result.dataValues.expired_date);
    if(isExpired){
        return res.status(405).send(externalErrorCode['E0040']);
    }

    // if token customer user match with the customer user id
    if(parseInt(customerUserId) !== result.dataValues.customer_user_id){
        return res.status(405).send(externalErrorCode['E0041']);
    }

    next();
};

export default authToken;