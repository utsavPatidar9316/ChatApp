import { FormControl } from "@chakra-ui/form-control";
import { Box, Text, Flex } from "@chakra-ui/layout";
import "./styles.css";
import {
  Avatar,
  Button,
  IconButton,
  Spinner,
  useToast,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import {
  getSender,
  getSenderFull,
  getSenderImage,
  formatLastSeen,
} from "../config/ChatLogics";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowBackIcon, AttachmentIcon } from "@chakra-ui/icons";
import ScrollableChat from "./ScrollableChat";
import EmojiInput from "react-input-emoji";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import PersonalProfileModal from "./PersonalProfile";
import ImagePreviewModel from "./ImagePreviewModel";
import { theme } from "../style";
import backgroundImage from "../whiteImage.jpg";
import Darkbackgroundimage from "../image.jpg";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageloading, setImageLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
    darkmode,
  } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
            isPic: false,
            pic: "",
          },
          config
        );
        setFetchAgain(!fetchAgain);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(process.env.ENDPOINT);
    socket.emit("setup", user);
    socket.on("join chat", () => setFetchAgain(!fetchAgain));
    const cleanup = () => {
      socket.disconnect();
      setFetchAgain(!fetchAgain);
    };

    window.addEventListener("beforeunload", cleanup);
    window.addEventListener("unload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
      window.removeEventListener("unload", cleanup);
    };
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setFetchAgain(!fetchAgain);
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (text) => {
    setNewMessage(text);
  };
  const handleImageUpload = (file) => {
    setSelectedImage(file);
    onOpen(); // Open the modal
  };
  const sendImage = async () => {
    if (
      selectedImage?.type === "image/jpeg" ||
      selectedImage?.type === "image/png"
    ) {
      setImageLoading(true);
      const data = new FormData();
      data.append("file", selectedImage);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "diixoyqta");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/diixoyqta/image/upload",
        {
          method: "post",
          body: data,
        }
      )
        .then((res) => res.json())
        .catch((err) => {
          console.log(err);
        });
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: "Image",
            chatId: selectedChat,
            isPic: true,
            pic: res?.url,
          },
          config
        );
        onClose();
        setFetchAgain(!fetchAgain);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        setImageLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <Flex align="center" justify="space-between">
                  <Box>
                    <PersonalProfileModal
                      user={getSenderImage(user, selectedChat.users)}
                    >
                      <Avatar
                        src={getSenderImage(user, selectedChat.users)}
                        alt="Profile"
                        boxSize={10}
                        cursor={"pointer"}
                      />
                    </PersonalProfileModal>
                  </Box>
                  <Box flex="1" ml={4}>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color={darkmode ? "white" : "gray.500"}
                    >
                      {getSender(user, selectedChat.users)}
                    </Text>
                    <Text fontSize="sm" color={darkmode ? "white" : "gray.500"}>
                      {getSenderFull(user, selectedChat.users).isActive
                        ? "Online"
                        : formatLastSeen(
                            getSenderFull(user, selectedChat.users).lastSeen
                          )}
                    </Text>
                  </Box>
                </Flex>
              ) : (
                <>
                  <Text color={darkmode ? "white" : "gray.500"}>
                    {selectedChat.chatName.toUpperCase()}
                  </Text>
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            backgroundImage={darkmode ? Darkbackgroundimage : backgroundImage}
            backgroundRepeat={"no-repeat"}
            backgroundSize={"cover"}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              <Box
                display={"flex"}
                flexDirection={"row"}
                bg="rgba(136, 136, 136, 0.281)"
                borderRadius="20px" // Adjust the value as needed
                p="1" // Adjust the padding as needed
              >
                <Button
                  borderRadius="full"
                  color="gray"
                  mt="1.5"
                  ml="2" // Adjust the button text color as needed
                  onClick={() => {
                    document.getElementById("imageInput").click();
                  }}
                >
                  <AttachmentIcon />
                </Button>
                <input
                  id="imageInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
                <EmojiInput
                  value={newMessage}
                  onChange={typingHandler}
                  cleanOnEnter
                  placeholder="Enter a message..."
                  flex="1" // Adjust the flex property as needed
                  ml="4" // Adjust the margin-left as needed
                  borderRadius="full" // Adjust the input border radius as needed
                />
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          flex="1"
          bgGradient={
            darkmode
              ? "linear-gradient(to right, #000000, #333333)" // Dark mode gradient
              : "linear-gradient(to right, white, #e8e8e8)"
          }
          width={"100%"}
          borderRadius={"2xl"}
        >
          <Box textAlign="center">
            <Flex>
              <Image
                src="Favicon.png"
                alt="ChatApp Logo"
                boxSize="150px"
                mb={4}
              />
              <Text
                fontSize="4xl"
                fontWeight={"extrabold"}
                pb={3}
                fontFamily="Work Sans"
                color="#32ccfe"
              >
                ChatApp
              </Text>
            </Flex>
            <Text
              fontSize="2xl"
              fontWeight={"bold"}
              pb={3}
              fontFamily="Work Sans"
              color="#32ccfe"
            >
              Let's Connect and Chat!
            </Text>
            <Text
              fontSize="lg"
              color={darkmode ? theme?.darkColor : theme?.lightColor}
              fontWeight={"thin"}
            >
              Click on a user 👈 to Explore the world🌐 of conversations! 💬
            </Text>
          </Box>
        </Box>
      )}
      <ImagePreviewModel
        isOpen={isOpen}
        onClose={onClose}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        fileInputRef={fileInputRef}
        sendImage={sendImage}
        loading={imageloading}
      />
    </>
  );
};

export default SingleChat;
