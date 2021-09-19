import { NextFunction, Request, Response } from 'express';

export function teacher(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role !== 'TEACHER') {
        return res.status(403).json({ message: 'User is not a teacher.' });
    }

    return next();
}
