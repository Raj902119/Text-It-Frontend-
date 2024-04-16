import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Typography } from '@mui/material'
import React, { Suspense, useEffect, useState } from 'react'
import { matBlack } from '../constants/color'
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { useNavigate,useSearchParams } from 'react-router-dom'
import { Link } from '../components/Styled/StyledComponents'
import AvatarCard from '../components/shared/AvatarCard'
import { sampleChats, sampleUsers } from '../constants/sampleData'
import { memo } from 'react'
import {Tooltip} from '@mui/material'
import { lazy } from 'react'
import UserItem from '../components/shared/UserItem'
import { useAddGroupMemberMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import Loaders from '../components/Layout/Loaders'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMembers } from '../redux/reducers/misc'

const ConfirmDeleteDialog = lazy(()=>import("../dialogs/ConfirmDeleteDialog"));
const AddMemberDialog = lazy(()=>import("../dialogs/AddMemberDialog"));

const Group = () => {
  const dispatch = useDispatch();
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  const {isAddMembers} = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    {chatId, populate: true},
    {skip: !chatId}
  );

  const [updateGroup,isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);

  const [removeMember,isLoadingremoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);
  const [deleteGroup,isLoadingdeleteGroup] = useAsyncMutation(useDeleteChatMutation);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateBack= () => {
    navigate("/");
  };
  const handleMobile = () => {
    setIsMobileMenuOpen((prev)=> !prev);
  };
  const handleMobileClose = () => setIsMobileMenuOpen(false);
  const [groupName, setgroupName] = useState("");
  const [groupNameUpdatedValue,setgroupNameUpdatedValue] = useState("");
  const [isEdit,setIsEdit] = useState(false);
  const [confirmDeleteDialog,setconfirmDeleteDialog] = useState(false);


  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(()=>{
    if(groupDetails.data) {
      setgroupName(groupDetails.data.chat.name);
      setgroupNameUpdatedValue(groupDetails.data.chat.name);
      setMembers(groupDetails.data.chat.members);
    }

    return ()=>{
      setgroupName("");
      setgroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    }
  },[groupDetails.data]);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("UpdateGroupName...",{
      chatId,
      name: groupNameUpdatedValue,
    })
  };
  const openAddMemberHandler = () => {
    dispatch(setIsAddMembers(true));
  };
  const openConfirmDeleteHandler = () => {
    setconfirmDeleteDialog(true);
  };
  const closeConfirmDeleteHandler = () => {
    setconfirmDeleteDialog(false);
  };
  const deleteHandler = () => {
    deleteGroup("Delete Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/group")
  };
  const removeMemberHandler =(userId) => {
    removeMember("RemoveMember...",{chatId,userId});
  };

  useEffect(()=>{
    if(chatId){
    setgroupName(`Group Name ${chatId}`);
    setgroupNameUpdatedValue(`Group Name ${chatId}`);
  }
     
    return () => {
      setIsEdit(false);
      setgroupName("");
      setgroupNameUpdatedValue("");
    }
  },[chatId]);

    const IconBtns = (
      <>
      <Box
        sx={{
          display: {
            xs:"block",
            sm:"none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>
        <Tooltip title="black">
            <IconButton
              sx={{
                position:"absolute",
                top:"2rem",
                left:"2rem",
                bgcolor:matBlack,
                color:"white",
                ":hover":{
                  bgcolor:"rgba(0,0,0,0.7)",
                },
              }}
              onClick={navigateBack}
            > 
              <KeyboardBackspaceIcon />
            </IconButton>
        </Tooltip>
      </>
    );

    const GroupName = (
    
    <Stack 
      direction={"row"} 
      alignItems={"center"} 
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
        {isEdit ? 
          (<>
            <TextField 
              value={groupNameUpdatedValue}
              onChange={(e)=> setgroupNameUpdatedValue(e.target.value)}
            />
            <IconButton onClick={updateGroupName} disabled={isLoadingGroupName} >
              <DoneIcon />
            </IconButton>
          </>) : 
          (<>
          <Typography variant='h4'>{groupName}</Typography>
          <IconButton onClick={()=> setIsEdit(true)} disabled={isLoadingGroupName} >
            <EditIcon />
          </IconButton>
          </>)
        }
    </Stack>)

    const ButtonGroup = (
      <Stack
        direction={{
          xs: "column-reverse",
          sm: "row"
        }}
        spacing={"1rem"}
        p={{
          xs:"0",
          sm: "1rem",
          md: "1rem 4rem"
        }}
      >
        <Button size='large' color='error' startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>
          Delete Group
        </Button>
        <Button size='large' variant='contained' startIcon={<AddIcon />} onClick={openAddMemberHandler}>
          Add Member
        </Button>
      </Stack>
    );
    
    return myGroups.isLoading ? <Loaders /> : (
      <Grid container height={"100vh"}>
        <Grid
          item
          overflow={'auto'}
          height={"100%"}
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
            bgcolor:'bisque'
          }}
          sm={4}
        >
          <GroupList myGroups={myGroups?.data?.groups} chatId={chatId}/>
        </Grid>

        <Grid
          item 
          xs={12}
          sm={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            padding: "1rem 3rem",
          }}
        >
            {IconBtns}

            {groupName && (
              <>
                {GroupName}

                <Typography
                  margin={"2rem"}
                  alignSelf={"flex-start"}
                  variant='body1'
                >
                  Members
                </Typography>

                <Stack
                  maxWidth={"45rem"}
                  width={"100%"}
                  boxSizing={"border-box"}
                  padding={{
                    sm: "1rem",
                    xs: "0",
                    md: "1rem 4rem"
                  }}
                  spacing={"2rem"}
                  height={"50vh"}
                  overflow={"auto"}
                >
                 {/* Members */}

                {isLoadingremoveMember ? (<CircularProgress />) : members.map((i) => (
                  <UserItem 
                    user={i}
                    key={i._id}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={removeMemberHandler}
                  />
                ))}
                </Stack>
                {ButtonGroup}
              </>
          )}
        </Grid>

        {
          isAddMembers && 
          <Suspense fallback={<Backdrop open />}>
             <AddMemberDialog chatId={chatId}/>
          </Suspense>
        }

        {
          confirmDeleteDialog && 
          <Suspense fallback={<Backdrop open/>}>
              <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler}/>
          </Suspense>
        }

        <Drawer sx={{
            display: {
              xs: "block",
              sm:"none",
            }
            
        }} 
        open={isMobileMenuOpen} 
        onClose={handleMobileClose}
        >
            <GroupList w='50vw' myGroups={myGroups?.data?.groups} chatId={chatId}/>
        </Drawer>
      </Grid>
    )
};

const GroupList = ({w="100%",myGroups=[],chatId}) => {
    return (<Stack width={w} sx={{bgcolor:'bisque'}}>
      {myGroups.length > 0 ? (
        myGroups.map((group) => <GroupListItem group={group} chatId={chatId} key={group._id}/>)
      ): (
        <Typography textAlign={"center"} padding={"1rem"}>
          No Groups
        </Typography>
      )}
    </Stack>)
};

const GroupListItem = memo(({group, chatId})=>{
  const {name, avatar, _id} = group;
  return (
    <Link to={`?group=${_id}`} onClick={e=>{if(chatId===_id) e.preventDefault()}}>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar}/>
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
})


export default Group