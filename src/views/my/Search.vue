<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-27 04:17:54
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-29 15:00:26
 * @FilePath: \quhu\src\views\my\Integral.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="search_container">
    <div class="reward">
      <div class="reward_img_container">
        <img class="reward_img" src="../../assets/reward.jpeg" alt="" />
      </div>
    </div>
    <div class="search">
      <el-input
        class="search_input"
        :placeholder="$t('search.input_placeholder')"
        v-model="searchAddress"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchReward"
        ></el-button>
      </el-input>
    </div>
    <div v-show="showText" class="search_result">
      {{ $t('search.reward_text') }} {{ value }} ofc
    </div>
    <div class="claim" v-show="value === 0 || value">
      <el-button @click="handleClaim" round plain size="medium"
        >Claim</el-button
      >
    </div>
  </div>
</template>

<script>
import { airdrop, claim } from '@/api/user/user'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      searchAddress: '',
      value: '',
      showText: false
    }
  },
  created() {},
  mounted() {},
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    }
  },
  methods: {
    async searchReward() {
      const res = await airdrop({ address: this.searchAddress })
      if (res && res.success === 'ok') {
        this.value = res.data.value
        this.$message.success(this.$t('search.search_tip'))
        this.showText = true
      }
    },
    async handleClaim() {
      const self = this
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'eth_requestAccounts'
          })

          const web3 = new this.Web3(window.ethereum)
          const accounts = await web3.eth.getAccounts()
          let nonce = Math.floor(Math.random() * 900000 + 100000)
          web3.eth.personal.sign(
            web3.utils.utf8ToHex('claim' + nonce),
            accounts[0],
            async (err, res) => {
              if (err) {
                self.$message.error(
                  self.$t('inventory.sign_fail') + err.message
                )
              } else {
                const resData = await claim({
                  id:
                    self.loginType === 'eth'
                      ? self.userInfo.eth_account
                      : self.userInfo.user,
                  token: getToken(),
                  address: self.searchAddress,
                  sign: res,
                  nonce: nonce
                })
                if (resData && resData.success === 'ok') {
                  self.$message.success(this.$t('search.success_tip'))
                  self.showText = false
                  self.searchAddress = ''
                  self.value = ''
                }
              }
            }
          )
        } catch (error) {
          console.log(error)
        }
      } else {
        alert('Please install MetaMask to interact with this dApp.')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.search_container {
  .reward {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    .reward_img_container {
      //   border-radius: 50%;
      //   background-color: #fff;
      //   width: 200px;
      //   height: 200px;
      .reward_img {
        width: 150px;
        height: 150px;
      }
    }
  }
  .search {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .search_input {
      width: 50%;
    }
  }
  .search_result {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    color: firebrick;
  }
  .claim {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
