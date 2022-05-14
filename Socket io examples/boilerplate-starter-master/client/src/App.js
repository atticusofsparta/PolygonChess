import { useRef, useState } from "react";
import immer from 'immer';


const initialMessageState = {
  general: [],
  random: [],
  jokes: [],
  javascript: [],

}

function App() {

  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState('General');
  const [connectedRooms, setConnectedRooms] = useState(['General'])
  const [allUsers, setAllUsers] = useState([])
  const [messages, setMessages] = useState(initialMessageState); 
  const [message, setMessage] = useState('');
  const socketRef = useRef();

  
  

  return (
    <div className="App">
   
    </div>
  );
}

export default App;
