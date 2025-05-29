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