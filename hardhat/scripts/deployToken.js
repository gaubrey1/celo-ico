const hre = require("hardhat");
const { mintifyNftAddress } = require("../mintifyNft/mintifyNft-address.json");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so mintifyNftContract here is a factory for instances of our MintifyToken contract.
  */
  const mintifyTokenContract = await hre.ethers.getContractFactory("MintifyToken");

  // deploy the contract
  const deployedMintifyTokenContract = await mintifyTokenContract.deploy(
    mintifyNftAddress
  );

  // Wait for it to finish deploying
  await deployedMintifyTokenContract.deployed();

  // print the address of the deployed contract
  console.log(
    "Mintify Nft Contract Address:",
    deployedMintifyTokenContract.address
  );
  storeContractData(deployedMintifyTokenContract);
}

// Create a directory/folder to store the contract address and abi
function storeContractData(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../mintifyToken";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/mintifyToken-address.json",
    JSON.stringify({ mintifyTokenAddress: contract.address }, undefined, 2)
  );

  const MyNFTArtifact = artifacts.readArtifactSync("MintifyToken");

  fs.writeFileSync(
    contractsDir + "/mintifyToken.json",
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