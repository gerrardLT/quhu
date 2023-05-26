<template>
  <div class="auction_container">
    <div class="auction">
      <el-col :span="3" class="left_container">
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
                marginRight: '5px'
              }"
            >
              <use
                :xlink:href="'#icon-auction-' + item.icon"
                rel="external nofollow"
              />
            </svg>
            <span :title="item.text"> {{ item.text }} </span>
            <i class="el-icon-arrow-right nav_icon"></i>
          </router-link>
        </div>
      </el-col>

      <el-col :span="21" class="right_container">
        <div v-if="isMainPage">
          <Slider></Slider>
          <List></List>
        </div>

        <router-view></router-view>
      </el-col>
    </div>
  </div>
</template>

<script>
import List from './components/list.vue'
import Slider from './components/slider.vue'
export default {
  name: 'Auction',
  components: {
    List,
    Slider
  },
  data() {
    return {
      isActive: 0,
      activationList: [
        {
          id: 1,
          icon: 'home',
          text: '拍卖商城',
          url: '/auction'
        },
        {
          id: 2,
          icon: 'my',
          text: '我的拍卖',
          url: '/myauction'
        }
        // {
        //   image: require('../../assets/activation-my.png'),
        //   text: '我的拍卖'
        // }
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
  created() {},
  mounted() {},
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.auction_container {
  padding: 20px 20px;
}
.left_container {
  padding-top: 20px;
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
  padding: 20px;
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
