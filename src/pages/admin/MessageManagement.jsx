import { useFetchData } from '6pp';
import { Box, Skeleton, Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import RenderAttachment from '../../components/shared/RenderAttachment';
import Table from '../../components/shared/Table';
import { server } from "../../constants/config";
import { useErrors } from '../../hooks/hook';
import { fileFormat, transformImage } from '../../lib/features';

const columns = [{
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
},{
    field: "attachment",
    headerName: "Attachment",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => {
      const {attachments} = params.row;
      return attachments?.length > 0 ? attachments.map((i,index) => {
        const url = i.url;
        const file = fileFormat(url);
        const uniquekey=`${url}-${index}`;

        return (
          <Box key={uniquekey}>
            <a
              href={url}
              download
              target='_black'
              style={{
                color: "black",
              }}
            >
                <RenderAttachment file={file} url={url}/>
            </a>
          </Box>
        )
      }) : "No Attachments";
  },
},{
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 200,
},{
  field: "sender",
  headerName: "Sender",
  headerClassName: "table-header",
  width: 200,
  renderCell: (params) => (
    <Stack direction="row" alignItems="center" justifyContent="space-around">
      <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
      <span>{params.row.sender.name}</span>
    </Stack>
  )
},{
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
},{
    field: "groupChat",
    headerName: "GroupChat",
    headerClassName: "table-header",
    width: 100,
},{
  field: "createdAt",
  headerName: "Time",
  headerClassName: "table-header",
  width: 250,
}];
const MessageManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "Dashboard-messages"
  );
  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

    const [rows, setRows] = useState([]);
    useEffect(() => {
      if(data){setRows(
        data.messages.map((i)=> ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformImage(i.sender.avatar, 50),
          },
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        }))
      )
}}, [data])

  return (
    <AdminLayout>
        {loading ? (<Skeleton height={"100vh"} />) : (<Table heading={"All Users"} columns={columns} rows={rows} rowHeight={200}/>)}
    </AdminLayout>
  )
}

export default MessageManagement