import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import pharmacyAuthorizationToken from '../models/pharmacyAuthorizationToken';
import pharmacyUser from '../models/pharmacyUser';
import pharmacy from '../models/pharmacy';
import { Request } from "express";
import moment from 'moment';
import { comparePassword, encrypt } from '../util/authentication';
import jwt from 'jsonwebtoken';

const loginService = async (req: Request) => {
    const { email, password } = req.body;
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    // check user exist
    pharmacy.hasMany(pharmacyUser, {foreignKey: 'pharmacy_id'});
    pharmacyUser.belongsTo(pharmacy, {foreignKey: 'pharmacy_id'});

    const pharmacyUserExistResult = await pharmacyUser.findOne({
        where: {
            email: email
        },
        include:
        [
            {
                model: pharmacy,
            }
        ],
    }).catch((error:Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0057'])), error);
        throw _.cloneDeep(externalErrorCode['E0057']);
    });
    // if not exist return
    if(_.isNil(pharmacyUserExistResult)){
        return _.cloneDeep(externalErrorCode['E0058']);
    }
    // get password from backend
    // compare it
    // if wrong return
    if(!comparePassword(password, pharmacyUserExistResult.dataValues.password)){
        return _.cloneDeep(externalErrorCode['E0059']);
    }
    // if correct generate jwt
    var privateKey = "medihome";
    var token = jwt.sign({ userEmail: pharmacyUserExistResult.dataValues.email}, privateKey, {
        expiresIn: '24h'  // expires in 4 hours
    });

    const expiredTime = moment().add(24, 'hours').format('YYYY-MM-DD HH:mm:ss');
    // put to authentication table
    const insertData = await pharmacyAuthorizationToken.create({
        token: token,
        pharmacy_user_id: pharmacyUserExistResult.dataValues.pharmacy_user_id,
        token_date: today,
        expired_date: expiredTime
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0060'])), error);
        throw _.cloneDeep(externalErrorCode['E0060']);
    });

    // return jwt
    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": {
            "Token": token,
            "PharmacyUser": pharmacyUserExistResult
        }
    };
};

export { loginService };