import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Button } from '../components/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Switch default credentials based on role
  useEffect(() => {
    if (role === UserRole.MERCHANT) {
      setEmail('merchant@jinxiu.com');
      setPassword('admin888');
    } else {
      setEmail('user@example.com');
      setPassword('password');
    }
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: role === UserRole.MERCHANT ? 'm1' : 'u1',
        name: role === UserRole.MERCHANT ? '锦绣官方旗舰店' : '汉服爱好者',
        email,
        role,
      };
      
      onLogin(mockUser);
      setLoading(false);
      navigate(role === UserRole.MERCHANT ? '/merchant/dashboard' : '/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-stone-50 font-sans">
      {/* Left Side - Visual & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 overflow-hidden">
        <img 
          src="https://s41.ax1x.com/2025/12/11/pZKAXQg.webp" 
          alt="Traditional Texture" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-end p-16 text-white w-full">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl w-fit mb-6 border border-white/10">
            <img 
              src="https://s41.ax1x.com/2025/12/11/pZKirZt.png" 
              alt="锦绣 Logo" 
              className="w-24 h-24 object-contain drop-shadow-lg" 
            />
          </div>
          <h1 className="text-5xl font-serif font-bold mb-4 tracking-wide">
            千载锦绣，<br/>一裙芳华。
          </h1>
          <p className="text-stone-300 text-lg max-w-md font-light leading-relaxed">
            融合传统织造工艺与现代剪裁美学，<br/>
            为每一位东方女性，定制专属的国风浪漫。
          </p>
          
          <div className="mt-12 flex items-center gap-4 text-sm text-stone-400">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border border-stone-800 bg-stone-700 flex items-center justify-center text-xs">
                  <Sparkles size={12} />
                </div>
              ))}
            </div>
            <span>已有 10,000+ 用户加入锦绣社区</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="max-w-md w-full space-y-8 bg-white/50 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
          
          <div className="text-center lg:text-left">
             <h2 className="text-3xl font-serif font-bold text-stone-900">
               {isLogin ? '欢迎归来' : '创建账户'}
             </h2>
             <p className="mt-2 text-stone-500">
               {isLogin ? '请输入您的凭证以访问账户' : '注册即可开启您的国风之旅'}
             </p>
          </div>

          {/* Role Switcher */}
          <div className="p-1.5 bg-stone-100 rounded-xl flex gap-2">
            <button
              type="button"
              onClick={() => setRole(UserRole.USER)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                role === UserRole.USER 
                  ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-200' 
                  : 'text-stone-500 hover:bg-stone-200'
              }`}
            >
              用户
            </button>
            <button
              type="button"
              onClick={() => setRole(UserRole.MERCHANT)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                role === UserRole.MERCHANT 
                  ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-200' 
                  : 'text-stone-500 hover:bg-stone-200'
              }`}
            >
              商家
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">电子邮箱</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all hover:bg-white hover:border-red-300 placeholder:text-stone-300"
                  placeholder={role === UserRole.MERCHANT ? "merchant@jinxiu.com" : "user@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                 <div className="flex justify-between items-center mb-1.5">
                   <label className="block text-sm font-medium text-stone-700">密码</label>
                   {isLogin && <a href="#" className="text-xs text-stone-400 hover:text-stone-600">忘记密码？</a>}
                 </div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all hover:bg-white hover:border-red-300 placeholder:text-stone-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-3.5 text-base rounded-xl shadow-lg shadow-stone-900/10 hover:shadow-xl hover:shadow-stone-900/20 active:scale-[0.99] transition-all bg-stone-900 hover:bg-black text-white"
              disabled={loading}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? '处理中...' : (isLogin ? '立即登录' : '注册账户')}
                {!loading && <ArrowRight size={18} />}
              </span>
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
            >
              {isLogin ? '还没有账户？点击注册' : '已有账户？直接登录'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};