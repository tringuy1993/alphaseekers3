interface DateMapObject {
  date: string;
  dateNumber: number;
}

interface NextDateParams {
  currentDate?: Date;
  targetDayName: string;
}

const DATEMAP: DateMapObject[] = [
  { date: 'Monday', dateNumber: 1 },
  { date: 'Tuesday', dateNumber: 2 },
  { date: 'Wednesday', dateNumber: 3 },
  { date: 'Thursday', dateNumber: 4 },
  { date: 'Friday', dateNumber: 5 },
  { date: 'Saturday', dateNumber: 6 },
];

export function getNextDate({
  currentDate = new Date(),
  targetDayName = 'Friday',
}: NextDateParams) {
  const dateCopy = new Date(currentDate.getTime());
  dateCopy.setHours(0, 0, 0, 0); // Normalize the time part of currentDate to midnight

  const dayNumber = DATEMAP.find((element) => element.date === targetDayName)?.dateNumber;

  // Calculate days until the target day
  let daysUntilTarget = (7 - dateCopy.getDay() + dayNumber) % 7;

  // If it's 0 (same day), set to 7
  daysUntilTarget = daysUntilTarget === 0 ? 7 : daysUntilTarget;

  const nextDate = new Date(dateCopy.setDate(dateCopy.getDate() + daysUntilTarget));
  nextDate.setHours(0, 0, 0, 0);

  return nextDate;
}
