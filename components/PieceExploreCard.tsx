import {
  Center,
  Box,
  useColorModeValue,
  Stack,
  Heading,
  Image,
  Text,
  Tooltip,
  Link,
  Button,
} from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import router from "next/router";

function PieceExploreCard({
  id,
  artistName,
  postId,
  title,
  type,
  image,
  isAvailable,
  year,
  price,
  currency,
  height,
  width,
  depth,
  measurementUnit,
  tags,
  timestamp,
}: {
  id: string;
  artistName: string;
  postId: string;
  title: string;
  type: string;
  image: string;
  isAvailable: boolean;
  year: string;
  price: string;
  currency: string;
  height: string;
  width: string;
  depth: string;
  measurementUnit: string;
  tags: [];
  timestamp: Timestamp;
}) {
  return (
    <Center py={12}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${image})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Tooltip label="Go to post" bg="gray.300" color="black" fontWeight={'bold'}>
            <Image
              rounded={"lg"}
              height={230}
              width={282}
              objectFit={"cover"}
              src={image}
              cursor={"pointer"}
              onClick={() => router.push(`/post/${postId}`)}
            />
          </Tooltip>
        </Box>
        <Stack pt={10} align={"center"}>
          <Text color={"gray.500"} fontSize={"sm"} textTransform={"uppercase"}>
            {artistName}
          </Text>
          <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
            {title}
          </Heading>
          <Text fontWeight={500} fontSize={"lg"}>
            {type}
          </Text>
          <Text fontWeight={500} fontSize={"lg"}>
            {height}, {width}, {depth} {measurementUnit}
          </Text>
          <Text fontWeight={800} fontSize={"xl"}>
            {price} {currency}
          </Text>
          {isAvailable ? (
            <Button
              bgGradient="linear(to-r, blue.500, purple.500)"
              width="100px"
              color={"white"}
              _hover={{
                bgGradient: "linear(to-r, blue.400, purple.400)",
                shadow: "white_btn",
              }}
              onClick={() => router.push(`/placeOrder/${id}`)}
            >
              Buy
            </Button>
          ) : (
            <Text fontWeight={800} fontSize={"md"}>
              The piece is no longer available
            </Text>
          )}
        </Stack>
      </Box>
    </Center>
  );
}

export default PieceExploreCard;
