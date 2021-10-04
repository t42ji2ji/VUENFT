<template lang="pug">
.home.column.flexCenter
  Card(:desc="metaMaskData", :errorText="errorText")
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, ref } from "vue";
import { MetaMaskInterface } from "@/interface/base";
import VueMetamask from "vue-metamask";
import Card from "@/components/Card.vue";
import mixins from "@/mixins/webMixins";
import Web3 from "web3";
import ABI from "@/assets/nftABI/abi";
import { getNfts } from "@/api/ethScanApi";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    web3: any;
  }
}
export default defineComponent({
  name: "Home",
  components: {
    VueMetamask,
    Card,
  },
  setup() {
    const { errorText } = mixins();
    const metaMaskData = reactive({
      data: {
        message: "",
        metaMaskAddress: "",
        netID: "",
        type: "",
        balance: 0,
      } as MetaMaskInterface,
    });

    const timeControll = reactive({
      Web3Interval: setInterval(() => {
        // var x = 0;
      }, 0),
      AccountInterval: setInterval(() => {
        // var x = 0;
      }, 0),
      NetworkInterval: setInterval(() => {
        // var x = 0;
      }, 0),
    });
    function checkAccounts(web3) {
      if (web3.value === null) {
        return;
      }
      web3.value?.eth.getAccounts((err, accounts) => {
        if (err != null) errorText.value = "metamask network error";
        if (accounts.length === 0) {
          errorText.value = "no metamask account";
        } else {
          metaMaskData.data.metaMaskAddress = accounts[0];
          web3.value?.eth.getBalance(accounts[0], (err, balance) => {
            metaMaskData.data.balance = balance;
          });
        }
      });
    }
    function checkNetWork(web3) {
      if (web3.value === null) {
        return;
      }
      web3.value.eth.net.getId((err, netID) => {
        // Main Network: 1
        // Ropsten Test Network: 3
        // Kovan Test Network: 42
        // Rinkeby Test Network: 4
        // if (err != null) console.log("no account");
        metaMaskData.data.netID = netID; //User MetaMask's current status
        if (netID === 1) metaMaskData.data.type = "MAINNET";
        if (netID === 3) metaMaskData.data.type = "ROPSTEN";
        if (netID === 42) metaMaskData.data.type = "LOVAN";
        if (netID === 4) metaMaskData.data.type = "RINKEBY";
      });
    }
    async function getBalanceOfContract(web3) {
      const minABI = ABI();
      const contractAddress = "0xbe529277d878da341e015399d7fa403a0176ae0c";
      const walletAddress = "0x899bd466d50e861351fb1faa303cab08bdb03725";
      const contract = new web3.value.eth.Contract(minABI, contractAddress);
      const result = await contract.methods.balanceOf(walletAddress).call();
      const ownerOf = await contract.methods.ownerOf(2).call();
      const owner = await contract.methods.owner().call();
      const symbol = await contract.methods.symbol().call();
      const view = await contract.methods.name().call();
      const format = web3.value.utils.fromWei(result);
      console.log("format", format);
      console.log("ownerOf", ownerOf);
      console.log("owner", owner);
      console.log("symbol", symbol);
      console.log("view", view);
    }
    function web3TimerCheck(web3) {
      web3.value = web3;

      console.log(web3.value);
      web3.value.eth
        .getTransactionReceipt(
          "0x10a03e6edd30069d4b586e64d4db56ba1d0bd2dc4dae2f2dec332ea20e07da53"
        )
        .then(console.log);
      getBalanceOfContract(web3.value);
      checkAccounts(web3.value);
      checkNetWork(web3.value);
      timeControll.Web3Interval = setInterval(() => checkWeb3(), 1000);
      timeControll.AccountInterval = setInterval(
        () => checkAccounts(web3.value),
        1000
      );
      timeControll.NetworkInterval = setInterval(
        () => checkNetWork(web3.value),
        1000
      );
    }
    function checkWeb3() {
      if (window.web3) {
        return true;
      }
      return false;
    }
    onMounted(async () => {
      var res = await getNfts({});
      if (!checkWeb3()) {
        errorText.value = "MetaMask not install";
      } else {
        window.web3 = new Web3(window.web3.currentProvider);
        try {
          await window.ethereum.enable();
          web3TimerCheck(window.web3);
        } catch (error) {
          errorText.value = "MetaMask Access Denied";
        }
      }
    });
    return { metaMaskData, errorText };
  },
});
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
}
</style>
