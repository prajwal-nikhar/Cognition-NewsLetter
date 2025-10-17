'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus2, BarChart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
  };

  const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
          y: 0,
          opacity: 1
      }
  };

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1 bg-transparent py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Admin Dashboard</CardTitle>
              </CardHeader>
              <motion.div 
                className="grid gap-6 md:grid-cols-2 p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Link href="/admin/create-article" passHref>
                    <div className="p-6 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer flex flex-col items-center text-center h-full">
                      <FilePlus2 className="h-12 w-12 mb-4 text-primary" />
                      <h3 className="text-xl font-semibold mb-2">Create New Article</h3>
                      <p className="text-muted-foreground">
                        Write, edit, and publish new content for the newsletter.
                      </p>
                    </div>
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <div className="p-6 border rounded-lg flex flex-col items-center text-center bg-muted/50 cursor-not-allowed h-full">
                      <BarChart className="h-12 w-12 mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                      <p className="text-muted-foreground">
                        (Coming Soon) View article performance and user engagement.
                      </p>
                  </div>
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
