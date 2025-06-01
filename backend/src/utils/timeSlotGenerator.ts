import { TimeSlotStatus } from '../models/timeSlot.model';
import { format, addMinutes, parse, isWithinInterval } from 'date-fns';

interface TimeSlotGeneratorOptions {
  date: Date;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  serviceDuration: number; // in minutes
  serviceId: string;
}

interface GeneratedTimeSlot {
  date: Date;
  startTime: string;
  endTime: string;
  status: TimeSlotStatus;
  service: string;
}

export const generateTimeSlots = ({
  date,
  startTime,
  endTime,
  serviceDuration,
  serviceId,
}: TimeSlotGeneratorOptions): GeneratedTimeSlot[] => {
  const timeSlots: GeneratedTimeSlot[] = [];
  
  // Parse the start and end times
  const startDate = parse(startTime, 'HH:mm', date);
  const endDate = parse(endTime, 'HH:mm', date);
  
  // Current time slot start
  let currentStart = startDate;
  
  // Generate time slots until we reach the end time
  while (true) {
    // Calculate the end time of the current slot
    const currentEnd = addMinutes(currentStart, serviceDuration);
    
    // If the end time exceeds the working hours, break
    if (!isWithinInterval(currentEnd, { start: startDate, end: endDate })) {
      break;
    }
    
    // Format times as strings
    const slotStartTime = format(currentStart, 'HH:mm');
    const slotEndTime = format(currentEnd, 'HH:mm');
    
    // Create the time slot
    timeSlots.push({
      date: new Date(date),
      startTime: slotStartTime,
      endTime: slotEndTime,
      status: TimeSlotStatus.AVAILABLE,
      service: serviceId,
    });
    
    // Move to the next slot
    currentStart = currentEnd;
  }
  
  return timeSlots;
};