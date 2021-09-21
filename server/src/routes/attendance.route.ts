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

// router.use(authenticate());

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

    const workbook = new Workbook();

    const buffer = await storage().read('template.xlsx');

    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet('Attendance');

    const now = dayjs();

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const days = [
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'AA',
        'AB',
        'AC',
        'AD',
        'AE',
        'AF',
        'AG',
    ];

    const year = now.format('MMMM');
    const month = now.get('month');

    worksheet.getCell('W2').value = now.format('MMMM DD, YYYY hh:mm A');
    worksheet.getCell('C2').value = user.name;
    worksheet.getCell('W1').value = months[month];
    worksheet.getCell('AG1').value = year;

    const cursor = 6;

    teachers.forEach((teacher, teacherIndex) => {
        worksheet.getCell(`A${cursor + teacherIndex}`).value = teacher.uuid;
        worksheet.getCell(`B${cursor + teacherIndex}`).value = teacher.name;

        let presents = 0;
        let absents = 0;

        teacher.attendances.forEach((attendance) => {
            const date = dayjs(attendance.createdAt);

            const cell = worksheet.getCell(
                `${days[date.date() - 1]}${cursor + teacherIndex}`
            );

            const isWeekend = date.day() === 0 || date.day() === 6;

            cell.style = {
                ...cell.style,
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: isWeekend ? '808080' : '70AD47',
                    },
                },
            };

            if (!isWeekend) {
                presents++;
            }
        });

        Array.from(Array(31).keys()).forEach((index) => {
            const date = now.set('date', index + 1);

            const isWeekend = date.day() === 0 || date.day() === 6;

            const cell = worksheet.getCell(
                `${days[index]}${cursor + teacherIndex}`
            );

            if (
                !(
                    cell.style.fill?.type === 'pattern' &&
                    cell.style.fill.fgColor?.argb &&
                    ['808080', '70AD47'].includes(cell.style.fill.fgColor.argb)
                )
            ) {
                cell.style = {
                    ...cell.style,
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: {
                            argb: isWeekend ? '808080' : 'FF0000',
                        },
                    },
                };
                if (!isWeekend) {
                    absents++;
                }
            }
        });

        worksheet.getCell(`AH${cursor + teacherIndex}`).value = presents;
        worksheet.getCell(`AI${cursor + teacherIndex}`).value = absents;
    });

    return res.send(await workbook.xlsx.writeBuffer());
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
