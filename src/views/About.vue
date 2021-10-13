<template lang="pug">
.about
  .createSale(@click="createSale") createSale
  .loadNFTs(@click="loadNFTs") loadNFTs
  .buyNft(@click="buyNft") buyNft
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import { nftaddress, nftmarketaddress } from "@/assets/config/config";
import NFT from "@/assets/config/NFT.json";
import Market from "@/assets/config/NFTMarket.json";
import { MarketItem } from "@/interface/base";

export default defineComponent({
  name: "NFT",
  setup() {
    var marketItems = ref<Array<MarketItem>>();

    async function loadNFTs() {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );

      console.log("tokenContract", tokenContract);
      console.log("marketContract", marketContract);
      const data = (await marketContract.functions.fetchMarketItems())[0];
      console.log("item", data);

      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            metaData: meta.data,
          } as MarketItem;
          console.log(item);
          return item;
        }) as Array<MarketItem>
      );
      marketItems.value = items;
    }
    async function buyNft(nft) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );

      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(
        nftaddress,
        nft.tokenId,
        {
          value: price,
        }
      );
      await transaction.wait();
      loadNFTs();
    }
    async function createSale() {
      const url = "https://int.dev.sw.sensestar.live/nft/nft.json";
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      /* next, create the item */
      let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
      let transaction = await contract.createToken(url);
      let tx = await transaction.wait();
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();

      const price = ethers.utils.parseUnits("0.005", "ether");

      /* then list the item for sale on the marketplace */
      contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
      console.log("contract", contract.functions);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      transaction = await contract.createMarketItem(
        nftaddress,
        tokenId,
        price,
        { value: listingPrice }
      );
      await transaction.wait();
    }
    onMounted(async () => {
      loadNFTs();
    });
    return { createSale, loadNFTs, buyNft, marketItems };
  },
});
</script>
