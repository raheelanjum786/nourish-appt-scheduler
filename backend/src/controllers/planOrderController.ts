import { Request, Response } from 'express';
import PlanOrder from '../models/PlanOrder';
import Plan from '../models/Plan';
import User from '../models/user.model'; 
import mongoose, { Types } from 'mongoose';
import Stripe from 'stripe'; // Import Stripe
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createPlanOrder = async (req: Request, res: Response) => {
  try {
    const { planId, userId } = req.body; 
    if (!planId || !userId) {
      return res.status(400).json({ message: 'Plan ID and User ID are required.' });
    }

    if (!Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ message: 'Invalid Plan ID format.' });
    }

    const plan = await Plan.findById(planId);
    const user = await User.findById(userId); 

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found.' });
    }
    if (!user) { 
      return res.status(404).json({ message: 'User not found.' });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + plan.durationDays);

    const planOrder = new PlanOrder({
      user: userId, 
      plan: planId,
      orderDate: new Date(),
      startDate: startDate,
      endDate: endDate,
      status: 'active', 
    });

    await planOrder.save();
    res.status(201).json(planOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Add the new controller function for creating payment intent
export const createPlanOrderPaymentIntent = async (req: Request, res: Response) => {
  try {
    const planOrderId = req.params.id;

    if (!Types.ObjectId.isValid(planOrderId)) {
      return res.status(400).json({ message: 'Invalid Plan Order ID format.' });
    }

    // Find the plan order and populate the plan details to get the price
    const planOrder = await PlanOrder.findById(planOrderId).populate('plan');

    if (!planOrder) {
      return res.status(404).json({ message: 'Plan order not found.' });
    }

    // Ensure the plan details are populated and have a price
    if (!planOrder.plan || typeof (planOrder.plan as any).price !== 'number') {
         return res.status(500).json({ message: 'Plan details or price not available for this order.' });
    }

    // Amount should be in cents
    const amount = Math.round((planOrder.plan as any).price * 100);
    const description = `Payment for Plan Order ${planOrderId}`;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd', // Or your desired currency
      description: description,
      metadata: {
        planOrderId: planOrderId.toString(), // Store plan order ID in metadata
        userId: planOrder.user.toString(), // Store user ID
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });

  } catch (error: any) {
    console.error('Error creating payment intent for plan order:', error);
    res.status(500).json({ message: error.message });
  }
};


export const getUserPlanOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID format.' });
    }

    const planOrders = await PlanOrder.find({ user: userId }).populate('plan'); 
    res.json(planOrders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPlanOrders = async (req: Request, res: Response) => {
  try {
    const planOrders = await PlanOrder.find().populate('user').populate('plan'); 
    res.json(planOrders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanOrderById = async (req: Request, res: Response) => {
  try {
    const planOrder = await PlanOrder.findById(req.params.id).populate('user').populate('plan');
    if (!planOrder) {
      return res.status(404).json({ message: 'Plan order not found' });
    }
    res.json(planOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlanOrder = async (req: Request, res: Response) => {
  try {
    if (req.body.plan && !Types.ObjectId.isValid(req.body.plan)) {
      return res.status(400).json({ message: 'Invalid Plan ID format in update data.' });
    }

    const planOrder = await PlanOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!planOrder) {
      return res.status(404).json({ message: 'Plan order not found' });
    }
    res.json(planOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePlanOrder = async (req: Request, res: Response) => {
  try {
    const planOrder = await PlanOrder.findByIdAndDelete(req.params.id);
    if (!planOrder) {
      return res.status(404).json({ message: 'Plan order not found' });
    }
    res.json({ message: 'Plan order deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};