import React, { useState } from "react";
import type { NextPage } from "next";
import { Box, Image } from '@chakra-ui/react';
import SidebarChat from "../components/chat/SidebarChat";


const messaging: NextPage = () => {
  return (
    <Box h="100vh" bg={'gray.100'}>
        <SidebarChat />
      </Box>
  )
}

export default messaging
