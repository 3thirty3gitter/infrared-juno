import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        // Note: If credentials aren't set, this might throw or return null. 
        // We add a try-catch for safety during dev.
        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                setSession(session);
                setUser(session?.user ?? null);
            } catch (error) {
                console.warn("Auth init failed. Enabling DEMO MODE.", error);
                // Demo User
                const demoUser = { id: 'demo-user', email: 'demo@boxedup.app' };
                setUser(demoUser);
                setSession({ user: demoUser });
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        signUp: async (data) => {
            try {
                return await supabase.auth.signUp(data);
            } catch (e) {
                console.warn("Mocking SignUp success");
                return { data: { user: { email: data.email } }, error: null };
            }
        },
        signIn: async (data) => {
            try {
                return await supabase.auth.signInWithPassword(data);
            } catch (e) {
                console.warn("Mocking SignIn success");
                // Manually set user for the session if in demo mode
                const demoUser = { id: 'demo-user', email: data.email };
                setUser(demoUser);
                return { data: { user: demoUser }, error: null };
            }
        },
        signOut: async () => {
            try {
                await supabase.auth.signOut();
            } catch (e) { console.warn("Mock SignOut"); }
            setUser(null);
            setSession(null);
        },
        user,
        session,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
