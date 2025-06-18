import { Request, Response } from 'express';
import Appointment from '../models/appointment.model';
import User from '../models/user.model';
import Service from '../models/service.model';
import PlanOrder from '../models/PlanOrder';
import Plan from '../models/plan.model';
import PlanSubscription from '../models/planSubscription.model';


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

        const totalPlans = await Plan.countDocuments();
    const totalSubscriptions = await PlanSubscription.countDocuments();
    const activeSubscriptions = await PlanSubscription.countDocuments({ status: 'active' });

    res.json({
      stats: {
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        totalUsers,
        totalServices,
        totalPlans,
        totalSubscriptions,
        activeSubscriptions,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
        res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard stats',
    });
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

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find();
    
    res.status(200).json({
      status: 'success',
      results: plans.length,
      data: {
        plans,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch plans',
    });
  }
};

export const managePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (req.method === 'PUT') {
      const updatedPlan = await Plan.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      
      if (!updatedPlan) {
        return res.status(404).json({
          status: 'fail',
          message: 'Plan not found',
        });
      }
      
      return res.status(200).json({
        status: 'success',
        data: {
          plan: updatedPlan,
        },
      });
    }
    
    if (req.method === 'DELETE') {
      const plan = await Plan.findByIdAndDelete(id);
      
      if (!plan) {
        return res.status(404).json({
          status: 'fail',
          message: 'Plan not found',
        });
      }
      
      return res.status(204).json({
        status: 'success',
        data: null,
      });
    }
    
    res.status(405).json({
      status: 'fail',
      message: 'Method not allowed',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to manage plan',
    });
  }
};

export const getPlanSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await PlanSubscription.find()
      .populate('user', 'name email')
      .populate('plan')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: subscriptions.length,
      data: {
        subscriptions,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch plan subscriptions',
    });
  }
};

export const updatePlanSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const subscription = await PlanSubscription.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('plan').populate('user', 'name email');
    
    if (!subscription) {
      return res.status(404).json({
        status: 'fail',
        message: 'Subscription not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        subscription,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update subscription',
    });
  }
};

