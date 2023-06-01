<template>
  <div class="list_container">
    <div
      v-for="item in auctionList"
      :key="item.steem_id"
      class="auction-card animate__animated animate__zoomIn"
      @click="handleClick(item)"
    >
      <div class="auction-img">
        <img alt="image" :src="item.image" />
        <div class="auction-timer">
          <div class="countdown" id="timer1">
            <div>
              <!-- <span id="hours1">12</span>H : <span id="minutes1">22</span>M :
              <span id="seconds1">56</span>S -->
              <el-statistic
                v-if="item.end_time * 1000 > currentDate"
                :value="item.end_time * 1000"
                time-indices
                format="HH:mm:ss"
              >
              </el-statistic>
              <!-- <Countdown :end-time="item.end_time"></Countdown> -->
              <div style="color: #303133" v-else>已过期</div>
            </div>
          </div>
        </div>
      </div>
      <div class="auction-content">
        <h3>
          <router-link
            :to="{
              path: '/auctiondetail',
              query: {
                author: item.permlink[0],
                permlink: item.permlink[1]
              }
            }"
            >{{ item.title }}</router-link
          >
        </h3>
        <div class="author-price-area">
          <div class="author">
            <img :src="item.avatar" alt="" />
            <span class="name">by {{ item.author }} </span>
          </div>
          <div>
            <span>{{ item.new_price }}</span
            ><span> {{ item.coins }}</span>
          </div>
        </div>
        <!-- <div class="author-current-price">
          <span style="font-size: 14px; font-weight: 600; color: #696969"
            >当前价：</span
          >
          <span class="new-price"
            >{{ item.new_price }} <span> {{ item.coins }}</span></span
          >
        </div> -->
        <div class="auction-card-bttm">
          <router-link
            class="auction-bid-btn"
            :to="{
              path: '/auctiondetail',
              query: {
                author: item.permlink[0],
                permlink: item.permlink[1]
              }
            }"
            >出价</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { transformTime } from '@/utils/tool'
import { auction_info } from '@/api/auction/auction'
// import Countdown from '../components/countdown.vue'
export default {
  name: 'list',
  // components: {
  //   Countdown
  // },
  props: {
    scaleRadio: {
      type: Number,
      default: 1
    },
    permlink: {
      type: Object
    }
  },
  data() {
    return {
      auctionList: [],
      currentDate: Date.now()
    }
  },
  created() {
    this.getAuctionList()
  },
  mounted() {
    const self = this
    if (self.scaleRadio !== 1) {
      window.onload = window.onresize = function () {
        document.querySelector('.list_container').style.zoom = self.scaleRadio
      }
    }
  },
  methods: {
    handleClick() {},
    transformTime,
    async getAuctionList() {
      const res = await auction_info({
        tag: 'bid_onlyfun'
      })
      console.log(res)
      if (res && res.success === 'ok') {
        this.auctionList = res.data

        if (this.permlink && this.permlink.author) {
          this.auctionList = this.auctionList.filter((item) => {
            return item.permlink[0] !== this.permlink.author
          })
        }
        // this.auctionList = res.data
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-statistic .con span {
  color: #303133;
}
.list_container {
  //   min-height: 800px;
  display: flex;
  flex-wrap: wrap;
  .auction-card {
    border-radius: 10px;
    padding: 15px 15px 0;
    width: calc(25% - 80px);
    margin: 0 20px 20px 20px;
    padding: 20px;
    background: #fff;
    min-width: 260px;
  }

  .auction-card:hover .auction-img img {
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
    border-radius: 10px;
  }

  .auction-card:hover .auction-img .auction-timer .countdown h5 {
    color: #444;
  }

  .auction-card .auction-img {
    position: relative;
    overflow: hidden;
    min-height: 200px;
  }

  .auction-card .auction-img img {
    width: 100%;
    max-height: 200px;
    border-radius: 10px;
    -webkit-transition: all 0.65s ease;
    transition: all 0.65s ease;
  }

  .auction-card .auction-img .auction-timer {
    border-radius: 15px 15px 0 0;
    padding: 12px 15px;
    text-align: center;
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    bottom: 0;
    background: #fff;
    // min-width: 200px;
    width: 60%;
    opacity: 0.9;
  }

  .auction-card .auction-img .auction-timer .countdown h5 {
    font-size: 20px;
    font-weight: 700;
    color: #444;
    margin-bottom: 0;
    white-space: nowrap;
    -webkit-transition: all 0.42s ease;
    transition: all 0.42s ease;
  }

  .auction-card .auction-content {
    padding: 10px 20px;
  }

  .auction-card .auction-content h4 {
    font-size: 23px;
    font-weight: 600;
    color: #1f2230;
    line-height: 1.5;
    margin-top: -7px;
    cursor: pointer;
  }

  .auction-card .auction-content p {
    font-size: 16px;
    font-weight: 500;
    color: #696969;
  }

  .auction-card .auction-content p span {
    font-size: 20px;
    font-weight: 700;
    color: #1f2230;
  }

  .auction-card .auction-content .price {
    font-size: 16px;
    font-weight: 700;
    color: #32c36c;
  }

  .auction-card .auction-card-bttm {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-top: 20px;
    .auction-bid-btn {
      font-size: 16px;
      font-weight: 600;
      padding: 10px 40px;
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

  .auction-card .auction-card-bttm .share-area i {
    color: #696969;
    -webkit-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
    cursor: pointer;
  }

  .auction-card .auction-card-bttm .share-area i:hover {
    color: #f9395f;
  }

  .auction-card .author-price-area {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-top: 15px;
  }
  .auction-card .author-current-price {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 10px;
    .new-price {
      font-size: 18px;
      font-weight: 700;
      color: #f9395f;
      font-family: saira, sans-serif;
    }
  }
  .auction-card .author-price-area .author img {
    height: 35px;
    width: 35px;
    border-radius: 50%;
    margin-right: 10px;
    vertical-align: middle;
  }

  .auction-card .author-price-area .author span.name {
    font-size: 14px;
    font-weight: 600;
    color: #696969;
  }

  .auction-card .author-price-area div {
    margin-bottom: 0;
    font-size: 18px;
    font-weight: 700;
    color: #f9395f;
    font-family: saira, sans-serif;
  }

  .auction-card .author-area {
    position: absolute;
    top: 20px;
    left: 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: flex-start;
    -ms-flex-pack: flex-start;
    justify-content: flex-start;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
  }

  .auction-card .author-area .author-emo {
    border-radius: 50%;
    background: #fff;
    padding: 7px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border: 1px solid transparent;
    z-index: 1;
  }

  .auction-card .author-area .author-emo img {
    width: 22px;
    height: 22px;
    line-height: 22px;
  }

  .auction-card .author-area .author-name {
    background: #32c36c;
    padding: 6px 20px 6px 44px;
    border-radius: 33px;
    margin-left: -27px;
    -webkit-transform: scaleX(0.1);
    transform: scaleX(0.1);
    -webkit-transform-origin: left;
    transform-origin: left;
    -webkit-transition: 0.6s ease;
    transition: 0.6s ease;
  }

  .auction-card .author-area .author-name span {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  .auction-card .author-area:hover .author-emo {
    border: 1px solid #32c36c;
  }

  .auction-card .author-area:hover .author-name {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }

  .auction-card .share-list {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .auction-card .share-list .social-icons {
    padding: 5px;
    margin-right: 0;
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
    -webkit-transform-origin: right;
    transform-origin: right;
    -webkit-transition: 0.5s ease;
    transition: 0.5s ease;
    z-index: 1;
    margin-bottom: 0;
  }

  .auction-card .share-list:hover .social-icons {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }

  .auction-card .share-list:hover .social-icons li {
    margin-right: 8px;
  }

  .auction-card .share-list:hover .social-icons li i {
    font-size: 1rem;
  }
}
</style>
