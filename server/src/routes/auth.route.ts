import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { v4 } from 'uuid';
import { compare, hash } from 'bcrypt';
import { config } from '../helpers';
import { body } from 'express-validator';
import validate from '../middlewares/validation.middleware';
import authenticate from '../middlewares/authenticate.middleware';
import { unique } from '../validators/unique.validator';

const router = Router();

router.post(
    '/register',
    [
        body('email').isEmail().custom(unique<User>('user', 'email')),
        body('password').isStrongPassword(),
        body('name').isString().notEmpty(),
        body('number').isString().notEmpty(),
    ],
    validate,
    async (req: Request, res: Response) => {
        const { email, name, password, number } = req.body;

        const client: PrismaClient = req.app.get('prisma');

        const user = await client.user.create({
            data: {
                uuid: v4(),
                email,
                name,
                password: await hash(password, 8),
                role: 'TEACHER',
                number,
            },
        });

        const token = jwt.sign({ uuid: user.uuid }, config('jwt.key'), {
            expiresIn: config('jwt.expiry'),
        });

        return res.status(201).json({ token });
    }
);

router.post(
    '/login',
    [body('email').isEmail(), body('password').isString().notEmpty()],
    validate,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const client: PrismaClient = req.app.get('prisma');

        const user = await client.user.findFirst({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User does not exist.' });
        }

        if (!(await compare(password, user.password))) {
            return res.status(401).json({ message: 'Password is incorrect.' });
        }

        const token = jwt.sign(
            { uuid: user.uuid, role: user.role },
            config('jwt.key'),
            {
                expiresIn: config('jwt.expiry'),
            }
        );

        return res.status(201).json({ token });
    }
);

router.get('/check', authenticate(), (req: Request, res: Response) => {
    return res.json({
        user: req.user,
        token: jwt.sign(
            { uuid: req.user?.uuid, role: req.user?.role },
            config('jwt.key'),
            {
                expiresIn: config('jwt.expiry'),
            }
        ),
    });
});

export const authRoute = router;
