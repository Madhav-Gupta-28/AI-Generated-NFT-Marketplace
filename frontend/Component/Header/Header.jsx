"use client"
import React , {useState , useEffect , useContext} from 'react'
import { HStack , Heading , Flex  , Spacer , Box , Menu , MenuButton ,MenuItem , MenuList} from '@chakra-ui/react';
import Link from 'next/link';
import Style from "./Header.module.css"
import { ConnectWallet } from '@thirdweb-dev/react';


const Header = () => {

  return (
    <>

    <Flex minWidth='max-content' alignItems='center' p={4} gap='2' style={{backgroundColor:"#f5f4e4"}}>
    <Box p='2'>
      <Heading size='xl' style={{color:"#00000087" , fontWeight:'800'}} >AIFT</Heading>
    </Box>
    <Spacer />
   <HStack>
   <Menu>
          <MenuButton className={Style.a}  fontWeight="500" fontSize="lg" _hover={{ textDecoration: 'underline' , cursor:'pointer'}}>
          Navigation
          </MenuButton>
          <MenuList>
            <MenuItem style={{fontSize:'1.2rem' , color:"#454545"}}><Link  href={'/mintNFT'} >Mint AIFT</Link></MenuItem>
            <MenuItem style={{fontSize:'1.2rem' , color:"#454545"}}><Link  href={'/creatorDashboard'}></Link>Creator Dashboard</MenuItem>
            <MenuItem style={{fontSize:'1.2rem' , color:"#454545"}}><Link  href={"/"}>Marketplace</Link></MenuItem>
            <MenuItem style={{fontSize:'1.2rem' , color:"#454545"}}><Link  href={"/portfolio"}>Portfolio</Link></MenuItem>
          </MenuList>
        </Menu>
    
    <ConnectWallet/>
   </HStack>
  </Flex>


    </>
  )
}

export default Header