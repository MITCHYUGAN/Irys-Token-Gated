// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DataGateKey is Ownable {
    IERC20 public token;
    uint256 public minBalance;
    bytes public decryptionKey;
    string public dataId;

    constructor(address tokenAddress, uint256 _minBalance, bytes memory _key, string memory _dataId) Ownable(msg.sender){
        require(tokenAddress != address(0), "token=0");
        token = IERC20(tokenAddress);
        minBalance = _minBalance;
        decryptionKey = _key;
        dataId = _dataId;
    }

    function canAccess(address user) public view returns (bool) {
        return token.balanceOf(user) >= minBalance;
    }

    function getKey() external view returns (bytes memory) {
        require(canAccess(msg.sender), "Not authorized");
        return decryptionKey;
    }

    function getDataID() external view returns (string memory){
        require(canAccess(msg.sender), "Not authorized");
        return dataId;
    }
}