import { useRouter } from "next/navigation";
import {useState } from "react";
import { useAuth } from "../../components/context";
import { signInWithEmail, signInWithGoogle } from '../../lib/authUtils'


export default function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {user, loading} = useAuth();
    const router = useRouter();

    if(loading && !user){
        return <h1>Loading...</h1>;
    }
    if(!loading && user){
        router.push("/");
    }
    async function handleSignIn(e : any){
        e.preventDefault(); 
        try{
            const res = await signInWithEmail(email, password);
            console.log(res);
        }catch(e : any){
            alert('signin failed')
        }
    }

    async function handleSignInWithGoogle(){
        try{
            const res = await signInWithGoogle();
        }catch(e){
            console.log(e)
        }
    }


    return (
        <div className=" flex justify-center place-items-center w-screen h-screen">
            { !user && <div className="border-2 hover:bg-gray-100 text-black w-[30%] rounded-lg p-8 shadow-md ">
                <div className="flex flex-col gap-4 ">
                    <h1 className=" text-2xl">Sign In</h1>
                <form onSubmit={handleSignIn} className=" flex flex-col gap-4">
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} className="border-gray-300 focus:outline-none focus:border-blue-500 border-2 p-3 rounded-lg" type="text" placeholder="Email" />
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} className="border-gray-300 focus:outline-none focus:border-blue-500 border-2 p-3 rounded-lg" type="password" placeholder="Password" />
                    <button className=" text-white cursor-pointer p-3 rounded-lg bg-blue-500">Sign In</button>
                </form>
                <div className="flex flex-col gap-4">
                    <div className=" flex flex-col gap-4 place-items-center">
                        <button onClick={handleSignInWithGoogle} className="cursor-pointer underline ">Sign In with Google</button>
                    </div>
                    <button onClick={()=>router.push('/auth/sign-up')} className="cursor-pointer underline ">don't have an account? Sign Up</button>
                </div>
                </div>
            </div>}
        </div>
    )
}