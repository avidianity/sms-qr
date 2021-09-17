import { Request, Response, NextFunction } from 'express';
import { getLogger } from '../helpers';

const logger = getLogger();

export function errorHandler(
    error: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    logger.error(error.message);

    return res.status(error.status || 500).json(error);
}
