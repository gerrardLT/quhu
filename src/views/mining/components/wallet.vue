<template>
  <div class="wallet">
    <div class="top" style="margin-right: 10px; margin-bottom: 20px">
      <div class="balance">
        <svg
          :style="{
            fill: '#087790',
            width: '30px',
            height: '30px',
            marginRight: '15px'
          }"
        >
          <use :xlink:href="'#icon-pay'" rel="external nofollow" />
        </svg>
        <span class="item">{{ balanceAmount.ofc }} ofc</span>
        <el-divider direction="vertical"></el-divider>
        <span class="item">{{ balanceAmount.poys }} poys</span>
        <el-divider direction="vertical"></el-divider>
        <span class="item">{{ balanceAmount.busd }} busd</span>
        <el-divider direction="vertical"></el-divider>
        <span class="item">{{ balanceAmount.bnb }} bnb</span>
      </div>
      <div class="connect">
        <el-button
          type="info"
          round
          @click="connectWallet"
          @mouseover.native="handleMouseOver"
          class="connect_btn"
          >{{
            (account
              ? account.slice(0, 4) +
                '...' +
                account.slice(account.length - 4, account.length)
              : '') || $t('nft.link_wallet')
          }}</el-button
        >
        <div
          class="logMenu"
          v-show="showMenu"
          @mouseover="handleMouseOver"
          @mouseout="handleMouseOut"
        >
          <span @click="logOut">log out</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { balance } from '@/api/user/user'
import { getToken } from '@/utils/auth'
export default {
  name: 'Wallet',
  props: {
    balanceAmount: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showMenu: false,
      account: ''
    }
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
  created() {
    this.getBalance()
    this.$EventBus.$on('connect', () => {
      this.connectWallet()
    })
  },
  mounted() {
    if (sessionStorage.getItem('walletAccount')) {
      this.account = sessionStorage.getItem('walletAccount')
    }
    window.ethereum.on('accountsChanged', this.handleAccountsChanged)
  },
  methods: {
    handleMouseOver() {
      this.showMenu = false
    },
    handleMouseOut() {
      this.showMenu = false
    },
    async logOut() {
      const web3 = new this.Web3(window.ethereum)

      if (window.ethereum) {
        // 调用ethereum.send()方法让用户从MetaMask中退出
        ethereum.send(
          {
            method: 'wallet_requestPermissions',
            params: [
              {
                eth_accounts: null
              }
            ]
          },
          (v) => {
            console.log(v)
          }
        )
      } else {
        console.error(this.$t('nft.metamask_tip'))
      }
    },
    handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts.
        console.log('Please connect to MetaMask.')
        this.account = ''
        sessionStorage.removeItem('walletAccount')
      } else if (accounts[0] !== this.account) {
        // Reload your interface with accounts[0].
        this.account = accounts[0]
        sessionStorage.setItem('walletAccount', accounts[0])
      }
    },
    async getBalance() {
      const res = await balance({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken()
      })
      if (res && res.success === 'ok') {
        this.$emit('changeBalance', res.data.token_num)
        // this.balanceAmount = res.data.token_num
      }
    },
    async connectWallet() {
      const self = this
      const web3 = new self.Web3(window.ethereum)
      if (window.ethereum) {
        try {
          // 请求用户授权
          const res = await window.ethereum.enable()
          self.account = res[0]
          sessionStorage.setItem('walletAccount', res[0])
        } catch (error) {
          // 用户拒绝授权，或者发生其他错误
          console.error(error)
        }
      } else {
        // MetaMask未安装，或者未在浏览器中启用以太坊提供程序
        this.$message.error(this.$t('nft.metamask_tip'))
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-button--info {
  max-width: 150px;
  background-color: #1f1f2c;
  overflow: hidden;
  text-overflow: ellipsis;
}
::v-deep .el-button--info:hover {
  background-color: $mainColor;
}
.wallet {
  position: absolute;
  width: 100%;
  padding-top: 20px;
  .top {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 20px;
    .connect {
      margin-left: 20px;
      margin-right: 20px;
      position: relative;
      .connect_btn {
      }
      .logMenu {
        width: calc(100% - 20px);
        background-color: #1f1f2c;
        color: #fff;
        border-radius: 10px;
        position: absolute;
        margin-top: 5px;
        text-align: center;
        height: 30px;
        padding: 10px;
        span {
          display: inline-block;
          cursor: pointer;
          width: 90%;
          height: 30px;
          line-height: 30px;
        }
        span:hover {
          background-color: #087790;
          border-radius: 10px;
          color: #000;
        }
      }
    }
    .balance {
      height: 100%;
      line-height: 50px;
      display: flex;
      align-items: center;
      // min-width: 400px;
      border-radius: 20px;
      border: 1px solid #e4e4e4;
      padding: 0 10px;
      .item {
        min-width: 60px;
      }
    }

    .cart {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      cursor: pointer;
      // border: 1px solid #e4e4e4;
    }
  }
}
</style>
