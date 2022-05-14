const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require("body-parser");
const nodeAddress = "http://95.216.67.162:7777/rpc";
const { Server } = require("socket.io");
const immer = require("immer");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["WS"]
  }
});

//middleware
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
const nftcontracthash = "hash-ec5deac7aa9f869c22d5628f1082a545d98daa6ef6289f414d655d77f4ff3e77";
const contracthash = "hash-6f978f1bd5d7071d464fa3c4fe72f5c4d7aedbad6b558402ccf5d7aecbfd915b";
const { CasperServiceByJsonRPC,DeployUtil,CLPublicKey,CasperClient} = require("casper-js-sdk");
const client = new CasperServiceByJsonRPC(nodeAddress);
const deployclient = new CasperClient(nodeAddress);

// //socket

let users = []; //users connected to server
let games = {};
let messages = { // messages on server
  General: [{sender: "test", content: "test"}],
  Spanish: [{sender: "test", content: "test"}]
}
io.on('connection', (socket) => {
  console.log('connected :', socket.id)
  //adds user to users list and gets all users in list
  socket.on('join server', (publicKey) => {
    const user = {
      publicKey,
      socket: socket.id,
    };
    users.push(user);
    io.emit('user list', users);
    socket.emit('lobby list', Object.keys(messages))
    socket.emit('game list', games)
  });
  // joins specified room and returns all messages in that room
  socket.on('join room', (roomName, cb) => {
    if (messages[roomName]){  //if room exists, joins that room and sends back messages
      socket.join(roomName);
    cb(messages[roomName]);
    console.log(socket.id, " has joined ", roomName)
  }
     else { // if room does not exist, this creates the room and sends back the messages
       messages[roomName] = [{sender:'Casper Chess', content:`You have created the "${roomName}" channel!`}];
       socket.join(messages[roomName]);
       cb(messages[roomName]);
       console.log(`the room ${roomName} has been created`)
       io.emit('lobby list', Object.keys(messages))
     }
});

socket.on('send message', ({content, to, sender, chatName, isChannel}) => {
  if (isChannel){
      const payload = {
          content,
          chatName,
          sender,
      };
      socket.to(to).emit("new message", payload)
      console.log("new message", payload)
  }
  else {
      const payload = {
          content,
          chatName: sender,
          sender,
      };
      socket.to(to).emit('new message', payload)
  };
  if (messages[chatName]) {
    messages[chatName].push({
      sender,
      content,
  }) 
  console.log(messages[chatName])
      
  };
});
//game creation
socket.on('create game', ({Name, Password, Details, Timer, White, Black}) => {
  
    if (Password === ''){
      let game = {
        Password: Password,
        Private: false,
        Details: Details,
        Timer: Timer,
        White: White,
        Black: null
      }
      games[Name] = game
    } else {
      let game = {
        Password: Password,
        Private: true,
        Details: Details,
        Timer: Timer,
        White: White,
        Black: null
      }
      games[Name] = game
    }
    
  
  socket.broadcast.emit('game list', games)
  console.log(games)
})
socket.on('join game', ({Name, Password}) => {
  games[Name].Black = socket.id;
  socket.broadcast.emit('game list', games)
  console.log(games)
})
socket.on('start game', (opponent, game) => {
  socket.to(opponent).emit('start game', socket.id)
  console.log(opponent, 'is black')
  delete games[game];
 io.emit('game list', games)
})
socket.on('move', (opponent, move) => {
  console.log(move, opponent)
  socket.to(opponent).emit('move', move)
})
socket.on('conceded', opponent => {
  socket.to(opponent).emit('conceded')
})
// disconnects user from server and removes user from users list
socket.on('disconnect', () => {
  users = users.filter(u => u.socket !== socket.id)
  io.emit('user list', users)
});
  
})


//send deploy to smart contract
app.post('/sendDeploy', (req, res) => {
    const signedJSON = req.body; //Get JSON from POST body
    let signedDeploy = DeployUtil.deployFromJson(signedJSON).unwrap(); //Unwrap from JSON to Deploy object
    signedDeploy.send(nodeAddress).then((response) => { //Send Signed Deploy
      res.send(response); //Send this back to the frontend
    }).catch((error) => {
      console.log(error);
      return;
    });
  });
  //checks deploys status
  app.get("/getDeploy", (req, res) => {
    const hash = req.query.hash;
    deployclient.getDeploy(hash).then((response) => { //Calls getDeploy on the client with the deploy hash. Responds with current deploy status
      res.send(response[1].execution_results); //Send this back to the frontend
      return;
    }).catch((error) => {
      res.send(error);
      return;
    })
  });

   //account balance from the last block
app.post("/balance", async (req, res) => {
  let { publicKey } = req.body;
  const latestBlock = await client.getLatestBlockInfo();
  const root = await client.getStateRootHash(latestBlock.block.hash);
  const balanceUref = await client.getAccountBalanceUrefByPublicKey(root,CLPublicKey.fromHex(publicKey))
  const balance = await client.getAccountBalance(latestBlock.block.header.state_root_hash,balanceUref);
    res.status(200).send(balance.toString());
});

//gets connected account info from contract
app.get("/get_nft_balance", async (req, res) => {
    const publicKey = req.query.publicKey;

    const latestBlock = await client.getLatestBlockInfo();
    const root = await client.getStateRootHash(latestBlock.block.hash);
    await client.getDictionaryItemByName(root,nftcontracthash, "balances",CLPublicKey.fromHex(publicKey).toAccountHashStr().substring(13)).then((response) => {
    res.send(response.CLValue.data.val.data)})
})

app.get("/get_total_games", async (req, res) => {
    const publicKey = req.query.publicKey;
    const latestBlock = await client.getLatestBlockInfo();
    const root = await client.getStateRootHash(latestBlock.block.hash);
    await client.getDictionaryItemByName(root,contracthash, CLPublicKey.fromHex(publicKey).toAccountHashStr().substring(13), "total_games").then((response) => {
    res.send(response.CLValue.data)}
     )
})

app.get("/get_wins", async (req, res) => {
    const publicKey = req.query.publicKey;
    const latestBlock = await client.getLatestBlockInfo();
    const root = await client.getStateRootHash(latestBlock.block.hash);
    await client.getDictionaryItemByName(root,contracthash, CLPublicKey.fromHex(publicKey).toAccountHashStr().substring(13), "wins").then((response) => {
    res.send(response.CLValue.data)}
     )
})
app.get("/get_losses", async (req, res) => {
    const publicKey = req.query.publicKey;
    const latestBlock = await client.getLatestBlockInfo();
    const root = await client.getStateRootHash(latestBlock.block.hash);
    await client.getDictionaryItemByName(root,contracthash, CLPublicKey.fromHex(publicKey).toAccountHashStr().substring(13), "losses").then((response) => {
    res.send(response.CLValue.data)}
     )
})
app.get("/get_stalemates", async (req, res) => {
    const publicKey = req.query.publicKey;
    const latestBlock = await client.getLatestBlockInfo();
    const root = await client.getStateRootHash(latestBlock.block.hash);
    await client.getDictionaryItemByName(root,contracthash, CLPublicKey.fromHex(publicKey).toAccountHashStr().substring(13), "stalemates").then((response) => {
    res.send(response.CLValue.data)}
     )
})




server.listen(6100, () => console.log("running on port 6100..."));

