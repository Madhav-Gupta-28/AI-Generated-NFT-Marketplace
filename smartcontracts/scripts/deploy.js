
const hre = require("hardhat");

async function main() {

  const AIFTMarketplace = await hre.ethers.deployContract("AIFTMarketplace");

  await AIFTMarketplace.waitForDeployment();

  console.log(
   `AIFTMArketplace  deployed to ${AIFTMarketplace.target}`
  );

  const aift = await hre.ethers.deployContract("AIFT",["AI Generated NFT", "AIFT" ,  AIFTMarketplace.target]);

  await aift.waitForDeployment();
  console.log(`AIFT DEployed at ${aift.target}`)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
