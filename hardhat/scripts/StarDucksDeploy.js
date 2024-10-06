const {ethers} = require("hardhat")
require("dotenv").config({path: "/home/ardakl/blockchain-tutorials/hardhat/.env"})

async function main() {
    const contractFactory = await ethers.getContractFactory("StarDucks")
    console.log("Deploying...")
    const contract = await contractFactory.deploy(process.env.INITIAL_TOKEN_AMOUNT)
    await contract.waitForDeployment()
    console.log("StarDucks contract deployed to: ", await contract.getAddress())

    const contractFactory3 = await ethers.getContractFactory("KycContract")
    console.log("Deploying...")
    const contract3 = await contractFactory3.deploy()
    await contract3.waitForDeployment()
    console.log("Kyc contract deployed to: ", await contract3.getAddress())

    const [deployer] = await ethers.getSigners();
    const contractFactory2 = await ethers.getContractFactory("TokenSale")
    console.log("Deploying...")
    const contract2 = await contractFactory2.deploy(1, deployer.address, contract.getAddress(), contract3.getAddress())
    await contract2.waitForDeployment()
    console.log("TokenSale contract deployed to: ", await contract2.getAddress())

    await contract.totalSupply().then(result => {
        console.log("The total amount of Tokens is: ", result)
    })

    await contract.balanceOf(deployer.address).then(result => {
        console.log("The balance of owner before the transfer is: ", result)
    })

    await contract.balanceOf(contract2).then(result => {
        console.log("The balance of TokenSale contract before the transaction is: ", result);
    })

    await contract.transfer(contract2.getAddress(), process.env.INITIAL_TOKEN_AMOUNT)

    console.log("Tokens sent!")

    await contract.balanceOf(contract2).then(result => {
        console.log("The balance of TokenSale contract after the transaction is: ", result);
    })

    await contract.balanceOf(deployer).then(result => {
        console.log("The balance of owner after the transfer is: ", result)
    })
}

main()