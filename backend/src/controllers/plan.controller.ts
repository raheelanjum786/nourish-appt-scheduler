import { Request, Response } from 'express';
import Plan from '../models/plan.model';
import PlanSubscription, { SubscriptionStatus } from '../models/planSubscription.model';
import { addDays, addMonths, addYears } from '../utils';
import Stripe from 'stripe';
import mongoose from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-05-28.basil', 
});

// Get all plans
export const getAllPlans = async (req: Request, res: Response) => {
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

// Get plan by ID
export const getPlanById = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        status: 'fail',
        message: 'Plan not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch plan',
    });
  }
};

// Create a new plan (admin only)
export const createPlan = async (req: Request, res: Response) => {
  try {
    const newPlan = await Plan.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        plan: newPlan,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create plan',
    });
  }
};

// Update plan (admin only)
export const updatePlan = async (req: Request, res: Response) => {
  try {
    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!updatedPlan) {
      return res.status(404).json({
        status: 'fail',
        message: 'Plan not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        plan: updatedPlan,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update plan',
    });
  }
};

// Delete plan (admin only)
export const deletePlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    
    if (!plan) {
      return res.status(404).json({
        status: 'fail',
        message: 'Plan not found',
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete plan',
    });
  }
};

// Subscribe to a plan
export const subscribeToPlan = async (req: Request, res: Response) => {
  try {
    const { planId, paymentId } = req.body;
    const userId = req.user?.id;
    
    // Find the plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        status: 'fail',
        message: 'Plan not found',
      });
    }
    
    // Calculate end date based on plan duration
    const startDate = new Date();
    let endDate = new Date();
    
    switch (plan.duration) {
      case 'weekly':
        endDate = addDays(startDate, 7);
        break;
      case 'monthly':
        endDate = addMonths(startDate, 1);
        break;
      case 'quarterly':
        endDate = addMonths(startDate, 3);
        break;
      case 'yearly':
        endDate = addYears(startDate, 1);
        break;
      default:
        endDate = addMonths(startDate, 1);
    }
    
    // Create subscription
    const subscription = await PlanSubscription.create({
      user: userId,
      plan: planId,
      startDate,
      endDate,
      status: paymentId ? SubscriptionStatus.ACTIVE : SubscriptionStatus.PENDING,
      paymentId,
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        subscription,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to subscribe to plan',
    });
  }
};

// Get user subscriptions
export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const subscriptions = await PlanSubscription.find({ user: userId })
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
      message: 'Failed to fetch subscriptions',
    });
  }
};

// Get all subscriptions (admin only)
export const getAllSubscriptions = async (req: Request, res: Response) => {
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
      message: 'Failed to fetch subscriptions',
    });
  }
};

// Update subscription status (admin only)
export const updateSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!Object.values(SubscriptionStatus).includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid subscription status',
      });
    }
    
    const subscription = await PlanSubscription.findByIdAndUpdate(
      req.params.id,
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
      message: 'Failed to update subscription status',
    });
  }
};

// Create payment intent for plan subscription
export const createPlanPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;
    
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        status: 'fail',
        message: 'Plan not found',
      });
    }
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(plan.price * 100), // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        planId: plan.id?.toString(),
        // userId: req.user?.id.toString(),
        planName: plan.name,
      },
    });
    
    res.status(200).json({
      status: 'success',
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to create payment intent',
    });
  }
};