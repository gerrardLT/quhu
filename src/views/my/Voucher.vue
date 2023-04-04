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
      <el-button type="danger" around @click="showAddress">充值</el-button>
      <el-button type="primary" around @click="spend">提现</el-button>
    </div>
    <div v-show="isShowAddress" class="address-container">
      <span>转入地址：{{ address }}</span>
      <i class="el-icon-copy-document" @click="copy(address, $event)"></i>
    </div>
    <div class="coin-list">
      <div class="coin-header">
        <div class="coin-title">币种资产</div>
        <div class="balance-title">余额</div>
        <div class="balance-title">锁仓额</div>
      </div>
      <div class="coin">
        <div class="coin-item" v-for="item in coinList" :key="item.id">
          <div class="coin-name">{{ item.name }}</div>
          <div class="balance">{{ item.balance }}</div>
          <div class="balance">{{ item.lock_balance }}</div>
        </div>
      </div>
    </div>
    <div class="cost-list">
      <div class="cost-title">交易记录</div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
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
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
import { transactions } from '@/api/user/user'
import { getToken } from '@/utils/auth'
import { transformTime } from '@/utils/tool'
// import { moment } from 'moment'
export default {
  data() {
    return {
      address: '',
      isShowAddress: false,
      tableLoading: false,
      tableData: [
        {
          timestamp: '',
          orderid: '',
          type: '',
          token: '',
          amount: ''
        }
      ]
    }
  },
  computed: {
    coinList() {
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
      const arr = []
      Object.keys(userInfo.lock_token).forEach((key, i) => {
        arr.push({
          name: key,
          balance: userInfo.lock_token[key],
          lock_balance: userInfo.token_num[key],
          id: i
        })
      })
      return arr || []
    },
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    }
  },
  async created() {
    this.tableLoading = true
    const res = await transactions({
      id:
        this.loginType === 'eth'
          ? this.userInfo.eth_account
          : this.userInfo.user,
      token: getToken()
    })
    if (res && res.success) {
      res.data.forEach((element) => {
        console.log(element.timestamp)
        element.timestamp = transformTime(element.timestamp)
      })
      this.tableData = res.data
    }
    this.tableLoading = false
  },
  mounted() {},
  methods: {
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
    spend() {
      this.$message.success('敬请期待！')
    }
  }
}
</script>

<style scoped lang="scss">
.wallet {
  padding: 50px;
  position: relative;
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
