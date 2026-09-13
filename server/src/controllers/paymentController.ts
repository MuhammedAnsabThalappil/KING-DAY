import { Request, Response } from 'express';
import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import { verifyRazorpaySignature } from '../services/razorpayService';

const prisma = new PrismaClient();

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
      return res.status(400).json({ message: 'Missing Razorpay signature verification parameters.' });
    }

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: PaymentStatus.FAILED },
      });
      return res.status(400).json({ message: 'Razorpay signature verification failed.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.PAYMENT_CONFIRMED,
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    res.json({
      success: true,
      message: 'Payment verified successfully.',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ message: 'Failed to verify payment.' });
  }
};
