// src/components/Checkout.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./Checkout.css";

export default function Checkout({ cartItems, onClearCart }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zip: "",
    notes: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) navigate("/cart");
  }, [cartItems, navigate, orderPlaced]);

  const formatPrice = (price) => `R${price.toFixed(2)}`;
  const calculateTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ["name", "phone", "address", "city", "province"];
    const missingField = requiredFields.find((field) => !formData[field]);
    if (missingField) return alert("Please fill in all required fields.");

    const orderItemsSummary = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      price: item.price,
      image: item.image || item.img,
    }));

    setLoading(true);

    // Save order to Firestore under user's document
    if (currentUser) {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        const prevOrders = docSnap.exists() && docSnap.data().pastOrders ? docSnap.data().pastOrders : [];

        const newOrder = {
          id: `order-${Date.now()}`,
          date: new Date().toLocaleString(),
          items: orderItemsSummary,
          total: calculateTotal(),
          customerInfo: formData,
          status: "processing",
          createdAt: serverTimestamp(),
        };

        await setDoc(userRef, { pastOrders: [...prevOrders, newOrder], cart: [] }, { merge: true });
        console.log("Order saved under user document!");
      } catch (err) {
        console.error("Error saving order:", err);
      }
    }

    // WhatsApp message
    const whatsappNumber = "27721234567";
    const whatsappMessage = encodeURIComponent(
      `Hello Mr StepUp Co, I'd like to place an order:\n\n` +
      `*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || "N/A"}\n` +
      `Delivery Address: ${formData.address}, ${formData.city}, ${formData.province}, ${formData.zip || "N/A"}\n\n` +
      `*Order Items:*\n` +
      orderItemsSummary.map(i => `${i.name} (Size: ${i.selectedSize}, Qty: ${i.quantity}) - ${formatPrice(i.price * i.quantity)}`).join("\n") +
      `\n\n*Total:* ${formatPrice(calculateTotal())}\n*Notes:* ${formData.notes || "N/A"}\n\nPlease confirm my order and provide payment details.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank");

    setOrderPlaced(true);
    onClearCart();
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <section className="checkout-section order-confirmation">
        <h2>Order Successfully Placed!</h2>
        <p>Thank you for your order, {formData.name}!</p>
        <p>Your order details have been sent. We will contact you via WhatsApp shortly.</p>
        <div className="order-actions">
          <a href={`https://wa.me/27721234567?text=Hi Mr StepUp Co, I'm following up on my recent order.`}
             target="_blank" rel="noopener noreferrer" className="whatsapp-followup-btn">Open WhatsApp to Confirm</a>
          <Link to="/products" className="continue-shopping-btn">Continue Shopping</Link>
          <Link to="/order-history" className="view-history-btn">View My Orders</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-section">
      <h2>Checkout Details</h2>
      {loading && <p>Placing your order...</p>}

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <p key={`${item.id}-${item.selectedSize}`}>
            {item.name} (Size: {item.selectedSize}, Qty: {item.quantity}) - {formatPrice(item.price * item.quantity)}
          </p>
        ))}
        <p className="total-summary">Total: {formatPrice(calculateTotal())}</p>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Your Information</h3>
        {[
          { label: "Full Name", name: "name", type: "text", required: true },
          { label: "Email Address", name: "email", type: "email" },
          { label: "Phone Number", name: "phone", type: "tel", required: true },
          { label: "Delivery Address", name: "address", type: "text", required: true },
          { label: "City", name: "city", type: "text", required: true },
          { label: "Postal Code", name: "zip", type: "text" },
        ].map(field => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}{field.required && <span className="required">*</span>}</label>
            <input
              type={field.type} id={field.name} name={field.name} value={formData[field.name]}
              onChange={e => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
              required={field.required || false}
            />
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="province">Province <span className="required">*</span></label>
          <select id="province" value={formData.province} onChange={e => setFormData(prev => ({ ...prev, province: e.target.value }))} required>
            <option value="">Select Province</option>
            {["Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo","Mpumalanga","North West","Northern Cape","Western Cape"].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Order Notes / Special Instructions</label>
          <textarea id="notes" rows="4" value={formData.notes} onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}></textarea>
        </div>

        <button type="submit" className="place-order-btn">Place Order & Confirm via WhatsApp</button>
      </form>
    </section>
  );
}
