require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",


  networks:{
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/MBv-o9PASQSY3cxjbTK6DsqRfEbVWuMC",
      accounts: ["edd0a374fb70992c742af5ff48618adf91eb6f97656be5ed122a6fc0ff3aed3e"],
      gas: "auto",
      gasPrice: 80000000000,
      allowUnlimitedContractSize: true
    },
  
  }
};
