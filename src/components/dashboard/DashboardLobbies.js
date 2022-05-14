import immer from "immer";
import { useEffect, useState } from "react";

const DashboardLobbies = ({socket, setInGame, gameList, setGameList, messages, setMessages, setCurrentGame}) => {

  const [activeTab, setActiveTab] = useState('join');
  const [selectedName, setSelectedName] = useState('')
  const [selectedDetails, setSelectedDetails] = useState('')
  //set game input states
  const [gameName, setGameName] = useState('');
  const [password, setPassword] = useState('');
  const [details, setDetails] = useState('');
  const [turnTimer, setTurnTimer] = useState('');
  // join game states
  const [joinGameName, setJoinGameName] = useState('');
  const [joinGamePass, setJoinGamePass] = useState('');

  const createGame = () => {
    // build newgame payload object
    const payload = {
        Name: gameName,
        Password: password,
        Details: details,
        Timer: turnTimer,
        White: socket.id,
        Black: null
    }
    socket.emit('create game', payload)
    let gameID = "gameID:"+socket.id;
    socket.emit('join room', gameID, (incomingmessages) => {roomJoinCallback(gameID, incomingmessages)});
    setInGame(true)
    if (password === '') {
        let newGame = immer(gameList, draft => {
            draft[gameName] = {
                Private: false,
                Details: details,
                Timer: turnTimer,
                White: socket.id,
                Black: null
              }
        })
        setGameList(newGame)
    
        console.log(Object.keys(gameList))
      }
      else {
        let newGame = immer(gameList, draft => {
            draft[gameName] = {
                Password: password,
                Private: true,
                Details: details,
                Timer: turnTimer,
                White: socket.id,
                Black: null
              }
        })
        setGameList(newGame)
      }
      setCurrentGame({
          Name: gameName,
          Chat: gameID,
          Timer: turnTimer,
          Details: details,
          playerColor: 'white',
          opponentSocket: '',
          opponentColor: 'black'
          
      })
  }
  async function roomJoinCallback(lobby, incomingmessages) {
    let newMessages = immer(messages, draft => {
        draft[lobby] = incomingmessages
    })
    setMessages(newMessages)
    
    
}

  const joinGame = () => {
      // build payload to join
      let newroomname = "gameID:"+gameList[joinGameName].White;
      let payload = {
          Name: joinGameName,
          password: joinGamePass
      }
      let opponent = gameList[joinGameName].White
      socket.emit('join game', payload)
      socket.emit('join room', newroomname,(incomingmessages) => {roomJoinCallback(newroomname, incomingmessages)})
      socket.emit('start game', opponent, joinGameName)
      setInGame(true)
      setCurrentGame({
        Name: joinGameName,
        Chat: newroomname,
        Timer: gameList[joinGameName].Timer,
        Details: gameList[joinGameName].Details,
        playerColor: 'black',
        opponentSocket: gameList[joinGameName].White,
        opponentColor: 'white'
        
    })
  }
  const selectedGame = (game) => {
    setSelectedName(game)
    setSelectedDetails(gameList[game].Details)
    setJoinGameName(game)
    setJoinGamePass(gameList[game].Password)
  }
  
  


    return(
    <div id="dashboard-lobbies">

        <ul className="nav nav-tabs">
            <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" onClick={() => setActiveTab('create')}>Create</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" onClick={() => setActiveTab('join')}>Join</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" onClick={() => setActiveTab('leaderboard')}>Leaderboard</a>
            </li>
        </ul>

       
         {activeTab === 'create' && <div id='create-game'>
             <label className="create-game-label">Game Name</label>
             <input id='game-name-input' type='text' placeholder='Game Name' onChange={(e)=>{setGameName(e.target.value)}} />
             <label className="create-game-label">Password</label>
             <input id='game-password-input' type='text' placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}} />
             <label className="create-game-label">Details</label>
             <textarea id='game-details-textarea' placeholder='Details' onChange={(e)=>{setDetails(e.target.value)}} />
             <label className="create-game-label">Turn Timer</label>
             <input id='turn-timer' type='number' placeholder='0' max={15} min={0} onChange={(e)=>{setTurnTimer(e.target.value)}}/>
             <button id='create-game-btn' onClick={createGame}>Create</button>
             </div>}


         {activeTab === 'join' && <div id='join-game'>
             <div id='join-game-inputs'>
             <input className="join-input" autoComplete='off' id='game-name-input' type='text' placeholder='Game Name' value={joinGameName} onChange={(e)=>{setJoinGameName(e.target.value)}}/>
             <input className="join-input" autoComplete='off' id='game-password-input' type='text' placeholder='Password' value={joinGamePass} onChange={(e)=>{setJoinGamePass(e.target.value)}}/>
             </div>
                <div id="join-game-selection">

             <div id='open-games'>
                 {Object.keys(gameList).map((game, index) => <li className="lobby-items" key={index} onClick={() => {selectedGame(game)}}>{game}</li>)}
             </div>

             <div id='selected-game'>
                <h5>{selectedName}</h5>
                <p>{selectedDetails}</p>


             </div>
             </div>
             <button id="join-game-btn" onClick={joinGame}>Join</button>
             </div>}


         {activeTab === 'leaderboard' && <div id='leaderboard'>
            get all players from contract with all games, wins, losses, stalemates and display here
             
             </div>}
        
        </div>

       
    );


}



export default DashboardLobbies