import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/home/hero-section';
import FeaturedArticles from '@/components/home/featured-articles';
import RecentArticles from '@/components/home/recent-articles';
import NewsletterSignup from '@/components/home/newsletter-signup';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedArticles />
        <RecentArticles />
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  );
}
