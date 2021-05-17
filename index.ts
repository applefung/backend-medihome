  
import express from "express";
import bodyParser from "body-parser";
import path from "path";
// import nodemailer from "nodemailer";
import cors from 'cors';

//Database
import db from "./config/database";

// route
import route from './routes/route';

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

const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`));
