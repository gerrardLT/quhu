<template>
  <div class="nft_container">
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
        <span class="item">{{ balanceAmount.usdt }} usdt</span>
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

    <main style="display: none">
      <!-- slider-area -->
      <section id="parallax">
        <div class="">
          <img src="img/slider/main.png" alt="shape" />
        </div>
        <div
          class="slider-shape ss-two layer"
          data-delay=".15s"
          data-depth="0.10"
        >
          <img src="img/slider/main3.png" alt="shape" />
        </div>
        <div class="slider-shape ss-three layer" data-depth="0.40">
          <img src="img/slider/main2.png" alt="shape" />
        </div>

        <div class="slider-active">
          <img src="img/bg/star-small.png" alt="star-small" />
        </div>
      </section>
      <!-- slider-area-end -->
      <!-- big-text-area -->
      <section class="big-text fix" style="display: none">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-12">
              <img src="img/bg/pattern.png" alt="star-small" />
            </div>
          </div>
        </div>
      </section>
      <!-- big-text-area-end -->
      <!-- services-three-area -->
      <section
        id="services"
        style="display: none"
        class="services-area services-bg p-relative fix"
      >
        <div class="container pt-120 pb-90">
          <div class="row">
            <div class="col-lg-6 col-md-12">
              <div
                class="section-title p-relative mb-50 wow fadeInLeft animated"
                data-animation="fadeInLeft"
                data-delay=".4s"
              >
                <h5>
                  <img src="img/bg/star-small.png" alt="star-small" /> How It
                  works
                </h5>
                <h2>How To <span>Mint</span></h2>
              </div>
            </div>
            <div class="col-lg-6 col-md-12 text-right">
              <a href="#contact"
                ><img src="img/bg/up-arrow-icon.png" alt="img"
              /></a>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-3 col-md-6">
              <div
                class="s-single-services mb-30 wow fadeInUp animated"
                data-animation="fadeInUp"
                data-delay=".2s"
              >
                <div class="services-icon mb-30">
                  <img src="img/icon/se-icon1.png" alt="img" />
                </div>
                <div class="second-services-content">
                  <h3>Connect Your <span>Wallet</span></h3>
                  <p>{{ $t('nft.link_your_wallet') }}</p>
                  <div class="star-icon">
                    <img src="img/bg/star-small-2.png" alt="star-small" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div
                class="s-single-services mb-30 wow fadeInUp animated"
                data-animation="fadeInUp"
                data-delay=".4s"
              >
                <div class="services-icon mb-30">
                  <img src="img/icon/se-icon2.png" alt="img" />
                </div>
                <div class="second-services-content">
                  <h3>Select An <span>Quatity</span></h3>
                  <p>{{ $t('nft.choose_pay') }}</p>
                  <div class="star-icon">
                    <img src="img/bg/star-small-2.png" alt="star-small" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div
                class="s-single-services mb-30 wow fadeInUp animated"
                data-animation="fadeInUp"
                data-delay=".6s"
              >
                <div class="services-icon mb-30">
                  <img src="img/icon/se-icon3.png" alt="img" />
                </div>
                <div class="second-services-content">
                  <h3>Confirm <span>Transaction</span></h3>
                  <p>{{ $t('nft.sign_trade') }}</p>
                  <div class="star-icon">
                    <img src="img/bg/star-small-2.png" alt="star-small" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-6">
              <div
                class="s-single-services mb-30 wow fadeInUp animated"
                data-animation="fadeInUp"
                data-delay=".6s"
              >
                <div class="services-icon mb-30">
                  <img src="img/icon/se-icon4.png" alt="img" />
                </div>
                <div class="second-services-content">
                  <h3>Receive Your <span>NFTs</span></h3>
                  <p>{{ $t('nft.get_nft') }}</p>
                  <div class="star-icon">
                    <img src="img/bg/star-small-2.png" alt="star-small" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- services-three-area -->
      <!-- gallery-area -->
      <section id="portfolio" class="portfolio fix" style="display: none">
        <div class="container pt-120 pb-110">
          <div class="portfolio">
            <div class="row align-items-center text-center">
              <div class="col-lg-12 col-md-12">
                <div
                  class="section-title p-relative mb-50 pl-60 wow fadeInLeft animated"
                  data-animation="fadeInLeft"
                  data-delay=".4s"
                >
                  <div class="hireus">
                    <img src="img/bg/hireus-circle.png" alt="hireus-circle" />
                  </div>
                  <h2>
                    We Are Fully Dedicated To Creative <br /><span
                      >Authentic Assets</span
                    >
                  </h2>
                </div>
              </div>
            </div>
            <div class="swiper profile">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in []" :key="item">
                  <figure class="gallery-image">
                    <img
                      :src="item"
                      alt="img"
                      class="img"
                      width="100"
                      height="100"
                    />
                  </figure>
                </div>
              </div>
            </div>
            <!-- <div class="swiper profile">
              <el-carousel :interval="3000" type="card" height="300px" autoplay>
                <el-carousel-item v-for="item in slideImgList" :key="item">
                  <img :src="item" alt="img" />
                </el-carousel-item>
              </el-carousel>
            </div> -->
            <!-- <Slick ref="slick" :options="slickOptions">
              <div v-for="item in slideImgList" :key="item">
                <img :src="item" alt="img" />
              </div>
            </Slick> -->
          </div>
        </div>
      </section>
    </main>
    <div class="inventory_container" v-if="currentPath === '/inventory'">
      <router-view></router-view>
    </div>
    <iframe
      ref="myIframe"
      class="iframe"
      :src="baseUrl.iframeUrl"
      frameborder="0"
      width="100%"
      height="100%"
      v-else
    ></iframe>

    <el-dialog
      title="mint"
      :visible.sync="dialogMintVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <!-- <el-tooltip
        class="item"
        effect="dark"
        :content="text"
        placement="top-start"
        popper-class="tool"
      >
        <i class="el-icon-question"></i>
      </el-tooltip> -->
      <el-select
        v-model="mintCoin"
        :placeholder="$t('nft.chosse_mint')"
        @change="$forceUpdate()"
      >
        <el-option
          v-for="item in mintTypes"
          :key="item.id"
          :label="item.value"
          :value="item.value"
        >
          <span style="float: left">{{ item.value }}</span>
          <span
            style="
              float: right;
              color: #8492a6;
              font-size: 13px;
              margin-left: 10px;
            "
            >{{ item.label }}</span
          >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMintVisible = false">{{
          $t('nft.cancel')
        }}</el-button>
        <el-button type="primary" @click="postMint">{{
          $t('nft.confirm')
        }}</el-button>
      </span>
    </el-dialog>
    <!-- <el-image v-if="dialogImageUrlVisable" v-show="false" ref="elImage" :src="dialogImageUrl" :preview-src-list="[dialogImageUrl]"  fit="contain" >
		</el-image> -->

    <el-image
      ref="elImage"
      style="width: 100px; height: 100px; display: none"
      :src="imgUrl"
      fit="contain"
      :preview-src-list="srcList"
    >
    </el-image>
    <div class="description" v-if="showDes">
      <div>name：&nbsp;{{ description.name }}</div>
      <div>rarity:&nbsp;{{ description.rarity || 'Destruction' }}</div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { mint, get_nft } from '@/api/nft/nft'
import { balance } from '@/api/user/user'
import { Loading } from 'element-ui'
import baseUrl from '@/config/baseUrl'
// import '@/views/nft/css/style.css'
export default {
  name: 'Nft',
  components: {
    // ThreeAnimation,
    // Slick
  },
  data() {
    return {
      baseUrl: baseUrl,
      text: '',
      nftData: {},
      dialogMintVisible: false,
      mintCoin: '',
      imgUrl: '',
      srcList: [],
      mintTypes: [
        // {
        //   id: 0,
        //   value: '1BNB',
        //   label: '100% ' + this.$t('nft.legendary_discount')
        // },
        {
          id: 1,
          value: '3000OFC',
          label: this.$t('nft.rate') + '：60%'
        },
        // {
        //   id: 1,
        //   value: '10POYS+1000OFC',
        //   label: this.$t('nft.rate')+'：60%'
        // },
        {
          id: 2,
          value: '2USDT+100OFC',
          label: this.$t('nft.rate') + '：100%'
        },
        {
          id: 3,
          value: '0.01BNB+100OFC',
          label: this.$t('nft.rate') + '：100%'
        },
        {
          id: 4,
          value: '2USDT+0.01BNB',
          label: this.$t('nft.rate') + '：100%'
        },
        {
          id: 5,
          value: '10POYS+2USDT',
          label: this.$t('nft.rate') + '：100%'
        }
      ],
      sign: '',
      address: '',
      minted: false,
      account: '',
      nonce: '',
      nft_id: [],
      interval: '',
      balanceAmount: {},
      drawer: false,
      direction: 'rtl',
      description: {
        rarity: '',
        id: '',
        name: ''
      },
      showDes: false,
      showMenu: false
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
  },
  mounted() {
    console.log(sessionStorage.getItem('walletAccount'))
    if (sessionStorage.getItem('walletAccount')) {
      this.account = sessionStorage.getItem('walletAccount')
    }
    window.ethereum.on('accountsChanged', this.handleAccountsChanged)
    const iframe = this.$refs.myIframe
    if (iframe) {
      iframe.addEventListener('load', () => {
        iframe.contentWindow.postMessage('ready', '*')
      })
      window.addEventListener('message', (event) => {
        // console.log(event)
        if (event.data === 'mint') {
          this.openMint()
        }
        if (event.data === 'collect') {
          this.openCart()
        }
      })
    }

    // this.$nextTick(() => {
    //   this.$refs.elImage.clickHandler()
    // })
  },
  methods: {
    handleMouseOver() {
      this.showMenu = false
    },
    handleMouseOut() {
      this.showMenu = false
    },
    handleAccountsChanged(accounts) {
      console.log(accounts)
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
    async connectWallet() {
      const self = this
      const web3 = new self.Web3(window.ethereum)
      if (window.ethereum) {
        try {
          // 请求用户授权
          const res = await window.ethereum.enable()
          self.account = res[0]
          sessionStorage.setItem('walletAccount', res[0])
          console.log(res)
        } catch (error) {
          // 用户拒绝授权，或者发生其他错误
          console.error(error)
        }
      } else {
        // MetaMask未安装，或者未在浏览器中启用以太坊提供程序
        console.error(this.$t('nft.metamask_tip'))
        this.$message.error(this.$t('nft.metamask_tip'))
      }
    },
    async openMint() {
      this.dialogMintVisible = true
    },
    async mint() {
      let coin1 = ''
      let coin2 = ''

      switch (this.mintCoin) {
        case '3000OFC':
          coin1 = 'ofc'
          coin2 = ''
          break
        case '1BNB':
          coin1 = 'bnb'
          coin2 = ''
          break
        case '2USDT+100OFC':
          coin1 = 'usdt'
          coin2 = 'ofc'
          break
        case '0.01BNB+100OFC':
          coin1 = 'bnb'
          coin2 = 'ofc'
          break
        case '2USDT+0.01BNB':
          coin1 = 'usdt'
          coin2 = 'bnb'
          break
        case '10POYS+2USDT':
          coin1 = 'poys'
          coin2 = 'usdt'
          break
        default:
          break
      }

      const params = {
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        coins1: coin1,
        coins2: coin2,
        address: this.address,
        sign: this.sign,
        nonce: this.nonce
      }
      const res = await mint(params)
      if (res && res.success === 'ok') {
        this.$message.success(this.$t('nft.mint_success'))
        this.minted = true
        // this.mintCoin = ''
        this.nft_id = res.data.nft_id
        // console.log(this.nft_id)
        this.interval = setInterval(() => {
          this.getNft({ nft_id: [this.nft_id] })
        }, 2000)
      }
      this.mintCoin = ''
      this.dialogMintVisible = false
    },
    async postMint() {
      if (this.mintCoin === '') {
        this.$message.warning(this.$t('nft.choose_mint'))
        return
      }
      await this.getMetaData()
    },
    async getMetaData() {
      const self = this
      if (window.ethereum) {
        if (typeof window.ethereum.isMetaMask === 'undefined') {
          self.$message.error(self.$t('nft.install') + ' MetaMask！')
        } else {
          window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .catch(function (reason) {
              self.$message.error(self.$t('nft.error') + reason.message)
            })
            .then(function (accounts) {
              // console.log('account', accounts)
              const web3 = new self.Web3(
                self.Web3.givenProvider || 'ws://some.local-or-remote.node:8546'
              )
              self.web3 = web3
              self.nonce = Math.floor(Math.random() * 900000 + 100000)
              web3.eth.personal.sign(
                web3.utils.utf8ToHex('mint' + self.nonce),
                accounts[0],
                (err, res) => {
                  if (err) {
                    self.$message.error(self.$t('nft.sign_fail') + err.message)
                  } else {
                    self.sign = res
                    self.address = accounts[0]
                    self.mint()
                  }
                }
              )
            })
        }
      } else {
        self.$message.error(self.$t('nft.install') + ' MetaMask！')
      }
    },
    async getNft(params) {
      const loading = Loading.service({
        text: this.$t('message.loading'),
        spinner: 'el-icon-loading ElementLoading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      const res = await get_nft(params)
      if (res.data && res.data[0].name === 'fail') {
      } else if (res.data && res.data[0].name === '') {
      } else {
        if (loading) {
          loading.close()
        }
        clearInterval(this.interval)
        this.imgUrl = res.data[0].image
        this.srcList = [this.imgUrl]
        this.description.name = res.data[0].name
        this.description.id = res.data[0].nft_id
        res.data[0].attributes.forEach((element) => {
          if (element.trait_type === 'rarity') {
            this.description.rarity = element.value
          }
        })

        this.$nextTick(() => {
          this.$refs.elImage.clickHandler()
          this.showDes = true
        })
        const imageInterval = setInterval(() => {
          if (!document.querySelector('.el-image-viewer__canvas')) {
            this.showDes = false
            clearInterval(imageInterval)
          }
        }, 1000)
        this.getBalance()
      }
    },
    openCart() {
      if (sessionStorage.getItem('walletAccount')) {
        this.$router.push('/inventory').catch((err) => err)
      } else {
        this.connectWallet()
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
        this.balanceAmount = res.data.token_num
      }
    }
  },
  watch: {
    '$i18n.locale': {
      handler(newVal, oldVal) {
        this.mintTypes = [
          // {
          //   id: 0,
          //   value: '1BNB',
          //   label: '100% ' + this.$t('nft.legendary_discount')
          // },
          {
            id: 1,
            value: '3000OFC',
            label: this.$t('nft.rate') + '：60%'
          },
          // {
          //   id: 1,
          //   value: '10POYS+1000OFC',
          //   label: this.$t('nft.rate')+'：60%'
          // },
          {
            id: 2,
            value: '2USDT+100OFC',
            label: this.$t('nft.rate') + '：100%'
          },
          {
            id: 3,
            value: '0.01BNB+100OFC',
            label: this.$t('nft.rate') + '：100%'
          },
          {
            id: 4,
            value: '2USDT+0.01BNB',
            label: this.$t('nft.rate') + '：100%'
          },
          {
            id: 5,
            value: '10POYS+2USDT',
            label: this.$t('nft.rate') + '：100%'
          }
        ]
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-drawer.rtl {
  top: 5%;
  right: 20px;
  height: 90%;
  border-radius: 20px;
}
.description {
  position: fixed;
  position: fixed;
  top: 8%;
  z-index: 9999;
  right: 58%;
  color: #fff;
  div {
    margin-top: 10px;
    font-size: 20px;
  }
}
// ::v-deep .el-image-viewer__canvas {
//   width: 80% !important;
// }
.nft_container {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 20px;
}
::v-deep .el-button--info {
  max-width: 150px;
  background-color: #1f1f2c;
  overflow: hidden;
  text-overflow: ellipsis;
}
::v-deep .el-button--info:hover {
  background-color: #087790;
}
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
.mint {
  position: absolute;
  bottom: 20%;
  left: 50%;
  cursor: pointer;
}
.iframe {
  height: 100vh;
  overflow-y: scroll;
}

.iframe::-webkit-scrollbar {
  display: none;
}

.iframe::-webkit-scrollbar {
  width: 0 !important;
}
/*IE 10+*/
.iframe {
  -ms-overflow-style: none;
}
/*Firefox*/
.iframe {
  overflow: -moz-scrollbars-none;
}
</style>
