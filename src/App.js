import {
  CasperClient,
  CasperServiceByJsonRPC,
  CLPublicKey,
  CLValueBuilder,
  isConnected,
  Signer,
  Contracts,
  DeployUtil,
  decodeBase16,
  RuntimeArgs,
  CLString,
} from "casper-js-sdk";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import "./style.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Nopage from "./pages/Nopage";
import Game from "./pages/Game";
import Layout from "./pages/Layout";
import axios from "axios";
import ModalRoot from "./modules/modals/modal components/ModalRoot";
import ModalService from "./modules/modals/modal components/ModalService";

const apiUrl = "http://localhost:6100/api";
const casperService = new CasperServiceByJsonRPC(apiUrl);
const casperClient = new CasperClient(apiUrl);
const client = new CasperClient(apiUrl);
const contract = new Contracts.Contract(client);
const singleplayer_contract =
  "hash-e951e1ca48071ebda74eed2295a2dc34ba5241bb533be9062fc9de84eda45c12";

function App() {
  const [balance, setBalance] = useState("");
  const [address, setAddress] = useState("");
  const [total_games, setTotal_Games] = useState("");
  const [wins, setWins] = useState("");
  const [losses, setLosses] = useState("");
  const [stalemates, setStalemates] = useState("");
  const [history, setHistory] = useState("");
  const [signerConnected, setSignerConnected] = useState(false);
  const [signerLocked, setSignerLocked] = useState(true);
  const [activeKey, setActiveKey] = useState("");


const globalPromiseRejectionHandler = (event) => {
  console.log("Unhandled promise rejection reason: ", event.reason);
}

window.onunhandledrejection = globalPromiseRejectionHandler;


  //   window.onunhandledrejection = function(e) {
  //   e.preventDefault()
  //   console.log(e.reason);
  //   setAddress("0186ac6f83c5bcca34f68ea7cc82f3917ccc10ad3eac96d5ad2b1dbeb0b6c02fa9")
  // }


  // window.addEventListener("signer:locked", (msg) => {
  //       console.log("locked");
      
  // });

  useEffect(() => {
    //set html
    const textAddress = document.getElementById("textAddress");
    const textBalance = document.getElementById("textBalance");
    const textTotal_Games = document.getElementById("textTotal_Games");
    textAddress.textContent = `Connected account: ${address.replace(
      address.slice(5, 61),
      " . . . "
    )}`;
    textBalance.textContent = `Balance: ${balance / 1000000000}`;
    textTotal_Games.textContent = `Total Games: ${total_games}`;
  }, [address, balance]);

  useEffect(() => {
    async function AccountInfo() {
      const isConnected = await window.casperlabsHelper.isConnected();
      const publicKey = await window.casperlabsHelper.getActivePublicKey();
      if(publicKey)
      {setAddress(publicKey);
        console.log(publicKey)
      }
else{setAddress("0186ac6f83c5bcca34f68ea7cc82f3917ccc10ad3eac96d5ad2b1dbeb0b6c02fa9")}
      

      axios
        .post("http://localhost:6100/balance", { publicKey: publicKey })
        .then((response) => {
          const bal = response.data;
          setBalance(bal);
          console.log(bal);
        }).catch(error => {console.log(error)});
      axios
        .post("http://localhost:6100/getAccountinfo", { publicKey: publicKey })
        .then((response) => {
          const games = response.data;
          setTotal_Games(games);
          console.log(games);
        }).catch(error => {console.log(error)});
    }
    var accountinfoint = setInterval(AccountInfo, 5000);
    return accountinfoint;
  }, []);

  async function connect() {
    try {
      Signer.sendConnectionRequest().then(console.log("connect"));
    } catch (error) {
      console.log(error);
    }
  }
  async function disconnect() {
    try {
      Signer.disconnectFromSite().then(console.log("disconnect"));
    } catch (error) {
      console.log(error);
    }
  }

  async function deploy() {
    if (activeKey == null) {
      //Need to be connected to the Signer to continue
      alert("Please unlock the signer to continue");
      return;
    }

    const args = RuntimeArgs.fromMap({
      //Need to build a UInt512 CLValue and package into RuntimeArgs
      total_games: CLValueBuilder.u512(total_games),
      wins: CLValueBuilder.u512(total_games),
      losses: CLValueBuilder.u512(total_games),
      stalemates: CLValueBuilder.u512(total_games),
      history: CLValueBuilder.u512(history),
    });

    // const pubkey = CLPublicKey.fromHex(activeKey); //Build CLPublicKey from hex representation of public key
    // contract.setContractHash(singleplayer_contract); //Sets the contract hash of the Contract instance. The hash of our highscore contract
    //const result = contract.callEntrypoint("add_game", args, pubkey, "casper-test", csprToMotes(1).toString(), [], 10000000); //Builds a Deploy object at add_highscore entrypoint
    //const deployJSON = DeployUtil.deployToJson(result);
    // Signer.sign(deployJSON, activeKey).then((success) => { //Initiates sign request
    //  sendDeploy(success);
    // }).catch((error) => {
    //   console.log(error);
    // });
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/Home">
            Casper Chess
          </a>

          <ul className="navbar-nav me-auto">
            <Layout />
            <li className="nav-item">
              <a className="nav-link" id="connectBtn" onClick={() => connect()}>
                Connect Signer
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="disconnectBtn"
                onClick={() => disconnect()}
              >
                Disconnect Signer
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="deployBtn" onClick={() => deploy()}>
                Save to Chain
              </a>
            </li>
          </ul>

          <ul>
            <li id="textAddress">Connected account: </li>
            <li id="textBalance">Balance: </li>
            <li id="textTotal_Games">Total Games: </li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Game" element={<Game />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="*" element={<Nopage />} />
      </Routes>
      <Outlet />
    </div>
  );
}

export default App;
