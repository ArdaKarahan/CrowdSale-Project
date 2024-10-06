pragma solidity ^0.6.0;

import "./CrowdSale.sol";
import "./KycContract.sol";

contract TokenSale is Crowdsale {

    KycContract kyc;

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract kyc_
    )
        Crowdsale(rate, wallet, token)
        public
    {
        kyc = kyc_;
    }

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycCompleted(msg.sender), "Kyc not completed, purchase not allowed");
    }
}