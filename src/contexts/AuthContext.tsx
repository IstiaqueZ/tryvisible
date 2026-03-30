import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface SubscriptionState {
  subscribed: boolean;
  product_id: string | null;
  plan_tier: string | null;
  subscription_end: string | null;
  keyword_credits: number;
  deep_audit_credits: number;
  loading: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionState;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const defaultSub: SubscriptionState = {
  subscribed: false,
  product_id: null,
  plan_tier: null,
  subscription_end: null,
  keyword_credits: 0,
  deep_audit_credits: 0,
  loading: true,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  subscription: defaultSub,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshSubscription: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionState>(defaultSub);

  const checkSubscription = useCallback(async (currentSession: Session | null) => {
    if (!currentSession) {
      setSubscription({ ...defaultSub, loading: false });
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: { Authorization: `Bearer ${currentSession.access_token}` },
      });
      if (error) throw error;
      setSubscription({
        subscribed: data.subscribed || false,
        product_id: data.product_id || null,
        plan_tier: data.plan_tier || null,
        subscription_end: data.subscription_end || null,
        keyword_credits: data.keyword_credits || 0,
        deep_audit_credits: data.deep_audit_credits || 0,
        loading: false,
      });
    } catch (err) {
      console.error("Error checking subscription:", err);
      setSubscription({ ...defaultSub, loading: false });
    }
  }, []);

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session) {
        // Defer to avoid race conditions with auth
        setTimeout(() => checkSubscription(session), 500);
      } else {
        setSubscription({ ...defaultSub, loading: false });
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session) checkSubscription(session);
    });

    return () => authSub.unsubscribe();
  }, [checkSubscription]);

  // Auto-refresh subscription every 60s
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => checkSubscription(session), 60000);
    return () => clearInterval(interval);
  }, [session, checkSubscription]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshSubscription = useCallback(async () => {
    await checkSubscription(session);
  }, [session, checkSubscription]);

  return (
    <AuthContext.Provider value={{ user, session, loading, subscription, signInWithGoogle, signOut, refreshSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};
