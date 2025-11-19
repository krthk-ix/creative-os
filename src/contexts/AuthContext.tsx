import { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('Sign up:', email, fullName);
    // TODO: Implement your own authentication logic here
    setUser({ id: '1', email, name: fullName });
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Sign in:', email);
    // TODO: Implement your own authentication logic here
    setUser({ id: '1', email });
    return { error: null };
  };

  const signInWithGoogle = async () => {
    console.log('Sign in with Google');
    // TODO: Implement Google OAuth
    // Example flow:
    // 1. Redirect to Google OAuth
    // 2. Get OAuth token
    // 3. Exchange for your backend token
    // 4. Set user

    // Mock implementation
    setUser({
      id: 'google_user_123',
      email: 'user@gmail.com',
      name: 'Google User',
    });
    return { error: null };
  };

  const signOut = async () => {
    console.log('Sign out');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
