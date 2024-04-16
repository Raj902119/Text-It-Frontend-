import React from 'react'
import { Avatar,Stack, Typography } from '@mui/material'
import moment from "moment";
import { transformImage } from '../lib/features';

const Profile = ({user}) => {
  return (
    <Stack height={'80%'} spacing={"2rem"} direction={"column"} alignItems={"center"} justifyContent={"center"}>
        <Avatar 
            src={transformImage(user?.avatar?.url)}
            sx={{
                width: 200,
                height: 200,
                objectFit: "contain",
                marginBottom: "1rem",
                border: "5px solid white"
            }}
        /> 
        <ProfileCard text={user?.bio} heading={"Bio"}/>
        <ProfileCard text={user?.username} heading={"UserName"} />
        <ProfileCard text={user?.name} heading={"Name"} />
        <ProfileCard text={moment(user?.createdAt).fromNow()} heading={"Jioned"} />
    </Stack>
  )
}

const ProfileCard = ({text, Icon, heading}) => (
    <Stack 
       direction={"row"}
       alignItems={"center"}
       spacing={"1rem"}
       color={"white"}
       textAlign={"center"}
    >
        {Icon && Icon}

        <Stack>
            <Typography color={"gray"} variant='caption'>
                {heading}
            </Typography>
            <Typography variant='body1'>{text}</Typography>
        </Stack>
    </Stack>
)

export default Profile