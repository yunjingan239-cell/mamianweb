import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { ShoppingCart, LogOut, User as UserIcon, LayoutDashboard, ShoppingBag, MessageSquare, ListOrdered, Github, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole | null;
  cartCount: number;
  onLogout: () => void;
  hasUnreadMessages?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, userRole, cartCount, onLogout, hasUnreadMessages = false }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  // 自动滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="https://s41.ax1x.com/2025/12/11/pZKirZt.png" 
              alt="锦绣 Logo" 
              className="w-9 h-9 object-contain transition-transform group-hover:scale-105" 
            />
            <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-red-800 transition-colors">锦绣马面裙</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {userRole === UserRole.MERCHANT ? (
              <>
                <Link to="/merchant/dashboard" className="text-sm font-medium text-slate-700 hover:text-red-800 flex items-center gap-1">
                  <LayoutDashboard size={16} /> 数据看板
                </Link>
                <Link to="/merchant/products" className="text-sm font-medium text-slate-700 hover:text-red-800 flex items-center gap-1">
                  <ShoppingBag size={16} /> 商品管理
                </Link>
                <Link to="/merchant/orders" className="text-sm font-medium text-slate-700 hover:text-red-800 flex items-center gap-1">
                  <ListOrdered size={16} /> 订单管理
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-sm font-medium text-slate-700 hover:text-red-800">商城首页</Link>
                <Link to="/orders" className="text-sm font-medium text-slate-700 hover:text-red-800">我的订单</Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {userRole === UserRole.USER && (
               <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors" title="购物车">
                 <ShoppingCart size={20} className="text-slate-700" />
                 {cartCount > 0 && (
                   <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                     {cartCount}
                   </span>
                 )}
               </Link>
            )}
            
            {userRole ? (
              <div className="flex items-center gap-2">
                 <Link to="/chat" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors" title="在线客服">
                    <MessageSquare size={20} className="text-slate-700" />
                    {hasUnreadMessages && (
                      <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-600 rounded-full border-2 border-white"></span>
                    )}
                 </Link>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                  <UserIcon size={16} className="text-slate-600" />
                  <span className="text-xs font-medium text-slate-700 capitalize">
                    {userRole === UserRole.MERCHANT ? '商家' : '用户'}
                  </span>
                </div>
                <button onClick={onLogout} className="p-2 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-full transition-colors" title="退出登录">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium text-white bg-red-800 hover:bg-red-900 px-4 py-2 rounded-md transition-colors">
                登录 / 注册
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer Optimized for Visibility */}
      <footer className="bg-stone-50 text-stone-600 py-12 border-t border-stone-200 font-sans mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
             {/* Brand */}
             <div className="col-span-1 md:col-span-1">
               <div className="flex items-center gap-3 mb-5">
                  <img 
                    src="https://s41.ax1x.com/2025/12/11/pZKirZt.png" 
                    alt="锦绣 Logo" 
                    className="w-12 h-12 object-contain" 
                  />
                  <span className="text-2xl font-bold tracking-tight text-red-950 font-serif">锦绣马面裙</span>
               </div>
               <p className="text-sm leading-relaxed mb-4 text-stone-500">
                 专注传统马面裙的新中式电商平台。<br/>
                 致力于将东方美学融入现代生活，<br/>
                 让每一缕丝线都诉说着千年的故事。
               </p>
             </div>

             {/* Links */}
             <div>
               <h3 className="text-stone-900 font-serif font-bold mb-4">探索</h3>
               <ul className="space-y-2 text-sm">
                 <li><Link to="/" className="hover:text-red-800 transition-colors">商城首页</Link></li>
                 <li><Link to="/orders" className="hover:text-red-800 transition-colors">我的订单</Link></li>
                 <li><Link to="/chat" className="hover:text-red-800 transition-colors">在线客服</Link></li>
               </ul>
             </div>

             {/* Service */}
             <div>
               <h3 className="text-stone-900 font-serif font-bold mb-4">服务</h3>
               <ul className="space-y-2 text-sm">
                 <li><a href="#" className="hover:text-red-800 transition-colors">尺码指南</a></li>
                 <li><a href="#" className="hover:text-red-800 transition-colors">物流配送</a></li>
                 <li><a href="#" className="hover:text-red-800 transition-colors">退换货政策</a></li>
                 <li><a href="#" className="hover:text-red-800 transition-colors">隐私条款</a></li>
               </ul>
             </div>

             {/* Contact */}
             <div>
               <h3 className="text-stone-900 font-serif font-bold mb-4">联系我们</h3>
               <ul className="space-y-3 text-sm text-stone-500">
                 <li className="flex items-start gap-3 hover:text-stone-700 transition-colors">
                   <MapPin size={16} className="mt-0.5 shrink-0 text-red-800" />
                   <span>四川省成都市</span>
                 </li>
                 <li className="flex items-center gap-3 hover:text-stone-700 transition-colors">
                   <Phone size={16} className="shrink-0 text-red-800" />
                   <span>4124-999-0000</span>
                 </li>
                 <li className="flex items-center gap-3 hover:text-stone-700 transition-colors">
                   <Mail size={16} className="shrink-0 text-red-800" />
                   <span>dajgag@jinxiu.com</span>
                 </li>
               </ul>
             </div>
          </div>

          <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
            <p>&copy; 2025 锦绣马面裙 (Jinxiu). All rights reserved.</p>
            <div className="flex items-center gap-6">
               <span>成都职业技术学院 (CDP)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};