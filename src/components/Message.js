import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Container } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
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

const Message = ({ message, documentId, fetchMessages, fetchMessagesNoScroll }) => {
  const auth = getAuth();

  const handleLike = async (docId) => {
    await handleDocumentLike(docId);
    fetchMessagesNoScroll();
  };

  const handleDislike = async (docId) => {
    await handleDocumentDislike(docId);
    fetchMessagesNoScroll();
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
          {message.userId === auth.currentUser.uid ? null : <Box display={"flex"}>
          <FavoriteBorderIcon sx={{ ":hover": { cursor: 'pointer', transform: "scale(1.05)" } }} onClick={() => handleLike(documentId)} color='ochre'/>
          <Typography ml={1} mr={1} color={"text.secondary"}>{message.likes.length}</Typography>
          <NotInterestedIcon sx={{ ":hover": { cursor: 'pointer', transform: "scale(1.05)" } }} onClick={() => handleDislike(documentId)} color='ochre'/>
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
