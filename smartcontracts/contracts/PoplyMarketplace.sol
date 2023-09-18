// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AIFT is ERC721URIStorage, ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    // NFTTOKEN struct
    struct NFTTOKEN {
        uint256 id;
        string tokenURI;
        address payable owner;
        address creator;
        uint256 price;
        bool listed;
    }

    mapping(uint256 => NFTTOKEN) public idToNFt;
    mapping(address => uint256[]) public addressToid;

    constructor() ERC721("AI Generated NFT", "AIFT") {}

    function createNFT(string memory tokenURI) nonReentrant payable public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // Mint the NFT to the sender
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        idToNFt[newTokenId] = NFTTOKEN(
            newTokenId,
            tokenURI,
            payable(msg.sender),
            msg.sender,
            0,
            false
        );
        addressToid[msg.sender].push(newTokenId);
        return newTokenId;
    }

    function listNFTForSale(uint256 id, uint256 _price) nonReentrant public onlyOwner {
        require(ownerOf(id) == msg.sender, "Not the owner of the NFT");
        require(!idToNFt[id].listed, "NFT already listed");

        idToNFt[id].price = _price;
        idToNFt[id].listed = true;

        // Approve the contract to transfer the NFT
        approve(address(this), id);

        // Transfer the NFT to this contract
        transferFrom(msg.sender, address(this), id);
    }

    function updateNFTprice(uint256 _tokenId, uint256 _price) nonReentrant public {
        require(idToNFt[_tokenId].owner == payable(msg.sender), "Owner is not the caller");
        require(idToNFt[_tokenId].listed == true, "NFT is not listed");

        idToNFt[_tokenId].price = _price;
    }

    function unListNFt(uint256 _tokenId) nonReentrant public {
        require(idToNFt[_tokenId].owner == payable(msg.sender), "Not the owner of the NFT");
        require(idToNFt[_tokenId].listed == true, "NFT is not listed");

        // Transfer the NFT back to the owner
        transferFrom(address(this), msg.sender, _tokenId);

        idToNFt[_tokenId].listed = false;
        idToNFt[_tokenId].price = 0;
    }

    function sellNFT(uint256 _id) public payable nonReentrant returns (bool) {
        require(idToNFt[_id].listed == true, "NFT is not listed");
        require(msg.value >= idToNFt[_id].price, "Msg.value is less than price");

        require(ownerOf(_id) == address(this), "NFT Owner is not contract address ");

        // Transfer the payment to the NFT owner
        uint256 finalPrice = idToNFt[_id].price;
        idToNFt[_id].owner.transfer(finalPrice);

        // Transfer the NFT to the buyer
        transferFrom(address(this), msg.sender, _id);

        idToNFt[_id].owner = payable(msg.sender);
        idToNFt[_id].listed = false;
        idToNFt[_id].price = 0;

        return true;
    }

    // Fetching data functions

    function fetchMYNFTs(address _address) public view returns (NFTTOKEN[] memory) {
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;

        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);

        for (uint256 i = 0; i < nftcount; i++) {
            if (idToNFt[i + 1].owner == payable(_address)) {
                uint256 currrentId = i + 1;

                NFTTOKEN storage currentNFT = idToNFt[currrentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1;
            }
        }
        return nfts;
    }

    function fetchMYListedNFTs(address _address) public view returns (NFTTOKEN[] memory) {
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;

        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);

        for (uint256 i = 0; i < nftcount; i++) {
            if (idToNFt[i + 1].owner == payable(_address) && idToNFt[i + 1].listed == true) {
                uint256 currrentId = i + 1;

                NFTTOKEN storage currentNFT = idToNFt[currrentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1;
            }
        }
        return nfts;
    }

    function fetchALLNFTs() public view returns (NFTTOKEN[] memory) {
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;

        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);

        for (uint256 i = 0; i < nftcount; i++) {
            uint256 currrentId = i + 1;
            NFTTOKEN storage currentNFT = idToNFt[currrentId];
            nfts[currentIndex] = currentNFT;
            currentIndex += 1;
        }
        return nfts;
    }

    function fetchListedNFTs() public view returns (NFTTOKEN[] memory) {
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;

        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);

        for (uint256 i = 0; i < nftcount; i++) {
            if (idToNFt[i + 1].listed == true) {
                uint256 currrentId = i + 1;

                NFTTOKEN storage currentNFT = idToNFt[currrentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1;
            }
        }
        return nfts;
    }

    function fetchCreatorNFTs(address _address) public view returns (NFTTOKEN[] memory) {
        uint256 nftcount = _
