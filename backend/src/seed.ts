import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { UserRole } from './models/user.model';
import Service from './models/service.model';
import ServiceCategory from './models/serviceCategory.model';
import Plan, { PlanDuration } from './models/plan.model';
import bcrypt from 'bcryptjs';

dotenv.config();

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
    await Plan.deleteMany({});

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

    const services = await Service.insertMany([
      {
        name: 'Initial Consultation',
        description: 'A comprehensive assessment of your nutritional needs and health goals.',
        duration: 60,
        price: 120,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: categories[0]._id, 
      },
      {
        name: 'Follow-up Session',
        description: 'Review progress and adjust your nutrition plan as needed.',
        duration: 30,
        price: 75,
        image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: categories[0]._id, 
      },
      {
        name: 'Personalized Meal Planning',
        description: 'Custom meal plans tailored to your dietary needs and preferences.',
        duration: 45,
        price: 95,
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: categories[1]._id, 
      },
      {
        name: 'Weight Management Program',
        description: 'A comprehensive program designed to help you achieve and maintain a healthy weight.',
        duration: 90,
        price: 150,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: categories[2]._id, 
      },
    ]);

    console.log(`${services.length} services created`);

    // Add nutrition plans
    const plans = await Plan.insertMany([
      {
        name: 'Essential Nutrition',
        description: 'Basic nutrition guidance with weekly check-ins and personalized meal suggestions.',
        duration: PlanDuration.WEEKLY,
        price: 49.99,
        features: [
          'Weekly meal suggestions',
          'Basic nutritional guidance',
          'Email support',
          'Access to nutrition resources'
        ],
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Premium Nutrition',
        description: 'Comprehensive monthly nutrition plan with detailed meal planning and regular consultations.',
        duration: PlanDuration.MONTHLY,
        price: 149.99,
        features: [
          'Detailed monthly meal plan',
          'Bi-weekly consultations',
          'Nutritional analysis',
          'Recipe suggestions',
          'Priority support',
          'Progress tracking'
        ],
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Elite Transformation',
        description: 'Complete quarterly nutrition and lifestyle transformation program with intensive support.',
        duration: PlanDuration.QUARTERLY,
        price: 399.99,
        features: [
          'Comprehensive nutrition assessment',
          'Weekly personalized meal plans',
          'Weekly one-on-one consultations',
          'Fitness recommendations',
          'Supplement guidance',
          'Lifestyle coaching',
          '24/7 support',
          'Detailed progress reports'
        ],
        image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Annual Wellness',
        description: 'Year-long nutrition and wellness program for sustainable lifestyle changes.',
        duration: PlanDuration.YEARLY,
        price: 1299.99,
        features: [
          'Annual nutrition strategy',
          'Monthly personalized meal plans',
          'Monthly consultations',
          'Seasonal adjustment sessions',
          'Comprehensive health assessments',
          'Lifestyle integration coaching',
          'Premium support',
          'Family nutrition guidance'
        ],
        image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]);

    console.log(`${plans.length} nutrition plans created`);
    console.log('Seeding completed successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();