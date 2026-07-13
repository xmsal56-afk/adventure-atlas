import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AuthContext = createContext(null);

const STORAGE_PREFIX = "travel-";

function getAllLocalData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(STORAGE_PREFIX)) {
      try { data[k] = JSON.parse(localStorage.getItem(k)); } catch { data[k] = localStorage.getItem(k); }
    }
  }
  return data;
}

function setAllLocalData(data) {
  Object.entries(data).forEach(([k, v]) => {
    try { localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)); } catch {}
  });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      if (newUser) {
        // User just signed in — restore data from cloud
        loadFromCloud();
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const loadFromCloud = useCallback(async () => {
    if (!isSupabaseConfigured() || !user) return;
    try {
      const { data, error } = await supabase
        .from("user_data")
        .select("data, updated_at")
        .eq("user_id", user.id)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      if (data?.data) {
        setAllLocalData(data.data);
        setLastSync(data.updated_at);
      }
    } catch (e) {
      console.warn("Supabase sync failed (table may not exist yet):", e.message);
    }
  }, [user]);

  const syncToCloud = useCallback(async () => {
    if (!isSupabaseConfigured() || !user) return false;
    const localData = getAllLocalData();
    try {
      const { error } = await supabase
        .from("user_data")
        .upsert({ user_id: user.id, data: localData, updated_at: new Date().toISOString() });
      if (error) throw error;
      setLastSync(new Date().toISOString());
      return true;
    } catch (e) {
      console.warn("Supabase sync failed:", e.message);
      return false;
    }
  }, [user]);

  const signUp = async (email, password) => {
    if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured()) return { error: "Supabase not configured" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, showAuth, setShowAuth,
      signUp, signIn, signOut, syncToCloud, loadFromCloud, lastSync,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
