// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// mock usdc for testing
// real usdc has 6 decimals, we match that
contract MockUSDC is ERC20 {

    constructor() ERC20("Mock USDC", "USDC") {
        // mint 1 million usdc to deployer for testing
        _mint(msg.sender, 1000000 * 10**6);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    // anyone can mint for testing purposes
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
