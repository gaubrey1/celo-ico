# BUILDING AN INITIAL COIN OFFERING(ICO) ON THE CELO BLOCKCHAIN USING REACT.JS


## Introduction
Welcome to this step-by-step tutorial on creating an Initial Coin Offering (ICO) for a minted NFT on the Celo blockchain using React. In this tutorial, we will guide you through the process of creating two tokens; an ERC-721 token and an ERC-20 token on the Celo blockchain, building a smart contract to manage the ICO and NFT, and creating a web interface using React to interact with the smart contract and launch your ICO as well as the NFT.

Our project involves creating a unique NFT (non-fungible token) that represents a one-of-a-kind piece of digital artwork. The NFT will be minted on a blockchain, making it verifiable, transparent, and immutable. This means that the ownership and authenticity of the artwork can be easily verified, and the value of the NFT can increase over time based on demand.

By minting the NFT, you will be rewarded with and ICO before it becomes publicly available. This means you will have exclusive ownership of a unique piece of digital art and the potential for a significant return on your investment.

Before we get started, it's important to have a basic understanding of what an initial coin offering is, smart contracts, and the Celo blockchain.

An initial coin offering (ICO) is a fundraising method used by blockchain-based startups to raise capital. It is similar to an initial public offering (IPO) in the traditional finance world, but instead of offering shares of stock, companies offer digital tokens or coins that can be used within their network or ecosystem.

ICO participants can purchase these tokens using cryptocurrencies such as Bitcoin or Ethereum. The tokens are usually sold at a discount during the ICO period to incentivize early investors, and their value may appreciate over time as the project develops and gains adoption.

Celo is an open-source blockchain platform that enables fast, secure, and low-cost mobile payments and access to decentralized finance (DeFi) applications. It uses a proof-of-stake consensus algorithm, which makes it more energy-efficient and less resource-intensive than other blockchain platforms. It was designed to enable a new universe of financial solutions accessible to mobile users, creating a global financial ecosystem where an end-user can onboard into the Celo ecosystem with just a mobile number. It offers the following key features
  - Proof-of-stake
  - Carbon negative
  - Layer-1 protocol
  - EVM compatible
  - Mobile-first identity
  - Ultra-light clients
  - Localized stablecoins (cUSD, cEUR, cREAL)
  - Gas payable in multiple currencies
  For more information, click [here](https://docs.celo.org/general) to learn more about celo

## Learning Objective
In this tutorial, we will cover the following steps:

- Setting up your development environment
- Creating an ERC-20 and an ERC-721 token
- Building a smart contract for the ICO and NFT
- Developing a React interface for the ICO and NFT
- Deploying the smart contract and launching the NFT and ICO
By the end of this tutorial, you will have a working ICO and NFT on the Celo blockchain, with a web interface that allows users to purchase your token and participate in your project.

So, let's get started!

## Requirement
To follow along with this tutorial, you should have a basic understanding of React and web development, as well as some familiarity with Solidity, the programming language used to write smart contracts on the Ethereum and Celo blockchains.

## Prerequisites
- This tutorial assumes that you have some basic knowledge of Solidity and React.
- You can write code in Vue.js
- Have metamask extension wallet installed and set up. If not, install [MetamaskExtensionWallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh?hl=en) from Google Chrome store
- [Nodejs](https://nodejs.org/) installed on your machine.
- An IDE such as [Vscode](https://code.visualstudio.com/) or Sublime text.
- [RemixIDE](https://remix.ethereum.org/)
- Command line or similar software installed.


## Tech Stack
We will use the following tools and languages in this tutorial
- Hardhat
- VSCode
- A web browser
- Solidity
- React

## Table of Content
1. [Smart contract development](#smart-contract-development)
2. [Deploy smart contract](#deploy-smart-contract)
3. [Building the frontend](#building-the-frontend-with-vue)
4. [Pushing to Github](#pushing-code-to-github)
5. [Delpoying to vercel](#deploying-to-vercel)

## Step 1: Smart Contract Development
In this section of this tutorial, we will be developing the smart contract for the ICO and the NFT. To build the smart contract we would be using [Hardhat](https://hardhat.org/). Hardhat is an Ethereum development environment and framework designed for full stack development in Solidity. In simple words you can write your smart contract, deploy them, run tests, and debug your code.

To setup a Hardhat project, Open up a terminal and execute these commands

```bash
mkdir Celo-ICO
cd Celo-ICO
mkdir hardhat
cd hardhat
npm init --yes
npm install --save-dev hardhat
```
- If you are a Windows user, you'll have to add one more dependency. so in the terminal, add the following command :

```bash 
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

- In the same directory where you installed Hardhat run:

```bash
npx hardhat
```

Make sure you select `Create a Javascript Project` and then follow the steps in the terminal to complete your Hardhat setup.

In the same terminal now install `@openzeppelin/contracts` as we would be importing [Openzeppelin's ERC721Enumerable Contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol) in our contracts.

```bash
npm install @openzeppelin/contracts
```

Create a two file inside the `contracts` directory. The first file should be named `MintifyNft.sol` and the second file named `MintifyToken.sol`.

- Open the `MintifyNft.sol` and paste the following code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintifyNft is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
  // _price is the price for one NFT
  uint256 public _price = 2 ether;

  // max number of NFT available for minting, it will be defined on initiating the contract
  uint256 public maxTokenIds;

  // total number of tokenIds minted
  uint256 public tokenIds;

  /**
    * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
    * name in our case is `Mintify Token` and symbol is `MT`.
    * Constructor for Mintify Token takes in the _maxTokenIds.
  */
  constructor(uint256 _maxTokenIds) ERC721("Mintify Token", "MT") {
    maxTokenIds = _maxTokenIds;
  }

  /**
    * @dev safeMint allows a user to mint one NFT per transaction.
  */
  function safeMint(uint256 _tokenId, string memory _tokenURI) public payable {
    require(tokenIds < maxTokenIds, "Exceed maximum NFT supply");
    require(msg.value >= _price, "Ether sent is not correct");

    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _tokenURI);
    tokenIds += 1;
  }

  /**
    * @dev withdraw sends all the ether(celo) in the contract
    * to the owner of the contract
  */
  function withdraw() public onlyOwner {
    address _owner = owner();
    uint256 amount = address(this).balance;
    (bool sent, ) = _owner.call{value: amount}("");
    require(sent, "Failed to send amount");
  }

  // Function to receive Ether. msg.data must be empty
  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}


    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

- Open the `MintifyToken.sol` file and paste the following code

```solidity
// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.9;

  import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
  import "@openzeppelin/contracts/access/Ownable.sol";
  import "./MintifyNft.sol";

  contract MintifyToken is ERC20, Ownable {
      // Each NFT would give the user 5 tokens
      // It needs to be represented as 10 * (10 ** 18) as ERC20 tokens are represented by the smallest denomination possible for the token
      // By default, ERC20 tokens have the smallest denomination of 10^(-18). This means, having a balance of (1)
      // is actually equal to (10 ^ -18) tokens.
      // Owning 1 full token is equivalent to owning (10^18) tokens when you account for the decimal places.
      // More information on this can be found in the Freshman Track Cryptocurrency tutorial.
      uint256 public constant tokensPerNFT = 5 * 10**18;

      // the max total supply is 5000 for MintifyToken Tokens
      uint256 public constant maxTotalSupply = 5000 * 10**18;

      // MintifyNft contract instance
      MintifyNft mintifyNft;

      // Mapping to keep track of which tokenIds have been claimed
      mapping(uint256 => bool) public tokenIdsClaimed;

      constructor(MintifyNft mintifyNftAddress) ERC20("MintifyToken", "MT") {
          mintifyNft = mintifyNftAddress;
      }

      /**
       * @dev Mints tokens based on the number of NFT's held by the sender
       * Requirements:
       * balance of MintifyNft NFT's owned by the sender should be greater than 0
       * Tokens should have not been claimed for all the NFTs owned by the sender
       */
      function claimToken() public {
          address sender = msg.sender;
          // Get the number of MintifyNft NFT's held by a given sender address
          uint256 balance = mintifyNft.balanceOf(sender);

          // If the balance is zero, revert the transaction
          require(balance > 0, "You don't own any Mintify NFT");

          // amount keeps track of number of unclaimed tokenIds
          uint256 amount = 0;
          
          // loop over the balance and get the token ID owned by `sender` at a given `index` of its token list.
          for (uint256 i = 0; i < balance; i++) {
              uint256 tokenId = mintifyNft.tokenOfOwnerByIndex(sender, i);

              // if the tokenId has not been claimed, increase the amount
              if (!tokenIdsClaimed[tokenId]) {
                  amount += 1;
                  tokenIdsClaimed[tokenId] = true;
              }
          }
          // If all the token Ids have been claimed, revert the transaction;
          require(amount > 0, "You have already claimed all the tokens");

          // call the internal function from Openzeppelin's ERC20 contract
          // Mint (amount * 10) tokens for each NFT
          _mint(msg.sender, amount * tokensPerNFT);
      }
  }
```

## Step 2: Deploy Smart Contract
To deploy our smart contract, we will need to install some packages. Let's install dotenv package to be able to import the env file and use it in our config. Open up a terminal pointing at hardhat-tutorial directory and execute this command

```bash
npm install dotenv
```

Now create a `.env` file in the `hardhat` folder and add the following lines.

Add your mnemonic into the file, like this:
```
MNEMONIC="YOUR_SECRET_RECOVERY_PHRASE"
```
In this case, we are using a mnemonic from an account created on Metamask. You can copy it from your Metamask. In Metamask, you can click on the identicon, go to settings, select "Security & Privacy", click on “Reveal Secret Recovery Phrase”, and copy that phrase.

Let's deploy the contract to the celo alfajores network. Create a two new files in the `scripts` folder, the first should be named `deployNft.js` and the second named `deployToken.js`.

- In the `deployNft.js` file, paste the following code

```js
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
```

- In the `deployToken.js` file, paste the following code

```js
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
```

Now open the `hardhat.config.js` file, we'll set-up the celo network here so that we can deploy our contract to the Celo alfajores network. Replace all the lines in the `hardhat.config.js` file with the following code

```js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

 module.exports = {
  solidity: "0.8.9",
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
      },
      chainId: 44787,
    },
  },
};
```

- Compile the contract, open up a terminal pointing at hardhat-tutorial directory and execute this command

```bash
npx hardhat compile
```

- To deploy, open up a terminal pointing at `hardhat` directory and execute this commands

```bash
npx hardhat run scripts/deployNft.js --network alfajores
```
```bash
npx hardhat run scripts/deployToken.js --network alfajores
```
> You'll have to run the `deployNft.js` file before the `deployToken.js` file as the former makes use of the later's contract address.

This will create two new folders `mintifyNft` and `mintifyToken` with each folder containing the corresponding contract's address and abi. This will be needed to interact with each smart contract on the frontend.

## Step 3: Frontend Development with React
To develop the website we would be using [React](https://reactjs.org/). React is a declarative, component-based javascript framework which is used for building user interfaces. First, You would need to create a new react app. Your folder structure should look something like

```
- Celo-ICO
     - hardhat
     - my-app
```

- To create this my-app, open a terminal pointing to the Celo-ICO folder and type the following code

```bash
npx create-react-app my-app
```

- Now to run the app, execute these commands in the terminal

```bash
cd my-app
npm start
```

Now let's install [Web3Modal library](https://github.com/Web3Modal/web3modal). Web3Modal is an easy-to-use library to help developers add support for multiple providers in their apps with a simple customizable configuration. By default Web3Modal Library supports injected providers like (Metamask, Dapper, Gnosis Safe, Frame, Web3 Browsers, etc), You can also easily configure the library to support Portis, Fortmatic, Squarelink, Torus, Authereum, D'CENT Wallet and Arkane.

- Open up a terminal pointing at my-app directory and execute this command
```bash
npm install web3modal
```

- In the same terminal also install ethers.js
> Note : We install v5 specifically since the new v6 has breaking changes to the code.
```bash
npm install ethers@5
```
In your `src` folder, download this [images]() and save it.

Now go to `App.css` file in the `src` folder and replace all the contents of this file with the following code, this would add some styling to your dapp.
```css
.main {
  min-height: 90vh;
  display: flex;
  padding: 0px 20px;
  gap: 20px 10%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-family: "Courier New", Courier, monospace;
  font-size: 16px;
}
.header {
  width: 50%;
}

.footer {
  display: flex;
  padding: 2rem 0;
  border-top: 1px solid #eaeaea;
  justify-content: center;
  align-items: center;
}

.image {
  width: 400px;
  height: 50%;
}

.title {
  font-size: 3rem;
  margin: 2rem 0;
}

.description {
  line-height: 1.5;
  margin: 2rem 0;
  font-size: 1.3rem;
}

.button {
  border-radius: 4px;
  background-color: blue;
  border: none;
  color: #ffffff;
  font-size: 15px;
  padding: 20px;
  width: 200px;
  cursor: pointer;
  margin-bottom: 2%;
  margin-right: 10px;
}
@media (max-width: 1000px) {
  .main {
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
```

Open your `App.js` file under the `src` folder and paste the following code, explanation of the code can be found in the comments
```js
import { Contract, providers, utils, BigNumber } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { mintifyNftAbi, mintifyNftAddress, mintifyTokenAddress, mintifyTokenAbi } from "./constants/index";
import './App.css';
import image from "./15.svg";

export default function Home() {
  // Create a BigNumber `0`
  const zero = BigNumber.from(0);
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // tokenIdsMinted keeps track of the number of tokenIds that have been minted
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  // tokensMinted is the total number of tokens that have been minted till now out of 10000(max total supply)
  const [tokensMinted, setTokensMinted] = useState(zero);
  // balanceOfMintifyTokens keeps track of number of Crypto Dev tokens owned by an address
  const [balanceOfMintifyTokens, setBalanceOfMintifyTokens] = useState(zero);
  // isOwner gets the owner of the contract through the signed address
  const [isOwner, setIsOwner] = useState(false);
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();


  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      await getOwner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * mintNft: Mint an NFT
   */
  const mintNft = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      await getTokenIdsMinted();
      console.log(tokenIdsMinted);
      const tokenURI = "https://gateway.pinata.cloud/ipfs/QmaUihudH1Dv8imkPgMMcYgEAJ8qbq4NT418VyzsHJXutL/0"
      
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const nftContract = new Contract(mintifyNftAddress, mintifyNftAbi, signer);
      //, mintifyTokenAddress, mintifyTokenAbi call the mint from the contract to mint the Crypto Dev
      const tx = await nftContract.safeMint(
        tokenIdsMinted,
        tokenURI,
        { value: utils.parseEther("1") }
      );
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      await getTokenIdsMinted();
      setLoading(false);
      window.alert("You successfully minted a Crypto Dev!");
    } catch (err) {
      console.error(err);
    }
  };

    /**
   * claimTokens: Helps the user claim Crypto Dev Tokens
   */
    const claimTokens = async () => {
      try {
        // We need a Signer here since this is a 'write' transaction.
        // Create an instance of tokenContract
        const signer = await getProviderOrSigner(true);
        // Create an instance of tokenContract
        const tokenContract = new Contract(
          mintifyTokenAddress,
          mintifyTokenAbi,
          signer
        );
        const tx = await tokenContract.claimToken();
        setLoading(true);
        // wait for the transaction to get mined
        await tx.wait();
        setLoading(false);
        window.alert("Sucessfully claimed Crypto Dev Tokens");
        await getBalanceOfMintifyTokens();
        await getTotalTokensMinted();
      } catch (err) {
        console.error(err);
      }
    };

      /**
   * withdrawCoins: withdraws ether by calling
   * the withdraw function in the contract
   */
  const withdrawCoins = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = new Contract(
        mintifyNftAddress,
        mintifyNftAbi,
        signer
      );

      const tx = await nftContract.withdraw();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getOwner();
    } catch (err) {
      console.error(err);
      window.alert(err.reason);
    }
  };


    /**
   * getOwner: gets the contract owner by connected address
   */
    const getOwner = async () => {
      try {
        const provider = await getProviderOrSigner();
        const nftContract = new Contract(
          mintifyNftAddress,
          mintifyNftAbi,
          provider
        );
        // call the owner function from the contract
        const _owner = await nftContract.owner();
        // we get signer to extract address of currently connected Metamask account
        const signer = await getProviderOrSigner(true);
        // Get the address associated to signer which is connected to Metamask
        const address = await signer.getAddress();
        console.log(address);
        console.log(_owner);
        if (address.toLowerCase() === _owner.toLowerCase()) {
          setIsOwner(true);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
  /**
    * getBalanceOfCryptoDevTokens: checks the balance of Crypto Dev Tokens's held by an address
  */
    const getBalanceOfMintifyTokens = async () => {
      try {
        // Get the provider from web3Modal, which in our case is MetaMask
        // No need for the Signer here, as we are only reading state from the blockchain
        const provider = await getProviderOrSigner();
        // Create an instace of token contract
        const tokenContract = new Contract(
          mintifyTokenAddress,
          mintifyTokenAbi,
          provider
        );
        // We will get the signer now to extract the address of the currently connected MetaMask account
        const signer = await getProviderOrSigner(true);
        // Get the address associated to the signer which is connected to  MetaMask
        const address = await signer.getAddress();
        // call the balanceOf from the token contract to get the number of tokens held by the user
        const balance = await tokenContract.balanceOf(address);
        // balance is already a big number, so we dont need to convert it before setting it
        setBalanceOfMintifyTokens(balance);
      } catch (err) {
        console.error(err);
        setBalanceOfMintifyTokens(zero);
      }
    };


    /**
   * getTotalTokensMinted: Retrieves how many tokens have been minted till now
   * out of the total supply
   */
    const getTotalTokensMinted = async () => {
      try {
        // Get the provider from web3Modal, which in our case is MetaMask
        // No need for the Signer here, as we are only reading state from the blockchain
        const provider = await getProviderOrSigner();
        // Create an instance of token contract
        const tokenContract = new Contract(
          mintifyTokenAddress,
          mintifyTokenAbi,
          provider
        );
        // Get all the tokens that have been minted
        const _tokensMinted = await tokenContract.totalSupply();
        setTokensMinted(_tokensMinted);
      } catch (err) {
        console.error(err);
      }
    };

  /**
   * getTokenIdsMinted: gets the number of tokenIds that have been minted
   */
  const getTokenIdsMinted = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const nftContract = new Contract(mintifyNftAddress, mintifyNftAbi, provider);
      // call the tokenIds from the contract
      const _tokenIds = await nftContract.tokenIds();
      //_tokenIds is a `Big Number`. We need to convert the Big Number to a string
      setTokenIdsMinted(_tokenIds.toString());
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Celo Alfajores network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    
    if (chainId !== 44787) {
      window.alert("Change the network to Celo Alfajores");
      throw new Error("Change network to Celo Alfajores");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "celo alfajores",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getTotalTokensMinted();
      getBalanceOfMintifyTokens();
      getTokenIdsMinted();
      getOwner();
    }
  }, [walletConnected]);

  /*
      renderButton: Returns a button based on the state of the dapp
    */
  const renderButton = () => {
    // If we are currently waiting for something, return a loading button
    if (loading) {
      return <button className="button">Loading...</button>;
    }
    else {
      // If wallet is not connected, return a button which allows them to connect their wllet
      if(!walletConnected) {
        return (
          <button onClick={connectWallet} className="button">
            Connect your wallet
          </button>
        );
      } else if (walletConnected && !isOwner) {
        if(tokenIdsMinted < 0) {
          return (
            <button onClick={mintNft} className="button">
              Mint Nft
            </button>
          )
        } else {
          // If tokens to be claimed are greater than 0, Return a mint nft and a claim button
          return (
            <div>
              <button onClick={mintNft} className="button">
                Mint Nft
              </button>
              <button className="button" onClick={claimTokens}>
                Claim Tokens
              </button>
            </div>
          );
        }
      } else if(walletConnected && isOwner) {
        return (
          <div>
            <button className="button" onClick={withdrawCoins}>Withdraw</button>
          </div>
        )
      }
    }
  }


  return (
    <div>
      <div>
        <title>Mintify</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </div>
      <div className="main">
        <div className="header">
          <h1 className="title">Welcome to Mintify!</h1>
          <div className="description">
            <p>An ICO and NFT minting platform that give users 
              special access to a variety of products and services
            </p>
          </div>
          <div className="description">
            <p>{tokenIdsMinted}/20 have been minted</p>
            <p>You have been awarded {utils.formatEther(balanceOfMintifyTokens)} Mintify Tokens</p>
            {/* Format Ether helps us in converting a BigNumber to string */}
            <p>Overall {utils.formatEther(tokensMinted)}/10000 Mintify Tokens have been minted!!!</p>
          </div>
          {renderButton()}
        </div>
        <div className="image">
          <img src={image} alt="Header"/>
        </div>
      </div>

      <footer className="footer">
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
```
