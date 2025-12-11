import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts';
import { 
  Users, DollarSign, ShoppingBag, TrendingUp, MessageSquareWarning, 
  ThumbsDown, Clock, Truck, HeartCrack, Headphones, Layers, Tag, UserX
} from 'lucide-react';
import { Order } from '../../types';

interface MerchantDashboardProps {
  orders: Order[];
}

// --- Mock Data Definitions ---

const SALES_DATA = [
  { name: '周一', sales: 4000 },
  { name: '周二', sales: 3000 },
  { name: '周三', sales: 2000 },
  { name: '周四', sales: 2780 },
  { name: '周五', sales: 1890 },
  { name: '周六', sales: 2390 },
  { name: '周日', sales: 3490 },
];

const SENTIMENT_DATA = [
  { name: '好评 (5星)', value: 65, color: '#166534' }, // green-800
  { name: '中评 (3-4星)', value: 25, color: '#ca8a04' }, // yellow-600
  { name: '差评 (1-2星)', value: 10, color: '#991b1b' }, // red-800
];

const REFUND_REASON_DATA = [
  { name: '尺码不符', count: 120 },
  { name: '面料质感', count: 85 },
  { name: '物流延误', count: 45 },
  { name: '做工瑕疵', count: 30 },
  { name: '拍错/不想要', count: 20 },
];

// Enhanced Data for Trend Switching
const TREND_DATASETS = {
  all: [
    { name: 'W1', count: 5 },
    { name: 'W2', count: 8 },
    { name: 'W3', count: 12 }, // Peak
    { name: 'W4', count: 7 },
    { name: 'W5', count: 4 },
  ],
  quality: [
    { name: 'W1', count: 2 },
    { name: 'W2', count: 3 },
    { name: 'W3', count: 9 }, // Quality issue spiked here
    { name: 'W4', count: 4 },
    { name: 'W5', count: 1 },
  ],
  service: [
    { name: 'W1', count: 3 },
    { name: 'W2', count: 5 },
    { name: 'W3', count: 3 },
    { name: 'W4', count: 3 },
    { name: 'W5', count: 3 }, // Consistent low level complaints
  ]
};

const JOURNEY_SATISFACTION_DATA = [
  { subject: '下单便捷度', A: 95, fullMark: 100 },
  { subject: '物流时效', A: 70, fullMark: 100 }, // Pain point
  { subject: '商品相符', A: 88, fullMark: 100 },
  { subject: '客服态度', A: 92, fullMark: 100 },
  { subject: '售后处理', A: 75, fullMark: 100 }, // Pain point
];

const PAIN_POINT_TAGS = [
  { text: '腰围偏小', count: 42, severity: 'high' },
  { text: '面料扎人', count: 35, severity: 'high' },
  { text: '发货慢', count: 28, severity: 'medium' },
  { text: '色差明显', count: 15, severity: 'medium' },
  { text: '回复不及时', count: 12, severity: 'low' },
];

// --- Components ---

const StatCard: React.FC<{ 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend?: string;
  trendUp?: boolean; // true for green, false for red
  subtext?: string;
}> = ({ title, value, icon, trend, trendUp = true, subtext }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-slate-50 text-slate-700 rounded-lg border border-slate-100">{icon}</div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
    {subtext && <p className="text-xs text-slate-400 mt-3 border-t border-slate-50 pt-3">{subtext}</p>}
  </div>
);

const SectionHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="mb-6 mt-8">
    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span className="w-1 h-5 bg-red-800 rounded-full"></span>
      {title}
    </h2>
    <p className="text-sm text-slate-500 ml-3">{subtitle}</p>
  </div>
);

type TrendType = 'all' | 'quality' | 'service';

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ orders }) => {
  const [activeTrendType, setActiveTrendType] = useState<TrendType>('all');

  const baseRevenue = 128430;
  const currentRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalRevenue = baseRevenue + currentRevenue;
  
  // Simulated Service Metrics
  const avgResponseTime = "3.5 分钟";
  const complaintRate = "1.2%";
  const logisticsScore = "4.2/5.0";

  // Helper for Chart Config
  const getChartConfig = (type: TrendType) => {
    switch (type) {
      case 'quality':
        return { color: '#d97706', gradientFrom: '#d97706', label: '质量问题' }; // Amber
      case 'service':
        return { color: '#2563eb', gradientFrom: '#2563eb', label: '服务投诉' }; // Blue
      default:
        return { color: '#991b1b', gradientFrom: '#991b1b', label: '反馈总数' }; // Red
    }
  };

  const currentChartConfig = getChartConfig(activeTrendType);

  return (
    <div className="space-y-6 pb-12 font-sans animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">商家数据看板</h1>
        <p className="text-slate-500">全方位洞察销售业绩与用户体验</p>
      </div>

      {/* --- 1. Core KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="总销售额" 
          value={`¥${totalRevenue.toLocaleString()}`} 
          icon={<DollarSign size={20} />} 
          trend="+12.5%"
          subtext="较上周增长 ¥12,000"
        />
        <StatCard 
          title="售后/退款率" 
          value="4.8%" 
          icon={<HeartCrack size={20} />} 
          trend="+0.5%"
          trendUp={false}
          subtext="行业平均水平 5.2%"
        />
        <StatCard 
          title="客服平均响应" 
          value={avgResponseTime} 
          icon={<Headphones size={20} />} 
          trend="-30秒"
          trendUp={true}
          subtext="高峰期响应稍慢"
        />
        <StatCard 
          title="差评率 (1-2星)" 
          value="1.2%" 
          icon={<ThumbsDown size={20} />} 
          trend="-0.2%"
          trendUp={true}
          subtext="主要集中在物流环节"
        />
      </div>

      {/* --- 2. Voice of Customer (Sentiment & Pain Points) --- */}
      <SectionHeader title="用户声音与体验洞察" subtitle="基于用户评价、聊天记录与售后反馈的情绪分析" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Analysis */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            评价情绪分布
            <MessageSquareWarning size={16} className="text-slate-400" />
          </h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SENTIMENT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SENTIMENT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, '占比']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-3xl font-bold text-slate-900">90%</span>
              <span className="text-xs text-slate-400">好评率</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
            <span className="font-bold text-red-800">警示：</span> 近期差评主要关联“尺码不准”，建议优化详情页尺码表。
          </div>
        </div>

        {/* Negative Feedback Trend (UPDATED) */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
             <h3 className="text-sm font-bold text-slate-900">负面反馈趋势 (近5周)</h3>
             
             {/* Custom Segmented Control */}
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTrendType('all')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    activeTrendType === 'all' 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Layers size={14} /> 综合
                </button>
                <button 
                  onClick={() => setActiveTrendType('quality')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    activeTrendType === 'quality' 
                      ? 'bg-white text-amber-700 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Tag size={14} /> 质量
                </button>
                <button 
                  onClick={() => setActiveTrendType('service')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    activeTrendType === 'service' 
                      ? 'bg-white text-blue-700 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <UserX size={14} /> 服务
                </button>
             </div>
           </div>
           
           <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATASETS[activeTrendType]} key={activeTrendType}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentChartConfig.gradientFrom} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={currentChartConfig.gradientFrom} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  tickFormatter={(val) => `第${val.replace('W','')}周`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`${value} 条`, currentChartConfig.label]}
                  labelFormatter={(label) => `第 ${label.replace('W','')} 周`}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name={currentChartConfig.label}
                  stroke={currentChartConfig.color}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  strokeWidth={2}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Pain Points Cloud */}
         <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 mb-4">体验痛点词云 (高频抱怨)</h3>
            <div className="flex-1 flex flex-wrap content-start gap-3">
              {PAIN_POINT_TAGS.map((tag, i) => (
                <div 
                  key={i} 
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border flex items-center gap-2 ${
                    tag.severity === 'high' 
                      ? 'bg-red-50 text-red-800 border-red-100' 
                      : tag.severity === 'medium'
                      ? 'bg-amber-50 text-amber-800 border-amber-100'
                      : 'bg-slate-50 text-slate-600 border-slate-100'
                  }`}
                >
                  {tag.text}
                  <span className="bg-white/50 px-1.5 rounded text-xs">{tag.count}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-4">
              * 数据来源于聊天记录关键词提取及评价标签分析
            </p>
         </div>

         {/* Refund Reasons */}
         <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">退款/退货原因 TOP5</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={REFUND_REASON_DATA} margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={70} axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#475569'}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ borderRadius: '8px' }} 
                    formatter={(value: number) => [`${value} 单`, '数量']}
                  />
                  <Bar dataKey="count" name="数量" fill="#475569" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* --- 3. Service & Journey Quality --- */}
      <SectionHeader title="全链路服务质量" subtitle="用户旅程关键节点的满意度评分" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Journey Radar */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-1">
           <h3 className="text-sm font-bold text-slate-900 mb-2">用户旅程满意度雷达</h3>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={JOURNEY_SATISFACTION_DATA}>
                 <PolarGrid stroke="#e2e8f0" />
                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                 <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                 <Radar
                   name="满意度评分"
                   dataKey="A"
                   stroke="#991b1b"
                   strokeWidth={2}
                   fill="#991b1b"
                   fillOpacity={0.2}
                 />
                 <Tooltip formatter={(value: number) => [`${value} 分`, '评分']} />
               </RadarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Detailed Service Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
           <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><Truck size={18} /></div>
                 <span className="font-bold text-slate-700">物流体验</span>
              </div>
              <div className="space-y-3 mt-4">
                 <div>
                   <div className="flex justify-between text-xs text-slate-500 mb-1">
                     <span>发货速度满意度</span>
                     <span>85%</span>
                   </div>
                   <div className="w-full bg-slate-200 rounded-full h-1.5">
                     <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs text-slate-500 mb-1">
                     <span>包裹完整性</span>
                     <span>98%</span>
                   </div>
                   <div className="w-full bg-slate-200 rounded-full h-1.5">
                     <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                   </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600"><Clock size={18} /></div>
                 <span className="font-bold text-slate-700">客服效能</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                 <div>
                   <p className="text-xs text-slate-500">平均首响时长</p>
                   <p className="text-xl font-bold text-slate-900 mt-1">28s</p>
                 </div>
                 <div>
                   <p className="text-xs text-slate-500">问题一次解决率</p>
                   <p className="text-xl font-bold text-slate-900 mt-1">76%</p>
                 </div>
                 <div className="col-span-2">
                   <p className="text-xs text-slate-500 mb-1">客服满意度评分</p>
                   <div className="flex items-center gap-1">
                     {[1,2,3,4].map(i => <div key={i} className="w-6 h-1.5 bg-amber-500 rounded-full"></div>)}
                     <div className="w-6 h-1.5 bg-amber-200 rounded-full"></div>
                     <span className="ml-2 text-sm font-bold text-amber-700">4.2</span>
                   </div>
                 </div>
              </div>
           </div>
           
           {/* Insight Box */}
           <div className="col-span-1 sm:col-span-2 bg-gradient-to-r from-red-900 to-red-800 rounded-xl p-5 text-white flex items-center justify-between shadow-lg">
             <div>
               <h4 className="font-bold flex items-center gap-2 text-sm md:text-base">
                 <TrendingUp size={16} className="text-red-200" />
                 体验转化洞察
               </h4>
               <p className="text-xs text-red-100 mt-1 opacity-80 max-w-lg">
                 数据显示：包含“实物拍摄图”的评价能提升 15% 的静默下单转化率；“尺码推荐”类回复能降低 20% 的退货率。
               </p>
             </div>
             <button className="hidden sm:block text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/20 transition-colors">
               查看详细报告
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};