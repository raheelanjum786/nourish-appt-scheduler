import dotenv from 'dotenv';
dotenv.config(); // Move this line to the very top

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import appointmentRoutes from './routes/appointment.routes';
import serviceRoutes from './routes/service.routes';
import adminRoutes from './routes/admin.routes';
import planOrderRoutes from './routes/planOrder.routes'; 
import chatRoutes from './routes/chat.routes';
import planRoutes from './routes/plan.routes';
import timeSlotRoutes from './routes/timeSlot.routes';
import { errorHandler, notFound } from './middleware/error.middleware';
import { createServer } from 'http';
// import { createSignalingServer } from './websocket/signaling.server';
import paymentRoutes from './routes/payment.routes';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5001;

// createSignalingServer(server);

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/plan-orders', planOrderRoutes); 
app.use('/api/time-slots', timeSlotRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});