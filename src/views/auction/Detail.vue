<template>
  <div class="detail_container">
    <div class="top">
      <div class="left_image animate__animated animate__fadeInDown">
        <div class="countdown">
          <el-statistic
            v-if="auctionDetail.end_time * 1000 > currentDate"
            :value="auctionDetail.end_time * 1000"
            time-indices
            format="HH:mm:ss"
          >
          </el-statistic>
          <div style="color: #fff" v-else>
            {{ $t('auction_detail.expire') }}
          </div>
        </div>
        <el-carousel indicator-position="none" height="350px">
          <el-carousel-item v-for="(item, i) in auctionDetail.image" :key="i">
            <img class="show_img" :src="item" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="mid_operation animate__animated animate__fadeInDown">
        <div class="title_container">
          <div class="title">
            {{ auctionDetail.title }}
          </div>
          <div
            class="bid_tips"
            :title="$t('auction_detail.tips')"
            v-if="auctionDetail.effectiveness"
          >
            {{ $t('auction_detail.tips') }}
          </div>
          <div class="starting_price">
            <span
              >{{ $t('auction_detail.start_price') }}：{{
                auctionDetail.starting_price
              }}</span
            >
            <span>&nbsp;{{ auctionDetail.coins }}</span>
          </div>
        </div>

        <div class="bid">
          <div class="current_price">
            <span class="text">{{ $t('auction_detail.current_price') }}：</span>
            <span class="amount">{{
              auctionDetail.new_price + ' ' + auctionDetail.coins
            }}</span>
          </div>
          <div class="increment">
            <span class="mini_price">{{ $t('auction_detail.markup') }}：</span>
            <span>{{ auctionDetail.increase }}</span>
          </div>
          <div class="premium" v-if="!auctionDetail.effectiveness">
            <span class="premium_text"
              >{{ $t('auction_detail.commission') }}：</span
            >
            <span>50%</span>
          </div>
          <div class="premium" v-else>
            <span class="premium_text"
              >{{ $t('auction_detail.auction_people_account') }}：</span
            >
            <span
              >{{ auctionDetail.bidders
              }}{{ $t('auction_detail.person') }}</span
            >
          </div>
          <div class="hot_select" v-if="auctionDetail.effectiveness">
            <div class="period_column item">
              <el-select
                v-model="period.column"
                :clearable="false"
                :placeholder="$t('auction_detail.select_column')"
                @change="changeColumn"
              >
                <el-option
                  v-for="item in auctionDetail.columnList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <!-- <div class="period_date item">
              <el-select
                v-model="period.date"
                clearable
                placeholder="请选择竞拍日期"
                @change="$forceUpdate()"
              >
                <el-option
                  v-for="item in auctionDetail.dateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div> -->
            <div class="period_time item">
              <el-select
                v-model="period.time"
                :clearable="false"
                :placeholder="$t('auction_detail.select_period')"
                @change="changeTime"
              >
                <el-option
                  v-for="item in auctionDetail.timeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>

          <div
            class="operation"
            v-if="auctionDetail.end_time * 1000 > currentDate"
          >
            <el-input
              class="bid_input"
              :placeholder="$t('auction_detail.input_auction_number')"
              v-model="bidAmount"
              clearable
            >
            </el-input>
            <div class="bid_btn" @click="handlePlaceBid">
              {{ $t('auction_detail.offer') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="middle">
      <div class="mid_left">
        <div class="tab_list animate__animated animate__fadeInDown">
          <div
            :class="{ tab: true, active: item.id === activeTab }"
            v-for="item in tabList"
            :key="item.id"
            @click="toggleTab(item)"
          >
            <!-- <svg
            :style="{
              fill: '#087790',
              width: '20px',
              height: '20px',
              marginRight: '5px'
            }"
          >
            <use
              :xlink:href="'#icon-auction-' + item.icon"
              rel="external nofollow"
            />
          </svg> -->
            <span :title="item.type"> {{ item.type }} </span>
          </div>
        </div>
        <div class="mid_content animate__animated animate__fadeInUp">
          <div
            v-show="activeTab === 0"
            v-html="auctionDetail.body && auctionDetail.body.body"
          ></div>
          <div v-show="activeTab === 1">
            <div
              class="bid-list-area"
              v-infinite-scroll="load"
              :infinite-scroll-immediate="false"
              :infinite-scroll-distance="0"
            >
              <div v-if="bidHistory.length > 0">
                <div
                  class="bid-list animate__animated animate__fadeInUp"
                  v-for="(item, i) in bidHistory"
                  :key="i"
                >
                  <!-- <img :src="defaultAvatar" class="history-img" alt="" /> -->
                  <div class="content">
                    <div class="history-id">{{ item.steem_id }}</div>
                    <div class="history-price">
                      {{ item.price }} {{ item.coins }}
                    </div>
                  </div>
                  <div class="history-time">
                    {{ transformTime(Number(item.timestamp)) }}
                  </div>
                </div>
              </div>
              <el-empty
                v-else
                :description="$t('auction_detail.no_data')"
              ></el-empty>
            </div>
          </div>
          <div v-show="activeTab === 2">
            <List :scaleRadio="0.8" :permlink="$route.query"></List>
          </div>
        </div>
      </div>

      <div class="mid_right" v-show="false">
        <div class="hot-banner animate__animated animate__fadeInUp">
          <div class="banner-content">
            <span>CARS</span>
            <h3>标题</h3>
            <div class="auction-bid-btn">详情</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  get_auction_detail,
  auction_bid,
  auction_bidlist
} from '@/api/auction/auction'
import { transformTime } from '@/utils/tool'
import List from './components/list.vue'
import { getToken } from '@/utils/auth'
const defaultAvatar = require(`../../assets/defaultAvatarUrl.png`)
import { Loading } from 'element-ui'
import moment from 'moment'
export default {
  name: 'AuctionDetail',
  components: {
    List
  },
  data() {
    return {
      period: {
        time: '',
        column: ''
      },
      lockReconnect: false, // 为true时，是心跳重连的websocket断开连接
      currentDate: Date.now(),
      historyPage: 1,
      defaultAvatar,
      realTimeData: {},
      bidAmount: '',
      ws: null,
      auctionDetail: {
        new_price: 0
      },
      bidHistory: [],
      activeTab: 0,
      tabList: [
        {
          id: 0,
          type: this.$t('auction_detail.description'),
          icon: ''
        },
        {
          id: 1,
          type: this.$t('auction_detail.history'),
          icon: ''
        },
        {
          id: 2,
          type: this.$t('auction_detail.other_auction'),
          icon: ''
        }
      ]
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
  async created() {
    const permlink = this.$route.query
    this.getAuctionDetail(permlink)
  },
  mounted() {
    // this.getBidHistory(this.historyPage, 'init')
    this.initWebSocket()
  },
  destroyed() {
    this.lockReconnect = false
    // 组件销毁时，关闭与服务器的连接
    if (this.ws) {
      this.ws.close() // 离开路由之后断开websocket连接
    }
    clearInterval(this.timeoutObj)
    // clearTimeout(this.serverTimeoutObj)
  },
  methods: {
    transformTime,
    changeTime() {
      this.$forceUpdate()
      if (!this.period.column) {
        this.$message.warning(this.$t('auction_detail.select_column'))
        return
      }
      this.getAuctionDetail({
        author: this.period.time.split('~')[0],
        permlink: this.period.time.split('~')[1]
      })
      this.getBidHistory(1)
    },
    changeColumn() {
      this.$forceUpdate()

      if (!this.period.time) {
        this.$message.warning(this.$t('auction_detail.select_period'))
        return
      }
      this.getAuctionDetail({
        author: this.period.time.split('~')[0],
        permlink: this.period.time.split('~')[1]
      })
      if (this.activeTab === 1) {
        this.getBidHistory(1)
      }
    },
    load() {
      this.getBidHistory(this.historyPage)
      this.historyPage++
    },
    async getBidHistory(page, type) {
      const params = this.$route.query
      let permlink = []

      if (this.auctionDetail.effectiveness) {
        if (!this.period.column) {
          this.$message.warning(this.$t('auction_detail.select_column'))
          return
        }
        if (!this.period.time) {
          this.$message.warning(this.$t('auction_detail.select_period'))
          return
        }
        permlink = [
          this.period.time.split('~')[0],
          this.period.time.split('~')[1]
        ]
      } else {
        permlink = [params.author, params.permlink]
      }
      const res = await auction_bidlist({
        page,
        permlink
      })
      if (res && res.success === 'ok') {
        console.log(page)
        if (page === 1) {
          this.bidHistory = res.data
          if (this.bidHistory.length > 0) {
            this.auctionDetail.new_price = this.bidHistory[0].price
          }
        } else {
          this.bidHistory.concat(res.data)
        }
      }
    },
    toggleTab(item) {
      this.activeTab = item.id
      switch (item.id) {
        case 0:
          break
        case 1:
          this.getBidHistory(1)
          break
        case 2:
          break
        default:
          break
      }
    },
    async handlePlaceBid() {
      const reg = /^[1-9]\d*$/

      const params = this.$route.query
      let permlink = []
      if (!this.bidAmount.trim()) {
        this.$message.warning(this.$t('auction_detail.input_price'))
        return
      }
      if (!reg.test(this.bidAmount)) {
        this.$message.warning(this.$t('auction_detail.input_number'))
        return
      }
      if (this.auctionDetail.effectiveness) {
        if (!this.period.column) {
          this.$message.warning(this.$t('auction_detail.select_column'))
          return
        }
        if (!this.period.time) {
          this.$message.warning(this.$t('auction_detail.select_period'))
          return
        }
      }

      this.$loading.show()

      if (this.auctionDetail.effectiveness) {
        permlink = [
          this.period.time.split('~')[0],
          this.period.time.split('~')[1]
        ]
      } else {
        permlink = [params.author, params.permlink]
      }
      const res = await auction_bid({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        price: this.bidAmount,
        subscriptions_name: this.period.column,
        permlink
      })
      if (res && res.success === 'ok') {
        this.$message.success('出价成功！')
        if (this.activeTab === 1) {
          this.getBidHistory(1)
        }
        this.bidAmount = ''
      }
      this.$loading.hide()
    },
    initWebSocket() {
      if (window.WebSocket) {
        const self = this
        const hostname = window.location.hostname
        let ws = new WebSocket('wss://' + hostname + '/ws') // 建立连接
        // let ws = new WebSocket('ws://app.onlyfun.city:668/ws')

        this.ws = ws
        // 服务器连接成功
        ws.onopen = function () {
          console.log('连接成功')
          if (self.auctionDetail.effectiveness) {
            ws.send(
              JSON.stringify({
                item: self.period.time.split('~')[1]
              })
            )
          } else {
            ws.send(JSON.stringify({ item: self.$route.query.permlink }))
          }

          self.longstart()
        }
        // 服务器连接关闭
        ws.onclose = function () {
          console.log('连接关闭')
        }
        // 服务器连接出错
        ws.onerror = function () {
          console.log('连接出错')
        }
        // 解析信息
        ws.onmessage = function (e) {
          console.log(e, e.data, '接收数据')
          self.longstart()
          try {
            let data = JSON.parse(e.data)
            if (data && data.price) {
              self.auctionDetail.new_price = data.price
              self.auctionDetail.end_time = data.end_time
              if (self.auctionDetail.bidders) {
                self.auctionDetail.bidders++
              }
            }
            if (data.type === 'get_end_time') {
              self.auctionDetail.end_time = data.end_time
            }
          } catch (err) {
            return
          }
        }
      }
    },
    longstart() {
      clearInterval(this.timeoutObj)
      // clearTimeout(this.serverTimeoutObj)
      this.timeoutObj = setInterval(() => {
        console.log('重置监测心跳')
        this.ws.send('heart')
        // this.serverTimeoutObj = setTimeout(() => {
        //   this.lockReconnect = true // 心跳重连设置为true
        //   console.log('后台挂掉，没有心跳了....')
        //   console.log('打印websocket的地址:' + this.ws)
        //   this.ws.close()
        // }, 2000)
      }, 45000)
    },
    async getAuctionDetail(params) {
      const res = await get_auction_detail({
        id: 1,
        jsonrpc: '2.0',
        method: 'call',
        params: [
          'database_api',
          'get_content',
          [params.author, params.permlink]
        ]
      })
      if (res && res.result) {
        let price = 0
        if (this.bidHistory.length > 0) {
          price = this.bidHistory[0].price
        }
        const obj = Object.assign(
          {
            title: res.result.title,
            body: this.eval(res.result.body),
            new_price: price,
            bidders: res.result.bidders
          },
          this.eval(res.result.json_metadata)
        )
        this.auctionDetail = obj

        let timeArr = []
        JSON.parse(sessionStorage.getItem('hotList')).forEach((element) => {
          timeArr.push({
            label:
              transformTime(element.effectiveness[0]) +
              '~' +
              transformTime(element.effectiveness[1]),
            value: element.permlink[0] + '~' + element.permlink[1]
          })
        })

        let columnList = this.userInfo.buy_article.my.map((element) => {
          return { value: element, label: element }
        })

        this.auctionDetail.columnList = columnList
        this.auctionDetail.timeList = timeArr
        console.log(this.auctionDetail)
      }
    },
    eval(fn) {
      const Fn = Function
      return new Fn('return ' + fn)()
    }
  },
  watch: {
    auctionDetail: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-statistic .con {
  color: #fff;
}
::v-deep .el-input--suffix .el-input__inner {
  width: 300px;
}
::-webkit-scrollbar {
  width: 0.25rem;
  height: 0.25rem;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0.375rem #999;
  border-radius: 0.625rem;
  background-color: #f5f5f5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 0.625rem;
  box-shadow: inset 0 0 0.375rem #999;
  background-color: #333;
}
.detail_container {
  padding: 0 10%;
  .top {
    display: flex;
    justify-content: center;
    .left_image {
      border-radius: 10px !important;
      width: 350px;
      height: 350px;
      .show_img {
        width: 350px;
        height: 350px;
      }
      .countdown {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        background-color: #000;
        text-align: center;
        justify-content: center;
      }
    }
    .mid_operation {
      width: calc(100% - 370px);
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title_container {
        margin-bottom: 15px;
        height: 80px;
        .title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 200px;
        }
        .bid_tips {
          max-width: 500px;
          white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
          font-size: 12px;
          margin-bottom: 10px;
        }
      }
    }

    .bid {
      box-shadow: 5px 2px 30px rgba(0, 0, 0, 0.06);
      border-radius: 5px;
      background: #fff;
      padding: 15px;
      color: #696969;
      height: 275px;
      min-width: 550px;
      max-width: 650px;
      position: relative;

      .current_price {
        display: flex;
        margin-bottom: 10px;
        .text {
          display: inline-block;
          min-width: 100px;
          color: #171d1c;
          font-weight: 700;
          font-size: 18px;
        }
        .amount {
        }
      }
      .increment {
        display: flex;
        margin-bottom: 10px;
        .mini_price {
          display: inline-block;
          min-width: 100px;
          color: #171d1c;
          font-weight: 700;
          font-size: 18px;
        }
      }
      .premium {
        margin-bottom: 40px;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -12px;
          width: 52px;
          height: 3px;
          border-radius: 5px;
          background-color: #087790;
        }
        &::after {
          content: '';
          position: absolute;
          left: 56px;
          bottom: -12px;
          width: 4px;
          height: 3px;
          border-radius: 5px;
          background-color: #087790;
        }
        .premium_text {
          display: inline-block;
          min-width: 100px;
          color: #171d1c;
          font-weight: 700;
          font-size: 18px;
        }
      }
      .hot_select {
        display: flex;
        align-items: left;
        flex-direction: column;
        margin-bottom: 10px;
        .item {
          width: 300px;
        }
        .period_column {
          margin-bottom: 10px;
        }
      }
      .operation {
        display: flex;
        // justify-content: space-around;
        position: absolute;
        bottom: 15px;
        left: 15px;
        .bid_input {
          width: 75%;
        }
        .bid_btn {
          font-size: 16px;
          font-weight: 600;
          padding: 10px 40px;
          margin-left: 90px;
          width: calc(20% - 90px);
          min-width: 100px;
          background: #1f2230;
          color: #fff;
          position: relative;
          z-index: 1;
          white-space: nowrap;
          border-radius: 100px;
          text-align: center;
          display: inline-block;
          text-decoration: none;
          transition: all 0.4s ease;
          text-transform: capitalize;
          font-family: saira, sans-serif;
          cursor: pointer;
        }
        .bid_btn::before {
          width: 100%;
          height: 100%;
          content: '';
          margin: auto;
          position: absolute;
          top: 0;
          left: 0;
          background: #087790;
          -webkit-transition: all 0.52s;
          transition: all 0.52s;
          z-index: -1;
          border-radius: 100px;
        }
        .bid_btn::after {
          width: 100%;
          height: 100%;
          content: '';
          margin: auto;
          position: absolute;
          top: 0;
          left: 0;
          background: #087790;
          -webkit-transition: all 0.52s;
          transition: all 0.52s;
          z-index: -1;
          border-radius: 100px;
        }
        .bid_btn:hover {
          color: #fff;
          text-decoration: none;
        }
        .bid_btn:hover::before {
          -webkit-transform: rotateX(90deg);
          transform: rotateX(90deg);
        }

        .bid_btn:hover::after {
          -webkit-transform: rotateY(90deg);
          transform: rotateY(90deg);
        }
      }
    }
  }
  .middle {
    display: flex;
    .mid_left {
      width: 75%;

      margin-top: 40px;
      .tab_list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .tab {
          min-width: 80px;
          margin-right: 40px;
          text-align: center;
          padding: 15px 30px;
          border-radius: 10px;
          color: #1f2230;
          background-color: #fff;
          cursor: pointer;
          font-size: 18px;
          font-weight: 500;
          box-shadow: 3px 5px 20px rgba(0, 0, 0, 0.06);
          &:hover {
            background-color: #087790;
            color: #fff;
          }
        }
        .active {
          background-color: #087790;
          color: #fff;
        }
      }
      .mid_content {
        padding: 20px 0;
        .bid-list-area {
          max-height: 500px;
          min-height: 350px;
          min-width: 500px;
          overflow-y: auto;
          background: #fff;
          -webkit-box-shadow: 3px 5px 20px rgba(0, 0, 0, 0.06);
          box-shadow: 3px 5px 20px rgba(0, 0, 0, 0.06);
          border-radius: 0 0 5px 5px;
          padding: 20px 20px;
          .bid-list {
            display: flex;
            border-bottom: 1px solid #eee;
            padding: 20px 0;
            position: relative;
            align-items: center;
            .history-img {
              width: 50px;
              height: 50px;
              border-radius: 0 0 5px 5px;
              margin-right: 10px;
            }
            .history-id {
              font-size: 18px;
              font-weight: 600;
              color: #1f2230;
              margin-bottom: 3px;
              font-family: saira, sans-serif;
              cursor: pointer;
            }
            .history-price {
              font-size: 16px;
              font-weight: 500;
              color: #696969;
              font-family: inter, sans-serif;
            }
            .history-time {
              position: absolute;
              right: 10px;
            }
          }
        }
      }
    }
    .mid_right {
      margin-top: 40px;
      margin-left: 20px;
      width: calc(40% - 10px);
      .hot-banner {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        background-image: linear-gradient(
            90deg,
            rgba(31, 34, 48, 0.75),
            rgba(31, 34, 48, 0.75)
          ),
          url('../../assets/fox-login.png');
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        border-radius: 5px;
        .banner-content {
          text-align: center;
        }
        .auction-bid-btn {
          font-size: 16px;
          padding: 5px 40px;
          background: #1f2230;
          color: #fff;
          position: relative;
          z-index: 1;
          white-space: nowrap;
          border-radius: 100px;
          text-align: center;
          display: inline-block;
          text-decoration: none;
          transition: all 0.4s ease;
          text-transform: capitalize;
          font-family: saira, sans-serif;
          cursor: pointer;
        }
        .auction-bid-btn::before {
          width: 100%;
          height: 100%;
          content: '';
          margin: auto;
          position: absolute;
          top: 0;
          left: 0;
          background: #087790;
          -webkit-transition: all 0.52s;
          transition: all 0.52s;
          z-index: -1;
          border-radius: 100px;
        }
        .auction-bid-btn::after {
          width: 100%;
          height: 100%;
          content: '';
          margin: auto;
          position: absolute;
          top: 0;
          left: 0;
          background: #087790;
          -webkit-transition: all 0.52s;
          transition: all 0.52s;
          z-index: -1;
          border-radius: 100px;
        }
        .auction-bid-btn:hover {
          color: #fff;
          text-decoration: none;
        }
        .auction-bid-btn:hover::before {
          -webkit-transform: rotateX(90deg);
          transform: rotateX(90deg);
        }

        .auction-bid-btn:hover::after {
          -webkit-transform: rotateY(90deg);
          transform: rotateY(90deg);
        }
      }
    }
  }
}
</style>
