import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Check if time slot is available
export const isTimeSlotAvailable = (
  existingAppointments: any[],
  date: Date,
  startTime: string,
  endTime: string
): boolean => {
  const formattedDate = formatDate(new Date(date));
  
  // Filter appointments for the same date
  const appointmentsOnSameDay = existingAppointments.filter(
    (appointment) => formatDate(new Date(appointment.date)) === formattedDate
  );

  // Check for time conflicts
  for (const appointment of appointmentsOnSameDay) {
    if (
      (startTime >= appointment.startTime && startTime < appointment.endTime) ||
      (endTime > appointment.startTime && endTime <= appointment.endTime) ||
      (startTime <= appointment.startTime && endTime >= appointment.endTime)
    ) {
      return false; // Time slot is not available
    }
  }

  return true; // Time slot is available
};