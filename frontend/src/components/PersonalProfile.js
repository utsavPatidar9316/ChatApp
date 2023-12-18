import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Image,
  useDisclosure,
} from "@chakra-ui/react";

const PersonalProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? <span onClick={onOpen}>{children}</span> : ""}
      <Modal onClose={onClose} isOpen={isOpen} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Image
              src={user}
              alt="Profile Image"
              style={{
                margin: "0",
                padding: "0",
                display: "block",
                width: "100%",
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PersonalProfileModal;
