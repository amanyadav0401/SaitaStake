import { SignerWithAddress } from "../node_modules/@nomiclabs/hardhat-ethers/signers";
import { ethers, network } from "hardhat";
import {
  expandTo18Decimals,
  expandTo6Decimals,
} from "../test/utilities/utilities";
import {
  SaitaStaking,
  SaitaStaking__factory,
} from "../typechain";

function sleep(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function main() {
  // We get the contract to deploy
  const owner = "0x8a4E0e0C516B879084f047AE7428cA4a246Ad86A";
  
  const staking1 = await ethers.getContractFactory("SaitaStaking");
  const staking = await staking1.deploy();
  await sleep(4000);
  await staking.initialize("0x6410285e47A98D5885169CB1f120BA976724C370");
  console.log("SaitaStaking Deployed", staking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


//   Token1 0x82A902CA9F6690176bcb97a0ae7360A85317D51E
//   SaitaMask 0xaD254d1019D4db873Ca7eD0Ff253602bCe102589