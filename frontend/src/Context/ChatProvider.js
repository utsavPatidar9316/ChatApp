import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const [darkmode, setDarkmode] = useState(prefersDarkMode);

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) history.push("/login");
    else history.push("/chats");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);
  // useEffect(() => {
  //   const darkModeMediaQuery = window.matchMedia(
  //     "(prefers-color-scheme: dark)"
  //   );

  //   const handleDarkModeChange = (event) => {
  //     setDarkmode(event.matches);
  //   };

  //   darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

  //   // Clean up the event listener when the component is unmounted
  //   return () => {
  //     darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
  //   };
  // }, []);
  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        darkmode,
        setDarkmode,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
