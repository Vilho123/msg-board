import React, { useState, useEffect, useRef } from 'react';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import Message from './Message';
import { addData, fetchMessages } from '../firebase';

const MessageBoard = (name) => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(null);
  const [savedMessages, setSavedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageBoardRef = useRef(null);

  const handleSendMessage = async () => {
    if (username !== null && newMessage) {
      setMessages([...messages, { username, text: newMessage }]);
      await addData(username, newMessage);
      setNewMessage('');
      fetchSavedMessages();
    };
  };

  const fetchSavedMessages = async () => {
    console.log("Fetching saved messages...");
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
  }, [name])

  useEffect(() => {
    // Scroll to the bottom when messages are updated
    if (messageBoardRef.current) {
      messageBoardRef.current.scrollTop = messageBoardRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box style={{ marginTop: '10px' }}>
      <Container
        maxWidth="sm"
        sx={{
          overflowY: 'auto',
          border: "1px solid black",
          height: '400px', // Fixed height for the message board,
        }}
      >
        <Box>
          {savedMessages.map((msg, index) => (
            <Message key={index} message={msg} documentId={msg.id} fetchMessages={fetchSavedMessages}/>
          ))}
        </Box>
      </Container>
      <Box display="flex" flexDirection="column" alignItems="center" marginTop="10px">
        <TextField
          label="Message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          multiline
          variant="outlined"
          style={{ marginBottom: '10px', }}
        />
        <Button variant="contained" onClick={handleSendMessage}>
          Send
        </Button>
        <Typography variant="body2" style={{ marginTop: '10px' }}></Typography>
      </Box>
    </Box>
  );
};

export default MessageBoard;
