import React, {useState} from "react"
import CloseModal from "../modules/modals/modal components/CloseModal";
import ModalService from "../modules/modals/modal components/ModalService";
import immer from 'immer';
function Settings({socket, nftContract, web3, address}){
    CloseModal();
    ModalService.popped = false;
    const [contracts, setContracts] = useState([]);
   
    async function GetNftData(){
      const nftBal = await nftContract.methods.balanceOf(address).call()
      const nftOwner = await nftContract.methods.current().call()
      console.log(nftBal, " and ", nftOwner)
    }
    return(<div id="settings-main">
        <button onClick={GetNftData}>Click for nft data</button>
        <span>{contracts.map((contract, index) => <li key={index}>{contract}</li>)}</span>


    </div>)}

export default Settings;