import React from 'react';
import { Card, CardContent, Typography, Box, Container } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { deleteDocument, handleDocumentLike, handleDocumentDislike, } from '../firebase';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { getAuth } from 'firebase/auth';

const theme = createTheme({
  palette: {
    ochre: {
      main: 'black'
    }
  }
});

const Message = ({ message, documentId, fetchMessages }) => {
  const auth = getAuth();

  const handleLike = async (docId) => {
    await handleDocumentLike(docId);
    fetchMessages();
  };

  const handleDislike = async (docId) => {
    await handleDocumentDislike(docId);
    fetchMessages();
  };

  const handleDeleteDocument = async () => {
    await deleteDocument(documentId);
    fetchMessages();
  };

  return (
    <ThemeProvider theme={theme}>
    <Card style={{ marginBottom: '10px' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography component="div" variant="button" sx={{
            ":hover": {
              cursor: 'pointer'
            }
          }}>
            {message.name}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {message.time}
          </Typography>
          <Typography color={"text.secondary"} variant='body2'>{message.date}</Typography>
        </Box>
        <Typography color="text.secondary" gutterBottom>
          {message.message}
        </Typography>
        <Container disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          {message.userId === auth.currentUser.uid ? <Box display={"flex"}>
            <ThumbUpIcon color='success' fontSize='small'/> <Typography ml={1} color={"text.secondary"}>{message.likes.length}</Typography>
          </Box> : <Box display={"flex"}>
          <ThumbUpIcon fontSize='small' sx={{ ":hover": { cursor: 'pointer', transform: "scale(1.05)" } }} onClick={() => handleLike(documentId)} color='ochre'/>
          <Typography ml={1} mr={1} color={"text.secondary"}>{message.likes.length}</Typography>
          <ThumbDownIcon fontSize='small' sx={{ ":hover": { cursor: 'pointer', transform: "scale(1.05)" } }} onClick={() => handleDislike(documentId)} color='ochre'/>
        </Box>}
        {message.userId === auth.currentUser.uid ? <Box display={"flex"}>
          <DeleteOutlineIcon sx={{ ":hover": { cursor: 'pointer', transform: "scale(1.05)" }}} onClick={handleDeleteDocument} color='ochre'/>
        </Box> : null}
        </Container>
      </CardContent>
    </Card>
    </ThemeProvider>
  );
};

export default Message;
