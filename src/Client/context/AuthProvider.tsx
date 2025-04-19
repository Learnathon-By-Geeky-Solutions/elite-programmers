"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/auth";
import ROUTES from "@/constants/route";

interface User {
    username: string;
    email: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (
        usernameOrEmail: string,
        password: string,
        setError: (error: string) => void,
        rememberMe: boolean,
        setLoading: (loading: boolean) => void
    ) => Promise<void>;
    logout: () => void;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const fetchUser = useCallback(async (): Promise<User | null> => {
        try {
            const response = await api.get(ROUTES.USER_INFO);
            if (response.status === 200) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    }, []);
    const initializeAuth = useCallback(async () => {
        setIsLoading(true);
        const token = getAuthToken();
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const userData = await fetchUser();

            if (userData) {
                setUser(userData);
            } else {
                removeAuthToken();
                setUser(null);
                router.push(ROUTES.SIGN_IN);
            }
        } catch {
            removeAuthToken();
            setUser(null);
            router.push(ROUTES.SIGN_IN);
        } finally {
            setIsLoading(false);
        }
    }, [fetchUser, router]);
    const login = useCallback(
        async (
            usernameOrEmail: string,
            password: string,
            setError: (error: string) => void,
            rememberMe: boolean,
            setLoading:(loading:boolean)=>void
        ) => {
            try {
                setLoading(true);
                const response = await api.post("/Auth/Login", {
                    usernameOrEmail,
                    password,
                });

                if (response.status === 200) {
                    const { token } = response.data;
                    setAuthToken(token, rememberMe);
                    api.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;

                    const userData = await fetchUser();
                    if (userData) {
                        setUser(userData);
                        const redirectPath = userData.roles.includes("Admin")
                            ? ROUTES.OVERVIEW
                            : ROUTES.HOME;
                        router.push(redirectPath);
                    }
                } else {
                    setError(
                        "Invalid username/email or password. Please try again."
                    );
                }
            } catch {
                setError(
                    "Invalid username/email or password. Please try again."
                );
            } finally {
                setLoading(false);
            }
        },
        [fetchUser, router]
    );
    const logout = useCallback(() => {
        removeAuthToken();
        setUser(null);
        api.defaults.headers.common["Authorization"] = "";
        router.push(ROUTES.SIGN_IN);
    }, [router]);
    const refreshAuth = useCallback(async () => {
        await initializeAuth();
    }, [initializeAuth]);
    useEffect(() => {
        initializeAuth();
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "authToken") {
                initializeAuth();
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [initializeAuth]);

    const contextValue = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            refreshAuth,
        }),
        [user, isLoading, login, logout, refreshAuth]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
