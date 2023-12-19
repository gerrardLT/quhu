<template>
  <div class="auction_container">
    <div class="auction">
      <div class="left_container">
        <div class="nav_left">
          <router-link
            :to="item.url"
            v-for="item in activationList"
            :key="item.id"
            class="nav_item"
          >
            <svg
              :style="{
                fill: '#087790',
                width: '15px',
                height: '15px',
                marginRight: '5px',
                verticalAlign: 'middle'
              }"
            >
              <use
                :xlink:href="'#icon-auction-' + item.icon"
                rel="external nofollow"
              />
            </svg>
            <span :title="item.text">
              {{ item.text }}
            </span>
            <i class="el-icon-arrow-right nav_icon"></i>
          </router-link>
        </div>
      </div>

      <div class="right_container">
        <div v-if="isMainPage">
          <Slider v-show="false"></Slider>

          <List></List>
        </div>
        <el-page-header
          v-if="!isMainPage"
          @back="goBack"
          style="margin-bottom: 20px; margin-left: 20px"
        >
        </el-page-header>
        <Wallet :balance-amount="balance"></Wallet>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import List from './components/list.vue'
import Slider from './components/slider.vue'
import Wallet from './components/wallet.vue'
import { balance } from '@/api/user/user'
import { getToken } from '@/utils/auth'
export default {
  name: 'Auction',
  components: {
    List,
    Slider,
    Wallet
  },
  data() {
    return {
      isActive: 0,
      balance: {},
      activationList: [
        {
          id: 0,
          icon: 'home',
          text: this.$t('auction.auction_shop'),
          url: '/auction'
        },
        {
          id: 1,
          icon: 'my',
          text: this.$t('auction.my_auction'),
          url: '/myauction'
        },
        {
          id: 2,
          icon: 'publish',
          text: this.$t('auction.publish'),
          url: 'publish'
        }
      ]
    }
  },
  computed: {
    isMainPage() {
      return this.$route.path === '/auction'
    },
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    }
  },
  created() {
    this.getBalance()
  },
  mounted() {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async getBalance() {
      const res = await balance({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken()
      })
      if (res && res.success === 'ok') {
        this.balance = res.data.token_num
      }
    }
  },
  watch: {
    '$i18n.locale': {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
        this.activationList = [
          {
            id: 0,
            icon: 'home',
            text: this.$t('auction.auction_shop'),
            url: '/auction'
          },
          {
            id: 1,
            icon: 'my',
            text: this.$t('auction.my_auction'),
            url: '/myauction'
          },
          {
            id: 2,
            icon: 'publish',
            text: this.$t('auction.publish'),
            url: 'publish'
          }
        ]
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
.auction_container {
  background-color: #f6f9f9;
  padding: 20px 20px;
}
.auction {
  display: flex;
}
.left_container {
  padding-top: 20px;
  width: 12.5%;
}
.nav_icon {
  position: absolute;
  right: 20px;
  top: calc(50% - 8px);
}
::v-deep .nav_left {
  height: 100vh;
  min-height: 500px;
  border-radius: 8px;
  border: 1px solid #bbbbbb;
  min-width: 150px;
  .nav_item {
    display: block;
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
    position: relative;
    min-width: 120px;
    cursor: pointer;
    font-size: 14px;
  }
}

.right_container {
  width: calc(87.5% - 50px);
  padding: 20px;
  padding-top: 80px;
  margin-left: 20px;
  position: relative;
  .back {
    margin-bottom: 10px;
  }
  .right_top {
    // width: 100%;
    height: 200px;
    background-color: #bfd2d2;
    // opacity: 0.26;
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
