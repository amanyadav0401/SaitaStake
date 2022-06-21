const BN = require("ethers").BigNumber;
const { ethers } = require("hardhat");
const {
  time, // time
  constants,
} = require("@openzeppelin/test-helpers");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const duration = {
  seconds(val) {
    return BN.from(val);
  },
  minutes(val) {
    return BN.from(val).mul(this.seconds("60"));
  },
  hours(val) {
    return new BN.from(val).mul(this.minutes("60"));
  },
  days(val) {
    return new BN.from(val).mul(this.hours("24"));
  },
  weeks(val) {
    return new BN.from(val).mul(this.days("7"));
  },
  years(val) {
    return new BN.from(val).mul(this.days("365"));
  },
};
async function main() {
  testnet = {
    router: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", //quickswap MUMBAI
    weth: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // quickswap MUMBAI
    usdc: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",  ///usdt address
    devWallet: "0x09498e02202D034a407bf109F486F336103C4f19",
    deployer: "0xF23B41Ccb68dA234Dd6Df7b6b72B4180bC82EFDC"
    // admin: "0xF0291FCD14ABC46727BA0B7b3304EF2e44bA15a7",
    // tokenSale: "0x708C5B59093E213d91d6F13be2764B9096B9E017",
    // airdrops: "0xE0058D9c60b131BB7520FbF44D6BbE0A7E562C0D",
    // oracle: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526",
    // ionToken: "0x2b045BE5B6a8acB90dd4ACD8bCAF9daF15156ACF"
  }
  const owner = "0xb64968DFb5FdcF7176c9c3f6aE6c7D0b0AAD92aF";   //Ankit address

  const EbscReq = [
    [2000, 6000, 10000, 25000, 50000, 70000],
    [2000, 6000, 10000, 25000, 50000, 70000],
    [2000, 6000, 10000, 25000, 50000, 70000],
    [2000, 6000, 10000, 25000, 50000, 70000, 300000]
  ];

  Upgradeability = await ethers.getContractFactory("OwnedUpgradeabilityProxy");
  Admin = await ethers.getContractFactory("Admin");
  Staking = await ethers.getContractFactory("Staking");
  TokenSale = await ethers.getContractFactory("TokenSale");
  Rewards = await ethers.getContractFactory("Rewards");
  ProjectReward = await ethers.getContractFactory("ProjectReward");
  Ion = await ethers.getContractFactory("ION");
  SuperCharge = await ethers.getContractFactory("SuperCharge");
  Weth = await ethers.getContractFactory("WETH");
  Router = await ethers.getContractFactory("UniswapV2Router02");
  Usdc = await ethers.getContractFactory("USDCWithSixDecimal");

  usdc = await Usdc.attach(testnet.usdc);
  console.log("USDC", usdc.address);


  weth = await Weth.attach(testnet.weth);
  console.log("weth address", weth.address);

  router = await Router.attach(testnet.router);
  console.log("Router Contract",router.address);


  /////////////ADMIN PROXY////////////////////////////
  
  console.log("----------");
  proxy1 = await Upgradeability.deploy();
  await sleep(20000);
  // proxy1 = await Upgradeability.attach("0x7cb5efB2e6D8e8Ee5003FA13e629c2CC0D1b8827");
  console.log("proxy1 contract", proxy1.address);
  // adminContract = await Admin.attach("0x2E384A6615dDaF5322159a856CE588e6656fC139");

  adminContract = await Admin.deploy();
  await sleep(20000);
  // adminContract = await Admin.attach("0xAa68b2BD813BC3e3420f953afb7E8837Ba6014a9");
  console.log("admin contract", adminContract.address);
  adminProxy = await Admin.attach(proxy1.address);
  // await sleep(20000);
  console.log("adminProxy", adminProxy.address);
  await sleep(20000);

  initializeData = Admin.interface.encodeFunctionData('initialize', [owner]);

  await sleep(20000);
  console.log("admin upgrade before")
  await proxy1.upgradeToAndCall(adminContract.address, initializeData);
  console.log("admin upgrade after");

  ionToken = await Ion.deploy(
    "Lithium IONs",
    "IONs",
    BN.from("50000000").mul(BN.from("10").pow("18")),
    router.address,
    owner,
    testnet.devWallet,
    adminProxy.address,
    testnet.deployer,
    usdc.address
  );
  ionToken = await Ion.attach("0xd6d3B4254B4526c3095d8AB00B75f186c56dD72C");
  console.log("ion address", ionToken.address);
  // await sleep(20000);

  //  await ionToken.approve(router.address,BN.from("500000000").mul(BN.from("10").pow("18")));
  //  await sleep(3000);


  // console.log("allowance",String(await ionToken.allowance(owner,router.address)));
  // await sleep(5000);
  //   await router.addLiquidityETH(ionToken.address,BN.from("20000").mul(BN.from("10").pow("18")),10,
  //   1,
  //   owner,
  //   1906091396,
  //   { value: BN.from("1").mul(BN.from("10").pow("18"))}
  // );
  // console.log("ADD Liquidity done");
  // ionToken = await Ion.attach(settings[network].ionToken);
  //=========mainnet==========
  // proxy1 contract 0x069A88B1F52fb2b6FBD5BC3dF5e48dA6aa9D9cB3
  // admin contract 0x99A581aEd2CF7c1452CF46ca98F4dFea78FfF8b4
  // adminProxy 0x069A88B1F52fb2b6FBD5BC3dF5e48dA6aa9D9cB3
  // adminProxy Done
  // adminProxy = await Admin.attach("0xc4DF119744Cc8A93A1E4A0ae36F5ecc439aEc48d");
  // console.log("adminProxy Done",adminProxy.address);


  //======mainnet=======
  // 0xA622D883B02c4737333c4CA74c00743A9bD8f9B2 TokenSale Contract
  // tokenSaleContract = await TokenSale.attach("0xA622D883B02c4737333c4CA74c00743A9bD8f9B2");
  // tokenSaleContract = await TokenSale.deploy();
  tokenSaleContract = await TokenSale.attach("0x7A4Bbc8B780f167e2C721e03de4f56e319588F55");
  // tokenSaleContract = await TokenSale.attach("0x72bf1fa974650A809BC482630f41E25e74cd6F80");
  // await sleep(20000);
  console.log("TokenSale", tokenSaleContract.address);

  // const now = (await time.latest()).toNumber();
  // const newNow = BN.from(now).add(duration.minutes(5));
  // const end = BN.from(newNow).add(duration.minutes(15));

  // defaultParams = {
  //   totalSupply: BN.from("10000").mul(BN.from("10").pow("6")),
  //   privateStart: (newNow),
  //   privateTokenPrice:BN.from("1").mul(BN.from("10").pow("6")),
  //   privateEnd: (end),
  // };  
  // await tokenSaleContract.initialize(defaultParams,stakingContract,adminContract);

 

  //=====mainnet=====
  // proxy2 contract 0x796e22B0B5A3eBE7A974EC8EA36163464dAADf61
  // staking contract 0x4379311475441b640dE946Ce0511899FD7b28a0F
  // stakingProxy 0x796e22B0B5A3eBE7A974EC8EA36163464dAADf61
  // stakingProxy = await Staking.attach("0x0d99e50dC14623B5325068914C4230D5fd49fDAe");
  // console.log("stakingProxy Done", stakingProxy.address);





  // proxy3 = await Upgradeability.attach("0x30cfC3661624A5c0C597FA45570f0e973e1a4374");
  // proxy3 = await Upgradeability.deploy();
  // await sleep(20000);
  proxy3 = await Upgradeability.attach("0x8c8bd4553723c5E44d761B37511d98FA62167cdc");
  // console.log("proxy3 contract", proxy3.address);
  // rewards = await Rewards.deploy();
  rewards = await Rewards.attach("0xeC87D57aFd5b38C5f60f66FbB279269EcE684A47");
  // await sleep(20000);
  console.log("Rewards contract", rewards.address);
  rewardsProxy = await Rewards.attach(proxy3.address);
  console.log("rewardsProxy", rewardsProxy.address);
  // initializeData = Rewards.interface.encodeFunctionData('initialize', [adminProxy.address, ionToken.address, router.address, testnet.devWallet]);
  // await proxy3.upgradeToAndCall(rewards.address, initializeData);
  // await proxy3.upgradeTo(rewards.address)
  // await sleep(20000);

  // proxy4 = await Upgradeability.deploy();
  proxy4 = await Upgradeability.attach("0xB275f582EbE9672BB8FD547922B9D7D064216548");
  // console.log("proxy4 contract", proxy4.address);
// console.log("donee reward");
  // superCharge = await SuperCharge.deploy();
  superCharge = await SuperCharge.attach("0x86720f526B1aD15F4ef044eBF0f9d8bF610537db");
  // await sleep(20000);
  console.log("supercharge", superCharge.address);
  superChargeProxy = await superCharge.attach(proxy4.address);
  // await sleep(20000);

  console.log("superChargeProxy", superChargeProxy.address);
  // initializeData = SuperCharge.interface.encodeFunctionData('initialize', [adminProxy.address, ionToken.address]);
  // await proxy4.upgradeToAndCall(superCharge.address, initializeData);
    // await proxy4.upgradeTo(superCharge.address);
  // await sleep(20000);



  //======mainnet======
  // proxy3 contract 0xbb39Cdf1B3Eae756b13e608F4b1C56E0f8Ce7a91
  // Airdrops contract 0x914588d6E610631954F415827aD4bCfF6Be4Bfc8
  // airdropProxy 0xbb39Cdf1B3Eae756b13e608F4b1C56E0f8Ce7a91
  // airdropProxy = await Airdrops.attach("0x06b3d8929746246927B0a6E6e32615fe984Df0E7");
  // console.log("airdropProxy Done", airdropProxy.address);

  // proxy4 = await Upgradeability.deploy();
  // await sleep(3000);
  // console.log("proxy4 contract", proxy4.address);
  // airdropRewardContract = await AirdropReward.deploy();
  // await sleep(3000);
  // console.log("AirdropReward contract", airdropRewardContract.address);
  // airdropRewardProxy = await AirdropReward.attach(proxy4.address);
  // console.log("airdropRewardProxy",airdropRewardProxy.address);
  // initializeData = AirdropReward.interface.encodeFunctionData('initialize',[owner]);
  // await proxy4.upgradeToAndCall(airdropRewardContract.address,initializeData);
  // await sleep(3000);

  //=====mainnet======
  // proxy4 contract 0xF66f0c3780a8b0cBcA84Bead0DD9d4A95E98C2C2
  // AirdropReward contract 0xB4396b1Cedab115003b71e5a50fdAC81D7a937e6
  // airdropRewardProxy 0xF66f0c3780a8b0cBcA84Bead0DD9d4A95E98C2C2
  // airdropRewardProxy = await AirdropReward.attach("0x1311C1c3D7B014D4186928B4A6a4264f0A11B502");
  // console.log("airdropRewardProxy Done",airdropRewardProxy.address);

  -await adminProxy.addOperator(owner);
  await sleep(20000);
  // await adminProxy.addOperator("0x68Bd509Dc8b69BCF8Bd933b0AB2810BCb934f01d"); //ben's address
  // await sleep(3000);
  // await airdropRewardProxy.addOperator("0x68Bd509Dc8b69BCF8Bd933b0AB2810BCb934f01d");//ben's address
  // await sleep(3000);


  proxy2 = await Upgradeability.deploy();
  await sleep(20000);
  // console.log("proxy2 contract", proxy2.address);
  stakingContract = await Staking.deploy();
  await sleep(20000);
  console.log("staking contract", stakingContract.address);
  stakingProxy = await Staking.attach(proxy2.address);
  console.log("stakingProxy", stakingProxy.address);
  initializeData = Staking.interface.encodeFunctionData('initialize', [ionToken.address, adminProxy.address, router.address, weth.address, EbscReq]);
  await proxy2.upgradeToAndCall(stakingContract.address, initializeData);
  await sleep(20000);


  // await adminProxy.addOperator("0x0B4d9ba9634D5782a4682ec5c8919A490A863E79"); //badger's address
  
  console.log("after add operator");
  await sleep(20000);
  

  await adminProxy.setMasterContract(tokenSaleContract.address);
  await sleep(20000);
  console.log("after setMaster contract ")



  await adminProxy.setStakingContract(stakingProxy.address);
  await sleep(20000);
  console.log("set staking contract")

  await adminProxy.setAirdrop(rewardsProxy.address);

  await sleep(20000);
  console.log("after airdrop");

  await adminProxy.setSuperCharge(superChargeProxy.address);
  await sleep(20000);

  console.log("--------------Admin setter functions done -----------------------------");

    
  // await sleep(3000);

  // await ionToken.approve(
  //   stakingProxy.address,
  //   BN.from("99999999999999999999999999").mul(BN.from("10").pow("18"))
  // );
  // await sleep(20000);

  // console.log("approved");

  await ionToken.excludeFromFee(stakingProxy.address);
  await sleep(20000);
  console.log("1");
  await ionToken.setRewardsContract(rewardsProxy.address);
  await ionToken.excludeFromFee(rewardsProxy.address);
  await sleep(20000);

  await ionToken.excludeFromFee(superChargeProxy.address);
  await sleep(20000);

  // await ionToken.excludeFromFee(testnet.wallet)
  // await ionToken.setRewards([3000, 1500, 1500, 3000, 1000]);




  console.log("Dev wallet setter done");

  // await ionToken.excludeFromFee("0xa4b3F2e7550279F706fd9f2f0e9111948BE93583");////Ankit
  // console.log("excluded");

  const allocation = [
    [15, 75, 150, 350, 750, 1125],
    [30, 115, 225, 550, 1125, 1650],
    [60, 225, 350, 825, 1650, 2350],
    [200, 600, 850, 1650, 2350, 3000, 7500]
  ];

  // await sleep(5000);
  console.log("after initialize");
  await stakingProxy.setAllocations(allocation);
  console.log("All contracts deployed");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });