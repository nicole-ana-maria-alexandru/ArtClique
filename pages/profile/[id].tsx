import {
  Center,
  Stack,
  useColorModeValue,
  Flex,
  Avatar,
  Heading,
  Badge,
  Button,
  Text,
  Box,
} from "@chakra-ui/react";
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
} from "firebase/firestore";
import router from "next/router";
import { useEffect, useState } from "react";
import NavMenu from "../../components/NavMenu";
import Post from "../../components/Post";
import { useAuth } from "../../hooks/AuthContext";
import { db } from "../../hooks/firebase/firebase";

export default function Profile() {
  const { id } = router.query;
  const [profileUser, setProfileUser] = useState<any>(null);
  const [posts, setPosts] = useState<any>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { userDetails } = useAuth();

  // useEffect(() => {
  //   (async function loadProfileUser() {
  //     const docRef = doc(db, "users", id as string);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       setProfileUser({
  //         id: docSnap.id,
  //         auth_uid: docSnap.data().auth_uid,
  //         first_name: docSnap.data().first_name,
  //         last_name: docSnap.data().last_name,
  //         description: docSnap.data().description,
  //         username: docSnap.data().username,
  //         profile_img: docSnap.data().profile_img,
  //         followers: docSnap.data().followers,
  //         following: docSnap.data().following,
  //       });
  //     }
  //   })();
  // }, [id]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", id as string), (doc) => {
      setProfileUser({
        id: doc.id,
        auth_uid: doc.data()?.auth_uid,
        first_name: doc.data()?.first_name,
        last_name: doc.data()?.last_name,
        description: doc.data()?.description,
        username: doc.data()?.username,
        profile_img: doc.data()?.profile_img,
        followers: doc.data()?.followers,
        following: doc.data()?.following,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [db, id]);


  useEffect(() => {
    if (profileUser) {
      const q = query(
        collection(db, "posts"),
        where("userId", "==", profileUser?.id),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setPosts(querySnapshot.docs);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [db, profileUser?.id]);

  useEffect(
    () =>
      {
        if(userDetails && profileUser){
          if(profileUser.followers != null)
          setIsFollowing(
            profileUser?.followers?.findIndex(
              (id: any) => id === userDetails?.id
            ) !== -1
          )   
        }
      },
    [profileUser?.followers]
  );

  const removeFollow = async () => {
    await updateDoc(doc(db, "users", profileUser?.id), {
      followers: arrayRemove(userDetails?.id),
    });
    await updateDoc(doc(db, "users", userDetails?.id), {
      following: arrayRemove(profileUser?.id),
    });
  };

  const addFollow = async () => {
    await updateDoc(doc(db, "users", profileUser?.id), {
      followers: arrayUnion(userDetails?.id),
    });
    await updateDoc(doc(db, "users", userDetails?.id), {
      following: arrayUnion(profileUser?.id),
    });
  };

  const followUser = async () => {
    if (isFollowing) {
      await removeFollow();
    } else {
      await addFollow();
    }
  };

  return (
    <Box>
      <NavMenu>
        <Center py={6}>
          <Stack
            borderWidth="1px"
            borderRadius="lg"
            w={{ sm: "100%", md: "75%" }}
            height={{ sm: "476px", md: "20rem" }}
            direction={{ base: "column", md: "row" }}
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            padding={4}
          >
            <Flex flex={1} align={"center"} justify={"center"}>
              <Avatar
                size={"xl"}
                src={profileUser?.profile_img}
                css={{
                  border: "2px solid white",
                }}
              />
            </Flex>
            <Stack
              direction={{ base: "column", md: "row" }}
              justifyContent="center"
              alignItems="center"
              p={1}
              pt={2}
            >
              <Stack alignItems="center">
                <Heading fontSize={"2xl"} fontFamily={"body"}>
                  {profileUser?.first_name} {profileUser?.last_name}
                </Heading>
                <Text fontWeight={600} color={"gray.500"} size="sm" mb={4}>
                  @{profileUser?.username}
                </Text>
              </Stack>
              <Stack alignItems="center">
                <Text
                  textAlign={"center"}
                  color={useColorModeValue("gray.700", "gray.400")}
                  px={3}
                >
                  {profileUser?.description}
                </Text>
                <Stack
                  align={"center"}
                  justify={"center"}
                  direction={"row"}
                  mt={6}
                >
                  {/*TODO aici trebuie lucrat ca daca sunt mai multe ies chestiile in afara si ar trb sa fie pe 2 randuri sau mai multe */}
                  <Badge
                    px={2}
                    py={1}
                    bg={useColorModeValue("gray.50", "gray.800")}
                    fontWeight={"400"}
                  >
                    #art
                  </Badge>
                  <Badge
                    px={2}
                    py={1}
                    bg={useColorModeValue("gray.50", "gray.800")}
                    fontWeight={"400"}
                  >
                    #photography
                  </Badge>
                  <Badge
                    px={2}
                    py={1}
                    bg={useColorModeValue("gray.50", "gray.800")}
                    fontWeight={"400"}
                  >
                    #music
                  </Badge>
                </Stack>
              </Stack>

              <Stack alignItems="center">
                <Stack direction={"row"}>
                  <Stack spacing={0} align={"center"}>
                    <Text fontWeight={600}>
                      {profileUser?.followers?.length}
                    </Text>
                    <Text fontSize={"sm"} color={"gray.500"}>
                      Followers
                    </Text>
                  </Stack>

                  <Stack spacing={0} align={"center"}>
                    <Text fontWeight={600}>
                      {profileUser?.following?.length}
                    </Text>
                    <Text fontSize={"sm"} color={"gray.500"}>
                      Following
                    </Text>
                  </Stack>
                </Stack>

                <Stack
                  width={"100%"}
                  mt={"2rem"}
                  direction={"row"}
                  padding={2}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  {isFollowing ? (
                    <Button
                      flex={1}
                      fontSize={"sm"}
                      rounded={"full"}
                      bgGradient="linear(to-r, blue.500, purple.500)"
                      color={"white"}
                      onClick={followUser}
                      boxShadow={
                        "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                      }
                      _hover={{
                        bgGradient: "linear(to-r, blue.400, purple.400)",
                      }}
                      _focus={{
                        bgGradient: "linear(to-r, blue.400, purple.400)",
                      }}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      flex={1}
                      fontSize={"sm"}
                      rounded={"full"}
                      bg={"blue.400"}
                      color={"white"}
                      onClick={followUser}
                      boxShadow={
                        "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                      }
                      _hover={{
                        bg: "blue.500",
                      }}
                      _focus={{
                        bg: "blue.500",
                      }}
                    >
                      Follow
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Center>

        {posts && (
          <>
            {posts.map((post: any) => (
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
    </Box>
  );
}
