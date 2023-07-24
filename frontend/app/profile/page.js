"use client";

import React , {useState , useRef, useEffect} from 'react'
import Header from '@/Component/Header/Header'
import {ThirdwebProvider} from "@thirdweb-dev/react"
import { Button , Box, Center , Heading, VStack , HStack ,Spinner, ChakraProvider } from '@chakra-ui/react';
import axios from 'axios'
import Style from "./profile.module.css"
import { ethers } from 'ethers'
import Link from 'next/link';
import {aiftAddress  , aiftabi} from "../../constant"
import {ExternalLinkIcon} from "@chakra-ui/icons"
import NFTTile from '@/Component/NFTTile/NFTTile';


const Profile = () => {
    const [nftArray , setnftArray] = useState([])
    const [loading , setloading] = useState(false)


    const fetchMyNFTs = async() => {

        try{

            setloading(true)
            const accounts = await window.ethereum.request({
              method: 'eth_accounts'
            });
        
          const account = accounts[0]
        
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const aift = new ethers.Contract(aiftAddress, aiftabi, signer)
        
            const tx = await aift.fetchMYNFTs(account)
            const proposalsArray = Object.values(tx); 
            console.log(tx)
            setnftArray(proposalsArray)
            console.log('Reading tx--> ')
            console.log(tx)
            console.log( "NFT ARRAY -> " , nftArray)
            setloading(false)
        }catch(error){
            console.log('FetchMyNFTs Function Error -> ' , error)
        }

      }
    
      useEffect(() => {
        fetchMyNFTs()
      },[])
    


  return (
    <ThirdwebProvider>
        <ChakraProvider>
            <Header/>
            <div className='h-full' style={{minHeight:'100vh' ,backgroundColor:"#000" , color:"#ff8700"}} >
        <Center justifyContent={'center'}>
        <VStack as='header' spacing='6' mt='8' wrap={'wrap'} justifyContent={'space-evenly'} p={'2'}>
            <Heading
              as='h1'
              fontWeight='700'
              fontSize='2rem'
              color={"#ff8700"}
              padding={"0.4rem 0.8rem"}
            >
             See Your AIFT
            </Heading>
       
   
          </VStack>
        </Center>
        <HStack wrap={'wrap'} justifyContent={'space-evenly'}>
        {loading ? 
                <Center h={'30vh'} justifyContent={'center'} >
                    <Spinner alignSelf={'center'} thickness='5px'speed='0.5s'emptyColor='gray.200'color='blue.500'size='xl' />
                </Center>
                 :
              <HStack wrap={'wrap'} justifyContent={'space-evenly'}>
                {nftArray.length !== 0 ? 
                <div className="grid sm:grid-cols-2 w-fit md:grid-cols-3 lg:grid-cols-4 mx-auto pb-10 gap-6">
                {nftArray.map((items) => {
                  return (
                    <>
                      {items.tokenURI && (
                        <div className="col-span-1 w-72 rounded-3xl border-2 border-sky-800  pt-2.5 shadow-md hover:shadow-lg hover:shadow-black transition ease-in-out delay-150 shadow-black">
                          <NFTTile tokenURI={items.tokenURI} proposalid={items.id.toString() } listed={items.listed} price={items.price.toString()} />
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
                <div className='message text-white'>No AIFT... Pretty Strange Create One <Link href='/mintNFT'><ExternalLinkIcon fontSize={"2rem"} /></Link> </div>
                </Center>
               
            }
              </HStack>
}

        </HStack>

    </div>
        </ChakraProvider>
    </ThirdwebProvider>
  )
}


export default Profile;




