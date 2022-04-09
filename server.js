const express = require("express");
const cors = require("cors");
const app = express();

const bodyParser = require("body-parser");
app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const { CasperServiceByJsonRPC,DeployUtil,EventStream,EventName,CLValueParsers,CLMap,CLValueBuilder,CLPublicKey, Contracts } = require("casper-js-sdk");
const client = new CasperServiceByJsonRPC("http://95.216.67.162:7777/rpc");
const contract = new Contracts.Contract(client);
contract.setContractHash("hash-e951e1ca48071ebda74eed2295a2dc34ba5241bb533be9062fc9de84eda45c12");



app.post("/balance", async (req, res) => {
  
  let { publicKey } = req.body;
  console.log(publicKey, "is Connected")

  const latestBlock = await client.getLatestBlockInfo();
  const root = await client.getStateRootHash(latestBlock.block.hash);

  const balanceUref = await client.getAccountBalanceUrefByPublicKey(
      root, 
      CLPublicKey.fromHex(publicKey)
      )

  //account balance from the last block
  const balance = await client.getAccountBalance(
      latestBlock.block.header.state_root_hash,
      balanceUref
  );

    res.status(200).send(balance.toString());
});

app.post("/getAccountinfo", async (req, res) => {
    let { publicKey } = req.body;
    const latestBlock = await client.getLatestBlockInfo();
    const root = await client.getStateRootHash(latestBlock.block.hash);
    const total_games = await client.getDictionaryItemByName(root, 'hash-e951e1ca48071ebda74eed2295a2dc34ba5241bb533be9062fc9de84eda45c12', '&get_caller.to_string()', 'total_games')
    console.log(total_games);
    res.send(); //Send this back to the frontend

});
app.listen(6100, () => console.log("running on port 6100..."));