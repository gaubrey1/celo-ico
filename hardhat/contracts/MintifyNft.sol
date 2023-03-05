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