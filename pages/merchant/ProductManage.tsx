import React, { useState } from 'react';
import { Product } from '../../types';
import { Button } from '../../components/Button';
import { Edit2, Trash2, Plus, X, Image as ImageIcon, Package, Tag, FileText, Layers, AlignLeft } from 'lucide-react';

interface ProductManageProps {
  products: Product[];
  onAdd: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductManage: React.FC<ProductManageProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', price: 0, category: '传统礼服', description: '', material: '', stock: 0
  });

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', price: 0, category: '传统礼服', description: '', material: '', stock: 0,
        image: 'img/马面占位.png'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdate({ ...editingProduct, ...formData } as Product);
    } else {
      onAdd({
        id: Date.now().toString(),
        ...formData,
        image: formData.image || 'img/马面占位.png'
      } as Product);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">藏品管理</h1>
          <p className="text-stone-500 mt-1">管理您的商品库存与详细信息</p>
        </div>
        <Button onClick={() => openModal()} className="shadow-lg shadow-red-900/20 flex items-center gap-2 px-6">
          <Plus size={18} /> 发布新裳
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-5 text-xs font-serif font-bold text-stone-600 uppercase tracking-wider">商品信息</th>
                <th className="px-6 py-5 text-xs font-serif font-bold text-stone-600 uppercase tracking-wider">价格</th>
                <th className="px-6 py-5 text-xs font-serif font-bold text-stone-600 uppercase tracking-wider">库存状态</th>
                <th className="px-6 py-5 text-xs font-serif font-bold text-stone-600 uppercase tracking-wider">分类</th>
                <th className="px-6 py-5 text-xs font-serif font-bold text-stone-600 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map(product => (
                <tr key={product.id} className="group hover:bg-stone-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-md overflow-hidden shadow-sm border border-stone-200 shrink-0">
                         <img src={product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-bold text-stone-900 block">{product.name}</span>
                        <span className="text-xs text-stone-400">ID: {product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-serif text-red-900 font-bold">¥{product.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${product.stock < 20 ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                       <span className={`text-sm font-medium ${product.stock < 20 ? 'text-amber-700' : 'text-stone-600'}`}>
                         {product.stock} 件
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">
                    <span className="bg-stone-100 px-2 py-1 rounded text-xs text-stone-600 border border-stone-200">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(product)} 
                        className="p-2 text-stone-500 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                        title="编辑"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(product.id)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="删除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-stone-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-stone-100 bg-white">
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  {editingProduct ? '编辑藏品' : '录入新裳'}
                </h2>
                <p className="text-sm text-stone-500 mt-1">请填写下方信息以{editingProduct ? '更新' : '发布'}商品</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-red-50 hover:text-red-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-8 bg-stone-50/50">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                   {/* Left Column: Image */}
                   <div className="md:col-span-4 space-y-4">
                      <div className="aspect-[3/4] w-full rounded-xl overflow-hidden border-2 border-dashed border-stone-300 bg-white flex items-center justify-center relative group hover:border-red-300 transition-all shadow-sm">
                        {formData.image ? (
                          <>
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                              <ImageIcon size={24} />
                              <span className="text-xs font-medium">更换图片</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-stone-400 p-4">
                            <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                            <span className="text-xs font-medium">暂无图片预览</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="text-xs font-bold text-stone-600 mb-1.5 block">图片链接</label>
                        <div className="relative">
                          <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input 
                            type="text" 
                            placeholder="https://..."
                            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 hover:border-red-300 transition-all placeholder:text-stone-300 shadow-sm"
                            value={formData.image}
                            onChange={e => setFormData({...formData, image: e.target.value})}
                          />
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1.5 leading-relaxed">
                          建议使用 3:4 比例的高清图片，以获得最佳展示效果。
                        </p>
                      </div>
                   </div>

                   {/* Right Column: Form Fields */}
                   <div className="md:col-span-8 space-y-6">
                      
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-stone-700 flex items-center gap-1.5">
                           商品名称 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                           <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                           <input 
                            type="text" 
                            required 
                            placeholder="例如：龙凤呈祥织金马面裙"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 hover:border-red-300 transition-all placeholder:text-stone-300 shadow-sm text-stone-900"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>

                      {/* Price & Stock */}
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-stone-700 flex items-center gap-1.5">
                             销售价格 <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-serif font-bold">¥</span>
                            <input 
                              type="number" 
                              required 
                              min="0"
                              className="w-full pl-9 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 hover:border-red-300 transition-all font-mono text-stone-900 shadow-sm"
                              value={formData.price}
                              onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-stone-700 flex items-center gap-1.5">
                             库存数量 <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Package size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input 
                              type="number" 
                              required 
                              min="0"
                              className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 hover:border-red-300 transition-all font-mono text-stone-900 shadow-sm"
                              value={formData.stock}
                              onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-stone-700 flex items-center gap-1.5">
                           所属分类 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                           <Layers size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                           <select 
                             className="w-full pl-10 pr-10 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 hover:border-red-300 transition-all appearance-none cursor-pointer text-stone-900 shadow-sm"
                             value={formData.category}
                             onChange={e => setFormData({...formData, category: e.target.value})}
                           >
                            <option>传统礼服</option>
                            <option>新中式改良</option>
                            <option>日常通勤</option>
                            <option>婚嫁喜服</option>
                            <option>配饰小物</option>
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-stone-700 flex items-center gap-1.5">
                           详情描述 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                           <AlignLeft size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
                           <textarea 
                            required 
                            rows={5}
                            placeholder="请描述面料材质、刺绣工艺、纹样寓意及洗涤建议等..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800 hover:border-red-300 transition-all resize-none placeholder:text-stone-300 shadow-sm text-stone-900 leading-relaxed"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                          />
                        </div>
                      </div>

                   </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-stone-100 bg-white flex justify-between items-center">
              <span className="text-xs text-stone-400 font-medium hidden sm:inline-block">
                带 * 号为必填项
              </span>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 sm:flex-none justify-center rounded-xl border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900">
                  取消
                </Button>
                <Button type="submit" form="product-form" className="flex-1 sm:flex-none justify-center rounded-xl shadow-lg shadow-red-900/20 px-8 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700">
                  {editingProduct ? '保存修改' : '确认上架'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};