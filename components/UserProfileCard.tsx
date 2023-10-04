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
  CheckboxGroup,
  Box,
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
  const { user, userDetails, setUserDetails } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const descriptionRef = useRef<HTMLInputElement>(null);
  const filePickerRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(
    null
  );

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
  const typeRef = useRef<HTMLSelectElement>(null);
  const heightRef = useRef<HTMLInputElement>(null);
  const widthRef = useRef<HTMLInputElement>(null);
  const depthRef = useRef<HTMLInputElement>(null);
  const measurementUnitRef = useRef<HTMLSelectElement>(null);
  const artistNameRef = useRef<HTMLInputElement>(null);
  const [openModalEditTags, setOpenModalEditTags] = useState(false);
  const cbGroupInterestsRef = useRef<HTMLInputElement>(null);
  // const cbGroupInterestsValue = [];
  const [cbInterestsValue, setCbInterestsValue] = useState<any>([
    "Painting",
    "Drawing",
    "Sketch",
    "Digital Art",
    "Photography",
    "Sculpture",
  ]);
  const cbInterestsValues = [
    "Painting",
    "Drawing",
    "Sketch",
    "Digital Art",
    "Photography",
    "Sculpture",
  ];
  const cbOccupationsValues = [
    "Art lover",
    "Artist",
    "Broker",
    "Collector",
    "Professor",
    "Gallerist",
    "Curator",
  ];
  const cbResults : any[] = userDetails?.tags;

  //functii pt editare profil
  const updateProfile = async () => {
    if (loading) return;

    setLoading(true);

    // if (artist)
    //   await updateDoc(doc(db, "artists", artist.id), {
    //     description: descriptionRef.current?.value,
    //   });
    let updatedDescription = "Welcome to my profile!";
    if(descriptionRef.current?.value)
      updatedDescription = descriptionRef.current?.value;

    const imageRef = ref(storage, `users/${userDetails.id}/profile_img`);

    await uploadString(imageRef, selectedFile as string, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "users", userDetails.id), {
          profile_img: downloadURL,
          description: updatedDescription,
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

  //functii pt modala de EDIT TAGS
  const handleModalEditTagsClose = () => {
    setOpenModalEditTags(false);
  };

  const handleCbTagsOnChange = (e:any, value:any) => {
    e.preventDefault();
    if(e.target.checked)
      cbResults.push(value)
    else
    {
      if (cbResults.indexOf(value) > -1) {
        cbResults.splice(cbResults.indexOf(value), 1);
      }
    }
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
    // let postImageAddress;

    setLoading(true);

    const docRef = await addDoc(collection(db, "posts"), {
      userId: userDetails.id,
      username: userDetails.username,
      isForSale: checkboxRef.current?.checked,
      caption: captionRef.current?.value,
      profileImg: userDetails.profile_img,
      timestamp: serverTimestamp(),
    });

    var docRefAddPiece : any = null;

    if (checkboxRef.current?.checked) {
      docRefAddPiece = await addDoc(collection(db, "pieces"), {
        postId: docRef.id,
        title: titleRef.current?.value,
        price: priceRef.current?.value,
        currency: "EUR",
        year: yearRef.current?.value,
        artistName: artistNameRef.current?.value,
        ownerId: userDetails.id,
        type: typeRef.current?.value,
        height: heightRef.current?.value,
        width: widthRef.current?.value,
        depth: depthRef.current?.value,
        measurementUnit: measurementUnitRef.current?.value,
        isAvailable: true,
        tags: [],
        timestamp: serverTimestamp(),
      });
    }

    const imageRef = ref(storage, `posts/${docRef.id}/image`);


    await uploadString(
      imageRef,
      selectedFileAddPost as string,
      "data_url"
    ).then(async (snapshot) => {
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(db, "posts", docRef.id), {
        image: downloadURL,
      });
      if (docRefAddPiece !== null){
        await updateDoc(doc(db, "pieces", docRefAddPiece.id), {
          image: downloadURL,
        });
      }
    });

    setOpenModalAddPost(false);
    setLoading(false);
    setSelectedFileAddPost(null);
  };

  const updateTags = async () => {
    if (loading) return;

    setLoading(true);
    await updateDoc(doc(db, "users", userDetails.id), {
      tags: cbResults,
    });

    setOpenModalEditTags(false);
    setLoading(false);
  };

  return (
    <div>
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={{ sm: "100%", xl: "75%" }}
          height={{ sm: "476px", xl: "20rem" }}
          direction={{ base: "column", xl: "row" }}
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
            direction={{ base: "column", xl: "row" }}
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
                {userDetails?.description}
              </Text>
              <Stack
                align={"center"}
                justify={"center"}
                direction={"row"}
                mt={6}
              >
                <Badge
                  px={2}
                  py={1}
                  bg={useColorModeValue("gray.50", "gray.800")}
                  fontWeight={"400"}
                >
                  {userDetails?.country}
                </Badge>
              </Stack>
            </Stack>

            <Stack alignItems="center">
              <Stack direction={"row"}>
                <Stack spacing={0} align={"center"}>
                  <Text fontWeight={600}>{userDetails?.followers?.length}</Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Followers
                  </Text>
                </Stack>

                <Stack spacing={0} align={"center"}>
                  <Text fontWeight={600}>{userDetails?.following?.length}</Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Following
                  </Text>
                </Stack>
              </Stack>
            </Stack>

            <Stack>
              <Button onClick={onOpen}>Edit Profile</Button>
              <Button onClick={() => setOpenModalAddPost(true)}>
                Add Post
              </Button>
              <Button onClick={() => setOpenModalEditTags(true)}>
                Edit Tags
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
                    colorScheme="purple"
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
              isOpen={openModalEditTags}
              onClose={handleModalEditTagsClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit your profile&apos;s tags</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl pb={6}>
                    <FormLabel fontWeight={700} fontSize={"lg"}>
                      Interests
                    </FormLabel>
                    <Box overflowY={"scroll"} height={"150px"} pl={4}>
                      <CheckboxGroup
                        colorScheme="purple"
                        defaultValue={userDetails?.tags}
                      >
                        <Stack spacing={[1, 5]} direction={"column"}>
                          {cbInterestsValues.map((value: any) => (
                            <Checkbox key={value} value={value} 
                            onChange={(e:any) => handleCbTagsOnChange(e, value)}
                            >{value}</Checkbox>
                          ))}
                        </Stack>
                      </CheckboxGroup>
                    </Box>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight={700} fontSize={"lg"}>
                      Occupation
                    </FormLabel>
                    <Box overflowY={"scroll"} height={"150px"} pl={4}>
                      <CheckboxGroup colorScheme="purple" defaultValue={userDetails?.tags}>
                        <Stack spacing={[1, 5]} direction={"column"}>
                          {cbOccupationsValues.map((value: any) => (
                            <Checkbox key={value} value={value} onChange={(e:any) => handleCbTagsOnChange(e, value)}>{value}</Checkbox>
                          ))}
                        </Stack>
                      </CheckboxGroup>
                    </Box>
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="purple"
                    mr={3}
                    onClick={updateTags}
                  >
                    {loading ? "Saving..." : "Save changes"}
                  </Button>
                  <Button onClick={handleModalEditTagsClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal isOpen={openModalAddPost} onClose={handleModalAddPostClose}>
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
                    <FormLabel>For Sale</FormLabel>
                    <Checkbox
                      isChecked={forSale}
                      onChange={() =>
                        forSale ? setForSale(false) : setForSale(true)
                      }
                      ref={checkboxRef}
                      fontWeight="bold"
                      p={2}
                      colorScheme={'purple'}
                    >
                      Is it for sale?
                    </Checkbox>
                  </FormControl>

                  {forSale && (
                    <>
                      <FormControl>
                        <FormLabel>Artist Name</FormLabel>
                        <Input ref={artistNameRef} placeholder="Artist Name" />
                      </FormControl>

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
                          onWheel={(e: any) => e.target.blur()}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel htmlFor="type">Type</FormLabel>
                        <Select
                          id="type"
                          placeholder="Select a piece type"
                          ref={typeRef}
                        >
                          <option>Painting</option>
                          <option>Drawing</option>
                          <option>Sketch</option>
                          <option>Digital Art</option>
                          <option>Photography</option>
                          <option>Sculpture</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Height</FormLabel>
                        <Input
                          type={"number"}
                          ref={heightRef}
                          placeholder="Height"
                          onWheel={(e: any) => e.target.blur()}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Width</FormLabel>
                        <Input
                          type={"number"}
                          ref={widthRef}
                          placeholder="Width"
                          onWheel={(e: any) => e.target.blur()}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Depth</FormLabel>
                        <Input
                          type={"number"}
                          ref={depthRef}
                          placeholder="Depth"
                          onWheel={(e: any) => e.target.blur()}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel htmlFor="measurementUnit">Unit of measurement</FormLabel>
                        <Select
                          id="measurementUnit"
                          placeholder="Unit of measurement"
                          ref={measurementUnitRef}
                        >
                          <option>cm</option>
                          <option>m</option>
                          <option>px</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Price</FormLabel>
                        <Input
                          type={"number"}
                          ref={priceRef}
                          placeholder="Price"
                          onWheel={(e: any) => e.target.blur()}
                        />
                      </FormControl>

                      {/* <FormControl>
                        <FormLabel htmlFor="currency">Currency</FormLabel>
                        <Select
                          id="currency"
                          placeholder="Select a currency"
                          ref={currencyRef}
                        >
                          <option>RON</option>
                          <option>EUR</option>
                          <option>USD</option>
                        </Select>
                      </FormControl> */}
                    </>
                  )}
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="purple"
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
          </Stack>
        </Stack>
      </Center>
    </div>
  );
}

export default UserProfileCard;
