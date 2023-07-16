//SPDX-License-Identifier:MIT

pragma solidity ^0.8.4;



import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract AIFTMarketplace  is ReentrancyGuard { 

    // using the Counters
    using Counters for Counters.Counter;

// defining some varibales
    Counters.Counter private tokenId;
    Counters.Counter private itemsSold;
    address payable owner;

    // some mapping
    mapping(uint256 => NFTTOKEN) public idToNFt;
    mapping(address => uint256[]) public addressToid;


    // NFTTOKEN struct
    struct NFTTOKEN{
        uint256 id;
        address payable owner;
        address nftcontract;
        uint256 price;
        bool listed;
    }

    constructor()  {
        owner = payable(msg.sender);
    }


    // NFT Creation Event
    event NFTTOKENCREATED(
     uint256 id,
        address payable owner,
        address nftcontract,
        uint256 price,
        bool listed
        );



    function createNFTItem(address nftcontractaddress , uint256 _tokenId , uint256 _price) public nonReentrant{

        tokenId.increment();

        uint256 itemId = tokenId.current();

        idToNFt[itemId] = NFTTOKEN(
            itemId,
            payable(msg.sender),
            nftcontractaddress,
            _price,
            true
        );

        addressToid[msg.sender].push(itemId);

        IERC721(nftcontractaddress).transferFrom(msg.sender , address(this),itemId);

        emit NFTTOKENCREATED(itemId , 
            payable(msg.sender),
            nftcontractaddress,
            _price,
            true);

    }


    function updateNFTprice( uint256 _tokenId , uint256 _price) nonReentrant public{

        require(idToNFt[_tokenId].owner == payable(msg.sender));
        require(idToNFt[_tokenId].listed == true);

         idToNFt[_tokenId].price = _price;

    }


    
    function updateNFTListVar( uint256 _tokenId , bool _list) nonReentrant public{

        require(idToNFt[_tokenId].owner == payable(msg.sender));
         idToNFt[_tokenId].listed =  _list;

    }


    function sellNFT(address nftcontractaddress , uint256 _id) public payable nonReentrant  returns(bool){

    require(idToNFt[_id].owner == payable(address(this)));
    require(idToNFt[_id].listed == true);
    require(msg.value == idToNFt[_id].price);

    // we are cutting 1% of transaction fee
    uint256 finalPrice = idToNFt[_id].price - ((2 * idToNFt[_id].price) / 100);

    idToNFt[_id].owner.transfer(finalPrice);
    IERC721(nftcontractaddress).transferFrom(address(this),msg.sender,_id);

    idToNFt[_id].owner = payable(msg.sender);
    idToNFt[_id].listed = false;

    return true;
    }


    // fetching all the nfts of a user
    function fetchMYNFTs(address  _address) public view returns(NFTTOKEN[] memory){
        uint256 nftcount = tokenId.current();
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
        uint256 nftcount = tokenId.current();
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
        uint256 nftcount = tokenId.current();
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
        uint256 nftcount = tokenId.current();
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