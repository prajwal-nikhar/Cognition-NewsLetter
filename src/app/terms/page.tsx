import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1 py-16 md:py-24 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-center mb-12">
              Terms of Service
            </h1>
            <div className="prose prose-lg dark:prose-invert mx-auto max-w-none text-foreground">
              <p>
                <strong>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </p>
              
              <p>
                Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Cognition application (the "Service") operated by us.
              </p>

              <p>
                Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who wish to access or use the Service.
              </p>

              <h2 className="font-headline text-3xl">Accounts</h2>
              <p>
                When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.
              </p>

              <h2 className="font-headline text-3xl">Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of Cognition and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>

              <h2 className="font-headline text-3xl">Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              
              <h2 className="font-headline text-3xl">Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>

              <h2 className="font-headline text-3xl">Changes</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>

              <h2 className="font-headline text-3xl">Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at contact@example.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
