"use client"
import React , {useState , useEffect , useContext} from 'react'
import { HStack , Heading , Flex  , Spacer , Box , Menu , MenuButton ,MenuItem , MenuList} from '@chakra-ui/react';
import Link from 'next/link';
import Style from "./Header.module.css"
import { ConnectWallet  } from '@thirdweb-dev/react';
import logo from "../../logo.png"
import Image from 'next/image'

const Header = () => {

  return (
    <>
    <Flex minWidth='max-content' alignItems='around' p={4} gap='2'  style={{background: "linear-gradient(135deg, #426F4E 0%, #05101A 100%)"  , color:"rgba(255, 255, 255, 0.90)"}} >
    <Box p='2' style={{marginLeft:'1rem'}}>
    <Image  priority src={logo} style={{height:'2rem' , width:'2rem' , display:'inline'   , marginBottom:'1rem'}} />
      <Heading size='md' style={{ fontWeight:'900',fontSize:"2rem" , padding : "1rem 2rem 1rem 0.6rem" ,display:'inline-block' , color:"#50A838"}} >Poply</Heading>

    </Box>
   <HStack>
   <Menu>
   <MenuButton style={{marginLeft:'2rem' , fontSize:'1.6rem' , color:"#50A838" , padding:'0.5rem 1rem'}} className={Style.a} fontWeight="500" fontSize="lg" _hover={{ textDecoration: 'underline' , cursor:'pointer'}}>
          Explore
          </MenuButton >
          <MenuList style={{backgroundColor:"#426F4E"}}>
            <MenuItem style={{fontSize:'1.2rem' , color:"rgba(255, 255, 255, 0.90)" , backgroundColor:"#426F4E"}}><Link  href={'/mintNFT'} >Mint AIFT</Link></MenuItem>
            <MenuItem style={{fontSize:'1.2rem' , color:"rgba(255, 255, 255, 0.90)" , backgroundColor:"#426F4E"}}><Link  href={'/creatordashboard'}></Link>Creator Dashboard</MenuItem>
            <MenuItem style={{fontSize:'1.2rem' , color:"rgba(255, 255, 255, 0.90)" , backgroundColor:"#426F4E"}}><Link  href={"/"}>Marketplace</Link></MenuItem>
            <MenuItem style={{fontSize:'1.2rem' , color:"rgba(255, 255, 255, 0.90)" , backgroundColor:"#426F4E"}}><Link  href={"/profile"}>Profile</Link></MenuItem>
          </MenuList>
        </Menu>
   </HStack>
   <Spacer/>
   <ConnectWallet theme="dark" btnTitle="Login" className={Style.button} />

  </Flex>

  <div className={Style.thinwhiteborder} ></div>

    </>
  )
}

export default Header