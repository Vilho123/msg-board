import React, { useState, useEffect, useRef } from 'react';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import Message from './Message';
import { addData, fetchMessages } from '../firebase';


const MessageBoard = (name) => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);
  const [savedMessages, setSavedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const messageBoardRef = useRef(null);

  const handleSendMessage = async () => {
    if (newMessage !== '') {
      setError(false);
      setErrorMessage(null);
      setMessages([...messages, { username, text: newMessage }]);
      await addData(newMessage);
      setNewMessage('');

      fetchSavedMessages();
    } else {
      return null;
    };
  };

  const fetchSavedMessages = async () => {
    const result = await fetchMessages();
    setSavedMessages(result);
  };

  useEffect(() => {
    fetchSavedMessages();
  }, []);

  useEffect(() => {
    if (name) {
      setUsername(name);
    };
  }, [name]);

  return (
    <Box style={{ marginTop: '10px' }}>
      <Container
        ref={messageBoardRef}
        maxWidth="sm"
        sx={{
          overflowY: 'auto',
          border: "1px solid black",
          height: '400px', // Fixed height for the message board,
        }}
      >
        <Box>
          {savedMessages.map((msg, index) => (
            <Message key={index} message={msg} documentId={msg.documentId} fetchMessages={fetchSavedMessages}/>
          ))}
        </Box>
      </Container>
      <Box display="flex" flexDirection="column" alignItems="center" marginTop="10px">
        <TextField
          helperText={errorMessage}
          error={error}
          label="Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          multiline
          variant="outlined"
          style={{ marginBottom: '10px', }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (newMessage !== '') {
                handleSendMessage();
              };
            };
          }}
        />
        <Button type='submit' variant="contained" onClick={handleSendMessage}>
          Send
        </Button>
        <Typography variant="body2" style={{ marginTop: '10px' }}></Typography>
      </Box>
    </Box>
  );
};

export default MessageBoard;
