import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import io from 'socket.io-client';
const socket = io('http://localhost:6100');


function getLibrary(provider) {
  return new Web3(provider);
}

ReactDOM.render(
  <React.StrictMode>
   <BrowserRouter>
   <Web3ReactProvider getLibrary={getLibrary}>
   <App socket={socket}/>
   </Web3ReactProvider>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
