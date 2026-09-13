import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, panIndia, sort } = req.query;

    const whereClause: any = {
      isPublished: true,
    };

    if (category && category !== 'All') {
      whereClause.category = {
        equals: String(category),
        mode: 'insensitive',
      };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { sku: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (panIndia === 'true') {
      whereClause.panIndiaEligible = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') orderBy = { salePrice: 'asc' };
    if (sort === 'price-high') orderBy = { salePrice: 'desc' };

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy,
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to retrieve products' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({ message: 'Failed to retrieve product' });
  }
};
