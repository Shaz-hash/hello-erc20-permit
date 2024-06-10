
const { ethers } = require('hardhat');

// scripts/deploy.js
async function main() {
    const SignUp = await ethers.getContractFactory('VerifySignature');
    const signUp = await SignUp.deploy();
    await signUp.deployed();
    console.log('SignUp deployed to:', signUp.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  