import { Request, Response } from 'express';
import Appointment from '../models/appointment.model';
import User from '../models/user.model';
import Service from '../models/service.model';
import PlanOrder from '../models/PlanOrder';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      totalUsers,
      totalServices,
      totalRevenue
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'pending' }),
      User.countDocuments(),
      Service.countDocuments(),
      PlanOrder.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      stats: {
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        totalUsers,
        totalServices,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecentAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('service', 'name price');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecentUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const manageService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (req.method === 'PUT') {
      const updatedService = await Service.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      return res.json(updatedService);
    }

    if (req.method === 'DELETE') {
      await Service.findByIdAndDelete(id);
      return res.json({ message: 'Service deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const manageUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (req.method === 'PUT') {
      if (req.body.role && req.user?.id === id) {
        return res.status(400).json({ message: 'Cannot change your own role' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      ).select('-password');
      return res.json(updatedUser);
    }

    if (req.method === 'DELETE') {
      if (req.user?.id === id) {
        return res.status(400).json({ message: 'Cannot delete yourself' });
      }

      await User.findByIdAndDelete(id);
      return res.json({ message: 'User deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const bulkManageUsers = async (req: Request, res: Response) => {
  try {
    const { users, action } = req.body;
    
    if (action === 'delete') {
      await User.deleteMany({ _id: { $in: users } });
    } else {
      await User.updateMany(
        { _id: { $in: users } },
        { $set: req.body.updates }
      );
    }

    res.status(200).json({ message: 'Bulk operation completed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during bulk operation' });
  }
};

export const getServiceCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Service.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service categories' });
  }
};

export const updateServiceCategories = async (req: Request, res: Response) => {
  try {
    const { categories } = req.body;
    // Implementation would depend on your category management system
    res.status(200).json({ message: 'Categories updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating categories' });
  }
};

export const getFilteredAppointments = async (req: Request, res: Response) => {
  try {
    const { status, dateRange, serviceId } = req.query;
    const filter: any = {};
    
    if (status) filter.status = status;
    if (dateRange) {
      const [start, end] = (dateRange as string).split(',');
      filter.date = { $gte: new Date(start), $lte: new Date(end) };
    }
    if (serviceId) filter.serviceId = serviceId;

    const appointments = await Appointment.find(filter)
      .populate('user', 'name email')
      .populate('service', 'name');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering appointments' });
  }
};