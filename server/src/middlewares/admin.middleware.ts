import { NextFunction, Request, Response } from 'express';

export function admin(req: Request, res: Response, next: NextFunction) {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'User is not an admin.' });
    }

    return next();
}
