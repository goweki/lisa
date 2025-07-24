export default function PrivacyPolicyPage() {
  return (
    <div className="px-4 pb-6">
      <p className="text-sm text-muted-foreground mb-2 md:mb-4">
        Effective Date: August 2025
      </p>


      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Data We Collect</h2>
        <p>
          We collect limited personal and institutional data necessary to
          provide our services. This includes:
        </p>
        <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
          <li>Basic user information (name, email, phone)</li>
          <li>Institutional affiliation</li>
          <li>Case-related information and documents</li>
          <li>Subscription and billing details</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Purpose of Collection</h2>
        <p>Your data is collected and processed strictly to:</p>
        <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
          <li>Manage user access and roles</li>
          <li>Facilitate legal case tracking and collaboration</li>
          <li>Support communication (e.g., email/SMS/WhatsApp reminders)</li>
          <li>Process subscriptions and payments</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
        <p>
          We do <strong>not sell</strong> your data. We only share data with:
        </p>
        <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
          <li>
            Trusted third parties (e.g., payment processors, communication
            tools)
          </li>
          <li>Authorities when required by law</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Your Rights</h2>
        <p>Under the Kenya Data Protection Act, 2019, you have the right to:</p>
        <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
          <li>Access and correct your personal data</li>
          <li>Object to processing</li>
          <li>Request deletion (where applicable)</li>
        </ul>
        <p className="mt-2">
          To exercise your rights, contact us at{" "}
          <a
            href="mailto:lisa@goweki.com"
            className="underline hover:text-primary"
          >
            lisa@goweki.com
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
        <p>
          We take reasonable technical and organizational measures to protect
          your information from unauthorized access, loss, or misuse.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Changes</h2>
        <p>
          This policy may be updated periodically. Please review it regularly.
        </p>
      </section>
    </div>
  );
}
