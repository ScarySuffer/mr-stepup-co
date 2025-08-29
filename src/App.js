import './App.css';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

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
import Auth from './components/Auth';
import PrivateRouteWithModal from './components/PrivateRouteWithModal';
import products from './components/productData';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Admin page
import AdminProducts from './components/Admin/AdminProducts';

function AppContent() {
  const { currentUser, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Sync cart to Firestore / localStorage
  const syncCart = useCallback(
    async (updatedCart) => {
      if (!currentUser) {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        console.log('[Cart] Guest cart saved to localStorage:', updatedCart);
        return;
      }

      const userRef = doc(db, 'users', currentUser.uid);
      try {
        await setDoc(userRef, { cart: updatedCart }, { merge: true });
        console.log(`[Cart] Cart synced to Firestore for user ${currentUser.uid}:`, updatedCart);
      } catch (err) {
        console.error('[Cart] Error saving cart to Firestore:', err);
      }
    },
    [currentUser]
  );

  // Load cart on mount or when user changes
  useEffect(() => {
    const loadCart = async () => {
      let localCart = JSON.parse(localStorage.getItem('cart')) || [];
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const docSnap = await getDoc(userRef);
          let firestoreCart = [];
          if (docSnap.exists()) {
            firestoreCart = docSnap.data().cart || [];
          } else {
            await setDoc(userRef, { cart: [], pastOrders: [] });
          }

          // Merge local cart with Firestore cart
          const mergedCart = [...firestoreCart];
          localCart.forEach(localItem => {
            if (!firestoreCart.some(f => f.id === localItem.id && f.selectedSize === localItem.selectedSize)) {
              mergedCart.push(localItem);
            }
          });

          setCartItems(mergedCart);
          syncCart(mergedCart);
        } catch (err) {
          console.error('[Cart] Error loading cart:', err);
          setCartItems(localCart);
        }
      } else {
        setCartItems(localCart);
      }
    };

    if (!authLoading) loadCart();
  }, [currentUser, authLoading, syncCart]);

  // Add to cart handler
  const handleAddToCart = useCallback((product, selectedSize, quantity = 1) => {
    setCartItems(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.id === product.id && item.selectedSize === selectedSize
      );

      const updatedCart = existingIndex > -1
        ? prevCart.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...prevCart, { ...product, selectedSize, quantity }];

      syncCart(updatedCart); // Firestore/localStorage sync
      return updatedCart;
    });
  }, [syncCart]);

  const handleUpdateQuantity = useCallback((productId, selectedSize, newQuantity) => {
    const updatedCart = cartItems.map(item =>
      item.id === productId && item.selectedSize === selectedSize
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    );
    setCartItems(updatedCart);
    syncCart(updatedCart);
  }, [cartItems, syncCart]);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
    syncCart([]);
  }, [syncCart]);

  // Filtering & sorting
  const productsToDisplay = useMemo(() => {
    let filtered = [...products];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }
    if (selectedBrand !== 'All') filtered = filtered.filter(p => p.brand === selectedBrand);
    if (selectedSize !== 'All') filtered = filtered.filter(p => p.sizes?.includes(parseInt(selectedSize)));
    filtered = filtered.filter(p => !p.hidden);

    switch (sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: break;
    }
    return filtered;
  }, [searchTerm, selectedBrand, selectedSize, sortBy]);

  const uniqueBrands = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.brand)))], []);
  const uniqueSizes = useMemo(() => {
    const sizesSet = new Set();
    products.forEach(p => p.sizes?.forEach(s => sizesSet.add(s)));
    return ['All', ...Array.from(sizesSet).sort((a, b) => a - b)];
  }, []);

  return (
    <>
      <Navbar
        cartItemCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="flex-grow flex flex-col min-h-screen pt-20">
        <Routes>
          <Route path="/auth" element={<Auth />} />
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
            uniqueBrands={uniqueBrands}
            uniqueSizes={uniqueSizes}
          />} />
          <Route path="/products/:id" element={<ProductDetails onAddToCart={handleAddToCart} products={products} />} />
          <Route path="/brands" element={<Brands onAddToCart={handleAddToCart} productsToDisplay={products} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} onUpdateQuantity={handleUpdateQuantity} />} />
          <Route path="/checkout" element={
            <PrivateRouteWithModal>
              <Checkout cartItems={cartItems} onClearCart={handleClearCart} />
            </PrivateRouteWithModal>
          } />
          <Route path="/order-history" element={
            <PrivateRouteWithModal>
              <OrderHistory />
            </PrivateRouteWithModal>
          } />

          {/* Admin products management */}
          <Route path="/admin/products" element={<AdminProducts />} />

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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
