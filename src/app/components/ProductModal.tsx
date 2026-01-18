import { useState, useRef } from 'react';
import { Product, api } from '@/utils/api';
import { X, Upload, Trash2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}

const PRODUCT_TYPES = ['Foods', 'Electronics', 'Clothes', 'Beauty Products', 'Others'];
const EXCHANGE_OPTIONS = ['Yes', 'No'];

export default function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    productType: product?.productType || product?.category || '',
    stockQuantity: product?.stockQuantity?.toString() || '',
    mrp: product?.mrp?.toString() || product?.price?.toString() || '',
    price: product?.price?.toString() || '',
    brandName: product?.brandName || '',
    description: product?.description || '',
    exchangeEligible: product?.exchangeEligible ?? true,
    isPublished: product?.isPublished || false,
  });

  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [productTypeOpen, setProductTypeOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max size is 5MB`);
          continue;
        }

        const { url } = await api.uploadImage(file);
        newImages.push(url);
      }

      setImages([...images, ...newImages]);
      if (newImages.length > 0) {
        toast.success(`${newImages.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid selling price');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: formData.name,
        productType: formData.productType,
        category: formData.productType,
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity) : 0,
        mrp: formData.mrp ? parseFloat(formData.mrp) : parseFloat(formData.price),
        price: parseFloat(formData.price),
        brandName: formData.brandName,
        description: formData.description,
        exchangeEligible: formData.exchangeEligible,
        isPublished: formData.isPublished,
        images,
      });
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
          <h2 className="font-semibold text-[18px] text-[#111652]">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-[14px] font-medium text-[#111652] mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#071074] text-[14px]"
              />
            </div>

            {/* Product Type Dropdown */}
            <div>
              <label className="block text-[14px] font-medium text-[#111652] mb-2">
                Product Type
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProductTypeOpen(!productTypeOpen)}
                  className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-left text-[14px] flex items-center justify-between bg-white"
                >
                  <span className={formData.productType ? 'text-[#111652]' : 'text-gray-400'}>
                    {formData.productType || 'Select product type'}
                  </span>
                  <ChevronDown size={18} className="text-gray-400" />
                </button>
                {productTypeOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg z-10">
                    {PRODUCT_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, productType: type }));
                          setProductTypeOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-[14px] hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          formData.productType === type ? 'bg-gray-100' : ''
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Stock */}
            <div>
              <label className="block text-[14px] font-medium text-[#111652] mb-2">
                Quantity Stock
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                placeholder="Total numbers of Stock available"
                min="0"
                className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#071074] text-[14px]"
              />
            </div>

            {/* MRP */}
            <div>
              <label className="block text-[14px] font-medium text-[#111652] mb-2">
                MRP
              </label>
              <input
                type="number"
                name="mrp"
                value={formData.mrp}
                onChange={handleInputChange}
                placeholder="Total numbers of Stock available"
                min="0"
                step="0.01"
                className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#071074] text-[14px]"
              />
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-[14px] font-medium text-[#111652] mb-2">
                Selling Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Total numbers of Stock available"
                min="0"
                step="0.01"
                className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#071074] text-[14px]"
              />
            </div>

            {/* Brand Name */}
            <div>
              <label className="block text-[14px] font-medium text-[#111652] mb-2">
                Brand Name
              </label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleInputChange}
                placeholder="Total numbers of Stock available"
                className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg outline-none focus:border-[#071074] text-[14px]"
              />
            </div>

            {/* Upload Product Images */}
            <div>
              <label className="block text-[14px] font-medium text-[#111652] mb-2">
                Upload Product Images
              </label>
              
              {/* Uploaded Images Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {images.map((imageUrl, index) => (
                    <div key={index} className="aspect-square relative group rounded-lg overflow-hidden border border-[#e5e7eb]">
                      <img
                        src={imageUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Area */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-[#e5e7eb] rounded-lg py-6 flex flex-col items-center justify-center hover:border-[#071074] hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <p className="text-[14px] text-gray-400 mb-1">
                  {uploading ? 'Uploading...' : 'Enter Description'}
                </p>
                <p className="text-[14px] text-[#071074] font-medium">Browse</p>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Exchange or Return Eligibility Dropdown */}
            <div>
              <label className="block text-[14px] font-medium text-[#111652] mb-2">
                Exchange or return eligibility
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExchangeOpen(!exchangeOpen)}
                  className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-left text-[14px] flex items-center justify-between bg-white"
                >
                  <span className="text-[#111652]">
                    {formData.exchangeEligible ? 'Yes' : 'No'}
                  </span>
                  <ChevronDown size={18} className="text-gray-400" />
                </button>
                {exchangeOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg z-10">
                    {EXCHANGE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, exchangeEligible: option === 'Yes' }));
                          setExchangeOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-[14px] hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          (formData.exchangeEligible ? 'Yes' : 'No') === option ? 'bg-gray-100' : ''
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e5e7eb]">
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="w-full bg-[#071074] text-white py-3 rounded-lg hover:bg-[#0a1a9f] transition-colors font-medium text-[14px] disabled:opacity-50"
          >
            {saving ? 'Saving...' : product ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
