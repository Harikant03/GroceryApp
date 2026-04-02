"use client";
import { useState, useEffect } from 'react';
import { useGrocery } from '@/hooks/useGrocery';
import { useCartStore } from '@/store/useCartStore';
import Filters from '@/components/Inventory/Filters';
import CartDrawer from '@/components/Cart/CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingBasket, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GroceryPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('none');
  
  // New States
  const [currentPage, setCurrentPage] = useState(1);
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const itemsPerPage = 6;

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter change hone par page 1 par wapas jayein
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort]);

  const { data: products, isLoading } = useGrocery(search, category, sort);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);

  // Like Toggle Function
  const toggleLike = (id: number) => {
    setLikedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#f1f5f9] text-slate-900 selection:bg-green-100">
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-2">
              <div className="bg-green-600 p-2 rounded-xl text-white shadow-lg shadow-green-200">
                <ShoppingBasket size={24} />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">Fresh<span className="text-green-600">Grocery</span></h1>
            </motion.div>
            <p className="text-slate-500 font-medium text-lg">Premium items for your daily needs.</p>
          </div>

          {/* Stats Badge */}
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 text-sm font-bold flex gap-4">
             <span className="text-slate-400">Total: <span className="text-slate-900">{products?.length || 0}</span></span>
             <span className="text-red-400">Liked: <span className="text-red-500">{likedItems.length}</span></span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <Filters setSearch={setSearch} setCategory={setCategory} setSort={setSort} />
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-44 bg-slate-200 animate-pulse rounded-[2rem]" />)}
              </div>
            ) : (
              <>
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 min-h-[400px]">
                  <AnimatePresence mode='popLayout'>
                    {currentProducts?.map(item => (
                      <motion.div 
                        layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        key={item.id} 
                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all group relative"
                      >
                        {/* Like Button */}
                        <button 
                          onClick={() => toggleLike(item.id)}
                          className="absolute top-5 right-5 p-2 rounded-full bg-slate-50 hover:bg-red-50 transition-colors"
                        >
                          <Heart 
                            size={18} 
                            className={likedItems.includes(item.id) ? "fill-red-500 text-red-500" : "text-slate-300"} 
                          />
                        </button>

                        <div>
                          <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                            {item.category}
                          </span>
                          <h3 className="font-bold text-slate-800 text-xl mb-1">{item.name}</h3>
                          <p className="text-2xl font-black text-slate-900">₹{item.price}</p>
                        </div>

                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addItem(item)}
                          className="mt-6 w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-lg"
                        >
                          <Plus size={18} /> Add to Cart
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination Controls */}
                <div className="mt-12 flex justify-center items-center gap-4">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-3 rounded-2xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-2xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </>
            )}
          </div>

          <aside className="lg:col-span-1">
            <CartDrawer />
          </aside>
        </div>
      </div>
    </main>
  );
}