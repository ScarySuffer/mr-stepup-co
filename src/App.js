// src/App.js

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Home component
import Home from './components/Home'; // Make sure this path is correct
// ... other existing imports like Products, ProductDetails, Cart, Navbar, Footer etc.
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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


function App() {
  // ... (all your existing state, useEffects, and handler functions)

  const [products, setProducts] = useState(() => {
    try {
      const localProducts = localStorage.getItem("mrstepup-products");
      return localProducts ? JSON.parse(localProducts) : initialProductData;
    } catch (error) {
      console.error("Failed to parse products from localStorage:", error);
      return initialProductData;
    }
  });


  useEffect(() => {
    localStorage.setItem("mrstepup-products", JSON.stringify(products));
  }, [products]);


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
    localStorage.setItem('mrstepup-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('mrstepup-past-orders', JSON.stringify(pastOrders));
  }, [pastOrders]);


  const handleAddToCart = (product, selectedSize, quantity = 1) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id && item.selectedSize === selectedSize
    );

    if (existingItemIndex > -1) {
      const updatedCartItems = cartItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, selectedSize, quantity }]);
    }
  };

  const handleRemoveFromCart = (productId, selectedSize) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === productId && item.selectedSize === selectedSize)
      )
    );
  };

  const handleUpdateQuantity = (productId, selectedSize, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
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
    setPastOrders((prevOrders) => [...prevOrders, newOrder]);
  };


  const handleProductSubmit = (submittedProduct) => {
    setProducts((prevProducts) => {
      const existingProductIndex = prevProducts.findIndex(
        (p) => p.id === submittedProduct.id
      );

      if (existingProductIndex > -1) {
        const updatedProducts = [...prevProducts];
        updatedProducts[existingProductIndex] = submittedProduct;
        return updatedProducts;
      } else {
        return [...prevProducts, submittedProduct];
      }
    });
  };


  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
    }
  };

  const getFilteredAndSortedProducts = () => {
    let currentProducts = [...products];

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.brand.toLowerCase().includes(lowerCaseSearchTerm) ||
          (product.description && product.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    if (selectedBrand !== 'All') {
      currentProducts = currentProducts.filter((product) => product.brand === selectedBrand);
    }

    if (selectedSize !== 'All') {
      currentProducts = currentProducts.filter(
        (product) => product.sizes && product.sizes.includes(parseInt(selectedSize))
      );
    }

    switch (sortBy) {
      case 'price-asc':
        currentProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        currentProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        currentProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        currentProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return currentProducts;
  };

  const productsToDisplay = getFilteredAndSortedProducts();

  const getUniqueBrands = useMemo(() => {
    const brands = new Set(products.map(product => product.brand));
    return ['All', ...Array.from(brands).sort()];
  }, [products]);

  const getUniqueSizes = useMemo(() => {
    const sizes = new Set();
    products.forEach(product => {
      if (product.sizes) {
        product.sizes.forEach(size => sizes.add(size));
      }
    });
    return ['All', ...Array.from(sizes).sort((a, b) => parseFloat(a) - parseFloat(b))];
  }, [products]);


  return (
    <Router>
      <Navbar
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main>
        <Routes>
          {/* Changed this line to render Home */}
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
          <Route
            path="/brands"
            element={<Brands onAddToCart={handleAddToCart} productsToDisplay={products} />}
          />
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
          <Route
            path="/order-history"
            element={<OrderHistory pastOrders={pastOrders} />}
          />
          <Route
            path="/admin/products"
            element={
              <AdminProductsList
                products={products}
                onDeleteProduct={handleDeleteProduct}
              />
            }
          />
          <Route
            path="/admin/add-product"
            element={<ProductForm onSubmit={handleProductSubmit} products={products} />}
          />
          <Route
            path="/admin/edit-product/:id"
            element={<ProductForm onSubmit={handleProductSubmit} products={products} />}
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;