<template>
  <div class="table_container">
    <div class="sub_title">{{ subTilte }}</div>
    <el-table
      :data="list"
      border
      style="
        width: 100%;
        text-align: center;
        max-height: 500px;
        overflow-y: auto;
      "
    >
      <el-table-column
        prop="image"
        :label="$t('auction_table.picture')"
        width="80"
      >
        <template slot-scope="scope">
          <img
            style="width: 40px; height: 40px; border-radius: 50%"
            :src="scope.row.image"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        :label="$t('auction_table.name')"
        width="180"
      >
        <template slot-scope="scope">
          <router-link
            class="history_text"
            :to="{
              path: '/auctiondetail',
              query: {
                author: scope.row.permlink[0],
                permlink: scope.row.permlink[1]
              }
            }"
            >{{ scope.row.title }}</router-link
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="myPrice"
        :label="$t('auction_table.my_history')"
        width="180"
      >
        <template slot-scope="scope">
          <el-popover placement="right" width="400" trigger="click">
            <el-table :data="scope.row.mybid">
              <el-table-column
                width="200"
                property="timestamp"
                :label="$t('auction_table.date')"
              >
                <template slot-scope="scope">
                  {{ transformTime(Number(scope.row.timestamp)) }}
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                property="price"
                :label="$t('auction_table.price')"
              ></el-table-column>
              <el-table-column
                width="100"
                property="coins"
                :label="$t('auction_table.coin')"
              ></el-table-column>
            </el-table>
            <div class="history_text" slot="reference">
              {{ $t('auction_table.view_history') }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="starting_price"
        :label="$t('auction_table.start_price')"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="increase"
        :label="$t('auction_table.maxup')"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="coins"
        :label="$t('auction_table.coin')"
        width="80"
      >
      </el-table-column>

      <el-table-column
        prop="goods"
        :label="$t('auction_table.view_logistics')"
        width="200"
        v-if="type === 'win'"
      >
        <template slot-scope="scope">
          <div class="history_text">
            <div class="divider">
              {{ $t('auction_table.blockchain') }}：{{
                scope.row.goods.chains || $t('auction_table.no_info')
              }}
            </div>
            <div class="nowrap divider" style="margin-bottom: 5px">
              txid：{{ scope.row.goods.txid || $t('auction_table.no_info') }}
            </div>
            <a class="history_text" :href="scope.row.goods.url" target="blank"
              >View on Blockbrowser</a
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        :label="$t('auction_table.register_address')"
        width="200"
      >
        <template slot-scope="scope">
          <div
            class="history_text"
            v-if="scope.row.status === '拍卖结束' && scope.row.address.address"
          >
            <div class="divider">
              {{ $t('auction_table.blockchain') }}：{{
                scope.row.address.chains
              }}
            </div>
            <div style="padding-top: 5px">
              {{ $t('auction_table.address') }}：{{ scope.row.address.address }}
            </div>
          </div>
          <div
            class="history_text"
            v-if="type === 'win' && !scope.row.address.address"
          >
            <div @click="openAddress(scope.row)">
              {{ $t('auction_table.fill_receive_address') }}
            </div>
          </div>
          <div v-if="type !== 'win'">{{ $t('auction_table.auction_tip') }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="confirm" :label="$t('auction_table.confirm')">
        <template slot-scope="scope">
          <div class="history_text" v-if="type === 'win' && !scope.row.confirm">
            <el-popconfirm
              :title="$t('auction_table.confirm_tip')"
              @confirm="confirmGoods(scope.row)"
            >
              <div slot="reference">{{ $t('auction_table.confirm') }}</div>
            </el-popconfirm>
          </div>
          <div v-if="type === 'win' && scope.row.confirm">
            {{ $t('auction_table.confirmed') }}
          </div>
          <div v-if="type !== 'win'">{{ $t('auction_table.win_confirm') }}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="$t('auction_table.register_info')"
      :visible.sync="reportAddressVisible"
      :close-on-click-modal="false"
      width="30%"
      center
    >
      <el-input
        :placeholder="$t('auction_table.block_tip')"
        v-model="addressUploadInfo.chains"
      >
      </el-input>
      <el-input
        style="margin-top: 10px"
        :placeholder="$t('auction_table.address_tip')"
        v-model="addressUploadInfo.address"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddress">{{
          $t('auction_table.cancel')
        }}</el-button>
        <el-button type="primary" @click="uploadAddress">{{
          $t('auction_table.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { transformTime } from '@/utils/tool'
import { upload_address, confirm } from '@/api/auction/auction'
import { getToken } from '@/utils/auth'
export default {
  name: 'Write',
  props: {
    list: {
      type: Array,
      required: true
    },
    subTilte: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      reportAddressVisible: false,
      addressUploadInfo: {
        address: '',
        chains: ''
      },
      currentAddressRow: {}
    }
  },
  async created() {},
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
    transformTime,
    cancelAddress() {
      this.reportAddressVisible = false
      this.addressUploadInfo = {
        address: '',
        chains: ''
      }
    },
    async uploadAddress() {
      const res = await upload_address({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        permlink: this.currentAddressRow.permlink,
        address: this.addressUploadInfo.address,
        chains: this.addressUploadInfo.chains
      })
      if (res && res.success === 'ok') {
        this.$message.success(this.$t('auction_table.register_success_tip'))
        this.addressUploadInfo = {
          address: '',
          chains: ''
        }
        this.currentAddressRow.address = {
          address: res.data.address,
          chains: res.data.chains
        }
      }
      this.reportAddressVisible = false
    },
    async confirmGoods(data) {
      const res = await confirm({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        permlink: data.permlink
      })
      if (res && res.success === 'ok') {
        this.$message.success(this.$t('auction_table.confirm_success_tip'))
        data.confirm = true
      }
    },
    openAddress(data) {
      this.reportAddressVisible = true
      this.currentAddressRow = data
    }
  }
}
</script>

<style scoped lang="scss">
.sub_title {
  margin-bottom: 20px;
  margin-top: 20px;
}
.divider {
  border-bottom: 1px solid #e4e4e4;
  padding: 5px 0;
}
body .el-table::before {
  z-index: inherit;
}
::v-deep .get_info {
  cursor: pointer;
}
::v-deep .el-table .cell {
  text-align: center;
}
::v-deep .history_text {
  cursor: pointer;
  color: #087790;
}
.nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
::v-deep .history_list {
  position: absolute;
  top: 0;
  left: 180px;
  z-index: 9999 !important;
}
</style>
