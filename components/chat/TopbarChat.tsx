import React from "react";
import { Flex, Heading, Avatar, Stack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../hooks/firebase/firebase";

function TopbarChat({ username }: { username: any }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if(username){
      const q = query(collection(db, "users"), where("username", "==", username));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setFirstName(doc.data().first_name);
          setLastName(doc.data().last_name);
          setProfileImage(doc.data().profile_img);
        });
      });
    }
  }, [db, username]);

  return (
    <Flex bg="gray.100" h="81px" w="100%" align="center" p={5}>
      <Avatar src={profileImage} marginEnd={3} />
      <Stack>
        <Heading size="lg">
          {firstName} {lastName}
        </Heading>
        <Text size="lg">@{username}</Text>
      </Stack>
    </Flex>
  );
}

export default TopbarChat;
