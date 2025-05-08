import mongoose from 'mongoose';
import seedWarehouses from './warehouse.seed.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log(process.env.MONGO);
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');

    // Run seeds
    await seedWarehouses();

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 