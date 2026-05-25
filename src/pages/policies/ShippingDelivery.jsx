import React from 'react';

export default function ShippingDelivery() {
  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="page-header">
        <h1>Shipping & Delivery</h1>
        <p>We deliver the essence of luxury to your doorstep</p>
      </div>
      <div className="container">
        <div className="policy-content">
          <h2>Delivery Areas</h2>
          <p>We currently deliver across India. International shipping is available for select countries. Please contact us for international delivery inquiries.</p>

          <h2>Shipping Timelines</h2>
          <h3>Standard Delivery</h3>
          <ul>
            <li><strong>Metro Cities:</strong> 3–5 business days</li>
            <li><strong>Tier 2 & 3 Cities:</strong> 5–7 business days</li>
            <li><strong>Remote Areas:</strong> 7–10 business days</li>
          </ul>

          <h3>Express Delivery</h3>
          <p>Express delivery (1–2 business days) is available for select metro cities. Additional charges apply.</p>

          <h2>Shipping Charges</h2>
          <ul>
            <li><strong>Orders above ₹999:</strong> FREE shipping</li>
            <li><strong>Orders below ₹999:</strong> ₹60 flat shipping charge</li>
            <li><strong>Cash on Delivery:</strong> Additional ₹40 COD handling fee</li>
          </ul>

          <h2>Order Processing</h2>
          <p>Orders are typically processed within 1–2 business days after payment confirmation. You will receive an email with tracking details once your order is dispatched.</p>

          <h2>Packaging</h2>
          <p>All products are carefully packaged to ensure they arrive in perfect condition. Our packaging is designed to protect the delicate fragrance bottles during transit. We use eco-friendly materials wherever possible.</p>

          <h2>Order Tracking</h2>
          <p>Once your order is dispatched, you will receive:</p>
          <ul>
            <li>An SMS with tracking information</li>
            <li>An email with your tracking number and courier details</li>
            <li>You can track your order using your Order ID on our website</li>
          </ul>

          <h2>Failed Deliveries</h2>
          <p>If a delivery attempt fails:</p>
          <ul>
            <li>The courier will attempt delivery up to 3 times</li>
            <li>After 3 failed attempts, the order will be returned to us</li>
            <li>We will contact you to reschedule delivery or issue a refund</li>
          </ul>

          <h2>Damaged in Transit</h2>
          <p>If your order arrives damaged, please take photographs and contact us within 48 hours of delivery. We will arrange a replacement or refund as per our Refund Policy.</p>

          <h2>Holiday Periods</h2>
          <p>Delivery timelines may be extended during festivals and peak shopping seasons. We will communicate any delays proactively.</p>

          <h2>Contact Us</h2>
          <p>For shipping inquiries, contact us at <a href="mailto:shipping@saliheenperfumes.com">shipping@saliheenperfumes.com</a></p>
        </div>
      </div>
    </div>
  );
}
