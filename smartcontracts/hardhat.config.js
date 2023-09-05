require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",


  networks:{
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/Suo6sQPZnTMMhB3ttnMyny6ED2wFp16n",
      accounts: ["edd0a374fb70992c742af5ff48618adf91eb6f97656be5ed122a6fc0ff3aed3e"],
      gas: "auto",
      gasPrice: 8000000000,
      allowUnlimitedContractSize: true
    },

    alfajores: {
      // can be replaced with the RPC url of your choice.
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [
          "78d217cddc344385c3f5555253b95fcf119c1e2c5216a12e8a8aeec2dc03c52f"
      ],
      gas: "auto",
      gasPrice: 8000000000,
      allowUnlimitedContractSize: true
  },
  
  }
};
