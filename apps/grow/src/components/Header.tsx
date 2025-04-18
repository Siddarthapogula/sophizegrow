import { Button } from '@grow/shared';
import { useRouter } from 'next/navigation';
import { useAuth } from './context';
import { signOutUser } from '../lib/authUtils';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../utils/apis';

export default function Header() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, loading } = useAuth();
  //this one should be replaced by using getUserInfo or similar which will
  // find current user logged in detail from postgresDb instead of firebase
  // and having all other informations like isAdmin and all apart from authentication purpose as well.
  useEffect(() => {
    const fetchAndCheckAdmin = async () => {
      if (!user?.email) return;
      try {
        const allUsers = await getAllUsers();
        const matchedUser = allUsers.find((u : any) => u.email === user.email);
        if (matchedUser) {
          setIsAdmin(matchedUser.isAdmin);
        }
      } catch (err) {
        console.error('Error fetching users or checking admin status:', err);
      }
    };

    fetchAndCheckAdmin();
  }, [user]);

  return (
    <header className=" z-50 shadow-lg p-5 flex justify-between fixed left-0 right-0 bg-white items-center ">
      <h1
        onClick={() => router.push('/')}
        className=" text-blue-800 cursor-pointer text-3xl font-bold"
      >
        Grow
      </h1>
      <div className="flex items-center gap-4">
        <nav className="space-x-4">
          <span className="hover:underline hover:cursor-pointer ">
            Features
          </span>
          {isAdmin && (
            <span
              onClick={() => router.push('/certify')}
              className="hover:underline hover:cursor-pointer"
            >
              Certify
            </span>
          )}
          <span
            onClick={() =>
              router.push(isAdmin ? '/domainModel' : '/userDomainModel')
            }
            className="hover:underline hover:cursor-pointer"
          >
            Domain Model
          </span>

          <span className="hover:underline hover:cursor-pointer">Contact</span>
        </nav>
        {!user && !loading ? (
          <Button onClick={() => router.push('/auth/sign-in')} className="">
            Sign In
          </Button>
        ) : (
          <>
            {user?.displayName || user?.email}
            <Button onClick={async () => await signOutUser()} className="">
              Log Out
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
