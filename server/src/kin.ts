import { User, Attendance } from '@prisma/client';
import dayjs from 'dayjs';
import { Workbook } from 'exceljs';
import { storage } from './helpers';

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
  'B8', 'C8', 'D8', 'E8', 'F8', 'G8', 'H8',
  'B10', 'C10', 'D10', 'E10', 'F10', 'G10', 'H10',
  'B14', 'C14', 'D14', 'E14', 'F14', 'G14', 'H14',
  'B16', 'C16', 'D16', 'E16', 'F16', 'G16', 'H16',
  'B18', 'C18', 'D18', 'E18', 'F18', 'G18', 'H18'
]

export async function makeAttendances(
  teacher: (User & { attendances: Attendance[] }),
  user: User
) {
  const workbook = new Workbook();

    const buffer = await storage().read('template.xlsx');

    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet('Attendance');

    const now = dayjs();


    const year = now.format('MMMM');
    const month = now.get('month');

    // USER INFORMATION
    worksheet.getCell('C1').value = user.uuid;
    worksheet.getCell('C2').value = user.name;
    worksheet.getCell('C3').value = user.role;
    worksheet.getCell('L1').value = user.number;
    worksheet.getCell('L2').value = user.email;
    worksheet.getCell('L3').value = now.format('MMMM DD, YYYY hh:mm A');
 
    // CALENDAR
    worksheet.getCell('B5').value = `${Months[month]}, ${year}`

    // CALENDAR SETTER

    const date = new Date()
    let cursor = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); //INITIALIZE CURSOR ON RIGHT DATE ON THE CALENDAR

    teacher.attendances.forEach((attendance)=> {
      const date = dayjs(attendance.createdAt);

      const cell = worksheet.getCell(CalendarCells[cursor])
      const isWeekend = date.day() === 0 || date.day() === 6;

      cell.style = {
        ...cell.style,
        fill: {
          ...cell.style.fill,
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
              argb: isWeekend ? '808080' : '70AD47',
          }
      },
      }
    })
    
    return workbook;
}