/* eslint-disable @typescript-eslint/no-var-requires */

<template lang="pug">
.mint.column.flexCenter
  .cardWrapper
    .nftImg(ref="imgRef", :style="{ background: `${bgColor}` }")
      .nftAttr(v-for="(value, index) in Object.entries(nft)", :id="value[0]")
        img(
          v-if="value[1] != null",
          :src="require(`@/assets/nfts/${value[0] == 'special1' ? 'special' : value[0]}/${value[1]}.png`)"
        )
      .cover.flexCenter(v-if="reload != 0")
        .txt(v-if="reload != 0 && reload % 2 == 0") 抽出NFT..
        .txt(v-if="reload != 0 && reload % 2 != 0") 抽出NFT.
    .btn(style="height: 20px", @click="randomNFT") Again
  .txt(v-if="reload == 0", style="font-size: 2rem; margin: 5px") Done
  .txt(v-else="reload == 0", style="font-size: 2rem; margin: 5px") 抽獎中
  .txt(v-if="reload == 0 && !firstTry") 稀有度 {{ rarity }} %
  .btn(
    v-if="reload == 0 && !firstTry",
    @click="htmlToPng",
    style="width: 100px"
  ) 下載圖片
</template>

<script lang="ts">
import { ref, reactive, onBeforeMount, computed, onMounted } from "vue";
import { toPng } from "html-to-image";
import { sound } from "@pixi/sound";
import JSConfetti from "js-confetti";

interface nftData {
  body: number;
  clothe: number;
  eye: number;
  glasses: number;
  hair: number;
  special: number;
  special1: number;
  mouse: number;
}

export default {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const imgRef = ref<HTMLElement>();
    var reload = ref<number>(0);
    const limitOfAttr = {
      body: 9,
      clothe: 19,
      eye: 12,
      glasses: 4, //can null
      hair: 12, //can null
      mouse: 8,
      special: 14,
    };
    var nft = reactive<nftData>({
      body: null as never,
      clothe: null as never,
      eye: null as never,
      special: null as never,
      special1: null as never,
      glasses: null as never,
      hair: null as never,
      mouse: null as never,
    });
    var bgColor = ref("");
    const firstTry = computed(() => {
      return nft.body == null;
    });
    const rarity = computed(() => {
      var rarity = 0;
      if (nft.glasses && nft.hair && nft.special && nft.special1) {
        return 100;
      }
      if (nft.hair != null) {
        rarity += 21;
      }
      if (nft.glasses != null) {
        rarity += 21;
      }
      if (nft.special != null) {
        rarity += 20;
      }
      if (nft.special1 != null) {
        rarity += 30;
      }
      return rarity;
    });

    sound.add("click", `${require("@/assets/sound/click.mp3")}`);
    sound.add("confiti", `${require("@/assets/sound/confiti.mp3")}`);
    sound.add("waiting", `${require("@/assets/sound/waiting.wav")}`);
    sound.add("bird", `${require("@/assets/sound/bird.mp3")}`);

    const jsConfetti = new JSConfetti();

    onBeforeMount(() => {
      // randomNFT();
      for (var [key, value] of Object.entries(limitOfAttr)) {
        const image = new Image();
        for (var i = 0; i < value; i++) {
          image.src = `${require(`@/assets/nfts/${key}/${i}.png`)}`;
        }
      }
    });

    onMounted(() => {
      console.log(imgRef.value); // <div>This is a root element</div>
    });

    function download(uri, name) {
      const link = document.createElement("a");
      link.href = uri;
      link.download = name;
      link.click();
      // eslint-disable-next-line no-delete-var
    }

    function htmlToPng() {
      if (imgRef.value != null) {
        console.log(imgRef.value);
        toPng(imgRef.value)
          .then(function (dataUrl) {
            download(dataUrl, "my-node.png");
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
          });
      }
    }

    function playConfiti() {
      sound.play("confiti");
    }

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
      const randomTimes = 20;
      const colors = [
        "orange",
        "DarkGrey",
        "CornflowerBlue",
        "DarkViolet",
        "Green",
        "Turquoise",
        "YellowGreen",
      ];
      if (reload.value == 0) {
        sound.play("bird");
      }

      console.log("Taking a break...");

      let canNullKey = ["glasses", "hair", "special", "special1"];
      for (const [key, value] of Object.entries(limitOfAttr)) {
        if (canNullKey.includes(key)) {
          // random empty attr
          if (getRandomInt(100) > 70) {
            nft[key] = getRandomInt(value);
            if (getRandomInt(100) > 70 && key == "special") {
              nft["special1"] = getRandomInt(value);
            } else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              nft["special1"] = null as any;
            }
          } else {
            nft[key] = null;
          }
        } else {
          nft[key] = getRandomInt(value);
        }
      }
      bgColor.value = colors[getRandomInt(colors.length)];
      reload.value += 1;

      if (reload.value > randomTimes - 5) {
        await sleep(30);
      } else if (reload.value > randomTimes - 15) {
        await sleep(70);
      } else {
        await sleep(120);
      }

      if (reload.value == randomTimes) {
        reload.value = 0;
        sound.stop("bird");
        jsConfetti.addConfetti();

        playConfiti();
        return;
      }

      randomNFT();
    }
    return {
      nft,
      randomNFT,
      reload,
      rarity,
      imgRef,
      htmlToPng,
      firstTry,
      bgColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.mint {
  height: 100vh;
  overflow: hidden;
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