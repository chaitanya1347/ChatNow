import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
  } from "@chakra-ui/react";
import Login from './Login';
import SignUp from './SignUp';
import { useNavigate } from 'react-router-dom';
function Homepage() {

  const navigate = useNavigate();
  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if(userInfo){
        navigate('/app/welcome');
    }

},[])

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
        <Text align= 'center' userSelect='none'  fontSize="4xl" fontFamily="Work sans">
          Chat-App
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant='soft-rounded'>
            <TabList mb = '1em'>
                <Tab width='50%'>Login</Tab>
                <Tab width='50%'>Sign Up</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Login/>
                </TabPanel>
                <TabPanel>
                <SignUp/>
                </TabPanel>
            </TabPanels>
            </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage
