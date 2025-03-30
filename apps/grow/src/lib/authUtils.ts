import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";


export async function signInWithEmail(email : string, password : string){
    try{
        const res = await signInWithEmailAndPassword(auth, email, password);
        return res.user;
    }
    catch(err){
        console.log(err);
    }
}

export async function signInWithGoogle(){
    try{
        const res = await signInWithPopup(auth, googleProvider);
        return res.user;
    }catch(err){
        console.log(err);
    }
}

export async function signUpUser(email : string, password : string){
    try{
        const res = await createUserWithEmailAndPassword(auth, email, password);
        return res.user;
    }catch(err){
        console.log(err);
    }
}

export async function getCuurrentUser(){
    try{
        const user = auth.currentUser;
        return user;
    }catch(e){
        console.log(e);
    }
}

export async function signOutUser(){
    try{
        await signOut(auth);
    }catch(e){
        console.log(e);
    }
}

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return auth.onAuthStateChanged(callback);
}