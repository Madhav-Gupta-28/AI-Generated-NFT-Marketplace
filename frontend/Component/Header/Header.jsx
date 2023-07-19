"use client"
import React , {useState , useEffect , useContext} from 'react'
import { HStack , Heading , Flex  , Spacer , Box , Menu , MenuButton ,MenuItem , MenuList} from '@chakra-ui/react';
import Link from 'next/link';
import Style from "./Header.module.css"
import { ConnectWallet } from '@thirdweb-dev/react';


const Header = () => {

  return (
    <>

    <Flex minWidth='max-content' alignItems='around' p={4} gap='2' >
    <Box p='2'>
      <Heading size='md' style={{ fontWeight:'700' , padding : "1rem 2rem" , border:'2px solid #ff8700'}} >AIFT Marketplace</Heading>
    </Box>
    {/* <Spacer /> */}
   <HStack>
   <Menu>
   <MenuButton style={{marginLeft:'2rem' , padding:'0.5rem 1rem'}} className={Style.a} fontWeight="500" fontSize="lg" _hover={{ textDecoration: 'underline' , cursor:'pointer'}}>
          Navigation
          </MenuButton >
          <MenuList style={{backgroundColor:"#000"}}>
            <MenuItem style={{fontSize:'1.2rem' , color:"#ff8700" , backgroundColor:"#000"}}><Link  href={'/mintNFT'} >Mint AIFT</Link></MenuItem>
            <MenuItem style={{fontSize:'1.2rem' , color:"#ff8700" , backgroundColor:"#000"}}><Link  href={'/creatorDashboard'}></Link>Creator Dashboard</MenuItem>
            <MenuItem style={{fontSize:'1.2rem' , color:"#ff8700" , backgroundColor:"#000"}}><Link  href={"/"}>Marketplace</Link></MenuItem>
            <MenuItem style={{fontSize:'1.2rem' , color:"#ff8700" , backgroundColor:"#000"}}><Link  href={"/portfolio"}>Portfolio</Link></MenuItem>
          </MenuList>
        </Menu>
   </HStack>
   <Spacer/>
   <ConnectWallet/>
  </Flex>


    </>
  )
}

export default Header