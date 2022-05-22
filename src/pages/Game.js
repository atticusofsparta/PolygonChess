
import React, {useEffect, useRef, useState } from 'react';
import immer from 'immer'
import Chess from 'chess.js';
import '../style.css';
import { Chessboard } from 'react-chessboard';
import Dashboard from '../components/dashboard/Dashboard';
import FenLogger from '../components/FenLogger'
import NFTCheck from '../modules/randomFunctions/NFTCheck';
import ModalService from '../modules/modals/modal components/ModalService';
import AddModal from '../modules/modals/modal components/AddModal';
import LoadingModal from '../modules/modals/modal files/LoadingModal';
import CloseModal from '../modules/modals/modal components/CloseModal';
import Modal from '../modules/modals/modal components/Modal';
import ModalBody from '../modules/modals/modal components/ModalBody';
import ModalHeader from '../modules/modals/modal components/ModalHeader';
import ModalFooter from '../modules/modals/modal components/ModalFooter';
import playeravatar1 from '../components/images/playeravatar1.png';
import playeravatar2 from '../components/images/playeravatar2.png';
import playeravatar3 from '../components/images/playeravatar3.png';
import playeravatar4 from '../components/images/playeravatar4.png';
import playeravatar5 from '../components/images/playeravatar5.png';
import playeravatar6 from '../components/images/playeravatar6.png';

const Nft1 = {name: "WhiteKingOrangeBackround", ipfsUrl:"ipfs://bafyreig66gwfolo4nhca5c7nnie3jwyece4q2ciogqx6bru7xo6i6hto2e"}
const Nft2 = {name: "WhiteHorseQueen", ipfsUrl:"ipfs://bafkreibl5fzjjkyrpoegghqksflruhzrnittv4gygkw3lzf64ued5ib4fm"}
const Nft3 = {name: "WhitePointyQueen", ipfsUrl:"ipfs://bafkreie4o2wpe5hnic6jbwkrskorna4qvqq6p5pkgywfi6vpe6igx4s4b4"}
const Nft4 = {name: "BlackHorseKing", ipfsUrl:"ipfs://bafkreif4hrg7l4gukqr3abkgjzzt3exolq7hbqwyvxnqkm2xtrad3czzpm"}
const Nft5 = {name: "BlackPointQueen", ipfsUrl:"ipfs://bafkreic2iy7d5ampck7aby7nggtbtdfecvn7pcd7vekrojd433lvfi5grm"}
const Nft6 = {name: "WhiteEagleRook", ipfsUrl:"ipfs://bafkreihotqkwwvrv6h3spsezqvsyqfafs4zpp3a7foaqloe6ful3vnbfbm"}



export default function Game({ gametoapp, newNftToMint, setNewNftToMint, boardWidth , socket, active,connect,SetNftData, messages, setMessages, activeLobby, setActiveLobby, message, setMessage, publicKey, allUsers, lobbyList, connectedRooms, setConnectedRooms, gameList, setGameList, setInGame, inGame, currentGame, setCurrentGame, initialCurrentGameState, nftBalance, mint}) {

  const [fen, setFen] = useState("start")
  const [orientation, setOrientation] = useState('');
  const [turn, setTurn] = useState('w');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [opponent, setOpponent] = useState('');
  const [playerColor, setPlayerColor] = useState('');
  const [opponentColor, setOpponentColor] = useState('');
  
  

  

  useEffect(()=>{
    setOrientation(currentGame.playerColor)
    setOpponent(currentGame.opponentSocket)
    if (currentGame.playerColor === 'white'){setPlayerColor('w')}
    if (currentGame.playerColor === 'black'){setPlayerColor('b')}
    if (currentGame.opponentColor === 'white'){setOpponentColor('w')}
    if (currentGame.opponentColor === 'black'){setOpponentColor('b')}

  },[currentGame])
 

  ////////////////////////

  const chessboardRef = useRef();
  const [game, setGame] = useState(new Chess());
  const [currentTimeout, setCurrentTimeout] = useState(undefined);

    //score logic
    const [win, setWin] = useState("")
    const [stalemate, setStalemate] = useState("")
    const [gameResult, setGameResult] = useState("")
    const [conceded, setConceded] = useState(false);


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
    socket.on('move', (newmove) => {
      game.move(newmove);
      setFen(game.fen())
      setIsPlayerTurn(true)
    })

     function modalClose(){
      CloseModal()
      
       safeGameMutate((game) => {
         game.reset();
          setGameResult("")
         setWin("")
         setStalemate("")
         setFen("start")
         setCurrentGame(initialCurrentGameState)
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
       setConceded(true)
     })
     function ConnectFirst(){
      return (
        <Modal>
          <ModalHeader>
            <h3>Connect Wallet to proceed</h3>
          </ModalHeader>
          <ModalBody>
            <p>You must connect to your wallet to proceed! Note: if the app has not disconnected
              your wallet, go to connected sites and disconnect manually.
            </p>
          </ModalBody>
          <ModalFooter>
            <button  onClick={connect} className="btn btn-primary">Connect</button>
          </ModalFooter>
        </Modal>
      );

     }
     function MintFirst(){
      const [selectedNft, setSelectedNft] = useState("")
      return (
        <Modal>
          <ModalHeader>
            <h3>You must mint an avatar to proceed!</h3>
          </ModalHeader>
          <ModalBody>
            <p>This is a membership only game. To become a member you must mint an nft.
              Membership IS transferable by sending the nft to another wallet.
            </p>
            <p>Note: If you believe that you DO have an nft, please click refresh.</p>
            <h4>Choose an NFT</h4>
            <div id="nft-selection">
              <img className="nft-select" src={playeravatar1} alt="" onClick={()=>{selectNft(Nft1);setSelectedNft(Nft1.name)}}/>
              <img className="nft-select" src={playeravatar2} alt="" onClick={()=>{selectNft(Nft2);setSelectedNft(Nft2.name)}}/>
              <img className="nft-select" src={playeravatar3} alt="" onClick={()=>{selectNft(Nft3);setSelectedNft(Nft3.name)}}/>
              <img className="nft-select" src={playeravatar4} alt="" onClick={()=>{selectNft(Nft4);setSelectedNft(Nft4.name)}}/>
              <img className="nft-select" src={playeravatar5} alt="" onClick={()=>{selectNft(Nft5);setSelectedNft(Nft5.name)}}/>
              <img className="nft-select" src={playeravatar6} alt="" onClick={()=>{selectNft(Nft6);setSelectedNft(Nft6.name)}} />
            </div>
          </ModalBody>
          <ModalFooter>
            <span>{selectedNft}</span>
            <button  onClick={()=>{mint()}} className="btn btn-primary">Mint my NFT</button>
            <button onClick={()=>{SetNftData()}} className="btn btn-primary">Refresh</button>
          </ModalFooter>
        </Modal>
      );

     }
    function selectNft(props){
      setNewNftToMint(props)
     }
     useEffect(()=>{
     if (conceded === true) 
      {setWin(true)
      setGameResult("win")
      socket.off("conceded")}
      },[conceded])

      useEffect(()=>{
        if(!active){AddModal(ConnectFirst)}
        if(active){CloseModal(ConnectFirst)}
        if(nftBalance <= 0){AddModal(MintFirst)}
        if(nftBalance > 0){CloseModal(MintFirst)}
      },[active, nftBalance])

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
          currentGame={currentGame}
          initialCurrentGameState={initialCurrentGameState}
          />}

           {inGame === true && 
     <>
   
     <div id="game-state">
       {game.turn() !== playerColor ? <div id="player-one" className='game-state-items'><label className='center-content'>You are:</label><span className='center-content'>{currentGame.playerColor}</span></div>
       :
       <div id="PlayerTurn" className='game-state-items' ><label className='center-content'>You are:</label><span className='center-content'>{currentGame.playerColor}</span></div>}
       <div id="countdown-timer" className='game-state-items'><label className='center-content'>Turn timer</label><span className='center-content'>Coming Soon</span></div>
       {game.turn() !== opponentColor ? <div id="player-two" className='game-state-items'><label className='center-content'>Opponent</label><span className='center-content'>{currentGame.opponentColor}</span></div>
        :
        <div id="PlayerTurn" className='game-state-items' ><label className='center-content'>Opponent</label><span className='center-content'>{currentGame.opponentColor}</span></div>}
     
       </div>
     <div id="boardContainer">
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
         <FenLogger 
         game={game}
         socket={socket} 
         activeLobby={activeLobby} 
         messages={messages} 
         setMessages={setMessages}
         message={message}
         setMessage={setMessage}
         publicKey={publicKey}
         />
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
