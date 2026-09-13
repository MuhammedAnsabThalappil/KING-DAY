import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayOrders, monthOrders, keralaOrders, totalOrders] = await Promise.all([
      prisma.order.findMany({ where: { createdAt: { gte: today } } }),
      prisma.order.findMany({ where: { createdAt: { gte: firstDayOfMonth } } }),
      prisma.order.count({ where: { shippingState: { equals: 'Kerala', mode: 'insensitive' } } }),
      prisma.order.findMany()
    ]);

    const todaySales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const monthSales = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalRevenue = totalOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders.length > 0 ? totalRevenue / totalOrders.length : 0;

    // Simplified chart data for revenue over last 7 days
    const revenueData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const endD = new Date(d);
      endD.setHours(23, 59, 59, 999);
      
      const dayOrders = await prisma.order.findMany({
        where: { createdAt: { gte: d, lte: endD } }
      });
      revenueData.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      });
    }

    res.json({
      todaySales,
      monthSales,
      keralaOrders,
      averageOrderValue,
      revenueChart: revenueData
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error fetching stats' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, mrp, salePrice, stock, category, isPublished, imageUrl } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        mrp: parseFloat(mrp),
        salePrice: parseFloat(salePrice),
        stock: parseInt(stock, 10),
        category,
        isPublished: isPublished ?? true,
        imageUrl
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, description, mrp, salePrice, stock, category, isPublished, imageUrl } = req.body;
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        mrp: parseFloat(mrp),
        salePrice: parseFloat(salePrice),
        stock: parseInt(stock, 10),
        category,
        isPublished,
        imageUrl
      }
    });
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
