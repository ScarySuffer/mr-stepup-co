// src/components/Checkout.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Checkout.css";

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

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [cartItems, navigate, orderPlaced]);

  const formatPrice = (price) => `R${price.toFixed(2)}`;

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ["name", "phone", "address", "city", "province"];
    const missingField = requiredFields.find((field) => !formData[field]);
    if (missingField) {
      alert(
        "Please fill in all required fields (Name, Phone, Address, City, Province)."
      );
      return;
    }

    const total = calculateTotal();
    const orderItemsSummary = cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      price: item.price,
      image: item.image || item.img,
    }));

    // Save to past orders in Firestore via App.js handler
    onAddPastOrder({
      customerInfo: formData,
      items: orderItemsSummary,
      total: total,
    });

    // WhatsApp message
    const whatsappNumber = "27721234567"; // Replace with your number
    const whatsappMessage = encodeURIComponent(
      `Hello Mr StepUp Co, I'd like to place an order:\n\n` +
        `*Customer Details:*\n` +
        `Name: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `Email: ${formData.email || "N/A"}\n` +
        `Delivery Address: ${formData.address}, ${formData.city}, ${formData.province}, ${formData.zip || "N/A"}\n\n` +
        `*Order Items:*\n` +
        orderItemsSummary
          .map(
            (item) =>
              `${item.name} (Size: ${item.selectedSize}, Qty: ${item.quantity}) - ${formatPrice(
                item.price * item.quantity
              )}`
          )
          .join("\n") +
        `\n\n*Total:* ${formatPrice(total)}\n\n` +
        `*Notes:* ${formData.notes || "N/A"}\n\n` +
        `Please confirm my order and provide payment details.`
    );
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    setOrderPlaced(true);
    onClearCart(); // Clear cart in Firestore
    window.open(whatsappLink, "_blank");
  };

  if (orderPlaced) {
    return (
      <section className="checkout-section order-confirmation">
        <h2>Order Successfully Placed!</h2>
        <p>Thank you for your order, {formData.name}!</p>
        <p>
          Your order details have been sent to our team. We will contact you
          shortly via WhatsApp to confirm and arrange payment/delivery.
        </p>
        <div className="order-actions">
          <a
            href={`https://wa.me/27721234567?text=Hi Mr StepUp Co, I'm following up on my recent order.`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-followup-btn"
          >
            Open WhatsApp to Confirm
          </a>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          <Link to="/order-history" className="view-history-btn">
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
            {item.name} (Size: {item.selectedSize}, Qty: {item.quantity}) -{" "}
            {formatPrice(item.price * item.quantity)}
          </p>
        ))}
        <p className="total-summary">Total: {formatPrice(calculateTotal())}</p>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <h3>Your Information</h3>
        <div className="form-group">
          <label htmlFor="name">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">
            Phone Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">
            Delivery Address <span className="required">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">
            City <span className="required">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="province">
            Province <span className="required">*</span>
          </label>
          <select
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          >
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
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Order Notes / Special Instructions</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className="place-order-btn">
          Place Order & Confirm via WhatsApp
        </button>
      </form>
    </section>
  );
}
