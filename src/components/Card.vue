<template lang="pug">
.card(ref="card")
  .card-content
    img(src="@/assets/metamask-unscreen.gif", height="100")
    .title {{ desc.data.type }}
    .txt.balance {{ eth }}
    .txt.alert(v-if="!desc.data.metaMaskAddress") {{ errorText }}
    p {{ desc.data.metaMaskAddress }}
</template>

<script lang="ts">
1;
import { onMounted, ref, defineComponent, computed } from "vue";
import { MetaMaskInterface } from "@/interface/base";

export default defineComponent({
  name: "Card",
  props: {
    desc: {
      default: { data: {} as MetaMaskInterface },
    },
    errorText: {
      default: "",
    },
  },
  setup(props) {
    const card = ref<HTMLDivElement | null>(null);
    const eth = computed(() =>
      (props.desc.data.balance / 1000000000000000000).toFixed(4)
    );

    onMounted(() => {
      document.addEventListener("mousemove", function (e) {
        if (card.value != null) {
          let height = card.value.offsetHeight;
          let xAxis = -(window.innerWidth / 2 - e.pageX) / 20;
          let yAxis =
            (card.value.getBoundingClientRect().top + height / 2 - e.pageY) /
            25;
          card.value.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
      });
    });
    return {
      card,
      eth,
    };
  },
});
</script>

<style lang="scss">
body {
  transform-style: preserve-3d;
  perspective: 1000px;
}
.card {
  width: 400px;
  height: 200px;
  position: relative;
  background: #ffffff;
  border-radius: 3px;
  background-position: top center;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 8px;
    border-radius: 50%;
    left: 0;
    bottom: 0px;
    box-shadow: 0 30px 20px rgba(0, 0, 0, 0.3);
  }
}

.card-content {
  transform-style: preserve-3d;
  text-align: center;
  img {
    transform: translateZ(50px);
  }

  .alert {
    font-weight: bold;
    font-size: 0.9rem;
    transform: translateZ(20px);
  }

  .title {
    color: rgb(43, 43, 43);
    font-size: 1rem;
    transform: translateZ(100px);
    font-weight: bolder;
  }
  .balance {
    color: rgb(95, 95, 95);
    font-size: 0.8rem;
    transform: translateZ(90px);
    font-weight: normal;
  }
  p {
    color: rgb(175, 175, 175);
    font-size: 0.3rem;
    transform: translateZ(50px);
  }
}
</style>