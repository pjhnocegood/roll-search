// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.19; // OpenZeppelin 5.0과 호환되도록 수정

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StablecoinLending is Ownable {
    IERC20 public collateralToken;
    IERC20 public stablecoin;

    uint256 public collateralFactor = 50; // 담보 비율 (50% = 2배 담보 필요)
    uint256 public liquidationThreshold = 75; // 청산 비율 (75%)

    struct UserInfo {
        uint256 collateralAmount;
        uint256 borrowedAmount;
    }

    mapping(address => UserInfo) public users;

    event Deposited(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event Liquidated(address indexed user, address liquidator);

    constructor(address _collateralToken, address _stablecoin) Ownable(msg.sender) {
        collateralToken = IERC20(_collateralToken);
        stablecoin = IERC20(_stablecoin);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        collateralToken.transferFrom(msg.sender, address(this), amount);
        users[msg.sender].collateralAmount += amount;
        emit Deposited(msg.sender, amount);
    }

    function borrow(uint256 amount) external {
        UserInfo storage user = users[msg.sender];
        uint256 maxBorrow = (user.collateralAmount * collateralFactor) / 100;

        require(amount > 0, "Invalid amount");
        require(user.borrowedAmount + amount <= maxBorrow, "Exceeds borrow limit");

        user.borrowedAmount += amount;
        stablecoin.transfer(msg.sender, amount);

        emit Borrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external {
        UserInfo storage user = users[msg.sender];

        require(amount > 0, "Invalid amount");
        require(user.borrowedAmount >= amount, "Repay amount exceeds debt");

        stablecoin.transferFrom(msg.sender, address(this), amount);
        user.borrowedAmount -= amount;

        emit Repaid(msg.sender, amount);
    }

    function liquidate(address userAddress) external {
        UserInfo storage user = users[userAddress];
        uint256 maxBorrow = (user.collateralAmount * collateralFactor) / 100;
        uint256 liquidationPoint = (user.collateralAmount * liquidationThreshold) / 100;

        require(user.borrowedAmount > liquidationPoint, "Not eligible for liquidation");

        collateralToken.transfer(msg.sender, user.collateralAmount);
        user.collateralAmount = 0;
        user.borrowedAmount = 0;

        emit Liquidated(userAddress, msg.sender);
    }
}
