
const hre = require("hardhat");

async function main() {

  const AIFTMarketplace = await hre.ethers.deployContract("AIFT");

  await AIFTMarketplace.waitForDeployment();

  console.log(
   `AIFTMArketplace  deployed to ${AIFTMarketplace.target}`
  );

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
