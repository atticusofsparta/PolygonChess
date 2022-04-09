import React from "react";
import "./Style.css"

const Home = () => {
  return (
    <div>
      <header>Welcome to Casper Chess
      </header>
      <h3>
        The only chess game that lets you save your win to the blockchain, so
        you can brag forever
      </h3>
<div className="largeText">HOW IT WORKS:</div>
<div><ol>
    <li>Connect your Casper wallet</li>
    <li>Match with other players in the "Game" tab for a round of chess</li>
    <li>Whichever player loses has to pay gas to commit the game log to the blockchain</li>
    <li>The winner gets a permanent, immutable record of their victory</li>
    
    </ol></div>
    </div>
  );
};

export default Home;
