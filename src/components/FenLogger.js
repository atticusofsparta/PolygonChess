import React, {useState, useEffect} from 'react';
import Chat from './Chat';

function FenLogger({game, messages, setMessages, message, setMessage, socket, activeLobby, publicKey}){
    const [history, setHistory] = useState([])
    const [display, setDisplay] = useState('moves');

    useEffect(()=>{setHistory(game.history({verbose: true}))},[game])
    //{ color: 'b', from: 'e5', to: 'f4', flags: 'c', piece: 'p', captured: 'p', san: 'exf4' }
   const formatMoves = (move, index) => {
    let playerColor = '';
      if (move.color === 'w') {playerColor = "White"}
      if (move.color === 'b') {playerColor = "Black"}
    let from = move.from.toUpperCase();
    let to = move.to.toUpperCase();
    return <li key={index}>{playerColor} moved from {from} to {to} </li>

   }
 
      return (
          <div id="fenlogger">
            <div id='fenlogger-top'><button id='moves-btn' onClick={() => {setDisplay('moves')}}>Moves</button><button id="chat-btn" onClick={() => {setDisplay('chat')}}>Chat</button></div>
            {display === 'chat' &&  
            <Chat 
          socket={socket} 
          activeLobby={activeLobby} 
          messages={messages} 
          setMessages={setMessages}
          message={message}
          setMessage={setMessage}
          publicKey={publicKey}
        
          />}
            {display === 'moves' && <div id="moves">{history.map(formatMoves)}</div>}
            </div>
          )}

          export default FenLogger