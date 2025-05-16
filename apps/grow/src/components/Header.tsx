import { Button } from '@grow/shared';
import { useRouter } from 'next/navigation';
import { useAuth } from './context';
import { signOutUser } from '../lib/authUtils';

export default function Header() {
  const router = useRouter();
  const { user, loading, isUserAdmin } = useAuth();

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
          <span
            onClick={() => router.push('/features')}
            className="hover:underline hover:cursor-pointer "
          >
            Features
          </span>
          {isUserAdmin && (
            <span
              onClick={() => router.push('/certify')}
              className="hover:underline hover:cursor-pointer"
            >
              Certify
            </span>
          )}
          <span
            onClick={() => {
              if (user) {
                router.push(isUserAdmin ? '/domainModel' : '/userDomainModel');
              }else{
                router.push('/domainModel');
              }
            }}
            className="hover:underline hover:cursor-pointer"
          >
            Domain Model
          </span>

          <span
            onClick={() => router.push('/contact')}
            className="hover:underline hover:cursor-pointer"
          >
            Contact
          </span>
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
