import AddModal from "../modules/modals/modal components/AddModal";
import React from "react"
import NFTModal from "../modules/modals/modal files/NFTModal";
import TestModal from "../modules/modals/modal files/TestModal";
import ModalService from "../modules/modals/modal components/ModalService";



const Home = () => {return(
    <div>
        
        <button onClick={()=> AddModal(NFTModal)}>modal</button>
           </div>
)}

export default Home;