import { Request, Response } from 'express';
import Service from '../models/service.model';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isActive: true });
    res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, duration, price, image } = req.body;



    const service = await Service.create({
      name,
      description,
      duration,
      price,
      image,
    });



    res.status(201).json(service);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { name, description, duration, price, image, isActive } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
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
    

    
    res.status(200).json(updatedService);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

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