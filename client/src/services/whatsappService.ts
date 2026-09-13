import { Product, CartItem } from '../types/schema';

const WHATSAPP_NUMBER = '919495902904';

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const buildWhatsAppProductUrl = (product: Product, currentUrl: string): string => {
  const priceFormatted = formatINR(Number(product.salePrice));

  const message = `Hi KING DAY 👋

I'm interested in this product:

Product: ${product.name}
SKU: ${product.sku}
Price: ${priceFormatted}

Product URL:
${currentUrl}

I would like to know about availability and delivery.

Thank you.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const buildWhatsAppCartUrl = (cartItems: CartItem[], subtotal: number): string => {
  const itemLines = cartItems
    .map((item, idx) => {
      const priceFormatted = formatINR(Number(item.product.salePrice));
      return `${idx + 1}. ${item.product.name}\nSKU: ${item.product.sku}\nQty: ${item.quantity}\nPrice: ${priceFormatted}`;
    })
    .join('\n\n');

  const subtotalFormatted = formatINR(subtotal);

  const message = `Hi KING DAY 👋

I would like to order these products:

${itemLines}

Subtotal: ${subtotalFormatted}

Please confirm availability and delivery charges.

Thank you.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const generateWhatsAppGeneralSupportLink = (): string => {
  const message = `Hi KING DAY 👋\nI need assistance with kids products/orders.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const generateWhatsAppOrderTrackingLink = (orderId: string): string => {
  const message = `Hi KING DAY 👋\nI would like to track my order.\n\nOrder ID: *${orderId}*`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
