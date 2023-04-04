<template>
  <div class="user_page">
    <div class="user_info">
      <el-col :span="3" class="left_container">
        <div class="nav_left">
          <router-link
            :to="item.url"
            v-for="(item, i) in navList"
            :key="i"
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
              <use :xlink:href="'#icon-' + item.icon" rel="external nofollow" />
            </svg>
            <span :title="item.title"> {{ item.title }} </span>
            <i class="el-icon-arrow-right nav_icon"></i>
          </router-link>
        </div>
      </el-col>

      <el-col :span="21" class="right_container">
        <el-page-header v-if="!isMainPage" @back="goBack" class="back">
        </el-page-header>
        <router-view></router-view>
      </el-col>
    </div>
  </div>
</template>

<script>
import { getUser } from '@/api/user/user'
import { getToken } from '@/utils/auth'
export default {
  name: 'My',
  async created() {
    const currentInfo = await getUser({
      id:
        this.loginType === 'eth'
          ? this.userInfo.eth_account
          : this.userInfo.user,
      token: getToken()
    })
    if (currentInfo && currentInfo.success === 'ok') {
      localStorage.setItem('quhu-userInfo', JSON.stringify(currentInfo.data))
    }
  },
  computed: {
    isMainPage() {
      return this.$route.path === '/introduce'
    },
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    }
  },
  data() {
    return {
      navList: [
        {
          id: 1,
          icon: 'ze-balance-o',
          title: '我的钱包',
          url: '/voucher'
        },
        {
          id: 2,
          icon: 'ze-flower-o',
          title: '活跃度',
          url: '/activation'
        },
        {
          id: 3,
          icon: 'ze-setting-o',
          title: '用户设置',
          url: '/setting'
        },
        {
          id: 4,
          icon: 'yqm',
          title: '邀请好友',
          url: '/invite'
        },
        {
          id: 5,
          icon: 'semiDesign-semi-icons-mail',
          title: '帮助与客服',
          url: '/introduce'
        }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
.user_page {
  width: 100%;
  height: 100vh;
  background: #f5f5f5 !important;
}

.user_info {
  height: 100%;
  padding: 16px 20px 16px 28px;
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
  max-height: 1200px;
  height: 100vh;
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
.user_avatar {
  margin-top: 30px;
  margin-bottom: 5px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
}
.user_avatar img {
  width: 60px;
  height: 60px;
  vertical-align: middle;
  border-radius: 50%;
  object-fit: cover;
}
.box-card {
  margin-top: 10px;
  min-height: 400px;
}
.camera {
  width: 15px;
  height: 15px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  right: -2px;
  bottom: -5px;
  text-align: center;
  line-height: 15px;
}
.nick_name {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: bold;
}
.introduce {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 12px;
}
.profile {
  max-width: 150px;
  cursor: pointer;
}
::v-deep .profile .el-input__inner {
  max-width: 150px;
  height: 20px;
}
.tags {
  margin-top: 5px;
}
.tag {
  margin-left: 20px;
  border-radius: 20px;
  width: 50px;
  height: 24px;
  text-align: center;
  font-size: 14px;
  line-height: 24px;
}
.hd-box {
  width: 100%;
  height: auto;
  background: #fff;
}

.hd-top {
  height: 48px;
  padding: 10px 16px 0 0;
}

.green-bnt {
  height: 24px;
  padding: 4px 8px;
  border-radius: 12px;
  background: #edfcf8;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: 0px;
  color: #55b396;
}

.rz {
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.ml-1 {
  margin-left: 5px;
}

.icon {
  width: 24px;
  height: 24px;
}

.tip {
  width: 24px;
  height: 24px;
  /* #ifdef MP-WEIXIN */
  width: 18px;
  height: 18px;
  margin-right: 8px;
  /* #endif */
}

/* hd-user */
.hd-user {
  width: 100%;
  padding: 16px 16px 24px 16px;
}

.stamp {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  border: 1px solid #eeeeee;
  margin-right: 15px;
}

.name {
  font-family: PingFangSC-Semibold;
  font-size: 17px;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: 0px;
  color: rgba(0, 0, 0, 0.8);
}

.label {
  color: #b7b7b7;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 1px;
  margin-left: 5px;
  color: rgba(0, 0, 0, 0.3);
}

/* hd-bottom */
.hd-bottom {
  margin-top: 24px;
  padding: 0 24px;
}

.line {
  height: 12px;
  background: #f2f8f8;
}

.ml {
  margin-left: 16px;
}
</style>
