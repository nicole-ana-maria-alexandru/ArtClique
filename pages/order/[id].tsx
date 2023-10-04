import router from "next/router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import NavMenu from "../../components/NavMenu";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../hooks/firebase/firebase";
import OrderPiece from "../../components/OrderPiece";
import {
  Box,
  useColorModeValue,
  Heading,
  Stack,
  Button,
  Text,
  Center,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import moment from "moment";

export default function OrderRoute() {
  const { id } = router.query;
  const [order, setOrder] = useState<any>(null);
  const [piece, setPiece] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [diasbleCancelButton, setDiasbleCancelButton] = useState<any>(true);
  const { userDetails } = useAuth();
  const [openModalUpdateStatus, setOpenModalUpdateStatus] = useState(false);
  const updateStatusRef = useRef<HTMLSelectElement>(null);
  const [loading, setLoading] = useState(false);

  const handleModalUpdateStatusClose = () => {
    setOpenModalUpdateStatus(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "orders", id as string), (doc) => {
      setOrder({
        id: doc.id,
        pieceId: doc.data()?.pieceId,
        firstName: doc.data()?.firstName,
        lastName: doc.data()?.lastName,
        phoneNumber: doc.data()?.phoneNumber,
        country: doc.data()?.country,
        address: doc.data()?.address,
        zipCode: doc.data()?.zipCode,
        paymentMethod: doc.data()?.paymentMethod,
        totalCost: doc.data()?.totalCost,
        sender: doc.data()?.sender,
        reciever: doc.data()?.reciever,
        status: doc.data()?.status,
        checkoutSessionId: doc.data()?.checkoutSessionId,
        paymentStatus: doc.data()?.paymentStatus,
        timestamp: doc.data()?.timestamp,
      });
      if (
        doc.data()?.status === "processing" ||
        doc.data()?.status === "paid online"
      )
        setDiasbleCancelButton(false);
    });

    return () => {
      unsubscribe();
    };
  }, [db, id]);

  useEffect(() => {
    if (order) {
      const unsubscribe = onSnapshot(
        doc(db, "pieces", order.pieceId),
        (doc) => {
          setPiece({
            id: doc.id,
            artistName: doc.data()?.artistName,
            currency: doc.data()?.currency,
            isAvailable: doc.data()?.isAvailable,
            price: doc.data()?.price,
            title: doc.data()?.title,
            year: doc.data()?.year,
            type: doc.data()?.type,
            height: doc.data()?.height,
            width: doc.data()?.width,
            depth: doc.data()?.depth,
            ownerId: doc.data()?.ownerId,
            measurementUnit: doc.data()?.measurementUnit,
            postId: doc.data()?.postId,
            image: doc.data()?.image,
          });
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [db, id, order]);

  useEffect(() => {
    if (order) {
      const unsubscribe = onSnapshot(
        doc(db, "users", order.reciever),
        (doc) => {
          setSeller({
            id: doc.id,
            first_name: doc.data()?.first_name,
            last_name: doc.data()?.last_name,
            username: doc.data()?.username,
            profile_img: doc.data()?.profile_img,
            country: doc.data()?.country,
          });
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [db, id, order]);

  const cancelOrder = async () => {
    if (order) {
      await updateDoc(doc(db, "orders", order.id), {
        status: "cancelled",
      });
    }
  };

  const updateStatus = async () => {
    setLoading(true);
    if (order) {
      await updateDoc(doc(db, "orders", order.id), {
        status: updateStatusRef.current?.value,
      });
    }
    setLoading(false);
    setOpenModalUpdateStatus(false);
  };

  return (
    <NavMenu>
      {order && piece && seller && (
        <>
          <Heading
            fontWeight={"extrabold"}
            mb={2}
            textAlign={"center"}
            color={"blue.500"}
            fontFamily={"body"}
          >
            Ordered piece
          </Heading>
          <OrderPiece
            id={id as string}
            artistName={piece.artistName}
            currency={piece.currency}
            isAvailable={piece.isAvailable}
            price={piece.price}
            title={piece.title}
            year={piece.year}
            postId={piece.postId}
            type={piece.type}
            height={piece.height}
            width={piece.width}
            depth={piece.depth}
            measurementUnit={piece.measurementUnit}
            piecePicture={piece.image}
          ></OrderPiece>
          <Heading
            fontWeight={"extrabold"}
            mb={2}
            textAlign={"center"}
            color={"purple.500"}
            mt={8}
            fontFamily={"body"}
          >
            Order details
          </Heading>

          <div>
            <Center py={2}>
              <Stack
                borderWidth="1px"
                borderRadius="lg"
                w={{ sm: "100%", md: "800px" }}
                bg={"white"}
                boxShadow={"2xl"}
                padding={4}
              >
                <Box padding={4} borderWidth="1px" borderRadius="lg">
                  <Heading
                    fontSize={"xl"}
                    mb={2}
                    color={"purple.500"}
                    fontFamily={"body"}
                  >
                    Status
                  </Heading>
                  <Text fontWeight={"extrabold"} fontSize={"lg"}>
                    Status: {order.status}
                  </Text>
                  <Text>
                    Created at:{" "}
                    {moment(order.timestamp.toDate()).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </Text>
                  {order?.reciever === userDetails?.id &&
                    order?.status !== "delivered" && (
                      <Button mt={2} width={"100%"} colorScheme={"purple"} onClick={() => setOpenModalUpdateStatus(true)}>
                        Update status
                      </Button>
                    )}
                </Box>
                <Box padding={4} borderWidth="1px" borderRadius="lg">
                  <Heading
                    fontSize={"xl"}
                    mb={2}
                    color={"purple.500"}
                    fontFamily={"body"}
                  >
                    Seller
                  </Heading>
                  <Text>
                    Name: {seller.first_name} {seller.last_name}
                  </Text>
                  <Text>Username: {seller.username}</Text>
                  <Text>Country: {seller.country}</Text>
                  <Button
                    colorScheme="purple"
                    variant="link"
                    onClick={() => router.push(`/profile/${seller.id}`)}
                  >
                    Go to seller profile
                  </Button>
                </Box>
                <Box padding={4} borderWidth="1px" borderRadius="lg">
                  <Heading
                    fontSize={"xl"}
                    mb={2}
                    color={"purple.500"}
                    fontFamily={"body"}
                  >
                    Placed by
                  </Heading>
                  <Text>
                    Name: {order.firstName} {order.lastName}
                  </Text>
                  <Text>Phone Number: {order.phoneNumber}</Text>
                </Box>
                <Box padding={4} borderWidth="1px" borderRadius="lg">
                  <Heading
                    fontSize={"xl"}
                    mb={2}
                    color={"purple.500"}
                    fontFamily={"body"}
                  >
                    Shipping
                  </Heading>
                  <Text>Country: {order.country}</Text>
                  <Text>Address: {order.address}</Text>
                  <Text>Zip Code: {order.zipCode}</Text>
                </Box>
                <Box padding={4} borderWidth="1px" borderRadius="lg">
                  <Heading
                    fontSize={"xl"}
                    mb={2}
                    color={"purple.500"}
                    fontFamily={"body"}
                  >
                    Payment
                  </Heading>
                  <Text>Payment Method: {order.paymentMethod}</Text>
                  <Text>Total Cost: {order.totalCost} EUR</Text>
                  {order.checkoutSessionId !== "" && (
                    <Text>Stripe Payment Status: {order.paymentStatus}</Text>
                  )}
                </Box>
                {order?.sender === userDetails?.id && (
                  <>
                    {diasbleCancelButton ? (
                      <Button disabled={diasbleCancelButton}>
                        Order cannot be cancelled
                      </Button>
                    ) : (
                      <Button onClick={cancelOrder}>Cancel Order</Button>
                    )}
                  </>
                )}
              </Stack>
            </Center>
          </div>

          <Modal isOpen={openModalUpdateStatus} onClose={handleModalUpdateStatusClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Update order status</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  
                <FormControl>
                        <FormLabel htmlFor="status">Status</FormLabel>
                        <Select
                          id="status"
                          placeholder="Select a status"
                          ref={updateStatusRef}
                        >
                          <option>accepted</option>
                          <option>rejected</option>
                          <option>preparing</option>
                          <option>sent</option>
                          <option>delivered</option>
                        </Select>
                      </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="purple"
                    mr={3}
                    onClick={updateStatus}
                  >
                    {loading ? "Updating..." : "Update status"}
                  </Button>
                  <Button onClick={handleModalUpdateStatusClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
        </>
      )}
    </NavMenu>
  );
}
