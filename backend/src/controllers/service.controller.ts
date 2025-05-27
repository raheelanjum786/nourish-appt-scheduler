import { Request, Response } from 'express';
import Service from '../models/service.model';
import ServiceCategory from '../models/serviceCategory.model';

// Get all services
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isActive: true }).populate('category', 'name');
    res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get service by ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id).populate('category', 'name description image');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new service (admin only)
export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, duration, price, image, category } = req.body;

    // Verify that the category exists
    const categoryExists = await ServiceCategory.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Service category not found' });
    }

    const service = await Service.create({
      name,
      description,
      duration,
      price,
      image,
      category,
    });

    // Populate the category in the response
    await service.populate('category', 'name');

    res.status(201).json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update service (admin only)
export const updateService = async (req: Request, res: Response) => {
  try {
    const { name, description, duration, price, image, category, isActive } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // If category is being updated, verify it exists
    if (category && category !== service.category.toString()) {
      const categoryExists = await ServiceCategory.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: 'Service category not found' });
      }
      service.category = category;
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.duration = duration || service.duration;
    service.price = price || service.price;
    service.image = image || service.image;
    
    if (isActive !== undefined) {
      service.isActive = isActive;
    }

    const updatedService = await service.save();
    
    // Populate the category in the response
    await updatedService.populate('category', 'name');
    
    res.status(200).json(updatedService);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete service (admin only)
export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne();
    res.status(200).json({ message: 'Service removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};