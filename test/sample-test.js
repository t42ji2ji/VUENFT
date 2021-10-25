/* eslint-disable no-undef */
/* test/sample-test.js */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { expect } = require('chai');

describe('RaribleRoyaltyERC721 Test', () => {
  let market;
  let nft;

  before(async () => {
    [_, buyerAddress, thirdAddress] = await ethers.getSigners();
    const Market = await ethers.getContractFactory('NFTMarket');
    market = await Market.deploy();
    await market.deployed();

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory('NFT');
    nft = await NFT.deploy(market.address);
    await nft.deployed();

    

    marketAddress = market.address;
    nftContractAddress = nft.address;
    auctionPrice = ethers.utils.parseUnits('10', 'ether');
  });

  describe('Test set Owner', function() {
    it('Should update owner', function(done) {
      // market.setOwner(buyerAddress.address);
      done();
    });
  });

  describe('Test Listing Price Update', function() {
    it('Should Update Listing Price', async function() {
      const newAuctionPrice = ethers.utils.parseUnits('1', 'ether');
      market.setLisitingPrice(newAuctionPrice);
      let listingPrice = await market.getListingPrice();
      listingPrice = listingPrice.toString();
      console.log('listingPrice', listingPrice);
    });
  });

  describe('NFT Rolity test', function() {
    it('Should create and execute market sales', async function() {
      ///
      /* deploy the marketplace */

      listingPrice = await market.getListingPrice();
      listingPrice = listingPrice.toString();

      await getBalance('buyer origin', buyerAddress);
      await getBalance('origin', _);
      /* create two tokens */
      await nft.createToken('https://www.mytokenlocation.com');
      await nft.createToken('https://www.mytokenlocation2.com');
      await nft.createToken('https://www.mytokenlocation2.com');

      const auctionPrice = ethers.utils.parseUnits('10', 'ether');

      /* put both tokens for sale */
      await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
        value: listingPrice,
      });
      await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
        value: listingPrice,
      });
      await market.createMarketItem(nftContractAddress, 3, auctionPrice, {
        value: listingPrice,
      });

      // set percent
      let royalty10Percent = 10;
      let royalty20Percent = 20;
      await market.setRoyalties(1, buyerAddress.address, royalty10Percent);
      await market.setRoyalties(2, buyerAddress.address, royalty20Percent);
      const token0Royalty = await market.getRaribleV2Royalties(1);
      const token1Royalty = await market.getRaribleV2Royalties(2);
      expect(token0Royalty[0][1]).to.equal(royalty10Percent);
      expect(token1Royalty[0][1]).to.equal(royalty20Percent);

      await market
        .connect(thirdAddress)
        .createMarketSale(nftContractAddress, 1, { value: auctionPrice });
      await getBalance('buyer after 1', buyerAddress);
      await getBalance('orgin after 1', _);

      await market
        .connect(thirdAddress)
        .createMarketSale(nftContractAddress, 2, { value: auctionPrice });
      await getBalance('buyer after 2', buyerAddress);
      await getBalance('orgin after 2', _);

      await market
        .connect(thirdAddress)
        .createMarketSale(nftContractAddress, 3, { value: auctionPrice });
      await getBalance('buyer after 3', buyerAddress);
      await getBalance('orgin after 3', _);
    });
  });

  describe('NFTMarket', function() {
    it('Should create and execute market sales', async function() {
      // 同意代理操作
      await nft.connect(thirdAddress).setApprovalForAll(marketAddress, true);

      // 重新上架 start ----------------------- //
      var x = await market
        .connect(thirdAddress)
        .createMarketItem(nftContractAddress, 1, auctionPrice, {
          value: listingPrice,
        });
      var xRes = await x.wait();

      //取得上架後 新的 itemId
      var itemId;
      xRes.events?.forEach((x) => {
        if (x?.event == 'MarketItemCreated') {
          // console.log(x.decode());
          itemId = x.args.itemId.toString();
          console.log('itemId', itemId);
        }
      });

      // await market
      //   .connect(thirdAddress)
      //   .createMarketSale(nftContractAddress, itemId, { value: auctionPrice });
      // 重新上架 end ----------------------- //

      /* query for and return the unsold items */

      // var b1 = await market.connect(buyerAddress).fetchMyNFTs();
      // var t1 = await market.connect(thirdAddress).fetchMyNFTs();
      // var afterItems = await market.fetchMarketItems();
      // var afterAllItems = await market.fetchAllItems();
    });
  });
});

async function getBalance(name, signer) {
  // Get the balance of an account (by address or ENS name, if supported by network)
  balance = await signer.getBalance();
  // { BigNumber: "2337132817842795605" }
  var strBalance = ethers.utils.formatEther(balance);
  console.info(name, '  balance: ', strBalance);
}
