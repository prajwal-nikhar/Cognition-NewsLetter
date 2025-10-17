'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';


type UserProfile = {
    displayName: string;
    email: string;
    role: string;
};

function ProfilePageContent() {
  const { user, isLoading: isUserLoading } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs once on mount to show the success toast.
    if (searchParams.get('signup') === 'success') {
      toast({
        title: 'Account Created!',
        description: 'You have been successfully signed up.',
      });
      // Clean up the URL by replacing the history state.
      router.replace('/profile', {scroll: false});
    }
  }, [searchParams, router, toast]);

  useEffect(() => {
    if (isUserLoading) {
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }
    if (!db) {
        setLoading(false);
        console.warn("Firestore not available at the moment.");
        return;
    }

    const fetchProfile = async () => {
      if (!db || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      
      try {
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            setProfile(userDocSnap.data() as UserProfile);
        } else {
            // If profile doesn't exist in Firestore, create it from auth info
            const newProfile: UserProfile = {
                displayName: user.displayName || 'No Name',
                email: user.email || 'No Email',
                role: 'user', // default role
            };
            setDoc(userDocRef, newProfile)
              .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                  path: userDocRef.path,
                  operation: 'create',
                  requestResourceData: newProfile,
                } satisfies SecurityRuleContext);
                errorEmitter.emit('permission-error', permissionError);
              });
            setProfile(newProfile);
        }
      } catch (error: any) {
        if (error.code === 'permission-denied') {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'get',
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
        } else {
            console.error("Error fetching user profile:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load your profile."
            })
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, isUserLoading, router, db, toast]);

  const handleLogout = async () => {
    if (auth) {
        await signOut(auth);
        router.push('/login');
    }
  };

  const isLoading = isUserLoading || loading;

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1 bg-transparent py-16 md:py-24">
        <div className="container mx-auto max-w-2xl px-4">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="space-y-2 text-center w-full max-w-sm">
                                <Skeleton className="h-8 w-48 mx-auto" />
                                <Skeleton className="h-6 w-64 mx-auto" />
                                <Skeleton className="h-6 w-24 mx-auto" />
                            </div>
                            <Skeleton className="h-10 w-24" />
                        </>
                    ) : profile ? (
                        <>
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user?.photoURL || ''} alt={profile.displayName} />
                                <AvatarFallback className="text-3xl">
                                    {profile.displayName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">{profile.displayName}</h2>
                                <p className="text-muted-foreground">{profile.email}</p>
                                <Badge className="mt-2 capitalize" variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                                    {profile.role}
                                </Badge>
                            </div>
                            <Button onClick={handleLogout} variant="outline">Log Out</Button>
                        </>
                    ) : (
                        <p>Could not load profile.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfilePageContent />
        </Suspense>
    )
}
