const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE = "../nextjs-smartcontract-lottery/constants/contractAddresses.json"
const FRONT_END_ABI = "../nextjs-smartcontract-lottery/constants/abi.json"

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating front end....")
    await updateContractAddresses()
    await updateAbi()
    console.log("Updated Frontend!")
  }
}

async function updateAbi() {
  const raffle = await ethers.getContract("Raffle")
  fs.writeFileSync(FRONT_END_ABI, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
  const raffle = await ethers.getContract("Raffle")
  const chainId = network.config.chainId.toString()

  const currnetAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))

  if (chainId in currnetAddresses) {
    if (!currnetAddresses[chainId].includes(raffle.address)) {
      currnetAddresses[chainId].push(raffle.address)
    }
  } else {
    currnetAddresses[chainId] = [raffle.address]
  }

  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currnetAddresses))
}

module.exports.tags = ["all", "frontend"]
