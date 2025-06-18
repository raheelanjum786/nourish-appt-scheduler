import { Request, Response } from 'express';
import TimeSlot, { TimeSlotStatus } from '../models/timeSlot.model';
import Service from '../models/service.model';
import { generateTimeSlots } from '../utils/timeSlotGenerator';
import mongoose, { Document } from 'mongoose';
import Appointment, { AppointmentStatus } from '../models/appointment.model';
import { formatDate } from '../utils';

interface ServiceDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  duration: number;
  isActive: boolean;
}

export const getAllTimeSlots = async (req: Request, res: Response) => {
  try {
    const { date, status, service } = req.query;
    
    const filter: any = {};
    
    if (date) {
      const startDate = new Date(date as string);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      
      filter.date = { $gte: startDate, $lte: endDate };
    }
    
    if (status) {
      filter.status = status;
    } 
    
    if (service) {
      filter.service = service;
    }
    
    const timeSlots = await TimeSlot.find(filter)
      .populate('service', 'name duration')
      .populate({
        path: 'appointment',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .sort({ date: 1, startTime: 1 });
    
    res.status(200).json(timeSlots);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTimeSlotById = async (req: Request, res: Response) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.id)
      .populate('service', 'name duration')
      .populate({
        path: 'appointment',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });
    
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    
    res.status(200).json(timeSlot);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTimeSlot = async (req: Request, res: Response) => {
  try {
    const { date, startTime, endTime, service } = req.body;
    
    const existingTimeSlot = await TimeSlot.findOne({
      date: new Date(date),
      startTime,
      endTime,
    });
    
    if (existingTimeSlot) {
      return res.status(400).json({ message: 'A time slot already exists for this date and time' });
    }
    
    const timeSlot = await TimeSlot.create({
      date,
      startTime,
      endTime,
      service,
      status: TimeSlotStatus.AVAILABLE,
    });
    
    res.status(201).json(timeSlot);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBulkTimeSlots = async (req: Request, res: Response) => {
  try {
    const { slots } = req.body;
    
    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of time slots' });
    }
    
    const createdSlots = [];
    const errors = [];
    
    for (const slot of slots) {
      const { date, startTime, endTime, service } = slot;
      
      try {
        const existingTimeSlot = await TimeSlot.findOne({
          date: new Date(date),
          startTime,
          endTime,
        });
        
        if (!existingTimeSlot) {
          const newTimeSlot = await TimeSlot.create({
            date,
            startTime,
            endTime,
            service,
            status: TimeSlotStatus.AVAILABLE,
          });
          
          createdSlots.push(newTimeSlot);
        } else {
          errors.push(`Time slot for ${date} from ${startTime} to ${endTime} already exists`);
        }
      } catch (error: any) {
        errors.push(`Error creating time slot for ${date} from ${startTime} to ${endTime}: ${error.message}`);
      }
    }
    
    res.status(201).json({
      createdSlots,
      errors: errors.length > 0 ? errors : undefined,
      message: `Created ${createdSlots.length} time slots${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTimeSlot = async (req: Request, res: Response) => {
  try {
    const { date, startTime, endTime, status, service } = req.body;
    
    const timeSlot = await TimeSlot.findById(req.params.id);
    
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    
    if (timeSlot.status === TimeSlotStatus.BOOKED && 
        (date !== undefined || startTime !== undefined || endTime !== undefined)) {
      return res.status(400).json({ 
        message: 'Cannot change date or time of a booked time slot' 
      });
    }
    
    if (date !== undefined) timeSlot.date = new Date(date);
    if (startTime !== undefined) timeSlot.startTime = startTime;
    if (endTime !== undefined) timeSlot.endTime = endTime;
    if (status !== undefined) timeSlot.status = status;
    if (service !== undefined) timeSlot.service = service;
    
    const updatedTimeSlot = await timeSlot.save();
    
    res.status(200).json(updatedTimeSlot);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTimeSlot = async (req: Request, res: Response) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.id);
    
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    
    if (timeSlot.status === TimeSlotStatus.BOOKED) {
      return res.status(400).json({ 
        message: 'Cannot delete a booked time slot' 
      });
    }
    
    await timeSlot.deleteOne();
    
    res.status(200).json({ message: 'Time slot deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableTimeSlots = async (req: Request, res: Response) => {
  try {
    const { date, serviceId } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    
    const filter: any = {
      date: new Date(date as string),
      status: TimeSlotStatus.AVAILABLE,
    };
    
    if (serviceId) {
      filter.service = serviceId;
    }
    
    const timeSlots = await TimeSlot.find(filter)
      .sort({ startTime: 1 });
    
    res.status(200).json(timeSlots);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const bookTimeSlot = async (req: Request, res: Response) => {
  try {
    const { timeSlotId, appointmentId } = req.body;
    
    const timeSlot = await TimeSlot.findById(timeSlotId);
    
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    
    if (timeSlot.status === TimeSlotStatus.BOOKED) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    timeSlot.appointment = appointmentId;
    timeSlot.status = TimeSlotStatus.BOOKED;
    await timeSlot.save();
    
    appointment.date = timeSlot.date;
    appointment.startTime = timeSlot.startTime;
    appointment.endTime = timeSlot.endTime;
    appointment.status = AppointmentStatus.CONFIRMED;
    await appointment.save();
    
    res.status(200).json({ 
      message: 'Time slot booked successfully',
      timeSlot,
      appointment
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const releaseTimeSlot = async (req: Request, res: Response) => {
  try {
    const { timeSlotId } = req.body;
    
    const timeSlot = await TimeSlot.findById(timeSlotId);
    
    if (!timeSlot) {
      return res.status(404).json({ message: 'Time slot not found' });
    }
    
    if (timeSlot.status !== TimeSlotStatus.BOOKED) {
      return res.status(400).json({ message: 'This time slot is not booked' });
    }
    
    if (timeSlot.appointment) {
      const appointment = await Appointment.findById(timeSlot.appointment);
      if (appointment && appointment.status !== AppointmentStatus.CANCELLED) {
        appointment.status = AppointmentStatus.CANCELLED;
        await appointment.save();
      }
    }
    
    timeSlot.appointment = undefined;
    timeSlot.status = TimeSlotStatus.AVAILABLE;
    await timeSlot.save();
    
    res.status(200).json({ 
      message: 'Time slot released successfully',
      timeSlot
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const generateTimeSlotsForService = async (req: Request, res: Response) => {
  try {
    const { serviceId, date, startTime = '09:00', endTime = '17:00' } = req.body;
    
    if (!serviceId || !date) {
      return res.status(400).json({ message: 'Service ID and date are required' });
    }
    
    const service = await Service.findById(serviceId) as ServiceDocument;
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const slotDate = new Date(date);
    
    const timeSlots = generateTimeSlots({
      date: slotDate,
      startTime,
      endTime,
      serviceDuration: service.duration,
      serviceId: service._id.toString(),
    });
    
    const existingSlots = await TimeSlot.find({
      date: {
        $gte: new Date(slotDate.setHours(0, 0, 0, 0)),
        $lt: new Date(slotDate.setHours(23, 59, 59, 999)),
      },
      service: serviceId,
    });
    
    const existingTimeMap = new Map();
    existingSlots.forEach(slot => {
      existingTimeMap.set(`${slot.startTime}-${slot.endTime}`, true);
    });
    
    const newTimeSlots = timeSlots.filter(
      slot => !existingTimeMap.has(`${slot.startTime}-${slot.endTime}`)
    );
    
    if (newTimeSlots.length > 0) {
      await TimeSlot.insertMany(newTimeSlots);
    }
    
    return res.status(201).json({
      message: `${newTimeSlots.length} time slots generated successfully`,
      timeSlots: newTimeSlots,
    });
  } catch (error: any) {
    console.error('Generate time slots error:', error);
    return res.status(500).json({ message: error.message || 'Failed to generate time slots' });
  }
};

export const generateTimeSlotsForAllServices = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, startTime = '09:00', endTime = '17:00' } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const services = await Service.find({ isActive: true }) as ServiceDocument[]; 
    
    if (services.length === 0) {
      return res.status(404).json({ message: 'No active services found' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }
    
    let allTimeSlots: any[] = [];
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      for (const service of services) {
        const timeSlots = generateTimeSlots({
          date: new Date(currentDate),
          startTime,
          endTime,
          serviceDuration: service.duration,
          serviceId: service._id.toString(),
        });
        
        allTimeSlots = [...allTimeSlots, ...timeSlots];
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const existingSlots = await TimeSlot.find({
      date: {
        $gte: new Date(start.setHours(0, 0, 0, 0)),
        $lt: new Date(end.setHours(23, 59, 59, 999)),
      },
    });
    
    const existingTimeMap = new Map();
    existingSlots.forEach(slot => {
      const key = `${new Date(slot.date).toISOString().split('T')[0]}-${slot.startTime}-${slot.endTime}-${slot.service}`;
      existingTimeMap.set(key, true);
    });
    
    const newTimeSlots = allTimeSlots.filter(slot => {
      const key = `${new Date(slot.date).toISOString().split('T')[0]}-${slot.startTime}-${slot.endTime}-${slot.service}`;
      return !existingTimeMap.has(key);
    });
    
    if (newTimeSlots.length > 0) {
      await TimeSlot.insertMany(newTimeSlots);
    }
    
    return res.status(201).json({
      message: `${newTimeSlots.length} time slots generated successfully`,
      count: newTimeSlots.length,
    });
  } catch (error: any) {
    console.error('Generate time slots for all services error:', error);
    return res.status(500).json({ message: error.message || 'Failed to generate time slots' });
  }
};