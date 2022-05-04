import React, { MutableRefObject } from 'react'
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
  } from '@chakra-ui/react';
  import { useAuth } from "../hooks/AuthContext";
  import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
  import { db, storage } from "../hooks/firebase/firebase";
import { useRef, useState } from 'react';
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import { UserDetails } from '../hooks/firebase/interfaces';

function UserProfileCard() {

    const { user, userDetails, artist, setUserDetails } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const descriptionRef = useRef<HTMLInputElement>(null);
    const filePickerRef = useRef<HTMLInputElement>(null);

    const finalRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string|ArrayBuffer|null>(null);

    const uploadPost = async () => {
      if (loading) return;
  
      setLoading(true);
  
      // const docRef = await addDoc(collection(db, "artists"), {
      //   description: descriptionRef.current?.value,
      //   user_id: userDetails.id,
      //   timestamp: serverTimestamp(),
      // });
      if(artist)
      await updateDoc(doc(db, "artists", artist.id), {
        description: descriptionRef.current?.value,
      });
  
      // console.log("New artist doc added with ID", docRef.id);
  
      const imageRef = ref(storage, `users/${userDetails.id}/profile_img`);
  
      await uploadString(imageRef, selectedFile as string, "data_url").then(
        async (snapshot) => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "users", userDetails.id), {
            profile_img: downloadURL,
          });
          setUserDetails((oldDetails: UserDetails) => {
            return {...oldDetails, profile_img: downloadURL}
          })
        }
      );
  
      //setOpen(false);
      setLoading(false);
      setSelectedFile(null);
    };


    const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
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


    // console.log('user');
    // console.log(user);
    // console.log('userDetails');
    // console.log(userDetails);
    // console.log('artist');
    // console.log(artist);

    //const initialRef: React.RefObject<HTMLInputElement| undefined> = React.useRef();
    //const finalRef: React.RefObject<HTMLInputElement| undefined> = React.useRef();
    // console.log(user);
    // console.log(userDetails);

    // interface UserDetail {
    //     first_name: string,
    //     last_name: string,
    //     user_type: string,
    //     username: string
    // }

    // const loggedUser: UserDetail = {
    //     first_name: '',
    //     last_name: '',
    //     user_type: '',
    //     username: ''
    // }

    // console.log(user);

    // const getUserDetalis = async () => {
    //     const q = query(collection(db, "users"), where("auth_uid", "==", user.uid));
    //     const querySnapshot = await getDocs(q);
    //     querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     //console.log(doc.id, " => ", doc.data());
    //     loggedUser.first_name = doc.data().first_name;
    //     loggedUser.last_name = doc.data().last_name;
    //     loggedUser.user_type = doc.data().user_type;
    //     loggedUser.username = doc.data().username;
    // });

    //     console.log(loggedUser);
    // };

    // {user && getUserDetalis();}

  return (
    <div>
        <Center py={6}>
      <Stack
        borderWidth="1px"
        borderRadius="lg"
        w={{ sm: '100%', md: '75%' }}
        height={{ sm: '476px', md: '20rem' }}
        direction={{ base: 'column', md: 'row' }}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        padding={4}>
        <Flex flex={1} align={'center'} justify={'center'}>
          {/* <Image
            objectFit="cover"
            boxSize="100%"
            src={
              'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
            }
          /> */}
          <Avatar
            size={'xl'}
            src={userDetails?.profile_img}
            css={{
              border: '2px solid white',
            }}
          />
        </Flex>
        <Stack
        direction={{ base: 'column', md: 'row' }}
          justifyContent="center"
          alignItems="center"
          p={1}
          pt={2}>
          <Stack
          alignItems="center"
          >
          <Heading fontSize={'2xl'} fontFamily={'body'}>
            {userDetails?.first_name} {userDetails?.last_name}
          </Heading>
          <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
            @{userDetails?.username}
          </Text>
          </Stack>
          <Stack
          alignItems="center"
          >
            <Text
            textAlign={'center'}
            color={useColorModeValue('gray.700', 'gray.400')}
            px={3}>
            {artist?.description}
            {/* <Link href={'#'} color={'blue.400'}>
              #tag 
            </Link>
            me in your posts */}
          </Text>
          <Stack align={'center'} justify={'center'} direction={'row'} mt={6}>
            {/* aici trebuie lucrat ca daca sunt mai multe ies chestiile in afar si ar trb sa fie pe 2 randuri sau mai multe */}
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue('gray.50', 'gray.800')}
              fontWeight={'400'}>
              #art
            </Badge>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue('gray.50', 'gray.800')}
              fontWeight={'400'}>
              #photography
            </Badge>
            <Badge
              px={2}
              py={1}
              bg={useColorModeValue('gray.50', 'gray.800')}
              fontWeight={'400'}>
              #music
            </Badge>
          </Stack>
          </Stack>
          
          <Stack
          alignItems="center"
          >
            <Stack spacing={0} align={'center'}>
              <Text fontWeight={600}>23k</Text>
              <Text fontSize={'sm'} color={'gray.500'}>
                Followers
              </Text>
            </Stack>

            <Stack
            width={'100%'}
            mt={'2rem'}
            direction={'row'}
            padding={2}
            justifyContent={'space-between'}
            alignItems={'center'}>
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              _focus={{
                bg: 'gray.200',
              }}>
              Message
            </Button>
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              bg={'blue.400'}
              color={'white'}
              boxShadow={
                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
              }
              _hover={{
                bg: 'blue.500',
              }}
              _focus={{
                bg: 'blue.500',
              }}>
              Follow
            </Button>
          </Stack>
          </Stack>

          {userDetails?.user_type === 'artist' && 
          <>
          <Button onClick={onOpen}>Edit Profile</Button>
    
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
                  <Input ref={descriptionRef} placeholder='Description' />
                </FormControl>
    
                


                <FormControl mt={4}>
                  <FormLabel>Profile image</FormLabel>
                  <Input type="file" ref={filePickerRef} hidden onChange={addImageToPost}/>
                </FormControl>

                {selectedFile ? (
              <Image
                src={selectedFile as string}
                onClick={() => setSelectedFile(null)}
                borderRadius='full'
                boxSize='150px'
              ></Image>
            ) : (
              <Button
                onClick={() => filePickerRef.current?.click()}
              >
                Choose image
              </Button>
            )}
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' mr={3} disabled={!selectedFile} onClick={uploadPost}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    
          }
        </Stack>
      </Stack>
    </Center>
    </div>
  )
}

export default UserProfileCard