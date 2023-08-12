"use client";


import React , {useState , useRef, useEffect} from 'react'
import Header from '@/Component/Header/Header'
import {ThirdwebProvider} from "@thirdweb-dev/react"
import { Button , Input ,Alert , Box, Center ,  Text,  AlertIcon , Heading, VStack , HStack ,Spinner, ChakraProvider } from '@chakra-ui/react';
import { ethers } from 'ethers'
import Link from 'next/link';
import {aiftAddress  , aiftabi} from "../../../constant.js"
import {ExternalLinkIcon} from "@chakra-ui/icons"


const SingleNFT = ({ params }) => {
    const [nftdata, setnftdata] = useState('');
    const [tokenuri, settokenuri] = useState('');
    const [owner, setowner] = useState('');
    const [name, setname] = useState('');
    const [description, setdescription] = useState('');
    const [image, setimage] = useState('');
    const [loading, setloading] = useState(false);
    const [showMetamaskAlert, setShowMetamaskAlert] = useState(false);
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [isListed, setisListed] = useState(false);
    const [price, setprice] = useState(0);
    const [isClientMounted, setIsClientMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [priceToList, setpriceTolist] = useState(0);
    const [relist , setrelist] = useState(false)
  
    // function for getting the info for each NFT with tokenid
    const getNftInfo = async () => {
      // alert(tokenuri)
      setloading(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const aift = new ethers.Contract(aiftAddress, aiftabi, signer)
  
      const data = await aift.getNFTInfobyId(params.id)
      setnftdata(data)
      settokenuri(data.tokenURI);
      setowner(data.owner);
      setisListed(data.listed)
      const priceinEther  = ethers.utils.formatEther(data.price.toString())
      setprice(priceinEther)
      
      setloading(false)
    }
    const fetchMetadata = async (tokenURI) => {
        try {
          setloading(true)
          const response = await fetch(`https://ipfs.io/ipfs/${tokenURI}/metadata.json`);
          const metadata = await response.json();
          const metadataName = metadata.name;
          setname(metadataName)
          setdescription(metadata.description)
          setimage(metadata.image)
          setloading(false)
          let tokenImagex = metadata.image;
          setimage(tokenImagex);
    
        } catch (error) {
          console.error('Error fetching metadata:', error);
        }
      };
    
  
    const handleListNFT = async () => {
      try { 
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const aift = new ethers.Contract(aiftAddress, aiftabi, signer)
        let finalPrice = ethers.utils.parseUnits(priceToList.toString(), 'ether')
        const tx = await aift.listNFTForSale(params.id , finalPrice)
        console.log(tx)

        const txhash = tx.hash 

        signer.provider.on(txhash, (receipt) => {
            console.log('Transaction confirmed:', receipt);
            setStatus('      AIFT Listed Succesfully')
            setType('success')
            setShowMetamaskAlert(true)
          });
      } catch (error) {
        console.log(error)
        setStatus('user rejected transaction')
        setType('error')
        setShowMetamaskAlert(true)
  
        setIsModalOpen(false);
      } 
    };
  
    const onReListButtonClick = async() =>{
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const aift = new ethers.Contract(aiftAddress, aiftabi, signer)
        let finalPrice = ethers.utils.parseUnits(priceToList.toString(), 'ether')
        const tx = await aift.updateNFTprice(params.id , finalPrice)
        console.log(tx)

        const txhash = tx.hash 

        signer.provider.on(txhash, (receipt) => {
            console.log('Transaction confirmed:', receipt);
            setStatus('      AIFT Relisted Succesfully')
            setType('success')
            setShowMetamaskAlert(true)
          });
  
      } catch (error) {
        console.log(error)
        setStatus('          Transaction Rejected... Please Try Again')
        setType('error')
        setShowMetamaskAlert(true)
  
        setIsModalOpen(false);
      } 

    }


    const unlistButtonHandler = async() =>{

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const aift = new ethers.Contract(aiftAddress, aiftabi, signer)
        const tx = await aift.unListNFt(params.id)
        console.log(tx)

        const txhash = tx.hash 

        signer.provider.on(txhash, (receipt) => {
            console.log('Transaction confirmed:', receipt);
            setStatus('             AIFT Unisted Succesfully')
            setType('success')
            setShowMetamaskAlert(true)
          });
      } catch (error) {
        console.log(error)
        setStatus(' Transaction Rejected... Please Try Again')
        setType('error')
        setShowMetamaskAlert(true)
      } 


    }

    useEffect(() => {
      setIsClientMounted(true);
      getNftInfo();
    }, [params.id]);
  
    useEffect(() => {   
      if (tokenuri) {
        fetchMetadata(tokenuri);
      }
    }, [tokenuri]);
  
    return (
      <ThirdwebProvider>
        <ChakraProvider>
          <Header />
  
          <div className='w-full' style={{  }} suppressHydrationWarning>
            {showMetamaskAlert && <Alert  variant={'solid'} status={type} className='w-10/12'><AlertIcon />{status}</Alert>}
            {loading ? (
              <Center h={'30vh'}>
                <Spinner thickness='5px' speed='0.5s' emptyColor='#454545' color='#9A9A9A' size='xl' />
              </Center>
            ) : (
              isClientMounted && (
                <div style={{    background: "linear-gradient(135deg, #426F4E 0%, #05101A 100%)"      }} className='px-28 py-20'>
                  <HStack spacing={6} style={{border: '3px solid #9A9A9A' }} className=' rounded-2xl p-6'>
                    <div style={{}} className='w-6/12 h-full'>
                      <img
                        className='border-cyan-500 border-2 w-full mx-auto rounded-xl'
                        src={`${image.replace('ipfs://', 'https://nftstorage.link/ipfs/')}`}
                        alt={name}
                        style={{ maxWidth: '70%', border: '3px solid #9A9A9A ' }}
                      />
                    </div>
                    <VStack spacing={6} align='stretch' marginLeft={'5rem'}>
                      <div className='details-div'>
                        <Heading as="h3" m={'1'} size="lg" color={'#9A9A9A'}>
                          #{params.id}{' '}
                          <Link target='_blank' style={{ marginLeft: '3px' }} href={`https://ipfs.io/ipfs/${tokenuri}/metadata.json`}>
                            <ExternalLinkIcon fontWeight={'1000'} fontSize={'2rem'} color={"#CCEABB"} />
                          </Link>
                        </Heading>
                        <Heading as="h6" m={'1'} size="md" color={'rgb(209 213 219)'}>
                          <Text style={{ marginTop: '2rem 0 2rem 0 ', padding: "1rem", display: 'inline', fontWeight: '1000', color: "rgba(255, 255, 255, 0.90)" }}> <span style={{color:"#9A9A9A"}}>Name:&nbsp;  </span>    {name} </Text>
                        </Heading>
                        {isClientMounted && (
                          <p className='text-slate-300' fontWeight={'700'} m={'1'} fontSize={'xl'}>

                            <Text style={{ display: 'inline', color: "rgba(255, 255, 255, 0.90)", fontWeight: '1000', padding: "1rem", marginTop: '2rem 0 2rem 0 ' }}> <span style={{color:"#9A9A9A"}}>Description:&nbsp;  </span> {description}</Text>
                          </p>
                        )}
                        <p className='text-slate-300' fontSize="xl" style={{ color: "rgba(255, 255, 255, 0.90)", padding: "1rem", marginTop: '2rem 0 2rem 0 ' }} fontWeight={'400'} m={'1'}>
                        <span style={{color:"#9A9A9A"}}>Owner:&nbsp;  </span>   {owner}
                        </p>
                      </div>
                      <HStack>
                        {isListed ? (
                          <Text style={{ color: "rgba(255, 255, 255, 0.90)" }} p={'4px'} fontWeight={'600'} fontSize='2xl'>
                            <span color='white' style={{color:'#9A9A9A'}}>  Price : </span>
                            {price} Matic
                          </Text>
                        ) : (
                          <Button onClick={() => { setIsModalOpen(true) , setrelist(false)}  } size='lg' colorScheme='orange' borderRadius={'4px'} variant={"solid"} fontWeight={'700'}>
                            List
                          </Button>
                        )}

                        {isListed && price > 0 ? (
                           <Button onClick={() =>{ setIsModalOpen(true) , setrelist(true)}  } size='md' style={{backgroundColor:"#50A838" , color:"#fff"}} borderRadius={'4px'} variant={"solid"} fontWeight={'700'}>
                           ReList
                         </Button>
                        ):
                         <div></div>
                        }

                          {isListed && price > 0 ? (
                           <Button onClick={ unlistButtonHandler} size='md' colorScheme='red' borderRadius={'4px'} variant={"solid"} fontWeight={'700'}>
                           UnList
                         </Button>
                        ):
                         <div></div>
                        }
                      </HStack>
                    </VStack>
                  </HStack>
                </div>
              )
            )}
          </div>
  
          <MyModal isReList={relist} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onListButtonClick={handleListNFT} setpriceTolist={setpriceTolist} onReListButtonClick={onReListButtonClick} />
        </ChakraProvider>
      </ThirdwebProvider>
    );
  };
  
  export default SingleNFT;
  
  const MyModal = ({ isReList, isOpen, onClose, onListButtonClick, setpriceTolist , onReListButtonClick }) => {
    const handleModalClick = (e) => {
      e.stopPropagation();
    };
  
    return (
      <>
        {isOpen && (
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            background="rgba(0, 0, 0, 0.8)"
            display="flex"
            alignItems="center"
            flexDirection={"column"}
            style={{ flexDirection: "column" }}
            justifyContent="center"
            zIndex="1000"
            onClick={onClose}
          >
            <VStack background="white"
              padding="3rem"
              borderRadius="4px"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              onClick={handleModalClick}>
              <Text style={{ fontSize: '1.2rem', fontWeight: '700' , color:"#9A9A9A" }}>Enter the Price You want to List AIFT at:</Text>
              <Input type='number' required placeholder="Enter price..." onChange={(event) => setpriceTolist(event.target.value)} />
              <Button onClick={ isReList ?  onReListButtonClick  : onListButtonClick}  marginLeft="10px" style={{ margin: "1.2rem 0 10px 0 " , backgroundColor:"#50A838" , color:"#fff" }} size={'lg'}>
                List NFT
              </Button>
            </VStack>
          </Box>
        )}
      </>
    );
  };
  