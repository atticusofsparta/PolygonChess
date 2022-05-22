async function deployContract() {
    const PolyChessNFT = await ethers.getContractFactory("PolyChessNFT")
    const polychessNFT = await PolyChessNFT.deploy()
    await polychessNFT.deployed()
    // This solves the bug in Mumbai network where the contract address is not the real one
    const txHash = polychessNFT.deployTransaction.hash
    const txReceipt = await ethers.provider.waitForTransaction(txHash)
    const contractAddress = txReceipt.contractAddress
    console.log("Contract deployed to address:", contractAddress)
   }
   
   deployContract()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });