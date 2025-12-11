import React, { useState } from 'react';
import { CartItem, Order, User } from '../../types';
import { Button } from '../../components/Button';
import { Trash2, Plus, Minus, CheckCircle, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface CartProps {
  items: CartItem[];
  currentUser: User | null;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  createOrder: (order: Order) => void;
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  currentUser,
  updateQuantity, 
  removeItem, 
  clearCart, 
  createOrder 
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 20;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const newOrder: Order = {
        id: Date.now().toString(),
        userId: currentUser.id,
        items: [...items],
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      createOrder(newOrder);
      setIsCheckingOut(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">订单已确认！</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          感谢您的购买。您的精美服饰即将发货。商家已收到您的订单信息。
        </p>
        <div className="flex gap-4">
          <Link to="/orders">
            <Button variant="outline">查看订单</Button>
          </Link>
          <Link to="/">
            <Button>继续购物</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
           <ShoppingCart size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">购物车空空如也</h2>
        <p className="text-slate-500 mb-8">看来您还没有选购心仪的马面裙。</p>
        <Link to="/">
          <Button size="lg" className="px-8">去逛逛</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">购物车</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 items-center">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-20 h-24 object-cover rounded-md bg-slate-100"
              />
              
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.category} • {item.color}</p>
                <div className="mt-2 font-medium text-red-900">¥{item.price}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-md">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:bg-slate-100 text-slate-600"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:bg-slate-100 text-slate-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4">订单摘要</h3>
            
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>小计</span>
                <span>¥{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>运费</span>
                <span>{shipping === 0 ? '免运费' : `¥${shipping}`}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-slate-900">
                <span>总计</span>
                <span>¥{total}</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? '处理中...' : '立即结算'}
            </Button>
            
            <p className="mt-4 text-xs text-center text-slate-400">
              安全支付模拟中。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};