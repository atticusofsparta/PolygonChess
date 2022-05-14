import React from "react"
import CloseModal from "../modules/modals/modal components/CloseModal";
import ModalService from "../modules/modals/modal components/ModalService";


const Nopage = () => {
    CloseModal();
    ModalService.popped = false;
     return(<p>nothing here.... watchya looking for?</p>)}

export default Nopage;