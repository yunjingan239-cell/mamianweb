import { Product, ChatMessage } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '龙凤呈祥织金马面裙',
    description: '采用传统织金工艺，龙凤纹样寓意吉祥如意，裙门宽大，褶裥工整，适合婚礼或隆重场合穿着。',
    price: 1299,
    image: 'https://s41.ax1x.com/2025/12/11/pZKi1q1.png',
    category: '传统礼服',
    material: '真丝织金',
    stock: 50,
    color: '正红',
  },
  {
    id: '2',
    name: '月下仙鹤改良百褶裙',
    description: '优雅的黑色底料搭配银线刺绣仙鹤，保留了马面裙的形制，采用了更轻便的改良面料，适合日常通勤与现代混搭。',
    price: 899,
    image: 'https://s41.ax1x.com/2025/12/11/pZKi8Vx.png',
    category: '新中式改良',
    material: '聚酯纤维混纺',
    stock: 120,
    color: '墨黑',
  },
  {
    id: '3',
    name: '宋韵清风仿宋锦马面',
    description: '灵感源自宋代美学，淡雅的绿色调，面料轻薄透气，垂感极佳，尽显文人雅士之风。',
    price: 1599,
    image: 'https://s41.ax1x.com/2025/12/11/pZKi1q1.png',
    category: '日常通勤',
    material: '棉麻混纺',
    stock: 30,
    color: '豆青',
  },
  {
    id: '4',
    name: '富贵牡丹宫廷款',
    description: '奢华的金色底纹，大朵牡丹刺绣栩栩如生，还原明代宫廷服饰的雍容华贵。',
    price: 2499,
    image: 'https://s41.ax1x.com/2025/12/11/pZKi8Vx.png',
    category: '传统礼服',
    material: '重磅织锦缎',
    stock: 15,
    color: '流金',
  },
  {
    id: '5',
    name: '水墨竹韵书香裙',
    description: '极简白底设计，手绘水墨竹子纹样，清冷孤傲，适合搭配衬衫打造新中式知性风。',
    price: 750,
    image: 'https://s41.ax1x.com/2025/12/11/pZKi1q1.png',
    category: '日常通勤',
    material: '天丝',
    stock: 80,
    color: '月白',
  },
];

export const INITIAL_CHAT_HISTORY: Record<string, ChatMessage[]> = {
  'customer_001': [
    {
      id: 'msg_1',
      senderId: 'customer_001',
      senderName: '王语嫣',
      text: '你好，请问这款龙凤呈祥马面裙我身高165，体重52kg穿什么码合适？',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      isMerchant: false,
      isRead: true,
    },
    {
      id: 'msg_ai_1',
      senderId: 'ai_bot',
      senderName: '锦绣智能助手',
      text: '您好！根据大数据匹配，您的身材非常标准。建议您选择 M码 (165/68A)。这款裙子支持调节腰围，M码的调节范围（64-70cm）应该非常适合您。',
      timestamp: new Date(Date.now() - 86400000 * 2 + 30000).toISOString(),
      isMerchant: true,
      isRead: true,
      isAI: true,
    },
    {
      id: 'msg_2',
      senderId: 'merchant_1',
      senderName: '锦绣官方旗舰店',
      text: '亲，您可以参考一下哦。M码裙长和腰围会比较合适。',
      timestamp: new Date(Date.now() - 86400000 * 2 + 60000).toISOString(),
      isMerchant: true,
      isRead: true,
    },
    {
      id: 'msg_3',
      senderId: 'customer_001',
      senderName: '王语嫣',
      text: '好的，面料会容易皱吗？洗涤有什么要注意的？',
      timestamp: new Date(Date.now() - 86400000 * 2 + 120000).toISOString(),
      isMerchant: false,
      isRead: true,
    }
  ],
  'customer_002': [
    {
      id: 'msg_4',
      senderId: 'customer_002',
      senderName: '林黛玉',
      text: '已下单，请问什么时候发货？今天要送人的，比较急。',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
      isMerchant: false,
      isRead: true,
    },
    {
      id: 'msg_5',
      senderId: 'merchant_1',
      senderName: '锦绣官方旗舰店',
      text: '亲，下午4点前的订单当天发出，我们默认发顺丰空运，大概明天能到。',
      timestamp: new Date(Date.now() - 3600000 * 4.9).toISOString(),
      isMerchant: true,
      isRead: true,
    }
  ],
  'customer_003': [
    {
      id: 'msg_6',
      senderId: 'customer_003',
      senderName: '薛宝钗',
      text: '收到的裙子腰头这里好像有点线头，怎么处理？',
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
      isMerchant: false,
      isRead: false, // 模拟未读消息
    }
  ]
};