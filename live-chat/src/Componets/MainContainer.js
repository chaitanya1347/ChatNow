import React, { useState } from 'react'
import "./style.css"
import Sidebar from "./Sidebar"
import WorkArea from './WorkArea'
import Welcome from './Welcome';
import Makegroup from './Makegroup';
import Online_users from './Online_users';
import logo from "./online-users.png"
import { Outlet } from 'react-router-dom';
import Online_groups from './Online_groups';
import { useDispatch, useSelector } from 'react-redux';


function MainContainer() {
  const lightTheme = useSelector((state)=>state.themeKey);
  const dispatch = useDispatch();

    return (
      <div className={'main-container' + (lightTheme ? "" : " dark-background")}>
          <Sidebar/>   

          <Outlet/>
        {/* Welcome Page */}
        {/* <Welcome/> */}

        {/* Make Group */}
        {/* <Makegroup/> */}

        {/* Online Users */}
        {/* <Online_users/> */}

        {/* Work Area */}
        {/* <WorkArea/> */}

        {/* <Online_groups/> */}

    </div>
  )
}

export default MainContainer
