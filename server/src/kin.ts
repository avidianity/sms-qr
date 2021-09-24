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
  'B12', 'C12', 'D12', 'E12', 'F12', 'G12', 'H12',
  'B14', 'C14', 'D14', 'E14', 'F14', 'G14', 'H14',
  'B16', 'C16', 'D16', 'E16', 'F16', 'G16', 'H16',
  'B18', 'C18', 'D18', 'E18', 'F18', 'G18', 'H18'
]

export async function makeAttendancesIndividual(
  teacher: (User & { attendances: Attendance[] }),
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
    worksheet.getCell('D1').value = user.uuid;
    worksheet.getCell('D2').value = user.name;
    worksheet.getCell('D3').value = now.format('MMMM DD, YYYY hh:mm A');
    worksheet.getCell('L1').value = user.number;
    worksheet.getCell('L2').value = user.email;
    worksheet.getCell('L3').value = user.role;

    // CALENDAR
    worksheet.getCell('B5').value = `${Months[month]}, ${year}`;

    // CALENDAR SETTER

    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 0).getDay();
    const daysInCurrentMonth = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

    let presents=0;
    let absents=0;

    // SET DAYS IN THE CALENDAR
    Array.from(Array(daysInCurrentMonth).keys()).forEach((index)=> {
      const cell = worksheet.getCell(CalendarCells[firstDay+index+1]);
      cell.value = index+1;
    })

    // SET PRESENT OR WEEKEND
    teacher.attendances.forEach((attendance)=>{
      const date = dayjs(attendance.createdAt);
      const cell = worksheet.getCell(CalendarCells[firstDay+date.date()]);

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
    })

    // SET ABSENT OR WEEKEND
    Array.from(Array(daysInCurrentMonth).keys()).forEach((index)=> {
      const date = now.set('date', index + 1);

      const isWeekend = date.day() === 0 || date.day() === 6;

      const cell = worksheet.getCell(CalendarCells[firstDay+index+1]);

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
    })
    
    //SET FINAL
    worksheet.getCell('M8').value = presents;
    worksheet.getCell('M9').value = absents;

    
    return workbook;
}