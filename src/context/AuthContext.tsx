import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
    name: string;
    email: string;
    role: string;
    avatar?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    // Mock user
    const [user] = useState<User | null>({
        name: 'HR Admin',
        email: 'admin@gmail.com',
        role: 'Administrator'
    });

    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = () => {
        localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return null; // Or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
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
