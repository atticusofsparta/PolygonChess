import "./styles.loading.css";
import React from "react";
import Modal from "../modal components/Modal";
import ModalBody from "../modal components/ModalBody";
import ModalHeader from "../modal components/ModalHeader";
import ModalFooter from "../modal components/ModalFooter";
import CloseModal from "../modal components/CloseModal";

export default function LoadingModal(props) {
  return (
    <Modal>
      <ModalHeader>
        <h3 className="loadingHeader">Finding Lobby</h3>
      </ModalHeader>
      <ModalBody>
        <div>Looking for match</div>
        <div>You will be connected to an opponent shortly</div>
      </ModalBody>
      <ModalFooter>
      <button onClick={()=> CloseModal() } className="btn btn-primary">Close Modal</button>
           </ModalFooter>
    </Modal>
  );
}