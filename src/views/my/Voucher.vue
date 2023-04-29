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
      <el-button type="success" around @click="showTrade">兑换</el-button>
      <el-button type="danger" around @click="showAddress">充值</el-button>
      <el-button type="primary" around @click="withdrawalVisible = true"
        >提现</el-button
      >
      <el-button type="warning" around @click="ask">提现查询</el-button>
    </div>
    <div class="check">
      <span @click="dialogFormVisible = true">充值还未到账？点我查询</span>
    </div>
    <div v-show="isShowAddress" class="address-container">
      <span>转入地址（bsc链）：{{ address }}</span>
      <i class="el-icon-copy-document" @click="copy(address, $event)"></i>
    </div>
    <div class="coin-list">
      <div class="coin-header">
        <div class="coin-title">币种资产</div>
        <div class="balance-title">余额</div>
        <div class="balance-title">锁仓额</div>
      </div>
      <div class="coin">
        <div class="coin-item" v-for="item in balanceList" :key="item.id">
          <div class="coin-name">{{ item.name }}</div>
          <div class="balance">{{ item.balance.toFixed(3) }}</div>
          <div class="balance">{{ item.lock_balance.toFixed(3) }}</div>
        </div>
      </div>
    </div>
    <div class="cost-list">
      <div class="cost-title">交易记录</div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        height="300"
        v-loading="tableLoading"
      >
        <el-table-column prop="timestamp" label="日期" width="240">
        </el-table-column>
        <el-table-column prop="orderid" label="订单号" width="180">
        </el-table-column>
        <el-table-column prop="type" label="商品名"> </el-table-column>
        <el-table-column prop="token" label="支付币种" width="180">
        </el-table-column>
        <el-table-column prop="amount" label="支付金额"> </el-table-column>
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
      title="充值自助查询"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="checkForm">
        <el-form-item label="hash值" label-width="120">
          <el-input
            v-model="checkForm.hash"
            autocomplete="off"
            placeholder="请输入hash"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCheck">点击查询</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提现"
      :close-on-click-modal="false"
      :visible.sync="withdrawalVisible"
      width="30%"
    >
      <div class="withdrawal_dialog">
        <el-input
          v-model="withdrawalAmount"
          autocomplete="off"
          placeholder="请输入提现数量"
        ></el-input>
        <el-select
          class="price_select"
          v-model="withdrawalCoin"
          clearable
          placeholder="请选择提现币种"
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
        placeholder="请输入提现地址（bsc链）"
      ></el-input>
      <span slot="footer" class="withdrawal-dialog-footer">
        <div class="show-withdrawal">
          <div>到账数量</div>
          <div>
            {{
              withdrawalAmount === '0' || withdrawalAmount === ''
                ? 0 + withdrawalCoin
                : withdrawalAmount - withdrawalCoinNumber + withdrawalCoin
            }}
          </div>
          <div>网络手续费{{ withdrawalCoinNumber + withdrawalCoin }}</div>
        </div>
        <el-button @click="withdrawalVisible = false">取 消</el-button>
        <el-button
          :disabled="withdrawalAmount === '0' || withdrawalAmount === ''"
          type="primary"
          @click="spend"
          >提现</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="提现查询"
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
          <el-table-column prop="timestamp" label="日期" width="160">
          </el-table-column>
          <el-table-column prop="orderid" label="订单号" width="150">
          </el-table-column>
          <el-table-column prop="steem_id" label="用户id" width="100">
          </el-table-column>
          <el-table-column prop="token" label="币种" width="60">
          </el-table-column>
          <el-table-column prop="nums" label="数量" width="100">
          </el-table-column>
          <el-table-column prop="pay" label="支付状态" width="240">
          </el-table-column>
          <el-table-column prop="types" label="审核状态" width="80">
          </el-table-column>
          <el-table-column prop="address" label="提现地址"> </el-table-column>
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
      title="兑换"
      width="50%"
      custom-class="trade_dialog"
      v-loading="tradeLoading"
      element-loading-text="拼命加载中"
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
                <el-option label="busd" value="busd" />
              </el-select>
            </el-form-item>
          </div>

          <div class="from_input">
            <div class="amount_container">
              <!-- <el-form-item prop="exchangeAmount">
                <el-input
                  class="amount_input"
                  style="marginleft: 0"
                  v-model="tradeForm.exchangeAmount"
                  placeholder="请输入兑换数量"
                />
              </el-form-item> -->
              <el-input
                class="amount_input"
                v-model="tradeForm.exchangeAmount"
                @input="amountChange"
              ></el-input>
              <div>
                <span
                  >余额：
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
          <el-button type="primary" :disabled="validateAmount" @click="exchange"
            >兑换</el-button
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
          value: 'busd',
          label: 'busd'
        }
      ],
      radio: 1,
      tradeForm: {
        exchangeAmount: 0,
        exchangeCurrency: 'poys',
        convertCurrency: 'busd',
        convertAmount: 0
      },
      rules: {
        exchangeCurrency: [
          { required: true, message: '请选择兑换币种', trigger: 'change' }
        ],
        convertCurrency: [
          { required: true, message: '请选择可兑换币种', trigger: 'change' }
        ]
      },
      currencyBalances: {
        poys: 10000,
        busd: 20000
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
        Object.keys(res.data.lock_token).forEach((key, i) => {
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
        this.$message.success('兑换成功！')
      }

      this.tradeLoading = false
    },
    maxAmount() {
      this.tradeForm.exchangeAmount =
        this.userInfo.token_num[this.tradeForm.exchangeCurrency]
      switch (this.tradeForm.exchangeCurrency) {
        case 'poys':
          if (this.tradeForm.convertCurrency === 'busd') {
            this.tradeForm.convertAmount = this.tradeForm.exchangeAmount * 0.02
          } else if (this.tradeForm.convertCurrency === 'ofc') {
            this.tradeForm.convertAmount = this.tradeForm.exchangeAmount * 10
          }
          break

        default:
          break
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
          if (this.tradeForm.convertCurrency === 'busd') {
            this.tradeForm.convertAmount = this.tradeForm.exchangeAmount * 0.02
          } else if (this.tradeForm.convertCurrency === 'ofc') {
            this.tradeForm.convertAmount = this.tradeForm.exchangeAmount * 10
          }
          break
        case 'busd':
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
            value: 'busd',
            label: 'busd'
          }
        ]
      } else if (v === 'busd') {
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
        this.$message.error('请输入hash值！')
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
          this.$message.error('失败：记录已存在')
        } else {
          this.$message.success('成功：已记录')
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

      if (!reg.test(Number(this.withdrawalAmount))) {
        this.$message.error('请输入正确数量！')
        return
      }
      if (!this.withdrawalAddress.trim()) {
        this.$message.error('请输入提现地址！')
        return
      }
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
        this.$message.success('提现成功！')
        this.withdrawalCoin = 'ofc'
        this.withdrawalAmount = ''
        this.withdrawalAddress = ''
      }
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
