require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",


  networks:{
    mumbai: {
      url: URL,
      accounts: [PRIVATE_KEY],
      gas: "auto",
      gasPrice: 80000000000,
      allowUnlimitedContractSize: true
    },
  
  }
};
