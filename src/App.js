// src/App.js
import './App.css';
import React, { useState, useMemo, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';

import { ThemeProvider, useTheme } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Products from './components/Products';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Brands from './components/Brands';
import Contact from './components/Contact';
import ComingSoon from './components/ComingSoon';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import NotFoundPage from './components/NotFoundPage';
import ScrollToTopButton from './components/ScrollToTopButton';

// Import products from separate data file
import products from './components/productData';

function AppContent() {
  const { theme, toggleTheme } = useTheme();

  const [cartItems, setCartItems] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Cart handlers
  const handleAddToCart = useCallback((product, selectedSize, quantity = 1) => {
    const newItem = { ...product, selectedSize, quantity };

    const existingIndex = cartItems.findIndex(
      item => item.id === newItem.id && item.selectedSize === newItem.selectedSize
    );

    let updatedCart;
    if (existingIndex > -1) {
      updatedCart = cartItems.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item
      );
    } else {
      updatedCart = [...cartItems, newItem];
    }

    setCartItems(updatedCart);
  }, [cartItems]);

  const handleRemoveFromCart = useCallback((productId, selectedSize) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedSize === selectedSize)));
  }, []);

  const handleUpdateQuantity = useCallback((productId, selectedSize, newQuantity) => {
    setCartItems(prev => prev.map(item =>
      item.id === productId && item.selectedSize === selectedSize
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    ));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const handleAddPastOrder = useCallback((orderDetails) => {
    const newOrder = {
      ...orderDetails,
      date: new Date().toLocaleString(),
      status: 'processing',
    };
    setPastOrders(prev => [...prev, newOrder]);
    setCartItems([]);
  }, []);

  // Filtering & sorting
  const productsToDisplay = useMemo(() => {
    let filteredProducts = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }
    if (selectedBrand !== 'All') filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
    if (selectedSize !== 'All') filteredProducts = filteredProducts.filter(p => p.sizes?.includes(parseInt(selectedSize)));

    filteredProducts = filteredProducts.filter(p => p.hidden === false);

    switch (sortBy) {
      case 'price-asc': filteredProducts.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filteredProducts.sort((a, b) => b.price - a.price); break;
      case 'name-asc': filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': filteredProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: break;
    }

    return filteredProducts;
  }, [searchTerm, selectedBrand, selectedSize, sortBy]);

  const getUniqueBrands = useMemo(() => {
    const brandsSet = new Set(products.map(p => p.brand));
    return ['All', ...Array.from(brandsSet).sort()];
  }, []);

  const getUniqueSizes = useMemo(() => {
    const sizesSet = new Set();
    products.forEach(p => p.sizes?.forEach(size => sizesSet.add(size)));
    return ['All', ...Array.from(sizesSet).sort((a, b) => parseFloat(a) - parseFloat(b))];
  }, []);

  return (
    <>
      <Navbar
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="flex-grow flex flex-col min-h-screen pt-20">
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} filteredProducts={productsToDisplay} />} />
          <Route path="/products" element={<Products
            onAddToCart={handleAddToCart}
            productsToDisplay={productsToDisplay}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            sortBy={sortBy}
            setSortBy={setSortBy}
            uniqueBrands={getUniqueBrands}
            uniqueSizes={getUniqueSizes}
          />} />
          <Route path="/products/:id" element={<ProductDetails onAddToCart={handleAddToCart} products={products} />} />
          <Route path="/brands" element={<Brands onAddToCart={handleAddToCart} productsToDisplay={products} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/cart" element={<Cart
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
          />} />
          <Route path="/checkout" element={<Checkout
            cartItems={cartItems}
            onClearCart={handleClearCart}
            onAddPastOrder={handleAddPastOrder}
          />} />
          <Route path="/order-history" element={<OrderHistory pastOrders={pastOrders} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
