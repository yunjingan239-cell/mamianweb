import React from 'react';
import { Order } from '../../types';
import { Package, Truck, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { Button } from '../../components/Button';

interface MerchantOrdersProps {
  orders: Order[];
  updateStatus: (orderId: string, status: Order['status']) => void;
}

export const MerchantOrders: React.FC<MerchantOrdersProps> = ({ orders, updateStatus }) => {
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock size={12} /> 待发货</span>;
      case 'shipped':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Truck size={12} /> 已发货</span>;
      case 'delivered':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} /> 已送达</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800"><XCircle size={12} /> 已取消</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">订单管理</h1>
          <p className="text-slate-500">查看并处理来自用户的订单</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-800 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="搜索订单号..." 
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-4 focus:ring-red-800/10 focus:border-red-800 w-full sm:w-64 transition-all hover:border-red-300 hover:shadow-md bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[70vh] flex flex-col">
        {orders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p>暂无订单数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1 h-full">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">订单信息</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">下单时间</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">金额</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">状态</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-slate-400 mb-1">#{order.id.slice(-8)}</span>
                        <div className="text-sm font-medium text-slate-900">
                          {order.items[0].name} 
                          {order.items.length > 1 && <span className="text-slate-500 font-normal"> 等 {order.items.length} 件商品</span>}
                        </div>
                        <span className="text-xs text-slate-500 mt-1">用户 ID: {order.userId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      ¥{order.total}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateStatus(order.id, 'shipped')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          发货
                        </Button>
                      )}
                      {order.status === 'shipped' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateStatus(order.id, 'delivered')}
                        >
                          确认送达
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};