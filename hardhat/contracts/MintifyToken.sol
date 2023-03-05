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