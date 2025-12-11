import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { ChatMessage, UserRole, User } from '../types';
import { Button } from '../components/Button';
import { 
  Send, User as UserIcon, Bot, MoreVertical, 
  Smile, Paperclip, Search, CheckCheck, 
  Image as ImageIcon, Phone, ArrowLeft,
  ArrowDown, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatProps {
  currentUser: User;
  chatHistory: Record<string, ChatMessage[]>;
  onSendMessage: (text: string, conversationId: string) => void;
  onMarkAsRead?: (conversationId: string) => void;
}

interface MessageBubbleProps {
  msg: ChatMessage;
  isMerchantView: boolean;
}

// 快捷回复配置
const USER_QUICK_REPLIES = [
  "这件马面裙面料透气吗？",
  "身高160穿多大码合适？",
  "现在下单什么时候发货？",
  "发什么快递？",
  "支持七天无理由退换吗？"
];

const MERCHANT_QUICK_REPLIES = [
  "您好，欢迎光临锦绣马面裙！🌸",
  "亲，这款是现货，48小时内极速发货。",
  "建议您优先参考腰围数据来选购哦。",
  "我们默认发顺丰快递，确保送达时效。",
  "支持7天无理由退换货，请放心购买。"
];

// Helper to format time
const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ msg, isMerchantView }) => {
  // Determine if it's "My" message based on role
  // If msg.isAI is true, it is NEVER "Me", it's always the bot.
  const isMe = msg.isAI ? false : (isMerchantView ? msg.isMerchant : !msg.isMerchant);

  // Styling logic for AI vs Regular messages
  const getAvatar = () => {
    if (msg.isAI) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700">
          <Bot size={22} />
        </div>
      );
    }
    if (msg.isMerchant) {
      return (
        <img 
          src="https://s41.ax1x.com/2025/12/11/pZKisdP.png" 
          alt="Merchant" 
          className="w-full h-full object-cover" 
        />
      );
    }
    return <UserIcon size={20} />;
  };

  const getBubbleStyle = () => {
    if (msg.isAI) {
      return 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-900 rounded-2xl rounded-tl-none shadow-sm';
    }
    if (isMe) {
      return 'bg-gradient-to-br from-red-900 to-red-800 text-white rounded-2xl rounded-tr-none';
    }
    return 'bg-white border border-stone-100 text-stone-800 rounded-2xl rounded-tl-none';
  };

  return (
    <div className={`flex gap-3 mb-6 ${isMe ? 'flex-row-reverse' : 'flex-row'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden border-2 ${
        msg.isAI 
          ? 'border-amber-200'
          : msg.isMerchant 
            ? 'border-red-100 bg-white' 
            : 'bg-stone-100 border-stone-200 text-stone-600'
      }`}>
        {getAvatar()}
      </div>

      {/* Bubble Container */}
      <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Name Tag for AI or Merchant in User View (Optional) */}
        {!isMe && (msg.isAI || msg.isMerchant) && (
          <span className="text-[10px] font-bold text-stone-400 mb-1 ml-1 flex items-center gap-1">
             {msg.isAI ? <><Sparkles size={10} className="text-amber-500" /> 智能助手</> : msg.senderName}
          </span>
        )}

        <div className="flex items-end gap-2">
           {/* Message Content */}
           <div className={`px-5 py-3.5 shadow-sm text-sm leading-relaxed relative ${getBubbleStyle()}`}>
             {msg.text}
           </div>
           
           {/* Read Status (Visual Only for now) */}
           {isMe && (
             <div className="text-stone-300 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <CheckCheck size={14} />
             </div>
           )}
        </div>
        
        {/* Timestamp */}
        <span className="text-[10px] text-stone-400 mt-1.5 px-1 select-none">
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  );
};

// --- EXTRACTED COMPONENTS (Fix for Focus Issue) ---

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  isMerchant: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, subtitle, showBack, isMerchant }) => (
  <div className="h-[72px] px-6 bg-white/80 backdrop-blur-md border-b border-stone-100 flex items-center justify-between shrink-0 z-20 sticky top-0">
    <div className="flex items-center gap-4">
      {showBack && (
        <Link to="/" className="md:hidden text-stone-500 hover:text-stone-900">
          <ArrowLeft size={20} />
        </Link>
      )}
      <div className="relative">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden ${isMerchant ? 'bg-stone-100 text-stone-600' : 'bg-white'}`}>
          {isMerchant ? (
            <UserIcon size={22} />
          ) : (
            <img 
              src="https://s41.ax1x.com/2025/12/11/pZKisdP.png" 
              alt="Official" 
              className="w-full h-full object-cover" 
            />
          )}
        </div>
        {/* Online Status Dot */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      <div>
        <h2 className="font-bold text-stone-900 text-base leading-tight flex items-center gap-2">
          {title}
          {!isMerchant && <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-medium">官方</span>}
        </h2>
        {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="flex gap-1 text-stone-400">
       <button className="p-2 hover:bg-stone-100 rounded-full transition-colors" title="语音通话">
         <Phone size={20} />
       </button>
       <button className="p-2 hover:bg-stone-100 rounded-full transition-colors">
         <MoreVertical size={20} />
       </button>
    </div>
  </div>
);

interface ChatInputAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSend: () => void;
  quickReplies: string[];
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({ inputText, setInputText, handleSend, quickReplies }) => (
  <div className="p-4 pt-2 bg-white border-t border-stone-100 shrink-0 z-20 relative">
    {/* Decorative Gradient Line */}
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
    
    {/* Quick Replies */}
    <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar mask-linear-fade">
      {quickReplies.map((reply, index) => (
        <button
          key={index}
          onClick={() => setInputText(reply)}
          className="whitespace-nowrap px-3 py-1 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-stone-600 text-xs rounded-full transition-all border border-stone-200 shadow-sm hover:shadow active:scale-95 shrink-0"
        >
          {reply}
        </button>
      ))}
    </div>
    
    <div className="flex items-end gap-2 bg-stone-50 p-2 rounded-3xl border border-stone-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-200 transition-all shadow-inner">
      <div className="flex pb-2 pl-2 gap-1 text-stone-400">
         <button className="p-2 hover:bg-stone-200 hover:text-stone-600 rounded-full transition-colors"><Smile size={20} /></button>
         <button className="p-2 hover:bg-stone-200 hover:text-stone-600 rounded-full transition-colors"><ImageIcon size={20} /></button>
         <button className="p-2 hover:bg-stone-200 hover:text-stone-600 rounded-full transition-colors"><Paperclip size={20} /></button>
      </div>
      <textarea
        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-stone-900 placeholder:text-stone-400 resize-none py-3.5 max-h-32"
        placeholder="输入消息..."
        rows={1}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button 
        onClick={handleSend} 
        disabled={!inputText.trim()}
        className={`rounded-full h-11 w-11 p-0 flex items-center justify-center shrink-0 mb-0.5 transition-all duration-300 ${
          !inputText.trim() 
            ? 'bg-stone-200 text-stone-400 shadow-none' 
            : 'bg-red-800 text-white shadow-lg shadow-red-900/30 hover:scale-105 active:scale-95'
        }`}
      >
        <Send size={18} className={inputText.trim() ? 'ml-0.5' : ''} />
      </Button>
    </div>
  </div>
);

interface ScrollToBottomButtonProps {
  show: boolean;
  onClick: () => void;
  hasNewMessage: boolean;
}

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({ show, onClick, hasNewMessage }) => (
  show ? (
    <button 
      onClick={onClick}
      className="absolute bottom-24 right-6 z-30 p-2 bg-white text-red-800 rounded-full shadow-lg border border-stone-100 hover:bg-red-50 transition-all animate-in fade-in zoom-in duration-300"
      title="回到底部"
    >
      <ArrowDown size={20} />
      {hasNewMessage && (
         <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white"></span>
      )}
    </button>
  ) : null
);

// --- MAIN COMPONENT ---

export const Chat: React.FC<ChatProps> = ({ currentUser, chatHistory, onSendMessage, onMarkAsRead }) => {
  const [inputText, setInputText] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const isMerchant = currentUser.role === UserRole.MERCHANT;

  // Determine active conversation ID
  const activeConversationId = isMerchant ? selectedCustomerId : currentUser.id;
  
  // Get messages
  const currentMessages = activeConversationId ? (chatHistory[activeConversationId] || []) : [];

  // Get quick replies
  const currentQuickReplies = isMerchant ? MERCHANT_QUICK_REPLIES : USER_QUICK_REPLIES;

  // Merchant Message List Sorting
  const sortedCustomerIds = useMemo(() => {
    return Object.keys(chatHistory).sort((a, b) => {
      const msgsA = chatHistory[a];
      const msgsB = chatHistory[b];
      const lastA = msgsA[msgsA.length - 1];
      const lastB = msgsB[msgsB.length - 1];
      if (!lastA) return 1;
      if (!lastB) return -1;
      return new Date(lastB.timestamp).getTime() - new Date(lastA.timestamp).getTime();
    });
  }, [chatHistory]);

  // Auto-select first customer for merchant
  useEffect(() => {
    if (isMerchant && !selectedCustomerId && sortedCustomerIds.length > 0) {
      setSelectedCustomerId(sortedCustomerIds[0]);
    }
  }, [isMerchant, sortedCustomerIds, selectedCustomerId]);

  // Mark as read when merchant selects a customer
  useEffect(() => {
    if (isMerchant && selectedCustomerId && onMarkAsRead) {
      onMarkAsRead(selectedCustomerId);
    }
  }, [selectedCustomerId, isMerchant, onMarkAsRead, chatHistory]);

  // Mark as read when USER enters their chat
  useEffect(() => {
    if (!isMerchant && activeConversationId && onMarkAsRead) {
      onMarkAsRead(activeConversationId);
    }
  }, [activeConversationId, isMerchant, onMarkAsRead, chatHistory]);

  // Handle Scroll Logic
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        // Use scrollTop instead of scrollIntoView to prevent page jumping
        scrollContainerRef.current.scrollTo({
            top: scrollHeight - clientHeight,
            behavior: behavior
        });
    }
    setShowScrollBottom(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // Calculate if user is near bottom (within 100px)
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    if (isNearBottom) {
      setShowScrollBottom(false);
    } else {
      setShowScrollBottom(true);
    }
  };

  // Effect: Force scroll to bottom when a new message is added (Sent or Received)
  // This ensures that when the message list grows, we always see the latest one.
  useEffect(() => {
    scrollToBottom('smooth');
  }, [currentMessages]);

  // Effect: Instant jump to bottom on conversation switch
  useLayoutEffect(() => {
    if (activeConversationId) {
      scrollToBottom('auto'); 
    }
  }, [activeConversationId]);

  const handleSend = () => {
    if (!inputText.trim() || !activeConversationId) return;
    onSendMessage(inputText, activeConversationId);
    setInputText('');
  };

  // --- RENDER ---

  if (isMerchant) {
    return (
      <div className="h-[calc(100vh-140px)] max-h-[800px] max-w-7xl mx-auto bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-stone-100 overflow-hidden flex font-sans">
        
        {/* Sidebar */}
        <div className="w-80 border-r border-stone-100 bg-stone-50/50 flex flex-col">
          <div className="p-5">
            <h2 className="font-serif font-bold text-stone-900 text-xl mb-4">消息列表</h2>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-red-800 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="搜索顾客..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-red-800 focus:ring-4 focus:ring-red-800/5 transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0 px-3 pb-3 space-y-1">
            {sortedCustomerIds.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-3 opacity-60">
                <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center overflow-hidden">
                   <img src="https://s41.ax1x.com/2025/12/11/pZKisdP.png" alt="Logo" className="w-10 h-10 object-contain opacity-40 grayscale" />
                </div>
                <span className="text-sm font-medium">暂无消息咨询</span>
              </div>
            ) : (
              sortedCustomerIds.map(custId => {
                const msgs = chatHistory[custId];
                const lastMsg = msgs[msgs.length - 1];
                const isSelected = selectedCustomerId === custId;
                const unreadCount = msgs.filter(m => !m.isMerchant && !m.isRead).length;
                
                // Find the actual customer name (first message from non-merchant)
                const customerName = msgs.find(m => !m.isMerchant)?.senderName || '匿名用户';
                
                return (
                  <button
                    key={custId}
                    onClick={() => setSelectedCustomerId(custId)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 relative group flex items-start gap-3 ${
                      isSelected 
                        ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-stone-100' 
                        : 'hover:bg-stone-100/80 hover:scale-[0.99]'
                    }`}
                  >
                     {/* Active Indicator Line */}
                     {isSelected && <div className="absolute left-0 top-3 bottom-3 w-1 bg-red-800 rounded-r-full"></div>}

                    <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected ? 'bg-red-50 border-red-100 text-red-800' : 'bg-white border-stone-200 text-stone-400'
                        }`}>
                          <UserIcon size={20} />
                        </div>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-stone-50">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-bold text-sm truncate ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                          {customerName}
                        </span>
                        <span className={`text-[10px] shrink-0 font-medium ${isSelected ? 'text-red-800' : 'text-stone-400'}`}>
                          {lastMsg && formatTime(lastMsg.timestamp)}
                        </span>
                      </div>
                      <p className={`text-xs truncate leading-relaxed ${isSelected || unreadCount > 0 ? 'text-stone-800' : 'text-stone-400'} ${unreadCount > 0 ? 'font-semibold' : ''}`}>
                        {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : ''}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-stone-50/30 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>

          {selectedCustomerId ? (
            <>
              <ChatHeader 
                title={chatHistory[selectedCustomerId]?.find(m => !m.isMerchant)?.senderName || '顾客'} 
                subtitle={`顾客ID: ${selectedCustomerId} • 来自商品详情页`} 
                isMerchant={true}
              />
              
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto min-h-0 p-6 scroll-smooth z-10"
              >
                <div className="text-center text-xs text-stone-400 mb-6 flex items-center justify-center gap-2 before:h-px before:w-12 before:bg-stone-200 after:h-px after:w-12 after:bg-stone-200">
                  {new Date().toLocaleDateString()}
                </div>
                {currentMessages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} isMerchantView={true} />
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <ScrollToBottomButton 
                show={showScrollBottom}
                onClick={() => scrollToBottom('smooth')}
                hasNewMessage={currentMessages.length > 0}
              />
              <ChatInputArea 
                inputText={inputText}
                setInputText={setInputText}
                handleSend={handleSend}
                quickReplies={currentQuickReplies}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-stone-400 z-10">
              <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6 shadow-inner overflow-hidden">
                 <img src="https://s41.ax1x.com/2025/12/11/pZKisdP.png" alt="Logo" className="w-16 h-16 object-contain opacity-50 grayscale" />
              </div>
              <p className="font-serif font-bold text-lg text-stone-600">锦绣客服中心</p>
              <p className="text-sm mt-2">请从左侧列表选择一位顾客开始接待</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- USER VIEW ---
  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] max-h-[800px] flex flex-col bg-stone-50/30 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-stone-100 overflow-hidden font-sans relative">
       {/* Background Pattern */}
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
       }}></div>

      <ChatHeader 
        title="锦绣官方旗舰店" 
        subtitle="通常在 5 分钟内回复"
        showBack={true}
        isMerchant={false}
      />

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-0 p-6 z-10"
      >
        <div className="flex justify-center mb-8">
           <span className="text-[10px] font-medium text-stone-500 bg-stone-100/80 backdrop-blur px-3 py-1 rounded-full border border-stone-200/50 shadow-sm">
             您已进入人工客服通道，通话将被录音
           </span>
        </div>

        {currentMessages.length === 0 && (
           <div className="flex flex-col items-center justify-center py-12 opacity-80">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 rotate-3 shadow-sm border border-red-100 overflow-hidden">
               <img 
                 src="https://s41.ax1x.com/2025/12/11/pZKisdP.png" 
                 alt="Logo" 
                 className="w-full h-full object-cover" 
               />
             </div>
             <p className="font-bold text-stone-800 mb-1">欢迎咨询锦绣客服</p>
             <p className="text-sm text-stone-500">有什么可以帮您？试试下方的快捷提问。</p>
           </div>
        )}

        {currentMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} isMerchantView={false} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ScrollToBottomButton 
        show={showScrollBottom}
        onClick={() => scrollToBottom('smooth')}
        hasNewMessage={currentMessages.length > 0}
      />
      <ChatInputArea 
        inputText={inputText}
        setInputText={setInputText}
        handleSend={handleSend}
        quickReplies={currentQuickReplies}
      />
    </div>
  );
};