// src/components/OrderHistory.js
import React from "react";
import { Link } from "react-router-dom";
import "./OrderHistory.css"; // We'll create this next

export default function OrderHistory({ pastOrders }) {
  return (
    <section className="order-history-section">
      <h2>Your Order History</h2>

      {pastOrders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="start-shopping-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {[...pastOrders].reverse().map((order) => ( // Reverse to show newest first
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3>Order ID: #{order.id.substring(order.id.lastIndexOf('-') + 1).toUpperCase()}</h3>
                <p>Date: {order.date}</p>
                <p>Total: R{order.total.toFixed(2)}</p>
              </div>
              <div className="customer-info">
                <h4>Customer Details:</h4>
                <p><strong>Name:</strong> {order.customerInfo.name}</p>
                <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                {order.customerInfo.email && <p><strong>Email:</strong> {order.customerInfo.email}</p>}
                <p><strong>Address:</strong> {order.customerInfo.address}, {order.customerInfo.city}, {order.customerInfo.province}, {order.customerInfo.zip}</p>
                {order.customerInfo.notes && <p><strong>Notes:</strong> {order.customerInfo.notes}</p>}
              </div>
              <div className="order-items">
                <h4>Items Ordered:</h4>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="order-item-detail">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="item-text">
                      <p><strong>{item.name}</strong> (Size: {item.selectedSize})</p>
                      <p>Qty: {item.quantity} | R{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}