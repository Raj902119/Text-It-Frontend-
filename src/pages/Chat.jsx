import React, { useCallback, useEffect, useState } from 'react'
import AppLayout from '../components/Layout/AppLayout.jsx'
import { useRef } from 'react';
import {useDispatch} from "react-redux"
import { Fragment } from 'react';
import { grayColor, orange } from '../constants/color';
import { IconButton, Stack, Skeleton } from '@mui/material';
import { AttachFile as AttachFileIcon, Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/Styled/StyledComponents.jsx';
import FileMenu from '../dialogs/FileMenu.jsx';
import { sampleMessage } from '../constants/sampleData.js';
import MessageCom from '../components/shared/MessageCom.jsx';
import { getSocket } from '../socket.jsx';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events.js';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api.js';
import { useErrors, useSocketEvents } from '../hooks/hook.jsx';
import {useInfiniteScrollTop} from "6pp";
import { setIsFileMenu } from '../redux/reducers/misc.js';
import { removeNewMessagesAlert } from '../redux/reducers/chat.js';
import { TypingLoader } from '../components/Layout/Loaders.jsx';
import { useNavigate } from 'react-router-dom';


const Chat = ({chatId, user}) => {
  const containerRef = useRef(null);
  const socket = getSocket();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const bottomRef = useRef(null);

  const [message,setMessage] = useState("");
  const [messages,setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [filemenuanchor,setFilemenuanchor] = useState(null);

  const [IamTyping,setIamTyping] = useState(false);
  const [userTyping,setuserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({chatId, skip:!chatId});

  const oldMessagesChunk = useGetMessagesQuery({chatId, page});

  const {data : oldMessages, setData: setOldMessages} = 
  useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError : chatDetails.isError,
      error: chatDetails.error
    },
    { isError : oldMessagesChunk.isError,
      error: oldMessagesChunk.error
    }
];

  const members = chatDetails?.data?.chat?.members;

  const MessageOnChange = (e) => {
    setMessage(e.target.value);
    if(!IamTyping) {
      socket.emit(START_TYPING, {members, chatId});
      setIamTyping(true);
    }

    if(typingTimeout.current) clearTimeout(typingTimeout.current);
    
    typingTimeout.current = setTimeout(()=>{
      socket.emit(STOP_TYPING,{members,chatId});
      setIamTyping(false);
    },[2000]);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true)); // Dispatch an action to set the file menu state to open
    setFilemenuanchor(e.currentTarget); 
  };

  const SubmitHandler = (e) => {
    e.preventDefault();

    if(!message.trim()) return;
    
    //emiting message to the server
    socket.emit(NEW_MESSAGE,{chatId,members,message});
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED,{userId:user._id,members})
    dispatch(removeNewMessagesAlert(chatId));
    
    return () => {
      setMessage("");
      setMessages([]);
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED,{userId:user._id,members})
    };
  },[chatId])  

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({behavior: "smooth"});
  },[message]);

  useEffect(()=>{
    if(chatDetails.isError) return navigate("/")
  },[chatDetails.isError]);

  const socketEventHandler = useCallback((data) => {
    if(data.chatId !== chatId) return;
    setMessages((prev) => [...prev, data.message]);
  }, [chatId]);

  const startTypingListener = useCallback((data) => {
    if(data.chatId !== chatId) return;
    console.log("typing", data);
    setuserTyping(true);
  }, [chatId]);
  
  const stopTypingListener = useCallback((data) => {
    if(data.chatId !== chatId) return;
    console.log("typing", data);
    setuserTyping(false);
  }, [chatId]);

  const alertListener = useCallback((data) => {
    if(data.chatId !== chatId) return;
    const messageForAlert = {
      content: data.message,
      sender: {
        _id: "sdsffhffsl",
        name: "Admin",
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, messageForAlert]);
  }, [chatId]);

  const eventArr = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: socketEventHandler,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket,eventArr);

  const allMessages = [...oldMessages, ...messages];

  useErrors(errors);

  return chatDetails.isLoading ? (<Skeleton />) : (
     <Fragment>
     <div></div>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX:"hidden",
          overflowY:"auto",
        }}
      >
          {allMessages.map((i) => (
            <MessageCom key={i._id} message={i} user={user} />
          ))}

          {userTyping && <TypingLoader />}

          <div ref={bottomRef} />
      </Stack>

      <form
        style={{
            height:"10%"
        }}
        onSubmit={SubmitHandler}
      >
          <Stack
            direction={"row"}
            height={"100%"}
            padding={"1rem"}
            alignItems={"center"}
            position={"relative"}
          >
            <IconButton
              sx={{
                position: "absolute",
                left: "1.5rem",
                rotate: "30deg",
              }}
              onClick={handleFileOpen}
            >
              <AttachFileIcon />
            </IconButton>

            <InputBox 
              placeholder='Type Message Here....'
              value={message}
              onChange={MessageOnChange}
            />

            <IconButton 
              type='submit'
              sx={{
                rotate: "-25deg",
                bgcolor: orange,
                color: "white",
                marginLeft: "1rem",
                padding: "0.5rem",
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }} 
            >
              <SendIcon />
            </IconButton>
          </Stack>

      </form>

      <FileMenu anchorEl={filemenuanchor} chatId={chatId} />
     </Fragment>
  );
};

export default AppLayout()(Chat);