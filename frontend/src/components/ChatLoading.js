import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import { useEffect, useState } from "react";
import { Box, Image, Text, Flex } from "@chakra-ui/react";
const ChatLoading = () => {
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    // Clear the timer to avoid memory leaks
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {showLoading ? (
        <Stack>
          {[...Array(12)].map((_, index) => (
            <Skeleton key={index} height="45px" />
          ))}
        </Stack>
      ) : (
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          flex="1"
          bgGradient="linear-gradient(to right, white,#e8e8e8 )"
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
              Start Chatting Privately with Your Contact List
            </Text>
            <Text fontSize="lg" color="#363232" fontWeight={"thin"}>
              Connect with friends and have private conversations in ChatApp.
              Start a chat now!
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatLoading;
