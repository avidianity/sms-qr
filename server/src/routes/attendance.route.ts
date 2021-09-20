import { Request, Response, Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware';
import { teacher } from '../middlewares/teacher.middleware';
import 'express-async-errors';
import { Workbook } from 'exceljs';
import { storage } from '../helpers';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { admin } from '../middlewares/admin.middleware';

const router = Router();

router.use(authenticate());

/**
 * TODO
 */
router.get('/teachers', admin, async (req: Request, res: Response) => {
    const client: PrismaClient = req.app.get('prisma');

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

    const workbook = new Workbook();

    const buffer = await storage().read('template.xlsx');

    await workbook.xlsx.load(buffer);
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
