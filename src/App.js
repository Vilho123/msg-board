import React, { useEffect, useState } from "react";
import MessageBoard from "./components/MessageBoard";
import { Typography, Button } from "@mui/material";
import Popup from './components/Popup/Popup.js';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";


const App = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      };
    })
  }, [user]);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      setUser(null);
    }).catch((error) => {
      // An error happened.
    })
  };

  return (
    <React.Fragment>
      {user === null ? <Popup onClose={closePopup} /> :
      <React.Fragment>
      <MessageBoard name={user.displayName}/>
      <Typography textAlign='center' marginTop='5%'>DisplayName</Typography>
      <Typography textAlign={"center"} variant="h5">{user.displayName}</Typography>
      <Button onClick={handleLogout} variant="outlined" sx={{
        display: 'flex',
        margin: 'auto',
        marginTop: 5
      }}>
        Logout
      </Button>
      </React.Fragment>}
    </React.Fragment>
  );
}

export default App;
