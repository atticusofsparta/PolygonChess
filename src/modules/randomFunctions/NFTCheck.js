import ModalService from "../modals/modal components/ModalService";
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
    balance_of,
    root,
  } from "casper-js-sdk";
 
const apiUrl = "http://localhost:6100/api";
const casperService = new CasperServiceByJsonRPC(apiUrl);
const casperClient = new CasperClient(apiUrl);
const client = new CasperClient(apiUrl);
const contract = new Contracts.Contract(client);
const NFT_contract =
  "hash-ec5deac7aa9f869c22d5628f1082a545d98daa6ef6289f414d655d77f4ff3e77";



export default async function NFTCheck(){
let publicKey = ModalService.userKey
 
   
    console.log(publicKey)

// contract.setContractHash(NFT_contract)
// console.log(NFT_contract)
//     const result = await contract.callEntrypoint(balance_of, [])
//     console.log(result)

   

// const balance = await client.getDictionaryItemByName(root,NFT_contract,"balances", CLPublicKey.fromHex(publicKey).toAccountHashStr().substring(13))
  
}