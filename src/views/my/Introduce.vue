<template>
  <div>
    <div>
      <Info></Info>
    </div>
    <el-row class="special_row">
      <el-col :span="18" class="my_special" v-loading="specialLoading">
        <div class="special_top">
          <span>我的专栏</span>
          <el-button class="learnMore" @click="learnMoreSpecial" type="text"
            >查看更多</el-button
          >
        </div>
        <div v-if="specialList.length > 0" class="special_content">
          <div
            v-for="(item, i) in specialList"
            :key="i"
            class="special_item"
            @click="goColumnDetail(item)"
            title="点击查看专栏详情"
          >
            <img :src="item.image" class="image" alt="" />
            <div class="right">
              <div class="title">{{ item.title }}</div>
              <div class="members">共{{ item.member }}人</div>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无数据"></el-empty>
      </el-col>
      <el-col :span="6" class="collect" v-loading="favoriteLoading">
        <div class="collect_title">我的收藏</div>
        <div v-if="favorites.length > 0" class="collect_content">
          <div
            class="collect_item"
            v-for="(item, i) in favorites"
            :key="i"
            @click="goLink(item, i)"
            title="点击跳转文章详情"
          >
            <!-- <img :src="userInfo.avatar" alt="" class="collect_left" /> -->
            <div class="collect_right">
              <div class="title" :title="item.title">{{ item.title }}</div>
              <div class="content" :title="item.body">{{ item.body }}</div>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无数据"></el-empty>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18" v-loading="trailLoading">
        <el-card class="box-card">
          <div slot="header">
            <span>最新动态</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text"
              >查看更多</el-button
            > -->
          </div>
          <div v-if="trailList.length > 0" class="trail_container">
            <div
              v-for="(v, i) in trailList"
              :key="i"
              class="trail_item"
              @click="goLink(v, i)"
              title="点击跳转文章详情"
            >
              <img :src="userInfo.avatar" alt="" />
              <div class="content">
                <div>{{ v.title }}</div>
                <div>{{ transformTime(Number(v.timestamp)) }}</div>
                <div class="detail" v-html="v.body"></div>
              </div>
            </div>
          </div>

          <el-empty v-else description="暂无数据"></el-empty>
        </el-card>
      </el-col>
      <el-col :span="6" class="report">
        <div class="report_title">站内通知</div>
        <div class="report_content">
          <img src="../../assets/emptySpace.png" alt="" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import Info from './component/info.vue'
import { trail, getUser } from '@/api/user/user'
import { getToken } from '@/utils/auth'
import { getfavorites } from '@/api/special/special'
export default {
  name: 'Introduce',
  components: {
    Info
  },
  async created() {
    this.trailLoading = true
    this.favoriteLoading = true
    const res = await trail({
      id:
        this.loginType === 'eth'
          ? this.userInfo.eth_account
          : this.userInfo.user,
      token: getToken()
    })
    if (res && res.success === 'ok') {
      this.trailList = res.data
    }
    this.trailLoading = false
    const favorites = await getfavorites({
      id:
        this.loginType === 'password'
          ? this.userInfo.user
          : this.userInfo.eth_account,
      token: getToken()
    })
    if (favorites && favorites.success === 'ok') {
      this.favorites = favorites.data
    }
    this.favoriteLoading = false
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    },

    specialList() {
      const arr = []
      this.userInfo.article.forEach((e, i) => {
        if (i < 6) {
          arr.push({
            title: e.name,
            image: e.image,
            member: e.member
          })
        }
      })
      return arr
    }
  },
  data() {
    return {
      trailList: [],
      favorites: [],
      currentInfo: {},
      specialLoading: false,
      favoriteLoading: false,
      trailLoading: false
    }
  },
  methods: {
    goColumnDetail(v) {
      console.log(v)
      this.$router.push({
        path: '/columnDetail',
        query: {
          subName: v.title
        }
      })
    },
    goLink(v, i) {
      this.$EventBus.$emit('changeTab', { name: 'home' }, 0, {
        author: v.permlink[0],
        permlink: v.permlink[1],
        isShowDetailDialog: true
      })
    },
    learnMoreSpecial() {
      this.$EventBus.$emit('changeTab', { name: 'home' }, 0)
    },
    transformTime(v) {
      let timestamp = v
      let date = new Date(parseInt(timestamp) * 1000)
      let Year = date.getFullYear()
      let Moth =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      let Day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let Hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let Minute =
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      let Sechond =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      let GMT =
        Year +
        '-' +
        Moth +
        '-' +
        Day +
        '   ' +
        Hour +
        ':' +
        Minute +
        ':' +
        Sechond
      return GMT
    }
  },
  watch: {
    userInfo: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
.trail_container {
  overflow: auto;
}
.special_row {
  .my_special {
    padding: 10px 20px;
    font-size: 14px;
    background-color: #fff;
    min-height: 350px;
    .special_top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .learnMore {
        cursor: pointer;
        padding: 0;
      }
    }
    .special_content {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 100%;
      .special_item {
        min-width: 28%;
        height: 100px;
        border: 1px solid #c0c0c0;
        margin-left: 1%;
        margin-bottom: 10px;
        margin-top: 10px;
        padding: 2%;
        display: flex;
        cursor: pointer;
        img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 50%;
        }
        .right {
          padding-left: 20px;
          height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          min-width: 200px;
          max-width: 400px;
          .title {
            width: 90%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .members {
          }
        }
      }
    }
  }
  .collect {
    width: calc(25% - 20px);
    margin-left: 20px;
    background-color: #fff;
    padding: 10px 20px;
    font-size: 14px;
    height: 350px;
    overflow: auto;
    .collect_title {
      margin-bottom: 20px;
    }
    .collect_content {
      .collect_item {
        height: 50px;
        display: flex;
        cursor: pointer;
        // .collect_left {
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 50%;
        // }
        .collect_right {
          font-size: 12px;
          // padding-left: 20px;
          height: 40px;
          width: calc(100% - 40px);
          .title {
            width: 100%;
            height: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .content {
            width: 100%;
            height: 20px;
            color: #c0c0c0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
.report {
  margin-top: 10px;
  width: calc(25% - 20px);
  margin-left: 20px;
  background-color: #fff;
  padding: 10px 20px;
  font-size: 14px;
  height: 400px;
  .report_content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 19px);
  }
}
.trail_item {
  display: flex;
  height: 80px;
  justify-content: center;
  align-items: center;
  border-bottom: 1px dashed #c0c0c0;
  cursor: pointer;
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
  }
  .content {
    height: 70px;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    margin-left: 20px;
    width: calc(100% - 50px);
    position: relative;
    div {
      margin-bottom: 5px;
    }
    .steemLink {
      position: absolute;
      right: 5px;
      bottom: 10px;
      font-size: 12px;
    }
    .detail {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-bottom: 0;
    }
  }
}
.pointer {
  cursor: pointer;
}

.right_container {
  padding: 20px;
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
