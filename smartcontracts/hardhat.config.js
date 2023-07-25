require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",


  networks:{
    mumbai: {
      url: "https://sepolia.infura.io/v3/d7b8935dabac4bb384fd944373b01f3d",
      accounts: ["edd0a374fb70992c742af5ff48618adf91eb6f97656be5ed122a6fc0ff3aed3e"],
      gas: "auto",
      gasPrice: 8000000000000,
      allowUnlimitedContractSize: true
    },
    etherscan: {
      apiKey: "788MP8EKS55QBDSMTWAMAAE8QG1E3BBZBG", // Your Etherscan API key
    },
  }
};
