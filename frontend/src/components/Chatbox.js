import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import { theme } from "../../src/style";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, darkmode } = ChatState();

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg={darkmode ? theme.darkbackground : theme.lightbackground}
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
