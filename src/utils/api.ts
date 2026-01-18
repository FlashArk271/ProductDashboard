import { API_BASE_URL } from '/utils/mongodb/config';

const API_BASE = API_BASE_URL;

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  productType?: string;
  stockQuantity?: number;
  mrp?: number;
  brandName?: string;
  exchangeEligible?: boolean;
  isPublished: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

class API {
  private getHeaders(includeAuth = false) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn('No access token found in localStorage for authenticated request');
      }
    }

    return headers;
  }

  // Auth
  async signup(email: string, password: string, name?: string) {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  }

  async signin(email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    return data;
  }

  async sendOTP(email: string) {
    const response = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email }),
    });
    return response.json();
  }

  async verifyOTP(email: string, otp: string) {
    const response = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    return data;
  }

  // Products
  async getProducts(): Promise<{ products: Product[] }> {
    const response = await fetch(`${API_BASE}/products`, {
      headers: this.getHeaders(true),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Error fetching products:', response.status, errorData);
      throw new Error(errorData.error || `Failed to fetch products (${response.status})`);
    }
    return response.json();
  }

  async createProduct(product: Partial<Product>): Promise<{ product: Product }> {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Error creating product:', response.status, errorData);
      throw new Error(errorData.error || `Failed to create product (${response.status})`);
    }
    return response.json();
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ product: Product }> {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update product');
    }
    return response.json();
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete product');
    }
  }

  async uploadImage(file: File): Promise<{ url: string; path: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE}/upload-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }
    return response.json();
  }
}

export const api = new API();