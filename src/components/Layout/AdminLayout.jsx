import React, { useState } from 'react'
import { Box, Drawer, Grid, IconButton, Stack, Typography, styled } from '@mui/material'
import { grayColor, matBlack } from '../../constants/color'
import { Close as CloseIcon, ExitToApp, Groups, ManageAccounts, Menu as MenuIcon, Message } from '@mui/icons-material'
import { Navigate, useLocation } from 'react-router-dom'
import { Dashboard } from "@mui/icons-material";
import { Link as LinkComponent } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { adminLogout } from '../../redux/thunks/admin'

const Abc = styled(LinkComponent)`
 text-decoration: none;
 border-radius: 2rem;
 padding: 1rem 2rem;
 color: black;
 &:hover {
    color: rgba(0,0,0,0.54);
 }
`;

export const adminTabs = [{
    name:"Dashboard",
    path:"/admin/dashboard",
    icon:<Dashboard />
},
{
    name:"Users",
    path:"/admin/users-management",
    icon:<ManageAccounts />
},{
    name:"Chats",
    path:"/admin/chats-management",
    icon:<Groups />
},{
    name:"Messages",
    path:"/admin/messages",
    icon:<Message />
}]

const SideBar = ({w}) => {
    const location = useLocation();
    const diapatch = useDispatch();

    const logoutHandler = () => {
        diapatch(adminLogout());
    }

    return (
        <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
            <Typography variant='h5' textTransform={"uppercase"}>
              Textit
            </Typography>
            <Stack spacing={"1rem"}>
              {adminTabs.map((tab)=> (
                <Abc key={tab.path} to={tab.path} sx={location.pathname === tab.path && {
                    bgcolor: matBlack,
                    color: "white",
                }}>
                <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                    {tab.icon}
                    <Typography fontSize={"1.2rem"}>
                        {tab.name}
                    </Typography>
                </Stack>
                </Abc>
              ))}

              <Abc onClick={logoutHandler}>
                <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                    <ExitToApp />
                    <Typography fontSize={"1.2rem"}>
                        Logout
                    </Typography>
                </Stack>
                </Abc>
            </Stack>
        </Stack>
    )
}

const AdminLayout = ({children}) => {

  const {isAdmin} = useSelector (state => state.auth);

  const [isMobile,setIsMobile] = useState(false);

  const handleMobile = () => {setIsMobile(!isMobile)};

  const handleClose = () => {setIsMobile(false)};

  if(!isAdmin) return <Navigate to={"/admin"} />
  return (
    <Grid container minHeight={"100vh"}>

        <Box
          sx={{
            display: {xs:'block',md:'none'},
            position: "fixed",
            right: '1rem',
            top:'1rem',
          }}
        >
          <IconButton onClick={handleMobile}>
            {isMobile ? <CloseIcon /> : <MenuIcon />}
          </IconButton>   
        </Box>

        <Grid item md={4} lg={3} sx={{display:{xs:"none",md:"block"}}}>
            <SideBar />
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          lg={9}
          sx={{
            bgcolor: grayColor,
          }}
        >
            {children}
        </Grid>

        <Drawer open={isMobile} onClose={handleClose}>
          <SideBar w="50vw"/>
        </Drawer>
    </Grid>
  )
}

export default AdminLayout