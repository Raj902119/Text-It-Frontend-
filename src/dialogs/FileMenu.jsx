import { Menu } from "@mui/material";
import React, { memo,useRef } from "react";
import { useSelector,useDispatch } from "react-redux";
import { setIsFileMenu, setuploadingLoader } from "../redux/reducers/misc";
import { AudioFile, Image, UploadFile, VideoFile } from "@mui/icons-material";
import { MenuList, MenuItem, Tooltip, ListItemText } from "@mui/material"
import toast from "react-hot-toast"
import { useSendAttachmentsMutation } from "../redux/api/api";
import { Form } from "react-router-dom";

const FileMenu = ({ anchorEl, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const dispatch = useDispatch();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const fileChangeHandler =async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <=0) return;

    if(files.length >5)
      return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setuploadingLoader(true));
    
    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);
      files.forEach((file) => {
        myForm.append("files", file)
      });

      const res =  await sendAttachments(myForm);

      if(res.data) toast.success(`${key} send successfully`, {
        id: toastId
      });
      else toast.error(`Failed to send ${key}`, {
        id:toastId
      });

    } catch (error) {
      
    }

  };

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();


  return (
    <Menu anchorEl={anchorEl} open={isFileMenu} onClose={closeFileMenu}>
      <div
        style={{
          width: "10rem",
        }}
      > 
      <MenuList>
        <MenuItem onClick={selectImage}>
          <Tooltip title="Image">
            <Image />
          </Tooltip>
          <ListItemText style={{marginLeft: "0.5rem"}}>
          Image
          </ListItemText>
          <input 
            type="file"
            multiple
            accept="image/png,image/jpeg,image/gif"
            style={{display: "none"}}
            ref={imageRef}
            onChange={(e) => fileChangeHandler(e, "Images")}
          />
        </MenuItem>
        <MenuItem onClick={selectAudio}>
          <Tooltip title="Audio">
            <AudioFile />
          </Tooltip>
          <ListItemText style={{marginLeft: "0.5rem"}}>
          Audio
          </ListItemText>
          <input 
            type="file"
            multiple
            accept="audio/mpeg,audio/wav"
            style={{display: "none"}}
            ref={audioRef}
            onChange={(e) => fileChangeHandler(e, "Audios")}
          />
        </MenuItem>
        <MenuItem onClick={selectVideo}>
          <Tooltip title="Video">
            <VideoFile />
          </Tooltip>
          <ListItemText style={{marginLeft: "0.5rem"}}>
          Video
          </ListItemText>
          <input 
            type="file"
            multiple
            accept="video/mp4,video/webm,video/ogg"
            style={{display: "none"}}
            ref={videoRef}
            onChange={(e) => fileChangeHandler(e, "Videos")}
          />
        </MenuItem>
        <MenuItem onClick={selectFile}>
          <Tooltip title="File">
            <UploadFile />
          </Tooltip>
          <ListItemText style={{marginLeft: "0.5rem"}}>
          File
          </ListItemText>
          <input 
            type="file"
            multiple
            accept="*"
            style={{display: "none"}}
            ref={fileRef}
            onChange={(e) => fileChangeHandler(e, "Files")}
          />
        </MenuItem>
      </MenuList>
      </div>
    </Menu>
  );
};
export default memo(FileMenu);
