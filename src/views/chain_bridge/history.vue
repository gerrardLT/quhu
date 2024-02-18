<template>
  <div class="history_container">
    <div class="title">
      <div style="position: absolute; top: 28px; left: 10px">
        <img :src="fromData.net.icon" class="logo" alt="" />
        <el-select :popper-append-to-body="false" v-model="AddressValue" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
          <img :src="fromData.net.icon" style="top:12px;left:20px"  class="logo" alt="" />
        </el-select>
      </div>
      <div class="title_center">
        <span @click="getSearchData" class="active">{{ $t('bridge.trade_record') }}</span>
      </div>
    </div>
    <div v-if="historyList">
      <div class="record-page">
        <el-table
          :data="searchData"
          stripe
          style="width: 100%"
          v-loading="searchLoading"
          :header-cell-style="{
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '14px',
            backgroundColor: 'rgb(27, 34, 54)'
          }"
          :cell-style="{
            color: 'rgba(255, 255, 255)',
            fontSize: '14px',
            backgroundColor: 'rgb(20, 25, 40)'
          }"
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
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="types"
            :label="$t('voucher.audit_status')"
            width="120"
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
          class="pagination"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { transformTime } from '@/utils/tool'
import { getBridgeHistory } from '@/api/bridge/bridge'
export default {
  name: 'BridgeHistory',
  components: {},
  props: {
    fromData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      options: [
        {
          value: 'all',
          label: this.$t('bridge.all_address')
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
      AddressValue:this.$t('bridge.all_address'),
      searchLoading: false,
      searchPageInfo: {},
      currentPage: 1,
      currentSearchPage: 1,
      pagesize: 10,
      historyList: []
    }
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    }
  },
  created() {
    this.getSearchData(1)
  },
  mounted() {},
  methods: {
    async getSearchData(page) {
      this.searchLoading = true
      const params = {
        id: sessionStorage.getItem('walletAccount') || '',
        page
      }
      const res = await getBridgeHistory(params)
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
    handleCurrentChangeSearch(v) {
      this.getSearchData(v)
    }
  },
  watch: {
    '$i18n.locale': {
      handler(newVal, oldVal) {
        this.options = [
        {
          value: 'all',
          label: this.$t('bridge.all_address')
        }
        ]
        this.AddressValue = this.$t('bridge.all_address')
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.history_container {
    .pagination{
        position: absolute;
        bottom: 20px;
    }
  .logo {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 6px;
    left: 8px;
    z-index: 100;
  }
  .title_center {
    position: absolute;
    top: 28px;
    left: 48%;

    span {
      text-transform: capitalize;
      display: inline-block;
      line-height: 20px;
      font-size: 16px;
      cursor: pointer;
    }
    .active{
        color: white;
    //   border-bottom: 2px solid white;
    }
    span:hover {
      color: white;
    //   border-bottom: 2px solid white;
    }
  }
}
::v-deep .popper__arrow{
    display: none;
}
::v-deep .el-select-dropdown{
    background: rgb(21, 28, 46);
    border-radius: 12px;
    border: 1px solid rgb(36, 45, 63);
    // top: 76px !important;
}

::v-deep .el-loading-mask{
    background-color: rgb(21, 28, 46,0.8);
}
::v-deep .el-pagination__total{
    color: #fff;
}
::v-deep .el-pagination__jump{
    color: #fff;
}

::v-deep .title .el-input__inner {
  width: 158px;
  height: 34px;
  padding-left: 56px;
  background: rgb(21, 28, 46);
    border-radius: 8px;
    border: 1px solid rgb(36, 45, 63);
    color: #fff;
}
::v-deep .el-select-dropdown__item{
    background: rgb(21, 28, 46);
    color: #fff;
    display: flex;
    justify-content: center;
    margin: 0 10px;
    font-size: 14px;

}
::v-deep .el-select-dropdown__item span {
    margin-left: 10px;
}
::v-deep .el-select-dropdown__item:hover{
    background-image: linear-gradient(135deg, rgb(30, 204, 203), rgb(80, 120, 234));
    border-radius: 4px;
    padding: 0 5px;

}
::v-deep .el-select-dropdown__item.selected{
    background-image: linear-gradient(135deg, rgb(30, 204, 203), rgb(80, 120, 234));
    border-radius: 4px;
    padding: 0 5px;
}
::v-deep  .el-select:hover .el-input__inner{
    border-color:rgb(36, 45, 63);
}
::v-deep .el-select .el-input .el-select__caret{
    font-size: 18px;
    font-weight: bold;
    color: #fff;
}
::v-deep .el-dialog__body {
  padding: 0;
  margin-top: 30px;
}

::v-deep .el-table__body-wrapper {
  background-color: rgb(20, 25, 40);
}
::v-deep .record-page .el-table__row > td {
  border: none;
}

/* 去除上边框 */
::v-deep .record-page .el-table th.is-leaf {
  border: none;
}

/* 去除下边框 */
::v-deep .record-page .el-table::before {
  height: 0;
}

/**
隐藏el-table的header的滚动条
 */
::v-deep .record-page .el-table__header .gutter {
  background-color: rgb(27, 34, 54) !important;
}

/*隐藏el-table的body的y轴滚动条*/
// ::v-deep .record-page .el-table--scrollable-y .el-table__body-wrapper {
//   background-color: #011946 !important;
// }

::v-deep .record-page .el-table__body-wrapper::-webkit-scrollbar {
  width: 0; /*滚动条宽度*/
}

/*鼠标滑过td上作用的样式，ie6不支持:hover伪类属性，如果是ie6要写成tr.over样式*/
.record-page .el-table tbody tr:hover > td {
  background-color: #015476 !important;
}
</style>
