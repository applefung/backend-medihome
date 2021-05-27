import carousel from '../models/carousel';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';
import moment from 'moment';

const getCarouselService = async () => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const result = await carousel.findAll().catch((error:Error) => {
        logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0005'])), error);
        throw _.cloneDeep(externalErrorCode['E0005']);
    });

    return {
        "errCode": "E0000",
        "msg_en": "Success",
        "msg_chi": "成功",
        "msg_remark": result
    };
};

export { getCarouselService };