
// Seed script to create initial admin user
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const adminEmail = 'admin@nutricare.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log('Admin user already exists, skipping creation');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log(`Created admin user with id: ${admin.id}`);

  // Create some sample services
  const services = [
    {
      title: 'Weight Management',
      description: 'Personalized plans for healthy weight loss, gain or maintenance with nutritional guidance.',
      image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Dietary Management',
      description: 'Specialized diets for medical conditions, food allergies, and specific nutritional needs.',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Body Contouring',
      description: 'Nutrition and lifestyle plans designed to help shape and tone specific body areas.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    }
  ];

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
