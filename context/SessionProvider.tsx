import React, { createContext, useContext, useEffect, useState } from "react";
import { initSession } from "@/services/appwrite";

type Session = any; // You can type this better with Appwrite models

interface SessionContextType {
  session: Session | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const sess = await initSession();
        setSession(sess);
      } catch (err) {
        console.error("Failed to init session", err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export function useSession() {
  return useContext(SessionContext);
}
