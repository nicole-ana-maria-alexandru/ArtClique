import type { NextPage } from "next";
import { useEffect, useState } from "react";
import NavMenu from "../components/NavMenu";
import { useAuth } from "../hooks/AuthContext";
import {
  query,
  collection,
  where,
  onSnapshot,
  doc,
  getDoc,
  orderBy,
  arrayRemove,
  updateDoc,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { db } from "../hooks/firebase/firebase";
import Post from "../components/Post";
import InfiniteScroll from "react-infinite-scroll-component";
import BarLoader from "react-spinners/BarLoader";
import { Center, Text, VStack } from "@chakra-ui/react";

const NewsFeed: NextPage = () => {
  const { userDetails } = useAuth();
  const [posts, setPosts] = useState<any>([]);
  const firstSlice = 3;
  const perSlice = 2;
  const [displayPosts, setDisplayPosts] = useState<any>([]);
  const [hasMore, setHasMore] = useState<any>(true);
  const [slice, setSlice] = useState<any>(firstSlice);

  useEffect(() => {
    (async function getPosts() {
      if (userDetails && userDetails?.following?.length > 0) {
        const q = query(
          collection(db, "posts"),
          where("userId", "in", userDetails?.following),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        setPosts(querySnapshot.docs);
      }
    })();
  }, [userDetails]);

  useEffect(() => {
    setSlice(firstSlice);

    setDisplayPosts(
      posts
        .slice(0, slice)
        .map((post: any) => (
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
        ))
    );

    setHasMore(true);
    if (firstSlice >= posts.length) setHasMore(false);
  }, [posts]);

  const nextSlice = () => {
    return posts
      .slice(slice, slice + perSlice)
      .map((post: any) => (
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
      ));
  };

  const addSlice = () => {
    setDisplayPosts([...displayPosts, ...nextSlice()]);

    setSlice(slice + perSlice);
    if (slice >= posts.length) setHasMore(false);
  };

  const barloader = (isLoading: any) => {
    return (
      <div>
        <Center>
          <BarLoader loading={isLoading} height={5} width={"60vw"} />
        </Center>
      </div>
    );
  };

  return (
    <NavMenu>
      {/* {posts && (
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
              />
            ))}
          </>
        )} */}

      {!posts.length && (
        <Center>
          <VStack>
            <Text fontSize={'lg'} fontWeight={'semibold'}>Please follow other users to populate your news feed.</Text>
            <Text>In order to do this, feel free to use the Explore page.</Text>
          </VStack>
        </Center>
      )}
      <InfiniteScroll
        dataLength={displayPosts.length}
        // scrollableTarget='scrollable-div'
        next={addSlice}
        scrollThreshold={0.8}
        hasMore={hasMore}
        loader={barloader(hasMore)}
        // endMessage="That's it!"
      >
        <div>{displayPosts}</div>
      </InfiniteScroll>
    </NavMenu>
  );
};

export default NewsFeed;
