import React, { useEffect, useState } from "react";
import MessageBoard from "./components/MessageBoard";
import { Typography, Button, Snackbar, Alert } from "@mui/material";
import Popup from './components/Popup/Popup.js';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { deleteUserData } from "./firebase.js";


const App = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        handleDisplayName();
      };
    });
  }, [user]);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setDisplayName(null);
    }).catch((error) => {
      console.error(error);
    });
  };

  const handleDisplayName = () => {
    setDisplayName(user.displayName);
  };

  const handleDeleteUser = async () => {
    await deleteUserData();
    setUser(null);
    setDisplayName(null);
  };

  return (
    <React.Fragment>
      {user === null ? <Popup onClose={closePopup} /> :
      <React.Fragment>
      <MessageBoard name={user.displayName}/>
      <Typography textAlign='center' marginTop='5%'>DisplayName</Typography>
      <Typography textAlign={"center"} variant="h5">{displayName}</Typography>
      <Button onClick={handleLogout} variant="outlined" sx={{
        display: 'flex',
        margin: 'auto',
        marginTop: 5
      }}>
        Logout
      </Button>
      <Button onClick={handleDeleteUser} variant="text" sx={{
        display: 'flex',
        margin: 'auto',
        marginTop: 10
      }}>
        Delete Account
      </Button>
      </React.Fragment>}
    </React.Fragment>
  );
}

export default App;
