"use client"
import React , {useState , useRef, useEffect} from 'react'
import Header from '@/Component/Header/Header'
import {ThirdwebProvider} from "@thirdweb-dev/react"
import { Box,HStack , ChakraProvider,Alert ,AlertIcon, FormControl,Spinner , Heading, VStack , Input , Button, StatLabel, Flex  } from '@chakra-ui/react'
require("dotenv").config()
import axios from 'axios'
import Style from "./mintNFT.module.css"
import { ethers } from 'ethers'
import { NFTStorage, File } from 'nft.storage'
import {aiftAddress  , aiftabi} from "../../constant"


const MintNFT = () => {
    const [loadingImage , setloadingImage] = useState(false);
    const [mintingNFT , setmintingnft] = useState(false)
    const [message , setMessage] = useState("")
    const [img , setImage] = useState('');
    const [name, setName] = useState("")
    const [description, setDescription] = useState("house");
    const [tokenURI , settokenURI] = useState("");


    // alert states
    const [showMetamaskAlert, setShowMetamaskAlert] = useState(false);
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');


    // getting  the image from hugging face
    const createAIImage = async() => {
         setTimeout(() => {
          setStatus('              Generating The Image')
          setType('info')
          setShowMetamaskAlert(true)
        },5000)
        
        
      setMessage("Generating Image...")
      setloadingImage(true)

      const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`
  
      // Send the request
      const response = await axios({
        url: URL,
        method: 'POST',
        headers: {
          Authorization: `Bearer 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`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          inputs: description, options: { wait_for_model: true },
        }),
        responseType: 'arraybuffer',
      })

      setMessage("Getting Data From Hugging Face API...")

      const type = response.headers['content-type']
      const data = response.data
  
      const base64data = Buffer.from(data).toString('base64')
      const img = `data:${type};base64,` + base64data // <-- This is so we can render it on the page

      setMessage('Displaying the Image...')

      setImage(img)
      setloadingImage(false)
      return data
    }

    const handleSubmit = async () => {
      try{

        if(description === ""){
            window.alert("Please provide description")
        }

       setmintingnft(true);
       console.log("AI Image Strated ")
     
       const imgData = await createAIImage();
       console.log("AI Image completed ")
     
       const tokenURI = await uploadImage(imgData);
       
       await mintAIFT(tokenURI);
     
       setmintingnft(false);

      }catch(error){
        console.log("error -> " + error)
      }
    }

    // upload metadata to the ipfs via nft.storage
    const uploadImage = async(imageData) => {
      // Create instance to NFT.Storage
      try{

        setTimeout(() => {
          setStatus('         Uploading Image to IPFS')
          setType('info')
          setShowMetamaskAlert(true)
        },5000)
        

        console.log("Upload Image to IPFS Started ")
        const nftstorage = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZhRTg0MTllNTkyOThBYzc4NGU0QTlkQkUxNzRjMzBCZkY1RDllRjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5MTMzMDg0NjY3MSwibmFtZSI6InBvcGx5In0.SnuQ90I10DUChfYNUbapWKEqkx4fL_uBCF9bup775D4 "})

        // Send request to store image
        const { ipnft } = await nftstorage.store({
          image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
          name: name,
          description: description,
        })
        console.log("Upload Image to IPFS finsihed ")
        console.log(ipnft)
        return ipnft
      }catch(error){
        console.log( "Upload Image Erorr -> " ,error)
      }
    }


    // minting the nft from tokenURI
    const mintAIFT = async (tokenURI) => {
      setmintingnft(true);
      try{

        setTimeout(() => {
          setStatus('         Minting the AIFT.....')
          setType('info')
          setShowMetamaskAlert(true)
        },4000) 

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          let contract = new ethers.Contract(aiftAddress, aiftabi, signer);
          const tx = await contract.createNFT(tokenURI);
          await tx.wait();

          console.log(tx)

          setmintingnft(false)

          const transactionHash = tx.hash;
          signer.provider.on(transactionHash, (receipt) => {
            setTimeout(() => {
              setStatus('        AIFT Minted Succesfully')
              setType('success')
              setShowMetamaskAlert(true)
            },4000)
          });
 
      }catch(error){
          console.log(error)

          setStatus('Transaction Rejected.... Please Try Again... ')
        setType('error')
        setShowMetamaskAlert(true)
      }
}

 return (
    <>
    <ThirdwebProvider>
        <ChakraProvider>
        <Header/>

        <VStack style={{ background: "linear-gradient(135deg, #426F4E 0%, #05101A 100%)" , color:"#FFFFFF"}}  >

        {showMetamaskAlert && <Alert status={type} variant={'solid'} className='w-10/12'><AlertIcon />{status}</Alert>}
    <Heading padding={'3rem 0 0 0'}  alignSelf={'center'} textAlign={'center'} size={'lg'}  >
        MINT  AIFT
    </Heading>

    <div className={Style.thinwhiteborder}>
    </div>
    
        <HStack style={{ color:"rgba(255, 255, 255, 0.90)"}} padding={"0 0 2rem 2rem "} align={'center'} alignSelf={'center'}  spacing={"4rem"} minH={'600px'} >
                <VStack spacing={'4'}>
                    <FormControl>
                      <Input
                        type='text'
                        onChange={(event) => setName(event.target.value)}
                        placeholder='Enter AIFT Name...'
                        borderColor="#9A9A9A"
                        size='lg'
                        borderRadius='6px'
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type='text'
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder='Enter Propmt... '
                        borderColor="#9A9A9A"
                        size='lg'
                        padding={'4rem 3rem'}
                        borderRadius='6px'
                        required
                      />
                    </FormControl>

              
                    <Button
                                  padding={"0 8rem"}
                                    bg="#50A838"
                                    color='fff'
                                    size='lg'
                                    _hover={{bg:"#426F4E", color:"#fff"}}
                                    _active={{ bg: '#298e46' }}
                                    onClick={handleSubmit}
                                    
                                  >
                                    Mint AIFT
                                  </Button>
                  

                </VStack>

            

            <Box className={Style.image}>
                {!loadingImage && img ? (
                    <img src={img} alt='AI Generated Image'/>
                ): loadingImage ? (
                    <div className={Style.image__placeholder}>
                   <Spinner size='xl'   thickness='4px' speed='0.65s' emptyColor='gray.200' color='#50A838'  />
              <p style={{paddingLeft:'1rem' , fontSize:"1.4rem" , color:"#50A838"}} >{message} </p>
            </div>
                ) : (
                    <></>
                )}

            </Box>
        </HStack>

        </VStack>

        </ChakraProvider>
    </ThirdwebProvider>
    </>
   
  )
}

export default MintNFT