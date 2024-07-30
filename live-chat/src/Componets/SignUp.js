import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import {React,useState} from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login() {
    const [show,setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const handleClick = ()=>{
        setShow(!show);
    }

    const postDetails = async (pic) => {
        setPicLoading(true);
    
        try {
            if (!pic) {
                setPic(null);
                toast({title: 'Failed',description: "Incorrect Format",status: "error",duration: 5000,isClosable: true,});
                setPicLoading(false);
                return;
            }
    
            if (pic.type !== "image/jpeg" && pic.type !== "image/png") {
                
                toast({title: 'Failed',description: "Incorrect Format",status: "error",duration: 5000,isClosable: true,});
                setPicLoading(false);
                return;
            }
    
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dutrufb9u");
    
            const response = await fetch("https://api.cloudinary.com/v1_1/dutrufb9u/image/upload", {
                method: "POST",
                body: data,
            });
    
            if (!response.ok) {
                throw new Error('Failed to upload image');
            }
    
            const imageData = await response.json();
            setPic(imageData.url.toString());
            console.log(imageData.url.toString());
            setPicLoading(false);
        } catch (error) {
            console.error('Error uploading image:', error);
            setPic(null);
            toast({title: 'Failed',description: "Error uploading image",status: "error",duration: 5000,isClosable: true,});
            setPicLoading(false);
        }
    };    

    const SignUpHandler = async () => {
        setPicLoading(true);
        if (!name || !email || !password || !confirmpassword) {
          toast({title: "Please Fill all the Fields",status: "warning",duration: 2000,isClosable: true,position: "bottom",});
          setPicLoading(false);
          return;
        }

        if (password !== confirmpassword) {
          toast({title: "Passwords Do Not Match",status: "warning",duration: 5000,isClosable: true,position: "bottom",});
          setPicLoading(false);
          return;
        }
        
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            "/user/register",
            {name,email,password,pic},
            config
          );

          toast({title: "Registration Successful",status: "success",duration: 5000,isClosable: true,position: "bottom",});
          localStorage.setItem("userInfo", JSON.stringify(data));
          setPicLoading(false);
          navigate('/app/welcome');
        } catch (error) {
          toast({title: "Error Occured!",description:error.response.data.message,status: "error",duration: 5000,isClosable: true,position: "bottom",
          });
          setPicLoading(false);
        }
      };


    return (
        <VStack spacing="5px">
        <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            />
        </FormControl>
        <FormControl id="email" isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter Your Email Address"
            />
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type = {show ? "text" : "password"} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"/>
                <InputRightElement width= '5rem'>
                    <Button height= '1.6rem' marginTop= '1rem' onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
            </FormControl>

            <FormControl id="password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input type = {show ? "text" : "password"} onChange={(e) => setConfirmpassword(e.target.value)}
                placeholder="Enter your password"/>
                <InputRightElement width= '5rem'>
                    <Button height= '1.6rem' marginTop= '1rem' onClick={handleClick}>
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
            accept="image/jpeg, image/png"
            onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>
        <Button isLoading = {picLoading} marginTop='10px' width='100%' colorScheme='green' onClick={SignUpHandler}>Sign Up</Button>
        </VStack>
        
    )
}

export default Login
