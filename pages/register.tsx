import React, { useState } from "react";
import type { NextPage } from "next";
import { useInput } from "../hooks/useInput";
import { User } from "firebase/auth";
//import { logOut, register } from '../hooks/firebase/auth';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Flex,
  Box,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Checkbox,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuth } from "../hooks/AuthContext";
import { useRouter } from "next/router";
import {
  addDoc,
  serverTimestamp,
  updateDoc,
  collection,
  doc,
} from "firebase/firestore";
import { db, storage } from "../hooks/firebase/firebase";

const Register: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, emailInput] = useInput({ type: "email" });
  //const [password, passwordInput] = useInput({ type: "password" });
  //const [user, setUser] = useState<User | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const { user, register } = useAuth();
  const router = useRouter();
  const [userType, setUserType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const standardUserIcon: string = "data:image/png;base64,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";

  const onFormSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const userCredential = await register(email as string, password as string);

    const docRef = await addDoc(collection(db, "users"), {
      auth_uid: userCredential.user.uid,
      first_name: firstName,
      last_name: lastName,
      profile_img: standardUserIcon,
      user_type: userType,
      username: username,
      timestamp: serverTimestamp(),
    });

    if(userType === 'artist')
    {
      await addDoc(collection(db, "artists"), {
        description: 'Customize your new profile',
        user_id: docRef.id,
        timestamp: serverTimestamp(),
      });
    }

    setIsLoading(false);
    router.push("/profile");
  };

  return (
    <div>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bgGradient="linear(to-b, #181820, #0b0b0f)"
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"} color={"white"}>
              Sign up
            </Heading>
            <Text fontSize={"lg"} color={"white"}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box rounded={"lg"} bg="#181820" shadow={"purple"} p={8}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel color={"white"}>Email address</FormLabel>
                {emailInput}
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel color={"white"}>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e:any) => setPassword(e.target.value)}
                    color={"white"}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      color={"white"}
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                      _hover={{
                        background: "#181820",
                        boxShadow: "sm",
                      }}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel color={"white"}>First Name</FormLabel>
                    <Input
                      color={"white"}
                      type="text"
                      value={firstName}
                      onChange={(e:any) => setFirstName(e.target.value)}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName" isRequired>
                    <FormLabel color={"white"}>Last Name</FormLabel>
                    <Input
                      color={"white"}
                      type="text"
                      value={lastName}
                      onChange={(e:any) => setLastName(e.target.value)}
                    />
                  </FormControl>
                </Box>
              </HStack>

              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel color={"white"}>Username</FormLabel>
                  <Input
                    color={"white"}
                    type="text"
                    value={username}
                    onChange={(e:any) => setUsername(e.target.value)}
                  />
                </FormControl>
              </Box>

              <FormControl as="fieldset" isRequired>
                <FormLabel color={"white"} as="legend">
                  What are you looking for?
                </FormLabel>
                <RadioGroup onChange={setUserType} value={userType}>
                  <HStack spacing="24px" color={"white"}>
                    <Radio value="client" colorScheme={"purple"}>
                      Discover art
                    </Radio>
                    <Radio value="artist" colorScheme={"purple"}>
                      Display art
                    </Radio>
                  </HStack>
                </RadioGroup>
                <FormHelperText>Are you a client or an artist?</FormHelperText>
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Submitting"
                  size="lg"
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  color={"white"}
                  
                  _hover={{
                    bgGradient: "linear(to-r, blue.400, purple.400)",
                    shadow: 'white_btn',
                  }}
                  isLoading={isLoading}
                  onClick={onFormSubmit}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"} color={"white"}>
                  Already a user?{" "}
                  <Link color={"purple.400"} href="/login">
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </div>
  );
};

export default Register;
