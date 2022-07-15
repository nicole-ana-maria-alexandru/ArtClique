import { PhoneIcon } from "@chakra-ui/icons";
import {
  Center,
  Stack,
  Text,
  useColorModeValue,
  Heading,
  FormControl,
  Box,
  FormLabel,
  HStack,
  Input,
  Spacer,
  InputGroup,
  InputLeftElement,
  Button,
  Select,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import {
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import NavMenu from "../../components/NavMenu";
import OrderPiece from "../../components/OrderPiece";
import { db, functions } from "../../hooks/firebase/firebase";
import { countryList } from "../../utils/countryNames";
import { httpsCallable } from "firebase/functions";
import Script from "next/script";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import Head from "next/head";
import { useAuth } from "../../hooks/AuthContext";

export default function Profile() {
  const { id } = router.query;
  const { userDetails } = useAuth();
  const [piece, setPiece] = useState<any>(null);
  const [piecePicture, setPiecePicture] = useState<any>("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const countryRef = useRef<HTMLSelectElement>(null);
  const [country, setCountry] = useState<any>("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("delivery");
  const [shippingCost, setShippingCost] = useState(15);
  const [totalCost, setTotalCost] = useState(0);
  const [orderId, setOrderId] = useState("");
  const createStripeCheckout = httpsCallable(functions, "createStripeCheckout");
  const routerNext = useRouter();
  const stripePromise = loadStripe(
    "pk_test_51LKmmNHIUhBCGYQetmbmVy80jXiqInR1CGTztsYnxWBiA6EkYCpBTs7aJm57rdCxgRw7ULJhX7trkeu6TOvL8BbE00FhKtemlj"
  );
  // const stripe = await stripePromise;
  var stripe: any;

  useEffect(() => {
    //@ts-ignore
    stripe = window.Stripe(
      "pk_test_51LKmmNHIUhBCGYQetmbmVy80jXiqInR1CGTztsYnxWBiA6EkYCpBTs7aJm57rdCxgRw7ULJhX7trkeu6TOvL8BbE00FhKtemlj"
    );
  });

  //functie pt aducere piesa asociata
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "pieces", id as string), (doc) => {
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
      });
      setTotalCost(Number(doc.data()?.price) + shippingCost);
    });
    return () => {
      unsubscribe();
    };
  }, [db, id]);

  useEffect(() => {
    (async function getPicture() {
      if (piece) {
        const docPost = await getDoc(doc(db, "posts", piece?.postId));
        if (docPost.exists()) {
          setPiecePicture(docPost.data().image);
        }
      }
    })();
  }, [piece]);

  const handleOnClick = async () => {
    setIsLoading(true);

    const docRef = await addDoc(collection(db, "orders"), {
      pieceId: piece?.id,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      country: country,
      address: address,
      zipCode: zipCode,
      paymentMethod: paymentMethod,
      totalCost: totalCost,
      sender: userDetails.id,
      reciever: piece?.ownerId,
      status: "processing",
      timestamp: serverTimestamp(),
    });

    setOrderId(docRef.id);
    await updateDoc(docRef, {
      id: docRef.id,
    });

    if (paymentMethod === "delivery"){
      await updateDoc(doc(db, "pieces", piece?.id), {
        isAvailable: false,
      });
      routerNext.push("/orderSuccess");
    }


    var myData = {
      pieceId: piece.id,
      pieceTitle: piece.title,
      totalPrice: totalCost,
      pieceImage: piecePicture,
      orderId: docRef.id,
    };

    console.log(myData);

    if (paymentMethod === "card")
      createStripeCheckout(myData)
        .then((response) => {
          setIsLoading(true);
          //@ts-ignore
          const id = response.data.id;
          if (stripe) stripe.redirectToCheckout({ sessionId: id });
          // stripe.redirectToCheckout({ sessionId: session.id });
        })
        .catch((error) => {
          const code = error.code;
          const message = error.message;
          const details = error.details;
          console.log(code);
          console.log(message);
          console.log(details);
        })
        .finally(() => {setIsLoading(false);});

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <script src="https://js.stripe.com/v3/"></script>
      </Head>

      <NavMenu>
        {piece && piecePicture && (
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
            piecePicture={piecePicture}
          ></OrderPiece>
        )}

        <div>
          <Center py={6}>
            <Stack
              borderWidth="1px"
              borderRadius="lg"
              w={{ sm: "100%", md: "800px" }}
              // height={{ sm: "476px", md: "20rem" }}
              // direction={{ base: "column", md: "row" }}
              bg={useColorModeValue("white", "gray.900")}
              boxShadow={"2xl"}
              padding={4}
            >
              <Heading size={"md"}>Recipient Details</Heading>
              <HStack pt={2}>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e: any) => setFirstName(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName" isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e: any) => setLastName(e.target.value)}
                    />
                  </FormControl>
                </Box>
              </HStack>

              <Box>
                <FormControl id="phoneNumber" isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<PhoneIcon color="gray.300" />}
                    />
                    <Input
                      type="number"
                      placeholder="Phone number"
                      value={phoneNumber}
                      onChange={(e: any) => setPhoneNumber(e.target.value)}
                      onWheel={(e: any) => e.target.blur()}
                    />
                  </InputGroup>
                </FormControl>
              </Box>

              <Heading size={"md"} pt={4}>
                Shipping Details
              </Heading>
              <FormControl>
                <FormLabel htmlFor="country">Country</FormLabel>
                <Select
                  id="country"
                  placeholder="Select country"
                  ref={countryRef}
                  value={country}
                  onChange={() => {
                    setCountry(countryRef.current?.value);
                  }}
                >
                  {countryList.map((country: any) => (
                    <option key={country}>{country}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl id="address" isRequired>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  value={address}
                  onChange={(e: any) => setAddress(e.target.value)}
                />
              </FormControl>

              <FormControl id="zipCode" isRequired>
                <FormLabel>Zip Code</FormLabel>
                <Input
                  type="number"
                  value={zipCode}
                  onChange={(e: any) => setZipCode(e.target.value)}
                  onWheel={(e: any) => e.target.blur()}
                />
              </FormControl>

              <Heading size={"sm"} pt={4}>
                Total Shipping cost: {shippingCost} {piece?.currency}
              </Heading>

              <Heading size={"md"} pt={4}>
                Payment
              </Heading>

              <FormControl as="fieldset">
                <FormLabel as="legend">Select payment option</FormLabel>
                <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                  <HStack spacing="24px">
                    <Radio value="delivery">Pay on delivery</Radio>
                    <Radio value="card">Pay with card online</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>

              <Heading size={"md"} pt={4}>
                Total Cost: {totalCost} {piece?.currency}
              </Heading>

              <Button
                loadingText="Loading..."
                size="lg"
                bgGradient="linear(to-r, blue.500, purple.500)"
                color={"white"}
                disabled={!piece?.isAvailable}
                _hover={{
                  bgGradient: "linear(to-r, blue.400, purple.400)",
                  shadow: "white_btn",
                }}
                isLoading={isLoading}
                onClick={handleOnClick}
              >
                {piece?.isAvailable
                  ? "Place Order"
                  : "This piece is no longer available"}
              </Button>
            </Stack>
          </Center>
          {/* <Elements stripe={stripePromise}>
        <PaymentElement />
      <button>Submit</button>
    </Elements> */}
        </div>
      </NavMenu>
    </>
  );
}
