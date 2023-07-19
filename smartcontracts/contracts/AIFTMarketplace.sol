//SPDX-License-Identifier:MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract  AIFT is  ERC721URIStorage , ReentrancyGuard {
    
     // using the Counters
    using Counters for Counters.Counter;
        
    // defining some varibales
    Counters.Counter private _tokenIds;
    address payable owner;

      // some mapping
    mapping(uint256 => NFTTOKEN) public idToNFt;
    mapping(address => uint256[]) public addressToid;


    // NFTTOKEN struct
    struct NFTTOKEN{
        uint256 id;
        address payable owner;
        uint256 price;
        bool listed;
    }

    constructor( ) ERC721("AI Generated NFT ",  "AIFT") {
        owner = payable(msg.sender);
    }

     function createNFT(string  memory tokenURI) nonReentrant  public   payable   returns(uint256)   {

        _tokenIds.increment();

        uint256 new_tokenId = _tokenIds.current();

        // minting the nft to user
        _safeMint(msg.sender, new_tokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(new_tokenId, tokenURI);
        
        idToNFt[new_tokenId] = NFTTOKEN(
            new_tokenId,
            payable(msg.sender),
            0,
            false
        );
        addressToid[msg.sender].push(new_tokenId);
        return new_tokenId;

    }


    function listNFTForSale(uint256 id , uint256 _price) nonReentrant  public  {
        require(idToNFt[id].owner == payable(msg.sender));
        require(idToNFt[id].listed == false);

        idToNFt[id].price = _price;
        idToNFt[id].listed = true;

        _transfer(msg.sender, address(this), id);

    }


    function updateNFTprice( uint256 _tokenId , uint256 _price) nonReentrant public{

        require(idToNFt[_tokenId].owner == payable(msg.sender));
        require(idToNFt[_tokenId].listed == true);

        idToNFt[_tokenId].price = _price;

    }


    function unListNFt( uint256 _tokenId ) nonReentrant public{
        require(idToNFt[_tokenId].owner == payable(msg.sender));
        require(idToNFt[_tokenId].listed == true);
         idToNFt[_tokenId].listed =  false;

    }

    function ListNFtAgain( uint256 _tokenId ) nonReentrant public{
        require(idToNFt[_tokenId].owner == payable(msg.sender));
        require(idToNFt[_tokenId].listed == false);
         idToNFt[_tokenId].listed =  true;

    }


      function sellNFT( uint256 _id) public payable nonReentrant  returns(bool){
    
        require(idToNFt[_id].listed == true);
        require(msg.value == idToNFt[_id].price);

        require(ownerOf(_id) == address(this), "Not listed for sale ");
        

    // we are cutting 1% of transaction fee
    uint256 finalPrice = idToNFt[_id].price - ((2 * idToNFt[_id].price) / 100);

    idToNFt[_id].owner.transfer(finalPrice);
   _transfer(address(this), msg.sender, _id);

    idToNFt[_id].owner = payable(msg.sender);
    idToNFt[_id].listed = false;

    return true;
    }



    // fetching data functions

     // fetching all the nfts of a user
    function fetchMYNFTs(address  _address) public view returns(NFTTOKEN[] memory){
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;

        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);

        for(uint256  i = 0 ; i < nftcount ; i++){
            if(idToNFt[i+1].owner == payable(_address)){
                uint256 currrentId = i + 1 ;

                NFTTOKEN storage currentNFT = idToNFt[currrentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1 ;
            }
        }
        return nfts;
    }


// fetching only  the listed  nfts of a user
      function fetchMYListedNFTs(address  _address) public view returns(NFTTOKEN[] memory){
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;

        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);

        for(uint256  i = 0 ; i < nftcount ; i++){
            if(idToNFt[i+1].owner == payable(_address) && idToNFt[i+1].listed == true  ){
                uint256 currrentId = i + 1 ;

                NFTTOKEN storage currentNFT = idToNFt[currrentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1 ;
            }
        }
        return nfts;
    }


        // fetching all nfts data
    function fetchALLNFTs() public view returns(NFTTOKEN[] memory){
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;

        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);

        for(uint256  i = 0 ; i < nftcount ; i++){
                uint256 currrentId = i + 1 ;
                NFTTOKEN storage currentNFT = idToNFt[currrentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1 ;
            
        }
        return nfts;
    }

    // fetching only  the listed  nfts 
      function fetchListedNFTs() public view returns(NFTTOKEN[] memory){
        uint256 nftcount = _tokenIds.current();
        uint256 currentIndex = 0;

        NFTTOKEN[] memory nfts = new NFTTOKEN[](nftcount);

        for(uint256  i = 0 ; i < nftcount ; i++){
            if(idToNFt[i+1].listed == true  ){
                uint256 currrentId = i + 1 ;

                NFTTOKEN storage currentNFT = idToNFt[currrentId];
                nfts[currentIndex] = currentNFT;
                currentIndex += 1 ;
            }
        }
        return nfts;
    }


           /// interface Contract 
    function getNFTInfobyId(uint256 id_) public  view returns(NFTTOKEN memory){
        return idToNFt[id_];
    }




    receive() external payable {}

    fallback() external payable {}


    function withdraw() payable public {
        require(payable(msg.sender) == owner,'You are not owner of contract');
        (bool success,) = owner.call{value:msg.value}("");

        require(success,"Trabsfer Failed");
    }



}