"use client";

export default function PrivacyPolicy() {
  return (
    <div className="prose prose-lg max-w-3xl mx-auto py-8">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toISOString().split('T')[0]}</p>

      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy explains how SAS ("we", "us", or "our") collects, uses, and protects your personal information when you use our decentralized attestation service.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We collect the following types of information:
      </p>
      <ul>
        <li>
          <strong>Public Blockchain Data:</strong> We collect information from the Sui blockchain, including attestation data, schema information, and addresses that are publicly available.
        </li>
        <li>
          <strong>Usage Data:</strong> We may collect information about how you interact with our service, including pages visited and features used.
        </li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>
        We use the collected information to:
      </p>
      <ul>
        <li>Provide and maintain our service</li>
        <li>Process attestations and verifications</li>
        <li>Improve our service and develop new features</li>
        <li>Ensure the security and integrity of our service</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>
        We implement appropriate security measures to protect your data and ensure it is not accessed or disclosed without authorization.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You have the right to:
      </p>
      <ul>
        <li>Access your personal information</li>
        <li>Request correction of inaccurate information</li>
        <li>Request deletion of your personal information</li>
        <li>Object to processing of your personal information</li>
      </ul>

      <h2>6. Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at:
      </p>
      <p>
        Email: support@sas.com
      </p>
    </div>
  );
}
