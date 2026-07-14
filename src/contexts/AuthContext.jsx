import { createContext, useContext, useState, useEffect, useCallback } from "react";

// Lazy supabase — only loads when auth is actually used
let supabaseInstance = null;
let configured = false;
async function getSupabase() {
  if (!supabaseInstance) {
    try {
      const mod = await import("../lib/supabase");
      supabaseInstance = mod.supabase;
      configured = mod.isSupabaseConfigured();
    } catch {
      configured = false;
    }
  }
  return { supabase: supabaseInstance, configured };
}

const AuthContext = createContext(null);

const STORAGE_PREFIX = "travel-";

// Non-reactive references set once supabase is loaded
let _supabase = null;
let _configured = false;

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
    let cancelled = false;
    (async () => {
      const { supabase: sb, configured: cfg } = await getSupabase();
      if (cancelled) return;
      _supabase = sb;
      _configured = cfg;
      if (!cfg) {
        setLoading(false);
        return;
      }

      _supabase.auth.getSession().then(({ data: { session } }) => {
        if (!cancelled) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

      const { data: { subscription } } = _supabase.auth.onAuthStateChange((_event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);
        if (newUser) {
          loadFromCloud();
        }
      });

      return () => { subscription?.unsubscribe(); cancelled = true; };
    })();
  }, []);

  const loadFromCloud = useCallback(async () => {
    if (!_configured || !user) return;
    try {
      const { data, error } = await _supabase
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
    if (!_configured || !user) return false;
    const localData = getAllLocalData();
    try {
      const { error } = await _supabase
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
    if (!_configured) return { error: "Supabase not configured" };
    const { error } = await _supabase.auth.signUp({ email, password });
    return { error };
  };

  const signIn = async (email, password) => {
    if (!_configured) return { error: "Supabase not configured" };
    const { error } = await _supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    if (!_configured) return;
    await _supabase.auth.signOut();
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
