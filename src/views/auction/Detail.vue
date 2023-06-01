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
          <div style="color: #fff" v-else>已过期</div>
        </div>
        <el-carousel indicator-position="none">
          <el-carousel-item v-for="(item, i) in auctionDetail.image" :key="i">
            <img class="show_img" :src="item" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="mid_operation animate__animated animate__fadeInDown">
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
          <div v-show="activeTab === 0">{{ auctionDetail.body.body }}</div>
          <div v-show="activeTab === 1">
            <div class="bid-list-area">
              <div v-infinite-scroll="load" style="overflow: auto">
                <div
                  class="bid-list animate__animated animate__fadeInUp"
                  v-for="item in bidHistory"
                  :key="item.steem_id"
                >
                  <img :src="defaultAvatar" class="history-img" alt="" />
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
export default {
  name: 'AuctionDetail',
  components: {
    List
  },
  data() {
    return {
      currentDate: Date.now(),
      historyPage: 1,
      defaultAvatar,
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
    this.$nextTick(() => {})
    // this.initWebSocket()
  },
  destroyed() {
    // this.ws.close()
  },
  methods: {
    transformTime,
    load() {
      this.getBidHistory(this.historyPage)
      this.historyPage++
    },
    async getBidHistory(page) {
      const params = this.$route.query
      const res = await auction_bidlist({
        page,
        permlink: [params.author, params.permlink]
      })
      if (res && res.success === 'ok') {
        this.bidHistory = res.data
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
      const loading = Loading.service({
        text: '加载中...',
        spinner: 'el-icon-loading ElementLoading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
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
      if (loading) {
        loading.close()
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
        this.auctionDetail = this.eval(res.result.json_metadata)
        this.auctionDetail.title = res.result.title
        this.auctionDetail.body = this.eval(res.result.body)
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
        text-align: center;
        justify-content: center;
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
          // overflow-y: auto;
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
        // background-image: url('../assets/quhu-bglogo.jpg');
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
