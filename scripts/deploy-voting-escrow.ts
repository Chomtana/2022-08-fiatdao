import { ethers } from "hardhat";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function deploy(contractName: string, ...args: any[]) {
  // Deploy contract
  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy(...args);
  await contract.deployed();
  console.log(contractName + " deployed to:", contract.address);

  await wait(6000);

  return contract;
}

async function main() {
  const accounts = await ethers.getSigners();

  const contracts: any = {};

  contracts.erc20 = await deploy("MockERC20", "Test", "TEST", accounts[0].address);
  contracts.votingEscrow = await deploy(
    "VotingEscrow",
    accounts[0].address,
    accounts[0].address,
    contracts.erc20.address,
    "Test voting escrow",
    "veTEST",
  );

  return contracts;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
