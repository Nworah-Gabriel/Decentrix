"use client";

export default function TermsOfService() {
  return (
    <div className="prose prose-lg max-w-3xl mx-auto py-8">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toISOString().split('T')[0]}</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using SAS ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
      </p>

      <h2>2. Service Description</h2>
      <p>
        SAS provides a decentralized attestation service on the Sui blockchain. The Service allows users to create, verify, and manage attestations using smart contracts.
      </p>

      <h2>3. User Responsibilities</h2>
      <p>
        You are responsible for:
      </p>
      <ul>
        <li>Maintaining the security of your wallet and private keys</li>
        <li>Ensuring you understand the implications of creating and verifying attestations</li>
        <li>Complying with all applicable laws and regulations</li>
      </ul>

      <h2>4. Service Usage</h2>
      <p>
        You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
      </p>
      <ul>
        <li>Use the Service for any illegal or unauthorized purpose</li>
        <li>Create attestations that contain false, misleading, or harmful information</li>
        <li>Attempt to interfere with the proper working of the Service</li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>
        All content and materials available through the Service are the property of SAS and are protected by copyright, trademark, and other intellectual property laws.
      </p>

      <h2>6. Disclaimer of Warranties</h2>
      <p>
        The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. SAS does not warrant that the Service will be uninterrupted or error-free.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        In no event shall SAS be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Service.
      </p>

      <h2>8. Changes to Terms</h2>
      <p>
        We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
      </p>

      <h2>9. Termination</h2>
      <p>
        We may terminate or suspend your access to the Service at any time, with or without cause, and without prior notice.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at:
      </p>
      <p>
        Email: support@sas.com
      </p>
    </div>
  );
}
