<template lang="pug">
.about.column(style="align-items: center")
  .spacer(style="height: 100px") 
  .test.column
    .txt nft:0xbF8A0BB719d65dfdb75210f9F8DC7Eb2680A8D3F
    .txt Market:0xa9d6A773D29e55Be823FA4ecae8e4EBC1c78143D
  .row
    .name nft
    input(v-model="nftAddressModel")
    .name Market
    input(v-model="nftMarketAddressModel")
    .btn(@click="changeNFTAddress") 搜尋
  .createSale(@click="createSale") createSale
  .createSale(@click="test") test

  .grid
    .block.column(
      v-for="item in marketItems",
      style="align-items: flex-start",
      :ref="setItemRef"
    )
      .img.baseBgImg(
        :style="{ flex: 1, backgroundImage: `url(${item.metaData.image})` }"
      )
      .title {{ item.metaData.name }} / {{ item.tokenId }}
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
import {
  nftaddress as defaultNftAddress,
  nftmarketaddress as defaultNftMarketAddress,
} from "@/assets/config/config";
import NFT from "@/assets/config/NFT.json";
import Market from "@/assets/config/NFTMarket.json";
import { MarketItem } from "@/interface/base";
import { goTranslateX } from "@/animation/animation";
export default defineComponent({
  name: "NFT",
  setup() {
    var nftaddress = defaultNftAddress;
    var nftmarketaddress = defaultNftMarketAddress;
    var nftMarketAddressModel = ref(nftmarketaddress);
    var nftAddressModel = ref(nftaddress);
    var marketItems = ref<Array<MarketItem>>();
    var myNFTItems = ref<Array<MarketItem>>();
    var blockRefs = ref<Array<HTMLFormElement>>([]);
    function setItemRef(el) {
      if (el) {
        blockRefs.value.push(el);
      }
    }
    async function changeNFTAddress() {
      nftmarketaddress = nftMarketAddressModel.value;
      nftaddress = nftAddressModel.value;
      await loadNFTs();
    }
    async function loadNFTs() {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      console.log("add", nftaddress, nftmarketaddress);
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
            price: price,
            itemId: i.itemId.toNumber(),
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            metaData: meta.data,
          } as MarketItem;
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
            itemId: i.itemId.toNumber(),
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
    async function buyNft(nft: MarketItem) {
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
        nft.itemId,
        {
          value: price,
        }
      );
      await transaction.wait();
      loadNFTs();
    }
    async function test() {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      let contract = new ethers.Contract(
        "0xce82d65314502ce39472a2442d4a2cbc4cb9f293",
        [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
            ],
            name: "tokenURI",
            outputs: [
              {
                internalType: "string",
                name: "",
                type: "string",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        signer
      );
      console.log("as contract", contract);
      // console.log("filters", contract.filters);
      // const filter = {
      //   address: nftmarketaddress,
      //   fromBlock: 0,
      //   toBlock: 10000,
      //   // topics: [contract.interface.]
      // };
      var res = await contract.tokenURI("4071");
      console.log("as contract res", res);
      const meta = await axios.get(res);

      console.log("adaadadsd", meta);
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
      console.log("tx", tx);
      const price = ethers.utils.parseUnits("0.05", "ether");

      /* then list the item for sale on the marketplace */
      contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      // ================

      console.log("filters", contract.filters);
      const filter = {
        address: nftmarketaddress,
        fromBlock: 0,
        toBlock: 10000,
        // topics: [contract.interface],
      };

      contract.on(
        "MarketItemCreated",
        (itemId, nftContract, tokenId, seller, owner, price, sold) => {
          console.log(
            "contract on",
            itemId,
            nftContract,
            tokenId,
            seller,
            owner,
            price,
            sold
          );
        }
      );

      // ==================

      transaction = await contract.createMarketItem(
        nftaddress,
        tokenId,
        price,
        { value: listingPrice }
      );

      var createdMarketItemRes = await transaction.wait();
      console.log("createdMarketItem", createdMarketItemRes);

      const logs = await provider.getLogs(filter);
      console.log("logs", logs);
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
      test,
      changeNFTAddress,
      nftMarketAddressModel,
      nftAddressModel,
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