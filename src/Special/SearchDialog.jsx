import React, { useState,useEffect } from 'react'
import { 
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField
}
from '@mui/material';
import { useInputValidation } from '6pp';
import { Search as SearchIcon } from '@mui/icons-material';
import UserItem from '../components/shared/UserItem';
import { sampleUsers } from '../constants/sampleData';
import {useSelector,useDispatch} from "react-redux";
import { setIsSearch } from '../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../redux/api/api';
import toast from "react-hot-toast"
import { useAsyncMutation } from '../hooks/hook';


const SearchDialog = () => {
  const search = useInputValidation("");

  const [sendFriendRequest,isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);

  const dispatch = useDispatch();
   
  const [users, setusers] = useState([]);

  const {isSearch} = useSelector(state=>state.misc);

  const [searchUser] = useLazySearchUserQuery();

  const addFriendHandler =async (id) => {
    await sendFriendRequest("Sending friend request...", {userId: id});
  }

  const searchCloaseHandler=()=>{
    dispatch(setIsSearch(false));
  }

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      searchUser(search.value)
        .then(({data}) => setusers(data.users))
        .catch((e) => console.log(e));
    },1000);

    return () => {
      clearTimeout(timeOutId);
    };

  },[search.value]);

  return (
    <Dialog open={isSearch} onClose={searchCloaseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
          <DialogTitle textAlign={"center"}>
             Find People
          </DialogTitle>
          <TextField
              label=""
              value={search.value}
              onChange={search.changeHandler}
              variant='outlined'
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
          />

          <List>
            {users.map((i)=>(
              <UserItem 
                user={i} 
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))}
          </List>
      </Stack>
    </Dialog>
  )
}

export default SearchDialog