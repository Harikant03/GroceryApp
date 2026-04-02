"use client";
import { useCartStore } from '@/store/useCartStore';
import { calculateTotal } from '@/utils/calculations';
import { Trash2, Undo2, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { cart, removeItem, undo, promoCode, setPromo } = useCartStore();
  const { subtotal, thresholdDiscount, promoDiscount, total } = calculateTotal(cart, promoCode);

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white sticky top-8 max-w-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-2 rounded-xl text-green-600">
            <ShoppingBag size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Cart</h2>
        </div>
        
        {cart.length > 0 && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={undo}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors bg-slate-50 px-3 py-2 rounded-full border border-slate-100"
          >
            <Undo2 size={14} /> Undo
          </motion.button>
        )}
      </div>

      {/* Items List */}
      <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {cart.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <ShoppingBag size={32} />
              </div>
              <p className="text-slate-400 font-medium italic">Empty basket...</p>
            </motion.div>
          ) : (
            cart.map((item, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={`${item.id}-${idx}`} 
                className="flex justify-between items-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-sm transition-all group"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 text-sm">{item.name}</span>
                  <span className="text-xs font-bold text-green-500 mt-0.5">₹{item.price}</span>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer Area */}
      <div className="space-y-5">
        {/* Promo Code Box */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500">
            <Tag size={16} />
          </div>
          <input 
            placeholder="PROMO CODE" 
            className="w-full bg-slate-50 border border-slate-100 p-3 pl-10 text-xs font-black rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 outline-none transition-all uppercase tracking-widest"
            onBlur={e => setPromo(e.target.value.toUpperCase())} 
          />
        </div>

        {/* Pricing Summary */}
        <div className="bg-slate-50/80 p-5 rounded-3xl space-y-3">
          <div className="flex justify-between text-sm font-semibold text-slate-500">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          
          {thresholdDiscount > 0 && (
            <div className="flex justify-between text-sm font-bold text-green-600">
              <span className="flex items-center gap-1">Bulk Discount <span className="text-[10px] bg-green-100 px-1.5 rounded">5%</span></span>
              <span>-₹{thresholdDiscount}</span>
            </div>
          )}
          
          {promoDiscount > 0 && (
            <div className="flex justify-between text-sm font-bold text-blue-600">
              <span className="flex items-center gap-1">Promo <span className="text-[10px] bg-blue-100 px-1.5 rounded uppercase">{promoCode}</span></span>
              <span>-₹{promoDiscount}</span>
            </div>
          )}
          
          <div className="flex justify-between items-end pt-3 border-t border-slate-200/50">
            <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Total Price</span>
            <span className="text-2xl font-black text-slate-800 tracking-tight">₹{total.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Checkout Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all group"
        >
          Checkout Now 
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
}