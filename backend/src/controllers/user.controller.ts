import { Request, Response } from 'express';
import User from '../models/user.model';
import Payment from '../models/payment.model';
import Service from '../models/service.model'; 
import Appointment from '../models/appointment.model'; 

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (role) user.role = role;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    // Add check for req.user
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const payments = await Payment.find({ userId: (req.user as any).id }); // Use type assertion or define custom Request type
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPayment = async (req: Request, res: Response) => {
  // try {
  //   // Add check for req.user
  //   if (!req.user) {
  //     return res.status(401).json({ message: 'Not authenticated' });
  //   }
  //   const payment = await Payment.findOne({
  //     _id: req.params.id,
  //     userId: (req.user as any).id, // Use type assertion or define custom Request type
  //   });

  //   if (!payment) {
  //     return res.status(404).json({ message: 'Payment not found' });
  //   }

  //   // Add refund logic here (integration with payment provider)
  //   payment.status = 'refund_requested';
  //   await payment.save();

  //   res.json({ message: 'Refund request submitted' });
  // } catch (error) {
  //   res.status(500).json({ message: 'Error processing refund request' });
  // }
};

export const checkServiceAvailability = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const availableSlots: any[] = []; // Implement your availability logic here
    res.json({ availableSlots });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
    const { newDate, newTime } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: (req.user as any).id }, // Use type assertion or define custom Request type
      { date: newDate, timeSlot: newTime },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error rescheduling appointment' });
  }
};