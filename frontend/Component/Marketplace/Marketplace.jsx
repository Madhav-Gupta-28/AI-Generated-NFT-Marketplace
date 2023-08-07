"use client";

import React , {useState , useEffect} from 'react'
import { Button , Box, Center , Heading, VStack , HStack ,Spinner, ChakraProvider } from '@chakra-ui/react';
import Style from "./Marketplace.module.css"
import { ethers } from 'ethers'
import Link from 'next/link';
import {aiftAddress  , aiftabi} from "../../constant.js"
import MarketplaceNFTTile from '../MarketplaceNFTTile/MarketPlaceNFTTile';

const Marketplace = () => {

  const [nftArray , setnftArray] = useState([])
  const [loading , setloading] = useState(false)

    const fetchListedNFTs = async() =>{
      try{
        setloading(true)
    
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const aift = new ethers.Contract(aiftAddress, aiftabi, signer)
    
        const tx = await aift.fetchListedNFTs()
        const proposalsArray = Object.values(tx); 
        console.log(tx)
        setnftArray(proposalsArray)
        console.log('Reading tx--> ')
        console.log(tx)
        console.log( "NFT ARRAY -> " , nftArray)
        setloading(false)
    }catch(error){
        console.log('fetchListedNFTs Function Error -> ' , error)
    }
    }
        
    useEffect(() => {
      fetchListedNFTs()
    },[])
  


  return (
    <div className='h-full' style={{minHeight:'100vh' , background: "linear-gradient(135deg, #426F4E 0%, #05101A 100%)"  , color:"#ff8700"}} >
    <Center justifyContent={'center'}>
    <VStack as='header' spacing='6' mt='8' wrap={'wrap'} justifyContent={'space-evenly'} p={'2'}>
        <Heading
          as='h1'
          fontWeight='700'
          fontSize='2rem'
          color={"rgba(255, 255, 255, 0.90)"}
          padding={"0.4rem 0.8rem"}
        >
         Marketplace
        </Heading>
   

      </VStack>
    </Center>
    <HStack wrap={'wrap'} justifyContent={'space-evenly'} paddingTop={"2rem"} >
    {loading ? 
            <Center h={'30vh'} justifyContent={'center'} >
                <Spinner alignSelf={'center'} thickness='5px'speed='0.5s'emptyColor='gray.200'color='rgba(255, 255, 255, 0.90)'size='xl' />
            </Center>
             :
          <HStack wrap={'wrap'} justifyContent={'space-evenly'}>
            {nftArray.length !== 0 ? 
            <div className="grid sm:grid-cols-2 w-fit md:grid-cols-3 lg:grid-cols-4 mx-auto pb-10 gap-6">
            {nftArray.map((items) => {
              return (
                <>
                  {items.tokenURI && (
                    <div className="col-span-1 w-72 rounded-3xl border-2 pt-2.5 shadow-md hover:shadow-lg hover:shadow-black transition ease-in-out delay-150 shadow-black" style={{border:"2px solid rgba(255, 255, 255, 0.90)"}}>
                      <MarketplaceNFTTile tokenURI={items.tokenURI} proposalid={items.id.toString() } price={items.price.toString()} />
                    </div>
                  )}
                  <div style={{ color: '#fff' }}>
                  </div>
                </>
              );
            })}
          </div>
            :
            <Center  h={'50vh'}>
            <div className='message text-white'>No AIFT... Pretty Strange Create One <Link href='/mintNFT'></Link> </div>
            </Center>
           
        }
          </HStack>
}

    </HStack>

</div>
  )
}

export default Marketplace