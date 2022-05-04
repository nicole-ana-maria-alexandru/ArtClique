import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebase';

export const register = async(email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error:any) {
        console.log(error.message);
    }
}

export const logIn = async(email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error:any) {
        console.log(error.message);
    }
}

export const logOut = async () => {
    try {
        await signOut(auth);
    } catch (error:any) {
        console.log(error.message);
    }
}
