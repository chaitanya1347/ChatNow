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
    const [password, setPassword] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = ()=>{
        setShow(!show);
    }

    const loginHandler = async () => {
        setPicLoading(true);
        if (!name || !password) {
          toast({title: "Please Fill all the Fields",status: "warning",duration: 2000,isClosable: true,position: "bottom",});
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
            "/user/login",
            {name,password},
            config
          );
          toast({title: "Logged in Successful",status: "success",duration: 5000,isClosable: true,position: "bottom",});
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
            <FormLabel>User name</FormLabel>
            <Input onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your User name"
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
    <Button marginTop='10px' width='100%' colorScheme='green' onClick={loginHandler}>Sign Up</Button>
    </VStack>
  )
}

export default Login
