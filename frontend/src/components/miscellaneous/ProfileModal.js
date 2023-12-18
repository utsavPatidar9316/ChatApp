import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Input,
  Flex,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const toast = useToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [picLoading, setPicLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };
  const handleEditClick = () => {
    setEditing(!isEditing);
  };

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleSave = async () => {
    let res = {
      url: user?.pic,
    };
    if (
      selectedFile?.type === "image/jpeg" ||
      selectedFile?.type === "image/png" ||
      selectedFile === null
    ) {
      setPicLoading(true);
      if (selectedFile !== null) {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "diixoyqta");
        res = await fetch(
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
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          "/api/user/updateUser",
          {
            _id: user._id,
            name: editedName,
            pic: res?.url,
          },
          config
        );
        localStorage.setItem("userInfo", JSON.stringify(data));
        toast({
          title: "Updated Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        onClose();
        setPicLoading(false);
        setEditing(false);
        window.location.reload();
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
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

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <>
      {children ? <span onClick={onOpen}>{children}</span> : ""}
      <Modal
        size="md"
        onClose={onClose}
        isOpen={isOpen}
        isCentered={false}
        placement="right"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="25px"
            fontFamily="Work Sans"
            d="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom="2px solid #ccc"
            pb={2}
          >
            Profile
            <IconButton
              icon={<EditIcon />}
              onClick={handleEditClick}
              variant="ghost"
              ml={2}
            />
          </ModalHeader>
          <ModalBody>
            <Input
              type="file"
              onChange={handleFileChange}
              mb={4}
              position="absolute"
              opacity="0"
              zIndex="-1"
              left="0"
              top="0"
              width="100%"
              height="100%"
              cursor="pointer"
              id="fileInput"
            />
            {isEditing && (
              <IconButton
                icon={<EditIcon />}
                onClick={() => document.getElementById("fileInput").click()}
                position="absolute"
                variant="solid"
                right={140}
              />
            )}
            <Image
              borderRadius="full"
              boxSize="200px"
              src={previewURL || userInfo.pic}
              alt="Image Preview"
              mb={4}
              mx="auto"
              display="block"
            />
            <Text fontSize="16px" fontFamily="Work Sans" mb={4}>
              Your Name:{" "}
              {isEditing ? (
                <Flex align="center">
                  <Input
                    value={editedName}
                    onChange={handleNameChange}
                    variant="flushed"
                  />
                  <Text fontSize="14px" color="gray.500" ml={2}>
                    {editedName.length}
                  </Text>
                </Flex>
              ) : (
                userInfo.name
              )}
            </Text>
            <Text fontSize="11px">
              This is not your username or pin. This name will be visible to
              your ChatApp.
            </Text>
          </ModalBody>
          <ModalFooter>
            {isEditing && (
              <Button
                colorScheme="teal"
                mr={3}
                onClick={handleSave}
                isLoading={picLoading}
              >
                Save
              </Button>
            )}
            <Button
              onClick={() => {
                setEditedName(userInfo.name);
                setEditing(false);
                setPreviewURL(null);
                onClose();
              }}
            >
              {isEditing ? "Cancel" : "Close"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
