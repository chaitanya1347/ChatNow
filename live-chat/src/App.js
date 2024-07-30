
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Componets/Login';
import MainContainer from './Componets/MainContainer';
import Welcome from './Componets/Welcome';
import Makegroup from './Componets/Makegroup';
import Online_users from './Componets/Online_users';
import WorkArea from './Componets/WorkArea';
import Online_groups from './Componets/Online_groups';
import SignUp from './Componets/SignUp';
import Homepage from './Componets/Homepage';
import { ChakraProvider } from '@chakra-ui/react';
import GroupMembers from './Componets/GroupMembers';
  
function App() {
  return (
   
    <div className="App">
      <Routes>
        <Route path='/' element = {<ChakraProvider><Homepage/></ChakraProvider>}/>
        <Route path='app' element = {<MainContainer/>}> 
          <Route path='welcome' element = {<Welcome/>}></Route>
          <Route path='make_groups' element = {<Makegroup/>}></Route>
          <Route path='group_members' element = {<GroupMembers/>}></Route>
          <Route path='online_users' element = {<Online_users/>}></Route>
          <Route path='chat/:_id/:name' element = {<WorkArea/>}></Route>
          <Route path='groups' element = {<Online_groups/>}></Route>
        </Route>
        
      </Routes>
    </div>

  );  
}

export default App;
