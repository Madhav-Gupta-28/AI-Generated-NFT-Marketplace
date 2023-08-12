"use client"
import React from 'react'
import { ChakraProvider, Mark } from '@chakra-ui/react';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import Header from '@/Component/Header/Header';
import Marketplace from '@/Component/Marketplace/Marketplace';

import {aiftAddress  , marketplaceAddress , aiftabi , marketplaceabi} from "../constant"


const Home = () => {
  return (
    <>
  <ChakraProvider>
      <ThirdwebProvider>
    <Header/>
      <Marketplace/>
      </ThirdwebProvider>
    </ChakraProvider>
    
    </>
 
   
  )
}

export default Home