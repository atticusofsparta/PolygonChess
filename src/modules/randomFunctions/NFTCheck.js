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
  } from "casper-js-sdk";
 
const apiUrl = "http://localhost:6100/api";
const casperService = new CasperServiceByJsonRPC(apiUrl);
const casperClient = new CasperClient(apiUrl);
const client = new CasperClient(apiUrl);
const contract = new Contracts.Contract(client);
const singleplayer_contract =
  "hash-e951e1ca48071ebda74eed2295a2dc34ba5241bb533be9062fc9de84eda45c12";



export default async function NFTCheck(){
let publicKey = ModalService.userKey

    let cep47 = "ec5deac7aa9f869c22d5628f1082a545d98daa6ef6289f414d655d77f4ff3e77"
    ModalService.hasNFT = true
    console.log(publicKey)

    console.log(cep47)
  
}