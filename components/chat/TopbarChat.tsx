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

function TopbarChat({ userId }: { userId: any }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (userId) {
      const q = query(collection(db, "users"), where("id", "==", userId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setFirstName(doc.data().first_name);
          setLastName(doc.data().last_name);
          setProfileImage(doc.data().profile_img);
          setUsername(doc.data().username);
        });
      });
    }
  }, [db, userId]);

  return (
    <Flex
      //bg="#0b0b0f"
      h="81px"
      w="100%"
      align="center"
      p={5}
      bgGradient="linear(to-r, #181820, #0b0b0f)"
      color={"gray.100"}
    >
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
