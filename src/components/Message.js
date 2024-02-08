import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { updateDocumentLikes } from '../firebase';
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    ochre: {
      main: '#E3D026'
    }
  }
});

const Message = ({ message, documentId }) => {
  const handleLike = async (docId) => {
    console.log("Handling like...");
    const result = await updateDocumentLikes(docId);
    console.log(result);
  };

  return (
    <ThemeProvider theme={theme}>
    <Card style={{ marginBottom: '10px' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography component="div" variant="button">
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
        <Box display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
          <FavoriteBorderIcon sx={{ ":hover": { cursor: 'pointer', transform: "scale(1.05)" } }} onClick={() => handleLike(documentId)} color='ochre'/>
          <Typography ml={1} color={"text.secondary"}>{message.likes}</Typography>
        </Box>
      </CardContent>
    </Card>
    </ThemeProvider>
  );
};

export default Message;
