import React, { ReactNode } from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Button,
  Center,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiMessageCircle,
  FiUser,
  FiArchive,
  FiUsers,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText, useState } from "react";
import { useAuth } from "../hooks/AuthContext";
import { useRouter } from "next/router";
import Searchbar from "./explore/Searchbar";
import logo from "./assets/logo.gif";
import Image from "next/image";

interface LinkItemProps {
  name: string;
  icon: IconType;
  route: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "News Feed", icon: FiHome, route: "/newsFeed" },
  { name: "My Profile", icon: FiUser, route: "/yourProfile" },
  { name: "Messaging", icon: FiMessageCircle, route: "/messaging" },
  { name: "Favourites", icon: FiStar, route: "/newsFeed" },
  { name: "Explore", icon: FiCompass, route: "/explore" },
  { name: "Followers list", icon: FiUsers, route: "/followers" },
  { name: "Following list", icon: FiUsers, route: "/following" },
  { name: "Order History", icon: FiArchive, route: "/orderHistory" },
];

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
        bgGradient="linear(to-b, #181820, #0b0b0f)"
        color={"gray.100"}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="sm"
      >
        <DrawerContent
          color={"gray.100"}
          bgGradient="linear(to-b, #181820, #0b0b0f)"
        >
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      //bg={useColorModeValue("white", "gray.900")}
      bgGradient="linear(to-b, #181820, #0b0b0f)"
      borderRight="1px"
      borderRightColor={"gray.900"}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" justifyContent="space-between">
        <Box mx={{ base: 24, md: 8 }}>
          <Image
            unoptimized={true}
            src={require("./assets/logo.gif")}
            alt="logo"
          />
        </Box>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} route={link.route}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  route: string;
  children: ReactText;
}
const NavItem = ({ icon, route, children, ...rest }: NavItemProps) => {
  return (
    <Link
      href={route}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bgGradient: "linear(to-r, blue.500, purple.500)",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, userDetails, logout } = useAuth();
  const router = useRouter();

  const onLogOut = async (event: React.MouseEvent) => {
    event.preventDefault();
    setIsLoading(true);
    await logout();
    setIsLoading(false);
    router.push("/");
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      //bg={useColorModeValue("white", "gray.900")}
      bgGradient="linear(to-r, #181820, #0b0b0f)"
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
        mr="5"
        color={"gray.100"}
      />

      <Box
        display={{ base: "flex", sm: "flex", md: "none" }}
        width={["50%", "25%", "15%"]}
      >
        <Image
          unoptimized={true}
          src={require("./assets/logo.gif")}
          alt="logo"
          objectFit="contain"
        />
      </Box>

      {/* <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        asta e?
      </Text> */}

      <HStack spacing={{ base: "0", md: "6" }}>
        <Searchbar></Searchbar>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={userDetails?.profile_img}
                  shadow={"xl"}
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                  color={"gray.100"}
                >
                  <Text fontSize="sm">
                    {userDetails?.first_name} {userDetails?.last_name}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    @{userDetails?.username}
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }} color={"gray.100"}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={() => router.push("/yourProfile")}>
                Profile
              </MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              {user && <MenuItem onClick={onLogOut}>Log out</MenuItem>}
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
