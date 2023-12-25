import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import "driver.js/dist/driver.css";
import { driver } from "driver.js";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  const startTour = () => {
    const config = {
      steps: [
        {
          element: "#searchUser",
          popover: {
            title: "Search User",
            description:
              "Click here to search for a user and start ChatApp features.",
          },
        },
        {
          element: "#newGroupChat",
          popover: {
            title: "Create New Group+",
            description:
              "Click here to create a new group and start a chat with multiple users. Enter the group name and select members to initiate a group chat.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#chatApp",
          popover: {
            title: "ChatApp",
            description:
              "Stay connected with your contacts, start one-on-one chats, and manage your messages.",
            side: "right",
            align: "start",
          },
        },
        {
          element: "#notification",
          popover: {
            title: "Notification Show",
            description:
              "Click here to view your notifications. Stay updated on new messages, friend requests, and other important updates.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#profileDrive",
          popover: {
            title: "Profile",
            description:
              "Click here to access your profile. Update your personal information, manage settings, and customize your ChatApp experience.",
            side: "bottom",
            align: "start",
          },
        },
        {
          popover: {
            title: "'Happy Chatting!'",
            description:
              "'Happy Chatting!' to send a friendly message in the ChatApp.",
          },
        },
        // Add more steps as needed
      ],
      allowClose: true,
      // Add other configuration options as needed
    };

    const tourInstance = driver(config);

    // Start the tour directly
    tourInstance.drive();
  };
  useEffect(() => {
    if (user?.isLogin === 1) {
      startTour();
    }
  }, []);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
