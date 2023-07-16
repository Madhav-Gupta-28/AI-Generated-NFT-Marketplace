//SPDX-License-Identifier:MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract AIFT is ERC721URIStorage {


     // using the Counters
    using Counters for Counters.Counter;
        
    // defining some varibales
    Counters.Counter private _tokenIds;
    address payable owner;
    address nftcontractAddress;

    // NFTTOKEN struct
    struct NFTTOKEN{
        uint256 id;
        string  tokenURI;
        address payable owner;
        uint256 price;
        bool listed;
    }

    constructor(string memory name ,  string memory symbol , address _nftcontractAddress) ERC721(name,  symbol) {
        nftcontractAddress = _nftcontractAddress;
        owner = payable(msg.sender);
    }

     function createNFT(string  memory tokenURI)  public  payable   returns(uint256)   {

        _tokenIds.increment();

        uint256 new_tokenIds = _tokenIds.current();

        // minting the nft to user
        _safeMint(msg.sender, new_tokenIds);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(new_tokenIds, tokenURI);

        // aprrove nft marketplace contract to transfer nfts
        setApprovalForAll(nftcontractAddress, true);

        return new_tokenIds;

    }



}