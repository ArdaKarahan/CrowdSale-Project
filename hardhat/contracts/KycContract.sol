pragma solidity 0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract KycContract is Ownable {
    mapping(address => bool) allowed;

    function setKycCompleted(address addr_) public onlyOwner {
        allowed[addr_] = true;
    }

    function setKycRevoked(address addr_) public onlyOwner {
        allowed[addr_] = false;
    }

    function kycCompleted(address addr_) public view returns(bool) {
        return allowed[addr_];
    }
}