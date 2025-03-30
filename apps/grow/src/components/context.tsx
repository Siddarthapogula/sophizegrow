import { User } from "firebase/auth";
import {createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../lib/authUtils";



interface AuthContextType{
    user : User | null;
    loading : boolean;
}

const AuthContext = createContext<AuthContextType>({
    user : null,
    loading : true,
})

export const useAuth = ()=>useContext(AuthContext);

export const AuthContextProvider = ({ children } : { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
      const unsubscribe = subscribeToAuthChanges((user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
      }, []);

    return (
        <AuthContext.Provider value={{user, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

