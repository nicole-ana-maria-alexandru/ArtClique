import { Flex, Text } from "@chakra-ui/layout";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  arrayUnion,
  collection,
  doc,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { useRef, useEffect } from "react";
import TopbarChat from "../../components/chat/TopbarChat";
import BottombarChat from "../../components/chat/BottombarChat";
import SidebarChat from "../../components/chat/SidebarChat";

import { useAuth } from "../../hooks/AuthContext";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { db } from "../../hooks/firebase/firebase";
import getOtherUsername from "../../utils/getOtherUsername";
import getOtherUserId from "../../utils/getOtherUserId";
import { Box, Button, Center, Heading, HStack, VStack } from "@chakra-ui/react";
import Moment from "react-moment";
import moment from "moment";

export default function Chat() {
  const router = useRouter();
  const { id } = router.query;
  const bottomOfChat = useRef<HTMLInputElement>();
  const { userDetails } = useAuth();
  const [chat] = useDocumentData(doc(db, "chats", id as string));
  const q = query(collection(db, `chats/${id}/messages`), orderBy("timestamp"));
  const [messages] = useCollectionData(q);

  const getMessages = () =>
    messages?.map((msg: any) => {
      const sender = msg.sender === userDetails?.id;
      return (
        <Flex
          key={Math.random()}
          alignSelf={!sender ? "flex-start" : "flex-end"}
          bg={!sender ? "blue.100" : "purple.100"}
          w="fit-content"
          minWidth="100px"
          borderRadius="lg"
          p={3}
          m={1}
        >
          <VStack>
            <Text>{msg.text}</Text>
            <Text fontSize={"xs"} textAlign={"right"}>
              {/* {moment(msg.timestamp.toDate()).fromNow()} */}
            </Text>
          </VStack>
        </Flex>
      );
    });

  // useEffect(() =>
  //   setTimeout(() =>{
  //     bottomOfChat.current?.scrollIntoView({
  //     behavior: "smooth",
  //     block: 'start',
  //   })
  //   }
  //     , 100) as any
  // , [messages])

  const acceptInvitation = async () => {
    const chatRef = doc(db, "chats", id as string);
    await updateDoc(chatRef, {
      inviteStatus: "accepted",
    });
  };

  const rejectInvitation = async () => {
    const chatRef = doc(db, "chats", id as string);
    await updateDoc(chatRef, {
      inviteStatus: "rejected",
      deletedBy: arrayUnion(userDetails?.id),
    });
    router.push(`/messaging`);
  };

  return (
    <Flex h="100vh">
      <Head>
        <title>Chat</title>
      </Head>

      <SidebarChat />

      <Flex flex={1} direction="column" bg={"gray.100"}>
        <TopbarChat userId={getOtherUserId(chat?.users, userDetails?.id)} />

        <Flex
          flex={1}
          direction="column"
          pt={4}
          mx={5}
          // overflowX="scroll"
          // sx={{ scrollbarWidth: "none" }}
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
          {getMessages()}
          <div></div>
        </Flex>

        {chat?.inviteSender === userDetails?.id ? (
          <>
            {chat?.inviteStatus === "sent" && (
              <Center>
                <Heading>The invitation has been sent</Heading>
              </Center>
            )}
            {chat?.inviteStatus === "rejected" && (
              <Center>
                <Heading pb={10}>The invitation has been rejected</Heading>
              </Center>
            )}
          </>
        ) : (
          <Center>
            <Box>
              <Heading>Accept the invitation?</Heading>
              <Center>
                <HStack>
                  <Button colorScheme={"blue"} onClick={rejectInvitation}>
                    No
                  </Button>
                  <Button colorScheme={"purple"} onClick={acceptInvitation}>
                    Yes
                  </Button>
                </HStack>
              </Center>
            </Box>
          </Center>
        )}

        {chat?.inviteStatus !== "rejected" && (
          <BottombarChat id={id} userId={userDetails?.id} />
        )}
      </Flex>
    </Flex>
  );
}
