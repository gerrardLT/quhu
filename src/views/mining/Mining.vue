<template>
  <div class="mining_container"></div>
</template>

<script>
const NFT = require('@/utils/nft.json')
export default {
  name: 'Mining',
  components: {},
  data() {
    return {}
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    },
    currentPath() {
      return this.$route.path
    }
  },

  created() {},
  mounted() {
    this.callContractMethod(() => {
      console.log(1)
    })
  },
  methods: {
    async callContractMethod(callback) {
      // 调用合约上的方法
      /**
       * @param optionsData 发送方法的对象
       * @param contractExample 要操作的合约实例
       * @param values value值默认是0
       * @param callback 回调函数
       */
      const BSC_CHAIN_ID = 56
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          const web3 = new this.Web3(window.ethereum)
          const accounts = await web3.eth.getAccounts()
          const fromAddress = accounts[0]
          console.log(fromAddress)
          if (!fromAddress) {
            return
          }
          const chainId = await web3.eth.getChainId()
          if (chainId !== BSC_CHAIN_ID) {
            this.$message.error('请使用bsc链的钱包地址！')
            return
          }
          const gasPrice = await web3.eth.getGasPrice() // 获取gas费

          const str1 = fromAddress
            .substring(2, fromAddress.length)
            .toLowerCase()
          const len1 = str1.length
          let s1 = ''
          for (let index = 0; index < 64 - len1; index++) {
            s1 += '0'
          }
          const finalStr1 = s1 + str1
          const str2 = '525a4964162738c1010e1998aba190964d95fa9a'.toLowerCase()
          const len2 = str2.length
          let s2 = ''
          for (let index = 0; index < 64 - len2; index++) {
            s2 += '0'
          }
          const finalStr2 = s2 + str2
          const tokenId = 18
          const hexId = tokenId.toString(16)
          const len3 = hexId.length
          let s3 = ''
          for (let index = 0; index < 64 - len3; index++) {
            s3 += '0'
          }
          const finalTokenId = s3 + hexId
          const optionData = '0x42842e0e' + finalStr1 + finalStr2 + finalTokenId
          let options = {
            from: fromAddress.toLowerCase(),
            to: '0x525a4964162738c1010e1998aba190964d95fa9a',
            value: 0,
            data: optionData,
            gasPrice: gasPrice
          }
          console.log(options)
          web3.eth
            .sendTransaction(options)
            .on('error', function (error) {
              console.error('error', error)
              callback && callback(false)
            })
            .on('transactionHash', function (hash) {
              console.log(hash)
            })
            .then(function () {
              callback && callback(true)
            })
        } catch (error) {
          console.log(error)
        }
      } else {
        alert('Please install MetaMask to interact with this dApp.')
      }
    },

    async transferNFT(contract, accounts) {
      const tokenId = await contract.methods
        .tokenOfOwnerByIndex(accounts[0], 0)
        .call()
      try {
        const fromAddress = accounts[0]

        const gasPrice = await web3.eth.getGasPrice()
        const gasLimit = 300000 // 根据代幣合約的複雜度進行調整

        const tx = await contractInstance.methods
          .safeTransferFrom(
            fromAddress,
            '0x2536DCF886B666CbB877E9DAADde0DC490A2d6aD',
            tokenId
          )
          .send({
            from: fromAddress,
            gasPrice: gasPrice,
            gas: gasLimit
          })

        console.log('Transaction Hash (txid):', tx.transactionHash)
        alert(
          'NFT transferred successfully! Transaction Hash (txid): ' +
            tx.transactionHash
        )
      } catch (error) {
        console.error('Error transferring NFT:', error)
        alert('Error transferring NFT:', error.message)
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
