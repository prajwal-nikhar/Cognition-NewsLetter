import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1 py-16 md:py-24 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">
              Privacy Policy
            </h1>
            <div className="prose prose-lg dark:prose-invert mx-auto max-w-none text-foreground">
              <p>
                <strong>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </p>
              
              <p>
                Cognition ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
              </p>

              <h2 className="font-headline text-3xl">Information We Collect</h2>
              <p>
                We may collect personal information from you such as your name and email address when you register for an account. We also collect non-personal information, such as browser type, operating system, and usage details.
              </p>

              <h2 className="font-headline text-3xl">How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, operate, and maintain our services.</li>
                <li>Improve, personalize, and expand our services.</li>
                <li>Understand and analyze how you use our services.</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the webapp, and for marketing and promotional purposes.</li>
                <li>Process your transactions.</li>
                <li>Find and prevent fraud.</li>
              </ul>

              <h2 className="font-headline text-3xl">Sharing Your Information</h2>
              <p>
                We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
              </p>
              
              <h2 className="font-headline text-3xl">Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
              </p>

              <h2 className="font-headline text-3xl">Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>

              <h2 className="font-headline text-3xl">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at contact@example.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
