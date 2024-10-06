const { expect } = require("chai")
const { ethers } = require("hardhat")
require("dotenv").config({path: "/home/ardakl/blockchain-tutorials/hardhat/.env"})

describe("StarDucks", () => {

    let owner, addr1, addr2, starDucks;

    before("Get the signers", async() => {
        //get signers
        [owner, addr1, addr2] = await ethers.getSigners();
        
        //deploy contract
        starDucks = await ethers.deployContract("StarDucks", [process.env.INITIAL_TOKEN_AMOUNT]);

        //wait for deployment
        await starDucks.waitForDeployment();
    })

    it("owner has all the money", async() => {
        const balance = await starDucks.totalSupply()
        console.log(ethers.formatEther(balance))
        expect(ethers.parseEther((await starDucks.balanceOf(owner.address)).toString()))
        .to.equal(ethers.parseEther((balance).toString()))
    })

    it("is possible to send tokens between accounts", async() => {
        await starDucks.connect(owner).transfer(addr1.address, 10)
        
        expect(await starDucks.balanceOf(addr1.address)).to.equal(10)
    })

    it("Can not send more than available", async() => {
        await expect(starDucks.connect(addr1).transfer(addr2.address, 15))
        .to.be.revertedWith(
            "ERC20: transfer amount exceeds balance"
        )
    })
})