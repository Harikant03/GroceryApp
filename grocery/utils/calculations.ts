
import { PROMO_CODES } from '@/constants/data';

export const calculateTotal = (items: any[], promoCode: string) => {
  let subtotal = items.reduce((acc, item) => acc + item.price, 0);
  
  // Threshold Discount (e.g., > 500 gets 5% off)
  let thresholdDiscount = subtotal > 500 ? subtotal * 0.05 : 0;
  
  //  Promo Code Discount
  let promoDiscount = PROMO_CODES[promoCode] ? subtotal * PROMO_CODES[promoCode] : 0;

  return {
    subtotal,
    thresholdDiscount,
    promoDiscount,     
    total: subtotal - (thresholdDiscount + promoDiscount)
  };
};