import { Request, Response } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayOrders, monthOrders, keralaOrders, totalOrders, lowStockProducts] = await Promise.all([
      prisma.order.findMany({ where: { createdAt: { gte: today } } }),
      prisma.order.findMany({ where: { createdAt: { gte: firstDayOfMonth } } }),
      prisma.order.count({ where: { shippingState: { equals: 'Kerala', mode: 'insensitive' } } }),
      prisma.order.findMany(),
      prisma.product.count({ where: { stock: { lte: 5 } } }),
    ]);

    const todaySales = todayOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const monthSales = monthOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const totalRevenue = totalOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const averageOrderValue = totalOrders.length > 0 ? totalRevenue / totalOrders.length : 0;

    // 7-day revenue chart
    const revenueChart = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const endD = new Date(d);
      endD.setHours(23, 59, 59, 999);

      const dayOrders = await prisma.order.findMany({
        where: { createdAt: { gte: d, lte: endD } },
      });

      revenueChart.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
      });
    }

    res.json({
      todaySales,
      monthSales,
      totalRevenue,
      averageOrderValue,
      keralaOrders,
      lowStockProducts,
      revenueChart,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error loading dashboard aggregation statistics.' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error loading product database.' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      sku,
      slug,
      name,
      shortDescription,
      description,
      category,
      brand,
      images,
      mrp,
      salePrice,
      stock,
      isPublished,
      panIndiaEligible,
      ageSuitability,
      weightCapacity,
      specifications,
    } = req.body;

    if (Number(salePrice) > Number(mrp)) {
      return res.status(400).json({ message: 'Sale price cannot exceed MRP.' });
    }

    if (Number(stock) < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative.' });
    }

    const product = await prisma.product.create({
      data: {
        sku,
        slug,
        name,
        shortDescription,
        description,
        category,
        brand: brand || 'KING DAY',
        images: images || [],
        mrp: Number(mrp),
        salePrice: Number(salePrice),
        stock: Number(stock),
        isPublished: isPublished ?? true,
        panIndiaEligible: panIndiaEligible ?? false,
        ageSuitability,
        weightCapacity,
        specifications,
      },
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message || 'Error creating product.' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.salePrice && data.mrp && Number(data.salePrice) > Number(data.mrp)) {
      return res.status(400).json({ message: 'Sale price cannot exceed MRP.' });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        mrp: data.mrp ? Number(data.mrp) : undefined,
        salePrice: data.salePrice ? Number(data.salePrice) : undefined,
        stock: data.stock !== undefined ? Number(data.stock) : undefined,
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product.' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if referenced by order items
    const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderItemCount > 0) {
      // Soft unpublish to preserve historical orders
      await prisma.product.update({
        where: { id },
        data: { isPublished: false },
      });
      return res.json({ message: 'Product has historical orders; un-published instead of hard deletion.' });
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product.' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { status, search, region } = req.query;

    const whereClause: any = {};

    if (status) {
      whereClause.status = String(status);
    }

    if (region === 'kerala') {
      whereClause.shippingState = { equals: 'Kerala', mode: 'insensitive' };
    } else if (region === 'other') {
      whereClause.shippingState = { not: { equals: 'Kerala', mode: 'insensitive' } };
    }

    if (search) {
      whereClause.OR = [
        { orderNumber: { contains: String(search), mode: 'insensitive' } },
        { customerName: { contains: String(search), mode: 'insensitive' } },
        { customerPhone: { contains: String(search), mode: 'insensitive' } },
        { shippingDistrict: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Error retrieving order records.' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid order status enum.' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: status as OrderStatus },
    });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status.' });
  }
};

export const getInventoryAudit = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        sku: true,
        name: true,
        category: true,
        stock: true,
        isPublished: true,
        salePrice: true,
      },
      orderBy: { stock: 'asc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error loading inventory audit data.' });
  }
};
