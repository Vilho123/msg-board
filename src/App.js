import React, { useEffect, useState } from "react";
import MessageBoard from "./components/MessageBoard";
import { Typography, Box } from "@mui/material";
import { nameList } from "./namelist";


const App = () => {
  const [username, setUsername] = useState(null);

  const generateUsername = () => {
    var finalName = nameList[Math.floor(Math.random() * nameList.length )];
    setUsername(finalName);
  };

  useEffect(() => {
    if (!username) {
      generateUsername();
    };
  }, [username]);

  return (
    <React.Fragment>
      <MessageBoard username={username} />
      <Typography textAlign='center' marginTop='5%'>Nickname</Typography>
      <Typography textAlign={"center"} variant="h5">{username}</Typography>
    </React.Fragment>
  );
}

export default App;
