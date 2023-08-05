<template>
  <div class="my_auction_container">
    <div class="top_tab">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane
          class="my_auction_content"
          :label="$t('my_auction.Participating')"
          name="participate"
        >
          <Table
            :list="myParticipateBidList.win || []"
            :sub-tilte="$t('my_auction.win')"
            :type="'win'"
            v-loading="tableLoading"
          >
          </Table>
          <Table
            :list="myParticipateBidList.now || []"
            :sub-tilte="$t('my_auction.progress')"
            :type="'now'"
            v-loading="tableLoading"
          ></Table>
          <Table
            :list="myParticipateBidList.end || []"
            :sub-tilte="$t('my_auction.end')"
            :type="'end'"
            v-loading="tableLoading"
          ></Table>
        </el-tab-pane>
        <el-tab-pane :label="$t('my_auction.my_publish')" name="launch">
          <el-table
            :data="myBidList"
            border
            style="
              width: 100%;
              text-align: center;
              max-height: 500px;
              overflow-y: auto;
            "
            v-loading="tableLoading"
          >
            <el-table-column
              prop="image"
              :label="$t('my_auction.picture')"
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
              :label="$t('my_auction.name')"
              width="180"
            >
              <template slot-scope="scope">
                <div class="history_text" @click="jump(scope.row)">
                  {{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="start_time"
              :label="$t('my_auction.start_time')"
              width="180"
            >
              <template slot-scope="scope">
                {{ transfromTimeZoom(Number(scope.row.start_time * 1000)) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="end_time"
              :label="$t('my_auction.end_time')"
              width="180"
            >
              <template slot-scope="scope">
                {{ transfromTimeZoom(Number(scope.row.end_time * 1000)) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="starting_price"
              :label="$t('my_auction.start_price')"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="increase"
              :label="$t('my_auction.markup')"
              width="80"
            >
            </el-table-column>
            <el-table-column
              prop="coins"
              :label="$t('my_auction.coin')"
              width="80"
            >
            </el-table-column>

            <el-table-column
              prop="address"
              :label="$t('my_auction.view_receive_information')"
              width="200"
            >
              <template slot-scope="scope">
                <div class="history_text">
                  <div class="divider nowrap">
                    {{ $t('my_auction.blockchain') }}：{{
                      scope.row.address.chains || $t('my_auction.no_info')
                    }}
                  </div>
                  <div
                    class="nowrap padding-5"
                    :title="scope.row.address.address"
                  >
                    {{ $t('my_auction.address') }}：{{
                      scope.row.address.address || $t('my_auction.no_info')
                    }}
                  </div>
                </div>
                <!-- <div
                  v-else
                  @click="getAddressInfo(scope.row)"
                  class="history_text"
                >
                  查看收货信息
                </div> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="goods"
              :label="$t('my_auction.shipping_order')"
              width="200"
            >
              <template slot-scope="scope">
                <div class="history_text" v-if="scope.row.goods.txid">
                  <div class="divider">
                    {{ $t('my_auction.blockchain') }}：{{
                      scope.row.goods.chains
                    }}
                  </div>
                  <div
                    class="nowrap divider"
                    style="margin-bottom: 5px"
                    :title="scope.row.goods.txid"
                  >
                    txid：{{ scope.row.goods.txid }}
                  </div>
                  <a
                    class="history_text"
                    :href="scope.row.goods.url"
                    target="blank"
                    >View on Blockbrowser</a
                  >
                </div>
                <div class="history_text" v-else>
                  <span @click="fill(scope.row)">{{
                    $t('my_auction.shipping_order')
                  }}</span>
                  <!-- <span @click="getGoods(scope.row)" class="history_text">
                    获取发货单
                  </span> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('my_auction.status')">
              <template slot-scope="scope">
                <span>{{ scope.row.status }}</span>
                <router-link
                  :to="{
                    path: 'publish',
                    query: {
                      author: scope.row.permlink[0],
                      permlink: scope.row.permlink[1]
                    }
                  }"
                  style="color: #087790; cursor: pointer; margin-left: 10px"
                  v-if="scope.row.status === '审核中'"
                  >{{ $t('my_auction.edit') }}</router-link
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :title="$t('my_auction.shipping_info')"
      :visible.sync="reportVisible"
      :close-on-click-modal="false"
      width="30%"
      center
    >
      <el-input
        :placeholder="$t('my_auction.input_blockchain')"
        v-model="uploadInfo.chains"
      >
      </el-input>
      <el-input
        style="margin-top: 10px"
        :placeholder="$t('my_auction.input_txid')"
        v-model="uploadInfo.txid"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('my_auction.cancel') }}</el-button>
        <el-button type="primary" @click="upload">{{
          $t('my_auction.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  auction_mybid,
  getLaunchdBids,
  get_address,
  goods,
  get_goods
} from '@/api/auction/auction'
import { getToken } from '@/utils/auth'
import { transformTime } from '@/utils/tool'
import Table from './components/table.vue'
export default {
  name: 'MyAuction',
  components: {
    Table
  },
  data() {
    return {
      activeName: 'participate',
      myParticipateBidList: [],
      myBidList: [],
      tableLoading: false,
      reportVisible: false,
      uploadInfo: {
        txid: '',
        chains: ''
      },
      currentRow: [],
      reportAddressVisible: false,
      addressUploadInfo: {
        address: '',
        chains: ''
      },
      currentAddressRow: {}
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
  created() {},
  mounted() {
    if (this.$route.query.currentTab === 'launch') {
      this.$nextTick(() => {
        this.activeName = 'launch'
        this.tabClick({ name: this.activeName })
      })
    } else {
      this.getParticipateList()
    }
  },

  methods: {
    transformTime,
    async getAddressInfo(data) {
      this.tableLoading = true
      const res = await get_address({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        permlink: data.permlink
      })
      if (res && res.success === 'ok') {
        data.address = {
          address: res.data.address || this.$t('my_auction.no_info'),
          chains: res.data.chains || this.$t('my_auction.no_info')
        }
      }
      this.tableLoading = false
    },
    cancel() {
      this.reportVisible = true
      this.uploadInfo = {
        txid: '',
        chains: ''
      }
    },
    fill(data) {
      this.reportVisible = true
      this.currentRow = data
    },
    async upload() {
      this.reportVisible = false
      this.tableLoading = true
      const res = await goods({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        permlink: this.currentRow.permlink,
        txid: this.uploadInfo.txid,
        chains: this.uploadInfo.chains
      })

      if (res && res.success === 'ok') {
        this.$message.success(this.$t('my_auction.register_success_tip'))
        this.uploadInfo = {
          txid: '',
          chains: ''
        }
        this.currentRow.goods = {
          txid: res.data.txid,
          chains: res.data.chains,
          url: res.data.url
        }
      }
      this.tableLoading = false
    },
    async getGoods(data) {
      this.tableLoading = true
      const res = await get_goods({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        permlink: data.permlink
      })
      if (res && res.success === 'ok') {
        if (res.data.txid) {
          data.goods = {
            txid: res.data.txid,
            chains: res.data.chains,
            url: res.data.url
          }
        } else {
          this.$message.warning(this.$t('my_auction.shipping_info_tip'))
        }
      }
      this.tableLoading = false
    },
    jump(data) {
      console.log(data)
      if (data.status !== '审核中') {
        this.$router.push({
          path: '/auctiondetail',
          query: {
            author: data.permlink[0],
            permlink: data.permlink[1]
          }
        })
      }
    },
    transfromTimeZoom(v) {
      const dateStr = v
      const date = new Date(dateStr)
      // const timeDiff = 8 * 60 * 60 * 1000 // 时差为8小时，转换为毫秒
      const dateInGMT8 = new Date(date.getTime())
      return dateInGMT8.toLocaleString()
    },

    tabClick(tab, event) {
      switch (tab.name) {
        case 'participate':
          this.getParticipateList()
          break
        case 'launch':
          this.getMyBidList()
          break
        default:
          break
      }
    },
    async getParticipateList() {
      this.tableLoading = true
      const res = await auction_mybid({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken()
      })

      const dic = {
        view_onlyfun: '审核中',
        bid_onlyfun: '拍卖中',
        end_onlyfun: '拍卖结束'
      }
      if (res && res.success === 'ok') {
        res.data.end.forEach((item) => {
          item.myPrice = item.mybid
          item.status = dic[item.type]
          if (!item.address) {
            item.address = {
              chains: '',
              address: ''
            }
          }
          if (!item.goods) {
            item.goods = {
              item: '',
              txid: '',
              chains: '',
              url: ''
            }
          }
        })
        res.data.win.forEach((item) => {
          item.myPrice = item.mybid
          item.status = dic[item.type]
          if (!item.address) {
            item.address = {
              chains: '',
              address: ''
            }
          }
          if (!item.goods) {
            item.goods = {
              item: '',
              txid: '',
              chains: '',
              url: ''
            }
          }
        })
        res.data.now.forEach((item) => {
          item.myPrice = item.mybid
          item.status = dic[item.type]
          if (!item.address) {
            item.address = {
              chains: '',
              address: ''
            }
          }
          if (!item.goods) {
            item.goods = {
              item: '',
              txid: '',
              chains: '',
              url: ''
            }
          }
        })

        this.myParticipateBidList = res.data
      }
      this.tableLoading = false
    },

    async getMyBidList() {
      this.tableLoading = true
      const dic = {
        view_onlyfun: '审核中',
        bid_onlyfun: '拍卖中',
        end_onlyfun: '拍卖结束'
      }
      const params = {
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        jsonrpc: '2.0',
        method: 'bridge.get_ranked_posts',
        params: {
          sort: 'created',
          tag: 'my_' + this.userInfo.steem_id
        }
      }
      const res = await getLaunchdBids(params)
      if (res && res.result) {
        this.myBidList = []
        res.result.forEach((item) => {
          this.myBidList.push({
            ...item.json_metadata,
            title: item.title,
            permlink: [item.author, item.permlink],
            status: dic[item.json_metadata.tags[0]],
            address: item.address,
            goods: item.goods
          })
        })
        console.log(this.myBidList)
      }
      this.tableLoading = false
    }
  }
}
</script>

<style scoped lang="scss">
body .el-table::before {
  z-index: inherit;
}
::v-deep .el-tabs__item.is-active {
  color: #087790;
}
::v-deep .el-tabs__item:hover {
  color: #087790;
}
::v-deep .el-tabs__active-bar {
  background-color: #087790;
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
.divider {
  border-bottom: 1px solid #e4e4e4;
  padding: 5px 0;
}
.my_auction_container {
  margin-left: 20px;
}
.padding-5 {
  padding-top: 5px;
}
</style>
