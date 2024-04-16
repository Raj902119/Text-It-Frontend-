import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import React, { memo } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../redux/api/api';
import { setIsNotification } from '../redux/reducers/misc';

const NotificationDialog = () => {

  const {isLoading,data, error, isError} = useGetNotificationsQuery();
  const dispatch = useDispatch();

  const {isNotification} = useSelector(state=>state.misc);
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const closeHandler = () => {
    dispatch(setIsNotification(false));
  };

  const friendRequestHandler = async ({_id,accept}) => {
    dispatch(setIsNotification(true));
    await acceptRequest("Accepting...", {requestId: _id, accept});
    closeHandler();
  };

  useErrors([{error, isError}]);

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
        <Stack p={{xs:"1rem",sm:"2rem"}} maxWidth={"25rem"}>
            <DialogTitle>Notification</DialogTitle>

            {isLoading ? (<Skeleton />) : (
              <>
              {data?.requests.length > 0 ? (
              data?.requests?.map(({sender, _id}) => (
                <NotificationItem 
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                  key={_id}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>0 notifications</Typography>
              )
            }
              </>
            )}
        </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({sender, _id, handler}) => {
  const {name,avatar } = sender
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
              {`${name} send you a friend request.`}
          </Typography>

          <Stack direction={{
              xs: "column",
              sm: "row",
            }}
          >
            <Button onClick={()=> handler({_id, accept: true})}>Accept</Button>
            <Button color='error' onClick={()=> handler({_id,accept: false})}>Reject</Button>
          </Stack>
      </Stack>
  </ListItem>
    )
  }
)

export default NotificationDialog