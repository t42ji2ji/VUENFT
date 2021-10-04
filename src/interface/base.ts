import Web3 from 'web3';

export interface MetaMaskInterface {
  message: string;
  metaMaskAddress: string;
  netID: string;
  type: string;
  balance: number;
}
