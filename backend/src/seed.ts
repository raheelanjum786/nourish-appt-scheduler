import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { UserRole } from './models/user.model';
import Service from './models/service.model';
import ServiceCategory from './models/serviceCategory.model';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    await User.deleteMany({});
    await Service.deleteMany({});
    await ServiceCategory.deleteMany({});

    console.log('Data cleared');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    });

    console.log('Admin user created:', admin.email);

    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: UserRole.USER,
    });

    console.log('Regular user created:', user.email);

    // Create service categories
    const categories = await ServiceCategory.insertMany([
      {
        name: 'Weight Management',
        description: 'Personalized plans for healthy weight loss, gain or maintenance with nutritional guidance.',
        image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Dietary Management',
        description: 'Specialized diets for medical conditions, food allergies, and specific nutritional needs.',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Body Contouring',
        description: 'Nutrition and lifestyle plans designed to help shape and tone specific body areas.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
    ]);

    console.log(`${categories.length} service categories created`);

    // Create services with references to categories
    const services = await Service.insertMany([
      {
        name: 'Initial Consultation',
        description: 'A comprehensive assessment of your nutritional needs and health goals.',
        duration: 60,
        price: 120,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: categories[0]._id, // Weight Management
      },
      {
        name: 'Follow-up Session',
        description: 'Review progress and adjust your nutrition plan as needed.',
        duration: 30,
        price: 75,
        image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: categories[0]._id, // Weight Management
      },
      {
        name: 'Personalized Meal Planning',
        description: 'Custom meal plans tailored to your dietary needs and preferences.',
        duration: 45,
        price: 95,
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: categories[1]._id, // Dietary Management
      },
      {
        name: 'Weight Management Program',
        description: 'A comprehensive program designed to help you achieve and maintain a healthy weight.',
        duration: 90,
        price: 150,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: categories[2]._id, // Body Contouring
      },
    ]);

    console.log(`${services.length} services created`);
    console.log('Seeding completed successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();