import React from "react";
import "./Style.css";

const Home = () => {
  const wallet =
    "https://chrome.google.com/webstore/detail/casper-signer/djhndpllfiibmcdbnmaaahkhchcoijce";
  return (
    <div>
      <header>Welcome to Casper Chess</header>
      <h3>
        The only chess game that lets you save your win to the blockchain, so
        you can brag forever
      </h3>
      <div className="contentContainer">
        <div className="howItWorks">
          <div className="largeText">HOW IT WORKS:</div>
          <div>
            <ol>
              <li>Connect your Casper wallet</li>
              <li>
                Match with other players in the "Game" tab for a round of chess
              </li>
              <li>
                Whichever player loses has to pay gas to commit the game log to
                the blockchain
              </li>
              <li>
                The winner gets a permanent, immutable record of their victory
              </li>
            </ol>
          </div>
        </div>
        <div className="noCasper">
          <div className="largeText">Dont have a Casper account?</div>
          <div>
            Download the Casper Signer extension{" "}
            <a href={wallet} target="_blank" alt="">
              here
            </a>
          </div>
          <div>set a new password to create a Vault</div>
          <div>Then you can choose the "Create Account" option</div>
          <div>set your name and then choose "ED25519" as the Algorithm</div>
          <div>
            dont forget to download your secret key so you can recover your
            account if you forget your password
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
