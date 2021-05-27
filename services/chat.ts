import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _, { fromPairs } from 'lodash';
import moment from 'moment';
import { Request } from "express";
import chat from '../models/chat';
import pharmacy from '../models/pharmacy';
import customerUser from '../models/customerUser';
import { uuidv4 } from '../util/general';

const getRoomService = async (req: Request) => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { customerUserId, pharmacyId } = req.query;
    // check whether there is an existing chat
    const chatExistResult = await chat.findOne({
        where: {
            customer_user_id: customerUserId,
            pharmacy_id: pharmacyId
        }
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0052'])), error);
        throw _.cloneDeep(externalErrorCode['E0052']);
    });

    // if no room
    if(_.isNil(chatExistResult)){
        //generate new room 
        const roomId = uuidv4();
        // insert with pharmacy id
        const createChatResult = await chat.create({
            room_id: roomId,
            customer_user_id: customerUserId,
            pharmacy_id: pharmacyId,
            content: {"content":[]}
        }).catch((error: Error) => {
            logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0053'])), error);
            throw _.cloneDeep(externalErrorCode['E0053']);
        });

        // return new room id
        return {
            "errCode": "E0000",
            "msg_en": "Success",
            "msg_chi": "成功",
            "msg_remark": createChatResult
        };
    }

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": chatExistResult
    };
};

const getPharmacyFriendListService = async (req: Request)=> {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { pharmacyId } = req.query;

    customerUser.hasMany(chat, {foreignKey: 'customer_user_id'});
    chat.belongsTo(customerUser, {foreignKey: 'customer_user_id'});

    const resp = await chat.findAll({
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
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0061'])), error);
        throw _.cloneDeep(externalErrorCode['E0061']);
    });

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": resp
    };
};

const getCustomerFriendListService = async (req: Request)=> {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const { customerUserId } = req.query;

    pharmacy.hasMany(chat, {foreignKey: 'pharmacy_id'});
    chat.belongsTo(pharmacy, {foreignKey: 'pharmacy_id'});

    const resp = await chat.findAll({
        where: {
            customer_user_id: customerUserId
        },
        include:
        [
            {
                model: pharmacy,
            }
        ],
    }).catch((error: Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0062'])), error);
        throw _.cloneDeep(externalErrorCode['E0062']);
    });

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": resp
    };
};

export { getRoomService, getPharmacyFriendListService, getCustomerFriendListService };