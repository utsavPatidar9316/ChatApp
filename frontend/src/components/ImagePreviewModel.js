import React from "react";
import {
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  ModalBody,
  Image,
} from "@chakra-ui/react";

const ImagePreviewModel = ({
  isOpen,
  onClose,
  selectedImage,
  setSelectedImage,
  fileInputRef,
  sendImage,
  loading,
}) => {
  const handleClose = () => {
    setSelectedImage(null); // Set selectedImage to null
    onClose(); // Close the modal
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} onOverlayClick={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="2xl">
          Preview Image
        </ModalHeader>
        <ModalBody justifyContent="center">
          {selectedImage && (
            <Image
              src={URL.createObjectURL(selectedImage)}
              alt="Image Preview"
              maxH="400px"
              maxW="100%"
              objectFit="contain"
            />
          )}
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            colorScheme="blue"
            mr={3}
            onClick={sendImage}
            isLoading={loading}
          >
            Send Image
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImagePreviewModel;
