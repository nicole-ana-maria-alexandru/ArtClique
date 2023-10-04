import React from "react";
import { Timestamp } from "firebase/firestore";
import {
  Box,
  useColorModeValue,
  Heading,
  Button,
  Text,
  Center,
  HStack,
} from "@chakra-ui/react";
import router from "next/router";
import moment from "moment";

function OrderHistoryCard({
  id,
  status,
  paymentMethod,
  totalCost,
  country,
  timestamp,
}: {
  id: string;
  status: string;
  paymentMethod: string;
  totalCost: string;
  country: string;
  timestamp: Timestamp;
}) {
  return (
    <Box
      w={"full"}
      bg={useColorModeValue("white", "gray.900")}
      boxShadow={"2xl"}
      rounded={"lg"}
      p={6}
      textAlign={"left"}
      mb={4}
    >
      <Heading fontSize={"2xl"} fontFamily={"body"} textAlign={"center"}>
        #{id}
      </Heading>
      <HStack justify={"space-between"}>
        <Box>
          <Text fontWeight={'bold'}>Status: {status}</Text>
          <Text>Country: {country}</Text>
          <Text fontWeight={'semibold'} color={'gray.600'}>{moment(timestamp?.toDate()).format('MMMM Do YYYY, h:mm:ss a')}</Text>
        </Box>
        <Box>
          <Text>Payment Method: {paymentMethod}</Text>
          <Text fontWeight={'bold'}>Total Cost: {totalCost} EUR</Text>
        </Box>
      </HStack>
      <Center>
        <Button
          variant="link"
          fontWeight={"extrabold"}
          fontSize={"lg"}
          bgGradient="linear(to-r, blue.500, purple.500)"
          bgClip="text"
          onClick={() => router.push(`/order/${id}`)}
        >
          See full order details
        </Button>
      </Center>
    </Box>
  );
}

export default OrderHistoryCard;
