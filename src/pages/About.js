import AddModal from "../modules/modals/modal components/AddModal";
import React from "react"
import ModalRoot from "../modules/modals/modal components/ModalRoot";
import TestModal from "../modules/modals/modal files/TestModal";



const Home = () => {return(
    <div>
        <ModalRoot/>
        <button onClick={()=>AddModal(TestModal)}>modal</button>
    </div>
)}

export default Home;