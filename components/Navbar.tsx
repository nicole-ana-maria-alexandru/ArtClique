import React from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../hooks/AuthContext";

function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout, userDetails } = useAuth();

  const onLogOut = async (event: React.MouseEvent) => {
    event.preventDefault();
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };

  return (
    <div>
      <Box>
        <Flex
          minH={"60px"}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={"solid"}
          borderColor={"gray.700"}
          align={"center"}
        >
          <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
            <Text
              // textAlign={useBreakpointValue({ base: "center", md: "left" })}
              fontFamily={"heading"}
              color={"white"}
            >
              The Gallery Shop
            </Text>

            <Flex display={{ base: "none", md: "flex" }} ml={10}></Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
          >
            {user ? (
              <Button
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bgGradient="linear(to-r, blue.500, purple.500)"
                _hover={{
                  bgGradient: "linear(to-r, blue.400, purple.400)",
                  shadow: "white_btn",
                }}
                isLoading={isLoading}
                onClick={onLogOut}
              >
                Log Out
              </Button>
            ) : (
              <>
                <Button
                  as={"a"}
                  fontSize={"md"}
                  fontWeight='extrabold'
                  variant={"link"}
                  href={"login"}
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  bgClip='text'
                >
                  Log In
                </Button>
                <Button
                  as={"a"}
                  fontSize={"sm"}
                  fontWeight={600}
                  color={"white"}
                  bgGradient="linear(to-r, blue.500, purple.500)"
                  _hover={{
                    bgGradient: "linear(to-r, blue.400, purple.400)",
                    shadow: "white_btn",
                  }}
                  href={"register"}
                >
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Flex>
      </Box>
    </div>
  );
}

export default Navbar;
