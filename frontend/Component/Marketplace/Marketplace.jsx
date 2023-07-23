import React , {useState , useEffect} from 'react'
import { ethers } from 'ethers'
import web3Modal from "web3modal";
import {aiftAddress  ,  aiftabi} from "../../constant.js"
import axios from 'axios';


const Marketplace = () => {

    const [nfts , setnfts] = useState('')
    const [loading  , setloading] = useState(false);


    const fetchNFts = async() =>{

      setloading(true) ;


      const provider = new  ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const aift  = new ethers.Contract(aiftAddress , aiftabi , signer);

      const data = await aift.fetchALLNFTs();

      console.log(data)

      const tokens = await Promise.all(data.map(async i => {
        const tokenURI = await aift.tokenURI(i.id);
        const meta = await axios.get(tokenURI);

      }))



    }


    // useEffect(() =>{
    //   fetchNFts()
    // },[])
    

  return (
    <div style={{backgroundColor:"#000" , color:"#ff8700"}} >Marketplace</div>
  )
}

export default Marketplace