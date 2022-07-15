import router from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import NavMenu from "../../components/NavMenu";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../hooks/firebase/firebase";
import Post from "../../components/Post";

export default function PostRoute() {
  const { id } = router.query;
  const [post, setPost] = useState<any>(null);
  const { userDetails } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "posts", id as string), (doc) => {
      setPost({
        id: doc.id,
        username: doc.data()?.username,
        profileImg: doc.data()?.profileImg,
        image: doc.data()?.image,
        caption: doc.data()?.caption,
        isForSale: doc.data()?.isForSale,
        userId: doc.data()?.userId,
        timestamp: doc.data()?.timestamp,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [db, id]);

  return (
    <NavMenu>
      {post && (
        <>
          <Post
            key={post?.id}
            id={post?.id}
            username={post.username}
            profileImg={post.profileImg}
            postImg={post.image}
            caption={post.caption}
            isForSale={post.isForSale}
            userId={post.userId}
            timestamp={post.timestamp}
          />
        </>
      )}
    </NavMenu>
  );
}
