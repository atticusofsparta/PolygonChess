import React, {useEffect, useRef, useState } from 'react';
import Chess from 'chess.js';
import '../style.css';
import NFTCheck from '../modules/randomFunctions/NFTCheck';

import { Chessboard } from 'react-chessboard';
import ModalService from '../modules/modals/modal components/ModalService';

export default function Game({ boardWidth }) {
    const chessboardRef = useRef();
    const [game, setGame] = useState(new Chess());
    const [boardOrientation, setBoardOrientation] = useState('white');
    const [currentTimeout, setCurrentTimeout] = useState(undefined);
const hasNFT = false
    function safeGameMutate(modify) {
      setGame((g) => {
        const update = { ...g };
        modify(update);
        return update;
      });
    }
  
    function makeRandomMove() {
      const possibleMoves = game.moves();
  
      // exit if the game is over
      if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;
  
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      safeGameMutate((game) => {
        game.move(possibleMoves[randomIndex]);
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
  
      // illegal move
      if (move === null) return false;
  
      // store timeout so it can be cleared on undo/reset so computer doesn't execute move
      const newTimeout = setTimeout(makeRandomMove, 200);
      setCurrentTimeout(newTimeout);
      return true;
    }

    ////Move logger is rendered
  
    function FenLogger (){

        //initialize move content
        useEffect(()=>{
            const newMove = game.history()
            const parseMove = JSON.stringify(newMove)
            const logMove = parseMove
          if (null) { document.getElementById('fenlogger').innerHTML = 'Make a move...' }
        else {document.getElementById('fenlogger').innerHTML = logMove}
       },[])
       
         // returns json

        /**
         * [{ color: 'w', from: 'e2', to: 'e4', flags: 'b', piece: 'p', san: 'e4' }]
         */
       
        return (
            <div id="fenlogger"></div>
        )
    }
    
    //////chessborder is rendered
    
if(hasNFT)

    {return (
        <div id="gameContainer">
      <div id="boardContainer">
        <Chessboard
          id="myboard"
          animationDuration={200}
          boardOrientation={boardOrientation}
          boardWidth={boardWidth}
          position={game.fen()}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
          }}
          ref={chessboardRef}
        />
        <FenLogger />
        </div>
          <div id="boardBtnContainer"> <button id="boardBtn"
          className="rc-button"
          onClick={() => {
            safeGameMutate((game) => {
              game.reset();
            });
            // stop any current timeouts
            clearTimeout(currentTimeout);
          }}
        >
          reset
        </button>

        <button id="boardBtn"
          className="rc-button"
          onClick={() => {
            safeGameMutate((game) => {
              game.undo();
            });
            // stop any current timeouts
            clearTimeout(currentTimeout);
          }}
        >
          undo
        </button></div>

      </div>
      
    );}
    if(!hasNFT){
      return(
        <div><div>Get the freaking NFT</div>
        <button onClick={()=>NFTCheck()}>Get NFT</button></div>
      )
    }
  }
  /**
   *  
   */