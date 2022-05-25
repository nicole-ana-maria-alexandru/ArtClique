import { ArrowLeftIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import React, { useRef, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { db } from "../../hooks/firebase/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, addDoc } from "@firebase/firestore";
import { useRouter } from "next/router";
import getOtherUsername from "../../utils/getOtherUsername";
import { getDocs, onSnapshot, query, where } from "firebase/firestore";
import TopbarChat from "./TopbarChat";
import RecipientsCard from "./RecipientsCard";

function SidebarChat() {
  const { userDetails } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const recipientUsernameRef = useRef<HTMLInputElement>(null);
  const [snapshot, loading, error] = useCollection(collection(db, "chats"));
  const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const router = useRouter();

  //functie pt modala
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const redirect = (id: any) => {
    router.push(`/chat/${id}`);
  };

  const getOtherProfilePicture = async (username: any) => {
    var returnedProfileImg;

    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      returnedProfileImg = doc.data().profile_img;
    });
    return returnedProfileImg;
  };

  const chatExists = (username: any) =>
    chats?.find(
      (chat: any) =>
        chat.users.includes(userDetails?.username) &&
        chat.users.includes(username)
    );

  const newChat = async () => {
    if (loadingModal) return;

    setLoadingModal(true);

    if (
      !chatExists(recipientUsernameRef.current?.value) &&
      recipientUsernameRef.current?.value != userDetails?.username
    ) {
      const docRef = await addDoc(collection(db, "chats"), {
        users: [userDetails?.username, recipientUsernameRef.current?.value],
      });
      redirect(docRef.id);
    }
  };

  const chatList = () => {
    return chats
      ?.filter((chat: any) => chat.users.includes(userDetails?.username))
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
            username={getOtherUsername(chat.users, userDetails?.username)}
          ></RecipientsCard>
        </div>
      ));
  };

  return (
    <Flex
      // bg="blue.100"
      h="100%"
      w="300px"
      borderEnd="1px solid"
      borderColor="gray.200"
      direction="column"
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
          <Avatar src={userDetails?.profile_img} marginEnd={3} />
          <Stack>
            <Text>
              {userDetails?.first_name} {userDetails?.last_name}
            </Text>
            <Text>@{userDetails?.username}</Text>
          </Stack>
        </Flex>
      </Flex>

      <Button m={5} p={4} onClick={() => setOpenModal(true)}>
        New Chat
      </Button>

      <Flex
        overflowX="scroll"
        direction="column"
        sx={{ scrollbarWidth: "none" }}
        flex={1}
      >
        {chatList()}
      </Flex>

      {/* aici o sa vina modala */}
      <Modal isOpen={openModal} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start a new chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Chat Recipient Username</FormLabel>
              <Input
                ref={recipientUsernameRef}
                placeholder="Chat Recipient Username"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => newChat()}>
              {loadingModal ? "Searching..." : "Search"}
            </Button>
            <Button onClick={handleModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default SidebarChat;
