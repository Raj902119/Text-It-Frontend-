import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from '../../constants/config';

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/`}),
    tagTypes: ["Chat","User","Message"],

    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: "chat/my",
                credentials: "include",
            }),
            providesTags: ["Chat"],
        }),
        searchUser: builder.query({
            query: (name) => ({
                url: `user/search?name=${name}`,
                credentials: "include",
            }),
            providesTags: ["User"],
        }),
        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: "/user/sendReq",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
        getNotifications: builder.query({
            query: () => ({
                url: `user/notification`,
                credentials: "include",
            }),
            keepUnusedDataFor:0,
        }),
        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: "/user/acceptReq",
                method: "PUT",
                credentials: "include",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),
        chatDetails: builder.query({
            query: ({chatId,populate=false}) => {
                let url = `chat/${chatId}`;
                if (populate) url += "?populate=true";

                return {
                    url,
                    credentials: "include",
                }
            },
            providesTags: ["Chat"],
        }),
        getMessages: builder.query({
            query: ({chatId,page}) => ({
                url : `chat/messages/${chatId}?page=${page}`,
                credentials: "include",
            }),
            keepUnusedDataFor: 0,
        }),
        sendAttachments: builder.mutation({
            query: (data) => ({
                url: "/chat/message",
                method: "POSt",
                credentials: "include",
                body: data,
            }),
        }),
        myGroups: builder.query({
            query: () => ({
                url: "chat/my/groups",
                credentials: "include",
            }),
            providesTags: ["Chat"],
        }),
        myFriends: builder.query({
            query: (chatId) => {
                let url = `user/friends`;
                if (chatId) url += `?chatId=${chatId}`;

                return {
                    url,
                    credentials: "include",
                }
            },
            providesTags: ["Chat"],
        }),
        newGroup: builder.mutation({
            query: ({name,members}) => ({
                url: "/chat/new",
                method: "POSt",
                credentials: "include",
                body: {name,members},
            }),
            invalidatesTags:["Chat"],
        }),
        renameGroup: builder.mutation({
            query: ({chatId,name}) => ({
                url: `/chat/${chatId}`,
                method: "PUT",
                credentials: "include",
                body: {name},
            }),
            invalidatesTags:["Chat"],
        }),
        addGroupMember: builder.mutation({
            query: ({chatId,members}) => ({
                url: `/chat/addmembers`,
                method: "PUT",
                credentials: "include",
                body: {chatId,members},
            }),
            invalidatesTags:["Chat"],
        }),
        removeGroupMember: builder.mutation({
            query: ({chatId,userId}) => ({
                url: `/chat/removemember`,
                method: "PUT",
                credentials: "include",
                body: {chatId,userId},
            }),
            invalidatesTags:["Chat"],
        }),
        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `/chat/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags:["Chat"],
        }),
        leaveGroup: builder.mutation({
            query: (chatId) => ({
                url: `/chat/leave/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags:["Chat"],
        }),
    }),
}); 

export default api;

export const { 
    useMyChatsQuery,
    useLazySearchUserQuery,
    useSendFriendRequestMutation,
    useGetNotificationsQuery,
    useAcceptFriendRequestMutation,
    useChatDetailsQuery,
    useGetMessagesQuery,
    useSendAttachmentsMutation,
    useMyGroupsQuery,
    useMyFriendsQuery,
    useNewGroupMutation,
    useRenameGroupMutation,
    useRemoveGroupMemberMutation,
    useAddGroupMemberMutation,
    useDeleteChatMutation,
    useLeaveGroupMutation,
} = api;