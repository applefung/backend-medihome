import winston from 'winston';

const options: winston.LoggerOptions = {
    transports: [
        new winston.transports.File({ filename: "./log/error.log", level: "debug" })
    ]
};

const logger = winston.createLogger(options);

export default logger;
