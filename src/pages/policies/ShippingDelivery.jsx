import React from 'react';

export default function ShippingDelivery() {
  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="page-header">
        <h1>Shipping &amp; Delivery</h1>
        <p>Fast and reliable shipping to your doorstep</p>
      </div>
      <div className="container">
        <div className="policy-content">
          <h2>Fast and Reliable Shipping</h2>
          <p>We offer fast and reliable shipping services with delivery typically taking <strong>3-7 days</strong> from the time of order. Delivery times may vary depending on your location.</p>

          <h2>Payment Options</h2>
          <h3>Online Payment</h3>
          <p>Enjoy <strong>free shipping</strong> on all orders paid online.</p>

          <h3>Cash on Delivery (COD)</h3>
          <p>An additional <strong>₹100</strong> will be charged as a shipping fee for COD orders.</p>

          <h2>Important Notes</h2>
          <ul>
            <li>For online payments, we accept major credit/debit cards, UPI, and net banking.</li>
            <li>For Cash on Delivery, please ensure you have the exact amount ready when the delivery arrives.</li>
            <li>Delivery typically takes <strong>3-7 days</strong> from the time of order, but may vary depending on your location and availability of the product.</li>
          </ul>

          <h2>Need Help?</h2>
          <p>For any issues related to shipping or delivery, please contact our support team at <a href="mailto:saliheenperfumes@gmail.com">saliheenperfumes@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
}
