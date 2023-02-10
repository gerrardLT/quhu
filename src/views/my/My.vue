<template>
  <div class="user_page">
    <div class="user_info">
      <el-row type="flex" class="row-bg avatar_container">
        <el-col :span="4" class="user_avatar">
          <img :src="require(`../../assets/defaultAvatarUrl.png`)" alt="" />
        </el-col>
        <el-col class="nick_name" :span="4">
          {{ userInfo.user_name === 'none'?'': userInfo.user_name}}
        </el-col>
      </el-row>
      <el-row type="flex" class="user_history row-bg">
        <el-col :span="6">
          <div @click="goDetail('history')">
            <svg style="width:20px;height: 20px">
              <use xlink:href="#icon-foot" rel="external nofollow" />
            </svg>
            <span class="history_text">足迹</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="goDetail('interact')">
            <svg style="width:20px;height: 20px">
              <use xlink:href="#icon-askAnswer" rel="external nofollow" />
            </svg>
            <span class="history_text">问答</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="goDetail('collect')">
            <svg style="width:20px;height: 20px">
              <use xlink:href="#icon-collect" rel="external nofollow" />
            </svg>
            <span class="history_text">收藏</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="goDetail('mySpecial')">
            <svg style="width:20px;height: 20px">
              <use xlink:href="#icon-special" rel="external nofollow" />
            </svg>
            <span class="history_text">专栏</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-for="(item,index) in list" :key="index">
      <Bar :info="item" />
    </div>
    <div class="line"></div>
    <div v-for="(item1) in list2" :key="item1.id">
      <Bar :info="item1" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Bar from '@/components/setting-bar/setting-bar.vue'

export default {
  name: 'My',
  components: {
    Bar
  },
  created() {
    console.log(this.$route)
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    }
  },
  data() {
    return {
      list: [
        {
          id: 1,
          icon: 'xingqiubi',
          title: '活跃度',
          url: '/activation',
          showNumber: false
        },
        {
          id: 2,
          icon: 'yqm',
          title: 'token',
          url: '/voucher',
          showNumber: true
        },
        {
          id: 3,
          icon: 'yqm',
          title: '邀请好友',
          url: '/invite',
          showNumber: true
        }
      ],
      list2: [
        {
          id: 4,
          icon: 'change',
          title: '回收站',
          url: '/invite',
          showNumber: false
        },
        {
          id: 5,
          icon: 'kefu',
          title: '帮助与客服',
          url: '/invite',
          showNumber: false
        },
        {
          id: 6,
          icon: 'set',
          title: '设置',
          url: '/setting',
          showNumber: false
        }
      ]
    }
  },
  methods: {
    login() {},
    goDetail(url) {
      this.$router.push('/' + url)
    }
  }
}
</script>

<style scoped>
.user_page {
  width: 100%;
  height: 100vh;
  background: #f2f8f8 !important;
}

.user_info {
  height: 200px;
  padding: 16px 20px 16px 28px;
}
.avatar_container {
  padding: 20px 0;
}
.user_avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.user_avatar img {
  width: 60px;
  height: 60px;
  vertical-align: middle;
  border-radius: 50%;
}
.nick_name {
  display: inline-block;
  line-height: 60px;
  text-align: center;
}
.user_history {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.user_history svg {
  /* width: 30px;
  height: 30px; */
  vertical-align: middle;
}
.user_history .history_text {
  margin-left: 5px;
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
