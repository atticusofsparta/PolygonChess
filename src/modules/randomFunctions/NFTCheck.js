import ModalService from "../modals/modal components/ModalService";


export default function NFTCheck(){
    console.log(ModalService.hasNFT)
    ModalService.hasNFT = true
    console.log(ModalService.hasNFT)
}