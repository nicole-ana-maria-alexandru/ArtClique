import React, { useRef, useState } from "react";
import type { NextPage } from "next";
import { useInput } from "../hooks/useInput";
import { User } from "firebase/auth";
import { useFormik } from "formik";
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
  Select,
  Container,
  FormErrorMessage,
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
  DocumentReference,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, storage } from "../hooks/firebase/firebase";
import { countryList } from "../utils/countryNames";
import Navbar from "../components/Navbar";
import { getAuth, deleteUser } from "firebase/auth";
import * as Yup from "yup";

const Register: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, register } = useAuth();
  const router = useRouter();
  const standardUserIcon: string =
    "data:image/png;base64,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";
  const countryRef = useRef<HTMLSelectElement>(null);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      username: "",
      country: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .email("Not a valid email"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password is too short"),
      firstName: Yup.string()
        .required("First name is required")
        .min(3, "First name is too short"),
      lastName: Yup.string()
        .required("Last name is required")
        .min(3, "Last name is too short"),
      username: Yup.string()
        .required("Username is required")
        .min(6, "Username is too short"),
      country: Yup.string().required("Please select a country"),
    }),
    onSubmit: async (values, actions) => {
      await onFormSubmit(values);
      actions.resetForm();
    },
  });

  const checkUsernameUnique = async (username: string) => {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs?.length === 1) {
      const auth = getAuth();
      const registeredUser = auth.currentUser;
      if (registeredUser !== null)
        //@ts-ignore
        deleteUser(registeredUser);
      throw Error("This username already exists!");
    }
  };

  const onFormSubmit = async (formikValues: any) => {
    try {
      // event.preventDefault();
      setIsLoading(true);

      const userCredential = await register(
        formikValues.email as string,
        formikValues.password as string
      );
      await checkUsernameUnique(formikValues.username);

      const docRef: any = await addDoc(collection(db, "users"), {
        auth_uid: userCredential.user.uid,
        email: formikValues.email,
        first_name: formikValues.firstName,
        last_name: formikValues.lastName,
        profile_img: standardUserIcon,
        description: "Customize your new profile",
        username: formikValues.username,
        country: formikValues.country,
        tags: [],
        followers: [],
        following: [],
        timestamp: serverTimestamp(),
      });

      await updateDoc(docRef, {
        id: docRef.id,
      });

      setIsLoading(false);
      router.push("/yourProfile");
    } catch (error: any) {
      alert(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Container
        maxW="100%"
        minH="calc(100vh)"
        bgGradient="linear(to-b, #181820, #0b0b0f)"
      >
        <Navbar />
        <Container>
          <Flex align={"center"} justify={"center"}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
              <Stack align={"center"}>
                <Heading
                  fontSize={"4xl"}
                  textAlign={"center"}
                  color={"white"}
                  fontFamily={"body"}
                >
                  Sign up
                </Heading>
                <Text fontSize={"lg"} color={"white"}>
                  to join our <Link color={"purple.400"}>art community</Link>
                </Text>
              </Stack>
              <Box rounded={"lg"} bg="#181820" shadow={"purple"} p={8}>
                <Stack spacing={4}>
                  <FormControl
                    id="email"
                    isRequired
                    isInvalid={
                      (formik.errors.email && formik.touched.email) as any
                    }
                  >
                    <FormLabel color={"white"}>Email address</FormLabel>
                    <Input
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      color={"white"}
                      name="email"
                      onBlur={formik.handleBlur}
                    />
                    <FormErrorMessage>
                      {formik.errors.email}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    id="password"
                    isRequired
                    isInvalid={
                      (formik.errors.password && formik.touched.password) as any
                    }
                  >
                    <FormLabel color={"white"}>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        color={"white"}
                        name="password"
                        onBlur={formik.handleBlur}
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
                    <FormErrorMessage>
                      {formik.errors.password}
                    </FormErrorMessage>
                  </FormControl>

                    <Box>
                      <FormControl id="firstName" isRequired isInvalid={
                      (formik.errors.firstName && formik.touched.firstName) as any
                    }>
                        <FormLabel color={"white"}>First Name</FormLabel>
                        <Input
                          color={"white"}
                          type="text"
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          name="firstName"
                        />
                        <FormErrorMessage>
                          {formik.errors.firstName}
                        </FormErrorMessage>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl id="lastName" isRequired isInvalid={
                      (formik.errors.lastName && formik.touched.lastName) as any}>
                        <FormLabel color={"white"}>Last Name</FormLabel>
                        <Input
                          color={"white"}
                          type="text"
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          name="lastName"
                        />
                        <FormErrorMessage>
                          {formik.errors.lastName}
                        </FormErrorMessage>
                      </FormControl>
                    </Box>


                  <Box>
                    <FormControl id="username" isRequired isInvalid={
                      (formik.errors.username && formik.touched.username) as any}>
                      <FormLabel color={"white"}>Username</FormLabel>
                      <Input
                        color={"white"}
                        type="text"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="username"
                      />
                      <FormErrorMessage>
                        {formik.errors.username}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>

                  <Box>
                    <FormControl isRequired isInvalid={
                      (formik.errors.country && formik.touched.country) as any}>
                      <FormLabel htmlFor="country" color={"white"}>
                        Country
                      </FormLabel>
                      <Select
                        id="country"
                        placeholder="Select country"
                        color={"white"}
                        ref={countryRef}
                        value={formik.values.country}
                        onChange={formik.handleChange}
                        name="country"
                        onBlur={formik.handleBlur}
                      >
                        {countryList.map((country: any) => (
                          <option key={country} style={{ color: "black" }}>
                            {country}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {formik.errors.country}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>

                  <Stack spacing={10} pt={2}>
                    <Button
                      loadingText="Submitting"
                      size="lg"
                      bgGradient="linear(to-r, blue.500, purple.500)"
                      color={"white"}
                      _hover={{
                        bgGradient: "linear(to-r, blue.400, purple.400)",
                        shadow: "white_btn",
                      }}
                      isLoading={isLoading}
                      onClick={formik.handleSubmit as any}
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
        </Container>
      </Container>
    </div>
  );
};

export default Register;
