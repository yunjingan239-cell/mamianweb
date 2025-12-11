import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { StoreFront } from './pages/user/StoreFront';
import { ProductDetail } from './pages/user/ProductDetail';
import { Cart } from './pages/user/Cart';
import { UserOrders } from './pages/user/Orders';
import { Chat } from './pages/Chat';
import { MerchantDashboard } from './pages/merchant/Dashboard';
import { ProductManage } from './pages/merchant/ProductManage';
import { MerchantOrders } from './pages/merchant/Orders';
import { User, Product, CartItem, UserRole, ChatMessage, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_CHAT_HISTORY } from './constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
  currentUser: User | null;
}

// Route protection wrapper
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRole, 
  currentUser 
}) => {
  if (!currentUser) return <Navigate to="/login" />;
  if (currentUser.role !== allowedRole) return <Navigate to="/" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  // Global State
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('jinxiu_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('jinxiu_products');
    return savedProducts ? JSON.parse(savedProducts) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('jinxiu_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('jinxiu_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Chat State: Record<CustomerId, Messages[]>
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(() => {
    const savedChats = localStorage.getItem('jinxiu_chats');
    return savedChats ? JSON.parse(savedChats) : INITIAL_CHAT_HISTORY;
  });

  // Persistence Effects
  useEffect(() => {
    if (user) localStorage.setItem('jinxiu_user', JSON.stringify(user));
    else localStorage.removeItem('jinxiu_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('jinxiu_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('jinxiu_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jinxiu_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('jinxiu_chats', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Real-time sync for Chat across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jinxiu_chats' && e.newValue) {
        setChatHistory(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Calculate global unread status
  const hasUnreadMessages = useMemo(() => {
    if (!user) return false;
    
    return Object.entries(chatHistory).some(([customerId, messages]) => {
      // If user is merchant, check if there are unread messages from CUSTOMERS in ANY chat
      if (user.role === UserRole.MERCHANT) {
        return messages.some(msg => !msg.isMerchant && !msg.isRead);
      }
      
      // If user is regular user, only check THEIR chat for unread messages from MERCHANT
      if (customerId === user.id) {
        return messages.some(msg => msg.isMerchant && !msg.isRead);
      }
      
      return false;
    });
  }, [user, chatHistory]);

  // Cart Actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // Order Actions
  const createOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Product Actions (Merchant)
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Chat Actions
  const handleSendMessage = (text: string, conversationId: string) => {
    if (!user) return;
    
    const isMerchant = user.role === UserRole.MERCHANT;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      text: text,
      timestamp: new Date().toISOString(),
      isMerchant: isMerchant,
      isRead: isMerchant // Merchant messages are read by default (by the merchant themselves), user messages are unread for merchant
    };

    setChatHistory(prev => {
      const currentMessages = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: [...currentMessages, newMessage]
      };
    });
  };

  // Mark conversation as read
  const markAsRead = (conversationId: string) => {
    setChatHistory(prev => {
      const messages = prev[conversationId] || [];
      if (!user) return prev;

      const isMerchant = user.role === UserRole.MERCHANT;
      
      // Determine if there are unread messages relevant to the current user
      // If Merchant: look for unread User messages
      // If User: look for unread Merchant messages
      const hasRelevantUnread = messages.some(m => 
        isMerchant 
          ? (!m.isMerchant && !m.isRead) 
          : (m.isMerchant && !m.isRead)
      );
      
      if (!hasRelevantUnread) return prev;

      const updatedMessages = messages.map(m => {
        // Mark as read if it was sent by the "other" party and is currently unread
        if ((isMerchant && !m.isMerchant) || (!isMerchant && m.isMerchant)) {
          return { ...m, isRead: true };
        }
        return m;
      });
      
      return {
        ...prev,
        [conversationId]: updatedMessages
      };
    });
  };

  // Auth Actions
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
  };

  return (
    <Router>
      <Layout 
        userRole={user?.role || null} 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onLogout={handleLogout}
        hasUnreadMessages={hasUnreadMessages}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Auth onLogin={handleLogin} />} />
          
          {/* User Routes */}
          <Route path="/" element={
            <StoreFront products={products} addToCart={addToCart} />
          } />
          <Route path="/product/:id" element={
            <ProductDetail products={products} addToCart={addToCart} />
          } />
          <Route path="/cart" element={
            <Cart 
              items={cart} 
              currentUser={user}
              updateQuantity={updateCartQuantity} 
              removeItem={removeFromCart} 
              clearCart={clearCart}
              createOrder={createOrder}
            />
          } />

          {/* Protected Merchant Routes */}
          <Route path="/merchant/dashboard" element={
            <ProtectedRoute allowedRole={UserRole.MERCHANT} currentUser={user}>
              <MerchantDashboard orders={orders} />
            </ProtectedRoute>
          } />
          <Route path="/merchant/products" element={
            <ProtectedRoute allowedRole={UserRole.MERCHANT} currentUser={user}>
              <ProductManage 
                products={products}
                onAdd={addProduct}
                onUpdate={updateProduct}
                onDelete={deleteProduct}
              />
            </ProtectedRoute>
          } />
          <Route path="/merchant/orders" element={
            <ProtectedRoute allowedRole={UserRole.MERCHANT} currentUser={user}>
              <MerchantOrders orders={orders} updateStatus={updateOrderStatus} />
            </ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="/orders" element={
             user ? (
               <UserOrders orders={orders.filter(o => o.userId === user.id)} />
             ) : <Navigate to="/login" />
          } />
          
          <Route path="/chat" element={
            user ? (
              <Chat 
                currentUser={user} 
                chatHistory={chatHistory}
                onSendMessage={handleSendMessage}
                onMarkAsRead={markAsRead}
              />
            ) : <Navigate to="/login" />
          } />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;