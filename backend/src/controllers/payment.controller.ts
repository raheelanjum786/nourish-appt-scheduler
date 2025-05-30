import { Request, Response } from 'express';
import Payment from '../models/payment.model';
import { UserRole } from '../models/user.model'; // Assuming UserRole is defined here
import { protect, restrictTo } from '../middleware/auth.middleware'; // Assuming auth middleware is here
// import stripe from '../config/stripe'; // You'll need to import your Stripe instance if implementing refund logic here

// @desc    Get payment history for logged-in user
// @route   GET /api/payments/me
// @access  Private
export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    // Find payments associated with the logged-in user's ID
    const payments = await Payment.find({ userId: (req.user as any).id }).sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a specific payment for logged-in user and request refund
// @route   POST /api/payments/me/:id/refund
// @access  Private
export const requestRefund = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const paymentId = req.params.id;

    // Find the payment for the logged-in user
    const payment = await Payment.findOne({
      _id: paymentId,
      userId: (req.user as any).id,
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if refund is already requested or completed
    if (payment.status === 'refund_requested' || payment.status === 'refunded') {
        return res.status(400).json({ message: 'Refund already requested or processed for this payment' });
    }

    // --- Refund Logic Integration ---
    // Here you would integrate with your payment provider (e.g., Stripe)
    // to initiate the refund process using payment.paymentIntentId.
    // Example (Stripe):
    /*
    try {
        const refund = await stripe.refunds.create({
            payment_intent: payment.paymentIntentId,
            // amount: payment.amount, // Optional: refund partial amount
        });
        // Update payment status based on refund result
        payment.status = refund.status === 'succeeded' ? 'refunded' : 'refund_requested'; // Or handle other statuses
        await payment.save();
        res.status(200).json({ message: 'Refund processed successfully', refund }); // Or 'Refund request submitted'
    } catch (stripeError: any) {
        console.error('Stripe Refund Error:', stripeError);
        // If Stripe refund fails immediately, maybe set status to 'refund_failed'
        payment.status = 'refund_requested'; // Or 'refund_failed' depending on desired flow
        await payment.save();
        return res.status(500).json({ message: 'Failed to process refund with payment provider', error: stripeError.message });
    }
    */
    // For now, just marking as requested
    payment.status = 'refund_requested';
    await payment.save();

    res.status(200).json({ message: 'Refund request submitted' });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// --- Admin Functions ---

// @desc    Get all payments (Admin only)
// @route   GET /api/payments
// @access  Private/Admin
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({}).populate('userId', 'name email').populate('appointmentId'); // Populate user and appointment details
    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment by ID (Admin only)
// @route   GET /api/payments/:id
// @access  Private/Admin
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('userId', 'name email').populate('appointmentId');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update payment status (Admin only)
// @route   PUT /api/payments/:id
// @access  Private/Admin
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // Expecting status in the request body

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Validate the new status if necessary
    const validStatuses = ['pending', 'succeeded', 'failed', 'refund_requested', 'refunded'];
    if (status && validStatuses.includes(status)) {
        payment.status = status;
    } else if (status) {
        return res.status(400).json({ message: `Invalid status: ${status}. Valid statuses are: ${validStatuses.join(', ')}` });
    } else {
         return res.status(400).json({ message: 'No status provided for update' });
    }


    const updatedPayment = await payment.save();
    res.status(200).json(updatedPayment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete payment (Admin only)
// @route   DELETE /api/payments/:id
// @access  Private/Admin
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    await payment.deleteOne();
    res.status(200).json({ message: 'Payment removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};