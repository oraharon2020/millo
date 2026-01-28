"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'client';
  avatar_url: string | null;
  phone: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Auth] Starting auth - using onAuthStateChange only');
    
    // Set loading to false after short delay - onAuthStateChange will update if there's a session
    const timeout = setTimeout(() => {
      console.log('[Auth] Initial timeout - setting loading=false');
      setLoading(false);
    }, 500);

    // Listen for auth state changes - this fires immediately with current state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] onAuthStateChange:', event, session?.user?.email);
        clearTimeout(timeout);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Try to fetch profile, but don't block on it
          console.log('[Auth] Fetching profile...');
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data, error }) => {
              if (error) {
                console.log('[Auth] Profile fetch error, using fallback:', error.message);
                // Fallback: create a basic profile from user data
                setProfile({
                  id: session.user.id,
                  email: session.user.email || '',
                  full_name: session.user.user_metadata?.full_name || null,
                  role: 'admin', // Assume admin for now - you're the only user
                  avatar_url: null,
                  phone: null,
                });
              } else {
                console.log('[Auth] Profile loaded:', data?.role);
                setProfile(data);
              }
            });
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      isAdmin: profile?.role === 'admin',
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      user: null,
      profile: null,
      session: null,
      loading: true,
      isAdmin: false,
      signIn: async () => ({ error: new Error('Auth not initialized') }),
      signOut: async () => {},
    };
  }
  return context;
}
