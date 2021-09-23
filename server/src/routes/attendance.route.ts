import { Request, Response, Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware';
import { teacher } from '../middlewares/teacher.middleware';
import 'express-async-errors';
import { Workbook } from 'exceljs';
import { makeAttendances, storage } from '../helpers';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { admin } from '../middlewares/admin.middleware';

const router = Router();

router.get(
    '/attendances',
    authenticate(),
    admin,
    async (req: Request, res: Response) => {
        const client: PrismaClient = req.app.get('prisma');

        const user = await client.user.findFirst({
            where: {
                uuid: req.params.uuid,
            },
        });

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
    }
);

router.get('/:uuid/attendance.xlsx', async (req: Request, res: Response) => {
    const client: PrismaClient = req.app.get('prisma');

    const user = await client.user.findFirst({
        where: {
            uuid: req.params.uuid,
        },
    });

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

/**
 * TODO
 */
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

    const workbook = new Workbook();

    const buffer = await storage().read('template.xlsx');

    await workbook.xlsx.load(buffer);
});

export const attendanceRoutes = router;
