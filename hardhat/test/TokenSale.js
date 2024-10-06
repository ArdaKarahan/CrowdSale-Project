const { expect } = require("chai")
const { ethers } = require("hardhat")
require("dotenv").config({path: "/home/ardakl/blockchain-tutorials/hardhat/.env"})
const fs = require("fs")

const rawFileTS = fs.readFileSync("/home/ardakl/crowdsale-project/hardhat/artifacts/contracts/TokenSale.sol/TokenSale.json")
const parsedFileTS = JSON.parse(rawFileTS)
const abiTS = parsedFileTS.abi

const rawFileSD = fs.readFileSync("/home/ardakl/crowdsale-project/hardhat/artifacts/contracts/StarDucks.sol/StarDucks.json")
const parsedFileSD = JSON.parse(rawFileSD)
const abiSD = parsedFileSD.abi

const rawFileKyc = fs.readFileSync("/home/ardakl/crowdsale-project/hardhat/artifacts/contracts/KycContract.sol/KycContract.json")
const parsedFileKyc = JSON.parse(rawFileKyc)
const abiKyc = parsedFileKyc.abi

describe("StarDucks", () => {

    let deployer, starDucks, tokenSale;

    beforeEach("Get the contracts", async() => {

        [deployer, addr1, addr2] = await ethers.getSigners()
        
        starDucks = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abiSD, deployer)

        tokenSale = new ethers.Contract("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", abiTS, deployer)

        kycContract = new ethers.Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", abiKyc, deployer )

        console.log("StarDucks address: ", starDucks.target);
        console.log("TokenSale address: ", tokenSale.target);
    })

    it("Should not have any tokens in my deployer account", async() => {
        expect(await starDucks.balanceOf(deployer)).to.be.equal(0)
    })

    it("All tokens should be in TokenSale contract by default", async() => {
        const balanceOfTokenSale = await starDucks.balanceOf(tokenSale.target)
        expect(balanceOfTokenSale).to.be.equal(100000)
    })

    it("Should be possible to buy tokens", async() => {

        console.log(await starDucks.balanceOf(tokenSale.getAddress()))

        await kycContract.setKycCompleted(deployer, {from: deployer})

        await starDucks.connect(deployer).increaseAllowance(addr1, 10)
        
        expect(await tokenSale.connect(deployer).buyTokens(
            addr1.address, {
            value: 10
        })).to.changeEtherBalance("0.000000000000000001")
    })
})