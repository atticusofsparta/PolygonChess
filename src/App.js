import Web3 from 'web3';
import PolyChessNftAbi from './polychessnftabi'
import { useWeb3React } from "@web3-react/core";
import { injected } from "./components/connectors";
import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import "./style.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Nopage from "./pages/Nopage";
import Game from "./pages/Game";
import Layout from "./pages/Layout";
import Settings from "./pages/Settings";
import ModalRoot from "./modules/modals/modal components/ModalRoot";
import ModalService from "./modules/modals/modal components/ModalService";
import immer from "immer";

const web3 = new Web3(Web3.givenProvider||"https://matic-mumbai.chainstacklabs.com");
const nftContract = new web3.eth.Contract(PolyChessNftAbi,"0xE4f8B49A58F0ab28d268E3D38B30A91FBCfcED8E");
let initialCurrentGameState = {
          Name: '',
          Chat: '',
          Timer: '',
          Details: '',
          playerColor: '',
          opponentSocket: '',
          opponentColor: ''
}

function App({socket}) {
  const { active, account, library, connector, activate, deactivate } =
  useWeb3React();

    //connected account details
    const [balance, setBalance] = useState("?");
    const [address, setAddress] = useState("?");
    
 //account game detals
   const [nftBalance, setNftBalance] = useState(0);
   const [newNftToMint, setNewNftToMint] = useState({name:"", ipfsUrl:""});
   const [nfts, setNfts] = useState();
   const [total_games, setTotal_Games] = useState(0);
   const [wins, setWins] = useState(0);
   const [losses, setLosses] = useState(0);
   const [stalemates, setStalemates] = useState(0);
 
   //session game details
   const [sessionGames, setSessionGames] = useState(0)
   const [sessionWins, setSessionWins] = useState(0)
   const [sessionLosses, setSessionLosses] = useState(0)
   const [sessionStalemates, setSessionStalemates] = useState(0)  

  ///socket stuff
  const [username, setUsername] = useState(''); // user settable username
  const [connected, setConnected] = useState(false);


  const [allUsers, setAllUsers] = useState([]) //all users on server
    const [newUsers, setNewUsers] = useState([]) //socket var that triggers setAllUsers
  const [gameList, setGameList] = useState({}); // all games on server
    const [newGameList, setNewGameList] = useState({});//socket var that triggers setGameList
  const [lobbyList, setLobbyList] = useState(["General"]); // all lobbies on server
    const [newLobbyList, setNewLobbyList] = useState(["General"]);//socket var that triggers setLobbyList


  const [connectedRooms, setConnectedRooms] = useState(["General"]); // lobbies user has connected to
  const [activeLobby, setActiveLobby] = useState('General'); // current lobby user is in
  const [inGame, setInGame] = useState(false); // conditional for rendering chessboard or dashboard
  const [currentGame, setCurrentGame] = useState(initialCurrentGameState) // sets data for current game user is in
    const [newOpponent, setNewOpponent] = useState(); //socket var that triggers setCurrentGame
  const [message, setMessage] = useState(''); // message input state
  const [messages, setMessages] = useState({General: [], Spanish: []}); // all messages from server
    const [newMessages, setNewMessages] = useState({})
 

useEffect(()=>{
  if(allUsers.map((user, index) => user.socket).includes(socket.id) === false){socket.emit("join server", address)}
  if(allUsers.map((user, index) => user.publicKey).includes(address) === false){socket.emit("join server", address)}
  console.log("includes?? ", allUsers.map((user, index) => user.socket))

},[address])

  socket.on('user list', (users) =>{
    setNewUsers(users);   
  })
  useEffect(() => {
    setAllUsers(newUsers); 
    socket.off('user list'); // clear listener
    console.log(socket.listeners('user list'))
  },[newUsers])

socket.on('lobby list', lobbies => {
  setNewLobbyList(lobbies)
})
useEffect(() => {
  setLobbyList(newLobbyList); 
  socket.off('lobby list'); // clear listener
},[newLobbyList])

socket.on('game list', games => {
  setGameList(games)
})
useEffect(() => {
  setGameList(newGameList); 
  socket.off('game list'); // clear listener
},[newGameList])

socket.on("new message", (newmsg) => {
  setNewMessages(newmsg)
}) 
useEffect(()=>{
  console.log('new message from server')
  let newmsg = immer(messages, draft => {
      draft[activeLobby].push(newMessages)
  })
  setMessages(newmsg)
  socket.off("new message")
},[newMessages])


socket.on('start game', (opponent) => {
  setNewOpponent(opponent)
  if (currentGame.opponentSocket !== '') {setInGame(true)}
})
const roomJoinCallback = (lobby, incomingmessages) => {
  let newMessages = immer(messages, draft => {
      draft[lobby] = incomingmessages
  })
  setMessages(newMessages)
  setActiveLobby(lobby)
}
useEffect(()=>{
  socket.emit('join room', currentGame.Chat, (incomingmessages) => {roomJoinCallback(currentGame.Chat, incomingmessages)})
  let opponent = immer(currentGame, draft => {
    draft.opponentSocket = newOpponent;
  })
  setCurrentGame(opponent)
  console.log(currentGame, "is black")
  socket.off('start game')
},[newOpponent])

  
  const [score, setScore] = useState();
  let gametoapp = (gameResult) => {
    
    if (gameResult === "") {setScore("")}
    if (gameResult === "win"){setScore("win")}
    if (gameResult === "loss"){setScore("loss")}
    if (gameResult === "stalemate"){setScore("stalemate")}
    
    console.log("gameResult", gameResult)

  }
  useEffect(()=>{
    if (score === "win"){setSessionWins(sessionWins+1); setSessionGames(sessionGames+1)}
    if (score === "loss"){setSessionLosses(sessionLosses+1); setSessionGames(sessionGames+1)}
    if (score === "stalemate"){setSessionStalemates(sessionStalemates+1); setSessionGames(sessionGames+1)}
  },[score])


 //set html values
 useEffect(()=>{ 
  const textNft = document.getElementById('textNft');
  const textAddress = document.getElementById('textAddress');
  const textBalance = document.getElementById('textBalance');
  const textTotal_Games = document.getElementById('textTotal_Games');
  const textWins = document.getElementById('textWins');
  const textLosses = document.getElementById('textLosses');
  const textStalemates = document.getElementById('textStalemates');
  textNft.textContent = `Nft: ${nftBalance}`;
  if(active === true){ setAddress(account); }
  textAddress.textContent = `Connected account: ${address.replace(address.slice(5, 37), ' . . . ')}`;
  textBalance.textContent = `CSPR Balance: ${balance / 1000000000}`;
  textTotal_Games.textContent = `Total Games: ${total_games}` + ` + ${sessionGames}`;
  textWins.textContent = `Wins: ${wins}` + ` + ${sessionWins}`;
  textLosses.textContent = `Losses: ${losses}` + ` + ${sessionLosses}`;
  textStalemates.textContent = `Stalemates: ${stalemates}` + ` + ${sessionStalemates}`;
},[address, active, balance, total_games, wins, losses, stalemates, sessionGames, sessionWins, sessionLosses, sessionStalemates, nftBalance])




ModalService.hasNft = (nftBalance)
async function SetNftData () {
  if (web3.utils.isAddress(address) === true){
    nftContract.defaultAccount = address;
  };
  if(active & web3.utils.isAddress(address) === true ){
    const newnftbal = await nftContract.methods.balanceOf(address).call()
    setNftBalance(newnftbal)
   }
  }
useEffect(()=>{SetNftData()},[active])


async function connect(){
  //connect wallet
  try {activate(injected);} 
  catch (error) {console.log(error)}

}
async function disconnect(){
  try {deactivate();} 
  catch (error) {console.log(error)}
    setAddress("?")
}
  async function mint() {
    try {
      nftContract.methods.mintNFT(address, newNftToMint.ipfsUrl).send({from: address})
      }
    catch (error) {console.log(error)}
    console.log("mint a thing")
  }


  return (
   
    <div>
      <ModalRoot/>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/Home">
            Casper Chess
          </a>

          <ul className="navbar-nav me-auto">
            <Layout />
            <li className="nav-item">
             {active ? <a className="nav-link" id="connectBtn" onClick={disconnect}>
                Disconnect
              </a>:<a className="nav-link" id="connectBtn" onClick={connect}>
                 Connect
              </a>}
            </li>
            <li className="nav-item">
              <a className="nav-link" id="mintBtn" onClick={() => mint()}>
                mint
              </a>
            </li>
          </ul>

          <ul >  
         <li id="textAddress">Connected account: </li>
                  <li id="textBalance">CSPR Balance: </li>
                </ul>
                <ul>
                <li id="textTotal_Games">Total Games: </li>
                <li id="textWins">Wins: </li>
                </ul>
                <ul>
                <li id="textLosses">Losses: </li>
                <li id="textStalemates">Stalemates: </li>
                <li id="textNft">Nft: </li>
                </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Game" element={<Game 
        gametoapp={gametoapp} 
        address={address} 
        socket={socket} 
        messages={messages} 
        setMessages={setMessages}
        message={message}
        setMessage={setMessage}
        activeLobby={activeLobby}
        setActiveLobby={setActiveLobby}
        publicKey={address}
        allUsers={allUsers}
        connectedRooms={connectedRooms}
        setConnectedRooms={setConnectedRooms}
        lobbyList={lobbyList}
        gameList={gameList}
        setGameList={setGameList}
        setInGame={setInGame}
        inGame={inGame}
        currentGame={currentGame}
        setCurrentGame={setCurrentGame}
        initialCurrentGameState={initialCurrentGameState}
        active={active}
        connect={connect}
        mint={mint}
        nftBalance={nftBalance}
        SetNftData={SetNftData()}
        newNftToMint={newNftToMint}
        setNewNftToMint={setNewNftToMint}


        />} />
        <Route path="*" element={<Nopage />} />
        <Route path='/Settings' element={<Settings 
        nftContract={nftContract} 
        web3={web3}
        address={address}
        />} />
      </Routes>
      <Outlet />
    </div>
  );
}


export default App;


// useEffect(()=>{
//   ModalService.nftBalance = nftBalance;
//   ModalService.address = address;
//   ModalService.balance = balance;
//   ModalService.total_games = total_games;
//   ModalService.wins = wins;
//   ModalService.losses = losses;
//   ModalService.stalemates = stalemates;
//   ModalService.sessionGames = sessionGames;
//   ModalService.sessionWins = sessionWins;
//   ModalService.sessionLosses = sessionLosses;
//   ModalService.sessionStalemates = sessionStalemates;

// },[address, balance, total_games, wins, losses, stalemates, sessionGames, sessionWins, sessionLosses, sessionStalemates, nftBalance])