import React from 'react';
import { useRecoilState } from "recoil";
import { useRef } from "react";
import { editProfileModalState } from "../atoms/editProfileModalAtom";
import { useAuth } from "../hooks/AuthContext";
import {
    Button,
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

function EditProfileModal() {
    const { user, userDetails } = useAuth();
    //const { isOpen, onOpen, onClose } = useDisclosure();
    const [open, setOpen] = useRecoilState(editProfileModalState);

    const initialRef = React.useRef<HTMLInputElement>(null);
    const finalRef = React.useRef<HTMLInputElement>(null);

  return (
    // <Modal
    //         initialFocusRef={initialRef}
    //         finalFocusRef={finalRef}
    //         isOpen={open}
    //         onClose={setOpen}
    //       >
    //         <ModalOverlay />
    //         <ModalContent>
    //           <ModalHeader>Create your account</ModalHeader>
    //           <ModalCloseButton />
    //           <ModalBody pb={6}>
    //             <FormControl>
    //               <FormLabel>First name</FormLabel>
    //               <Input ref={initialRef} placeholder='First name' />
    //             </FormControl>
    
    //             <FormControl mt={4}>
    //               <FormLabel>Last name</FormLabel>
    //               <Input placeholder='Last name' />
    //             </FormControl>
    //           </ModalBody>
    
    //           <ModalFooter>
    //             <Button colorScheme='blue' mr={3}>
    //               Save
    //             </Button>
    //             <Button onClick={onClose}>Cancel</Button>
    //           </ModalFooter>
    //         </ModalContent>
    //       </Modal>
    <div></div>
  )
}

export default EditProfileModal