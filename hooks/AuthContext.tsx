import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../hooks/firebase/firebase";
import { UserDetails } from "./firebase/interfaces";

const AuthContext = createContext<any>({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getUserDetails = async (uid: string) => {
    const q = query(collection(db, "users"), where("auth_uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUserDetails({
        id: doc.id,
        first_name: doc.data().first_name,
        last_name: doc.data().last_name,
        user_type: doc.data().user_type,
        username: doc.data().username,
        profile_img: doc.data().profile_img,
      });
    });
  };

  const getArtist = async (id: string) => {
    const q = query(collection(db, "artists"), where("user_id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setArtist({
        id: doc.id,
        user_id: doc.data().user_id,
        description: doc.data().description,
      });
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        if (!user) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          });
        }
        if(!userDetails)
        await getUserDetails(firebaseUser.uid);
        console.log(userDetails);
        if (userDetails?.user_type === "artist")
          await getArtist(userDetails.id);
      } else {
        setUser(null);
        setUserDetails(null);
        if (userDetails?.user_type === "artist") setArtist(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, user]);

  // useEffect(() => {

  //   getUserDetails(user.uid);
  //   if(userDetails?.user_type === 'artist')
  //       getArtist(userDetails.id);

  // }, [db])

  const register = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    setUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        userDetails,
        artist,
        setUserDetails,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
