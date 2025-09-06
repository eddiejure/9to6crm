import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  role: 'user' | 'admin' | 'superadmin';
  tax_number: string | null;
  vat_id: string | null;
  address: any | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');

  useEffect(() => {
    let mounted = true;
    console.log('🔄 AuthProvider useEffect started');
    setDebugInfo('Starting auth check...');

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...');
        setDebugInfo('Checking session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setDebugInfo(`Session error: ${error.message}`);
          setLoading(false);
          return;
        }

        console.log('✅ Session check complete:', session ? 'Found session' : 'No session');
        setDebugInfo(session ? 'Session found, checking profile...' : 'No session found');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          console.log('👤 No user, setting loading to false');
          setDebugInfo('No user logged in');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setDebugInfo(`Unexpected error: ${error}`);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.id);
        setDebugInfo(`Auth changed: ${event}`);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setDebugInfo('User logged out');
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('🧹 AuthProvider cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('👤 Fetching profile for user:', userId);
      setDebugInfo('Loading profile...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        setDebugInfo(`Profile error: ${error.message}`);
        
        // If profile not found (e.g., trigger didn't run or race condition)
        // Attempt to create it directly
        if (error.code === 'PGRST116' || error.message.includes('0 rows')) {
          console.log('📝 Profile not found, attempting to create...');
          setDebugInfo('Profile not found, creating...');
          
          // Use the user object from the context state
          if (user?.email) {
            const { data: newProfileData, error: createError } = await supabase
              .from('profiles')
              .insert({ id: userId, email: user.email })
              .select('*')
              .single();

            if (createError) {
              console.error('❌ Error creating profile:', createError);
              setDebugInfo(`Error creating profile: ${createError.message}`);
              setProfile(null);
            } else if (newProfileData) {
              console.log('✅ Profile created successfully:', newProfileData);
              setProfile(newProfileData);
            }
          } else {
            console.warn('User email not available to create profile.');
            setProfile(null);
          }
        } else {
          // Other types of errors
          setProfile(null);
        }
      } else if (data) {
        console.log('✅ Profile fetched successfully:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setDebugInfo(`Unexpected error: ${error}`);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setDebugInfo('Signing in...');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setDebugInfo(`Sign in error: ${error.message}`);
      setLoading(false);
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    setDebugInfo('Creating account...');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return { error };
    }

    // The trigger will create the basic profile
    // Update it with additional data if user was created
    if (data.user && userData) {
      // Wait a moment for the trigger to create the profile
      setTimeout(async () => {
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              full_name: userData.full_name,
              company_name: userData.company_name,
              tax_number: userData.tax_number,
              vat_id: userData.vat_id,
              address: userData.address,
            })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('❌ Error updating profile:', updateError);
          }
        } catch (error) {
          console.error('❌ Error fetching profile:', error);
          setDebugInfo(`Profile error: ${error.message}`);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      }, 1000);
    }

    setLoading(false);
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    setDebugInfo('Signing out...');
    await supabase.auth.signOut();
    setProfile(null);
    setDebugInfo('Signed out');
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }

    return { error };
  };

  const value = {
    user,
    profile,
    session,
    loading,
    debugInfo,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};