import React from "react";
import {
  Flex,
  Heading,
  Avatar,
  Stack,
  Text,
  Spacer,
  Divider,
} from "@chakra-ui/react";
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

function RecipientsCard({ userId }: { userId: any }) {
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
    <div>
      <Flex h="81px" w="100%" align="center" p={5} cursor={"pointer"}>
        <Avatar src={profileImage} marginEnd={3} />
        <Stack>
          <Heading size="sm">
            {firstName} {lastName}
          </Heading>
          <Text size="md">@{username}</Text>
        </Stack>
      </Flex>
      <Divider />
    </div>
  );
}

export default RecipientsCard;
