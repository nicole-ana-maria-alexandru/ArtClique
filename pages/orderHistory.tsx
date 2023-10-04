import { NextPage } from "next/types";
import NavMenu from "../components/NavMenu";
import { useAuth } from "../hooks/AuthContext";
import { db } from "../hooks/firebase/firebase";
import UserExploreCard from "../components/UserExploreCard";
import router from "next/router";
import { useEffect, useState } from "react";
import { query, collection, where, getDocs, orderBy } from "firebase/firestore";
import {
  Box,
  Center,
  Heading,
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import OrderHistoryCard from "../components/OrderHistoryCard";

const OrderHistory: NextPage = () => {
  const { userDetails } = useAuth();
  const [placedOrders, setPlacedOrders] = useState<any>([]);
  const [recievedOrders, setRecievedOrders] = useState<any>([]);
  const [tabIndex, setTabIndex] = useState<any>(0);

  useEffect(() => {
    if (userDetails) {
      (async function getPlacedOrders() {
        const results: any[] = [];
        const q = query(
          collection(db, "orders"),
          where("sender", "==", userDetails.id),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            status: doc.data().status,
            country: doc.data().country,
            paymentMethod: doc.data().paymentMethod,
            totalCost: doc.data().totalCost,
            timestamp: doc.data().timestamp,
          });
        });
        setPlacedOrders(results);
      })();
    }
  }, [userDetails?.id]);

  useEffect(() => {
    if (userDetails) {
      (async function getRecievedOrders() {
        const results: any[] = [];
        const q = query(
          collection(db, "orders"),
          where("reciever", "==", userDetails.id),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          results.push({
            id: doc.id,
            status: doc.data().status,
            country: doc.data().country,
            paymentMethod: doc.data().paymentMethod,
            totalCost: doc.data().totalCost,
            timestamp: doc.data().timestamp,
          });
        });
        setRecievedOrders(results);
      })();
    }
  }, [userDetails?.id]);

  return (
    <NavMenu>
      <Box>
        <Tabs
          isFitted
          variant="soft-rounded"
          onChange={(index: any) => setTabIndex(index)}
          cursor={"pointer"}
        >
          <TabList mb="1em">
            <Tab
              _selected={{ color: "gray.100", bg: "blue.500" }}
              bg={"blue.200"}
              color={"gray.500"}
            >
              Placed Orders
            </Tab>
            <Tab
              _selected={{ color: "gray.100", bg: "purple.500" }}
              bg={"purple.200"}
              color={"gray.500"}
            >
              Recieved Orders
            </Tab>
          </TabList>
        </Tabs>

        {tabIndex === 0 && (
          <>
            {placedOrders.map((order: any) => (
              <Box key={order.id}>
                <OrderHistoryCard
                  key={order.id}
                  id={order.id}
                  status={order.status}
                  country={order.country}
                  paymentMethod={order.paymentMethod}
                  totalCost={order.totalCost}
                  timestamp={order.timestamp}
                ></OrderHistoryCard>
              </Box>
            ))}
          </>
        )}

        {tabIndex === 1 && (
          <>
            {recievedOrders.map((order: any) => (
              <Box key={order.id}>
                <OrderHistoryCard
                  key={order.id}
                  id={order.id}
                  status={order.status}
                  country={order.country}
                  paymentMethod={order.paymentMethod}
                  totalCost={order.totalCost}
                  timestamp={order.timestamp}
                ></OrderHistoryCard>
              </Box>
            ))}
          </>
        )}
      </Box>
    </NavMenu>
  );
};

export default OrderHistory;
