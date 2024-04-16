import { Avatar, ListItem, Stack, Typography, IconButton } from '@mui/material';
import React from 'react'
import { Add as AddIcon, Remove } from '@mui/icons-material';
import { memo } from 'react'

const UserItem = ({user, handler, handlerIsLoading, isAdded}) => {
    const {name, _id, avatar} = user;
  return (
    <ListItem>
        <Stack
           direction={"row"}
           alignItems={"center"}
           spacing={"1rem"}
           width={"100%"}
        >
            <Avatar src={avatar}/>

            <Typography
                variant='body1'
                sx={{
                    flexGrow:1,
                    display:"-webkit-flex",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                }}
            >
                {name}
            </Typography>

            <IconButton 
                size='small'
                sx={{
                    bgcolor: isAdded ? "error.main" : "primary.main",
                    color: "white",
                    "&:hover": {
                        bgcolor:  isAdded ? "error.dark" :"primary.dark",
                    },
                }}
                onClick={()=> handler(_id)}
                disabled={handlerIsLoading}
            >
                {isAdded ? <Remove /> : <AddIcon />}
            </IconButton>
        </Stack>
    </ListItem>
  )
}

export default memo(UserItem)