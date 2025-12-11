import React, { useState, useMemo } from 'react';
import { Product } from '../../types';
import { Button } from '../../components/Button';
import { Search, Filter, ShoppingBag } from 'lucide-react';

interface StoreFrontProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

export const StoreFront: React.FC<StoreFrontProps> = ({ products, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  
  const categories = ['全部', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === '全部' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="space-y-8 min-h-[70vh]">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden h-[300px] md:h-[400px] bg-slate-900">
        <img 
          src="https://image.pollinations.ai/prompt/panoramic%20view%20of%20chinese%20fashion%20models%20wearing%20luxury%20mamianqun%20walking%20in%20forbidden%20city%20cinematic%20lighting?width=1200&height=400&nologo=true&seed=888" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-slate-900/60 to-transparent">
           <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-wide shadow-black drop-shadow-lg">
             东方雅韵
           </h1>
           <p className="text-lg text-slate-100 max-w-2xl drop-shadow-md">
             探索马面裙的跨越千年的美。传统工艺与现代时尚的完美融合。
           </p>
        </div>
      </section>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 bg-slate-50/90 p-4 rounded-xl backdrop-blur z-40 shadow-sm border border-white">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          <Filter size={20} className="text-slate-500 shrink-0" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-red-800 text-white shadow-md shadow-red-900/20' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-red-800 hover:text-red-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-800 transition-colors" />
          <input
            type="text"
            placeholder="搜索款式..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 text-slate-900 focus:outline-none focus:border-red-800 focus:ring-4 focus:ring-red-800/10 bg-white shadow-sm hover:shadow-lg hover:border-red-300 transition-all duration-300 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-900">
                {product.category}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-4 flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-red-800 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {product.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xl font-bold text-red-900">
                  ¥{product.price}
                </span>
                <Button 
                  size="sm" 
                  onClick={() => addToCart(product)}
                  className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity translate-y-0"
                >
                  加入购物车
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 animate-in fade-in">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
             <Search size={28} className="opacity-40" />
          </div>
          <p className="text-xl font-medium text-slate-700">未找到符合条件的商品</p>
          <p className="text-sm mt-2 text-slate-400">尝试更换关键词或筛选条件</p>
        </div>
      )}
    </div>
  );
};