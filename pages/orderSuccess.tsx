import { NextPage } from "next/types";
import NavMenu from "../components/NavMenu";
import { useAuth } from "../hooks/AuthContext";
import { db } from "../hooks/firebase/firebase";
import UserExploreCard from "../components/UserExploreCard";
import router from "next/router";
import { useEffect, useState } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { Box, Center, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

const OrderSuccess: NextPage = () => {
  const { userDetails } = useAuth();

  return (
  <NavMenu>
    <Box textAlign="center" py={10} px={6}>
      <CheckCircleIcon boxSize={'50px'} color={'green.500'} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Order placed
      </Heading>
      <Text color={"gray.500"}>Your order has been placed.</Text>
      <Text color={'gray.500'}>
        An email has been sent to the provided address regarding the order details!
      </Text>
      <Text color={'gray.500'}>
        Please check the order history to see the progress of your order.
      </Text>
    </Box>
  </NavMenu>
  );
};

export default OrderSuccess;