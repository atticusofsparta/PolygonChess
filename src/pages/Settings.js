import React from "react"
import CloseModal from "../modules/modals/modal components/CloseModal";
import ModalService from "../modules/modals/modal components/ModalService";
const Settings = () => {
    CloseModal();
    ModalService.popped = false
    return(<p>Yeah you have settings, surprise!</p>)}

export default Settings;