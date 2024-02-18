<template>
  <div class="add_network_container">
    <div class="card_container">
        <el-card class="box-card">
  <div v-for="item in networkList" :key="item.chainId" class="text item">

  </div>
</el-card>
    </div>
  </div>
</template>

<script>
import connectWallet from '@/utils/connectwallet'

export default {
  name: 'AddChainNetwork',
  components: {},
  data () {
    return {
        networkList:[
            {
                chainName:'Only Network Mainnet',
                rpcUrls:['https://api.onlyfun.city'],
                chainId:'12345',
                nativeCurrency: {
          name: 'ONLY',
          symbol: 'ONLY', // 2-6 characters long
          decimals: 18,
        },
        explorers:['https://app.onlyfun.city']
            }
        ],
        account:''
    }
  },
  created () {},
  mounted () {},
  methods: {
    async addToNetwork({ address, chain, rpc }) {
  try {
    if (window.ethereum) {
      if (!address) {
      const account =   await connectWallet();
      if(account){
            sessionStorage.setItem('walletAccount',account)
        }
      }

      const rpcUrls = rpc ? [rpc] : chain.rpc.map((r) => r?.url ?? r)

      const params = {
        chainId: toHex(chain.chainId), // A 0x-prefixed hexadecimal string
        chainName: llamaNodesRpcByUrl[rpcUrls[0]]?.name || chain.name,
        nativeCurrency: {
          name: chain.nativeCurrency.name,
          symbol: chain.nativeCurrency.symbol, // 2-6 characters long
          decimals: chain.nativeCurrency.decimals,
        },
        rpcUrls,
        blockExplorerUrls: [
          chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url
            ? chain.explorers[0].url
            : chain.infoURL,
        ],
      };

      const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params, address],
      });

      // the 'wallet_addEthereumChain' method returns null if the request was successful
      if (result === null && CHAINS_MONITOR.includes(chain.chainId)) {
        if (rpc && rpc.includes("llamarpc")) {
          Fathom.trackGoal(FATHOM_DROPDOWN_EVENTS_ID[chain.chainId], 0);
        } else if (!rpc && chain.rpc?.length > 0 && chain.rpc[0].url.includes("llamarpc")) {
            Fathom.trackGoal(FATHOM_EVENTS_ID[chain.chainId], 0);
        } else {
          Fathom.trackGoal(FATHOM_NO_EVENTS_ID[chain.chainId], 0);
        }
      }

      return result;
    } else {
      throw new Error("No Ethereum Wallet");
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
  },
  watch: {}
  };
</script>
<style lang="scss" scoped>
</style>
