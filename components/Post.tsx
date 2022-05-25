import React, { useRef } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useState, useEffect } from "react";
import {
  Box,
  Center,
  Image,
  Heading,
  Text,
  useColorModeValue,
  Stack,
  Avatar,
  Icon,
  Input,
  Button,
  Divider,
  Flex,
  Spacer,
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  IconButton,
  usePopoverContext,
} from "@chakra-ui/react";
import { FaRegComment, FaRegHeart, FaHeart } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Moment from "react-moment";
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  where,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../hooks/firebase/firebase";

// function Post({ id, username, userImg, img, caption }: {id: string; username: string; userImg:string, img:string, caption:string}) {

function Post({
  id,
  username,
  profileImg,
  postImg,
  caption,
  isForSale,
}: {
  id: string;
  username: string;
  profileImg: string;
  postImg: string;
  caption: string;
  isForSale: boolean;
}) {
  const { userDetails } = useAuth();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any>([]);
  const [likes, setLikes] = useState<any>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [hiddenComments, setHiddenComments] = useState(true);
  const [piece, setPiece] = useState<any>(null);

  //integrare popover pe butonul de cart
  interface PopoverTriggerProps {
    /**
     * The React child to use as the
     * trigger for the popover
     */
    children: React.ReactChild;
  }

  const PopoverTrigger: React.FC<
    React.PropsWithChildren<PopoverTriggerProps>
  > = (props) => {
    // enforce a single child
    const child: any = React.Children.only(props.children);
    const { getTriggerProps } = usePopoverContext();
    return React.cloneElement(child, getTriggerProps(child.props, child.ref));
  };

  const initialFocusRef = useRef<HTMLButtonElement>(null);

  //functie pt aducere piesa asociata
  useEffect(() => {
    const q = query(collection(db, "pieces"), where("postId", "==", id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setPiece({
          id: doc.id,
          artistName: doc.data().artistName,
          currency: doc.data().currency,
          isAvailable: doc.data().isAvailable,
          price: doc.data().price,
          title: doc.data().title,
          year: doc.data().year,
        });
      });
    });
    return () => {
      unsubscribe();
    };
  }, [db, id]);

  //parte de comentarii si like-uri
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "asc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  //ne luam like-urile din BD
  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );

  //verificam daca postarea are like de la user
  useEffect(
    () =>
      setHasLiked(
        likes.findIndex((like: any) => like.id === userDetails?.id) !== -1
      ),
    [likes]
  );

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", userDetails?.id));
    } else {
      await setDoc(doc(db, "posts", id, "likes", userDetails?.id), {
        username: userDetails?.username,
      });
    }
  };

  const sendComment = async (e: any) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: userDetails.username,
      userImage: userDetails.profile_img,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div>
      <Center py={6}>
        <Box
          role={"group"}
          p={6}
          maxW={"800px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"lg"}
          pos={"relative"}
          zIndex={1}
        >
          <Flex>
            <Stack direction={"row"} align={"left"} mb={5}>
              <Avatar
                size={"lg"}
                src={profileImg}
                css={{
                  border: "2px solid white",
                }}
              />
              <Center>
                <Text fontWeight={600} color={"black"} size="sm" mb={4}>
                  {username}
                </Text>
              </Center>
            </Stack>
            <Spacer />

            {isForSale && (
              <Popover
                initialFocusRef={initialFocusRef}
                placement="bottom"
                closeOnBlur={false}
              >
                <PopoverTrigger>
                  <IconButton
                    colorScheme="gray"
                    aria-label="Buy"
                    fontSize="25px"
                    icon={<FiShoppingCart />}
                    variant={"ghost"}
                  />
                  {/* <Icon as={FiShoppingCart} w={7} h={7} cursor="pointer"></Icon> */}
                </PopoverTrigger>
                <PopoverContent
                  color="white"
                  bg="gray.800"
                  borderColor="blue.800"
                >
                  <PopoverHeader pt={4} fontWeight="bold" border="0">
                    The piece is for sale
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Stack>
                      <Center>
                        <Box fontSize="lg">{piece?.title}</Box>
                      </Center>
                      <Box fontSize="md">{piece?.artistName}</Box>
                      <Box fontSize="md">{piece?.year}</Box>
                      <Stack direction={"row"}>
                        <Box fontSize="md">{piece?.price}</Box>
                        <Box fontSize="md">{piece?.currency}</Box>
                      </Stack>
                    </Stack>
                  </PopoverBody>
                  <PopoverFooter
                    border="0"
                    d="flex"
                    alignItems="center"
                    justifyContent="center"
                    pb={4}
                  >
                    <Center>
                      {piece?.isAvailable ? (
                        <Button
                          colorScheme="blue"
                          variant={"outline"}
                          width="100px"
                          ref={initialFocusRef}
                        >
                          Buy
                        </Button>
                      ) : (
                        <Box>The piece was sold</Box>
                      )}
                    </Center>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            )}
          </Flex>
          <Box
            rounded={"lg"}
            mt={-13}
            pos={"relative"}
            height={"400px"}
            _after={{
              transition: "all .3s ease",
              content: '""',
              w: "full",
              h: "full",
              pos: "absolute",
              top: 5,
              left: 0,
              backgroundImage: `url(${postImg})`,
              filter: "blur(15px)",
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: "blur(20px)",
              },
            }}
          >
            <Image
              rounded={"lg"}
              height={"full"}
              width={"full"}
              objectFit={"contain"}
              src={postImg}
            />
          </Box>
          <Stack pt={10} align={"left"}>
            <Stack direction={"row"}>
              {hasLiked ? (
                <Icon
                  as={FaHeart}
                  w={6}
                  h={6}
                  cursor="pointer"
                  fill={"red.500"}
                  onClick={likePost}
                ></Icon>
              ) : (
                <Icon
                  as={FaRegHeart}
                  w={6}
                  h={6}
                  cursor="pointer"
                  onClick={likePost}
                ></Icon>
              )}
              {likes.length > 0 && (
                <Text fontSize={"md"}>{likes.length} likes</Text>
              )}
              <Icon
                as={FaRegComment}
                w={6}
                h={6}
                cursor="pointer"
                onClick={() =>
                  hiddenComments
                    ? setHiddenComments(false)
                    : setHiddenComments(true)
                }
              ></Icon>
            </Stack>
            <Stack direction={"row"}>
              <Text fontSize={"lg"} fontFamily={"body"} fontWeight={"bold"}>
                {username}:
              </Text>
              <Text fontSize={"lg"} fontFamily={"body"}>
                {caption}
              </Text>
            </Stack>
            {!hiddenComments && (
              <>
                <Divider />
                <Stack direction={"column"} align={"left"}>
                  <Stack direction={"column"} align={"left"}>
                    {comments.length > 0 && (
                      <Box
                        overflowY="auto"
                        css={{
                          "&::-webkit-scrollbar": {
                            width: "4px",
                          },
                          "&::-webkit-scrollbar-track": {
                            width: "6px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "blue",
                            borderRadius: "24px",
                          },
                        }}
                      >
                        {comments.map((comment: any) => (
                          <div key={comment.id}>
                            <Stack direction={"row"}>
                              <Stack
                                direction={"row"}
                                justifyContent={"flex-end"}
                              >
                                <Avatar
                                  size={"sm"}
                                  src={comment.data().userImage}
                                  css={{
                                    border: "2px solid white",
                                  }}
                                />
                                <Text
                                  fontSize={"lg"}
                                  fontFamily={"body"}
                                  fontWeight={"bold"}
                                >
                                  {comment.data().username}
                                </Text>
                                <Text fontSize={"lg"} fontFamily={"body"}>
                                  {comment.data().comment}
                                </Text>
                              </Stack>
                              <Moment fromNow>
                                {comment.data().timestamp?.toDate()}
                              </Moment>
                            </Stack>
                          </div>
                        ))}
                      </Box>
                    )}
                  </Stack>
                  <Stack direction={"row"}>
                    <Input
                      type={"text"}
                      value={comment}
                      placeholder="Add a comment..."
                      size="md"
                      onChange={(e: any) => setComment(e.target.value)}
                    />
                    <Button
                      type="submit"
                      disabled={!comment.trim()}
                      onClick={sendComment}
                    >
                      Post
                    </Button>
                  </Stack>
                </Stack>
              </>
            )}
          </Stack>
        </Box>
      </Center>
    </div>
  );
}

export default Post;
