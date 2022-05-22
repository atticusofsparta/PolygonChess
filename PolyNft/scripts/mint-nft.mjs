const CONTRACT_ADDRESS = "0xba03d41fDdd0d7da942c80BD76Ee5d8b2Fd505E3"
const META_DATA_URL = "ipfs://bafyreig66gwfolo4nhca5c7nnie3jwyece4q2ciogqx6bru7xo6i6hto2e"

async function mintNFT(contractAddress, metaDataURL) {
   const PolyChessNFT = await ethers.getContractFactory("PolyChessNFT")
   const [owner] = await ethers.getSigners()
   await PolyChessNFT.attach(contractAddress).mintNFT(owner.address, metaDataURL)
   console.log("NFT minted to: ", owner.address)
}

mintNFT(CONTRACT_ADDRESS, META_DATA_URL)
   .then(() => process.exit(0))
   .catch((error) => {
       console.error(error);
       process.exit(1);
   });