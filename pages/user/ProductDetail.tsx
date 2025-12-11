import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../../types';
import { Button } from '../../components/Button';
import { ArrowLeft, Sparkles, Check, ShoppingCart } from 'lucide-react';
import { getStylingAdvice } from '../../services/geminiService';

interface ProductDetailProps {
  products: Product[];
  addToCart: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ products, addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return <div>商品未找到</div>;

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    const result = await getStylingAdvice(product.name, product.description);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-red-800 mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> 返回首页
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden aspect-[3/4] shadow-inner">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? '现货' : '缺货'}
              </span>
            </div>
            <h1 className="text-4xl font-serif text-slate-900 mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-red-900">¥{product.price}</p>
          </div>

          <div className="prose prose-slate">
            <h3 className="text-lg font-bold text-slate-900">商品详情</h3>
            <p className="text-slate-600 leading-relaxed">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="border p-3 rounded-lg">
                <span className="block text-xs text-slate-500">材质</span>
                <span className="font-medium">{product.material}</span>
              </div>
              <div className="border p-3 rounded-lg">
                <span className="block text-xs text-slate-500">颜色</span>
                <span className="font-medium">{product.color}</span>
              </div>
            </div>
          </div>

          {/* AI Stylist Feature */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-900 flex items-center gap-2">
                <Sparkles size={18} /> AI 穿搭顾问
              </h3>
              {!advice && (
                <button 
                  onClick={handleGetAdvice}
                  disabled={loadingAdvice}
                  className="text-xs font-bold text-amber-700 underline hover:text-amber-900 disabled:opacity-50"
                >
                  {loadingAdvice ? 'AI 思考中...' : '获取搭配建议'}
                </button>
              )}
            </div>
            
            {advice ? (
              <p className="text-sm text-amber-800 italic animate-in slide-in-from-top-2 whitespace-pre-line">
                {advice}
              </p>
            ) : (
              <p className="text-sm text-amber-700/60">
                不知道怎么搭配这件马面裙？点击右上角咨询我们的 AI 造型师。
              </p>
            )}
          </div>

          <div className="pt-6 border-t border-slate-200">
            <Button 
              size="lg" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleAddToCart}
              disabled={isAdded || product.stock === 0}
            >
              {isAdded ? (
                <>
                  <Check size={20} /> 已加入购物车
                </>
              ) : (
                <>
                  <ShoppingCart size={20} /> 加入购物车
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};