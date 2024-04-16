import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT } from "../../constants/events";

const initialState = {
    notificationCount: 0,
    newMessagesAlert: getOrSaveFromStorage({
        key:NEW_MESSAGE_ALERT,
        get:true
    }) || 
    [
        {
            chatId: "",
            count: 0,
        },
    ]
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        incrementNotification: (state) => {
            state.notificationCount +=1;
        },
        resetNotification: (state) => {
            state.notificationCount = 0;
        },
        setNewMessagesAlert: (state,action) => {

            const chatID = action.payload.chatId;
            const index = state.newMessagesAlert.findIndex(
                (item) => item.chatId === chatID
            );

            if(index !== -1) {
                state.newMessagesAlert[index].count += 1;
            }else {
                state.newMessagesAlert.push({
                    chatId:chatID,
                    count: 1,
                });
            }
        },
        removeNewMessagesAlert: (state, action) => {
            state.newMessagesAlert = state.newMessagesAlert.filter(
                (item) => item.chatId !== action.payload
            );
        },
    },
});

export default chatSlice;
export const {incrementNotification,removeNewMessagesAlert,resetNotification,setNewMessagesAlert} = chatSlice.actions;