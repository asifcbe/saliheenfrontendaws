import React from 'react';

export default function RefundCancellation() {
  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="page-header">
        <h1>Refund & Cancellation Policy</h1>
        <p>Your satisfaction is our priority</p>
      </div>
      <div className="container">
        <div className="policy-content">
          <h2>Order Cancellation</h2>
          <h3>Cancellation by Customer</h3>
          <p>You may cancel your order within 24 hours of placing it, provided the order has not been dispatched. To cancel:</p>
          <ul>
            <li>Contact us at <a href="mailto:support@saliheenperfumes.com">support@saliheenperfumes.com</a></li>
            <li>Provide your Order ID and reason for cancellation</li>
            <li>Cancellations are not possible once the order has been shipped</li>
          </ul>

          <h3>Cancellation by Saliheen Perfumes</h3>
          <p>We reserve the right to cancel orders in cases of:</p>
          <ul>
            <li>Product unavailability or stock issues</li>
            <li>Suspected fraudulent transactions</li>
            <li>Delivery address issues</li>
            <li>Payment verification failure</li>
          </ul>
          <p>In such cases, you will receive a full refund within 5–7 business days.</p>

          <h2>Return Policy</h2>
          <p>Due to the nature of our products (perfumes and attars), we have a limited return policy:</p>

          <h3>Eligible for Return</h3>
          <ul>
            <li>Damaged or defective products received</li>
            <li>Wrong product delivered</li>
            <li>Tampered or unsealed products</li>
          </ul>

          <h3>Not Eligible for Return</h3>
          <ul>
            <li>Opened or used products (unless defective)</li>
            <li>Products damaged due to misuse or mishandling</li>
            <li>Products returned after 7 days of delivery</li>
            <li>Change of mind or personal preference</li>
          </ul>

          <h2>Refund Process</h2>
          <h3>For Prepaid Orders (Razorpay)</h3>
          <p>Refunds will be credited to the original payment method within 5–7 business days after approval.</p>

          <h3>For COD Orders</h3>
          <p>Refunds for Cash on Delivery orders will be processed via bank transfer. Please provide your bank details when initiating the refund request.</p>

          <h2>How to Initiate a Refund</h2>
          <ol>
            <li>Contact us within 7 days of delivery at <a href="mailto:refund@saliheenperfumes.com">refund@saliheenperfumes.com</a></li>
            <li>Provide your Order ID and photos of the damaged/wrong product</li>
            <li>Our team will review and respond within 2 business days</li>
            <li>Approved returns: we will arrange a pickup at no extra cost</li>
            <li>Refund will be processed upon receiving the returned product</li>
          </ol>

          <h2>Exchange Policy</h2>
          <p>Exchanges are available for damaged or wrong products, subject to stock availability. If the requested item is out of stock, a full refund will be issued.</p>

          <h2>Contact Us</h2>
          <p>For refund or cancellation requests: <a href="mailto:support@saliheenperfumes.com">support@saliheenperfumes.com</a></p>
        </div>
      </div>
    </div>
  );
}
