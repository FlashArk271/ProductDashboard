import { useState, useEffect } from 'react';
import { api, Product } from '@/utils/api';
import svgPaths from "@/imports/svg-0m6vwriqrf";
import { Plus, Edit2, Trash2, Home, Package, Search, ChevronDown, LayoutGrid } from 'lucide-react';
import ProductModal from './ProductModal';
import { toast } from 'sonner';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'published' | 'unpublished'>('published');
  const [activePage, setActivePage] = useState<'home' | 'products'>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { products: fetchedProducts } = await api.getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load products';
      
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        toast.error('Session expired. Please login again.');
        onLogout();
        return;
      }
      
      toast.error(`Error loading products: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleTogglePublish = async (product: Product) => {
    try {
      const { product: updatedProduct } = await api.updateProduct(product.id, {
        isPublished: !product.isPublished
      });
      setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
      toast.success(`Product ${updatedProduct.isPublished ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Failed to update product status');
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        const { product: updatedProduct } = await api.updateProduct(editingProduct.id, productData);
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
        toast.success('Product updated successfully');
      } else {
        const { product: newProduct } = await api.createProduct(productData);
        setProducts([...products, newProduct]);
        toast.success('Product added Successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product';
      toast.error(`Error saving product: ${errorMessage}`);
    }
  };

  const publishedProducts = products.filter(p => p.isPublished);
  const unpublishedProducts = products.filter(p => !p.isPublished);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brandName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex">
      {/* Sidebar */}
      <div className="w-[200px] bg-[#1e2a4a] min-h-screen flex flex-col">
        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-2">
          <p className="font-['AvertaStd-Black:☞',sans-serif] text-white text-[20px]">Productr</p>
          <div className="h-[20px] w-[20px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.6561 26.6392">
              <path d={svgPaths.p3f69e148} fill="#FF662B" />
            </svg>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2d3a5c] text-white text-[13px] pl-9 pr-3 py-2 rounded-lg outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <button
            onClick={() => setActivePage('home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] mb-1 transition-colors ${
              activePage === 'home' 
                ? 'bg-[#2d3a5c] text-white' 
                : 'text-gray-400 hover:text-white hover:bg-[#2d3a5c]/50'
            }`}
          >
            <Home size={18} />
            Home
          </button>
          <button
            onClick={() => setActivePage('products')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors ${
              activePage === 'products' 
                ? 'bg-[#2d3a5c] text-white' 
                : 'text-gray-400 hover:text-white hover:bg-[#2d3a5c]/50'
            }`}
          >
            <Package size={18} />
            Products
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-[#e5e7eb] px-6 py-3 flex items-center justify-between" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,200,150,0.3) 0%, rgba(200,180,255,0.3) 50%, rgba(150,200,255,0.3) 100%)" }}>
          <div className="flex items-center gap-2 text-[14px] text-[#6b7280]">
            {activePage === 'products' && (
              <>
                <Package size={16} />
                <span>Products</span>
              </>
            )}
          </div>
          {activePage === 'products' && (
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Services, Products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-[13px] pl-9 pr-3 py-2 rounded-lg border border-[#e5e7eb] outline-none"
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
              <span className="text-white text-[12px] font-medium">👤</span>
            </div>
            <button onClick={onLogout}>
              <ChevronDown size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activePage === 'home' ? (
            <HomeContent 
              publishedProducts={publishedProducts}
              unpublishedProducts={unpublishedProducts}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              loading={loading}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onTogglePublish={handleTogglePublish}
            />
          ) : (
            <ProductsContent 
              products={filteredProducts}
              loading={loading}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onTogglePublish={handleTogglePublish}
            />
          )}
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}

interface HomeContentProps {
  publishedProducts: Product[];
  unpublishedProducts: Product[];
  activeTab: 'published' | 'unpublished';
  setActiveTab: (tab: 'published' | 'unpublished') => void;
  loading: boolean;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onTogglePublish: (product: Product) => void;
}

function HomeContent({ 
  publishedProducts, 
  unpublishedProducts, 
  activeTab, 
  setActiveTab, 
  loading,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onTogglePublish
}: HomeContentProps) {
  const displayProducts = activeTab === 'published' ? publishedProducts : unpublishedProducts;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-[#e5e7eb]">
        <button
          onClick={() => setActiveTab('published')}
          className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${
            activeTab === 'published'
              ? 'border-[#071074] text-[#071074]'
              : 'border-transparent text-[#6b7280] hover:text-[#071074]'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setActiveTab('unpublished')}
          className={`pb-3 text-[14px] font-medium border-b-2 transition-colors ${
            activeTab === 'unpublished'
              ? 'border-[#071074] text-[#071074]'
              : 'border-transparent text-[#6b7280] hover:text-[#071074]'
          }`}
        >
          Unpublished
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-[#6b7280]">Loading products...</div>
      ) : displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="mb-4">
            <LayoutGrid size={64} className="text-[#071074]" strokeWidth={1.5} />
          </div>
          <h3 className="text-[18px] font-semibold text-[#111652] mb-2">
            No {activeTab === 'published' ? 'Published' : 'Unpublished'} Products
          </h3>
          <p className="text-[14px] text-[#6b7280] text-center max-w-md">
            Your {activeTab === 'published' ? 'Published' : 'Unpublished'} Products will appear here
            <br />
            Create your first product to {activeTab === 'published' ? 'publish' : 'save as draft'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
              onTogglePublish={onTogglePublish}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProductsContentProps {
  products: Product[];
  loading: boolean;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onTogglePublish: (product: Product) => void;
}

function ProductsContent({ 
  products, 
  loading,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onTogglePublish
}: ProductsContentProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-semibold text-[#111652]">Products</h1>
        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 text-[#071074] text-[14px] font-medium hover:underline"
        >
          <Plus size={18} />
          Add Products
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#6b7280]">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="mb-4">
            <LayoutGrid size={64} className="text-[#071074]" strokeWidth={1.5} />
          </div>
          <h3 className="text-[18px] font-semibold text-[#111652] mb-2">No Products Yet</h3>
          <p className="text-[14px] text-[#6b7280] text-center mb-4">
            Start by adding your first product
          </p>
          <button
            onClick={onAddProduct}
            className="bg-[#071074] text-white px-6 py-2.5 rounded-lg hover:bg-[#0a1a9f] transition-colors text-[14px] font-medium"
          >
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
              onTogglePublish={onTogglePublish}
              showFullDetails
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onTogglePublish: (product: Product) => void;
  showFullDetails?: boolean;
}

function ProductCard({ product, onEdit, onDelete, onTogglePublish, showFullDetails }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images || [];

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
      {/* Image Carousel */}
      <div className="aspect-square bg-[#f5f5f5] relative overflow-hidden">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            {/* Image Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#98a2b3]">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[15px] text-[#111652] mb-3">{product.name}</h3>
        
        {showFullDetails && (
          <div className="space-y-1.5 text-[13px] mb-4">
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Product type -</span>
              <span className="text-[#111652]">{product.productType || product.category || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Quantity Stock -</span>
              <span className="text-[#111652]">{product.stockQuantity || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">MRP-</span>
              <span className="text-[#111652]">₹ {product.mrp || product.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Selling Price -</span>
              <span className="text-[#111652]">₹ {product.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Brand Name -</span>
              <span className="text-[#111652]">{product.brandName || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Total Number of Images -</span>
              <span className="text-[#111652]">{images.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Exchange Eligibility -</span>
              <span className="text-[#111652]">{product.exchangeEligible ? 'YES' : 'NO'}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTogglePublish(product)}
            className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              product.isPublished
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-[#071074] text-white hover:bg-[#0a1a9f]'
            }`}
          >
            {product.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={() => onEdit(product)}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#e5e7eb] rounded-lg text-[13px] hover:bg-gray-50 transition-colors"
          >
            Edit
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 border border-[#e5e7eb] rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} className="text-[#6b7280]" />
          </button>
        </div>
      </div>
    </div>
  );
}