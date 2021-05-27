import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import logger from '../util/logger';
import externalErrorCode from '../util/errorCode/externalErrorCode.json';
import internalErrorCode from '../util/errorCode/internalErrorCode.json';
import _ from 'lodash';

let transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: 'medigofyp@gmail.com',
      pass: 'medigofyp2020'
    }
}));
  

const sendGmail = (receiver: string, verificationCode: string, type: string) => {
      let mailOptions = {
        to: receiver,
        subject: 'Verification Code for '+ type,
        text: 'Verification Code for'+ type + " is "+ verificationCode
    };

    transporter.sendMail(mailOptions, (error:any, info:any) =>{
        if (error) {
            logger.error(JSON.stringify(_.cloneDeep(internalErrorCode['I0018'])), error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}


export {sendGmail};
