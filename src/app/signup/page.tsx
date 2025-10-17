'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import { useAuth, useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { motion } from 'framer-motion';
import SignupThreeVisualization from '@/components/signup/three-visualization';

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!auth || !db) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firebase services are not available.',
      });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Weak Password",
            description: "Password should be at least 6 characters long.",
        });
        setLoading(false);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      const userDocRef = doc(db, 'users', user.uid);
      const newProfile = {
        displayName: displayName,
        email: user.email,
        role: 'user',
      };
      
      setDoc(userDocRef, newProfile)
        .then(() => {
          router.push('/profile?signup=success');
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'create',
              requestResourceData: newProfile,
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
            // Also show a toast as a fallback
            toast({
              variant: 'destructive',
              title: 'Signup Failed',
              description: 'Could not save user profile. Please check permissions.',
            });
            setLoading(false); // Stop loading on permission error
        });
      
    } catch (error) {
      console.error(error); 
      let errorMessage = 'An unexpected error occurred.';

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage =
              'This email address is already in use by another account.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/weak-password':
            errorMessage = 'The password is too weak. Please choose a stronger password.';
            break;
          default:
            errorMessage = 'Failed to create an account. Please try again later.';
        }
      }
      
      toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: errorMessage,
      });
      setLoading(false);
    } 
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center">
        <SignupThreeVisualization />
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-background/80 via-background/60 to-transparent" />
        <main className="z-20 flex w-full max-w-sm flex-col items-center">
            <motion.div
                className="w-full"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
            <Card className="w-full">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                        <User className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
                    <CardDescription>Join Cognition to explore the future of data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Name</Label>
                            <Input
                                id="displayName"
                                type="text"
                                placeholder="Ada Lovelace"
                                required
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || !email || !password || !displayName}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-4 text-center text-sm text-muted-foreground">
                    <div>
                        Already have an account?{' '}
                        <Button variant="link" className="px-1" asChild>
                            <Link href="/login">Log in</Link>
                        </Button>
                    </div>
                    <Link href="/">
                        <Button variant="outline" size="sm">
                            Back to Home
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
            </motion.div>
        </main>
    </div>
  );
}
