
import React, {useEffect, useRef, useState } from 'react';
import Chess from 'chess.js';
import '../style.css';
import { Chessboard } from 'react-chessboard';
import Dashboard from '../components/dashboard/Dashboard';
import NFTCheck from '../modules/randomFunctions/NFTCheck';
import ModalService from '../modules/modals/modal components/ModalService';
import AddModal from '../modules/modals/modal components/AddModal';
import LoadingModal from '../modules/modals/modal files/LoadingModal';
import CloseModal from '../modules/modals/modal components/CloseModal';
import Modal from '../modules/modals/modal components/Modal';
import ModalBody from '../modules/modals/modal components/ModalBody';
import ModalHeader from '../modules/modals/modal components/ModalHeader';
import ModalFooter from '../modules/modals/modal components/ModalFooter';


export default function Game({ gametoapp, boardWidth , socket, messages, setMessages, activeLobby, setActiveLobby, message, setMessage, publicKey, allUsers, lobbyList, connectedRooms, setConnectedRooms, gameList, setGameList, setInGame, inGame, currentGame, setCurrentGame}) {

  const [fen, setFen] = useState("start")
  const [orientation, setOrientation] = useState('');
  const [turn, setTurn] = useState('w');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [opponent, setOpponent] = useState('');
  const [playerColor, setPlayerColor] = useState('')
  

  useEffect(()=>{
    setOrientation(currentGame.playerColor)
    setOpponent(currentGame.opponentSocket)
    if (currentGame.playerColor === 'white'){setPlayerColor('w')}
    if (currentGame.playerColor === 'black'){setPlayerColor('b')}

  },[currentGame])
 

  ////////////////////////

  const chessboardRef = useRef();
  const [game, setGame] = useState(new Chess());
  const [currentTimeout, setCurrentTimeout] = useState(undefined);

    //score logic
    const [win, setWin] = useState("")
    const [stalemate, setStalemate] = useState("")
    const [gameResult, setGameResult] = useState("")


    useEffect(()=>{
      //win/loss
      if (game.in_checkmate() === true) {let playerInCheckmate = game.turn()
        if (playerInCheckmate !== playerColor) {setWin(true)}
        if (playerInCheckmate === playerColor) {setWin(false)}
      }//stalemate
      if (game.in_stalemate() | game.in_draw() === true) {setStalemate(true)}
    },[game, gameResult, fen])

    //send gameresult to app.js
    useEffect(()=>{
      if (win === true){setGameResult("win");AddModal(Won); }
      if (win === false){setGameResult("loss");AddModal(Lost);}
      if (stalemate === true){setGameResult("stalemate");AddModal(Draw); }
      if (gameResult === "" || gameResult === "win" ||  gameResult ===  "loss" || gameResult === "stalemate")  {gametoapp(gameResult)}
    },[game, win, stalemate, gameResult])


    function safeGameMutate(modify) {
      setGame((g) => {
        const update = { ...g };
        modify(update);
        return update;
      });
    }
 
    function onDrop(sourceSquare, targetSquare) {
      const gameCopy = { ...game };
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to a queen for example simplicity
      });
      setGame(gameCopy);
      socket.emit('move', opponent, move)
      console.log(opponent)
      setFen(game.fen()); 
      setIsPlayerTurn(false)
      return move;
    }
    socket.once('move', (newmove) => {
      game.move(newmove);
      setFen(game.fen())
      setIsPlayerTurn(true)
    })

    ////Move logger is rendered
  
    function FenLogger (){
      const [history, setHistory] = useState([])

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
            <div id="fenlogger">{history.map(formatMoves)}</div>
            )}

     //////chessborder is rendered
    //  const [hasNFT, setHasNFT] = useState(false);
    //  useEffect(() => {
    //    console.log(hasNFT)
    //    setHasNFT(true)
    //   console.log(hasNFT)
    //  }, [ModalService.hasNFT]);
    //  if(!ModalService.popped) {AddModal(LoadingModal)}

     function modalClose(){
      CloseModal()
      
       safeGameMutate((game) => {
         game.reset();
          setGameResult("")
         setWin("")
         setStalemate("")
         setFen("start")
         setInGame(false)
       });
       // stop any current timeouts
       clearTimeout(currentTimeout);
     
    }
     
     function Won(props) {
       return (
         <Modal>
           <ModalHeader>
             <h3>Congratulations!</h3>
           </ModalHeader>
           <ModalBody>
             <p>You Won!</p>
           </ModalBody>
           <ModalFooter>
             <button onClick={ modalClose } className="btn btn-primary">OK</button>
           </ModalFooter>
         </Modal>
       );
     }
 
     function Lost(props) {
       return (
         <Modal>
           <ModalHeader>
             <h3>Better Luck Next Time</h3>
           </ModalHeader>
           <ModalBody>
             <p>You Lost</p>
           </ModalBody>
           <ModalFooter>
             <button onClick={ modalClose } className="btn btn-primary">OK</button>
           </ModalFooter>
         </Modal>
       );
     }
 
     function Draw(props) {
       return (
         <Modal>
           <ModalHeader>
             <h3>So Close</h3>
           </ModalHeader>
           <ModalBody>
             <p>This game was a draw</p>
           </ModalBody>
           <ModalFooter>
             <button onClick={ modalClose } className="btn btn-primary">OK</button>
           </ModalFooter>
         </Modal>
       );
     }
     function Concede(){
       setWin(false);
       setGameResult("loss")
       socket.emit('conceded', opponent)
     }
     socket.on('conceded', () => {
       setWin(true)
       setGameResult("win")
     })

 return (

        
       
         <div id="gameContainer">
            {inGame === false &&
          <Dashboard 
          socket={socket}
          messages={messages}
          setMessages={setMessages}
          activeLobby={activeLobby}
          setActiveLobby={setActiveLobby}
          message={message}
          setMessage={setMessage}
          publicKey={publicKey}
          allUsers={allUsers}
          lobbyList={lobbyList}
          connectedRooms={connectedRooms}
          setConnectedRooms={setConnectedRooms}
          gameList={gameList}
          setGameList={setGameList}
          setInGame={setInGame}
          setCurrentGame={setCurrentGame}
          />}



           {inGame === true && 
     <><div id="boardContainer">
         <Chessboard
           id="myboard"
           animationDuration={200}
           boardWidth={boardWidth}
           position={fen}
           onPieceDrop={onDrop}
           boardOrientation={orientation}
           customBoardStyle={{
             borderRadius: '4px',
             boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
           }}
           ref={chessboardRef}
           arePiecesDraggable={isPlayerTurn}
           />
         <FenLogger />
       </div>
       
       <div id="boardBtnContainer"> 
       
       <button id="boardBtn"
         className="rc-button"
         onClick={() => {Concede()}}
       >
         Concede
       </button>

       
         </div>
         
         </>
         
         }
     
         
 
       </div>
       
     );
   }
