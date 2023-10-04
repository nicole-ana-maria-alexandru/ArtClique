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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  HStack,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  AlertDialogOverlay,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Switch,
} from "@chakra-ui/react";
import { FaRegComment, FaRegHeart, FaHeart } from "react-icons/fa";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
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
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../hooks/firebase/firebase";
import router from "next/router";
import { HamburgerIcon, AddIcon, RepeatIcon, EditIcon } from "@chakra-ui/icons";

// function Post({ id, username, userImg, img, caption }: {id: string; username: string; userImg:string, img:string, caption:string}) {

function Post({
  id,
  username,
  profileImg,
  postImg,
  caption,
  isForSale,
  userId,
  timestamp,
}: {
  id: string;
  username: string;
  profileImg: string;
  postImg: string;
  caption: string;
  isForSale: boolean;
  userId: string;
  timestamp: Timestamp;
}) {
  const { userDetails } = useAuth();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any>([]);
  const [likes, setLikes] = useState<any>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [hiddenComments, setHiddenComments] = useState(true);
  const [piece, setPiece] = useState<any>(null);
  const [openModalEditTags, setOpenModalEditTags] = useState(false);
  const [openModalEditAvailability, setOpenModalEditAvailability] = useState(false);
  const [openAlertDialogDelete, setOpenAlertDialogDelete] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availability, setAvailability] = useState(false);
  const cancelDeleteRef = useRef<any>(null);
  const switchAvailabilityRef = useRef<any>(null);
  var cbResults: any[] = [];

  const styleValues = [
    "Contemporary",
    "Street Art",
    "Pop Art",
    "Realism",
    "Abstract",
    "Modernism",
    "Expressionism",
    "Impressionism",
    "Post-war",
    "Old Masters",
  ];
  const subjectValues = [
    "Portrait",
    "Landscape",
    "Animals",
    "Birds",
    "History",
    "Animation",
    "Graffiti",
    "Sport",
    "Celebrities",
    "Still life",
  ];

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

  const handleModalEditTagsClose = () => {
    setOpenModalEditTags(false);
  };

  const handleModalEditAvailabilityClose = () => {
    setOpenModalEditAvailability(false);
  };

  const handleAlertDialogDeleteClose = () => {
    setOpenAlertDialogDelete(false);
  };

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
          type: doc.data().type,
          height: doc.data().height,
          width: doc.data().width,
          depth: doc.data().depth,
          image: doc.data().image,
          tags: doc.data().tags,
          measurementUnit: doc.data().measurementUnit,
        });
        setAvailability(doc.data().isAvailable);
      });
    });
    cbResults = piece?.tags;
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

  const redirect = (id: any) => {
    if (userDetails?.id == id) {
      router.push(`/yourProfile`);
    } else router.push(`/profile/${id}`);
  };

  const handleCbTagsOnChange = (e: any, value: any) => {
    e.preventDefault();
    if (e.target.checked) cbResults.push(value);
    else {
      if (cbResults.indexOf(value) > -1) {
        cbResults.splice(cbResults.indexOf(value), 1);
      }
    }
  };

  const updateTags = async () => {
    if (loadingTags) return;

    setLoadingTags(true);
    await updateDoc(doc(db, "pieces", piece?.id), {
      tags: cbResults,
    });

    setOpenModalEditTags(false);
    setLoadingTags(false);
  };

  const updateAvailability = async () => {
    if (loadingAvailability) return;
    if (availability === piece?.isAvailable){
      setOpenModalEditAvailability(false);
      return;
    }
    setLoadingAvailability(true);
    await updateDoc(doc(db, "pieces", piece?.id), {
      isAvailable: switchAvailabilityRef.current?.checked,
    });

    setOpenModalEditAvailability(false);
    setLoadingAvailability(false);
  };

  const deletePost = async () => {
    if (isForSale && piece) {
      await deleteDoc(doc(db, "pieces", piece.id));
      await deleteDoc(doc(db, "posts", id));
      handleAlertDialogDeleteClose();
    } else {
      await deleteDoc(doc(db, "posts", id));
      handleAlertDialogDeleteClose();
    }
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
                <Text
                  fontWeight={600}
                  color={"black"}
                  size="sm"
                  mb={4}
                  cursor={"pointer"}
                >
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
                  color="gray.100"
                  // bg="gray.900"
                  bgGradient="linear(to-b, #181820, #0b0b0f)"
                  borderColor="gray.900"
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
                      <HStack>
                        <Box fontSize="md">Name: </Box>
                        <Box fontSize="md">{piece?.artistName}</Box>
                      </HStack>
                      <HStack>
                        <Box fontSize="md">Year: </Box>
                        <Box fontSize="md">{piece?.year}</Box>
                      </HStack>
                      <HStack>
                        <Box fontSize="md">Type: </Box>
                        <Box fontSize="md">{piece?.type}</Box>
                      </HStack>
                      <HStack>
                        <Box fontSize="md">H,W,D: </Box>
                        <Box fontSize="md">
                          {piece?.height},{piece?.width},{piece?.depth}{" "}
                          {piece?.measurementUnit}
                        </Box>
                      </HStack>

                      <Stack direction={"row"}>
                        <Box fontSize="md">Price: </Box>
                        <Box fontSize="md">
                          {piece?.price} {piece?.currency}
                        </Box>
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
                      {userDetails?.id === userId ? (
                        <>
                          <Menu isLazy>
                            <MenuButton
                              aria-label="Options"
                              transition="all 0.2s"
                            >
                              Edit
                            </MenuButton>
                            <MenuList bgGradient="linear(to-b, #181820, #0b0b0f)">
                              <MenuItem
                                icon={<EditIcon />}
                                _focus={{
                                  bgGradient:
                                    "linear(to-r, blue.500, purple.500)",
                                }}
                                _hover={{
                                  bgGradient:
                                    "linear(to-r, blue.500, purple.500)",
                                }}
                                onClick={() =>
                                  setOpenModalEditAvailability(true)
                                }
                              >
                                Edit piece availability
                              </MenuItem>
                              <MenuItem
                                icon={<EditIcon />}
                                _focus={{
                                  bgGradient:
                                    "linear(to-r, blue.500, purple.500)",
                                }}
                                _hover={{
                                  bgGradient:
                                    "linear(to-r, blue.500, purple.500)",
                                }}
                                onClick={() => setOpenModalEditTags(true)}
                              >
                                Edit tags
                              </MenuItem>
                              {/* <MenuItem
                                icon={<ExternalLinkIcon />}
                                command="⌘N"
                              >
                                New Window
                              </MenuItem>
                              <MenuItem icon={<RepeatIcon />} command="⌘⇧N">
                                Open Closed Tab
                              </MenuItem>
                              <MenuItem icon={<EditIcon />} command="⌘O">
                                Open File...
                              </MenuItem> */}
                            </MenuList>
                          </Menu>
                        </>
                      ) : (
                        <>
                          {piece?.isAvailable ? (
                            <Button
                              bgGradient="linear(to-r, blue.500, purple.500)"
                              width="100px"
                              _hover={{
                                bgGradient:
                                  "linear(to-r, blue.400, purple.400)",
                                shadow: "white_btn",
                              }}
                              ref={initialFocusRef}
                              onClick={() =>
                                router.push(`/placeOrder/${piece?.id}`)
                              }
                            >
                              Buy
                            </Button>
                          ) : (
                            <Box>The piece is no longer available</Box>
                          )}
                        </>
                      )}
                    </Center>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            )}

            {userDetails?.id === userId && (
              <Menu isLazy>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="floating"
                />
                <MenuList>
                  <MenuItem
                    icon={<FiTrash2 />}
                    onClick={() => setOpenAlertDialogDelete(true)}
                  >
                    Delete post
                  </MenuItem>
                </MenuList>
              </Menu>
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
            <Moment fromNow>{timestamp?.toDate()}</Moment>
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
                            <Stack
                              direction={"row"}
                              justifyContent={"justify-end"}
                            >
                              <Flex>
                                <Stack
                                  direction={"row"}
                                  justifyContent={"space-between"}
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

                                <Spacer />

                                {/* <Moment fromNow>
                                {comment.data().timestamp?.toDate()}
                              </Moment> */}
                              </Flex>
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

        <Modal isOpen={openModalEditTags} onClose={handleModalEditTagsClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit your piece&apos;s tags</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl pb={6}>
                <FormLabel fontWeight={700} fontSize={"lg"}>
                  Subject
                </FormLabel>
                <Box overflowY={"scroll"} height={"150px"} pl={4}>
                  <CheckboxGroup
                    colorScheme="purple"
                    defaultValue={piece?.tags}
                  >
                    <Stack spacing={[1, 5]} direction={"column"}>
                      {subjectValues.map((value: any) => (
                        <Checkbox
                          key={value}
                          value={value}
                          onChange={(e: any) => handleCbTagsOnChange(e, value)}
                        >
                          {value}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel fontWeight={700} fontSize={"lg"}>
                  Style
                </FormLabel>
                <Box overflowY={"scroll"} height={"150px"} pl={4}>
                  <CheckboxGroup
                    colorScheme="purple"
                    defaultValue={piece?.tags}
                  >
                    <Stack spacing={[1, 5]} direction={"column"}>
                      {styleValues.map((value: any) => (
                        <Checkbox
                          key={value}
                          value={value}
                          onChange={(e: any) => handleCbTagsOnChange(e, value)}
                        >
                          {value}
                        </Checkbox>
                      ))}
                    </Stack>
                  </CheckboxGroup>
                </Box>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="purple" mr={3} onClick={updateTags}>
                {loadingTags ? "Saving..." : "Save changes"}
              </Button>
              <Button onClick={handleModalEditTagsClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={openModalEditAvailability}
          onClose={handleModalEditAvailabilityClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit piece availability</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={2}>
              <FormControl as={HStack}>
                <FormLabel fontWeight={700} fontSize={"lg"}>
                  Availability:
                </FormLabel>
                <Switch
                  id="availability"
                  ref={switchAvailabilityRef}
                  isChecked={availability}
                  onChange={() =>
                    availability ? setAvailability(false) : setAvailability(true)
                  }
                  size="lg"
                  colorScheme="purple"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="purple" mr={3} onClick={updateAvailability}>
                {loadingAvailability ? "Saving..." : "Save changes"}
              </Button>
              <Button onClick={handleModalEditAvailabilityClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <AlertDialog
          isOpen={openAlertDialogDelete}
          leastDestructiveRef={cancelDeleteRef}
          onClose={handleAlertDialogDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Post
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure? You can&apos;t undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  ref={cancelDeleteRef}
                  onClick={handleAlertDialogDeleteClose}
                >
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={deletePost} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Center>
    </div>
  );
}

export default Post;
