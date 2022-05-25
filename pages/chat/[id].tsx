import { Flex, Text } from "@chakra-ui/layout"
import Head from "next/head"
import { useRouter } from "next/router"
import { collection, doc, orderBy, query } from "firebase/firestore"

import { useRef, useEffect } from "react";
import TopbarChat from "../../components/chat/TopbarChat";
import BottombarChat from "../../components/chat/BottombarChat";
import SidebarChat from "../../components/chat/SidebarChat";

import { useAuth } from "../../hooks/AuthContext";
import { useDocumentData, useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../../hooks/firebase/firebase";
import getOtherUsername from '../../utils/getOtherUsername';

export default function Chat() {
  const router = useRouter();
  const { id } = router.query;
  const bottomOfChat = useRef<HTMLInputElement>();
  const { userDetails } = useAuth();
  const [chat] = useDocumentData(doc(db, "chats", id as string));
  const q = query(collection(db, `chats/${id}/messages`), orderBy("timestamp"));
  const [messages] = useCollectionData(q);

  const getMessages = () =>
  messages?.map((msg : any) => {
    const sender = msg.sender === userDetails?.username;
    return (
      <Flex key={Math.random()} alignSelf={!sender ? "flex-start" : "flex-end"} bg={!sender ? "blue.100" : "green.100"} w="fit-content" minWidth="100px" borderRadius="lg" p={3} m={1}>
        <Text>{msg.text}</Text>
      </Flex>
    )
  })

// useEffect(() =>
//   setTimeout(() =>{
//     bottomOfChat.current?.scrollIntoView({
//     behavior: "smooth",
//     block: 'start',
//   })
//   }
//     , 100) as any
// , [messages])

  return (
    <Flex
      h="100vh"
    >
      <Head><title>Chat</title></Head>

      <SidebarChat/>

      <Flex flex={1} direction="column">
          <TopbarChat username={getOtherUsername(chat?.users, userDetails?.username)}/>

        <Flex flex={1} direction="column" pt={4} mx={5} overflowX="scroll" sx={{scrollbarWidth: "none"}}>
          {getMessages()}
          <div></div>
        </Flex>

        <BottombarChat id={id} username={userDetails?.username}/>
      </Flex>

    </Flex>

  )
}