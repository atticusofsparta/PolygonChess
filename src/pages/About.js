import AddModal from "../modules/modals/modal components/AddModal";
import React from "react"

import TestModal from "../modules/modals/modal files/TestModal";
import ModalService from "../modules/modals/modal components/ModalService";



const Home = () => {return(
    <div>
        
        <button onClick={()=> AddModal(TestModal)}>modal</button>
        <button onClick={()=>ModalService.var=6}>6</button>
    </div>
)}

export default Home;