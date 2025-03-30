import { Button } from '@grow/shared';
import { useRouter } from 'next/navigation';
import { useAuth } from './context';
import { signOutUser } from '../lib/authUtils';

export default function Header() {
  const router = useRouter();
  const {user, loading} = useAuth();
  return (
    <header className=" shadow-lg p-5 flex justify-between fixed left-0 right-0 bg-white items-center ">
      <h1 onClick={() => router.push('/')} className=" text-blue-800 cursor-pointer text-3xl font-bold">Grow</h1>
      <div className='flex items-center gap-4'>
        <nav className="space-x-4"> 
          <span className="hover:underline hover:cursor-pointer">Features</span>
          <span
            onClick={() => router.push('/domainModel')}
            className="hover:underline hover:cursor-pointer"
          >
            Domain Model
          </span>
          <span className="hover:underline hover:cursor-pointer">Contact</span>
        </nav>
        {(!user && !loading)  ? <Button onClick={() => router.push('/auth/sign-in')} className="">
          Sign In
        </Button> : <Button onClick={async () => await signOutUser()} className="">
          Log Out
        </Button>}
      </div>
    </header>
  );
}
