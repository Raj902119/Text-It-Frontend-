import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isNewGroup: false,
    isAddMembers: false,
    isNotification: false,
    isMobileMenu: false,
    isSearch: false,
    isFileMenu: false,
    isDeleteMenu: false,
    uploadingLoader: false,
    selectedDeleteChat: {
        chatId: "",
        groupChat: false,
    },
};

const miscSlice = createSlice({
    name: "misc",
    initialState,
    reducers: {
        setIsNewGroup: (state, action) => {
            state.isNewGroup = action.payload;
        },
        setIsAddMembers: (state, action) => {
            state.isAddMembers = action.payload;
        },
        setIsNotification: (state, action) => {
            state.isNotification = action.payload;
        },
        setIsMobileMenu: (state, action) => {
            state.isMobileMenu = action.payload;
        },
        setIsSearch: (state, action) => {
            state.isSearch = action.payload;
        },
        setIsFileMenu: (state, action) => {
            state.isFileMenu = action.payload;
        },
        setIsDeleteMenu: (state, action) => {
            state.isDeleteMenu = action.payload;
        },
        setuploadingLoader: (state, action) => {
            state.uploadingLoader = action.payload;
        },
        setselectedDeleteChat: (state, action) => {
            state.selectedDeleteChat = action.payload;
        }
    },
});

export default miscSlice;
export const {
    setIsAddMembers,
    setIsDeleteMenu,
    setIsFileMenu,
    setIsMobileMenu,
    setIsNewGroup,
    setIsNotification,
    setIsSearch,
    setselectedDeleteChat,
    setuploadingLoader,
} = miscSlice.actions;