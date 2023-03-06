# Building an Initial Coin Offering(ICO) On the Celo Blockchain Using React.JS
- Reading time: 27 minutes
- Link to live demo: [Celo Initial Coin Offering Tutorial](https://celo-ico.vercel.app/)

## Introduction
Welcome to this step-by-step tutorial on creating an [Initial Coin Offering (ICO)](https://www.investopedia.com/terms/i/initial-coin-offering-ico.asp) for a minted NFT on the Celo blockchain using React. In this tutorial, we will guide you through the process of creating two tokens; an ERC-721 token and an ERC-20 token on the [Celo](https://celo.org/) blockchain, building a smart contract to manage the ICO and NFT, and creating a web interface using React to interact with the smart contract and launch your ICO as well as the NFT(Non-fungible Token).

Our project involves creating a unique NFT (non-fungible token) that represents a one-of-a-kind piece of digital artwork. The NFT will be minted on a blockchain, blockchain makes it verifiable, transparent, and immutable. This means that the ownership and authenticity of the artwork can be easily verified. Also the value of the NFT can increase over time based on demand.

By minting the NFT, you will be rewarded with an ICO before it becomes publicly available. This means you will have exclusive ownership of a unique piece of digital art and the potential for a significant return on your investment.

Before we get started, it's important to have a basic understanding of  the following:
- An initial coin offering
- Smart contracts
- The Celo blockchain.

An initial coin offering (ICO) is a fundraising method used by blockchain-based startups to raise capital. It is similar to an [initial public offering (IPO)](https://en.wikipedia.org/wiki/Initial_public_offering#:~:text=IPOs%20generally%20involve%20one%20or,offers%20to%20sell%20those%20shares.) in the traditional finance world, but instead of offering shares of stock, companies offer digital tokens or coins that can be used within their network or ecosystem.

ICO participants can purchase these tokens using cryptocurrencies such as Bitcoin or Ethereum. The tokens are usually sold at a discount during the ICO period to incentivize early investors, and their value may appreciate over time as the project develops and gains adoption.

Celo is an open-source blockchain platform that enables fast, secure, and low-cost mobile payments and access to [decentralized finance (DeFi)](https://www.investopedia.com/decentralized-finance-defi-5113835#:~:text=Decentralized%20finance%2C%20or%20DeFi%2C%20uses,its%20regulation%20are%20constantly%20evolving.) applications. It uses a [proof-of-stake consensus algorithm](https://www.investopedia.com/terms/p/proof-stake-pos.asp), which makes it more energy-efficient and less resource-intensive than other blockchain platforms. It was designed to enable a new universe of financial solutions accessible to mobile users, creating a global financial ecosystem where an end-user can onboard into the Celo ecosystem with just a mobile number. It offers the following key features:
  - Proof-of-stake
  - [Carbon negative](https://blog.celo.org/a-carbon-negative-blockchain-its-here-and-it-s-celo-60228de36490)
  - [Layer-1 protocol](https://builtin.com/blockchain/layer-1-blockchain#:~:text=Layer%201%20refers%20to%20the,ecosystem%2C%20they%20define%20the%20rules.)
  - [EVM compatible](https://blog.thirdweb.com/evm-compatible-blockchains-and-ethereum-virtual-machine/)
  - Mobile-first identity
  - Ultra-light clients
  - Localized stablecoins (cUSD, cEUR, cREAL)
  - Gas payable in multiple currencies
  For more information, click [here](https://docs.celo.org/general) to learn more about Celo.

## Learning Objective
In this tutorial, we will cover the following steps:

- Setting up your development environment
- Creating an ERC-20 and an ERC-721 token
- Building a smart contract for the ICO and NFT
- Developing a React interface for the ICO and NFT
- Deploying the smart contract and launching the NFT and ICO

## Requirement
To follow along with this tutorial, you should have a basic understanding of the following:
- React and web development.
- Solidity, the programming language used to write smart contracts on the Ethereum and Celo blockchains.

## Prerequisites
- This tutorial assumes that you have some basic knowledge of Solidity and React.
- You can write code in [React.js](https://reactjs.org/)
- Have metamask extension wallet installed and set up. If not, install [MetamaskExtensionWallet](https://metamask.io/)
- [Nodejs](https://nodejs.org/) installed on your machine.
- An IDE such as [Vscode](https://code.visualstudio.com/) or Sublime text.
- [RemixIDE](https://remix.ethereum.org/)
- Command line or similar software installed.

## Tech Stack
We will use the following tools and languages in this tutorial
- [Hardhat](https://hardhat.org/)
- [VSCode](https://code.visualstudio.com/)
- A web browser
- Solidity
- React

## Table of Content
1. [Smart contract development](#smart-contract-development)
2. [Deploy smart contract](#deploy-smart-contract)
3. [Building the frontend](#building-the-frontend)
4. [Pushing code to Github](#pushing-code-to-github)
5. [Deploying to vercel](#deploying-to-vercel)
6. [Conclusion](#conclusion)

By the end of this tutorial, you will have a working ICO and NFT on the Celo blockchain, with a web interface that allows users to purchase your token and participate in your project.

So, let's get started!

## Smart Contract Development
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

In the same terminal now install `@openzeppelin/contracts` as we would be importing Openzeppelin's [ERC721Enumerable Contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol), [ERC721URIStorage Contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol) and [Ownable Contract](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol) in our contracts.

```bash
npm install @openzeppelin/contracts
```

In the `contracts` folder, delete the `Lock.sol` file and create two new files in the folder: 
- The first file should be named `MintifyNft.sol`.
- Rhe second file named `MintifyToken.sol`.

- Open the `MintifyNft.sol` and paste the following code.

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

## Deploy Smart Contract
To deploy our smart contract, we will need to install some packages. Let's install **dotenv** package to be able to import the env file and use it in our config.

- Open up a terminal pointing at **hardhat-tutorial** directory and execute this command.
```bash
npm install dotenv
```

Now create a `.env` file in the `hardhat` folder and add the following lines.

Add your mnemonic into the file, like this:
```
MNEMONIC="YOUR_SECRET_RECOVERY_PHRASE"
```
In this case, we are using a **mnemonic** from an account created on Metamask. You can copy it from your Metamask. In Metamask, you can click on the identicon, go to settings, select "Security & Privacy", click on “Reveal Secret Recovery Phrase”, and copy that phrase.

Let's deploy the contract to the **Celo alfajores network**. In the `scripts` folder, delete the `deploy.js` file and create two new files:
- The first should be named `deployNft.js`.
- The second named `deployToken.js`.

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

Now open the `hardhat.config.js` file, we'll set-up the celo network here so that we can deploy our contract to the **Celo alfajores network**. Replace all the lines in the `hardhat.config.js` file with the following code:

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

- Compile the contract, open up a terminal pointing at `hardhat` directory and execute this command.

```bash
npx hardhat compile
```

You should get a message in the terminal like this

![](https://github.com/gaubrey1/celo-ico/blob/main/tutorial-images/hardhat-compile-successful.png)

- To deploy, open up a terminal pointing at `hardhat` directory and execute this commands.

```bash
npx hardhat run scripts/deployNft.js --network alfajores
```
```bash
npx hardhat run scripts/deployToken.js --network alfajores
```
> You'll have to run the `deployNft.js` file before the `deployToken.js` file as the former makes use of the latter's contract address.

This will create two new folders `mintifyNft` and `mintifyToken` with each folder containing the corresponding contract's address and application binary interface(ABI). This will be needed to interact with each smart contract on the frontend.

## Building the Frontend
To develop the frontend of our website we would be using [React](https://reactjs.org/). React is a declarative, component-based javascript framework, which is used for building user interfaces. First, You would need to create a new react app. Your folder structure should look something like:

```
- Celo-ICO
     - hardhat
     - my-app
```

- To create this my-app, open a terminal pointing to the `Celo-ICO` folder and type the following code:
> Note: This process may take a while to complete

```bash
npx create-react-app my-app
```
`my-app` is our reat application folder.

- Now to run the app, execute these commands in the terminal

```bash
cd my-app
npm start
```

Your project should look something this

![](https://github.com/gaubrey1/celo-ico/blob/main/tutorial-images/initial-project.png)

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
Download this [image](https://github.com/gaubrey1/celo-ico/blob/main/tutorial-images/15.svg) and save it in the `src` folder in the `my-app` directory.

- Now go to `App.css` file in the `src` folder and replace all the contents of this file with the following code, this would add some styling to your dapp.
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
  height: 400px;
}
.image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.title {
  font-size: 3rem;
  margin: 2rem 0;
}

.description {
  line-height: 1.5;
  margin: 2rem 0;
  font-size: 1rem;
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

- Open your `App.js` file under the `src` folder and paste the following code, explanation of the code can be found in the comments.
```js
import { Contract, providers, utils, BigNumber } from "ethers";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { mintifyNftAbi, mintifyNftAddress, mintifyTokenAddress, mintifyTokenAbi } from "./constants/index";
import './App.css';
import image from "./15.svg";

function App () {
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
  // balanceOfMintifyTokens keeps track of number of Mintify tokens owned by an address
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
      await getTokenIdsMinted();
      const tokenURI = "https://gateway.pinata.cloud/ipfs/QmaUihudH1Dv8imkPgMMcYgEAJ8qbq4NT418VyzsHJXutL/0"
      
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const nftContract = new Contract(mintifyNftAddress, mintifyNftAbi, signer);
      // call the mint from the contract to mint the Mintify NFT
      const tx = await nftContract.safeMint(
        tokenIdsMinted,
        tokenURI,
        { value: utils.parseEther("2") }
      );
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      await getTokenIdsMinted();
      setLoading(false);
      window.alert("You successfully minted a Mintify NFT!");
    } catch (err) {
      console.error(err);
    }
  };

    /**
   * claimTokens: Helps the user claim Mintify Tokens
   */
    const claimTokens = async () => {
      if(tokenIdsMinted <= 0) {
        alert("Please mint an NFT to claim your token")
      } else {
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
          alert("Sucessfully claimed Mintify Tokens");
          await getBalanceOfMintifyTokens();
          await getTotalTokensMinted();
        } catch (err) {
          console.error(err);
        }
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
        if (address.toLowerCase() === _owner.toLowerCase()) {
          setIsOwner(true);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
  /**
    * getBalanceOfMintifyTokens: checks the balance of Mintify Tokens's held by an address
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
        if(tokenIdsMinted <= 0) {
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
            <p>Overall {utils.formatEther(tokensMinted)}/5000 Mintify Tokens have been minted!!!</p>
          </div>
          {renderButton()}
        </div>
        <div className="image">
          <img src={image} alt="Header"/>
        </div>
      </div>

      <footer className="footer">
        Made with &#10084; by Mintify
      </footer>
    </div>
  );
}

export default App;

```

- Now create a new folder under the `src` folder and name it `constants`. In the `constants` folder create a file called `index.js` and paste the following code:
```js
export const mintifyNftAbi = abi-of-your-nft-contract;
export const mintifyNftAddress = "address-of-your-nft-contract";
export const mintifyTokenAbi = abi-of-your-token-contract;
export const mintifyTokenAddress = "address-of-your-token-contract";
```

Replace "abi-of-your-nft-contract" and "address-of-your-nft-contract" with the abi and address of the NFT contract that you deployed respectively. This can be found in the `mintifyNft-address.json` file(for the address) and `mintifyNft.json` file (for the abi) in the `mintifyNft` folder of the `hardhat` directory.


Replace "abi-of-your-token-contract" and "address-of-your-token-contract" with the abi and address of the token contract that you deployed respectively. This can be found in the the `mintifyToken-address.json` file(for the address) and `mintifyToken.json` file (for the abi) in the `mintifyToken` folder of the `hardhat` directory.

Your project should look somehting like this:

![](https://github.com/gaubrey1/celo-ico/blob/main/tutorial-images/final-project.png)

Your ICO and NFT dapp should now work without errors 🚀.

To test your project, you'll need two accounts created on metamask. To do this, read this [article](https://digitalpinas.com/create-metamask-account/#:~:text=How%20to%20create%20Additional%20Metamask%20Account%20on%20Browser,click%20%E2%80%9CCreate%E2%80%9D%20to%20have%20an%20additional%20Metamask%20account.) for more details.

Account 1 will be the account that deploys the smart contracts while Account 2 will be the account that mints the NFT and gets rewarded with the ICO.

> Note: The first Account created in metamask is by default Account 1. This is the account that deploys the smart contract. Account 1 will be able to withdraw funds sent by Account 2 as payment for minting the NFT.

## Pushing Code to Github
After testing your dapp and checking that everything behaves correctly, upload your project to a new GitHub repository. Instructions on how to do this can be found [here](https://www.git-tower.com/learn/git/faq/push-to-github/).

If needed, you can create a readme file for your project that explains your DApp and includes a link to your DApp.

## Deploying to Vercel
We will now deploy your DApp so thatusers can interact your website and you can share it with everyone.

To deploy our dapp we will be using vercel. Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration. To get started:
1.  Go to [Vercel](https://vercel.com).
2.  Click on the sign up button.
3.  Fill and select the appropriate options displayed.
4.  Continue the sign up with your GitHub.

![](https://github.com/gaubrey1/celo-ico/blob/main/tutorial-images/vercel.png)

5.  Click on Add New button.
6.  Select Project from the dropdown menu,
If this is your first time using vercel, you'll need to install vercel in your Github account. To do this:
1. Click the **Add Github Account** dropdown.
2. Follow the prompt shown. This will automatically show all your repository in your Github account. 
3. Select your Celo-ICO repo from the options given and import it.
When configuring your new project, Vercel will allow you to customize your Root Directory. For this project, our root directory is `my-app`. To customize your root directoy.
1. Click on the edit button to change the root directory to `my-app`.
2. Select the framework as `Create React App`
2. Click Deploy. This will take a while to complete

Now you can see your deployed website by going to your dashboard, selecting your project, and copying the URL beneath domains!

## Conclusion
That’s it! Congratulations! You are done with the tutorial, in this tutorial have built a dapp using react, hardhat, solidity and the Celo blockchain, pushed your code to Github, and deployed it to Vercel! 🎉
