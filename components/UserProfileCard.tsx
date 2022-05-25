import React, { MutableRefObject } from "react";
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
  Avatar,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormLabel,
  Input,
  FormControl,
  Checkbox,
  Select,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../hooks/firebase/firebase";
import { useRef, useState } from "react";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import { UserDetails } from "../hooks/firebase/interfaces";

function UserProfileCard() {
  const { user, userDetails, artist, setUserDetails } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const descriptionRef = useRef<HTMLInputElement>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(
    null
  );

  // console.log("State modala deschisa: " + open);
  //tot da duplicate atom key

  //modala pentru add post
  const [openModalAddPost, setOpenModalAddPost] = useState(false);
  const filePickerAddPostRef = useRef<HTMLInputElement>(null);
  const [selectedFileAddPost, setSelectedFileAddPost] = useState<
    string | ArrayBuffer | null
  >(null);
  const captionRef = useRef<HTMLInputElement>(null);
  const [forSale, setForSale] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const currencyRef = useRef<HTMLSelectElement>(null);

  //functii pt editare profil
  const updateProfile = async () => {
    if (loading) return;

    setLoading(true);

    if (artist)
      await updateDoc(doc(db, "artists", artist.id), {
        description: descriptionRef.current?.value,
      });

    const imageRef = ref(storage, `users/${userDetails.id}/profile_img`);

    await uploadString(imageRef, selectedFile as string, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "users", userDetails.id), {
          profile_img: downloadURL,
        });
        // setUserDetails((oldDetails: UserDetails) => {
        //   return {...oldDetails, profile_img: downloadURL}
        // })
      }
    );

    //setOpen(false);
    setLoading(false);
    setSelectedFile(null);
  };

  const addImageToProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (!e.target.files) return;
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (!readerEvent.target) return;
      setSelectedFile(readerEvent.target.result);
    };
  };

  //functii pt modala de ADD POST
  const handleModalAddPostClose = () => {
    setOpenModalAddPost(false);
  };

  const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (!e.target.files) return;
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (!readerEvent.target) return;
      setSelectedFileAddPost(readerEvent.target.result);
    };
  };

  const uploadPost = async () => {
    if (loading) return;

    setLoading(true);

    if (userDetails.user_type === 'artist'){
      const docRef = await addDoc(collection(db, "posts"), {
        userId: userDetails.id,
        username: userDetails.username,
        isForSale: checkboxRef.current?.checked,
        caption: captionRef.current?.value,
        profileImg: userDetails.profile_img,
        timestamp: serverTimestamp(),
      });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFileAddPost as string, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
    );

    if(checkboxRef.current?.checked){
      const docRefAddPiece = await addDoc(collection(db, "pieces"), {
        postId: docRef.id,
        title: titleRef.current?.value,
        price: priceRef.current?.value,
        currency: currencyRef.current?.value,
        year: yearRef.current?.value,
        artistName: userDetails.first_name + " " + userDetails.last_name,
        isAvailable: true,
        timestamp: serverTimestamp(),
      });
    }

  }
    setOpenModalAddPost(false);
    setLoading(false);
    setSelectedFileAddPost(null);
  };

  return (
    <div>
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={{ sm: "100%", md: "75%" }}
          height={{ sm: "476px", md: "20rem" }}
          direction={{ base: "column", md: "row" }}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          padding={4}
        >
          <Flex flex={1} align={"center"} justify={"center"}>
            <Avatar
              size={"xl"}
              src={userDetails?.profile_img}
              css={{
                border: "2px solid white",
              }}
            />
          </Flex>
          <Stack
            direction={{ base: "column", md: "row" }}
            justifyContent="center"
            alignItems="center"
            p={1}
            pt={2}
          >
            <Stack alignItems="center">
              <Heading fontSize={"2xl"} fontFamily={"body"}>
                {userDetails?.first_name} {userDetails?.last_name}
              </Heading>
              <Text fontWeight={600} color={"gray.500"} size="sm" mb={4}>
                @{userDetails?.username}
              </Text>
            </Stack>
            <Stack alignItems="center">
              <Text
                textAlign={"center"}
                color={useColorModeValue("gray.700", "gray.400")}
                px={3}
              >
                {artist?.description}
              </Text>
              <Stack
                align={"center"}
                justify={"center"}
                direction={"row"}
                mt={6}
              >
                {/*TODO aici trebuie lucrat ca daca sunt mai multe ies chestiile in afara si ar trb sa fie pe 2 randuri sau mai multe */}
                <Badge
                  px={2}
                  py={1}
                  bg={useColorModeValue("gray.50", "gray.800")}
                  fontWeight={"400"}
                >
                  #art
                </Badge>
                <Badge
                  px={2}
                  py={1}
                  bg={useColorModeValue("gray.50", "gray.800")}
                  fontWeight={"400"}
                >
                  #photography
                </Badge>
                <Badge
                  px={2}
                  py={1}
                  bg={useColorModeValue("gray.50", "gray.800")}
                  fontWeight={"400"}
                >
                  #music
                </Badge>
              </Stack>
            </Stack>

            <Stack alignItems="center">
              <Stack spacing={0} align={"center"}>
                <Text fontWeight={600}>23k</Text>
                <Text fontSize={"sm"} color={"gray.500"}>
                  Followers
                </Text>
              </Stack>

              <Stack
                width={"100%"}
                mt={"2rem"}
                direction={"row"}
                padding={2}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Button
                  flex={1}
                  fontSize={"sm"}
                  rounded={"full"}
                  bg={"blue.400"}
                  color={"white"}
                  boxShadow={
                    "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                  }
                  _hover={{
                    bg: "blue.500",
                  }}
                  _focus={{
                    bg: "blue.500",
                  }}
                >
                  Follow
                </Button>
              </Stack>
            </Stack>

            {userDetails?.user_type === "artist" && (
              <>
                <Stack>
                  <Button onClick={onOpen}>Edit Profile</Button>
                  <Button onClick={() => setOpenModalAddPost(true)}>
                    Add Post
                  </Button>
                </Stack>

                <Modal
                  initialFocusRef={descriptionRef}
                  isOpen={isOpen}
                  onClose={onClose}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Edit your profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                      <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Input ref={descriptionRef} placeholder="Description" />
                      </FormControl>

                      <FormControl mt={4}>
                        <FormLabel>Profile image</FormLabel>
                        <Input
                          type="file"
                          ref={filePickerRef}
                          hidden
                          onChange={addImageToProfile}
                        />
                      </FormControl>

                      {selectedFile ? (
                        <Center>
                          <Image
                            src={selectedFile as string}
                            onClick={() => setSelectedFile(null)}
                            borderRadius="full"
                            boxSize="150px"
                          ></Image>
                        </Center>
                      ) : (
                        <Button onClick={() => filePickerRef.current?.click()}>
                          Choose image
                        </Button>
                      )}
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        mr={3}
                        disabled={!selectedFile}
                        onClick={updateProfile}
                      >
                        {loading ? "Saving..." : "Save changes"}
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>

                <Modal
                  isOpen={openModalAddPost}
                  onClose={handleModalAddPostClose}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add a new post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                      <FormControl mt={4}>
                        <FormLabel>Post image</FormLabel>
                        <Input
                          type="file"
                          ref={filePickerAddPostRef}
                          hidden
                          onChange={addImageToPost}
                        />
                      </FormControl>

                      {selectedFileAddPost ? (
                        <Center>
                          <Image
                            src={selectedFileAddPost as string}
                            onClick={() => setSelectedFileAddPost(null)}
                            boxSize="200px"
                          ></Image>
                        </Center>
                      ) : (
                        <Button
                          onClick={() => filePickerAddPostRef.current?.click()}
                        >
                          Choose image
                        </Button>
                      )}

                      <FormControl>
                        <FormLabel>Caption</FormLabel>
                        <Input ref={captionRef} placeholder="Caption" />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Availability</FormLabel>
                        <Checkbox
                          isChecked={forSale}
                          onChange={() =>
                            forSale ? setForSale(false) : setForSale(true)
                          }
                          ref={checkboxRef}
                        >
                          Is it for sale?
                        </Checkbox>
                      </FormControl>

                      {forSale && (
                        <>
                          <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input ref={titleRef} placeholder="Title" />
                          </FormControl>

                          <FormControl>
                            <FormLabel>Year</FormLabel>
                            <Input
                              type={"number"}
                              ref={yearRef}
                              placeholder="Year"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel>Price</FormLabel>
                            <Input
                              type={"number"}
                              ref={priceRef}
                              placeholder="Price"
                            />
                          </FormControl>

                          <FormControl>
                            <FormLabel htmlFor="currency">Currency</FormLabel>
                            <Select id="currency" placeholder="Select a currency" ref={currencyRef}>
                              <option>RON</option>
                              <option>EUR</option>
                              <option>USD</option>
                            </Select>
                          </FormControl>
                        </>
                      )}
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        colorScheme="blue"
                        mr={3}
                        disabled={!selectedFileAddPost}
                        onClick={uploadPost}
                      >
                        {loading ? "Saving..." : "Save changes"}
                      </Button>
                      <Button onClick={handleModalAddPostClose}>Cancel</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            )}
          </Stack>
        </Stack>
      </Center>
    </div>
  );
}

export default UserProfileCard;
