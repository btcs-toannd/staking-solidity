import { ethers, hardhatArguments } from "hardhat";
import * as Config from './config';
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  await Config.initConfig();
  const network = hardhatArguments.network ?? 'dev';
  const [deployer] = await ethers.getSigners();
  console.log('deploy from address: ', deployer.address);

  const tokenContract = '0xEcF3F554f58e9eF274aa3DF60f9c9ca3Ba156073';
  // GiftPack is the leaf in Smart Contract's hierarchical
  const StakingRewards = await ethers.getContractFactory('StakingRewards');
  const stakingRewards = await StakingRewards.deploy(tokenContract, tokenContract);
  await stakingRewards.deployed();

  console.log('Deployed address: ', stakingRewards.address);
  Config.setConfig(network + '.stakingContract', stakingRewards.address);
  Config.setConfig(network + '.BTCS Token Contract', tokenContract);
  await Config.updateConfig();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
