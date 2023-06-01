<template>
  <div class="my_auction_container">
    <div class="top_tab">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane
          class="my_auction_content"
          label="正在参与"
          name="participate"
        >
          <el-table
            :data="myParticipateBidList"
            border
            style="width: 100%; text-align: center"
            v-loading="tableLoading"
          >
            <el-table-column prop="image" label="商品图" width="80">
              <template slot-scope="scope">
                <img
                  style="width: 40px; height: 40px; border-radius: 50%"
                  :src="scope.row.image"
                  alt=""
                />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="商品名" width="180">
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
            <el-table-column prop="myPrice" label="我的出价历史" width="180">
              <template slot-scope="scope">
                <el-popover placement="right" width="400" trigger="click">
                  <el-table :data="scope.row.mybid">
                    <el-table-column
                      width="200"
                      property="timestamp"
                      label="日期"
                    >
                      <template slot-scope="scope">
                        {{ transformTime(Number(scope.row.timestamp)) }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      width="100"
                      property="price"
                      label="价格"
                    ></el-table-column>
                    <el-table-column
                      width="100"
                      property="coins"
                      label="币种"
                    ></el-table-column>
                  </el-table>
                  <div class="history_text" slot="reference">查看出价历史</div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="starting_price" label="起拍价" width="180">
            </el-table-column>
            <el-table-column prop="increase" label="最小加价" width="180">
            </el-table-column>
            <el-table-column prop="coins" label="币种" width="180">
            </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="我发起的" name="launch">
          <el-table
            :data="myBidList"
            border
            style="width: 100%; text-align: center"
            v-loading="tableLoading"
          >
            <el-table-column prop="image" label="商品图" width="80">
              <template slot-scope="scope">
                <img
                  style="width: 40px; height: 40px; border-radius: 50%"
                  :src="scope.row.image"
                  alt=""
                />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="商品名" width="180">
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
            <el-table-column prop="start_time" label="开始时间" width="180">
              <template slot-scope="scope">
                {{ transfromTimeZoom(Number(scope.row.start_time * 1000)) }}
              </template>
            </el-table-column>
            <el-table-column prop="end_time" label="结束时间" width="180">
              <template slot-scope="scope">
                {{ transfromTimeZoom(Number(scope.row.end_time * 1000)) }}
              </template>
            </el-table-column>
            <el-table-column prop="starting_price" label="起拍价" width="180">
            </el-table-column>
            <el-table-column prop="increase" label="最小加价" width="180">
            </el-table-column>
            <el-table-column prop="coins" label="币种" width="180">
            </el-table-column>
            <el-table-column prop="status" label="状态">
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
                  >编辑</router-link
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { auction_mybid, getLaunchdBids } from '@/api/auction/auction'
import { getToken } from '@/utils/auth'
import { transformTime } from '@/utils/tool'
export default {
  name: 'MyAuction',
  data() {
    return {
      activeName: 'participate',
      myParticipateBidList: [],
      myBidList: [],
      tableLoading: false
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
    this.getParticipateList()
  },

  methods: {
    transformTime,
    edit() {},
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
        res.data.forEach((item) => {
          item.myPrice = item.mybid
          item.status = dic[item.type]
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
            status: dic[item.json_metadata.tags[0]]
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
::v-deep .el-table .cell {
  text-align: center;
}
::v-deep .history_text {
  cursor: pointer;
  color: #087790;
}
::v-deep .history_list {
  position: absolute;
  top: 0;
  left: 180px;
  z-index: 9999 !important;
}
</style>
