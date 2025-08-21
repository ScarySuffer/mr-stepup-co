// src/App.js

import './App.css';
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Auth from './components/Auth';
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

import ScrollToTopButton from './components/ScrollToTopButton';

// ⛔️ REMOVE THIS LINE: We will fetch products from Firestore now
// import initialProductData from './components/productData';

// ✅ IMPORT new Firestore functions
import { db } from './firebase/firebaseConfig';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";

import RequireAuth from './components/RequireAuth';

function AppContent() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);

  // ✅ CHANGE: Use an empty array as initial state. Products will be fetched from Firestore.
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ✅ NEW: Fetch products from Firestore when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollectionRef = collection(db, "products");
        const productSnapshot = await getDocs(productsCollectionRef);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
        setLoadingProducts(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Existing useEffect for cart and orders (no change)
  useEffect(() => {
    if (!currentUser) {
      setCartItems([]);
      setPastOrders([]);
      return;
    }
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

  // Existing useEffect to save cart and orders (no change)
  useEffect(() => {
    if (!currentUser) {
      return;
    }
    const saveData = async () => {
      try {
        await setDoc(doc(db, "carts", currentUser.uid), { items: cartItems });
        await setDoc(doc(db, "orders", currentUser.uid), { orders: pastOrders });
      } catch (error) {
        console.error("Error saving data to Firestore:", error);
      }
    };
    const timeoutId = setTimeout(() => {
      saveData();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [cartItems, pastOrders, currentUser]);

  // Existing functions (no change)
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
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.selectedSize === selectedSize)));
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
      id: `order-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      date: new Date().toLocaleString(),
      ...orderDetails,
    };
    setPastOrders(prev => [...prev, newOrder]);
  };
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
  
  // ✅ UPDATED: Function to add or update products in Firestore and local state
  const handleProductSubmit = async (submittedProduct) => {
    try {
      if (submittedProduct.id) {
        // Update an existing product
        const docRef = doc(db, "products", submittedProduct.id);
        await setDoc(docRef, submittedProduct);
        
        // Update local state
        setProducts(prev => prev.map(p => p.id === submittedProduct.id ? submittedProduct : p));
        console.log("Product updated:", submittedProduct.id);
      } else {
        // Add a new product
        const productsCollectionRef = collection(db, "products");
        const docRef = await addDoc(productsCollectionRef, submittedProduct);

        // Update local state with the new product, including its Firestore-generated ID
        const newProductWithId = { ...submittedProduct, id: docRef.id };
        setProducts(prev => [...prev, newProductWithId]);
        console.log("New product added with ID:", docRef.id);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      throw error; // Re-throw the error so ProductForm can handle it
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // 1. Delete from Firestore
      const docRef = doc(db, "products", productId);
      await deleteDoc(docRef);

      // 2. Update local state
      setProducts(prev => prev.filter(p => p.id !== productId));
      console.log(`Product with ID ${productId} deleted from Firestore and local state.`);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
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

  // ✅ NEW: Loading state for products
  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
          <Route path="/products/:id" element={<ProductDetails onAddToCart={handleAddToCart} products={products} />} />
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
              <RequireAuth>
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
              <RequireAuth>
                <OrderHistory pastOrders={pastOrders} />
              </RequireAuth>
            }
          />

          <Route path="/admin" element={<RequireAuth isAdminOnly={true} />}>
            <Route index element={<AdminProductsList products={products} onDeleteProduct={handleDeleteProduct} />} />
            <Route path="products" element={<AdminProductsList products={products} onDeleteProduct={handleDeleteProduct} />} />
            <Route path="add-product" element={<ProductForm onSubmit={handleProductSubmit} products={products} />} />
            <Route path="edit-product/:id" element={<ProductForm onSubmit={handleProductSubmit} products={products} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}

function AppInner() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  return <AppInner />;
}

export default App;