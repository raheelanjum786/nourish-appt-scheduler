import { TimeSlotStatus } from '../models/timeSlot.model';
import { format, addMinutes, parse, isWithinInterval } from 'date-fns';

interface TimeSlotGeneratorOptions {
  date: Date;
  startTime: string; 
  endTime: string;
  serviceDuration: number; 
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
  
  const startDate = parse(startTime, 'HH:mm', date);
  const endDate = parse(endTime, 'HH:mm', date);
  
  let currentStart = startDate;
  
  while (true) {
    const currentEnd = addMinutes(currentStart, serviceDuration);
    
    if (!isWithinInterval(currentEnd, { start: startDate, end: endDate })) {
      break;
    }
    
    const slotStartTime = format(currentStart, 'HH:mm');
    const slotEndTime = format(currentEnd, 'HH:mm');
    
    timeSlots.push({
      date: new Date(date),
      startTime: slotStartTime,
      endTime: slotEndTime,
      status: TimeSlotStatus.AVAILABLE,
      service: serviceId,
    });
    
    currentStart = currentEnd;
  }
  
  return timeSlots;
};