// src/App.js
import './App.css';
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Routes, Route } from 'react-router-dom'; // REMOVED: Navigate

import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Auth from "./components/Auth";
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
import NotFoundPage from './components/NotFoundPage';

import initialProductData from './components/productData';

import { db } from './firebase/firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";
import RequireAuth from './components/RequireAuth';

function AppContent() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);

  // Products state with localStorage fallback
  const [products, setProducts] = useState(() => {
    try {
      const localProducts = localStorage.getItem("mrstepup-products");
      return localProducts ? JSON.parse(localProducts) : initialProductData;
    } catch (error) {
      console.error("Failed to parse products from localStorage:", error);
      return initialProductData;
    }
  });

  // Cart state with localStorage fallback
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem("mrstepup-cart");
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage:", error);
      return [];
    }
  });

  // Past orders state with localStorage fallback
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

  // Sync products to localStorage on products change
  useEffect(() => {
    localStorage.setItem("mrstepup-products", JSON.stringify(products));
  }, [products]);

  // Load cart and past orders from Firestore when user logs in
  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        const cartRef = doc(db, "carts", currentUser.uid);
        const cartSnap = await getDoc(cartRef);
        setCartItems(cartSnap.exists() ? cartSnap.data().items || [] : []);

        const ordersRef = doc(db, "orders", currentUser.uid);
        const ordersSnap = await getDoc(ordersRef);
        setPastOrders(ordersSnap.exists() ? ordersSnap.data().orders || [] : []);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, [currentUser]);

  // Save cart and past orders to Firestore and localStorage on change
  useEffect(() => {
    if (!currentUser) {
      // Save only locally if not logged in
      localStorage.setItem("mrstepup-cart", JSON.stringify(cartItems));
      localStorage.setItem("mrstepup-past-orders", JSON.stringify(pastOrders));
      return;
    }

    const saveData = async () => {
      try {
        await setDoc(doc(db, "carts", currentUser.uid), { items: cartItems });
        await setDoc(doc(db, "orders", currentUser.uid), { orders: pastOrders });

        localStorage.setItem("mrstepup-cart", JSON.stringify(cartItems));
        localStorage.setItem("mrstepup-past-orders", JSON.stringify(pastOrders));
      } catch (error) {
        console.error("Error saving data to Firestore:", error);
      }
    };

    saveData();
  }, [cartItems, pastOrders, currentUser]);

  // Clear past orders on logout but keep cartItems intact for guests
  useEffect(() => {
    if (!currentUser) {
      setPastOrders([]); // clear orders only
      // DO NOT clear cartItems so localStorage cart persists for guests
    }
  }, [currentUser]);

  // Cart handlers
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
    setCartItems(prev =>
      prev.filter(item => !(item.id === productId && item.selectedSize === selectedSize))
    );
  };

  const handleUpdateQuantity = (productId, selectedSize, newQuantity) => {
    setCartItems(prev =>
      prev.map(item =>
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
      id: `order-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,
      date: new Date().toLocaleString(),
      ...orderDetails,
    };
    setPastOrders(prev => [...prev, newOrder]);
  };

  // Admin handlers
  const handleProductSubmit = (submittedProduct) => {
    setProducts(prev => {
      const index = prev.findIndex(p => p.id === submittedProduct.id);
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
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  // Filtering and sorting
  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
    }

    if (selectedBrand !== 'All') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    if (selectedSize !== 'All') {
      filtered = filtered.filter(product =>
        product.sizes && product.sizes.includes(parseInt(selectedSize))
      );
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  };

  const productsToDisplay = getFilteredAndSortedProducts();

  const getUniqueBrands = useMemo(() => {
    const brandsSet = new Set(products.map(p => p.brand));
    return ['All', ...Array.from(brandsSet).sort()];
  }, [products]);

  const getUniqueSizes = useMemo(() => {
    const sizesSet = new Set();
    products.forEach(p => {
      p.sizes?.forEach(size => sizesSet.add(size));
    });
    return ['All', ...Array.from(sizesSet).sort((a, b) => parseFloat(a) - parseFloat(b))];
  }, [products]);

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
          <Route
            path="/coming-soon"
            element={
              <section className="flex-grow flex flex-col justify-center items-center">
                <ComingSoon />
              </section>
            }
          />
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
                <RequireAuth user={currentUser}>
                  <Checkout
                    cartItems={cartItems}
                    onClearCart={handleClearCart}
                    onAddPastOrder={handleAddPastOrder}
                  />
                </RequireAuth>
              }
            />

            <Route
              path="/order-history"
              element={
                <RequireAuth user={currentUser}>
                  <OrderHistory pastOrders={pastOrders} />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/products"
              element={
                <RequireAuth user={currentUser}>
                  <AdminProductsList products={products} onDeleteProduct={handleDeleteProduct} />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/add-product"
              element={
                <RequireAuth user={currentUser}>
                  <ProductForm onSubmit={handleProductSubmit} products={products} />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/edit-product/:id"
              element={
                <RequireAuth user={currentUser}>
                  <ProductForm onSubmit={handleProductSubmit} products={products} />
                </RequireAuth>
              }
            />

          {/* Auth routes */}
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function AppInner() {
  return <AppContent />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
