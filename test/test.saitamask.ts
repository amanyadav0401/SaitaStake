import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, network } from "hardhat";
import {
  expandTo18Decimals,
  expandTo6Decimals,
} from "./shared/utilities";
import {
  SaitaStaking,
  SaitaStaking__factory,
  Token,
  Token__factory,
} from "../typechain";
import chai, { expect } from "chai";
describe("Saitamask Testing", () => {
  let owner: SignerWithAddress;
  let signers: SignerWithAddress[];

  let token: Token;
  let staking: SaitaStaking;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    owner = await signers[0];

    token = await new Token__factory(owner).deploy();
    staking = await new SaitaStaking__factory(owner).deploy();
    await staking.connect(owner).initialize(token.address);
    await staking.connect(owner).setRewardPercent(30, 10);
    await staking.connect(owner).setRewardPercent(60, 20);
    await staking.connect(owner).setRewardPercent(90, 30);

    await token
      .connect(owner)
      .transfer(staking.address, expandTo18Decimals(100000));
    await token
      .connect(owner)
      .transfer(signers[1].address, expandTo18Decimals(1000));
    await token
      .connect(owner)
      .transfer(signers[2].address, expandTo18Decimals(1000));

    await token
      .connect(owner)
      .transfer(signers[3].address, expandTo18Decimals(1000));

    await token
      .connect(signers[1])
      .approve(staking.address, expandTo18Decimals(1000));
    await token
      .connect(signers[2])
      .approve(staking.address, expandTo18Decimals(1000));
    await token
      .connect(signers[3])
      .approve(staking.address, expandTo18Decimals(1000));
  });

  const stakeFunction = async () => {
    await staking
      .connect(signers[1])
      .stake(30, expandTo18Decimals(100));
    await staking
      .connect(signers[1])
      .stake(30, expandTo18Decimals(100));
    await staking
      .connect(signers[1])
      .stake(30, expandTo18Decimals(100));

    await staking
      .connect(signers[1])
      .stake(30, expandTo18Decimals(100));
    await staking
      .connect(signers[1])
      .stake(60, expandTo18Decimals(100));
    await staking
      .connect(signers[1])
      .stake(90, expandTo18Decimals(100));
  };

  it("Checks if input time is specified", async () => {
    await expect(
      staking.connect(signers[1]).stake(40, 100)
    ).to.be.revertedWith("Time not specified.");
  });

  it("Stakes the amount", async () => {
    await stakeFunction();
    let stakes = await staking
      .connect(signers[1])
      .stakingTx(signers[1].address);

    console.log(
      `Total txs: ${stakes[0]}, Total amount staked: ${stakes[1]}`
    );

    console.log(
      "Total balance signers[1]:" +
        (await token.balanceOf(signers[1].address))
    );

    await expect(
      await token.balanceOf(signers[1].address)
    ).to.be.eq(expandTo18Decimals(400));
  });

  it("Checks the claimable rewards", async () => {
    await stakeFunction();
    //Increasing time by 30 seconds
    // await network.provider.send("evm_increaseTime", [30]);
    // await network.provider.send("evm_mine");

    let cl1 = await staking.connect(signers[1]).rewards(1);

    console.log("claimable" + cl1);
    // expect(cl1).to.be.eq(0);
  });

  it("Claims the staked amount at different times", async () => {
    await stakeFunction();
    //Increasing time by 30 seconds
    await network.provider.send("evm_increaseTime", [30]);
    await network.provider.send("evm_mine");
    await expect(
      staking.connect(signers[1]).claim(5)
    ).to.be.revertedWith("Stake period is not over.");

    await staking.connect(signers[1]).claim(3);
    console.log(
      "Total balance signers[1] after claiming:" +
        (await token.balanceOf(signers[1].address))
    );

    await network.provider.send("evm_increaseTime", [30]);
    await network.provider.send("evm_mine");
    await staking.connect(signers[1]).claim(5);
    console.log(
      "Total balance signers[1] after claiming:" +
        (await token.balanceOf(signers[1].address))
    );
    await expect(
      staking.connect(signers[1]).claim(6)
    ).to.be.revertedWith("Stake period is not over.");

    await network.provider.send("evm_increaseTime", [30]);
    await network.provider.send("evm_mine");
    await staking.connect(signers[1]).claim(6);
    await staking.connect(signers[1]).claim(1);
    await staking.connect(signers[1]).claim(2);
    await staking.connect(signers[1]).claim(4);
    console.log(
      "Total balance signers[1] after claiming:" +
        (await token.balanceOf(signers[1].address))
    );
    await expect(
      staking.connect(signers[1]).claim(6)
    ).to.be.revertedWith(
      "The rewards for this staking is already claimed."
    );
  });
});
