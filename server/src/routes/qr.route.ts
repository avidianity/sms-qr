import Client from '@avidian/semaphorejs';
import { PrismaClient, User } from '@prisma/client';
import dayjs from 'dayjs';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { config, Crypto } from '../helpers';
import { admin } from '../middlewares/admin.middleware';
import authenticate from '../middlewares/authenticate.middleware';
import { teacher } from '../middlewares/teacher.middleware';
import validate from '../middlewares/validate.middleware';
import 'express-async-errors';

const router = Router();

router.use(authenticate());

router.get('/:id', teacher, async (req: Request, res: Response) => {
    const client: PrismaClient = req.app.get('prisma');

    const teacher = await client.user.findFirst({
        where: {
            id: req.params.id.toNumber(),
            role: 'TEACHER',
        },
    });

    if (!teacher) {
        return res.status(404).json({ message: 'Teacher does not exist.' });
    }

    return res.send(
        Crypto.encrypt({
            id: teacher.id,
            uuid: teacher.uuid,
            email: teacher.email,
            date: new Date().toJSON(),
        })
    );
});

router.post(
    '/parse',
    admin,
    [body('payload').isString().notEmpty()],
    validate,
    async (req: Request, res: Response) => {
        const client: PrismaClient = req.app.get('prisma');

        const { payload } = req.body;

        const { id } = Crypto.decrypt<User>(payload);

        const teacher = await client.user.findFirst({
            where: {
                id,
                role: 'TEACHER',
            },
        });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher does not exist.' });
        }

        const now = dayjs();

        let attendance = await client.attendance.findFirst({
            where: {
                userId: teacher.id,
                createdAt: {
                    gte: new Date(
                        `${now.year()}-${now.month() + 1}-${now.date()}`
                    ),
                    lt: new Date(
                        `${now.year()}-${now.month() + 1}-${now.date() + 1}`
                    ),
                },
            },
        });

        if (!attendance) {
            attendance = await client.attendance.create({
                data: {
                    userId: teacher.id,
                },
            });
        } else {
            await client.attendance.update({
                where: {
                    id: attendance.id,
                },
                data: {
                    updatedAt: new Date(),
                },
            });
        }

        const env = config('app.env');

        const admins = await client.user.findMany({
            where: {
                role: 'ADMIN',
            },
        });

        const semaphore = new Client(config('semaphore.token'), {
            baseUrl: config(`semaphore.urls.${env}`),
        });

        try {
            await semaphore.send(
                admins.map((admin) => admin.number),
                `Teacher ${teacher.name} has scanned the QR at ${dayjs(
                    attendance.createdAt
                ).format('MMMM DD, YYYY hh:mm A')}`
            );

            await semaphore.send(
                teacher.number,
                `You (${teacher.name}) has scanned your QR at ${dayjs(
                    attendance.createdAt
                ).format('MMMM DD, YYYY hh:mm A')}`
            );
        } catch (error: any) {
            return res
                .status(error.response?.status || 500)
                .json(error.toObject());
        }

        return res.status(201).json({ attendance, teacher });
    }
);

export const qrRoutes = router;
