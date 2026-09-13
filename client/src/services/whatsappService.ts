const WHATSAPP_NUMBER = '919495902904';

interface ProductEnquiryParams {
  productName: string;
  sku: string;
  salePrice: number;
  productUrl: string;
}

export const generateWhatsAppEnquiryLink = ({
  productName,
  sku,
  salePrice,
  productUrl,
}: ProductEnquiryParams): string => {
  const message = `Hi KING DAY! 👋\n\nI'm interested in this product:\n\n*${productName}*\nSKU: ${sku}\nPrice: ₹${salePrice.toLocaleString('en-IN')}\n\nCan you share more details? Link: ${productUrl}`;
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export const generateWhatsAppGeneralSupportLink = (): string => {
  const message = `Hi KING DAY! 👋 I need some help with your store.`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export const generateWhatsAppOrderTrackingLink = (orderId: string): string => {
  const message = `Hi KING DAY! 👋 I would like to track my order.\n\nOrder ID: *${orderId}*`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};
