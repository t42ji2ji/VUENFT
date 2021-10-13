<template lang="pug">
.about.column(style="align-items: center")
  .spacer(style="height: 100px") in
  .createSale(@click="createSale") createSale

  .grid
    .block.column(
      v-for="item in [...(marketItems ?? []), ...(marketItems ?? []), ...(marketItems ?? [])]",
      style="align-items: flex-start",
      :ref="setItemRef"
    )
      .img.baseBgImg(
        :style="{ flex: 1, backgroundImage: `url(${item.metaData.image})` }"
      )
      .title {{ item.metaData.name }}
      .desc {{ item.metaData.description }}
      .price.btn.row.flexCenter(@click="buyNft(item)")
        .price {{ item.price }}
        .ethIcon.baseBgImg
  .divider(
    style="background: rgb(122, 122, 122); border-radius: 5px; width: 40vw; height: 3px; margin: 30px 0px"
  )
  .title MyNFT
  .grid
    .block.column(
      v-for="item in myNFTItems",
      style="align-items: flex-start",
      :ref="setItemRef"
    )
      .img.baseBgImg(
        :style="{ flex: 1, backgroundImage: `url(${item.metaData.image})` }"
      )
      .title {{ item.metaData.name }}
      .desc {{ item.metaData.description }}
      //- .price.btn.row.flexCenter(@click="buyNft(item)")
      //-   .price {{ item.price }}
      //-   .ethIcon.baseBgImg
  .spacer(style="height: 100vh")
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from "vue";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import { nftaddress, nftmarketaddress } from "@/assets/config/config";
import NFT from "@/assets/config/NFT.json";
import Market from "@/assets/config/NFTMarket.json";
import { MarketItem } from "@/interface/base";
import { goTranslateX } from "@/animation/animation";
export default defineComponent({
  name: "NFT",
  setup() {
    var marketItems = ref<Array<MarketItem>>();
    var myNFTItems = ref<Array<MarketItem>>();
    var blockRefs = ref<Array<HTMLFormElement>>([]);
    function setItemRef(el) {
      console.log("el", el);
      if (el) {
        blockRefs.value.push(el);
      }
    }
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
      const myNFTdata = (await marketContract.functions.fetchMyNFTs())[0];

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
      const myNFTitems = await Promise.all(
        myNFTdata.map(async (i) => {
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
      myNFTItems.value = myNFTitems;
      await nextTick();
      goTranslateX(blockRefs.value);
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
      const url = "https://int.dev.sw.sensestar.live/nft/nft-2.json";
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

      const price = ethers.utils.parseUnits("0.05", "ether");

      /* then list the item for sale on the marketplace */
      contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
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
    return {
      createSale,
      loadNFTs,
      buyNft,
      marketItems,
      setItemRef,
      blockRefs,
      myNFTItems,
    };
  },
});
</script>

<style lang="scss" scoped>
.about {
  overflow-y: scroll;
}
.block {
  width: 200px;
  height: 250px;
  background: white;
  border-radius: 5px;
  padding: 3px;
  .img {
    flex: 1 1 0%;
    width: 100%;
  }
  .title {
    font-size: 1.5rem;
    color: rgb(51, 41, 41);
    margin-top: 5px;
    font-weight: bold;
  }
  .desc {
    margin-top: 15px;
    color: rgb(119, 102, 102);
  }
  .price {
    margin-top: 3px;
    cursor: pointer;
  }
  .ethIcon {
    width: 20px;
    height: 20px;
    background-image: url("https://moonbeam.network/wp-content/uploads/2020/10/rotating-ethereum-logo.gif");
    background-size: contain !important;
  }
}
</style>