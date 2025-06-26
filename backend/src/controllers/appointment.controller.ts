import { Request, Response } from 'express';
import Appointment, { AppointmentStatus } from '../models/appointment.model';
import Service from '../models/service.model';
import { isTimeSlotAvailable } from '../utils';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string,
  {
  apiVersion: '2025-05-28.basil',
}
);

export const createAppointment = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { serviceId, date, startTime, endTime, notes, paymentIntentId ,consultationType} = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    const existingAppointments = await Appointment.find({
      date: new Date(date),
      status: { $ne: AppointmentStatus.CANCELLED },
    });

    if (!isTimeSlotAvailable(existingAppointments, new Date(date), startTime, endTime)) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment not successful' });
      }
    }
    const appointment = await Appointment.create({
      user: req.user.id, 
      service: serviceId,
      date,
      startTime,
      endTime,
      notes,
      status: AppointmentStatus.PENDING, 
      paymentIntentId,
      consultationType: consultationType, 
    });
    await appointment.populate('service');

    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({ user: req.user?.id })
      .populate('service')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user?.id,
    }).populate('service');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelUserAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user?.id,
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === AppointmentStatus.CANCELLED || 
        appointment.status === AppointmentStatus.COMPLETED) {
      return res.status(400).json({ 
        message: `Appointment cannot be cancelled because it is already ${appointment.status.toLowerCase()}` 
      });
    }

    appointment.status = AppointmentStatus.CANCELLED;
    await appointment.save();

    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({})
      .populate('user', 'name email')
      .populate('service')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user', 'name email')
      .populate('service');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status || appointment.status;
    if (notes) appointment.notes = notes;

    const updatedAppointment = await appointment.save();
    await updatedAppointment.populate('user', 'name email');
    await updatedAppointment.populate('service');

    res.status(200).json(updatedAppointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.deleteOne();
    res.status(200).json({ message: 'Appointment removed' });
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

    // Get service to determine duration
    const service = serviceId 
      ? await Service.findById(serviceId)
      : null;
    
    // Default duration is 30 minutes if no service specified
    const duration = service ? service.duration : 30;
    
    // Get all appointments for the specified date
    const existingAppointments = await Appointment.find({
      date: new Date(date as string),
      status: { $ne: AppointmentStatus.CANCELLED },
    }).sort({ startTime: 1 });
    
    // Business hours: 9 AM to 5 PM
    const businessHours = {
      start: '09:00',
      end: '17:00',
    };
    
    // Generate all possible time slots
    const timeSlots = [];
    let currentTime = businessHours.start;
    
    while (currentTime < businessHours.end) {
      const [hours, minutes] = currentTime.split(':').map(Number);
      
      // Calculate end time based on service duration
      const endTimeDate = new Date();
      endTimeDate.setHours(hours, minutes + duration, 0);
      
      const endTime = `${endTimeDate.getHours().toString().padStart(2, '0')}:${
        endTimeDate.getMinutes().toString().padStart(2, '0')
      }`;
      
      // Check if end time is within business hours
      if (endTime <= businessHours.end) {
        // Check if time slot is available
        if (isTimeSlotAvailable(existingAppointments, new Date(date as string), currentTime, endTime)) {
          timeSlots.push({
            startTime: currentTime,
            endTime,
          });
        }
      }
      
      // Move to next time slot (30-minute intervals)
      const nextTimeDate = new Date();
      nextTimeDate.setHours(hours, minutes + 30, 0);
      
      currentTime = `${nextTimeDate.getHours().toString().padStart(2, '0')}:${
        nextTimeDate.getMinutes().toString().padStart(2, '0')
      }`;
    }
    
    res.status(200).json(timeSlots);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, description } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description,
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};