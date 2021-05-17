import { Response, Request, NextFunction } from "express";
import { getCarouselService } from '../services/carousel';

const getCarousel = async (req:Request, res:Response, next: NextFunction) => {
    const result = await getCarouselService().catch((error:Error) => {
        res.status(405).send(error);
    });

    res.status(200).send(result);
};

export {getCarousel};