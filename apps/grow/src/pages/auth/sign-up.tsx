import { signInWithGoogle, signUpUser } from '../../lib/authUtils'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../components/context";


export default function SignUp(){

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
    
    async function handleSignUp(e : any){
        e.preventDefault();
        try{
            await signUpUser(email, password);
        }catch(e){
            console.log(e)
        }
    }

    async function handleSignUpWithGoogle(){
        try{
            await signInWithGoogle();
        }catch(e){
            console.log(e)
        }
    }


    return (
        <div className=" flex justify-center place-items-center w-screen h-screen">
            {!user && <div className="bg-white w-[30%] hover:bg-gray-100 shadow-md border-2 text-black rounded-lg p-8 ">
                <div className="flex flex-col gap-4 ">
                    <h1 className=" text-2xl">Sign Up</h1>
                <form onSubmit={handleSignUp} className=" flex flex-col gap-4">
                    <input value={email} onChange={(e)=>setEmail(e.target.value)} className="border-gray-300 focus:outline-none focus:border-blue-500 border-2 p-3 rounded-lg" type="text" placeholder="Email" />
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} className="border-gray-300 focus:outline-none focus:border-blue-500 border-2 p-3 rounded-lg" type="password" placeholder="Password" />
                    <button className=" text-white cursor-pointer p-3 rounded-lg bg-blue-500">Sign Up</button>
                </form>
                <div className="flex flex-col gap-4 place-items-center">
                    <div className=" flex gap-4">
                        <button onClick={handleSignUpWithGoogle} className="cursor-pointer underline ">Sign Up with Google</button>
                    </div>
                    <button onClick={()=>router.push('/auth/sign-in')} className="cursor-pointer underline">Already have an account? Sign In</button>
                </div>
                </div>
            </div>}
        </div>
    )
}