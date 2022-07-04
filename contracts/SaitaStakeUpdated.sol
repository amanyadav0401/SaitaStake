//SPDX-License-Identifier:UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SaitaStaking is Ownable, Initializable, ReentrancyGuard {
    using SafeERC20 for IERC20;  
    IERC20 public token; // stake token address.

    /*
    * @dev struct containing user transactions and total amount staked.
    */
        struct Staking {
        uint256 txNo; //total number of staking transactions done by the user.
        uint256 totalAmount; //total amount of all the individual stakes.
        mapping(uint256 => UserTransaction) stakingPerTx; // mapping to individual stakes.
    }
    /*
    * @dev Struct containing individual transactions amount and lock time.
    */
    struct UserTransaction {
        uint256 amount; // amount of the individual stake.
        uint256 time; // total time for staking.
        uint percent; //reward percent at the time of staking.
        uint256 lockedUntil; // locked time after which rewards to be claimed.
        bool stakingOver; // if the staking is over or not, i.e. reward is claimed || !.

    }

    event StakeDeposit(
        uint256 _txNo,
        uint256 _amount,
        uint _percent,
        uint256 _lockPeriod,
        uint256 _lockedUntil
    );
    event RewardWithdraw(uint256 _txNo, uint256 _amount, uint256 _reward);

    mapping(address => Staking) public stakingTx; // Mapping to user stake total transactions and total amount.
    mapping(uint256 => uint256) public rewardPercent; // Mapping to individual transactions for a user.

    /* 
    * @dev initializing the staking for a particular token address.
    * @param token address.
    */
    function initialize(IERC20 _token) public initializer {
        token = _token;
    }

    /*
    * @dev to add stake, it denotes a transaction number to each staking and 
      records individual transactions to UserTransaction.
    * @param staking time period and amount to be staked.  
    */
    function addStake(uint256 _time, uint256 _amount) internal {
        Staking storage stakes = stakingTx[msg.sender];
        token.safeTransferFrom(msg.sender, address(this), _amount);
        stakes.txNo++;
        stakes.totalAmount += _amount;
        stakes.stakingPerTx[stakes.txNo].amount = _amount;
        stakes.stakingPerTx[stakes.txNo].time = _time;
        stakes.stakingPerTx[stakes.txNo].lockedUntil =
            block.timestamp +
            _time;
        stakes.stakingPerTx[stakes.txNo].percent=rewardPercent[_time];
    }

    /* 
    * @dev stake function call for addStake.
    * @param staking time period and amount to be staked.
    */
    function stake(uint256 _time, uint256 _amount) external nonReentrant{
        Staking storage stakes = stakingTx[msg.sender];
        require(_amount != 0, "Null amount!");
        require(_time != 0, "Null time!");
        require(rewardPercent[_time] != 0, "Time not specified.");
        addStake(_time, _amount);
        emit StakeDeposit(
            stakes.txNo,
            _amount,
            _time,
            stakes.stakingPerTx[stakes.txNo].percent,
            stakes.stakingPerTx[stakes.txNo].lockedUntil
        );
    }

    /*
       * @dev View function returns the staking info for individual transactions for a user.
       * @param user address, transaction number for stake.
       * @return transaction data for a particular stake.
    */
    function userTransactions(address _user, uint256 _txNo)
        external
        view
        returns (UserTransaction memory)
    {
        return stakingTx[_user].stakingPerTx[_txNo];
    }

    /* 
       * @dev view fucntion returns the claimable reward that have accumulated after the certain stake period.
       * @param transaction number for the stake.
       * @return uint256(claimable reward).
    */
    function rewards(uint256 _txNo) public view returns (uint256) {
        uint256 rewardBalance;
        Staking storage stakes = stakingTx[msg.sender];
        uint256 amount = stakes.stakingPerTx[_txNo].amount;
        rewardBalance = (amount * stakes.stakingPerTx[_txNo].percent) / 100;
        return rewardBalance;
    }

    /* 
    * @dev calls internally to rewards function and if there is a claimable reward 
      the function transfer the rewards and ends the staking.
    * @param transaction number for the stake.
    */
    function claim(uint256 _txNo) public nonReentrant{
        Staking storage stakes = stakingTx[msg.sender];
        require(
            stakes.stakingPerTx[_txNo].stakingOver != true,
            "Rewards already claimed."
        );
        require(
            block.timestamp > stakes.stakingPerTx[_txNo].lockedUntil,
            "Stake period is not over."
        );
        uint256 reward = rewards(_txNo);
        require(reward != 0, "Not eligible for reward!");
        uint256 amount = stakes.stakingPerTx[_txNo].amount;
        uint256 totalAmount = amount + reward;
        stakes.totalAmount -= amount;
        token.safeTransfer(msg.sender, totalAmount);
        stakes.stakingPerTx[_txNo].stakingOver = true;
        emit RewardWithdraw(_txNo, amount, reward);
    }

    /*
     * @dev, used by the owner to define a staking period and the apy on that particular period.
     * @param staking period and apy
     */
    function setRewardPercent(uint256 _time, uint256 _percent)
        public
        onlyOwner
    {
        rewardPercent[_time] = _percent;
    }
}
    