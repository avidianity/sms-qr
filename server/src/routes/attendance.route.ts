import { Request, Response, Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware';
import { teacher } from '../middlewares/teacher.middleware';
import 'express-async-errors';
import { makeAttendances, makeAttendancesIndividual } from '../helpers';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { admin } from '../middlewares/admin.middleware';

const router = Router();

router.use(authenticate());

router.get('/attendances', admin, async (req: Request, res: Response) => {
    const client: PrismaClient = req.app.get('prisma');

    const user = req.user!;

    if (user === null || user.role !== 'ADMIN') {
        return res.status(401).send({ message: 'Unauthorized.' });
    }

    const start = dayjs().set('date', 1).toDate();
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    const teachers = await client.user.findMany({
        where: {
            role: 'TEACHER',
        },
        include: {
            attendances: {
                where: {
                    createdAt: {
                        lte: end,
                        gte: start,
                    },
                },
            },
        },
    });

    const workbook = await makeAttendances(teachers, user);

    const buffer = await workbook.xlsx.writeBuffer();

    return res
        .setHeader('Content-Length', buffer.byteLength)
        .setHeader(
            'Content-Disposition',
            'attachment; filename="attendances.xlsx"'
        )
        .send(buffer);
});

router.get('/self', teacher, async (req: Request, res: Response) => {
    const user = req.user!;

    const client: PrismaClient = req.app.get('prisma');

    const start = dayjs().set('date', 1).toDate();
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

    const attendances = await client.attendance.findMany({
        where: {
            userId: user.id,
            createdAt: {
                lte: end,
                gte: start,
            },
        },
    });

    const workbook = await makeAttendancesIndividual(
        { ...user, attendances },
        user
    );

    const buffer = await workbook.xlsx.writeBuffer();

    return res
        .setHeader('Content-Length', buffer.byteLength)
        .setHeader(
            'Content-Disposition',
            `attachment; filename="${user.id}-attendance.xlsx"`
        )
        .send(buffer);
});

export const attendanceRoutes = router;
