
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: number;
  project_id?: number;
  title: string;
  description: string;
  features: string[];
  specs: string[];
  price: number;
  image: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Mock data for products (until Supabase table is created)
const mockProducts: Product[] = [
  {
    id: 1,
    title: "Arduino Smart Home Kit",
    description: "Complete kit to build a smart home automation system with Arduino",
    features: ["Arduino Uno R3", "ESP8266 WiFi Module", "Relay Module", "Temperature Sensor"],
    specs: ["Voltage: 5V", "Current: 2A", "WiFi: 802.11 b/g/n"],
    price: 89.99,
    image: "/placeholder.svg",
    stock: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Raspberry Pi IoT Starter Kit",
    description: "Everything you need to start your IoT journey with Raspberry Pi",
    features: ["Raspberry Pi 4", "Camera Module", "LED Matrix", "Breadboard"],
    specs: ["RAM: 4GB", "Storage: 32GB MicroSD", "GPIO: 40 pins"],
    price: 129.99,
    image: "/placeholder.svg",
    stock: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('maker-brains-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('maker-brains-cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      // For now, just use mock data
      // TODO: Replace with Supabase call once products table is created
      console.log('Using mock product data - create products table in Supabase to enable database storage');
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // For now, add to mock data
      // TODO: Replace with Supabase call once products table is created
      const newProduct: Product = {
        ...productData,
        id: Date.now(), // Simple ID generation for mock data
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setProducts(prev => [newProduct, ...prev]);
      console.log('Product added to mock data - create products table in Supabase to enable database storage');
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      // For now, update in mock data
      // TODO: Replace with Supabase call once products table is created
      const updatedProduct = { ...product, updated_at: new Date().toISOString() };
      setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p));
      console.log('Product updated in mock data - create products table in Supabase to enable database storage');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      // For now, delete from mock data
      // TODO: Replace with Supabase call once products table is created
      setProducts(prev => prev.filter(p => p.id !== id));
      console.log('Product deleted from mock data - create products table in Supabase to enable database storage');
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartTotal,
      getCartItemCount,
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
