<template lang="pug">
.mint.column.flexCenter
  .cardWrapper
    .nftImg
      .nftAttr(v-for="(value, index) in Object.entries(nft)", :id="value[0]")
        img(
          v-if="value[1] != null",
          :src="require(`@/assets/nfts/${value[0]}/${value[1]}.png`)"
        )
      .cover.flexCenter(v-if="reload != 0")
        .txt(v-if="reload != 0 && reload % 2 == 0") 抽出NFT..
        .txt(v-if="reload != 0 && reload % 2 != 0") 抽出NFT.
    .btn(style="height: 20px", @click="randomNFT") Again
  .txt(v-if="reload == 0", style="font-size: 2rem; margin: 5px") Done
  .txt(v-if="reload == 0") 稀有度 {{ rarity }} %
</template>

<script lang="ts">
import { ref, reactive, onBeforeMount, computed } from "vue";

export default {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    var reload = ref<number>(0);
    var data = ref<number>(0);
    var nft = reactive({
      body: 0,
      clothe: 0,
      eye: 0,
      glasses: 0,
      hair: 0,
      mouse: 0,
      special: 0,
    });
    const rarity = computed(() => {
      var rarity = 0;
      if (nft.glasses != null) {
        rarity += 23;
      }
      if (nft.hair != null) {
        rarity += 21;
      }
      if (nft.special != null) {
        rarity += 26;
      }
      return rarity;
    });

    onBeforeMount(() => {
      randomNFT();
    });

    function getRandomInt(max) {
      if (max == 0) {
        return 0;
      }
      return Math.floor(Math.random() * max);
    }

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function randomNFT() {
      console.log("Taking a break...");
      let limitOfAttr = {
        body: 6,
        clothe: 10,
        eye: 8,
        glasses: 4, //can null
        hair: 10, //can null
        mouse: 4,
        special: 9, //can null
      };
      let canNullKey = ["glasses", "hair", "special"];
      for (const [key, value] of Object.entries(limitOfAttr)) {
        console.log(`${key}: ${value}`);
        if (canNullKey.includes(key)) {
          // random empty attr
          if (getRandomInt(100) > 70) {
            nft[key] = getRandomInt(value);
          } else {
            nft[key] = null;
          }
        } else {
          nft[key] = getRandomInt(value);
        }
      }
      reload.value += 1;
      if (reload.value > 30) {
        await sleep(100);
      } else {
        await sleep(80);
      }

      if (reload.value < 40) {
        randomNFT();
      } else {
        reload.value = 0;
      }
    }
    nft.body = getRandomInt(10);

    return { data, nft, randomNFT, reload, rarity };
  },
};
</script>

<style lang="scss" scoped>
.mint {
  height: 100vh;
}
.cover {
  background: rgba(0, 0, 0, 0.726);
  height: 100%;
  width: 100%;
  position: relative;
}
.nftImg {
  height: 160 * 1.5px;
  width: 146 * 1.5px;
  position: relative;
  background: rgb(148, 148, 148);
  border-radius: 5px 5px 0px 0px;
  box-sizing: border-box;
  .nftAttr {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
  }
}

.btn {
  margin-top: 5px;
  box-shadow: 2px 2px 0px #da910a;
}
.cardWrapper {
  background: white;
  border-radius: 5px;
  padding: 4px;
}
</style>