import React, { useState } from "react";
import type { NextPage } from "next";
import { useInput } from "../hooks/useInput";
import { logIn } from "../hooks/firebase/auth";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Flex,
  Box,
  Checkbox,
  Stack,
  Link,
  Heading,
  Text,
  useColorModeValue,
  Container,
  useMediaQuery,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/AuthContext";
import { useRouter } from "next/router";
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../hooks/firebase/firebase";
import Navbar from "../components/Navbar";

const Login: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, emailInput] = useInput({ type: "email" });
  const [password, passwordInput] = useInput({ type: "password" });
  const [rememberUser, setRememberUser] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const onFormSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (rememberUser) setPersistence(auth, browserLocalPersistence);
      else setPersistence(auth, browserSessionPersistence);
      try {
        await login(email as string, password as string);
      } catch (error : any) {
        alert(error.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally{
      setIsLoading(false);
      router.push("/newsFeed");
    }
  };

  return (
    <div style={{backgroundColor: '181820'}}>
      <Container
        maxW="100%"
        minH="calc(100vh)"
        bgGradient="linear(to-b, #181820, #0b0b0f)"
      >
        <Navbar />
        <Container>
        <Flex
          align={"center"}
          justify={"center"}
          zIndex={1}
        >
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} zIndex={0}>
            <Stack align={"center"}>
              <Heading fontSize={"4xl"} color={"white"} fontFamily={'body'}>
                Sign in to your account
              </Heading>
              <Text fontSize={"lg"} color={"white"}>
                to enjoy the{" "}
                <Link color={"purple.400"}>art community</Link>
              </Text>
            </Stack>
            <Box rounded={"lg"} bg="#181820" p={8} shadow={"purple"}>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel color={"white"}>Email address</FormLabel>
                  {emailInput}
                </FormControl>
                <FormControl id="password">
                  <FormLabel color={"white"}>Password</FormLabel>
                  {passwordInput}
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Checkbox
                      color={"white"}
                      colorScheme="purple"
                      isChecked={rememberUser}
                      onChange={(e: any) => setRememberUser(e.target.checked)}
                    >
                      Remember me
                    </Checkbox>
                    <Link color={"purple.400"}>Forgot password?</Link>
                  </Stack>
                  <Stack>
                    <Text align={"center"} color={"white"}>
                      Not a user yet?{" "}
                      <Link color={"purple.400"} href="/register">
                        Register Now
                      </Link>
                    </Text>
                  </Stack>
                  <Button
                    fontFamily={"heading"}
                    mt={6}
                    w={"full"}
                    bgGradient="linear(to-r, blue.500, purple.500)"
                    color={"white"}
                    _hover={{
                      bgGradient: "linear(to-r, blue.400, purple.400)",
                      shadow: "white_btn",
                    }}
                    isLoading={isLoading}
                    onClick={onFormSubmit}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
        </Container>
      </Container>
    </div>
  );
};

export default Login;
