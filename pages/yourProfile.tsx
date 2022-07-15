import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import UserProfileCard from "../components/UserProfileCard";
import NavMenu from "../components/NavMenu";
import Post from "../components/Post";
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  where,
  collectionGroup,
} from "firebase/firestore";
import { db } from "../hooks/firebase/firebase";
import { useAuth } from "../hooks/AuthContext";


const Profile: NextPage = () => {
  const [posts, setPosts] = useState<any>([]);
  const { user, userDetails } = useAuth();

  // useEffect(
  //   () =>
  //     onSnapshot(
  //       query(collection(db, "posts"), orderBy("timestamp", "desc")),
  //       (snapshot) => {
  //         setPosts(snapshot.docs);
  //       }
  //     ),
  //   [db]
  // );

  // useEffect(
  //   () =>
  //     onSnapshot(
  //       query(collectionGroup(db, "posts"), where("userId", "==", userDetails?.id), orderBy("timestamp", "desc")),
  //       (snapshot) => {
  //         setPosts(snapshot.docs);
  //       }
  //     ),
  //   [db]
  // );

  useEffect(() => {
    if (userDetails) {
      const q = query(
        collection(db, "posts"),
        where("userId", "==", userDetails?.id),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setPosts(querySnapshot.docs);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [db, userDetails?.id]);

  return (
    <div>
      <NavMenu>
        {
          userDetails && 
          <UserProfileCard />
        }
        {posts && (
          <>    
            {posts.map((post : any) => (
              <Post
                key={post.id}
                id={post.id}
                username={post.data().username}
                profileImg={post.data().profileImg}
                postImg={post.data().image}
                caption={post.data().caption}
                isForSale={post.data().isForSale}
                userId={post.data().userId}
                timestamp={post.data().timestamp}
              />
            ))}
          </>
        )}
      </NavMenu>
    </div>
  );
};

export default Profile;
