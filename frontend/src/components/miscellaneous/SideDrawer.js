import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text, HStack } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { theme } from "../../style";
function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
    darkmode,
    setDarkmode,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    await axios.put(
      "/api/user/updateUser",
      {
        _id: user._id,
        isActive: false,
        lastSeen: new Date(),
      },
      config
    );
    toast({
      title: "Logged Out",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    localStorage.removeItem("userInfo");
    history.push("/login");
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search]);

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const darkModeChangeFunction = () => {
    setDarkmode(!darkmode);
  };
  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={darkmode ? theme.darkbackground : theme.lightbackground}
        borderColor={darkmode ? theme.darkBorder : theme.lightBorder}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}
            id="searchUser"
            color={darkmode ? theme?.darkColor : theme?.lightColor}
          >
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <div id="chatApp">
          <HStack spacing="2">
            <Image src="Favicon.png" alt="LiveChat Logo" boxSize="50px" />
            <Text
              fontSize="4xl"
              fontWeight={"extrabold"}
              pb={3}
              fontFamily="Work Sans"
              color="#32ccfe"
            >
              ChatApp
            </Text>
          </HStack>
        </div>
        <div style={{ color: darkmode ? theme?.darkColor : theme?.lightColor }}>
          <Menu>
            <div
              id="notification"
              style={{
                display: "inline",
              }}
            >
              <Tooltip
                label="Click to show Notification"
                hasArrow
                placement="bottom"
              >
                <MenuButton p={1}>
                  <NotificationBadge
                    count={notification.length}
                    effect={Effect.SCALE}
                  />
                  <BellIcon fontSize="2xl" m={1} />
                </MenuButton>
              </Tooltip>
            </div>
            <MenuList
              pl={2}
              backgroundColor={
                darkmode ? theme?.darkbackground : theme?.lightbackground
              }
            >
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Tooltip
            label={`Click to enable ${darkmode ? "Light Mode" : "Dark Mode"}`}
            hasArrow
            placement="bottom"
          >
            <span
              onClick={darkModeChangeFunction}
              style={{ cursor: "pointer" }}
            >
              {darkmode ? (
                <MoonIcon fontSize="xl" m={1} />
              ) : (
                <SunIcon fontSize="xl" m={1} />
              )}
            </span>
          </Tooltip>
          <Menu>
            <div id="profileDrive" style={{ display: "inline" }}>
              <MenuButton
                as={Button}
                bg="white"
                rightIcon={<ChevronDownIcon />}
              >
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.name}
                  src={user.pic}
                />
              </MenuButton>
            </div>
            <MenuList
              backgroundColor={
                darkmode ? theme?.darkbackground : theme?.lightbackground
              }
            >
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent
          color={darkmode ? theme?.darkColor : theme?.lightColor}
          backgroundColor={
            darkmode ? theme?.darkbackground : theme?.lightbackground
          }
        >
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                textColor={darkmode ? theme?.darkColor : theme?.lightColor}
                placeholder="Search by name or email"
                _placeholder={{
                  color: darkmode ? theme?.darkColor : theme?.lightColor,
                }}
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
