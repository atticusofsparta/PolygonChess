import AddModal from "../modules/modals/modal components/AddModal";
import React from "react"
import NFTModal from "../modules/modals/modal files/NFTModal";
import TestModal from "../modules/modals/modal files/TestModal";
import ModalService from "../modules/modals/modal components/ModalService";
import Cover from "../modules/modals/modal files/Cover";
import LoadingModal from "../modules/modals/modal files/LoadingModal";



const Home = () => {return(
    <div>
        
        <button onClick={()=> AddModal(LoadingModal)}>modal</button>
           </div>
)}

export default Home;