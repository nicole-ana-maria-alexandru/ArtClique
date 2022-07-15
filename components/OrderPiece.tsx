import {
  Badge,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { query, collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../hooks/firebase/firebase";

export default function OrderPiece(
    { id, artistName, currency, isAvailable, price, title, year, postId, piecePicture, type, height, width, depth, measurementUnit }: 
    { id: string;
    artistName: string;
    currency: string;
    isAvailable: string;
    price: string;
    title: string;
    year: string;
    postId: string;
    piecePicture: string;
    type: string;
    height: string;
    width: string;
    depth: string;
    measurementUnit: string;
    }) {

  return (
    <div>
      <Center py={0}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={{ sm: "100%", md: "800px" }}
          height={{ sm: "476px", md: "20rem" }}
          direction={{ base: "column", md: "row" }}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          padding={4}
        >
          <Flex flex={1}>
            <Image
              objectFit="cover"
              boxSize="100%"
              src={
                piecePicture
              }
            />
          </Flex>
          <Stack
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={1}
            pt={2}
          >
            <Heading fontSize={"2xl"} fontFamily={"body"}>
              {title}
            </Heading>
            <Text fontWeight={600} color={"gray.500"} size="sm" mb={4}>
              {artistName}
            </Text>
            <Text
              textAlign={"center"}
              color={useColorModeValue("gray.700", "gray.400")}
            >
                Status: {isAvailable ? 'Available' : 'Unavailable'}
            </Text>
            <Text>Year: {year}</Text>
            <Text>Type: {type}</Text>
            <Text>Height, Width, Depth: {height},{width},{depth} {measurementUnit}</Text>
            <Stack direction={'row'}>
                <Text>Price : {price} </Text>
                <Text>{currency}</Text>
            </Stack>
          </Stack>
        </Stack>
      </Center>
    </div>
  );
}
