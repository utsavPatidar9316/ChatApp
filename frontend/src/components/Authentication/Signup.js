import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { Container, HStack, Box, Image, Text } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useHistory();
  const [emailLoading, setEmailLoading] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [otp, setOtp] = useState();
  const [sentOtp, setSentsetOtp] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [otpIcon, setOtpIcon] = useState(null);
  const [picLoading, setPicLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const timerIdRef = useRef(null);

  const startCountdown = () => {
    timerIdRef.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          resetCountdown();
          return 0;
        }
      });
    }, 1000);
  };

  const resetCountdown = () => {
    setSentsetOtp("842093");
    clearInterval(timerIdRef.current);
    setCountdown(60);
  };

  useEffect(() => {
    return () => clearInterval(timerIdRef.current);
  }, []);

  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const generateNumericOTP = () => {
    const minDigit = 100000; // Minimum value for a 6-digit number
    const maxDigit = 999999; // Maximum value for a 6-digit number

    const randomNumericOTP =
      Math.floor(Math.random() * (maxDigit - minDigit + 1)) + minDigit;

    return String(randomNumericOTP);
  };

  // Example usage:
  const randomNumericOTP = generateNumericOTP();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword || !otp) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    } else if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    } else if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    } else if (otp !== sentOtp) {
      toast({
        title: "Please Enter the correct OTP",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      setCountdown("120");
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/login");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "diixoyqta");
      fetch("https://api.cloudinary.com/v1_1/diixoyqta/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  const handleSendOtp = async () => {
    if (!name || !email) {
      toast({
        title: "Please Fill Name Field and email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    } else if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setEmailLoading(true);
    setSentsetOtp(randomNumericOTP);
    try {
      const { data } = await axios.post(
        "/api/OTP/sendOTP",
        {
          name,
          email,
          otp: randomNumericOTP,
        },
        config
      );
      if (data.success === true) {
        toast({
          title: "Email sent successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        // Start the countdown timer after a successful OTP send
        startCountdown();
      } else {
        toast({
          title: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setEmailLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setEmailLoading(false);
    }
  };

  useEffect(() => {
    if (otp?.length === 6 && otp === sentOtp) {
      setOtpIcon(<CheckIcon />);
    } else if (otp?.length >= 6) {
      setOtpIcon(<CloseIcon />);
    } else {
      setOtpIcon(null);
    }
  }, [otp || sentOtp]);
  const gotoLogin = () => {
    history.push("/login");
  };
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <HStack spacing="2">
          <Image src="Favicon.png" alt="LiveChat Logo" boxSize="50px" />
          <Text
            fontSize="4xl"
            fontWeight={"extrabold"}
            pb={3}
            fontFamily="Work Sans"
            color="#32ccfe"
          >
            ChatApp
          </Text>
        </HStack>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <VStack spacing="5px">
          <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email Address</FormLabel>
            <InputGroup size="md">
              <Input
                type="email"
                placeholder="Enter Your Email Address"
                onChange={(e) => setEmail(e.target.value)}
                isDisabled={countdown < 60}
              />
              <InputRightElement width="5.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  mr="0.5rem"
                  onClick={handleSendOtp}
                  isLoading={emailLoading}
                  isDisabled={countdown < 60}
                >
                  {countdown < 60 ? `Resend OTP in ${countdown}s` : "Send OTP"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="otp" isRequired>
            <FormLabel>Enter OTP</FormLabel>
            <InputGroup size="md">
              <Input
                type={"text"}
                placeholder="Enter the OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
              {otpIcon !== null && (
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    color={otp === sentOtp ? "green" : "red"}
                  >
                    {otpIcon}
                  </Button>
                </InputRightElement>
              )}
            </InputGroup>
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={show ? "text" : "password"}
                placeholder="Confirm password"
                onChange={(e) => setConfirmpassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="pic">
            <FormLabel>Upload your Picture</FormLabel>
            <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={picLoading}
          >
            Sign Up
          </Button>
        </VStack>
        <Text textAlign={"center"}>
          You have Already Registered?{" "}
          <span
            style={{
              color: "#32ccfe",
              cursor: "pointer",
              textDecorationLine: "underline",
            }}
            onClick={() => {
              gotoLogin();
            }}
          >
            Login
          </span>
        </Text>
      </Box>
    </Container>
  );
};

export default Signup;
