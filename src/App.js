// src/App.js
import './App.css';
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

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
import ProductForm from './components/Admin/ProductForm';
import AdminProductsList from './components/Admin/AdminProductsList';
import initialProductData from './components/productData';
import NotFoundPage from './components/NotFoundPage';

function AppContent() {
  // Get theme context here
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [products, setProducts] = useState(() => {
    try {
      const localProducts = localStorage.getItem("mrstepup-products");
      return localProducts ? JSON.parse(localProducts) : initialProductData;
    } catch (error) {
      console.error("Failed to parse products from localStorage:", error);
      return initialProductData;
    }
  });

  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem("mrstepup-cart");
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });

  const [pastOrders, setPastOrders] = useState(() => {
    try {
      const localOrders = localStorage.getItem("mrstepup-past-orders");
      return localOrders ? JSON.parse(localOrders) : [];
    } catch (error) {
      console.error("Failed to parse past orders from localStorage:", error);
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    localStorage.setItem("mrstepup-products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mrstepup-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('mrstepup-past-orders', JSON.stringify(pastOrders));
  }, [pastOrders]);

  // Cart logic unchanged...
  const handleAddToCart = (product, selectedSize, quantity = 1) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.id === product.id && item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const updatedCart = cartItems.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, selectedSize, quantity }]);
    }
  };

  const handleRemoveFromCart = (productId, selectedSize) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === productId && item.selectedSize === selectedSize))
    );
  };

  const handleUpdateQuantity = (productId, selectedSize, newQuantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleAddPastOrder = (orderDetails) => {
    const newOrder = {
      id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toLocaleString(),
      ...orderDetails,
    };
    setPastOrders((prev) => [...prev, newOrder]);
  };

  // Admin logic unchanged...
  const handleProductSubmit = (submittedProduct) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => p.id === submittedProduct.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = submittedProduct;
        return updated;
      } else {
        return [...prev, submittedProduct];
      }
    });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  // Filtering and sorting logic unchanged...
  const getFilteredAndSortedProducts = () => {
    let current = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      current = current.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term) ||
          (product.description && product.description.toLowerCase().includes(term))
      );
    }

    if (selectedBrand !== 'All') {
      current = current.filter((product) => product.brand === selectedBrand);
    }

    if (selectedSize !== 'All') {
      current = current.filter(
        (product) => product.sizes && product.sizes.includes(parseInt(selectedSize))
      );
    }

    switch (sortBy) {
      case 'price-asc':
        current.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        current.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        current.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        current.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return current;
  };

  const productsToDisplay = getFilteredAndSortedProducts();

  const getUniqueBrands = useMemo(() => {
    const brands = new Set(products.map((product) => product.brand));
    return ['All', ...Array.from(brands).sort()];
  }, [products]);

  const getUniqueSizes = useMemo(() => {
    const sizes = new Set();
    products.forEach((product) => {
      product.sizes?.forEach((size) => sizes.add(size));
    });
    return ['All', ...Array.from(sizes).sort((a, b) => parseFloat(a) - parseFloat(b))];
  }, [products]);

  return (
    <>
      <Router>
        <Navbar
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          theme={theme}        
          toggleTheme={toggleTheme}
        />
        <main>
          <Routes>
            <Route
              path="/"
              element={<Home onAddToCart={handleAddToCart} filteredProducts={productsToDisplay} />}
            />
            <Route
              path="/products"
              element={
                <Products
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
                />
              }
            />
            <Route
              path="/product/:id"
              element={<ProductDetails onAddToCart={handleAddToCart} products={products} />}
            />
            <Route path="/brands" element={<Brands onAddToCart={handleAddToCart} productsToDisplay={products} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  onRemoveFromCart={handleRemoveFromCart}
                  onUpdateQuantity={handleUpdateQuantity}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                <Checkout
                  cartItems={cartItems}
                  onClearCart={handleClearCart}
                  onAddPastOrder={handleAddPastOrder}
                />
              }
            />
            <Route path="/order-history" element={<OrderHistory pastOrders={pastOrders} />} />
            <Route
              path="/admin/products"
              element={<AdminProductsList products={products} onDeleteProduct={handleDeleteProduct} />}
            />
            <Route
              path="/admin/add-product"
              element={<ProductForm onSubmit={handleProductSubmit} products={products} />}
            />
            <Route
              path="/admin/edit-product/:id"
              element={<ProductForm onSubmit={handleProductSubmit} products={products} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
