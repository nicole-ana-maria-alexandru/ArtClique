import {
  query,
  collection,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import router from "next/router";
import { useEffect, useState } from "react";
import NavMenu from "../../components/NavMenu";
import { db } from "../../hooks/firebase/firebase";

export default function Profile() {
  const { id } = router.query;
  const [profileUser, setProfileUser] = useState<any>(null);

  useEffect(() => {
    (async function loadProfileUser() {
      const docRef = doc(db, "users", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfileUser({
          id: docSnap.id,
          auth_uid: docSnap.data().auth_uid,
          first_name: docSnap.data().first_name,
          last_name: docSnap.data().last_name,
          user_type: docSnap.data().user_type,
          username: docSnap.data().username,
          profile_img: docSnap.data().profile_img,
        });
      }
    })();
  }, [id]);

  return (
    <div>
      <NavMenu>
        <p>this is the user's profile</p>
      </NavMenu>
    </div>
  );
}
