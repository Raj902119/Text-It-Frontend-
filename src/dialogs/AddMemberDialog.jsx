import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserItem from "../components/shared/UserItem";
import { sampleUsers } from "../constants/sampleData";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { useAddGroupMemberMutation, useMyFriendsQuery } from "../redux/api/api";
import { setIsAddMembers } from "../redux/reducers/misc";

const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setselectedMembers] = useState([]);
  const { isAddMembers } = useSelector((state) => state.misc);

  const { isLoading, data, isError, error } = useMyFriendsQuery(chatId);

  const [addMember, isLoadingaddMember] = useAsyncMutation(
    useAddGroupMemberMutation
  );

  const selectMemberHandler = (id) => {
    setselectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMembers(false));
  };

  const addMemberSubmitHandler = () => {
    addMember("Adding Members...", { members: selectedMembers, chatId });
    closeHandler();
  };

  useErrors([{ isError, error }]);

  return (
    <Dialog open={isAddMembers} onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>

        <Stack spacing={"1rem"}>
          {isLoading ? (
            <Skeleton />
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friend</Typography>
          )}
        </Stack>

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            variant="contained"
            disabled={isLoadingaddMember}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
