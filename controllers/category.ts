import { Response, Request, NextFunction } from "express";
import { getCategoryService } from '../services/category';

const getCategory = async (req:Request, res:Response, next: NextFunction) => {
    const result = await getCategoryService().catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

export {getCategory};