import React from "react";
import { useRef, useState, useEffect } from "react";
import {
  Flex,
  Avatar,
  IconButton,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  InputGroup,
  InputLeftElement,
  Box,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { db } from "../../hooks/firebase/firebase";
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  where,
  collectionGroup,
} from "firebase/firestore";
import router from "next/router";

function Searchbar() {
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState<any>([]);
  const [result, setResult] = useState<any>([]);
  const [searched, setSearched] = useState<any>("");

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const redirect = (id : any) => {
    router.push(`/profile/${id}`);
  }

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUsers(querySnapshot.docs);
    });
    console.log(users);

    return () => {
      unsubscribe();
    };
  }, []);

  const onChangeHandler = (text : string) => {
    setSearched(text);
    if(text.length > 0 && text.trim()){
    setResult(users.filter((user : any) => String(user.data().username).includes(text)));
    }
    else{
      setResult([]);
    }
  }

  return (
    <div>
      <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<SearchIcon />}
          onClick={() => setOpenModal(true)}
        />

      <Modal
        isOpen={openModal}
        onClose={handleModalClose}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pt={10}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon />}
              />
              <Input
                type="text"
                placeholder="Search users by username"
                onChange={(e: any) => onChangeHandler(e.target.value)}
                value={searched}
              />
            </InputGroup>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {result.map((user : any) => (
                <HStack pb={5} onClick={() => redirect(user.id)}>
                <Avatar size={"sm"} src={user.data().profile_img} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">
                    {user.data().first_name} {user.data().last_name}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    @{user.data().username}
                  </Text>
                </VStack>
              </HStack>
            ))}
            <FormControl></FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Searchbar;
