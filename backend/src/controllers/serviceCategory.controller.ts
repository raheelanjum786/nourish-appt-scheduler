import { Request, Response } from 'express';
import ServiceCategory from '../models/serviceCategory.model';

// Get all service categories
export const getAllServiceCategories = async (req: Request, res: Response) => {
  try {
    const categories = await ServiceCategory.find({ isActive: true });
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get service category by ID
export const getServiceCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }
    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new service category (admin only)
export const createServiceCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body;

    const category = await ServiceCategory.create({
      name,
      description,
      image,
    });

    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update service category (admin only)
export const updateServiceCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image, isActive } = req.body;

    const category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.image = image || category.image;
    
    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete service category (admin only)
export const deleteServiceCategory = async (req: Request, res: Response) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }

    await category.deleteOne();
    res.status(200).json({ message: 'Service category removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get services by category
export const getServicesByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    
    // First check if the category exists
    const category = await ServiceCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }
    
    // Import the Service model here to avoid circular dependencies
    const Service = require('../models/service.model').default;
    
    // Find all active services in this category
    const services = await Service.find({ 
      category: categoryId,
      isActive: true 
    });
    
    res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};