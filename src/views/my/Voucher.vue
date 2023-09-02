<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-27 04:17:54
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-29 15:00:54
 * @FilePath: \quhu\src\views\my\Integral.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="wallet">
    <div class="operation">
      <el-button type="success" around @click="showTrade">{{
        $t('voucher.exchange')
      }}</el-button>
      <el-button type="danger" around @click="showAddress">{{
        $t('voucher.recharge')
      }}</el-button>
      <el-button type="primary" around @click="withdrawalVisible = true">{{
        $t('voucher.withdrawal')
      }}</el-button>
      <el-button type="warning" around @click="ask">{{
        $t('voucher.withdrawal_query')
      }}</el-button>
    </div>
    <div class="check">
      <span @click="dialogFormVisible = true">{{
        $t('voucher.query_tip')
      }}</span>
    </div>
    <div v-show="isShowAddress" class="address-container">
      <span>{{ $t('voucher.to_address') }}：{{ address }}</span>
      <i class="el-icon-copy-document" @click="copy(address, $event)"></i>
    </div>
    <div class="coin-list">
      <div class="coin-header">
        <div class="coin-title">{{ $t('voucher.coin_property') }}</div>
        <div class="balance-title">{{ $t('voucher.balance') }}</div>
        <div class="balance-title">{{ $t('voucher.locked') }}</div>
      </div>
      <div class="coin">
        <div class="coin-item" v-for="item in balanceList" :key="item.id">
          <div class="coin-name">{{ item.name }}</div>
          <div class="balance">
            {{ Number(item.balance) === 0 ? 0 : item.balance.toFixed(8) }}
          </div>
          <div class="balance">
            {{
              Number(item.lock_balance) === 0 ? 0 : item.lock_balance.toFixed(8)
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="cost-list">
      <div class="cost-title">{{ $t('voucher.exchange_report') }}</div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        height="300"
        v-loading="tableLoading"
      >
        <el-table-column
          prop="timestamp"
          :label="$t('voucher.date')"
          width="240"
        >
        </el-table-column>
        <el-table-column
          prop="orderid"
          :label="$t('voucher.order_number')"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="type" :label="$t('voucher.goods_name')">
        </el-table-column>
        <el-table-column
          prop="token"
          :label="$t('voucher.pay_currency')"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="amount" :label="$t('voucher.pay_amount')">
        </el-table-column>
      </el-table>
    </div>
    <div class="record-page">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="20"
        :page-count="pageInfo.max_page"
        layout="total, prev, pager, next, jumper"
        :total="pageInfo.total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('voucher.recharge_query')"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="checkForm">
        <el-form-item label="hash" label-width="120">
          <el-input
            v-model="checkForm.hash"
            autocomplete="off"
            :placeholder="$t('voucher.input_hash')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCheck">{{
          $t('voucher.click_query')
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('voucher.withdrawal')"
      :close-on-click-modal="false"
      :visible.sync="withdrawalVisible"
      width="30%"
    >
      <div class="withdrawal_dialog">
        <el-input
          v-model="withdrawalAmount"
          autocomplete="off"
          :placeholder="$t('voucher.withdrawal_tip1')"
        ></el-input>
        <el-select
          class="price_select"
          v-model="withdrawalCoin"
          clearable
          :placeholder="$t('voucher.withdrawal_tip2')"
          @change="$forceUpdate()"
        >
          <el-option
            v-for="item in balanceList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </div>

      <el-input
        v-model="withdrawalAddress"
        autocomplete="off"
        :placeholder="$t('voucher.withdrawal_tip3')"
      ></el-input>
      <span slot="footer" class="withdrawal-dialog-footer">
        <div class="show-withdrawal">
          <div>{{ $t('voucher.received') }}</div>
          <div>
            {{
              withdrawalAmount === '0' || withdrawalAmount === ''
                ? 0 + withdrawalCoin
                : withdrawalAmount - withdrawalCoinNumber + withdrawalCoin
            }}
          </div>
          <div>
            {{ $t('voucher.net_cost')
            }}{{ withdrawalCoinNumber + withdrawalCoin }}
          </div>
        </div>
        <el-button @click="withdrawalVisible = false">{{
          $t('voucher.cancel')
        }}</el-button>
        <el-button
          :disabled="withdrawalAmount === '0' || withdrawalAmount === ''"
          type="primary"
          @click="spend"
          >{{ $t('voucher.withdrawal') }}</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('voucher.withdrawal_query')"
      :close-on-click-modal="false"
      :visible.sync="searchVisible"
      width="80%"
    >
      <div class="record-page">
        <el-table
          :data="searchData"
          stripe
          style="width: 100%"
          height="600"
          v-loading="searchLoading"
        >
          <el-table-column
            prop="timestamp"
            :label="$t('voucher.date')"
            width="160"
          >
          </el-table-column>
          <el-table-column
            prop="orderid"
            :label="$t('voucher.order_number')"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="steem_id"
            :label="$t('voucher.user_id')"
            width="100"
          >
          </el-table-column>
          <el-table-column prop="token" :label="$t('voucher.coin')" width="60">
          </el-table-column>
          <el-table-column
            prop="nums"
            :label="$t('voucher.quantity')"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="pay"
            :label="$t('voucher.pay_status')"
            width="240"
          >
          </el-table-column>
          <el-table-column
            prop="types"
            :label="$t('voucher.audit_status')"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            :label="$t('voucher.withdrawal_address')"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeSearch"
          :current-page.sync="currentSearchPage"
          :page-size="20"
          :page-count="searchPageInfo.max_page"
          layout="total, prev, pager, next, jumper"
          :total="searchPageInfo.total"
        >
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="coinTradeVisible"
      :close-on-click-modal="false"
      :title="$t('voucher.exchange')"
      width="50%"
      custom-class="trade_dialog"
      v-loading="tradeLoading"
      :element-loading-text="$t('voucher.loading')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-form
        :model="tradeForm"
        ref="tradeForm"
        :rules="rules"
        label-width="120px"
      >
        <div class="from_container">
          <div class="from">
            <span>From</span>
            <el-form-item prop="exchangeCurrency">
              <el-select
                v-model="tradeForm.exchangeCurrency"
                class="exchangeCurrency"
                popper-class="exchangeCurrency_select_down"
                @change="changeFrom"
              >
                <el-option label="poys" value="poys" />
                <el-option label="usdt" value="usdt" />
              </el-select>
            </el-form-item>
          </div>

          <div class="from_input">
            <div class="amount_container">
              <el-input
                class="amount_input"
                v-model="tradeForm.exchangeAmount"
                @input="amountChange"
              ></el-input>
              <div>
                <span
                  >{{ $t('voucher.balance') }}：
                  {{ userInfo.token_num[tradeForm.exchangeCurrency] }}</span
                >
              </div>
            </div>
            <div class="max" @click="maxAmount">MAX</div>
          </div>
        </div>
        <div class="arrow_down">
          <svg
            :style="{
              fill: '#087790',
              width: '15px',
              height: '15px',
              marginRight: '5px'
            }"
          >
            <use
              :xlink:href="'#icon-arrow-doubledown'"
              rel="external nofollow"
            />
          </svg>
        </div>

        <div class="to_container">
          <div class="to">
            <span>To</span>
            <el-form-item prop="convertCurrency">
              <el-select
                v-model="tradeForm.convertCurrency"
                class="convertCurrency"
                popper-class="convertCurrency_select_down"
              >
                <el-option
                  v-for="item in convertCurrencyArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="to_input">
            <div class="amount_container">
              <div class="amount_input">{{ tradeForm.convertAmount }}</div>
              <!-- <el-input
                class="amount_input"
                v-model="tradeForm.convertAmount"
                :disabled="true"
              ></el-input> -->
            </div>
          </div>
        </div>
        <div class="operation_btns">
          <el-button
            type="primary"
            :disabled="validateAmount"
            @click="exchange"
            >{{ $t('voucher.exchange') }}</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
import {
  transactions,
  check,
  withdrawal,
  getwithdrawal,
  swap,
  balance
} from '@/api/user/user'
import { getToken } from '@/utils/auth'
import { transformTime } from '@/utils/tool'
import { Loading } from 'element-ui'

export default {
  data() {
    return {
      checkForm: {
        hash: ''
      },
      convertCurrencyArr: [
        {
          value: 'ofc',
          label: 'ofc'
        },
        {
          value: 'usdt',
          label: 'usdt'
        }
      ],
      radio: 1,
      tradeForm: {
        exchangeAmount: 0,
        exchangeCurrency: 'poys',
        convertCurrency: 'usdt',
        convertAmount: 0
      },
      rules: {
        exchangeCurrency: [
          {
            required: true,
            message: this.$t('voucher.coin_tip'),
            trigger: 'change'
          }
        ],
        convertCurrency: [
          {
            required: true,
            message: this.$t('voucher.coin_tip'),
            trigger: 'change'
          }
        ]
      },
      currencyBalances: {
        poys: 10000,
        usdt: 20000
      },
      coinTradeVisible: false,
      withdrawalAmount: '',
      withdrawalCoin: 'ofc',
      withdrawalAddress: '',
      dialogFormVisible: false,
      searchVisible: false,
      withdrawalVisible: false,
      currentPage: 1,
      currentSearchPage: 1,
      pagesize: 10,
      search: '',
      address: '',
      isShowAddress: false,
      tradeLoading: false,
      tableLoading: false,
      searchLoading: false,
      validateAmount: true,
      tableData: [
        {
          timestamp: '',
          orderid: '',
          type: '',
          token: '',
          amount: '',
          status: ''
        }
      ],
      searchData: [
        {
          timestamp: '',
          orderid: '',
          userid: '',
          token: '',
          amount: ''
        }
      ],
      searchPageInfo: {},
      pageInfo: {},
      balanceList: []
    }
  },
  computed: {
    withdrawalCoinNumber() {
      let coin = 0
      switch (this.withdrawalCoin) {
        case 'ofc':
          coin = 1000
          break

        case 'poys':
          coin = 50
          break
        case 'bnb':
          coin = 0.005
          break
        case 'busd':
          coin = 1
          break
        case 'usdt':
          coin = 1
          break
      }
      return coin
    },
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    }
  },
  async created() {
    this.getTableData(1)
    this.getBalance()
  },
  mounted() {},
  methods: {
    async getBalance() {
      const res = await balance({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken()
      })
      if (res && res.success === 'ok') {
        const arr = []
        Object.keys(res.data.token_num).forEach((key, i) => {
          arr.push({
            name: key,
            balance: res.data.token_num[key],
            lock_balance: res.data.lock_token[key],
            id: i
          })
        })
        this.balanceList = arr
      }
    },
    async exchange() {
      console.log(this.tradeForm.exchangeAmount)

      this.tradeLoading = true
      const res = await swap({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        coins: `${this.tradeForm.exchangeCurrency}=>${this.tradeForm.convertCurrency}`,
        amount: this.tradeForm.exchangeAmount
      })
      if (res && res.success === 'ok') {
        this.$message.success(this.$t('voucher.exchange_success'))
      }

      this.tradeLoading = false
    },
    maxAmount() {
      this.tradeForm.exchangeAmount =
        this.userInfo.token_num[this.tradeForm.exchangeCurrency]
      switch (this.tradeForm.exchangeCurrency) {
        case 'poys':
          if (this.tradeForm.convertCurrency === 'usdt') {
            this.tradeForm.convertAmount = this.tradeForm.exchangeAmount * 0.02
          }
          if (this.tradeForm.convertCurrency === 'usdt') {
            this.tradeForm.convertAmount = this.tradeForm.exchangeAmount * 0.02
          } else if (this.tradeForm.convertCurrency === 'ofc') {
            this.tradeForm.convertAmount = this.tradeForm.exchangeAmount * 10
          }
          break

        default:
          break
      }
      const reg = /^[1-9]\d*$/
      if (reg.test(this.tradeForm.exchangeAmount)) {
        this.validateAmount = false
      }
    },
    amountChange() {
      const reg = /^[1-9]\d*$/
      if (reg.test(this.tradeForm.exchangeAmount)) {
        this.validateAmount = false
      } else {
        this.validateAmount = true
      }
      switch (this.tradeForm.exchangeCurrency) {
        case 'poys':
          if (this.tradeForm.convertCurrency === 'usdt') {
            this.tradeForm.convertAmount = this.tradeForm.exchangeAmount * 0.02
          }
          if (this.tradeForm.convertCurrency === 'usdt') {
            this.tradeForm.convertAmount = this.tradeForm.exchangeAmount * 0.02
          } else if (this.tradeForm.convertCurrency === 'ofc') {
            this.tradeForm.convertAmount = this.tradeForm.exchangeAmount * 10
          }
          break
        case 'usdt':
          this.tradeForm.convertAmount = this.tradeForm.exchangeAmount * 100
          break
        default:
          break
      }
    },
    changeFrom(v) {
      this.tradeForm.convertAmount = 0
      this.tradeForm.exchangeAmount = 0
      if (v === 'poys') {
        this.convertCurrencyArr = [
          {
            value: 'ofc',
            label: 'ofc'
          },
          {
            value: 'usdt',
            label: 'usdt'
          }
        ]
      } else if (v === 'usdt') {
        this.tradeForm.convertCurrency = 'ofc'
        this.convertCurrencyArr = [
          {
            value: 'ofc',
            label: 'ofc'
          }
        ]
      } else if (v === 'usdt') {
        this.tradeForm.convertCurrency = 'ofc'
        this.convertCurrencyArr = [
          {
            value: 'ofc',
            label: 'ofc'
          }
        ]
      }
    },
    showTrade() {
      this.coinTradeVisible = true
    },
    async ask() {
      this.getSearchData(1)
      this.searchVisible = true
    },
    async getSearchData(page) {
      this.searchLoading = true
      const params = {
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        page
      }
      const res = await getwithdrawal(params)
      if (res && res.success === 'ok') {
        this.searchPageInfo = {
          max_page: res.max_page,
          page: res.page,
          total: res.total
        }
        res.data.forEach((element) => {
          element.timestamp = transformTime(element.timestamp)
        })
        this.searchData = res.data
      }
      this.searchLoading = false
    },
    async handleCheck() {
      if (!this.checkForm.hash.trim()) {
        this.$message.error(this.$t('voucher.hash_tip'))
        return
      }
      const userInfo = this.userInfo
      const loginType = this.loginType
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        hashs: this.checkForm.hash
      }

      const res = await check(params)
      if (res && res.success === 'ok') {
        if (res.type === false) {
          this.$message.error(this.$t('voucher.fail_tip'))
        } else {
          this.$message.success(this.$t('voucher.success_tip'))
        }
      }
      this.dialogFormVisible = false
      this.checkForm.hash = ''
    },
    handleCurrentChangeSearch(v) {
      this.getSearchData(v)
    },
    handleCurrentChange(v) {
      this.getTableData(v)
    },
    async getTableData(page) {
      this.tableLoading = true
      const res = await transactions({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        page
      })
      if (res && res.success === 'ok') {
        this.pageInfo = {
          max_page: res.max_page,
          page: res.page,
          total: res.total
        }

        res.data.forEach((element) => {
          element.timestamp = transformTime(element.timestamp)
        })
        this.tableData = res.data
      }
      this.tableLoading = false
    },
    showAddress() {
      const address = JSON.parse(
        localStorage.getItem('quhu-userInfo')
      ).deposit_address
      this.address = address
      this.isShowAddress = true
    },
    copy(key, e) {
      clipboard(key, e)
    },
    async spend() {
      const reg = /^[+]{0,1}(\d+)$/
      if (!(this.withdrawalCoin === 'btc' || this.withdrawalCoin === 'eth')) {
        if (!reg.test(Number(this.withdrawalAmount))) {
          this.$message.error(this.$t('voucher.quantity_tip'))
          return
        }
      }

      if (!this.withdrawalAddress.trim()) {
        this.$message.error(this.$t('voucher.withdrawal_tip3'))
        return
      }
      const loading = Loading.service({
        text: this.$t('message.loading'),
        spinner: 'el-icon-loading ElementLoading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      const params = {
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        coins: this.withdrawalCoin,
        amount: Number(this.withdrawalAmount),
        address: this.withdrawalAddress
      }
      const res = await withdrawal(params)
      if (res && res.success === 'ok') {
        this.$message.success(this.$t('voucher.withdrawal_success'))
        this.withdrawalVisible = false
        this.withdrawalCoin = 'ofc'
        this.withdrawalAmount = ''
        this.withdrawalAddress = ''
      }
      if (loading) {
        loading.close()
      }
    }
  },
  watch: {
    validateAmount: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
.wallet {
  padding: 50px;
  position: relative;
}
.show-withdrawal {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #c0c0c0;
  text-align: left;
  font-size: 12px;
}
.check {
  font-size: 12px;
  color: #087790;
  display: flex;
  justify-content: flex-end;
  span {
    cursor: pointer;
  }
}
::v-deep .trade_dialog {
  background-color: #e4e4e4 !important;
  // display: flex;
  // justify-content: center;
}
::v-deep .trade_dialog > .el-dialog__body {
  display: flex;
  justify-content: center;
}
.from_container {
  min-width: 400px;
  background-color: #fff;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 12px;
  .from {
    display: flex;
    justify-content: space-between;
    // align-items: center;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px dashed #e4e4e4;
  }
  .from_input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .max {
      font-weight: bold;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      color: #087790;
    }

    .amount_container {
      .amount_input {
        margin-bottom: 10px;
      }
    }
  }
}
::v-deep .amount_input > input {
  border: none;
  padding: 0;
}
// ::v-deep .el-select-dropdown.el-popper.exchangeCurrency_select_down {
//   min-width: 80px !important;
// }
// ::v-deep .exchangeCurrency .el-input {
//   font-size: 16px;
//   font-weight: bold;
// }

::v-deep .exchangeCurrency input {
  width: 90px;
  border: none;
  font-size: 16px;
  font-weight: bold;
}
::v-deep .convertCurrency input {
  width: 90px;
  border: none;
  font-size: 16px;
  font-weight: bold;
}
.arrow_down {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.to_container {
  background-color: #fff;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 40px;
  font-size: 12px;
  .to {
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px dashed #e4e4e4;
    // align-items: center;
  }
  .to_input {
    display: flex;
    justify-content: space-between;
    .amount_container {
      height: 30px;
      line-height: 30px;
      .amount_input {
        margin-bottom: 10px;
      }
    }
  }
}

.operation_btns {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.withdrawal_dialog {
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
}
.coin-list {
  display: flex;
  align-items: center;
  // justify-content: center;
  flex-direction: column;
  position: relative;
  width: 100%;
  font-size: 16px;
  margin-top: 50px;
}
.coin-header {
  background-color: #fff;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 60px;
  border: 1px solid #c0c0c0;
  font-weight: bold;
  .coin-title {
    flex: 1;
    text-align: center;
    line-height: 60px;
  }
  .balance-title {
    flex: 1;
    text-align: center;
    line-height: 60px;
  }
}
.coin {
  width: 100%;
  transform: translate(-1px, 0);
}

.coin-item {
  background-color: #fff;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #c0c0c0;
  border-bottom: none;
}
.coin div:first-child {
  border-top: none;
}

.coin div:last-child {
  border-bottom: 1px solid #c0c0c0;
}
.coin-name {
  flex: 1;
  text-align: center;
  line-height: 100px;
}
.balance {
  flex: 1;
  text-align: center;
  line-height: 100px;
}
.operation {
  display: flex;
  justify-content: space-around;
  position: absolute;
  right: 50px;
  top: 0px;
}
.address-container {
  // width: 500px;
  height: 50px;
  margin-top: 20px;
  // background-color: #c0c0c0;
  // color: #fff;
}
.el-icon-copy-document {
  margin-left: 10px;
}
::v-deep .el-table__body,
.el-table__footer,
.el-table__header {
  background-color: #c0c0c0;
}
.cost-title {
  margin: 20px 0;
}
</style>
