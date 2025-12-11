import React from 'react';
import { Order } from '../../types';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';

interface UserOrdersProps {
  orders: Order[];
}

export const UserOrders: React.FC<UserOrdersProps> = ({ orders }) => {
  const getStatusText = (status: Order['status']) => {
    const map = {
      pending: '待发货',
      shipped: '运输中',
      delivered: '已送达',
      cancelled: '已取消'
    };
    return map[status];
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="w-64 h-64 bg-slate-100/50 rounded-full absolute blur-3xl -z-10"></div>
        
        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6 text-slate-400 rotate-6">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">您还没有相关的订单</h2>
        <p className="text-slate-500 mb-8">去挑选几件心仪的马面裙吧！</p>
        <Link to="/">
          <Button size="lg" className="shadow-lg shadow-red-900/10">去逛逛</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 min-h-[60vh]">
      <h1 className="text-2xl font-bold text-slate-900">我的订单</h1>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center text-sm">
              <div className="text-slate-500">
                <span className="mr-4">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span>订单号: {order.id}</span>
              </div>
              <span className={`font-bold ${
                order.status === 'delivered' ? 'text-green-600' : 
                order.status === 'shipped' ? 'text-blue-600' : 
                order.status === 'cancelled' ? 'text-slate-400' : 'text-amber-600'
              }`}>
                {getStatusText(order.status)}
              </span>
            </div>
            
            <div className="p-6">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-4 mb-4 last:mb-0">
                  <div className="w-20 h-24 bg-slate-100 rounded-md overflow-hidden shrink-0 border border-slate-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">{item.category} | {item.color}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">x {item.quantity}</span>
                      <span className="font-medium text-slate-900">¥{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-4">
                  {order.status === 'shipped' && (
                    <Button size="sm" variant="outline">查看物流</Button>
                  )}
                  {order.status === 'delivered' && (
                    <Button size="sm" variant="outline">评价晒单</Button>
                  )}
                  <Link to="/chat">
                    <Button size="sm" variant="outline">联系客服</Button>
                  </Link>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-500 mr-2">实付款:</span>
                  <span className="text-xl font-bold text-red-900">¥{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};