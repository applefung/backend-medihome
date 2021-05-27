import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _, { constant } from 'lodash';
import customerUser from '../models/customerUser';
import authenticationToken from '../models/authenticationToken';
import { Request } from "express";
import { comparePassword, encrypt } from '../util/authentication';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { randomVerificationCode } from '../util/general';
import { sendGmail } from '../util/sendEmail';

const loginService = async (req: Request) => {
    const { email, password } = req.body;
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    // check user exist
    const customerUserExistResult = await customerUser.findOne({
        where: {
            email: email
        },
    }).catch((error:Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0016'])), error);
        throw _.cloneDeep(externalErrorCode['E0016']);
    });
    // if not exist return
    if(_.isNil(customerUserExistResult)){
        return _.cloneDeep(externalErrorCode['E0014']);
    }
    // get password from backend
    // compare it
    // if wrong return
    if(!comparePassword(password, customerUserExistResult.dataValues.password)){
        return _.cloneDeep(externalErrorCode['E0015']);
    }
    // if correct generate jwt
    var privateKey = "medihome";
    var token = jwt.sign({ userEmail: customerUserExistResult.dataValues.email}, privateKey, {
        expiresIn: '24h'  // expires in 4 hours
    });

    const expiredTime = moment().add(24, 'hours').format('YYYY-MM-DD HH:mm:ss');
    // put to authentication table
    const insertData = await authenticationToken.create({
        token: token,
        customer_user_id: customerUserExistResult.dataValues.customer_user_id,
        token_date: today,
        expired_date: expiredTime
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0017'])), error);
        throw _.cloneDeep(externalErrorCode['E0017']);
    });        
    // return jwt
    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": {
            "Token": token,
            "CustomerUser": {
                "customer_user_id": customerUserExistResult.dataValues.customer_user_id,
                "email": customerUserExistResult.dataValues.email,
                "name": customerUserExistResult.dataValues.name,
                "shopping_cart_items": customerUserExistResult.dataValues.shopping_cart_items,
                "bookmark": customerUserExistResult.dataValues.bookmark,
            }
        }
    };
};

const signUpSendVerificationCodeService = async (req: Request) => {
    const { email } = req.body;
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    // check if user exist
    const customerUserExistResult = await customerUser.findOne({
        where: {
            email: email
        }
    }).catch((error:Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0019'])), error);
        throw _.cloneDeep(externalErrorCode['E0019']);
    });

    // generate verification code
    const verificationCode = randomVerificationCode();
    // if exist then update
    if(!_.isNil(customerUserExistResult)){
        const resp = await customerUser.update(
            {
                verification_code: verificationCode,
                registered_date: today,
            },
            {
                where: {
                    email: email,
                }
        }).catch((error:Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0020'])), error);
            throw _.cloneDeep(externalErrorCode['E0020']);
        });
    }
    else{
        // if not continue
        // insert user data to db with verifcation code
        const resp = await customerUser.create({
            email: email,
            verification_code: verificationCode,
            registered_date: today,
            shopping_cart_items: {}
        }).catch((error:Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0021'])), error);
            throw _.cloneDeep(externalErrorCode['E0021']);
        });
    }

    // send verification code
    const sendEmailResult = sendGmail(email, verificationCode, "Signup");

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": "E0000"
    };

};

const signUpService = async (req: Request) => {
    // check if user exist
    const { email, name, password, verificationCode } = req.body;
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    // check if user exist
    const customerUserExistResult = await customerUser.findOne({
        where: {
            email: email
        }
    }).catch((error:Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0022'])), error);
        throw _.cloneDeep(externalErrorCode['E0022']);
    });
    // if not exist then return
    if(_.isNil(customerUserExistResult)){
        return _.cloneDeep(externalErrorCode['E0023']);
    }
    // if exist continue
    // compare verification code
    if(customerUserExistResult.dataValues.verification_code !== verificationCode){
        return _.cloneDeep(externalErrorCode['E0024']);
    }
    // if wrong return
    // if yes
    // hash password
    const hashedPassword = encrypt(password);
    // update user data to db with password
    const updateCustomerUser = await customerUser.update(
        {
            name: name,
            password: hashedPassword
        },
        {
            where: {
                email: email
            }
        }
    ).catch((error:Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0025'])), error);
        throw _.cloneDeep(externalErrorCode['E0025']);
    });

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": "E0000"
    };
};

const forgotPasswordSendVerificationCodeService = async (req: Request) => {
    const { email } = req.body;
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    // check if user exist
    const customerUserExistResult = await customerUser.findOne({
        where: {
            email: email
        }
    }).catch((error:Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0027'])), error);
        throw _.cloneDeep(externalErrorCode['E0027']);
    });

    // generate verification code
    // if not exist then update
    if(_.isNil(customerUserExistResult)){
        return _.cloneDeep(externalErrorCode['E0026']);
    }

    const verificationCode = randomVerificationCode();
    const resp = await customerUser.update(
        {
            verification_code: verificationCode,
            registered_date: today,
        },
        {
            where: {
                email: email,
            }
    }).catch((error:Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0028'])), error);
        throw _.cloneDeep(externalErrorCode['E0028']);
    });

    // send verification code
    const sendEmailResult = sendGmail(email, verificationCode, "Change Password");

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": "E0000"
    };

};

const forgotPasswordService = async (req: Request) => {
    // check if user exist
    const { email, password, verificationCode } = req.body;
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    // check if user exist
    const customerUserExistResult = await customerUser.findOne({
        where: {
            email: email
        }
    }).catch((error:Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0029'])), error);
        throw _.cloneDeep(externalErrorCode['E0029']);
    });
    // if not exist then return
    if(_.isNil(customerUserExistResult)){
        return _.cloneDeep(externalErrorCode['E0030']);
    }
    // if exist continue
    // compare verification code
    if(customerUserExistResult.dataValues.verification_code !== verificationCode){
        return _.cloneDeep(externalErrorCode['E0031']);
    }
    // if wrong return
    // if yes
    // hash password
    const hashedPassword = encrypt(password);
    // update user data to db with password
    const updateCustomerUser = await customerUser.update(
        {
            password: hashedPassword
        },
        {
            where: {
                email: email
            }
        }
    ).catch((error:Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0032'])), error);
        throw _.cloneDeep(externalErrorCode['E0032']);
    });

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": "E0000"
    };
};

const editPersonalInformationService = async (req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { key, value, customerUserId } = req.body;

    const updateCustomerUserResult = await customerUser.update(
        {
            name: value
        },
        {
            where: {
                customer_user_id: customerUserId
            }
        }
    ).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0067'])), error);
        throw _.cloneDeep(externalErrorCode['E0067']);
    });

    const returnCustomerUserResult = await customerUser.findOne({
        where: {
            customer_user_id: customerUserId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0067'])), error);
        throw _.cloneDeep(externalErrorCode['E0067']);
    });

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": returnCustomerUserResult
    };
};

const getAllBookmarkService = async (req: Request)=> {
    const { customerUserId } = req.query;
    const customerUserExistResult = await customerUser.findOne({
        where: {
            customer_user_id: customerUserId
        }
    }).catch((error: Error) => {

    });
};

const createNewBookmarkService = async (req: Request)=> {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { customerUserId, pharmacyId, type } = req.body;
    const customerUserExistResult = await customerUser.findOne({
        where: {
            customer_user_id: customerUserId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0072'])), error);
        throw _.cloneDeep(externalErrorCode['E0072']);
    });
    // is null then return
    const oldBook = customerUserExistResult.dataValues.bookmark;
    let oldBookmarkArray:any=[];
    if(oldBook !== null && oldBook !== " " && oldBook !== ""){
        if(oldBook.includes(pharmacyId) && type === 1){
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0073'])));
            return _.cloneDeep(externalErrorCode['E0073']);
        }
        oldBookmarkArray = _.split(oldBook, ',')
    }

    let tempArray = [];

    if(type === 0){
        // cancel
        const removeIndex = oldBookmarkArray.indexOf(pharmacyId);
        oldBookmarkArray.splice(removeIndex, 1)
        tempArray = _.cloneDeep(oldBookmarkArray);
    }
    else{
        // add
        oldBookmarkArray.push(pharmacyId);
        oldBookmarkArray.sort();
        tempArray = _.cloneDeep(oldBookmarkArray);
    }
    
    const updateBookmark = await customerUser.update(
        {
            bookmark: tempArray.toString()
        },
        {
            where: {
                customer_user_id: customerUserId
            }
        }
    ).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0074'])), error);
        throw _.cloneDeep(externalErrorCode['E0074']);
    });

    const resp = await customerUser.findOne({
        where: {
            customer_user_id: customerUserId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0075'])), error);
        throw _.cloneDeep(externalErrorCode['E0075']);
    });

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": resp
    };
};

export { loginService, signUpSendVerificationCodeService, signUpService, forgotPasswordSendVerificationCodeService, forgotPasswordService, editPersonalInformationService, createNewBookmarkService };