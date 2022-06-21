import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;
const ROPSTEN_PRIVATE_KEY = process.env.ROPSTEN_PRIVATE_KEY;
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {

  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    
    ropsten: {
      url: "https://ropsten.infura.io/v3/f0a935ee24704d068180510782b60fd0",
      accounts: [`0x${ROPSTEN_PRIVATE_KEY}`]
    },
    rinkeby: {
      url:process.env.RINKEBY_URL || "",
      accounts:process.env.RINKEBY_PRIVATE_KEY!== undefined ? [process.env.RINKEBY_PRIVATE_KEY] : [],
     },
    // networks: {
    //   rinkeby: {
    //     url: process.env.RINKEBY_URL || "",
    //     accounts:
    //       process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    //   },
    // },
    


    hardhat: {
      gas: 10000000,
      gasPrice: 1000000000,
      blockGasLimit: 20000000,
      allowUnlimitedContractSize: true,
      // accounts: accounts,
    },
    local: {
      url: "http://127.0.0.1:8545",
    },
  },
  
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  
   
    // testnet: {
    //   url: `https://testnet.veblocks.net`,
    //   // accounts: [secret],
    // },
    // rinkeby: {
		// 	url: `https://rinkeby.infura.io/v3/3f05772998774c6a86b0803a6aed75c3`,
		// 	accounts: [`0x${MUMBAI_PRIVATE_KEY}`]
		// },
    // mumbai: {
    //   url: ALCHEMY_API_KEY,
    //   accounts: [`0x${MUMBAI_PRIVATE_KEY}`],
    // },
   

  etherscan: {
    apiKey: process.env.ROPSTEN_API,
  },
};

export default config;