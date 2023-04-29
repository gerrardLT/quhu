<template>
  <div class="container">
    <div class="relative w-screen h-screen">
      <div class="absolute w-screen flex-center opacity-0">
        <img
          src="../../assets/nft-default.jpg"
          class="w-60 cursor-pointer img"
          alt=""
          crossorigin="anonymous"
        />
      </div>
      <div @click="openMint" class="mint_btn">mint</div>
      <div class="particle-explode w-full h-full bg"></div>
    </div>
    <el-dialog
      title="mint"
      :visible.sync="dialogMintVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-select
        v-model="mintCoin"
        placeholder="请选择mint方式"
        @change="$forceUpdate()"
      >
        <el-option
          v-for="item in mintTypes"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMintVisible = false">取 消</el-button>
        <el-button type="primary" @click="postMint">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { start, ParticleExplode } from './demo'
import { mint, get_nft } from '@/api/nft/nft'
import { getToken } from '@/utils/auth'
import { ABI } from '@/utils/abi'
export default {
  name: 'ThreeAnimation',
  data() {
    return {
      nftData: {},
      dialogMintVisible: false,
      mintCoin: '',
      mintTypes: [
        {
          id: 0,
          name: '3000OFC'
        },
        {
          id: 1,
          name: '10POYS+1000OFC'
        },
        {
          id: 2,
          name: '2BUSD+100OFC'
        },
        {
          id: 3,
          name: '0.01BNB+100OFC'
        },
        {
          id: 4,
          name: '2BUSD+0.01BNB'
        },
        {
          id: 5,
          name: '10POYS+2BUSD'
        }
      ],
      sign: '',
      address: '',
      minted: false,
      account: '',
      nonce: '',
      nft_id: [],
      interval: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      start()
    })

    // this.getNft({ nft_id: [18] })
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    }
  },
  methods: {
    async openMint() {
      this.dialogMintVisible = true
      const el = document.querySelector('.img')
      el.click()
      //   console.log(el)
    },
    async mint() {
      let coin1 = ''
      let coin2 = ''

      switch (this.mintCoin) {
        case '3000OFC':
          coin1 = 'ofc'
          coin2 = ''
          break
        case '10POYS+1000OFC':
          coin1 = 'poys'
          coin2 = 'ofc'
          break
        case '2BUSD+100OFC':
          coin1 = 'busd'
          coin2 = 'ofc'
          break
        case '0.01BNB+100OFC':
          coin1 = 'bnb'
          coin2 = 'ofc'
          break
        case '2BUSD+0.01BNB':
          coin1 = 'busd'
          coin2 = 'bnb'
          break
        case '10POYS+2BUSD':
          coin1 = 'poys'
          coin2 = 'busd'
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
        this.$message.success('mint成功！')
        this.minted = true
        this.mintCoin = ''
        this.nft_id = res.nft_id
        // console.log(this.nft_id)
        this.interval = setInterval(() => {
          this.getNft({ nft_id: [this.nft_id] })
        }, 2000)
      }
      this.dialogMintVisible = false
    },
    async postMint() {
      if (this.mintCoin === '') {
        this.$message.warning('请选择mint方式！')
        return
      }
      await this.getMetaData()
    },
    async getMetaData() {
      const self = this
      if (window.ethereum) {
        if (typeof window.ethereum.isMetaMask === 'undefined') {
          self.$message.error('请安装 MetaMask！')
        } else {
          window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .catch(function (reason) {
              self.$message.error('出错了！' + reason.message)
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
                    self.$message.error('签名失败，因为' + err.message)
                  } else {
                    console.log('签名后的数据：', res)
                    self.sign = res
                    self.address = accounts[0]
                    self.mint()
                  }
                }
              )
            })
        }
      } else {
        self.$message.error('请安装 MetaMask！')
      }
    },
    async getNft(params) {
      const res = await get_nft(params)
      if (res.name === 'fail') {
      } else if (res.name === '') {
      } else {
        clearInterval(this.interval)
        // 展示nft图片
        // res.image
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  //   align-items: center;
  min-height: 100vh;
  margin: 0;
  //   background: #f7f7fd;
}
.mint_btn {
  position: absolute;
  width: 50px;
  height: 50px;
  top: 650px;
  cursor: pointer;
}
.h-screen {
  height: 100vh;
}
.w-screen {
  width: 100vw;
}
.relative {
  position: relative;
  display: flex;
  justify-content: center;
  //   align-items: center;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.opacity-0 {
  opacity: 0;
}
.h-screen {
  height: 100vh;
}
.w-screen {
  width: 100vw;
}
.absolute {
  position: absolute !important;
  bottom: 100px;
}
.cursor-pointer {
  cursor: pointer;
}
.w-60 {
  width: 15rem !important;
  border-radius: 10px;
}
.particle-explode {
  width: 100% !important;
  height: 100% !important;
}
.bg {
  //   background: #000;
  background-image: url('../../assets/bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.h-full {
  height: 100%;
}
.w-full {
  width: 100%;
}
.img {
}
</style>
