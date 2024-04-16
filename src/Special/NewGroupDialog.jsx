import React, { useState } from 'react'
import { 
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography
}
from '@mui/material';
import UserItem from '../components/shared/UserItem';
import { sampleUsers } from '../constants/sampleData';
import { useInputValidation } from '6pp';
import {useDispatch, useSelector} from "react-redux"
import { useMyFriendsQuery, useNewGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { setIsNewGroup } from '../redux/reducers/misc';

import toast from "react-hot-toast";


const NewGroupDialog = () => {

  const {isNewGroup} = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  
  const groupName = useInputValidation("");


  const {isError, isLoading, error, data} = useMyFriendsQuery();

  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>(prev.includes(id) ? prev.filter((curr)=>curr !== id) : [...prev,id]));
  };

  console.log(data);

  const submitHandler = () => {
    if(!groupName.value) return toast.error("Group name is required");

    if(selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

      newGroup("Welcome to new group...",{name: groupName.value, members: selectedMembers}); 

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  }

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
    <Stack p={{xs:"1rem",sm:"3rem"}} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>

        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>

        <Typography variant='body1'>Members</Typography>

        <Stack marginTop={"1rem"}>

          {isLoading ? (<Skeleton />) : (
            data?.friends?.map((i)=>(
              <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
            ))
          )}
        </Stack>

        <Stack marginTop={"1rem"} direction={"row"} justifyContent={"space-around"}>
            <Button variant='text' color='error' onClick={closeHandler}>
                Cancel
            </Button>
            <Button variant='contained' onClick={submitHandler}>Create</Button>
        </Stack>
    </Stack>
</Dialog>
  )
}

export default NewGroupDialog