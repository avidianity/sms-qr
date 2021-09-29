import { User, Attendance } from '@prisma/client';
import { enc } from 'crypto-js';
import { FilesystemInterface } from './interfaces/filesystem.interface';
import { LoggerInterface } from './interfaces/logger.interface';
import { Workbook } from 'exceljs';
import dayjs from 'dayjs';

export function storage(): FilesystemInterface {
    const driver = config('filesystem.driver');
    const drivers = config(`filesystem.drivers`);

    return new drivers[driver]();
}

export function env(name: string, defaultValue = '') {
    const value = process.env[name];
    return value || defaultValue;
}

export function config(name: string) {
    const parts = name.split('.');
    const key = parts.shift();
    let config = require(`./config/${key}`).default;

    parts.forEach((part) => (config = config[part]));

    return config;
}

export async function makeAttendances(
    teachers: (User & { attendances: Attendance[] })[],
    user: User
) {
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

    const year = now.format('YYYY');
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
                    ...cell.style.fill,
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

    return workbook;
}

export function getLogger(): LoggerInterface {
    const className = config('logging.channel');
    const loggers = config('logging.drivers');

    return new loggers[className]();
}

export class Crypto {
    static encrypt(data: any): string {
        const key = config('encryption.key');
        const driver = config('encryption.driver');
        const cipher = config(`encryption.drivers.${driver}`);

        return cipher
            .encrypt(
                typeof data === 'string' ? data : JSON.stringify(data),
                key
            )
            .toString();
    }

    static decrypt<T = any>(payload: string): T {
        const key = config('encryption.key');
        const driver = config('encryption.driver');
        const cipher = config(`encryption.drivers.${driver}`);

        return JSON.parse(cipher.decrypt(payload, key).toString(enc.Utf8));
    }
}

const Months = [
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

const CalendarCells = [
    'B8',
    'C8',
    'D8',
    'E8',
    'F8',
    'G8',
    'H8',
    'B10',
    'C10',
    'D10',
    'E10',
    'F10',
    'G10',
    'H10',
    'B12',
    'C12',
    'D12',
    'E12',
    'F12',
    'G12',
    'H12',
    'B14',
    'C14',
    'D14',
    'E14',
    'F14',
    'G14',
    'H14',
    'B16',
    'C16',
    'D16',
    'E16',
    'F16',
    'G16',
    'H16',
    'B18',
    'C18',
    'D18',
    'E18',
    'F18',
    'G18',
    'H18',
];

export async function makeAttendancesIndividual(
    teacher: User & { attendances: Attendance[] },
    user: User
) {
    const workbook = new Workbook();

    const buffer = await storage().read('individual-template.xlsx');

    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet('Attendance');

    const now = dayjs();

    const year = now.format('YYYY');
    const month = now.get('month');

    // USER INFORMATION
    worksheet.getCell('D1').value = teacher.uuid;
    worksheet.getCell('D2').value = teacher.name;
    worksheet.getCell('D3').value = now.format('MMMM DD, YYYY hh:mm A');
    worksheet.getCell('L1').value = teacher.number;
    worksheet.getCell('L2').value = teacher.email;
    worksheet.getCell('L3').value = user.name;

    // CALENDAR
    worksheet.getCell('B5').value = `${Months[month]}, ${year}`;

    // CALENDAR SETTER

    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 0).getDay();
    const daysInCurrentMonth = new Date(
        date.getFullYear(),
        date.getMonth(),
        0
    ).getDate();

    let presents = 0;
    let absents = 0;

    // SET DAYS IN THE CALENDAR
    Array.from(Array(daysInCurrentMonth).keys()).forEach((index) => {
        const cell = worksheet.getCell(CalendarCells[firstDay + index + 1]);
        cell.value = index + 1;
    });

    // SET PRESENT OR WEEKEND
    teacher.attendances.forEach((attendance) => {
        const date = dayjs(attendance.createdAt);
        const cell = worksheet.getCell(CalendarCells[firstDay + date.date()]);

        const isWeekend = date.day() === 0 || date.day() === 6;

        cell.style = {
            ...cell.style,
            fill: {
                ...cell.style.fill,
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

    // SET ABSENT OR WEEKEND
    Array.from(Array(daysInCurrentMonth).keys()).forEach((index) => {
        const date = now.set('date', index + 1);

        const isWeekend = date.day() === 0 || date.day() === 6;

        const cell = worksheet.getCell(CalendarCells[firstDay + index + 1]);

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

    //SET FINAL
    worksheet.getCell('M8').value = presents;
    worksheet.getCell('M9').value = absents;

    return workbook;
}
