import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender, getSenderImage } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Avatar } from "@chakra-ui/avatar";
import { Button, color } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { ampmTime } from "../config/ChatLogics";
import { theme } from "../../src/style";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
    darkmode,
    setDarkmode,
  } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);
  const selectChatFunc = (chat) => {
    setSelectedChat(chat);
    setNotification((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter(
        (notificationChat) => notificationChat.chat._id !== chat._id
      );

      return updatedNotifications;
    });
  };
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={darkmode ? theme.darkbackground : theme.lightbackground}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <span
          style={{ color: darkmode ? theme?.lightBorder : theme?.lightColor }}
        >
          My Chats
        </span>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            id="newGroupChat"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        bg={darkmode ? theme?.darkbackground : theme?.lightbackground}
      >
        {chats?.length > 0 ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => selectChatFunc(chat)}
                cursor="pointer"
                bg={
                  selectedChat?._id === chat?._id
                    ? "#b4b4b4"
                    : darkmode
                    ? "black"
                    : "#E8E8E8"
                }
                color={
                  darkmode
                    ? selectedChat?._id === chat?._id
                      ? "black"
                      : theme?.darkColor
                    : theme?.lightColor
                }
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                _hover={{
                  bg: theme?.darkColor,
                  color: darkmode ? theme?.lightBorder : theme?.darkBorder,
                }}
              >
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={
                        !chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName
                      }
                      src={
                        !chat.isGroupChat
                          ? getSenderImage(loggedUser, chat.users)
                          : chat.chatName
                      }
                    />
                    <Box>
                      <Text>
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                      {chat.latestMessage && (
                        <Text fontSize="xs">
                          <b>{chat.latestMessage.sender.name} : </b>
                          {chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.latestMessage.content}
                        </Text>
                      )}
                    </Box>
                  </Box>
                  {!notification?.isGroupChat && notification?.length > 0 && (
                    <Box style={{ textAlign: "center" }}>
                      <>
                        {notification.filter(
                          (notif) =>
                            notif.sender?._id ===
                              chat?.latestMessage?.sender?._id &&
                            notif.chat?._id === chat?._id
                        ).length > 0 && (
                          <>
                            <Text>
                              {ampmTime(
                                notification
                                  .filter(
                                    (notif) =>
                                      notif.sender?._id ===
                                        chat?.latestMessage?.sender?._id &&
                                      notif.chat?._id === chat?._id
                                  )
                                  .reduce(
                                    (latestCreatedAt, notif) =>
                                      notif.createdAt > latestCreatedAt
                                        ? notif.createdAt
                                        : latestCreatedAt,
                                    ""
                                  )
                              )}
                            </Text>
                            <Text
                              borderRadius="50%"
                              width="25px"
                              textAlign="center"
                              background="gray"
                              color="white"
                              height="25px"
                            >
                              {notification
                                .filter(
                                  (notif) =>
                                    notif.sender?._id ===
                                      chat?.latestMessage?.sender?._id &&
                                    notif.chat?._id === chat?._id
                                )
                                .reduce(
                                  (totalCount, notif) => totalCount + 1,
                                  0
                                )}
                            </Text>
                          </>
                        )}
                      </>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
