import React from "react";
import {
  Box,
  Flex,
} from "@chakra-ui/react";
import Image from "next/image";

function Navbar() {
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
          height="20"
        >
          <Flex flex={{ base: 1 }} justify={"center"}>
            <Box width={"200px"} pb={2} pt={4}>
              <Image
                unoptimized={true}
                src={require("./assets/logo.gif")}
                alt="logo"
                objectFit="contain"
              />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </div>
  );
}

export default Navbar;
