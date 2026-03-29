// @refresh reset
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DemoUser {
  id: string;
  full_name: string;
  email: string;
  username: string;
}

interface DemoAuthState {
  user: DemoUser | null;
  users: DemoUser[];
  signIn: (userId: string) => void;
  signOut: () => void;
  isLoading: boolean;
}

const DemoAuthContext = createContext<DemoAuthState | null>(null);

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("users")
      .select("id, full_name, email, username")
      .order("full_name")
      .then(({ data }) => {
        setUsers(data ?? []);
        // Restore from localStorage
        const stored = localStorage.getItem("demo_user_id");
        if (stored && data) {
          const found = data.find((u) => u.id === stored);
          if (found) setUser(found);
        }
        setIsLoading(false);
      });
  }, []);

  const signIn = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setUser(found);
      localStorage.setItem("demo_user_id", userId);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("demo_user_id");
  };

  return (
    <DemoAuthContext.Provider value={{ user, users, signIn, signOut, isLoading }}>
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const ctx = useContext(DemoAuthContext);
  if (!ctx) throw new Error("useDemoAuth must be inside DemoAuthProvider");
  return ctx;
}
