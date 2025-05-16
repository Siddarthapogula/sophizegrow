import { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthChanges } from '../lib/authUtils';
import { getAllUsers } from '../utils/apis';

interface AuthContextType {
  user: User | null;
  isUserAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isUserAdmin: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      if(!user){
        setUser(null);
        setIsUserAdmin(false);
        setLoading(false);
        return;
      }
      setUser(user);
      setLoading(false);
      const fetchAndCheckAdmin = async () => {
        if (!user?.email) return;
        try {
          const allUsers = await getAllUsers();
          const matchedUser = allUsers.find((u: any) => u.email === user.email);
          if (matchedUser) {
            setIsUserAdmin(matchedUser.isAdmin);
          }
        } catch (err) {
          console.error('Error fetching users or checking admin status:', err);
        }
      };
      fetchAndCheckAdmin();
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isUserAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
