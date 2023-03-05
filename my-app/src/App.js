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
