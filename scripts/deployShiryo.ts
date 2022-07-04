import { SignerWithAddress } from "../node_modules/@nomiclabs/hardhat-ethers/signers";
import { ethers, network } from "hardhat";
import {
  expandTo18Decimals,
  expandTo6Decimals,
} from "../test/utilities/utilities";
import { ShiryoInu, ShiryoInu__factory } from "../typechain";

function sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

async function main() {
    const shiryo = await ethers.getContractFactory("ShiryoInu");
    const ShiryoToken = await shiryo.deploy();
    await sleep(2000);
    console.log("Shiryo Address- "+ShiryoToken.address);
}  

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error);
    process.exit(1);
}) ;
