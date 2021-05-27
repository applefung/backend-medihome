  
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from 'cors';
import _ from 'lodash';
import logger from './util/logger';
import externalErrorCode from './util/errorCode/externalErrorCode.json';
import internalErrorCode from './util/errorCode/internalErrorCode.json';
import moment from 'moment';

//Database
import db from "./config/database";

// route
import route from './routes/route';
import { uuidv4 } from './util/general';
import chat from './models/chat';

// Or you can simply use a connection uri
db.authenticate()
     .then(() => console.log('Database connected...'))
     .catch((err: any) => console.log("Error "+err))

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// cors
app.use(cors());

app.use('/', route);

// socket
let http = require('http')
let socketio = require('socket.io');
let server = http.Server(app);
let websocket = socketio(server);
server.listen(3000, () => console.log('listening on *:3000'));

websocket.on('connection', (socket:any) => {

    socket.on('userJoined', (messageObject:any) => onUserJoined(messageObject, socket));
    socket.on('message', (messageObject:any) => onMessageReceived(messageObject, socket));
});

// Event listeners.
// When a user joins the chatroom.
const onUserJoined = (messageObject:any, socket:any) => {
    // if not exist then insert row to db
    if(messageObject.userType === "customer")
    {
          socket.emit('userJoined', messageObject.roomId);
          socket.join(messageObject.roomId);
     }
     else
     {
          socket.emit('userJoined', messageObject.roomId);
          socket.join(messageObject.roomId);
     }

}

// When a user sends a message in the chatroom.
const onMessageReceived = (messageObject:any, senderSocket:any) => {
  if(messageObject.userType == "customer")
  {
    _sendAndSaveMessage(messageObject, senderSocket);
  }
  else
  {
    _sendAndSaveMessage(messageObject, senderSocket);
  }

}

// Save the message to the db and send all sockets but the sender.
const _sendAndSaveMessage = async (messageObject:any, socket:any)=> {
     const today = moment().format("YYYY-MM-DD HH:mm:ss");
     const { customerUserId, pharmacyId } = messageObject;
     // save to db
     // get all conversation content from db, then append
     const chatExistResult = await chat.findOne({
          where: {
               customer_user_id: customerUserId,
               pharmacy_id: pharmacyId
          }
     }).catch((error: Error) => {
          logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0054'])), error);
          throw _.cloneDeep(externalErrorCode['E0054']);
     });

     if(_.isNil(chatExistResult)){
          
     }

     const oldContent = chatExistResult.dataValues.content;
     oldContent.content.push(messageObject.message);

     const updateChatResult = await chat.update(
          {
               content: oldContent
          },
          {
               where: {
                    customer_user_id: customerUserId,
                    pharmacy_id: pharmacyId
               }
          }
     ).catch((error: Error) => {
          logger.error(today, JSON.stringify(_.cloneDeep(internalErrorCode['I0055'])), error);
          throw _.cloneDeep(externalErrorCode['E0055']);
     });


     // send to frontend
     websocket.to(messageObject.roomId).emit('message', {"message": messageObject.message, "from": messageObject.userType});
}


let stdin = process.openStdin();
stdin.addListener('data', function(d) {
  _sendAndSaveMessage({"message": {
    _id: uuidv4(),
    text: d.toString().trim(),
    createdAt: new Date(),
    user: { _id: 'robot' }
  }}, null /* no socket */ /* send from server */);
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));
