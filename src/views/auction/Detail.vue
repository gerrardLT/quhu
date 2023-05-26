<template>
  <div class="detail_container">
    <div class="top">
      <div class="left_image">
        <div class="countdown">
          <el-statistic
            :value="auctionDetail.end_time"
            time-indices
            format="HH:mm:ss"
          >
          </el-statistic>
        </div>
        <el-carousel indicator-position="none">
          <el-carousel-item v-for="(item, i) in auctionDetail.image" :key="i">
            <img class="show_img" :src="item" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="mid_operation">
        <div class="title">
          {{ auctionDetail.title }}
        </div>
        <div class="starting_price">
          <span>起拍价：{{ auctionDetail.starting_price }}</span>
          <span>&nbsp;{{ auctionDetail.coins }}</span>
        </div>
        <div class="bid">
          <div class="current_price">
            <span class="text">当前价：</span>
            <span class="amount">{{
              realTimeData.price + ' ' + auctionDetail.coins
            }}</span>
          </div>
          <div class="increment">
            <span class="mini_price">最小加价：</span>
            <span>{{ auctionDetail.increase }}</span>
          </div>
          <div class="premium">
            <span class="premium_text">佣金：</span> <span>10%</span>
          </div>
          <div class="operation">
            <el-input
              class="bid_input"
              placeholder="请输入拍卖金额"
              v-model="bidAmount"
              clearable
            >
            </el-input>
            <div class="bid_btn" @click="handlePlaceBid">出价</div>
          </div>
        </div>
      </div>
    </div>

    <div class="middle">
      <div class="mid_left">
        <div class="tab_list">
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
        <div class="mid_content">
          <div v-show="activeTab === 0">这是描述</div>
          <div v-show="activeTab === 1">
            <div class="bid-list-area">
              <div
                class="bid-list"
                v-infinite-scroll="load"
                style="overflow: auto"
              >
                <div v-for="item in bidHistory" :key="item.steem_id">
                  <img :src="bidHistory.image" alt="" />
                  <div class="content">
                    <div>{{ item.steem_id }}</div>
                    <div>{{ item.price }}</div>
                  </div>
                  <div class=""></div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="activeTab === 2">这是描述</div>
        </div>
      </div>

      <div class="mid_right"></div>
    </div>
  </div>
</template>

<script>
import {
  get_auction_detail,
  auction_bid,
  auction_bidlist
} from '@/api/auction/auction'
export default {
  name: 'AuctionDetail',
  data() {
    return {
      realTimeData: {},
      bidAmount: '',
      ws: null,
      auctionDetail: {},
      bidHistory: [],
      activeTab: 0,
      tabList: [
        {
          id: 0,
          type: '拍品描述',
          icon: ''
        },
        {
          id: 1,
          type: '出价历史',
          icon: ''
        },
        {
          id: 2,
          type: '其他竞拍',
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
  created() {
    const permlink = this.$route.query
    this.getAuctionDetail(permlink)
    this.getBidHistory(permlink)
  },
  mounted() {
    this.realTimeData = {
      item: 'onlyfun-sdfg4ni8bo',
      steem_id: 'q4742fbc1',
      price: 1100.0,
      coins: 'poys',
      timestamp: 1684635742,
      end_time: 1784390326
    }
    // this.initWebSocket()
  },
  destroyed() {
    this.ws.close() //离开路由之后断开websocket连接
  },
  methods: {
    load() {
      console.log(123)
    },
    async getBidHistory(params) {
      const res = await auction_bidlist({
        page: 1,
        permlink: [params.author, params.permlink]
      })
      if (res && res.success === 'ok') {
        this.bidHistory = res.data
      }
    },
    toggleTab(item) {
      this.activeTab = item.id
    },
    async handlePlaceBid() {
      const reg = /^[1-9]\d*$/
      const params = this.$route.query
      if (!this.bidAmount.trim()) {
        this.$message.warning('请输入竞拍价')
        return
      }
      if (!reg.test(this.bidAmount)) {
        this.$message.warning('请输入数字')
        return
      }
      const res = await auction_bid({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        price: this.bidAmount,
        permlink: [params.author, params.permlink]
      })
      if (res && res.success === 'ok') {
        this.$message.success('出价成功！')
      }
    },
    initWebSocket() {
      if (window.WebSocket) {
        const self = this
        let ws = new WebSocket('ws://app.onlyfun.city:668/ws') // 建立连接
        this.ws = ws
        // 服务器连接成功
        ws.onopen = function () {
          console.log('连接成功')
          ws.send('hello') // 给后台发消息
          self.heartbeat() // 开启心跳
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
          console.log(e, '接收数据')
          self.realTimeData = {
            item: 'onlyfun-sdfg4ni8bo',
            steem_id: 'q4742fbc1',
            price: 1100.0,
            coins: 'poys',
            timestamp: 1684635742,
            end_time: 1784390326
          }
        }
      }
    },
    // 心跳
    heartbeat() {
      setInterval(() => {
        this.ws.send('心跳')
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
        // this.auctionDetail = this.eval(res.result.json_metadata)
        this.auctionDetail = {
          app: 'onlyfun/0.1',
          tags: ['end_onlyfun', 'my_q4742fbc1'],
          steem_id: 'q4742fbc1',
          encrypted: false,
          start_time: 1684290326,
          end_time: 1684390326,
          increase: 100,
          image: [
            'https://cdn.steemitimages.com/DQmQRDKpm6qVEdFcpE2TDe9jB4Rz6wMVNFZYFAsWRNpz87C/2023-5-16.jpg',
            'https://cdn.steemitimages.com/DQmY6Ck47GWHb5p6PP6DmVhMJBMB6gcMYkkd4uUvpkrtJ4F/2023-5-10.jpg'
          ],
          coins: 'poys',
          starting_price: 1000
        }
        this.auctionDetail.title = res.result.title
      }
    },
    eval(fn) {
      const Fn = Function
      return new Fn('return ' + fn)()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-statistic .con {
  color: #fff;
}
.detail_container {
  padding: 0 15%;
  .top {
    display: flex;
    justify-content: center;
    .left_image {
      border-radius: 10px !important;
      width: 300px;
      height: 300px;
      .show_img {
        width: 100%;
        height: 100%;
      }
      .countdown {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        background-color: #000;
      }
    }
    .mid_operation {
      width: calc(100% - 320px);
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 10px;
      }
    }
    .starting_price {
    }
    .bid {
      margin-top: 85px;
      box-shadow: 5px 2px 30px rgba(0, 0, 0, 0.06);
      border-radius: 5px;
      background: #fff;
      padding: 15px;
      color: #696969;

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
      .operation {
        display: flex;
        .bid_input {
          width: 75%;
        }
        .bid_btn {
          font-size: 16px;
          font-weight: 600;
          padding: 10px 40px;
          margin-left: 10px;
          width: calc(20% - 10px);
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
      width: 60%;

      margin-top: 40px;
      .tab_list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .tab {
          min-width: 60px;
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
        padding: 20px 10px;
        .bid-list {
          height: 500px;
          width: 100%;
        }
      }
    }
    .mid_right {
      width: calc(40% - 10px);
    }
  }
}
</style>
