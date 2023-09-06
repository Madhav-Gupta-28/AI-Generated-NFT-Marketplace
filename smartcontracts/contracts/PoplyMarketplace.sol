// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";  // Import Ownable for access control
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AIFT - AI Generated NFT Contract
 * @dev A contract for creating, listing, and selling AI-generated NFTs.
 */
contract AIFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Counter for generating unique token IDs
    Counters.Counter private _tokenIds;

    // Address of the contract owner
    address payable owner;

    // Mapping from token ID to NFTTOKEN struct
    mapping(uint256 => NFTTOKEN) public idToNFt;

    // Mapping from address to an array of token IDs owned by the address
    mapping(address => uint256[]) public addressToid;

    // NFTTOKEN struct representing an NFT
    struct NFTTOKEN {
        uint256 id;
        string tokenURI;
        address payable owner;
        address creator;
        uint256 price;
        bool listed;
    }

    /**
     * @dev Constructor initializes the contract.
     */
    constructor() ERC721("AI Generated NFT", "AIFT") {
        owner = payable(msg.sender);
    }

    /**
     * @dev Creates and mints a new NFT.
     * @param tokenURI The URI for the NFT's metadata.
     * @return new_tokenId The ID of the newly created NFT.
     */
    function createNFT(string memory tokenURI) external nonReentrant payable returns (uint256) {
        _tokenIds.increment();
        uint256 new_tokenId = _tokenIds.current();
        _safeMint(msg.sender, new_tokenId);
        _setTokenURI(new_tokenId, tokenURI);
        idToNFt[new_tokenId] = NFTTOKEN(
            new_tokenId,
            tokenURI,
            payable(msg.sender),
            msg.sender,
            0,
            false
        );
        addressToid[msg.sender].push(new_tokenId);
        return new_tokenId;
    }

    /**
     * @dev Lists an NFT for sale.
     * @param id The ID of the NFT to list.
     * @param _price The sale price of the NFT.
     */
    function listNFTForSale(uint256 id, uint256 _price) external nonReentrant {
        require(idToNFt[id].owner == payable(msg.sender), "Owner is not the caller");
        require(!idToNFt[id].listed, "NFT is already listed");
        idToNFt[id].price = _price;
        _transfer(msg.sender, address(this), id);
        idToNFt[id].listed = true;
    }

    /**
     * @dev Updates the sale price of a listed NFT.
     * @param _tokenId The ID of the NFT to update.
     * @param _price The new sale price.
     */
    function updateNFTprice(uint256 _tokenId, uint256 _price) external nonReentrant {
        require(idToNFt[_tokenId].owner == payable(msg.sender), "Owner is not the caller");
        require(idToNFt[_tokenId].listed, "NFT is not listed");
        idToNFt[_tokenId].price = _price;
    }

    /**
     * @dev Unlists an NFT from the marketplace.
     * @param _tokenId The ID of the NFT to unlist.
     */
    function unListNFt(uint256 _tokenId) external nonReentrant {
        require(idToNFt[_tokenId].owner == payable(msg.sender), "Caller is not the owner");
        require(idToNFt[_tokenId].listed, "NFT is not listed");
        _transfer(address(this), msg.sender, _tokenId);
        idToNFt[_tokenId].listed = false;
        idToNFt[_tokenId].price = 0;
    }

    /**
     * @dev Allows users to purchase NFTs listed for sale.
     * @param _id The ID of the NFT to purchase.
     * @return true if the purchase is successful.
     */
    function sellNFT(uint256 _id) external payable nonReentrant returns (bool) {
        require(idToNFt[_id].listed, "NFT is not listed");
        require(msg.value >= idToNFt[_id].price, "Msg.value is less than the price");
        require(ownerOf(_id) == address(this), "NFT Owner is not contract address");

        // Deduct a 2% transaction fee
        uint256 finalPrice = idToNFt[_id].price - ((2 * idToNFt[_id].price) / 100);

        idToNFt[_id].owner.transfer(finalPrice);
        _transfer(address(this), msg.sender, _id);
        idToNFt[_id].owner = payable(msg.sender);
        idToNFt[_id].listed = false;
        idToNFt[_id].price = 0;

        return true;
    }

    /**
     * @dev Fetches all the NFTs owned by a user.
     * @param _address The address of the user.
     * @return nfts An array of NFTTOKENs owned by the user.
     */
    function fetchMYNFTs(address _address) external view returns (NFTTOKEN[] memory) {
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;
        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);
        for (uint256 i = 0; i < nftcount; i++) {
            if (idToNFt[i + 1].owner == payable(_address)) {
                uint256 currentId = i + 1;
                NFTTOKEN storage currentNFT = idToNFt[currentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1;
            }
        }
        return nfts;
    }

      /**
     * @dev Fetches only the listed NFTs owned by a user.
     * @param _address The address of the user.
     * @return nfts An array of listed NFTTOKENs owned by the user.
     */
    function fetchMYListedNFTs(address _address) external view returns (NFTTOKEN[] memory) {
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;
        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);
        for (uint256 i = 0; i < nftcount; i++) {
            if (idToNFt[i + 1].owner == payable(_address) && idToNFt[i + 1].listed == true) {
                uint256 currentId = i + 1;
                NFTTOKEN storage currentNFT = idToNFt[currentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1;
            }
        }
        return nfts;
    }

    /**
     * @dev Fetches all NFTs regardless of ownership.
     * @return nfts An array of all NFTTOKENs in the contract.
     */
    function fetchALLNFTs() external view returns (NFTTOKEN[] memory) {
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;
        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);
        for (uint256 i = 0; i < nftcount; i++) {
            uint256 currentId = i + 1;
            NFTTOKEN storage currentNFT = idToNFt[currentId];
            nfts[currentIndex] = currentNFT;
            currentIndex += 1;
        }
        return nfts;
    }

    /**
     * @dev Fetches only the listed NFTs in the contract.
     * @return nfts An array of listed NFTTOKENs in the contract.
     */
    function fetchListedNFTs() external view returns (NFTTOKEN[] memory) {
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;
        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);
        for (uint256 i = 0; i < nftcount; i++) {
            if (idToNFt[i + 1].listed == true) {
                uint256 currentId = i + 1;
                NFTTOKEN storage currentNFT = idToNFt[currentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1;
            }
        }
        return nfts;
    }

    /**
     * @dev Fetches NFTs created by a specific address.
     * @param _address The address of the creator.
     * @return nfts An array of NFTTOKENs created by the address.
     */
    function fetchCreatorNFTs(address _address) external view returns (NFTTOKEN[] memory) {
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;
        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);
        for (uint256 i = 0; i < nftcount; i++) {
            if (idToNFt[i + 1].creator == _address) {
                uint256 currentId = i + 1;
                NFTTOKEN storage currentNFT = idToNFt[currentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1;
            }
        }
        return nfts;
    }

    /**
     * @dev Retrieves NFT information by ID.
     * @param id_ The ID of the NFT.
     * @return NFTTOKEN The details of the NFT.
     */
    function getNFTInfobyId(uint256 id_) external view returns (NFTTOKEN memory) {
        return idToNFt[id_];
    }

    /**
     * @dev Fallback function to receive Ether.
     */
    receive() external payable {}

    /**
     * @dev Withdraws Ether from the contract by the owner.
     * @param amount The amount of Ether to withdraw.
     */
    function withdraw(uint256 amount) external payable onlyOwner {
        owner.transfer(amount);
    }
}
