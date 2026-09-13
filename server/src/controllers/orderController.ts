import { Request, Response } from 'express';
import { PrismaClient, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { createRazorpayOrder } from '../services/razorpayService';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingDistrict,
      shippingState,
      shippingPin,
      paymentMethod,
      items, // array of { productId, quantity }
    } = req.body;

    if (!customerName || !customerPhone || !shippingAddress || !shippingState || !shippingPin || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required order fields.' });
    }

    // Atomic Prisma transaction
    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isPublished) {
          throw new Error(`Product unavailable or unlisted.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // Validate Pan-India eligibility if state is outside Kerala
        const isKerala = shippingState.toLowerCase().includes('kerala');
        if (!isKerala && !product.panIndiaEligible) {
          throw new Error(`Product "${product.name}" is eligible for Kerala delivery only.`);
        }

        const price = Number(product.salePrice);
        subtotal += price * item.quantity;

        orderItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.salePrice,
        });

        // Decrement product stock safely
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });
      }

      // Calculate delivery fee
      const isKerala = shippingState.toLowerCase().includes('kerala');
      const deliveryCharge = subtotal > 3000 ? 0 : (isKerala ? 150 : 350);
      const totalAmount = subtotal + deliveryCharge;

      const orderNumber = `KD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

      let initialPaymentStatus: PaymentStatus = PaymentStatus.PENDING;
      if (paymentMethod === 'COD') {
        initialPaymentStatus = PaymentStatus.COD;
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail: customerEmail || '',
          customerPhone,
          shippingAddress,
          shippingCity,
          shippingDistrict: shippingDistrict || shippingCity,
          shippingState,
          shippingPin,
          subtotal,
          discount: 0,
          deliveryCharge,
          totalAmount,
          status: OrderStatus.PLACED,
          paymentStatus: initialPaymentStatus,
          paymentMethod: paymentMethod === 'RAZORPAY' ? PaymentMethod.RAZORPAY : PaymentMethod.COD,
          orderItems: {
            create: orderItemsToCreate,
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      // If Razorpay, initialize Razorpay Order
      let razorpayOrder = null;
      if (paymentMethod === 'RAZORPAY') {
        razorpayOrder = await createRazorpayOrder(totalAmount, newOrder.orderNumber);
        await tx.order.update({
          where: { id: newOrder.id },
          data: { razorpayOrderId: razorpayOrder.id },
        });
      }

      return {
        order: newOrder,
        razorpayOrder,
      };
    });

    res.status(201).json({
      success: true,
      order: result.order,
      razorpayOrder: result.razorpayOrder,
    });
  } catch (error: any) {
    console.error('Order Creation Failed:', error);
    res.status(400).json({ message: error.message || 'Failed to place order.' });
  }
};

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, phone } = req.body;

    if (!orderId || !phone) {
      return res.status(400).json({ message: 'Order ID and Mobile Phone are required.' });
    }

    const cleanPhone = phone.trim().slice(-10);

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: orderId, mode: 'insensitive' } },
          { id: { equals: orderId } },
        ],
        customerPhone: { contains: cleanPhone },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'No matching order found for provided details.' });
    }

    res.json(order);
  } catch (error) {
    console.error('Order tracking error:', error);
    res.status(500).json({ message: 'Error retrieving order status.' });
  }
};
