import React, { useState } from "react";
import type { NextPage } from "next";
import { Box } from '@chakra-ui/react';
import SidebarChat from "../components/chat/SidebarChat";


const messaging: NextPage = () => {
  return (
    <Box h="100vh">
        <SidebarChat />
      </Box>
  )
}

export default messaging
