import React, {useState, useEffect} from 'react';

import DashboardChat from "./DashboardChat";
import DashboardLobbies from "./DashboardLobbies";
import DashboardAvatar from "./DashboardAvatars";
import DashboardViewAvatar from "./DashboardViewAvatar";


const Dashboard = ({ socket, messages, setMessages, activeLobby, setActiveLobby, message, setMessage, publicKey, allUsers,connectedRooms,setConnectedRooms, lobbyList, gameList, setGameList, setInGame, setCurrentGame, currentGame, initialCurrentGameState }) => {
   
    return(
        <div id="dashboard">
            <div id="dashboard-top"> 
            <DashboardChat 
            socket={socket} 
            activeLobby={activeLobby} 
            messages={messages} 
            setMessages={setMessages}
            message={message}
            setMessage={setMessage}
            publicKey={publicKey}
            />
            <DashboardViewAvatar 
            socket={socket} 
            messages={messages} 
            setMessages={setMessages}
            setActiveLobby={setActiveLobby}
            connectedRooms={connectedRooms}
            setConnectedRooms={setConnectedRooms}
            lobbyList={lobbyList}
            />
            <DashboardLobbies 
            socket={socket}
            gameList={gameList}
            setGameList={setGameList}
            setInGame={setInGame}
            messages={messages}
            setMessages={setMessages}
            setCurrentGame={setCurrentGame}
            setActiveLobby={setActiveLobby}
            currentGame={currentGame}
            initialCurrentGameState={initialCurrentGameState}
            />
            </div>
            <div id="dashboard-bottom"> 
            <DashboardAvatar 
            allUsers={allUsers}
            />
            </div>

        </div>
    );

}

export default Dashboard