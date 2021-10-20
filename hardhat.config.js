/* eslint-disable @typescript-eslint/no-var-requires */
/* hardhat.config.js */
require('@nomiclabs/hardhat-waffle');

require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
const { API_URL, PRIVATE_KEY } = process.env;

const fs = require('fs');
console.log(API_URL, PRIVATE_KEY);
const privateKey =
  fs
    .readFileSync('.secret')
    .toString()
    .trim() || '01234567890123456789';

module.exports = {
  defaultNetwork: 'ropsten',
  solidity: {
    version: '0.8.3',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    mumbai: {
      url: 'https://rpc-mumbai.matic.today',
      accounts: [privateKey],
    },
    ropsten: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
