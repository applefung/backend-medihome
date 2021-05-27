import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import { Request } from "express";
import moment from 'moment';
import pharmacyComment from '../models/pharmacyComment';
import customerUser from '../models/customerUser';

const getAllPharmacyCommentService = async(req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { pharmacyId } = req.query;

    customerUser.hasMany(pharmacyComment, {foreignKey: 'customer_user_id'});
    pharmacyComment.belongsTo(customerUser, {foreignKey: 'customer_user_id'});
    
    const resp = await pharmacyComment.findAll({
        where: {
            pharmacy_id: pharmacyId
        },
        include:
        [
            {
                model: customerUser,
            }
        ],
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0069'])), error);
        throw _.cloneDeep(externalErrorCode['E0069']);
    });

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": resp
    };
};

const postPharmacyCommentService = async (req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { pharmacyId, customerUserId, content, rating } = req.body;
    const resp = await pharmacyComment.create({
        pharmacy_id: pharmacyId,
        customer_user_id: customerUserId,
        content: content,
        rating: rating,
        comment_date: today
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0070'])), error);
        throw _.cloneDeep(externalErrorCode['E0070']);
    });

    customerUser.hasMany(pharmacyComment, {foreignKey: 'customer_user_id'});
    pharmacyComment.belongsTo(customerUser, {foreignKey: 'customer_user_id'});

    const allPharmacyCommentResult = await pharmacyComment.findAll({
        where: {
            pharmacy_id: pharmacyId
        },
        include:
        [
            {
                model: customerUser,
            }
        ],
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0071'])), error);
        throw _.cloneDeep(externalErrorCode['E0071']);
    });


    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": allPharmacyCommentResult
    };
};

export { getAllPharmacyCommentService, postPharmacyCommentService };