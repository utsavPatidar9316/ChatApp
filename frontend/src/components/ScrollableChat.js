import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  ampmTime,
  getDate,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { Image, Box, Text, Flex } from "@chakra-ui/react";
import PersonalProfileModal from "./PersonalProfile";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed style={{ overflowY: "auto", height: "400px" }}>
      {messages.length > 0 ? (
        messages.map((m, i) => {
          const showDate =
            i === 0 ||
            getDate(messages[i - 1].createdAt) !== getDate(m.createdAt);
          return (
            <div key={m._id}>
              {showDate && (
                <>
                  <div
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                      color: "gray",
                      fontSize: "10px",
                      margin: "10px 0",
                      textAlign: "center",
                    }}
                  >
                    {getDate(m.createdAt)}
                  </div>
                  <div
                    style={{
                      display: "block",
                      textAlign: "center",
                      color: "gray",
                      fontSize: "10px",
                      margin: "10px 0",
                    }}
                  >
                    {getDate(m.createdAt)}
                  </div>
                </>
              )}
              <div style={{ display: "flex" }}>
                {(isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )}
                {!m.isPic ? (
                  <>
                    <span
                      style={{
                        backgroundColor: `${
                          m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                        }`,
                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          user._id
                        ),
                        marginTop: isSameUser(messages, m, i, user._id)
                          ? 3
                          : 10,
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                      }}
                    >
                      {m.content}
                    </span>
                    <Text fontSize="xs" color="gray.500" alignSelf={"flex-end"}>
                      {ampmTime(m.createdAt)}
                    </Text>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        marginLeft: isSameSenderMargin(
                          messages,
                          m,
                          i,
                          user._id
                        ),
                        marginTop: isSameUser(messages, m, i, user._id)
                          ? 3
                          : 10,
                        maxWidth: "100%",
                        cursor: "pointer",
                      }}
                    >
                      <PersonalProfileModal user={m.pic}>
                        <Image
                          boxSize="md"
                          borderRadius="20px"
                          src={m.pic}
                          alt="Send Image"
                          width={"300px"}
                          height={"300px"}
                          margin="0"
                          padding="0"
                          display="block"
                        />
                      </PersonalProfileModal>
                    </span>
                    <Text fontSize="xs" color="gray.500" alignSelf={"flex-end"}>
                      {ampmTime(m.createdAt)}
                    </Text>
                  </>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <Box
          p={"40"}
          bgGradient="linear-gradient(to right, white,#e8e8e8 )"
          borderRadius="md"
          boxShadow="md"
          color="gray"
          width="100%"
          height="100%"
          textAlign="center"
        >
          <Flex justifyContent={"center"}>
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
          <Box mt={4} colorScheme="teal" size="sm">
            Hello there! 👋 Welcome to our chat platform. We're excited to chat
            with you!
          </Box>
          <Text mt={4}>
            Let's have an amazing conversation. Start by saying hello!
          </Text>
        </Box>
      )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
