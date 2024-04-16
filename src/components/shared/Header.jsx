import React,{Suspense, lazy} from 'react'
import {orange} from "../../constants/color"
import { Typography,Box,AppBar,Toolbar, IconButton, Tooltip, Backdrop } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import Badge from '@mui/material/Badge';
import { Search as SearchIcon } from '@mui/icons-material'
import { Add as AddIcon } from '@mui/icons-material'
import { Group as GroupIcon } from '@mui/icons-material'
import { Logout as LogoutIcon } from '@mui/icons-material'
import { Notifications as NotificationIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { userNotExist } from '../../redux/reducers/auth'
import { server } from '../../constants/config'
import {toast} from "react-hot-toast"
import axios from 'axios'
import { setIsMobileMenu, setIsNotification, setIsSearch, setIsNewGroup } from '../../redux/reducers/misc'
import {useSelector,useDispatch} from "react-redux";
import { resetNotification } from '../../redux/reducers/chat';

const SearchDia = lazy(()=>import("../../Special/SearchDialog"));
const NotificationDia = lazy(()=>import("../../Special/NotificationDialog"));
const NewGroupDia = lazy(()=>import("../../Special/NewGroupDialog"));

const Header = () => {

    const dispatch = useDispatch();

    const {isSearch, isNotification} = useSelector(state=> state.misc);
    const { notificationCount } = useSelector(state => state.chat);
    const {isNewGroup} = useSelector(state => state.misc);

    const navigate = useNavigate();

    const handleMobile = () => {
        dispatch(setIsMobileMenu(true))
    }
    const openSearch = () => {
        dispatch(setIsSearch(true));
    }
    const openNewGroup = () => {
        dispatch(setIsNewGroup(true));
    }
    const openNotification = () => {
        dispatch(setIsNotification(true));
        dispatch(resetNotification());
    }
    const NavigatetoGroup = () => {
        navigate("/group")
    }
    const Logout = async () => {
        try {
            const {data} = await axios.get(`${server}/api/v1/user/logout`,{
                withCredentials: true,
            });
            dispatch(userNotExist());
            toast.success(data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong");
        }
    };  

    const value = notificationCount;
  return ( 
    <>

    <Box sx={{flexGrow:1}} height={"4rem"} >
        <AppBar position="static" sx={{
            bgcolor: orange,
        }}
        >
            <Toolbar>
                <Typography variant='h6'
                sx={{
                    display: {xs:"none", sm: "block"},
                }}
                >
                   Textit
                </Typography>

                <Box 
                  sx={{
                    display: {xs:"block",sm:"none"},
                  }}
                >
                    <IconButton color="inherit" onClick={handleMobile}>
                        <MenuIcon />
                    </IconButton>
                </Box>

                <Box sx={{
                    flexGrow:1,
                }}
                />

                <Box>
                    <Tooltip title="search">
                    <IconButton color='inherit' size="large" onClick={openSearch}>
                        <SearchIcon />
                    </IconButton>
                    </Tooltip>

                    <Tooltip title="New Group">
                    <IconButton color='inherit' size="large" onClick={openNewGroup}>
                        <AddIcon />
                    </IconButton>
                    </Tooltip>

                    <Tooltip title="Manage Group">
                    <IconButton color='inherit' size="large" onClick={NavigatetoGroup}>
                        <GroupIcon />
                    </IconButton>
                    </Tooltip>

                    <Tooltip title="Notification">
                    <IconButton color='inherit' size="large" onClick={openNotification}>
                    {value ? <Badge badgeContent={value} color="error"><NotificationIcon /></Badge> : <NotificationIcon />}
                    </IconButton>
                    </Tooltip>

                    <Tooltip title="Logout">
                    <IconButton color='inherit' size="large" onClick={Logout}>
                        <LogoutIcon />
                    </IconButton>
                    </Tooltip>
                </Box>


            </Toolbar>
        </AppBar>
    </Box>

    {isSearch && (<Suspense fallback={<Backdrop open />}><SearchDia /></Suspense>)}
    {isNotification && (<Suspense fallback={<Backdrop open />}><NotificationDia /></Suspense>)}
    {isNewGroup && (<Suspense fallback={<Backdrop open />}><NewGroupDia /></Suspense>)}
    
  </>
  );
}

export default Header