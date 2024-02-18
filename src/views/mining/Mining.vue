<template>
  <div class="mining_container">
    <Wallet :balance-amount="balance" @changeBalance="changeBalance"></Wallet>
    <h1 class="title">{{ $t('mining.title') }}</h1>
    <el-tabs v-model="activeTabName" @tab-click="handleTabClick" class="tabs">
      <el-tab-pane :label="$t('mining.staking_and_mining')" :name="$t('mining.staking_and_mining')" class="stake_and_mining">
        <el-button type="danger" class="log" @click="openStakeFailQuery">{{
          $t('mining.stake_fail')
        }}</el-button>
        <div class="select_column">
          <div class="mining_pool_list">
            <div v-for="item in poolTypeList" :key="item" :class="{ item: true, choosed: activePool === item }" @click="handlePoolTypeChoosed(item)">
              {{ item }}
            </div>
          </div>
        </div>
        <Table :active-pool="activePool" :list="poolList" :balance-amount="balance" @refreshList="refresh" v-loading="nftLoading"></Table>
      </el-tab-pane>
      <el-tab-pane :label="$t('mining.my_stack')" :name="$t('mining.my_stack')" class="my_stack">
        <el-button type="danger" v-show="!tableLoading" class="log" @click="openStakeFailQuery">{{ $t('mining.stake_fail') }}</el-button>
        <div class="total_num">
          {{ $t('mining.total_num') }}:{{ showMyLists && showMyLists.length }}
        </div>
        <div class="select_column">
          <div class="mining_pool_list">
            <div v-for="item in poolTypeList" :key="item" :class="{ item: true, choosed: myActivePool === item }" @click="handleMyPoolTypeChoosed(item)">
              {{ item }}
            </div>
          </div>
        </div>
        <el-table :data="showMyLists" style="width: 100%" height="600" v-loading="tableLoading" ref="myTable">
          <el-table-column prop="pool" :label="$t('mining.pool')" width="180" :key="1">
          </el-table-column>
          <el-table-column prop="order_id" :label="$t('mining.order_id')" width="120" :key="2" v-if="myActivePool !== $t('mining.nft')">
          </el-table-column>
          <el-table-column v-if="myActivePool === $t('mining.nft')" prop="nft_id" :label="$t('mining.nft_id')" width="180" :key="3">
          </el-table-column>
          <el-table-column prop="start_time" :label="$t('mining.start_time')" width="180" :key="4">
          </el-table-column>
          <el-table-column prop="APR" :label="$t('mining.APR')" width="150" :key="5">
          </el-table-column>
          <el-table-column prop="bonus_time" :label="$t('mining.bonus_time')" width="180" v-if="myActivePool !== $t('mining.current')">
          </el-table-column>
          <el-table-column prop="quantity" :label="$t('mining.current_quantity')" width="150" v-if="myActivePool !== $t('mining.nft')" :key="6">
          </el-table-column>
          <el-table-column prop="revenue" :label="$t('mining.revenue')" width="150" :key="7">
          </el-table-column>
          <el-table-column prop="unclaimed" :label="$t('mining.unclaimed')" width="200" :key="8" v-if="myActivePool === $t('mining.current')">
            <template slot-scope="scope">
              <el-button :type="scope.row.status === 'back'?'info':'primary'" @click="claim(scope.row)">{{ scope.row.unclaimed }}{{ scope.row.unclaimed? $t('mining.claim_tip'):''}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="renew" :label="$t('mining.renew')" v-if="myActivePool === $t('mining.usdt')" :key="9" min-width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.renew" active-color="#13ce66" inactive-color="#dcdfe6" @change="changeRenew(scope.row)">
              </el-switch>
              &nbsp;
              <el-tooltip placement="top" v-if="scope.row.memo">
                <div slot="content">
                  {{
                    $i18n.locale === 'zh'
                      ? scope.row.memo.zh
                      : scope.row.memo.en
                  }}
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="status" :label="$t('mining.status')" :key="10" fixed="right" min-width="150">
            <template slot-scope="scope">
              <el-button v-if="
                  scope.row.status === 'ok' && myActivePool === $t('mining.nft')
                " type="primary" @click="openRedeemDialog(scope)">{{ $t('mining.redeem') }}</el-button>
              <el-button v-else-if="
                  scope.row.status === 'ok' &&
                  myActivePool !== $t('mining.nft')
                " type="primary" @click="openDualBack(scope.row)">{{ myActivePool === $t('mining.usdt')? $t('mining.redeem_early'):$t('mining.redeem') }}</el-button>
              <el-button v-else-if="scope.row.status === 'back'" disabled plain type="info">{{ $t('mining.redeemed') }}</el-button>

              <el-button v-else-if="scope.row.status === 'backing'" type="danger" @click="openCancelDualBack(scope.row)">{{ $t('mining.cancel_back') }}</el-button>
              <el-button v-else type="danger" @click="openQuery(scope)">{{
                $t('mining.query')
              }}</el-button>
              &nbsp;
              <el-tooltip placement="top" v-if="scope.row.memo2">
                <div slot="content">
                  {{
                    $i18n.locale === 'zh'
                      ? scope.row.memo2.zh
                      : scope.row.memo2.en
                  }}
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="$t('mining.redeem_tip')" :visible.sync="redeemVisible" width="30%" :before-close="handleRedeemClose">
      <el-input class="redeem" v-model="redeemAddress"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="redeem">{{
          $t('mining.confirm_redeem')
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('mining.hash_tip')" :visible.sync="queryVisible" width="30%" :before-close="handleQueryClose">
      <el-input v-model="queryHash"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="query">{{
          $t('mining.query')
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="$t('mining.restake')" :visible.sync="stakeFailQueryVisible" width="30%" :before-close="handleStakeFailClose">
      <div style="margin-bottom: 10px">
        {{ $t('mining.address') }}：<br /><el-input v-model="stakeFailObj.address"></el-input>
      </div>
      <div style="margin-bottom: 10px">
        {{ $t('mining.nft_number') }}：<br /><el-input v-model="stakeFailObj.nft_id"></el-input>
      </div>
      <div style="margin-bottom: 10px" class="pool_select">
        {{ $t('mining.pool_name') }}：<br />
        <el-select v-model="stakeFailObj.pool" :placeholder="$t('mining.pool_select')">
          <el-option v-for="item in poolList" :key="item.pool" :label="item.pool" :value="item.pool">
          </el-option>
        </el-select>
      </div>
      <div style="margin-bottom: 10px">
        hash：<br /><el-input v-model="stakeFailObj.hash"></el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="stakeFailQuery">{{
          $t('mining.restake')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  pool,
  my_mining,
  nft_lock,
  nft_back,
  dual_pool,
  dual_back,
  cancel_back,
  dual_renew,
  current_pool,
  current_back,
  current_claim
} from '@/api/mining/mining'
import { getToken } from '@/utils/auth'
import { debounce } from 'lodash'
import Wallet from './components/wallet.vue'
import Table from './components/table.vue'
import { transformTime } from '@/utils/tool'
export default {
  name: 'Mining',
  components: {
    Wallet,
    Table
  },
  data() {
    return {
      nftLists: [],
      showNftLists: [],
      myLists: [],
      showMyLists: [],
      poolTypeList: [
        this.$t('mining.nft'),
        this.$t('mining.usdt'),
        this.$t('mining.current')
      ],
      tableLoading: false,
      activeTabName: this.$t('mining.staking_and_mining'),
      stakingValue: 'nft',
      myStakingValue: 'nft',
      activePool: this.$t('mining.nft'),
      myActivePool: this.$t('mining.nft'),
      poolList: [],
      balance: {},
      secondSelectList: [],
      redeemVisible: false,
      redeemAddress: '',
      redeemNft: {},
      queryVisible: false,
      queryHash: '',
      queryNft: {},
      nftLoading: false,
      nonce: '',
      stakeFailQueryVisible: false,
      stakeFailObj: {
        address: '',
        nft_id: '',
        pool: '',
        hash: ''
      }
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
  async mounted() {
    const query = this.$route.query
    await this.getPool()
    if (query.referer === 'benifit') {
      this.handlePoolTypeChoosed(this.$t('mining.current'))
    }
  },
  methods: {
    transformTime,
    async claim(v) {
      console.log(v)
      if (v.unclaimed > 0) {
        const res = await current_claim({
          id:
            this.loginType === 'eth'
              ? this.userInfo.eth_account
              : this.userInfo.user,
          token: getToken(),
          pool: v.pool,
          ids: v.id
        })
        if (res && res.success === 'ok') {
          this.$message.success(this.$t('mining.claim_success_tip'))
        }
      }
    },
    async currentBack(v) {
      const res = await current_back({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        pool: v.pool,
        ids: v.id
      })
      if (res && res.success === 'ok') {
        this.$message.success(this.$t('mining.redeem_success_tip'))
        this.getMyStake(this.$t('mining.current'))
      }
    },
    renderHeader(render, { column }) {
      let label = column.label
      return [
        label,
        // 第一个参数是标签名称，第二个参数是标签属性，第三个参数是标签内容
        render(
          'el-tooltip',
          {
            props: {
              content: '1123123',
              placement: 'top'
            }
          },
          [
            render('span', {
              class: {
                'el-icon-question': true
              }
            })
          ]
        )
      ]
    },
    openDualBack(v) {
      this.$confirm(
        this.$t('mining.confirm_redeem_tip'),
        this.$t('mining.tip'),
        {
          confirmButtonText: this.$t('mining.confirm'),
          cancelButtonText: this.$t('mining.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          if (v.pool.indexOf('current') !== -1) {
            this.currentBack(v)
          } else {
            this.dualBack(v)
          }
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: this.$t('mining.redeemed')
          // })
        })
    },
    openCancelDualBack(v) {
      this.$confirm(
        this.$t('mining.confirm_cancel_redeem_tip'),
        this.$t('mining.tip'),
        {
          confirmButtonText: this.$t('mining.confirm'),
          cancelButtonText: this.$t('mining.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.cancelBack(v)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('mining.cancel_redeem')
          })
        })
    },
    changeLoading(v) {
      this.nftLoading = v
    },
    openStakeFailQuery() {
      this.stakeFailQueryVisible = true
    },
    async dualBack(v) {
      const res = await dual_back({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        pool: v.pool,
        ids: v.id
      })
      if (res && res.success === 'ok') {
        this.$message.success(this.$t('mining.redeem_success_tip'))
        this.getMyStake(this.$t('mining.usdt'))
      }
    },
    async cancelBack(v) {
      const res = cancel_back({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        pool: v.pool,
        ids: v.id
      })
      if (res && res.success === 'ok') {
        this.$message.success(this.$t('mining.cancel_back_tip'))
      }
    },
    async changeRenew(v) {
      const res = await dual_renew({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        pool: v.pool,
        ids: v.id,
        renew: v.renew ? 'no' : 'yes'
      })
      if (res && res.success === 'ok') {
        if (v.renew) {
          this.$message.success(this.$t('mining.renew_success_tip'))
        } else {
          this.$message.success(this.$t('mining.cancel_renew_success_tip'))
        }
      } else {
        v.renew = !v.renew
      }
    },
    handleStakeFailClose() {
      this.stakeFailObj = {
        address: '',
        nft_id: '',
        pool: '',
        hash: ''
      }
      this.stakeFailQueryVisible = false
    },
    stakeFailQuery: debounce(async function () {
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
            web3.utils.utf8ToHex('stake' + nonce),
            accounts[0],
            async (err, res) => {
              if (err) {
                self.$message.error(
                  self.$t('inventory.sign_fail') + err.message
                )
              } else {
                const resData = await nft_lock({
                  id:
                    self.loginType === 'eth'
                      ? self.userInfo.eth_account
                      : self.userInfo.user,
                  token: getToken(),
                  nft_id: self.stakeFailObj.nft_id,
                  hashs: self.stakeFailObj.hash,
                  pool: self.stakeFailObj.pool,
                  sign: res,
                  nonce,
                  address: self.stakeFailObj.address
                })
                if (resData && resData.success === 'ok') {
                  self.$message.success(this.$t('mining.lock_success_tip'))
                  self.handleStakeFailClose()
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
    }, 500),
    refresh(type) {
      if (type === this.$t('mining.nft')) {
        this.getPool()
      } else if (type === this.$t('mining.usdt')) {
        this.getDualPool()
      } else {
        this.getCurrentPool()
      }
    },
    handleQueryClose() {
      this.queryVisible = false
      this.queryNft = {}
      this.queryHash = ''
    },
    openQuery(v) {
      this.queryVisible = true
      this.queryNft = v.row
    },
    async query() {
      const self = this
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
                self.address = accounts[0]
                const resData = await nft_lock({
                  id:
                    self.loginType === 'eth'
                      ? self.userInfo.eth_account
                      : self.userInfo.user,
                  token: getToken(),
                  nft_id: self.queryNft.nft_id,
                  hashs: self.queryHash,
                  pool: self.queryNft.pool,
                  sign: res,
                  nonce: self.nonce,
                  address: accounts[0]
                })
                if (resData && resData.success === 'ok') {
                  self.$message.success(this.$t('mining.lock_success_tip'))
                }
                self.handleQueryClose()
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
    openRedeemDialog(v) {
      this.redeemVisible = true
      this.redeemNft = v.row
    },
    handleRedeemClose() {
      this.redeemVisible = false
      this.redeemNft = {}
      this.redeemAddress = ''
    },
    async redeem(v) {
      const res = await nft_back({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        nft_id: this.redeemNft.nft_id,
        address: this.redeemAddress,
        pool: this.redeemNft.pool
      })
      if (res && res.success === 'ok') {
        this.$message.success(this.$t('mining.redeem_success_tip'))
      }
      this.handleRedeemClose()
    },
    changeBalance(v) {
      this.balance = v
    },
    async getMyStake(type) {
      this.tableLoading = true
      const res = await my_mining({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken()
      })
      if (res && res.success === 'ok') {
        this.myLists = res
        // this.myLists.current_data = [
        //   {
        //     pool: 'usdt_pool',
        //     order_id: 'q4742fbc1',
        //     id: 1525622927,
        //     start_time: 1692288000,
        //     APR: '20-26%',
        //     revenue: 0,
        //     status: '123',
        //     renew: 'yes',
        //     quantity: 2,
        //     memo: {
        //       zh: '123123213',
        //       en: 'qwewqeqw'
        //     },
        //     memo2: {
        //       zh: '123123',
        //       en: 'sssss'
        //     }
        //   },
        //   {
        //     pool: 'usdt_pool',
        //     order_id: 'q4742fbc1',
        //     id: 9761433499,
        //     start_time: 1692288000,
        //     APR: '20-26%',
        //     revenue: 0,
        //     status: 'ok',
        //     renew: 'yes',
        //     quantity: 1,
        //     memo2: {
        //       zh: '123123',
        //       en: 'sssss'
        //     }
        //   },
        //   {
        //     pool: 'locked_usdt_pool',
        //     order_id: 'q4742fbc1',
        //     id: 4018259456,
        //     start_time: 1692288000,
        //     APR: '35-45%',
        //     revenue: 0,
        //     status: 'ok',
        //     renew: 'yes',
        //     quantity: 2,
        //     memo2: {
        //       zh: '123123',
        //       en: 'sssss'
        //     }
        //   },
        //   {
        //     pool: 'locked_eth_pool',
        //     order_id: 'q4742fbc1',
        //     id: 8311986161,
        //     start_time: 1692288000,
        //     APR: '23-33%',
        //     revenue: 0,
        //     status: 'back',
        //     renew: 'yes',
        //     quantity: 1,
        //     memo2: {
        //       zh: '123123',
        //       en: 'sssss'
        //     }
        //   },
        //   {
        //     pool: 'locked_btc_pool',
        //     order_id: 'q4742fbc1',
        //     id: 3042267695,
        //     start_time: 1692288000,
        //     APR: '23-33%',
        //     revenue: 0,
        //     status: 'backing',
        //     renew: 'yes',
        //     quantity: 1,
        //     memo2: {
        //       zh: '123123',
        //       en: 'sssss'
        //     }
        //   }
        // ]
        this.myLists.dual_data.forEach((item) => {
          if (typeof item.bonus_time !== 'string') {
            item.bonus_time = this.transformTime(Number(item.bonus_time))
          }
          item.start_time = this.transformTime(Number(item.start_time))
          item.renew = item.renew === 'yes' ? false : true
        })
        this.myLists.data.forEach((item) => {
          item.start_time = this.transformTime(Number(item.start_time))
        })
        this.myLists.current_data.forEach((item) => {
          if (typeof item.bonus_time !== 'string') {
            item.bonus_time = this.transformTime(Number(item.bonus_time))
          }
          item.start_time = this.transformTime(Number(item.start_time))
          item.renew = item.renew === 'yes' ? false : true
        })
        console.log(type)
        if (type === this.$t('mining.nft')) {
          this.showMyLists = this.myLists.data
        } else if (type === this.$t('mining.usdt')) {
          this.showMyLists = this.myLists.dual_data
        } else {
          this.showMyLists = this.myLists.current_data
        }

        this.tableLoading = false
      }
    },
    handleTabClick: debounce(function () {
      if (this.activeTabName === this.$t('mining.staking_and_mining')) {
        if (this.activePool === this.$t('mining.nft')) {
          this.getPool()
        } else if (this.activePool === this.$t('mining.usdt')) {
          this.getDualPool()
        } else {
          this.getCurrentPool()
        }
      }
      if (this.activeTabName === this.$t('mining.my_stack')) {
        this.myActivePool = this.$t('mining.nft')
        this.getMyStake(this.$t('mining.nft'))
      }
    }, 500),
    handlePoolTypeChoosed: debounce(function (v) {
      this.activePool = v
      if (v === this.$t('mining.nft')) {
        this.getPool()
      } else if (v === this.$t('mining.usdt')) {
        this.getDualPool()
      } else {
        this.getCurrentPool()
      }
    }, 500),
    handleMyPoolTypeChoosed: debounce(function (v) {
      this.myActivePool = v
      if (v === this.$t('mining.nft')) {
        this.showMyLists = this.myLists.data
        this.$nextTick(() => {
          this.$refs.myTable.doLayout()
        })
      } else if (v === this.$t('mining.usdt')) {
        this.showMyLists = this.myLists.dual_data
        this.$nextTick(() => {
          this.$refs.myTable.doLayout()
        })
      } else {
        this.showMyLists = this.myLists.current_data
        this.$nextTick(() => {
          this.$refs.myTable.doLayout()
        })
      }
    }, 500),
    async getDualPool() {
      this.nftLoading = true
      const res = await dual_pool()
      if (res && res.success === 'ok') {
        const arr = []
        res.data.forEach((ele) => {
          arr.push({
            ...ele,
            transaction: ele.fees,
            description: this.$t('mining.legendary_description')
          })
        })
        this.poolList = arr
      }
      this.nftLoading = false
    },
    async getPool() {
      this.nftLoading = true
      const res = await pool()
      if (res && res.success === 'ok') {
        const arr = []
        res.data.forEach((ele) => {
          if (ele.pool === 'legendary_pool') {
            arr.push({
              ...ele,
              transaction: '2000ofc',
              description: this.$t('mining.legendary_description')
            })
          }
          if (ele.pool === 'ofc_pool_1') {
            arr.push({
              ...ele,
              transaction: '300ofc',
              description: this.$t('mining.epic_description')
            })
          }
        })
        this.poolList = arr
        // [
        // {
        //   pool: 'legendary nft',
        //   start_time: 1690595416,
        //   APR: '40',
        //   status: 'ok',
        //   total: 200,
        //   transaction: '2000ofc',
        //   term: this.$t('mining.one_year'),
        //   description: this.$t('mining.legendary_description')
        // },
        //   {
        //     pool: 'epic nft',
        //     start_time: 1690595416,
        //     APR: '40',
        //     status: 'ok',
        //     total: 200,
        //     transaction: '200ofc',
        //     term: this.$t('mining.one_year'),
        //     description: this.$t('mining.epic_description')
        //   },
        //   {
        //     pool: '纪念 nft',
        //     start_time: 1690595416,
        //     APR: '40',
        //     status: 'ok',
        //     total: 200,
        //     transaction: '2000ofc',
        //     term: this.$t('mining.one_year'),
        //     description: this.$t('mining.legendary_description')
        //   }
        // ]
      }
      this.nftLoading = false
    },
    async getCurrentPool() {
      this.nftLoading = true
      const res = await current_pool()
      if (res && res.success === 'ok') {
        const arr = []
        res.data.forEach((ele) => {
          arr.push({
            ...ele,
            transaction: ele.fees,
            description: ''
          })
        })
        this.poolList = arr
      }
      this.nftLoading = false
    }
  },
  watch: {
    '$i18n.locale': {
      handler(newVal, oldVal) {
        this.activeTabName = this.$t('mining.staking_and_mining')
        this.poolTypeList = [
          this.$t('mining.nft'),
          this.$t('mining.usdt'),
          this.$t('mining.current')
        ]
        this.activePool = this.$t('mining.nft')
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .table-fiexd {
  .el-table__fixed-right {
    height: 100% !important;
  }
  .el-table__fixed {
    height: 100% !important;
  }
}
::v-deep .el-button--primary {
  color: #fff;
  background-color: $mainColor;
  border-color: $mainColor;
}
::v-deep .el-button--primary:hover {
  background: #0888a5;
  border-color: #0888a5;
  color: #fff;
}
::v-deep .select_column .el-input__inner {
  width: 120px;
  background-color: rgba(18, 18, 18, 0.1);
  border: none;
  border-radius: 10px;
  font-size: 16px;
}

// ::v-deep .redeem .el-input__inner {
//   width: 100%;
//   background-color: #fff;
//   border: 1px solid #dcdfe6;
//   font-size: 14px;
// }
// ::v-deep .redeem .el-input__inner:hover {
//   background-color: #fff;
//   border: 1px solid #dcdfe6;
// }
::v-deep .select_column .el-input__inner:hover {
  background-color: rgba(18, 18, 18, 0.16) !important;
  border: none;
}

::v-deep .el-tabs__header .el-tabs__item {
  font-size: 18px;
  padding: 10px 20px;
  height: 50px;
}
::v-deep .el-tabs__item.is-active {
  color: $mainColor;
}
::v-deep .el-tabs__item:hover {
  color: $mainColor;
}
::v-deep .el-tabs__active-bar {
  background-color: $mainColor;
}
::v-deep .pool_select .el-select {
  width: 100%;
}
// ::v-deep .el-dialog__body {
//   display: flex;
//   justify-content: unset;
//   padding-top: 10px;
// }
::v-deep .el-divider--vertical {
  height: auto;
}
.mining_container {
  padding: 20px 0;
  background-color: #fff;
  height: 100%;
  position: relative;
  .title {
    font-size: 40px;
    padding: 20px 200px 80px 200px;
    background-image: linear-gradient(to bottom, #fff, #ececec);
  }
  .tabs {
    background-color: #fff;
    padding: 20px 200px;
    width: calc(100% - 400px);
    position: absolute;
    .stake_and_mining {
      position: relative;
      padding-top: 35px;
      .log {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .my_stack {
      position: relative;
      padding-top: 35px;
      .log {
        position: absolute;
        right: 0;
        top: 0;
      }
      .total_num {
        position: absolute;
        left: 0;
        top: 10px;
      }
    }
  }
  .select_column {
    display: flex;
    align-items: center;

    .category {
      padding: 0 2px;
      margin-left: 20px;
      display: flex;
      background-color: rgba(18, 18, 18, 0.1);
      height: 40px;
      align-items: center;
      border-radius: 10px;
      .item {
        display: flex;
        align-items: center;
        height: 36px;
        padding: 0 20px;
        cursor: pointer;
        min-width: 50px;
        transition: all 0.3s ease 0s;
        border-radius: 10px;
      }
      .choosed {
        background-color: #fff;
      }
    }
    .mining_pool_list {
      padding: 0 2px;
      margin: 10px 0;
      display: flex;
      background-color: rgba(18, 18, 18, 0.1);
      height: 40px;
      align-items: center;
      border-radius: 10px;
      .item {
        display: flex;
        align-items: center;
        height: 36px;
        padding: 0 20px;
        cursor: pointer;
        min-width: 50px;
        transition: all 0.3s ease 0s;
        border-radius: 10px;
      }
      .choosed {
        background-color: #fff;
      }
    }
  }
}

.select {
  height: 200px;
}
</style>
