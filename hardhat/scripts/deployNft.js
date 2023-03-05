const hre = require("hardhat");

async function main() {
  const maxIds = 20;
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so mintifyNftContract here is a factory for instances of our MintifyNft contract.
  */
  const mintifyNftContract = await hre.ethers.getContractFactory("MintifyNft");

  // deploy the contract
  const deployedMintifyNftContract = await mintifyNftContract.deploy(
    maxIds
  );

  // Wait for it to finish deploying
  await deployedMintifyNftContract.deployed();

  // print the address of the deployed contract
  console.log(
    "Mintify Nft Contract Address:",
    deployedMintifyNftContract.address
  );
  storeContractData(deployedMintifyNftContract)
}

// Create a directory/folder to store the contract address and abi
function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../mintifyNft";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/mintifyNft-address.json",
    JSON.stringify({ mintifyNftAddress: contract.address }, undefined, 2)
  );

  const MyNFTArtifact = artifacts.readArtifactSync("MintifyNft");

  fs.writeFileSync(
    contractsDir + "/mintifyNft.json",
    JSON.stringify(MyNFTArtifact, null, 2)
  );
}


// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });