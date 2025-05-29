import { Request, Response } from 'express';
import Plan from '../models/Plan';

export const createPlan = async (req: Request, res: Response) => {
  try {
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanById = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(plan);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(plan);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json({ message: 'Plan deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPlans = async (req: Request, res: Response) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error: any) {
    console.error('Error fetching user plans:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};