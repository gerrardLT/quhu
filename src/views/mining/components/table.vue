<template>
  <div class="mining_table">
    <div class="content">
      <div class="css-15owl46">
        <div class="table-header css-1q45dso">
          <div class="css-cyitba">
            <div data-bn-type="text" class="css-1auchy2">#</div>
          </div>
          <div class="css-cyitbb">
            <div data-bn-type="text" class="css-1auchy2">
              {{ $t('mining.pool_name') }}
            </div>
          </div>

          <div class="css-1sfh4s1">
            <div class="css-10nf7hq">
              <div data-bn-type="text" class="css-1auchy2">
                {{ $t('mining.rate') }}
              </div>
            </div>
          </div>
          <div class="css-1sfh4s1" v-if="activePool === $t('mining.usdt')">
            <div class="css-10nf7hq">
              <div data-bn-type="text" class="css-1auchy2">
                {{ $t('mining.deadline') }}
              </div>
            </div>
          </div>
          <div class="css-ji2mk7">
            <div class="css-1f9551p">
              <div data-bn-type="text" class="css-1auchy2">
                {{ $t('mining.transaction') }}
              </div>
            </div>
          </div>
          <div class="css-12m5e3x"></div>
        </div>
        <div
          class="table-body css-ltu2j2"
          v-for="(item, index) in list"
          :key="item.id"
        >
          <div class="css-1jjjm6k">
            <div data-bn-type="text" class="css-1bjebg1">{{ index + 1 }}</div>
          </div>
          <div class="css-1jjjm6q">
            <div data-bn-type="text" class="css-1bjebg1">
              {{ item.pool }}
            </div>
          </div>

          <div class="css-1h8wmxp">
            <div class="css-whuilf">
              <div class="css-u5tz8w">
                <div class="css-1763n9c">
                  <div
                    data-bn-type="text"
                    style="white-space: nowrap"
                    class="css-1ds83c4"
                  >
                    {{ item.APR }}
                  </div>
                </div>
              </div>
              <div class="css-1gg6y75"></div>
            </div>
          </div>
          <div class="css-1h8wmxp" v-if="activePool === $t('mining.usdt')">
            <div class="css-whuilf">
              <div class="css-u5tz8w">
                <div class="css-1763n9c">
                  <div
                    data-bn-type="text"
                    style="white-space: nowrap"
                    class="css-1ds83c4"
                  >
                    {{ item.cycle }}
                  </div>
                </div>
              </div>
              <div class="css-1gg6y75"></div>
            </div>
          </div>
          <div class="css-1erc1g7">
            <div data-bn-type="text" class="css-12nuixs">
              {{ item.transaction }}
            </div>
          </div>
          <div class="css-xw1pzc">
            <div class="css-uzkiu2">
              <el-button type="primary" @click="openStakeDialog(item)">{{
                activePool === $t('mining.nft')
                  ? $t('mining.stake')
                  : $t('mining.deposit')
              }}</el-button>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        :title="
          activePool === $t('mining.nft')
            ? $t('mining.stake')
            : $t('mining.mining')
        "
        :visible.sync="stakeVisible"
        :modal-append-to-body="false"
        width="50%"
        :before-close="handleStakeClose"
        :destroy-on-close="true"
        :fullscreen="false"
      >
        <div
          class="stake_dialog"
          v-loading="dialogLoading"
          :element-loading-text="$t('mining.loading_text')"
        >
          <div class="left_container">
            <!-- <div class="value common">
              <div style="margin-bottom: 5px">{{ $t('mining.value') }}：</div>
              <div class="text-color fs14">{{ currentPool.value }}</div>
            </div> -->
            <div
              class="mint_total common"
              v-if="
                currentPool.mint_total &&
                currentPool.pool &&
                currentPool.pool.indexOf('ofc_') !== -1
              "
            >
              <div style="margin-bottom: 5px">
                {{ $t('mining.mint_total') }}：
              </div>
              <div class="text-color fs14">
                {{ formatNumberToWestern(currentPool.mint_total) }}
              </div>
            </div>
            <div
              class="now_mint common"
              v-if="
                currentPool.now_mint &&
                currentPool.pool &&
                currentPool.pool.indexOf('ofc_') !== -1
              "
            >
              <div style="margin-bottom: 5px">
                {{ $t('mining.now_mint') }}：
              </div>
              <div class="text-color fs14">
                {{ formatNumberToWestern(currentPool.now) }}
              </div>
            </div>
            <div class="value common" v-if="activePool === $t('mining.nft')">
              <div style="margin-bottom: 5px">
                {{ $t('mining.available_limit')
                }}{{
                  currentPool.pool && currentPool.pool.indexOf('ofc_') !== -1
                    ? '（ofc）'
                    : '（usdt）'
                }}：
              </div>
              <div class="text-color fs14">
                {{ formatNumberToWestern(currentPool.total) }}
              </div>
            </div>
            <div
              class="total common"
              v-if="currentPool.total && activePool === $t('mining.usdt')"
            >
              <div style="margin-bottom: 5px">{{ $t('mining.total') }}：</div>
              <div class="text-color fs14">{{ currentPool.total }}</div>
            </div>
            <div class="total_limit common" v-if="currentPool.total_limit">
              <div style="margin-bottom: 5px">
                {{ $t('mining.total_limit') }}：
              </div>
              <div class="text-color fs14">{{ currentPool.total_limit }}</div>
            </div>

            <div class="per_value common" v-if="currentPool.price">
              <div style="margin-bottom: 5px">{{ $t('mining.price') }}：</div>
              <div class="text-color fs14">{{ currentPool.price }}</div>
            </div>

            <div class="deadline common">
              <div style="margin-bottom: 5px">
                {{
                  activePool === $t('mining.nft')
                    ? $t('mining.quantity')
                    : $t('mining.current_quantity')
                }}：
              </div>
              <div class="text-color fs14">{{ currentPool.quantity }}</div>
            </div>
            <div class="bonus_time common" v-if="currentPool.bonus_time">
              <div style="margin-bottom: 5px">
                {{ $t('mining.bonus_time') }}：
              </div>
              <div class="text-color fs14">
                {{
                  typeof currentPool.bonus_time === 'string'
                    ? $t('mining.every_month') + currentPool.bonus_time
                    : transformTime(currentPool.bonus_time)
                }}
              </div>
            </div>
            <div class="end_time common" v-if="currentPool.start_time">
              <div style="margin-bottom: 5px">
                {{ $t('mining.start_time') }}：
              </div>
              <div class="text-color fs14">
                {{
                  currentPool.start_time === 0
                    ? this.$t('mining.no_term')
                    : transformTime(currentPool.start_time)
                }}
              </div>
            </div>
            <div class="end_time common" v-if="currentPool.end_time">
              <div style="margin-bottom: 5px">
                {{ $t('mining.end_time') }}：
              </div>
              <div class="text-color fs14">
                {{
                  currentPool.end_time === 0
                    ? this.$t('mining.no_term')
                    : transformTime(currentPool.end_time)
                }}
              </div>
            </div>
            <div class="deadline common" v-if="currentPool.transaction">
              <div style="margin-bottom: 5px">
                {{ $t('mining.transaction') }}：
              </div>
              <div class="text-color fs14">{{ currentPool.transaction }}</div>
            </div>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="right_container">
            <div>
              <!-- {{ $t('mining.dividend_policy') }}：
          <br />
          <br /> -->
              <div
                class="select_amount"
                v-if="activePool === $t('mining.usdt')"
              >
                <span style="display: inline-block; margin-bottom: 5px"
                  >{{ $t('mining.purchase_amount') }} ：</span
                >
                <el-input
                  v-model="amount"
                  :placeholder="this.$t('mining.input_number_tip')"
                ></el-input>
                <div
                  style="
                    width: 100%;
                    text-align: right;
                    margin-top: 10px;
                    color: rgb(112, 122, 138);
                    font-size: 12px;
                  "
                >
                  {{ $t('mining.need_fees') }}：{{
                    currentPool.transaction &&
                    Number(currentPool.transaction.split(' ')[0]) *
                      Number(amount) +
                      ' ' +
                      currentPool.transaction.split(' ')[1]
                  }}
                </div>
              </div>
              <br />
              <div style="color: rgb(112, 122, 138); margin-bottom: 5px">
                {{ $t('mining.estimated_annualized') }} ：<span
                  style="color: #087790"
                  >{{ currentPool.APR }}</span
                >
              </div>
              <br />
              <div
                style="color: rgb(112, 122, 138); margin-bottom: 5px"
                v-if="currentPool.Average_APR"
              >
                {{ $t('mining.Average_APR') }} ：<span style="color: #087790">{{
                  currentPool.Average_APR
                }}</span>
              </div>
              <br />
              <div
                class="css-b3pq5h"
                v-if="activePool === $t('mining.usdt') && currentPool.pool"
              >
                <div class="css-rtmgzp">
                  <div class="css-10nf7hq">
                    <div data-bn-type="text" class="css-q9r0e3">
                      {{ $t('mining.isRenew') }}：
                    </div>
                  </div>
                </div>
                <el-switch
                  v-model="renewal"
                  active-color="#13ce66"
                  inactive-color="#dcdfe6"
                >
                </el-switch>
              </div>
              <!-- <div class="description">
            {{ currentPool.description }}
          </div> -->

              <div
                class="nftList common"
                style="margin-top: 50px"
                v-if="currentPool.nftList && currentPool.nftList.length > 0"
              >
                <div style="margin-bottom: 5px">
                  {{ $t('mining.nft_list') }}：
                </div>
                <div class="text-color fs14 list_items">
                  <div
                    :class="{
                      list_item: true,
                      choosed_nft: choosedNftId === item.nft_id
                    }"
                    v-for="item in currentPool.nftList"
                    :key="item.nft_id"
                    @click="chooseNft(item)"
                  >
                    <img :src="item.image" alt="" />
                  </div>
                </div>
                <div style="margin-top: 20px">
                  {{ $t('mining.currently_selected') }} &nbsp;<span
                    style="color: crimson"
                    >{{ choosedNft.name }} </span
                  >&nbsp;<span v-if="choosedNft.value"
                    >{{ $t('mining.nominal_value') }}：{{
                      choosedNft.value
                    }}</span
                  >
                </div>
              </div>
            </div>
            <div class="mining_tips">
              {{ $t('mining.withdrawal_tip1')
              }}{{ transformTime(currentPool.time_on)
              }}{{ $t('mining.withdrawal_tip2') }}
            </div>
          </div>
        </div>

        <span
          slot="footer"
          class="dialog-footer"
          v-if="activePool === $t('mining.nft')"
        >
          <el-button v-if="choosedNftId" type="primary" @click="stake">
            {{ $t('mining.confirm_stake') }}</el-button
          >
          <el-button v-else type="info" plain disabled>
            {{ $t('mining.confirm_stake') }}</el-button
          >
        </span>
        <span slot="footer" class="dialog-footer" v-else>
          <el-button type="primary" @click="purchase">
            {{ $t('mining.deposit') }}</el-button
          >
          <!-- <el-button v-else type="info" plain disabled>
            {{ $t('mining.purchase') }}</el-button
          > -->
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { nft_lock, dual_lock } from '@/api/mining/mining'
import { get_nft } from '@/api/nft/nft'
import { getToken } from '@/utils/auth'
import { transformTime } from '@/utils/tool'
const NFT = require('@/utils/nft.json')
export default {
  props: {
    list: {
      type: Array,
      required: true
    },
    balanceAmount: {
      type: Object,
      required: true
    },
    activePool: {
      type: String,
      required: true
    }
  },
  name: 'MiningTable',
  components: {},
  data() {
    return {
      renewal: false,
      amount: 0,
      stakeVisible: false,
      currentPool: {},
      dialogLoading: false,
      choosedNftId: '',
      choosedNft: {},
      nonce: 0,
      sign: '',
      address: '',
      usdtPoolList: [
        'usdt_pool',
        'locked_usdt_pool',
        'locked_btc_pool',
        'locked_eth_pool'
      ]
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

  created() {},
  mounted() {},
  methods: {
    transformTime,
    formatNumberToWestern(number) {
      if (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    },
    chooseNft(item) {
      this.choosedNftId = item.nft_id
      this.choosedNft = item
    },
    async purchase() {
      if (
        this.balanceAmount.ofc >
        Number(this.currentPool.transaction.split('ofc')[0])
      ) {
        const reg = /^[1-9]\d*$/
        if (!reg.test(this.amount)) {
          this.$message.warning(this.$t('auction_detail.input_number'))
          return
        }
        const res = await dual_lock({
          id:
            this.loginType === 'eth'
              ? this.userInfo.eth_account
              : this.userInfo.user,
          token: getToken(),
          pool: this.currentPool.pool,
          quantity: Number(this.amount),
          renew: this.renewal ? 'yes' : 'no'
        })
        if (res && res.success === 'ok') {
          this.$message.success(this.$t('mining.stake_success_tip'))
        }
        this.currentPool = {}
        this.stakeVisible = false
        this.dialogLoading = false
        this.amount = 0
        this.renewal = false
        this.$emit('refreshList')
      } else {
        this.$message.error(this.$t('mining.ofc_tip'))
      }
    },
    stake() {
      if (
        this.balanceAmount.ofc >
        Number(this.currentPool.transaction.split('ofc')[0])
      ) {
        this.callContractMethod(async (hashs) => {
          const res = await nft_lock({
            id:
              this.loginType === 'eth'
                ? this.userInfo.eth_account
                : this.userInfo.user,
            token: getToken(),
            nft_id: this.choosedNftId,
            hashs,
            nonce: this.nonce,
            sign: this.sign,
            address: this.address,
            pool: this.currentPool.pool
          })
          if (res && res.success === 'ok') {
            this.$message.success(this.$t('mining.stake_success_tip'))
          }

          this.choosedNftId = ''
          this.choosedNft = {}
          this.currentPool = {}
          this.stakeVisible = false
          this.dialogLoading = false
          this.$emit('refreshList')
        })
      } else {
        this.$message.error(this.$t('mining.ofc_tip'))
      }
    },
    async callContractMethod(callback) {
      // 调用合约上的方法
      /**
       * @param optionsData 发送方法的对象
       * @param contractExample 要操作的合约实例
       * @param values value值默认是0
       * @param callback 回调函数
       */
      const self = this
      const BSC_CHAIN_ID = 56
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'eth_requestAccounts'
          })

          const web3 = new this.Web3(window.ethereum)
          const accounts = await web3.eth.getAccounts()
          self.nonce = Math.floor(Math.random() * 900000 + 100000)
          web3.eth.personal.sign(
            web3.utils.utf8ToHex('stake' + self.nonce),
            accounts[0],
            async (err, res) => {
              if (err) {
                self.$message.error(
                  self.$t('inventory.sign_fail') + err.message
                )
              } else {
                self.sign = res
                self.address = accounts[0]
                const fromAddress = accounts[0]
                console.log(fromAddress)
                if (!fromAddress) {
                  return
                }
                const chainId = await web3.eth.getChainId()
                if (chainId !== BSC_CHAIN_ID) {
                  self.$message.error(this.$t('mining.bsc_tip'))
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
                const str2 =
                  '888888843C86aB23a33e3511da8A2471Af10cFC6'.toLowerCase()
                const len2 = str2.length
                let s2 = ''
                for (let index = 0; index < 64 - len2; index++) {
                  s2 += '0'
                }
                const finalStr2 = s2 + str2
                const tokenId = Number(self.choosedNftId)
                console.log(tokenId)
                const hexId = tokenId.toString(16)
                const len3 = hexId.length
                let s3 = ''
                for (let index = 0; index < 64 - len3; index++) {
                  s3 += '0'
                }
                const finalTokenId = s3 + hexId
                const optionData =
                  '0x42842e0e' + finalStr1 + finalStr2 + finalTokenId
                let options = {
                  from: fromAddress.toLowerCase(),
                  to: '0x525A4964162738c1010e1998AbA190964d95fA9a',
                  value: 0,
                  data: optionData,
                  gasPrice: gasPrice
                }
                self.dialogLoading = true
                web3.eth
                  .sendTransaction(options)
                  .on('error', function (error) {
                    console.error('error', error)
                    // callback && callback(false)
                  })
                  .on('transactionHash', function (hash) {
                    self.currentPool.tradeHash = hash
                  })
                  .then(function () {
                    setTimeout(() => {
                      callback(self.currentPool.tradeHash)
                    }, 5000)
                  })
              }
            }
          )
        } catch (error) {
          console.log(error)
        }
      } else {
        alert('Please install MetaMask to interact with this dApp.')
      }
    },
    async getNftIds() {
      const web3 = new this.Web3('https://1rpc.io/bnb')

      const contractABI = NFT

      const contractAddress = '0x525A4964162738c1010e1998AbA190964d95fA9a' // 合约地址

      const contract = new web3.eth.Contract(contractABI, contractAddress)

      const userAddress = sessionStorage.getItem('walletAccount') // 用户地址
      console.log(userAddress)

      if (userAddress) {
        const nftIds = await contract.methods.getOwnerNFTs(userAddress).call()

        return nftIds
      } else {
        const res = await window.ethereum.enable()
        console.log(res)

        if (res[0]) {
          this.$EventBus.$emit('connect')
          const nftIds = await contract.methods.getOwnerNFTs(res[0]).call()

          return nftIds
        }

        // this.$message.warning(this.$t('inventory.link_tip'))
        // this.dialogLoading = false
        // this.stakeVisible = false
      }
    },
    async getNft(ids) {
      const params = { nft_id: ids }
      const res = await get_nft(params)
      if (res && res.success === 'ok') {
        this.point = res.point
        return res.data
      }
    },
    async getCard(item) {
      this.dialogLoading = true
      const ids = await this.getNftIds()

      if (ids) {
        let result = await this.getNft(ids)

        if (result && result.length > 0) {
          let arr = []
          if (item.pool === 'legendary_pool') {
            result.forEach((ele, index) => {
              if (ele.attributes) {
                ele.attributes.forEach((v) => {
                  if (v.trait_type === 'rarity') {
                    if (v.value === 'legendary') {
                      arr.push({ ...ele, rarity: v.value })
                    }
                  }
                })
              }
            })
          }

          if (item.pool === 'ofc_pool_1') {
            result.forEach((ele, index) => {
              if (ele.attributes) {
                ele.attributes.forEach((v) => {
                  if (v.trait_type === 'rarity') {
                    if (v.value === 'epic') {
                      arr.push({ ...ele, rarity: v.value })
                    }
                  }
                  if (v.trait_type === 'point') {
                    arr.push({ ...ele, rarity: 'point', value: v.value })
                  }
                })
              }
            })
          }
          if (item.pool === '纪念 nft') {
            result.forEach((ele, index) => {
              if (ele.attributes) {
                ele.attributes.forEach((v) => {
                  if (v.trait_type === 'rarity') {
                    if (v.value === 'common') {
                      arr.push({ ...ele, rarity: v.value })
                    }
                  }
                })
              }
            })
          }

          this.currentPool = { ...item, nftList: arr }
          console.log(this.currentPool)
          this.choosedNftId =
            this.currentPool &&
            this.currentPool.nftList.length > 0 &&
            this.currentPool.nftList[0].nft_id
          this.choosedNft = this.currentPool.nftList[0]
          this.dialogLoading = false
        }
      }
    },
    openStakeDialog(v) {
      this.stakeVisible = true
      console.log(v)
      if (this.activePool === this.$t('mining.nft')) {
        this.getCard(v)
      } else {
        this.currentPool = v
      }
    },
    handleStakeClose() {
      this.choosedNftId = ''
      this.choosedNft = {}
      this.currentPool = {}
      this.stakeVisible = false
      this.amount = 0
      this.renewal = false
    }
  }
}
</script>

<style scoped lang="scss">
.mining_table {
  .content {
    .css-15owl46 {
      box-sizing: border-box;
      margin: 0;
      min-width: 0;
      position: relative;
      .css-1q45dso {
        box-sizing: border-box;
        margin: 16px 0px 0px;
        min-width: 600px;
        display: flex;
        background-color: rgb(250, 250, 250);
        .css-1cb95z8 {
          box-sizing: border-box;
          margin: 0px 0px 0px 5px;
          min-width: 0px;
          color: currentcolor;
          font-size: 24px;
          fill: currentcolor;
          cursor: pointer;
          width: 1em;
          height: 1em;
        }
        .css-10nf7hq {
          box-sizing: border-box;
          margin: 0;
          min-width: 0;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-align-items: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
        }
        .css-1auchy2 {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          color: rgb(118, 128, 143);
        }
        .css-cyitba {
          box-sizing: border-box;
          margin: 0px;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 44px;
          width: 80px;
          -webkit-box-pack: unset;
          justify-content: center;
        }
        .css-cyitbb {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 44px;
          width: 500px;
          -webkit-box-pack: unset;
          justify-content: unset;
        }
        .css-1iw234a {
          box-sizing: border-box;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 44px;
          width: 100px;
          -webkit-box-pack: unset;
          justify-content: right;
        }
        .css-1sfh4s1 {
          box-sizing: border-box;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 44px;
          width: 200px;
          -webkit-box-pack: unset;
          justify-content: right;
        }

        .css-1iw234k {
          box-sizing: border-box;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 44px;
          width: 400px;
          -webkit-box-pack: unset;
          justify-content: right;
        }
        .css-ji2mk7 {
          box-sizing: border-box;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 44px;
          width: 400px;
          -webkit-box-pack: center;
          justify-content: right;
        }
        .css-12m5e3x {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 44px;
          width: 200px;
          -webkit-box-pack: unset;
          justify-content: right;
        }
      }
      .css-ltu2j2 {
        box-sizing: border-box;
        margin: 0px;
        min-width: 0px;
        display: flex;
        background-color: rgb(255, 255, 255);
        border-top: none;
        border-right: none;
        border-left: none;
        border-image: initial;
        border-bottom: 1px solid rgb(234, 236, 239);
        .query {
          font-size: 12px;
          color: $mainColor;
          cursor: pointer;
          margin-top: 2px;
        }
        .css-1r85enx {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          max-width: 100%;
          background-color: rgb(255, 255, 255);
          box-shadow: rgba(20, 21, 26, 0.1) 0px 0px 1px,
            rgba(71, 77, 87, 0.08) 0px 7px 14px,
            rgba(20, 21, 26, 0.08) 0px 3px 6px;
          width: 40px;
          height: 40px;
          margin-right: 10px;
          border-radius: 10px;
        }
        .css-1jjjm6k {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 74px;
          width: 80px;
          position: relative;
          justify-content: center;
        }
        .css-1jjjm6q {
          font-weight: bold;
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 74px;
          width: 500px;
          position: relative;
          justify-content: unset;
        }

        .css-1h8wmxp {
          box-sizing: border-box;
          margin: 0px;
          min-width: 80px;
          display: flex;
          align-items: center;
          height: 74px;
          width: 200px;
          -webkit-box-pack: center;
          justify-content: right;
        }

        .css-1h8wmxa {
          box-sizing: border-box;
          margin: 0px;
          min-width: 80px;
          display: flex;
          align-items: center;
          height: 74px;
          width: 100px;
          -webkit-box-pack: center;
          justify-content: right;
        }

        .css-90750c {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 74px;
          width: 400px;
          justify-content: right;
        }
        .css-1erc1g7 {
          box-sizing: border-box;
          margin: 0px;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 74px;
          width: 400px;
          -webkit-box-pack: center;
          justify-content: right;
        }
        .css-xw1pzc {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
          height: 74px;
          width: 200px;
          justify-content: right;
        }
      }
    }
  }

  .stake_dialog {
    color: #000;
    display: flex;
    justify-content: unset;
    padding-top: 10px;
    width: 100%;
    .left_container {
      font-size: 16px;
      width: 50%;

      .text-color {
        color: rgb(112, 122, 138);
      }
      .common {
        margin-bottom: 20px;
      }
      .fs14 {
        font-size: 14px;
      }
    }
    .right_container {
      width: 50%;
      font-size: 16px;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-around;
      .list_items {
        display: flex;
        align-items: center;
        justify-content: unset;
        flex-wrap: wrap;
        height: 120px;
        overflow-y: auto;
        .choosed_nft {
          border: 2px solid rgb(240, 76, 11) !important;
        }
        .list_item {
          width: 50px;
          height: 50px;
          border: 2px solid #fff;
          margin-right: 10px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      .css-b3pq5h {
        box-sizing: border-box;
        min-width: 0px;
        display: flex;
        background-color: rgb(250, 250, 250);
        position: relative;
        -webkit-box-align: center;
        align-items: center;
        padding: 24px 16px;
        border-radius: 8px;

        .css-rtmgzp {
          box-sizing: border-box;
          margin: 0px 16px;
          min-width: 0px;
          display: flex;
          flex-direction: column;
        }
        .css-1qirddq {
          box-sizing: border-box;
          margin: 0px;
          min-width: 0px;
          max-width: 100%;
          width: 64px;
          height: 64px;
          flex: 0 0 auto;
        }
      }
      .description {
        font-size: 14px;
      }
      .mining_tips {
        color: crimson;
        font-size: 14px;
      }
    }
  }
}
</style>
