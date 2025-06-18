import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isTimeSlotAvailable = (
  existingAppointments: any[],
  date: Date,
  startTime: string,
  endTime: string
): boolean => {
  const formattedDate = formatDate(new Date(date));
  
  const appointmentsOnSameDay = existingAppointments.filter(
    (appointment) => formatDate(new Date(appointment.date)) === formattedDate
  );

  for (const appointment of appointmentsOnSameDay) {
    if (
      (startTime >= appointment.startTime && startTime < appointment.endTime) ||
      (endTime > appointment.startTime && endTime <= appointment.endTime) ||
      (startTime <= appointment.startTime && endTime >= appointment.endTime)
    ) {
      return false; 
    }
  }

  return true; 
};

// Add these functions to your existing utils/index.ts file

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const addYears = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};