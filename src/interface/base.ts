import Web3 from 'web3';

export interface MetaMaskInterface {
  message: string;
  metaMaskAddress: string;
  netID: string;
  type: string;
  balance: number;
}

export interface MarketItem {
  price: '0.005';
  tokenId: 4;
  seller: '0x899bd466D50e861351fb1fAa303CaB08Bdb03725';
  owner: '0x0000000000000000000000000000000000000000';
  metaData: {
    attributes: [
      {
        type: 'role';
        value: 'RichMan';
      }
    ];
    description: 'NFT TEST';
    image: 'https://p2.bahamut.com.tw/B/2KU/73/2beeaac646f40d0976d391b1941dbd55.JPG?v=1628756832061';
    name: 'NFTTEST';
  };
}
