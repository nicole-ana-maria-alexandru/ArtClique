import { ArrowLeftIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Avatar,
  IconButton,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  HStack,
  Box,
  InputGroup,
  InputLeftElement,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { db } from "../../hooks/firebase/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, addDoc } from "@firebase/firestore";
import { useRouter } from "next/router";
import getOtherUsername from "../../utils/getOtherUsername";
import { getDocs, onSnapshot, query, where } from "firebase/firestore";
import TopbarChat from "./TopbarChat";
import RecipientsCard from "./RecipientsCard";
import { IoMdArrowRoundBack } from "react-icons/io";
import getOtherUserId from "../../utils/getOtherUserId";

function SidebarChat() {
  const { userDetails } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const recipientUsernameRef = useRef<HTMLInputElement>(null);
  const [snapshot, loading, error] = useCollection(collection(db, "chats"));
  const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const router = useRouter();
  const [result, setResult] = useState<any>([]);
  const [searched, setSearched] = useState<any>("");
  const [users, setUsers] = useState<any>([]);
  const [openAlertDialogChatExists, setOpenAlertDialogChatExists] = useState(false);
  const closeAlertDialogRef = useRef<any>();

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUsers(querySnapshot.docs);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //functie pt modala
  const handleModalClose = () => {
    setOpenModal(false);
  };

  //functie pt alert dialog chat exists
  const handleChatExistsClose = () => {
    setOpenAlertDialogChatExists(false);
  };

  const redirect = (id: any) => {
    router.push(`/chat/${id}`);
  };

  // const getOtherProfilePicture = async (username: any) => {
  //   var returnedProfileImg;

  //   const q = query(collection(db, "users"), where("username", "==", username));
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     returnedProfileImg = doc.data().profile_img;
  //   });
  //   return returnedProfileImg;
  // };

  const chatExists = (userId: any) =>
    chats?.find(
      (chat: any) =>
        chat.users.includes(userDetails?.id) && chat.users.includes(userId)
    );

  const newChat = async (userId: any) => {
    if (loadingModal) return;

    setLoadingModal(true);

    if (!chatExists(userId) && userId != userDetails?.id) {
      const docRef = await addDoc(collection(db, "chats"), {
        users: [userDetails?.id, userId],
        inviteSender: userDetails?.id,
        inviteStatus: "sent",
        deletedBy: [],
      });
      redirect(docRef.id);
      setOpenModal(false);
    } else {
      setOpenAlertDialogChatExists(true);
      setOpenModal(false);
    }
  };

  const chatList = () => {
    return chats
      ?.filter(
        (chat: any) =>
          chat.users.includes(userDetails?.id) &&
          !chat.deletedBy.includes(userDetails?.id)
      )
      .map((chat) => (
        // <Flex key={Math.random()} p={3} align="center" _hover={{bg: "gray.100", cursor: "pointer"}} onClick={() => redirect(chat.id)}>
        //   <Avatar src={""} marginEnd={3} />
        //  {/* @ts-ignore */}
        //   <Text>@{getOtherUsername(chat.users, userDetails?.username)}</Text>
        // </Flex>

        <div onClick={() => redirect(chat.id)}>
          <RecipientsCard
            key={chat.id}
            // @ts-ignore
            userId={getOtherUserId(chat.users, userDetails?.id)}
          ></RecipientsCard>
        </div>
      ));
  };

  const onChangeHandler = (text: string) => {
    setSearched(text);
    if (text.length > 0 && text.trim()) {
      setResult(
        users.filter((user: any) => String(user.data().username).includes(text))
      );
    } else {
      setResult([]);
    }
  };

  return (
    <Flex
      //bg="blue.100"
      bgGradient="linear(to-b, #181820, #0b0b0f)"
      h="100%"
      w="300px"
      borderEnd="1px solid"
      borderColor="gray.500"
      direction="column"
      color={"gray.100"}
    >
      <Flex
        // bg="red.100"
        h="81px"
        w="100%"
        align="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="gray.200"
        p={3}
      >
        <Flex align="center">
          <HStack>
            <IconButton
              variant="ghost"
              colorScheme="blue"
              aria-label="Back"
              fontSize="30px"
              icon={<IoMdArrowRoundBack />}
              onClick={() => router.back()}
            />

            <Avatar src={userDetails?.profile_img} marginEnd={3} />
            <Stack>
              <Text fontWeight={"bold"}>
                {userDetails?.first_name} {userDetails?.last_name}
              </Text>
              <Text>@{userDetails?.username}</Text>
            </Stack>
          </HStack>
        </Flex>
      </Flex>

      <Button m={5} p={4} onClick={() => setOpenModal(true)} color={"black"}>
        New Chat
      </Button>

      <Flex
        //overflowY="scroll"
        direction="column"
        //sx={{ scrollbarWidth: "none" }}
        flex={1}
        overflowY="scroll"
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "black",
            borderRadius: "24px",
          },
        }}
      >
        {chatList()}
      </Flex>

      {/* aici o sa vina modala */}
      {/* TODO DE SCHIMBAT MODALA CU SEARCH CARE RETURNEAZA ID UL UTLIZATORULUI GASIT*/}
      <Modal
        isOpen={openModal}
        onClose={handleModalClose}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start a new chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2}>
            {/* <FormControl>
              <FormLabel>Chat Recipient Username</FormLabel>
              <Input
                ref={recipientUsernameRef}
                placeholder="Chat Recipient Username"
              />
            </FormControl> */}
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon />}
              />
              <Input
                type="text"
                placeholder="Search users by username"
                onChange={(e: any) => onChangeHandler(e.target.value)}
                value={searched}
              />
            </InputGroup>

            <Box pt={2}>
              {result.map((user: any) => (
                <HStack
                  pb={5}
                  cursor={"pointer"}
                  onClick={() => newChat(user.id)}
                  key={user.id}
                >
                  <Avatar size={"sm"} src={user.data().profile_img} />
                  <VStack
                    display={{ base: "none", md: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">
                      {user.data().first_name} {user.data().last_name}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      @{user.data().username}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </Box>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} 
            // onClick={() => newChat()}
            >
              {loadingModal ? "Searching..." : "Search"}
            </Button> */}
            {/* <Button onClick={handleModalClose}>Cancel</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={openAlertDialogChatExists}
        leastDestructiveRef={closeAlertDialogRef}
        onClose={handleChatExistsClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              New Chat Warning
            </AlertDialogHeader>

            <AlertDialogBody>
              The chat already exists.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={closeAlertDialogRef} onClick={handleChatExistsClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}

export default SidebarChat;
