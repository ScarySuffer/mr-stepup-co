// src/components/Checkout.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Checkout.css";

// Receive onAddPastOrder as a prop
export default function Checkout({ cartItems, onClearCart, onAddPastOrder }) {
  const navigate = useNavigate();

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

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [cartItems, navigate, orderPlaced]);


  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.province) {
      alert("Please fill in all required fields (Name, Phone, Address, City, Province).");
      return;
    }

    const total = calculateTotal();
    const orderItemsSummary = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      price: item.price,
      image: item.image || item.img, // Include image for history display
    }));

    // NEW: Prepare order details to save
    const orderDetailsToSave = {
      customerInfo: formData,
      items: orderItemsSummary,
      total: total,
    };

    // Call the function to add this order to past orders
    onAddPastOrder(orderDetailsToSave);

    // Now proceed with WhatsApp message and clearing cart
    const whatsappNumber = "27721234567"; // REMEMBER TO REPLACE THIS WITH YOUR REAL NUMBER
    const whatsappMessage = `Hello Mr StepUp Co, I'd like to place an order:%0A%0A` +
                            `*Customer Details:*%0A` +
                            `Name: ${formData.name}%0A` +
                            `Phone: ${formData.phone}%0A` +
                            `Email: ${formData.email || 'N/A'}%0A` +
                            `Delivery Address: ${formData.address}, ${formData.city}, ${formData.province}, ${formData.zip || 'N/A'}%0A%0A` +
                            `*Order Items:*%0A` +
                            `${orderItemsSummary.map(item => `${item.name} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - R${(item.price * item.quantity).toFixed(2)}`).join("\n")}%0A%0A` +
                            `*Total:* R${total.toFixed(2)}%0A%0A` +
                            `*Notes:* ${formData.notes || 'N/A'}%0A%0A` +
                            `Please confirm my order and provide payment details.`;

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    setOrderPlaced(true);
    onClearCart(); // Clear the cart after order is "placed"

    window.open(whatsappLink, '_blank');
  };

  if (orderPlaced) {
    return (
      <section className="checkout-section order-confirmation">
        <h2>Order Successfully Placed!</h2>
        <p>Thank you for your order, {formData.name}!</p>
        <p>Your order details have been sent to our team. We will contact you shortly via WhatsApp to confirm and arrange payment/delivery.</p>
        <div className="order-actions">
          <a href={`https://wa.me/${"27721234567"}?text=Hi%20Mr%20StepUp%20Co,%20I'm%20just%20following%20up%20on%20my%20recent%20order.`} target="_blank" rel="noopener noreferrer" className="whatsapp-followup-btn">
            Open WhatsApp to Confirm
          </a>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          <Link to="/order-history" className="view-history-btn"> {/* NEW BUTTON */}
            View My Orders
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-section">
      <h2>Checkout Details</h2>
      <div className="checkout-summary">
        <h3>Order Summary</h3>
        {cartItems.map((item) => (
          <p key={`${item.id}-${item.selectedSize}`}>
            {item.name} (Size: {item.selectedSize}, Qty: {item.quantity}) - R{(item.price * item.quantity).toFixed(2)}
          </p>
        ))}
        <p className="total-summary">Total: R{calculateTotal().toFixed(2)}</p>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Your Information</h3>
        <div className="form-group">
          <label htmlFor="name">Full Name <span className="required">*</span></label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number <span className="required">*</span></label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Delivery Address <span className="required">*</span></label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="city">City <span className="required">*</span></label>
          <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div className="form-group">
            <label htmlFor="province">Province <span className="required">*</span></label>
            <select id="province" name="province" value={formData.province} onChange={handleChange} required>
                <option value="">Select Province</option>
                <option value="Eastern Cape">Eastern Cape</option>
                <option value="Free State">Free State</option>
                <option value="Gauteng">Gauteng</option>
                <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                <option value="Limpopo">Limpopo</option>
                <option value="Mpumalanga">Mpumalanga</option>
                <option value="North West">North West</option>
                <option value="Northern Cape">Northern Cape</option>
                <option value="Western Cape">Western Cape</option>
            </select>
        </div>
        <div className="form-group">
          <label htmlFor="zip">Postal Code</label>
          <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Order Notes / Special Instructions</label>
          <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="4"></textarea>
        </div>

        <button type="submit" className="place-order-btn">
          Place Order & Confirm via WhatsApp
        </button>
      </form>
    </section>
  );
}