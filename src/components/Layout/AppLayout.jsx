import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../shared/Header'
import Title from '../shared/Title'
import { Grid,Skeleton } from '@mui/material'
import ChatList from '../../Special/ChatList'
import Drawer from '@mui/material/Drawer';
import {useSelector,useDispatch} from "react-redux";
import { sampleChats } from '../../constants/sampleData'
import { useNavigate, useParams } from 'react-router-dom'
import Profile from '../../Special/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { setIsDeleteMenu, setIsMobileMenu, setselectedDeleteChat } from '../../redux/reducers/misc'
import {toast} from "react-hot-toast"
import { useErrors, useSocketEvents } from '../../hooks/hook'
import { getSocket } from '../../socket'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events'
import {incrementNotification, setNewMessagesAlert} from "../../redux/reducers/chat.js"
import { getOrSaveFromStorage } from '../../lib/features.js'
import DeleteChatMenu from '../../dialogs/DeleteChatMenu.jsx'


/* AppLayout is a higher-order components (HOC) that wraps other 
components and provides a common layout structure. */
const AppLayout = () => (WrappedComponent) => {
  return (props) => {

    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const chatId = params.id;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers,setOnlineUsers] = useState([]);

    const socket = getSocket();

    const {isMobileMenu} = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);


    const {isLoading,data,isError,error,refetch} = useMyChatsQuery("");

    useErrors([{isError,error}]);

    useEffect(() => {
      getOrSaveFromStorage({key: NEW_MESSAGE_ALERT, value: newMessagesAlert});
    },[newMessagesAlert])

    const handleDeleteChat=(e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setselectedDeleteChat({chatId,groupChat}))
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobileMenu(false));

    const newMessageAlertHandler = useCallback((data) => {
      if(data.chatId === chatId) return; 
      dispatch(setNewMessagesAlert(data));
    }, [chatId]);

    const newRequestListener = useCallback(() => {
        dispatch(incrementNotification())
    }, [dispatch]);

    const refetchListener = useCallback(() => {
        refetch();
        navigate("/");
  }, [refetch,navigate]);

  const onlineUsersListener = useCallback((data) => {
    setOnlineUsers(data);
}, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket,eventHandlers);


    return (
    <>
        <Title />
        <Header />
        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

        {isLoading ? (
                <Skeleton />
            ) : (
                <Drawer open={isMobileMenu} onClose={handleMobileClose}>
                  <ChatList
                    w='70vw'
                    chats={data?.chats}
                    chatId={chatId}
                    handleDeleteChat={handleDeleteChat}
                    newMessagesAlerts={newMessagesAlert}
                    onlineUsers={onlineUsers}
                  />
                </Drawer>
            )
        }

        <Grid container height={"calc(100vh - 4rem)"}>
            <Grid item sm={4} md={3} sx={{display: {xs:"none", sm:"block"}}} height={'100%'}>
                {isLoading ? (<Skeleton />) : (
                    <ChatList 
                      chats={data?.chats} 
                      chatId={chatId}   
                      handleDeleteChat={handleDeleteChat}  
                      newMessagesAlerts={newMessagesAlert}
                      onlineUsers={onlineUsers}
                />)}
            </Grid>
            <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
                <WrappedComponent {...props} chatId={chatId} user={user} />
            </Grid>
            <Grid item md={4} lg={3} sx={{display: {xs:"none",md:"block"},padding:"rgba(0,0,0,0.85)"}}  bgcolor="black" height={"100%"}>
                <Profile user={user}/>
            </Grid>
        </Grid>
    </>
  )
    }
}

export default AppLayout;