import React, { useRef } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import {
  Box,
  useColorModeValue,
  Avatar,
  Heading,
  Stack,
  Badge,
  Button,
  Text,
  Link,
  Center,
} from "@chakra-ui/react";
// import Link from "next/link";

function UserExploreCard({
  id,
  username,
  profile_img,
  first_name,
  last_name,
  country,
  description,
  following,
  followers,
  tags,
  timestamp,
}: {
  id: string;
  username: string;
  profile_img: string;
  first_name: string;
  last_name: string;
  country: string;
  description: string;
  following: [];
  followers: [];
  tags: [];
  timestamp: Timestamp;
}) {
  return (
    <Box
      maxW={"320px"}
      w={"full"}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"2xl"}
      rounded={"lg"}
      p={6}
      textAlign={"center"}
    >
      <Avatar size={"xl"} src={profile_img} mb={4} pos={"relative"} />
      <Heading fontSize={"2xl"} fontFamily={"body"}>
        {first_name} {last_name}
      </Heading>
      <Text fontWeight={600} color={"gray.500"} mb={4}>
        @{username}
      </Text>
      <Text
        textAlign={"center"}
        color={useColorModeValue("gray.700", "gray.400")}
        px={3}
      >
        {description}
      </Text>

      <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
        <Badge
          px={2}
          py={1}
          bg={useColorModeValue("gray.50", "gray.800")}
          fontWeight={"400"}
        >
          {country}
        </Badge>
      </Stack>
      <Center>
        <Stack mt={2} direction={"row"} spacing={4}>
          <Stack direction={"row"}>
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>{followers?.length}</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                Followers
              </Text>
            </Stack>

            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>{following?.length}</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                Following
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Center>
    </Box>
  );
}

export default UserExploreCard;
