import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsConditions() {
  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="page-header">
        <h1>Terms and Conditions</h1>
        <p>Please read these terms carefully</p>
      </div>
      <div className="container">
        <div className="policy-content">
          <h2>Introduction</h2>
          <p>Welcome to Saliheen Perfumes. By accessing or using our website, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before using our services.</p>

          <h2>Acceptance of Terms</h2>
          <p>By using our website, you confirm that you are at least 18 years old and agree to these Terms and Conditions. If you do not agree, please do not use our website.</p>

          <h2>Orders and Payments</h2>
          <h3>Order Confirmation</h3>
          <p>Once you place an order, you will receive an email confirming the details of your purchase.</p>

          <h3>Payment Methods</h3>
          <p>We accept major credit/debit cards, UPI, and net banking. Cash on Delivery (COD) is also available with an additional shipping fee.</p>

          <h3>No Cancellations</h3>
          <p>Once an order is placed, it <strong>cannot be cancelled</strong>. Please review your order carefully before completing the purchase.</p>

          <h2>Shipping and Delivery</h2>
          <ul>
            <li>We aim to process and ship orders within <strong>1-2 business days</strong>.</li>
            <li>Delivery times may vary depending on your location and the availability of the product.</li>
            <li>For Cash on Delivery (COD) orders, an additional <strong>₹100</strong> will be charged as a shipping fee.</li>
          </ul>

          <h2>Returns and Refunds</h2>
          <p>Refunds are only available for damaged or defective items. To be eligible for a refund, the item must be returned within <strong>7 days</strong> of the order date. Please refer to our <Link to="/refund-cancellation">Refund &amp; Cancellation Policy</Link> for more details.</p>

          <h2>Intellectual Property</h2>
          <p>All content on this website, including text, images, logos, and designs, is the property of Saliheen Perfumes and is protected by intellectual property laws. Unauthorized use of any content is strictly prohibited.</p>

          <h2>Limitation of Liability</h2>
          <p>Saliheen Perfumes shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</p>

          <h2>Governing Law</h2>
          <p>These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms shall be resolved in the courts of India.</p>

          <h2>Changes to Terms</h2>
          <p>We reserve the right to update or modify these Terms and Conditions at any time. Any changes will be posted on this page, and your continued use of the website constitutes acceptance of the updated terms.</p>

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:saliheenperfumes@gmail.com">saliheenperfumes@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
}
