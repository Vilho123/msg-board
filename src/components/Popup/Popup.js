import React, { useState } from 'react';
import './popup.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Container, Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { createUser, loginUser, scanUsername } from '../../firebase';

const Popup = ({ onClose }) => {
  const [displayName, setDisplayName] = useState('');
  const [emailLogin, setEmailLogin] = useState('');
  const [emailRegister, setEmailRegister] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [confirmPasswordRegister, setConfirmPasswordRegister] = useState('');
  const [displayNameError, setDisplayNameError] = useState(false);
  const [displayNameErrorMessage, setDisplayNameErrorMessage] = useState('');
  const [loginEmailErrorMessage, setLoginEmailErrorMessage] = useState('');
  const [loginEmailError, setLoginEmailError] = useState(false);
  const [registerEmailErrorMessage, setRegisterEmailErrorMessage] = useState('');
  const [registerEmailError, setRegisterEmailError] = useState(false);
  const [loginPasswordErrorMessage, setLoginPasswordErrorMessage] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState(false);
  const [registerPasswordErrorMessage, setRegisterPasswordErrorMessage] = useState('');
  const [registerPasswordError, setRegisterPasswordError] = useState(false);
  const [value, setValue] = useState('login');
  const [user, setUser] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const user = {
      type: 'login',
      email: emailLogin,
      password: passwordLogin
    };
    await loginUser(user)
    .then((response) => {
      if (response.errorCode) {
        switch (response.errorCode) {
          case 'auth/invalid-email':
            setLoginEmailError(true);
            setLoginEmailErrorMessage('Invalid email');
            break;
          case 'auth/invalid-credential':
            setLoginPasswordError(true);
            setLoginPasswordErrorMessage('Invalid email or password');
            break;
          case 'auth/missing-password':
            setLoginPasswordError(true);
            setLoginPasswordErrorMessage('Invalid password');
            break;
        }
      } else {
        setUser(response);
        onClose();
      };
    })
    .catch((error) => {
      console.log(error);
    });
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    const user = {
      username: displayName,
      email: emailRegister,
      password: passwordRegister,
      confirmPassword: confirmPasswordRegister
    };

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    /*

    if (user.username === '') {
      setDisplayNameError(true);
      setDisplayNameErrorMessage('Missing username');
      return;

    } else if (user.username.length > 12) {
      setDisplayNameError(true);
      setDisplayNameErrorMessage('Username must be less than 12 characters');
      return;

    } else if (!emailRegex.test(user.email)) {
      setRegisterEmailError(true);
      setRegisterEmailErrorMessage('Invalid email');
      return;

    } else if (user.password === '') {
      setRegisterPasswordError(true);
      setRegisterPasswordErrorMessage('Invalid password'); 
      return;

    } else if (user.password.length < 6) {
      setRegisterPasswordError(true);
      setRegisterPasswordErrorMessage('Password should be at least 6 characters');
      return;

    } else if (user.password !== user.confirmPassword) {
      setRegisterPasswordError(true);
      setRegisterPasswordErrorMessage('Passwords do not match');
      return;
    }

    */
    

    if (user.password !== user.confirmPassword) {
      setRegisterPasswordError(true);
      setRegisterPasswordErrorMessage('Passwords do not match');
      return;
    } else if (user.username === '' || user.username > 20) {
      setDisplayNameError(true);
      setDisplayNameErrorMessage('Username cannot be empty or greater than 20 characters');
      return;
    };
    
    const scan = await scanUsername(user.username);

    if (scan === "Username already exists") {
      setDisplayNameError(true);
      setDisplayNameErrorMessage("Username already exists");
      return;
    };

    await createUser(user).then((response) => {
      if (response.errorCode) {
        switch (response.errorCode) {
          case 'auth/weak-password':
            setRegisterPasswordError(true);
            setRegisterPasswordErrorMessage('Password should be at least 6 characters');
            break;
          case 'auth/missing-password':
            setRegisterPasswordError(true);
            setRegisterPasswordErrorMessage('Invalid password'); 
          break;
          case 'auth/invalid-email':
            setRegisterEmailError(true);
            setRegisterEmailErrorMessage('Invalid email');
            break;
          case 'auth/email-already-in-use':
            setRegisterEmailError(true);
            setRegisterEmailErrorMessage('Email already in use');
            break;  
        };
      } else {
        setUser(response);
        
      };
    });
    /*
    .then((response) => {
      if (response.errorCode) {
        switch (response.errorCode) {
          case 'auth/weak-password':
            setRegisterPasswordError(true);
            setRegisterPasswordErrorMessage('Password should be at least 6 characters');
            break;
          case 'auth/missing-password':
            setRegisterPasswordError(true);
            setRegisterPasswordErrorMessage('Invalid password'); 
          break;
          case 'auth/invalid-email':
            setRegisterEmailError(true);
            setRegisterEmailErrorMessage('Invalid email');
            break;
          case 'auth/email-already-in-use':
            setRegisterEmailError(true);
            setRegisterEmailErrorMessage('Email already in use');
            break;  
        };
      } else {
        setUser(response);
      };
      */
  };

  return (
    <Container maxWidth="xs" component={"main"}>
    <Box className="popup-container">
      <Box className="popup">
        <Tabs
        value={value}
        onChange={handleChange}
        >
          <Tab value={"login"} label="Login"/>
          <Tab value={"register"} label="Register"/>
        </Tabs>
        <Avatar sx={{ mt: 1, bgcolor: 'secondary.main', alignSelf: "center" }}>
          <LockOutlinedIcon />
        </Avatar>
        {value === 'login' ? <Typography variant='h6' alignSelf={"center"}>Sign In</Typography> : <Typography variant='h6' alignSelf={"center"}>Sign Up</Typography>}
        {value === 'login' ? <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
          helperText={loginEmailErrorMessage}
          error={loginEmailError}
          margin="normal"
          required
          fullWidth
          id="current-email"
          label="Email Address"
          autoComplete='current-email'
          autoFocus
          value={emailLogin}
          onChange={(e) => setEmailLogin(e.target.value)}
          />
        <TextField
            helperText={loginPasswordErrorMessage}
            error={loginPasswordError}
            margin="normal"
            required
            fullWidth
            id='current-password'
            label="Password"
            type='password'
            autoComplete='current-password'
            value={passwordLogin}
            onChange={(e) => setPasswordLogin(e.target.value)}
        />
          <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
        </Box> :
        <Box component="form" onSubmit={handleRegistration} noValidate sx={{ mt: 1 }}>
          <TextField
          helperText={displayNameErrorMessage}
          error={displayNameError}
          margin="normal"
          required
          fullWidth
          id="new-username"
          label="Username"
          autoComplete='username'
          type='text'
          autoFocus
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          />
          <TextField
          helperText={registerEmailErrorMessage}
          error={registerEmailError}
          margin="normal"
          required
          fullWidth
          id="new-email"
          label="Email Address"
          autoComplete='new-email'
          value={emailRegister}
          onChange={(e) => setEmailRegister(e.target.value)}
          />
          <TextField
          helperText={registerPasswordErrorMessage}
          error={registerPasswordError}
          margin="normal"
          required
          fullWidth
          id='new-password'
          label="Password"
          autoComplete='new-password'
          type='password'
          value={passwordRegister}
          onChange={(e) => setPasswordRegister(e.target.value)}
          />
          <TextField  
            helperText={registerPasswordErrorMessage}
            error={registerPasswordError}
            margin="normal"
            required
            fullWidth
            id='confirm-new-password'
            label="Confirm Password"
            autoComplete='confirm-new-password'
            type='password'
            value={confirmPasswordRegister}
            onChange={(e) => setConfirmPasswordRegister(e.target.value)}
          />
          <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
          >
            Create
          </Button>
        </Box>}
      </Box>
    </Box>
    </Container>
  );
};

export default Popup;