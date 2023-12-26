<template>
  <div class="information_container">
    <div class="left_container">
      <div class="infor_user_name">
        <div class="forest">
          <img :src="currentInfo.data.avatar" alt="" />
        </div>
        <div class="name">
          <span class="text" style="cursor: pointer;">{{ currentInfo.data.user_name }}</span>
          <span
            v-if="!currentInfo.self"
            @click="togglefollow"
            class="follow_btn"
            >{{ currentInfo.follow ? $t('information.cancel_follow') : $t('information.follow') }}</span
          >
        </div>
      </div>
      <div class="infor_user_detail">
        <div class="detail_lists">
          <div v-for="item in detailList" :key="item.id" class="detail_list">
            <div class="num">{{ item.num }}</div>
            <div class="text">{{ item.text }}</div>
          </div>
        </div>
      </div>
      <div class="tab_container">
        <div class="infor_user_article">
          <el-tabs v-model="activeName" @tab-click="handleChoosed">
            <!-- <el-tab-pane label="最新动态" name="first"> </el-tab-pane> -->
            <el-tab-pane :label="$t('information.column')" name="first">
              <el-col class="my_special" v-loading="specialLoading">
                <!-- <div class="special_top">
                  <span>{{ $t('introduce.my_column') }}</span>
                </div> -->
                <div v-if="specialList.length > 0" class="special_content">
                  <div
                    v-for="(item, i) in specialList"
                    :key="i"
                    @click="goColumnDetail(item)"
                    class="special_item"
                    :title="$t('introduce.view_tip')"
                  >
                    <img :src="item.image" class="image" alt="" />
                    <div class="right">
                      <div class="title">{{ item.title }}</div>
                      <div class="members">
                        {{ $t('introduce.in_all') }} {{ item.member }}
                        {{ $t('introduce.person') }}
                      </div>
                    </div>
                  </div>
                </div>
                <el-empty
                  v-else
                  :description="$t('introduce.no_data')"
                ></el-empty>
              </el-col>
            </el-tab-pane>
            <el-tab-pane :label="$t('information.favorite')" name="second">
              <el-col class="collect" v-loading="favoriteLoading">
                <div v-if="favorites.length > 0" class="collect_content">
                  <div
                    class="collect_item"
                    v-for="(item, i) in favorites"
                    :key="i"
                    :title="$t('introduce.to_detail_tip')"
                  >
                    <div class="collect_right">
                      <div class="title" :title="item.title">
                        {{ item.title }}
                      </div>
                      <div class="content" :title="item.body">
                        {{ item.body }}
                      </div>
                      <div
                        style="
                          height: 1px;
                          border-top: 1px dashed #c0c0c0;
                          margin-top: 10px;
                        "
                      ></div>
                    </div>
                  </div>
                </div>
                <el-empty
                  v-else
                  :description="$t('introduce.no_data')"
                ></el-empty>
              </el-col>
            </el-tab-pane>
            <el-tab-pane v-if="currentInfo.self" :label="$t('information.follow_list')" name="third">
              <div class="follow">
                <div class="follow_menu">
                  <div
                    style="
                      padding: 20px 5px;
                      border-bottom: 1px solid #c0c0c0;
                      font-size: 14px;
                    "
                  >
                    <div
                      style="cursor: pointer; color: #909399; font-size: 16px"
                    >
                      {{$t('information.my_following')}}
                    </div>
                    <div
                      style="
                        margin-top: 20px;
                        cursor: pointer;
                        height: 30px;
                        line-height: 30px;
                      "
                      :class="{
                        following_type: !followingActive,
                        active: followingActive
                      }"
                      @click="getFollowing"
                    >
                      <svg
                        :style="{
                          fill: '#EE9611',
                          width: '15px',
                          height: '15px',
                          marginRight: '5px'
                        }"
                      >
                        <use
                          :xlink:href="'#icon-following'"
                          rel="external nofollow"
                        />
                      </svg>
                      <span> {{$t('information.all_following')}}</span>
                    </div>
                  </div>
                  <div
                    style="
                      padding: 10px 5px 20px;
                      border-bottom: 1px solid #c0c0c0;
                      font-size: 14px;
                    "
                  >
                    <div
                      style="
                        margin-top: 20px;
                        cursor: pointer;
                        color: #909399;
                        font-size: 16px;
                      "
                    >
                     {{ $t('information.my_follower') }} 
                    </div>
                    <div
                      style="
                        margin-top: 20px;
                        cursor: pointer;
                        height: 30px;
                        line-height: 30px;
                      "
                      :class="{
                        following_type: !followerActive,
                        active: followerActive
                      }"
                      @click="getFollowers"
                    >
                      <svg
                        :style="{
                          fill: '#EE9611',
                          width: '15px',
                          height: '15px',
                          marginRight: '5px'
                        }"
                      >
                        <use
                          :xlink:href="'#icon-followers'"
                          rel="external nofollow"
                        />
                      </svg>
                      <span>{{ $t('information.my_follower') }} </span>
                    </div>
                  </div>
                </div>
                <div class="follow_list">
                  <div class="box-card">
                    <div
                      slot="header"
                      style="height: 40px; border-bottom: 1px solid #909399"
                    >
                      <span>{{
                        followerActive ?   $t('information.my_follower')  :  $t('information.all_following') 
                      }}</span>
                    </div>
                    <div
                      v-if="followers.length > 0 && followerActive"
                      class="trail_container"
                    >
                      <div
                        v-for="(v, i) in followers"
                        :key="i"
                        class="trail_item"
                        :title="$t('information.jump_homepage')"
                      >
                        <img :src="v.avatar" alt="" />
                        <div class="content">
                          <div class="user_name" @click="jumpInfo(v)">
                            {{ v.user_name }}
                          </div>
                          <div class="detail">
                            {{ v.profile || $t('information.profile') }}
                          </div>
                        </div>
                        <div
                          class="follow_text"
                          v-if="!v.isFollowing"
                          @click="follow(v)"
                        >
                          <span>>&check;</span>
                          <span>{{ $t('information.follow') }}</span>
                        </div>
                        <el-dropdown trigger="hover" v-else>
                          <div class="operation">
                            <svg
                              :style="{
                                fill: '#979797',
                                width: '10px',
                                height: '10px',
                                marginRight: '5px'
                              }"
                            >
                              <use
                                :xlink:href="'#icon-classification'"
                                rel="external nofollow"
                              />
                            </svg>
                            <span style="font-size: 12px">{{ $t('information.already_follow') }}</span>
                          </div>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              class="clearfix"
                              @click.native="unFollow(v)"
                            >
                            {{ $t('information.cancel_follow') }}
                              
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </div>
                    <div
                      v-if="following.length > 0 && followingActive"
                      class="trail_container"
                    >
                      <div
                        v-for="(v, i) in following"
                        :key="i"
                        class="trail_item"
                        :title="$t('information.jump_homepage')"
                      >
                        <img :src="v.avatar" alt="" />
                        <div class="content">
                          <div class="user_name" @click="jumpInfo(v)">
                            {{ v.user_name }}
                          </div>
                          <div class="detail">
                            {{ v.profile || $t('information.profile') }}
                          </div>
                        </div>
                        <el-dropdown trigger="hover" v-if="v.isFollowing">
                          <div class="operation">
                            <svg
                              :style="{
                                fill: '#979797',
                                width: '10px',
                                height: '10px',
                                marginRight: '5px'
                              }"
                            >
                              <use
                                :xlink:href="'#icon-classification'"
                                rel="external nofollow"
                              />
                            </svg>
                            <span style="font-size: 12px">{{ $t('information.already_follow') }}</span>
                          </div>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              class="clearfix"
                              @click.native="unFollow(v)"
                            >
                            {{ $t('information.cancel_follow') }}
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                        <div
                          v-else
                          class="follow_text"
                          @click="follow(v)"
                        >
                          <span>&check;</span>
                          <span>{{ $t('information.follow') }}</span>
                        </div>
                      </div>
                    </div>
                    <el-empty
                      v-else
                      :description="$t('introduce.no_data')"
                    ></el-empty>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane v-if="currentInfo.self" label="管理" name="fourth">
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="right_container" v-show="currentInfo.self">
      <div class="infor_hot">
        <div class="recommend_wrapper" v-loading="favoriteLoading">
          <div>
            <div>
              <div class="wbpro-side-tit woo-box-flex woo-box-alignCenter">
                <div
                  class="f14 cla woo-box-item-flex"
                  style="align-self: center"
                >
                  {{ $t('home.hot_column') }}
                </div>
                <div
                  class="woo-box-flex woo-box-alignCenter"
                  @click="getHotColumns"
                >
                  <i class="el-icon-refresh" style="color: #c0c0c0"></i
                  ><span
                    class="f12 clb"
                    style="
                      display: inline-block;
                      color: #c0c0c0;
                      max-width: 50px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    >{{ $t('home.click_refresh') }}</span
                  >
                </div>
              </div>
              <div class="woo-divider-main woo-divider-x"></div>
              <div v-if="hotColumns.length > 0" class="hot_container">
                <div
                  class="wbpro-side-card7"
                  v-for="(hot, hotIndex) in hotColumns"
                  :key="hotIndex"
                >
                  <div class="wbpro-side-panel">
                    <div class="con woo-box-flex woo-box-alignCenter">
                      <div v-if="hotIndex === 0">
                        <svg
                          :style="{
                            fill: '#EE9611',
                            width: '20px',
                            height: '20px',
                            marginRight: '15px'
                          }"
                          :class="{
                            'rank-top': [0, 1, 2].indexOf(hotIndex) !== -1,
                            rank: true,
                            top: true,
                            f16: true
                          }"
                        >
                          <use
                            :xlink:href="'#icon-fire'"
                            rel="external nofollow"
                          />
                        </svg>
                      </div>
                      <div
                        :class="{
                          'rank-top': [1, 2, 3].indexOf(hotIndex) !== -1,
                          rank: true,
                          top: true,
                          f16: true
                        }"
                        v-else
                      >
                        {{ Number(hotIndex) }}
                      </div>
                      <div
                        :title="hot.value"
                        class="wbpro-textcut f14 cla"
                        @click="handleSelect(hot)"
                      >
                        {{ hot.value }}
                      </div>
                      <div class="icon">
                        <span
                          v-if="hot.isHot"
                          class="wbpro-icon-search-tp1"
                          style="background: rgb(255, 148, 6); cursor: pointer"
                          >{{ $t('home.hot') }}</span
                        >
                      </div>
                    </div>
                    <div class="woo-divider-main woo-divider-x"></div>
                  </div>
                </div>
              </div>
              <el-empty v-else :description="$t('home.no_data')"></el-empty>
              <div class="hot_auction" @click="goLink">
                <img
                  src="../../assets/radio.png"
                  style="width: 25px; height: 25px"
                  alt=""
                />
                <span class="hot_text">{{ $t('home.hot_auction') }}</span>
              </div>
              <div class="woo-divider-main woo-divider-x"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="infor_inform">
        <div class="report" v-loading="reportLoading">
          <div class="report_title">{{ $t('introduce.inform') }}</div>
          <div class="tag_container">
            <el-tag
              type="info"
              :class="{ tag: true, active: activeTagIndex === 0 }"
              @click="toggleTag('upvote', 0)"
              >{{ $t('introduce.star') }}</el-tag
            >
            <el-tag
              type="info"
              :class="{ tag: true, active: activeTagIndex === 1 }"
              @click="toggleTag('replie', 1)"
              >{{ $t('introduce.reply') }}</el-tag
            >
            <el-tag
              type="info"
              :class="{ tag: true, active: activeTagIndex === 2 }"
              @click="toggleTag('mentions', 2)"
              >{{ $t('introduce.mention') }}</el-tag
            >
          </div>

          <div v-if="filterReportList.length > 0" class="report_content">
            <div
              v-for="(v, i) in filterReportList"
              :key="i"
              class="report_item"
            >
              <div class="report_right" @click="goLink(v, i, 'trail')">
                <div class="title" :title="v.title">{{ v.title }}</div>
                <div style="color: #c0c0c0">
                  {{ transformTime(Number(v.timestamp)) }}
                </div>
                <div class="content" :title="v.message">{{ v.message }}</div>
              </div>
            </div>
          </div>
          <el-empty v-else :description="$t('introduce.no_data')"></el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { hotColumn, getfavorites } from '@/api/special/special'
import {
  trail,
  getOtherUser,
  notifications,
  follow,
  unfollow,
  following,
  follower
} from '@/api/user/user'
import { getToken } from '@/utils/auth'

export default {
  name: 'Information',
  data() {
    return {
      specialLoading: false,
      favoriteLoading: false,
      reportLoading: false,
      followerActive: false,
      followingActive: false,
      favorites: [],
      currentInfo: {
        data: {}
      },
      specialList: [],
      followers: [],
      following: [],
      activeName: 'first',
      hotColumns: [],
      reportList: [],
      filterReportList: [],
      activeTagIndex: 0,
      detailList: [
        // {
        //   text: this.$t('information.view'),
        //   num: 0,
        //   id: 'view'
        // },
        // {
        //   text: this.$t('information.followers'),
        //   num: 0,
        //   id: 'followers'
        // },
        // {
        //   text: this.$t('information.articles_num'),
        //   num: 0,
        //   id: 'articles_num'
        // },
        // {
        //   text: this.$t('information.comment_num'),
        //   num: 0,
        //   id: 'comment_num'
        // }
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
    this.getOtherUserInfo()
    this.getFollowing()
  },
  mounted() {},
  methods: {
    jumpInfo(v) {
      this.$router.replace({
        path: '/information',
        query: {
          id: v.user_name,
          steemId: v.steem_id
        }
      })
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
    },
    async getNotifications() {
      this.reportLoading = true
      const id = this.$route.query.id
      const reports = await notifications({
        id: this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken()
      })
      if (reports && reports.success === 'ok') {
        this.reportList = reports.data
        this.filterReportList = this.reportList.filter((item) => {
          return item.type === 'upvote'
        })
      }
      this.reportLoading = false
    },
    togglefollow() {
      if (this.currentInfo.follow) {
        this.unFollow()
      } else {
        this.follow()
      }
    },
    async follow(v) {
      const id = this.$route.query.id
      const steemId = this.$route.query.steemId
      const res = await follow({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        steem_id: v ? v.steem_id : steemId
      })
      if (res && res.success === 'ok') {
        this.currentInfo.follow = !this.currentInfo.follow
        if(v){
          v.isFollowing = true
        }
        
        this.$message.success( this.$t('information.follow_success'))
      }
    },
    async unFollow(v) {
      const id = this.$route.query.id
      const steemId = this.$route.query.steemId
      const res = await unfollow({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        steem_id: v ? v.steem_id : steemId
      })
      if (res && res.success === 'ok') {
        this.currentInfo.follow = !this.currentInfo.follow
        if(v){
          v.isFollowing = false
        }
        this.$message.success(this.$t('information.follow_canceled'))
      }
    },
    async getFollowers() {
      this.followerActive = true
      this.followingActive = false
      const steemId = this.$route.query.steemId
      const res = await follower({
        steem_id: steemId
      })
      if (res && res.success === 'ok') {
        // const d = {
        //   success: 'ok',
        //   code: 1000,
        //   page: 1,
        //   max_page: 1,
        //   data: [
        //     {
        //       steem_id: 'q4742fbc1',
        //       user_name: '卖鱼的',
        //       avatar:
        //         'https://cdn.steemitimages.com/DQmWqz5wH3mki4JGksF2q5XEfM32iAQbLJGWYm45rTrZoFo/t%E5%A4%B4%E5%83%8F2.jpg',
        //       profile: '一个鱼贩子',
        //       isFollowing: false
        //     }
        //   ]
        // }
        // this.followers = d.data
        this.followers = res.data
      }
    },
    async getFollowing() {
      this.followingActive = true
      this.followerActive = false
      const steemId = this.$route.query.steemId
      const res = await following({
        steem_id: steemId
      })
      if (res && res.success === 'ok') {
        this.following = res.data
      }
    },
    async getFavorites() {
      const id = this.$route.query.id
      const favorites = await getfavorites({
        id :this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken()
      })
      if (favorites && favorites.success === 'ok') {
        this.favorites = favorites.data
      }
    },
    goColumnDetail(v) {
      // console.log(v)
      this.$router.push({
        path: '/columnDetail',
        query: {
          subName: v.title
        }
      })
    },
    async getOtherUserInfo() {
      this.$loading.show()
      const id =
        this.loginType === 'eth'
          ? this.userInfo.eth_account
          : this.userInfo.user
      const steemId = this.$route.query.steemId
      const res = await getOtherUser({
        id,
        steem_id: steemId,
        token: getToken()
      })
      this.$loading.hide()
      if (res && res.success === 'ok') {
        if (res.self) {
          this.getFavorites()
          this.getNotifications()
          this.getHotColumns()
        }
        this.currentInfo = res
        const arr = []
        let resArr = []
        resArr = res.self ? this.userInfo : res.data
        resArr.article.forEach((e, i) => {
          arr.push({
            title: e.name,
            image: e.image,
            member: e.member
          })
        })
        this.specialList = arr
        this.detailList.forEach((item) => {
          item.num = this.currentInfo.data[item.id]
        })
        console.log(this.detailList)
      }
    },
    handleChoosed(v) {},
    toggleTag(type, index) {
      this.activeTagIndex = index
      this.filterReportList = this.reportList.filter((ele) => {
        return ele.type === type
      })
    },
    async getHotColumns() {
      this.favoriteLoading = true
      const res = await hotColumn({})
      if (res && res.success === 'ok') {
        const arr = []
        res.data.forEach((item, i) => {
          arr.push({
            value: item,
            isHot: false
          })
        })
        this.hotColumns = arr
      }
      this.favoriteLoading = false
    },
    goLink() {
      this.$bus.$emit('changeTab', { name: 'auction' }, 2)
    }
  },
  watch: {

    '$i18n.locale': {
      handler(newVal, oldVal) {
        this.detailList = [
        {
          text: this.$t('information.view'),
          num: 0,
          id: 'view'
        },
        {
          text: this.$t('information.followers'),
          num: 0,
          id: 'followers'
        },
        {
          text: this.$t('information.articles_num'),
          num: 0,
          id: 'articles_num'
        },
        {
          text: this.$t('information.comment_num'),
          num: 0,
          id: 'comment_num'
        }
      ]
      },
      deep: true,
      immediate: true
    },

  }
}
</script>

<style scoped lang="scss">
::v-deep .el-tabs__content {
  padding-left: 10px;
  padding-right: 10px;
}
::v-deep .el-tabs__nav-wrap::after {
  width: 0;
}
::v-deep .el-tabs__nav {
  width: 100%;
}
::v-deep .el-tabs__header {
  margin: 0;
  height: 50px;
  background-color: #606060;
  line-height: 50px;
  border-radius: 10px;
}
::v-deep .el-tabs__item {
  width: 25%;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}
::v-deep .el-tabs__item:hover {
  color: #fcca00;
}
::v-deep .el-tabs__item.is-active {
  color: #fcca00;
}
::v-deep .el-tabs__active-bar {
  background-color: #fff;
  display: none;
}

.wbpro-side-card7 .con {
  position: relative;
  height: 40px;
  padding: 0 30px 0 24px;
}

.wbpro-side-card7 .rank {
  position: absolute;
  top: 50%;
  left: 0;
  width: 20px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  text-align: center;
  color: #ffad33;
  font-weight: bold;
}
.wbpro-side-card7 .rank-top {
  color: #f93a3a;
}
.information_container {
  height: 100%;
  padding: 20px 10% 0;
  display: flex;
  justify-content: space-between;
  .left_container {
    width: 100%;
    height: 100vh;
    .infor_user_name {
      .forest {
        width: 100%;
        height: 200px;
        background-image: url('../../assets/random5.jpg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-top: 50px;
          margin-left: 30px;
          box-shadow: 0 1px 1px rgba(0,0,0,0.15);
        }
      }

      .name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #606060;
        // width: 100%;
        height: 100px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        color: #fff;
        padding: 0 30px;
        font-size: 18px;
        font-weight: bold;
        .follow_btn {
          font-size: 16px;
          font-weight: 400;
          cursor: pointer;
          display: inline-block;
          width: 100px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          &:hover {
            color: $iconActiveColor;
          }
        }
      }
    }
    .infor_user_detail {
      width: 100%;
      height: 120px;
      background: #606060;
      margin-top: 10px;
      border-radius: 10px;
      .detail_lists {
        margin-left: 10%;
        width: 80%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: center;
        .detail_list {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          .num {
            font-size: 24px;
            font-weight: bold;
            color: #fff;
          }
          .text {
            color: #9f9f9f;
            font-size: 18px;
          }
        }
      }
    }
    .tab_container {
      background-color: #8f8f8f;
      min-height: 550px;
      border-radius: 10px;
      .infor_user_article {
        margin-top: 10px;
        border-radius: 10px;
        .follow {
          display: flex;
          background-color: #fff;
          margin-top: 10px;
          border-radius: 10px;
          height: 450px;
          .trail_item {
            display: flex;
            height: 80px;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #c0c0c0;
            padding: 5px;
            cursor: pointer;
            .operation {
              height: 24px;
              line-height: 24px;
              width: 80px;
              background-color: #e5e9ef;
              border-radius: 5px;
              text-align: center;
            }
            img {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              object-fit: cover;
            }
            .content {
              height: 70px;
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              font-size: 14px;
              margin-left: 20px;
              width: calc(100% - 50px);
              position: relative;
              .user_name:hover {
                color: $mainColor;
              }
              div {
                margin-bottom: 5px;
              }
              .detail {
                color: #9f9f9f;
                font-size: 12px;
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-bottom: 0;
              }
            }
          }
          .box-card {
            padding: 10px 20px;
            max-height: 400px;
            overflow-y: scroll;
          }
          .box-card::-webkit-scrollbar {
            display: none;
          }

          .box-card::-webkit-scrollbar {
            width: 0 !important;
          }
          /*IE 10+*/
          .box-card {
            -ms-overflow-style: none;
          }
          /*Firefox*/
          .box-card {
            overflow: -moz-scrollbars-none;
          }
          .trail_container {
            overflow: auto;
          }
          .follow_text {
            border-radius: 5px;
            border: 1px solid #c0c0c0;
            width: 80px;
            height: 24px;
            line-height: 24px;
            text-align: center;
          }
          .follow_text:hover {
            color: $mainColor;
            border: 1px solid $mainColor;
          }
          .follow_menu {
            width: 20%;
            padding-left: 10px;
            border-right: 1px solid #c0c0c0;

            .following_type:hover {
              color: $mainColor;
            }
            .active {
              border-radius: 5px;
              padding-left: 5px;
              background-color: $mainColor;
              color: #fff;
            }
          }
          .follow_list {
            width: 80%;
          }
        }
        .my_special {
          padding: 10px 20px;
          font-size: 14px;
          background-color: #fff;
          min-height: 450px;
          border-radius: 10px;
          margin-top: 10px;
          .special_top {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            .learnMore {
              cursor: pointer;
              padding: 0;
            }
          }
          .special_content::-webkit-scrollbar {
            display: none;
          }

          .special_content::-webkit-scrollbar {
            width: 0 !important;
          }
          /*IE 10+*/
          .special_content {
            -ms-overflow-style: none;
          }
          /*Firefox*/
          .special_content {
            overflow: -moz-scrollbars-none;
          }
          .special_content {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            width: 100%;
            height: 420px;
            overflow-y: auto;
            .special_item {
              // min-width: 28%;
              width: 28%;
              height: 90px;
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
        .collect::-webkit-scrollbar {
          display: none;
        }

        .collect::-webkit-scrollbar {
          width: 0 !important;
        }
        /*IE 10+*/
        .collect {
          -ms-overflow-style: none;
        }
        /*Firefox*/
        .collect {
          overflow: -moz-scrollbars-none;
        }
        .collect {
          width: 100%;
          margin-top: 10px;
          background-color: #fff;
          padding: 10px 20px;
          font-size: 14px;
          height: 450px;
          overflow: auto;
          border-radius: 10px;
          .collect_title {
            margin-bottom: 20px;
          }
          .collect_content {
            display: flex;
            flex-direction: column;
            .collect_item {
              height: 70px;
              cursor: pointer;

              .collect_right {
                font-size: 14px;
                // padding-left: 20px;
                height: 100%;
                width: 100%;
                .title {
                  margin-top: 10px;
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
                  margin-top: 10px;
                }
              }
            }
          }
        }
      }
    }
  }
  .right_container {
    width: 25%;
    height: 100vh;
    .woo-box-flex {
      display: flex;
    }
    .woo-box-alignCenter {
      align-items: center;
    }
    .wbpro-side-tit {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      display: flex;
      position: relative;
    }
    .f14 {
      cursor: pointer;
      width: 172px;
      font-size: 14px;
    }
    .f12 {
      cursor: pointer;
      margin-left: 4px;
      font-size: 12px;
      line-height: 16px;
    }
    .clb {
      min-width: 50px;
    }
    .wbpro-side-card7 .wbpro-textcut {
      margin-right: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .wbpro-side-panel {
      padding: 0 18px;
    }
    .infor_hot {
      height: 430px;
      .hot_container::-webkit-scrollbar {
        display: none;
      }

      .hot_container::-webkit-scrollbar {
        width: 0 !important;
      }
      /*IE 10+*/
      .hot_container {
        -ms-overflow-style: none;
      }
      /*Firefox*/
      .hot_container {
        overflow: -moz-scrollbars-none;
      }
      .recommend_wrapper {
        height: 100%;
        background-color: #606060;
        margin-left: 20px;
        width: 250px;
        position: relative;
        border-radius: 10px;

        .hot_container {
          overflow: scroll;
          height: 350px;
          color: #fff;
        }
        .hot_auction {
          position: absolute;
          bottom: 10px;
          left: 18px;
          cursor: pointer;
          display: flex;
          color: #dd2222;
          margin-top: 20px;
          align-items: center;
          .hot_text {
            font-size: 14px;
            font-weight: bold;
            width: auto;
            display: inline-block;
            margin-left: 10px;
            background-color: #ffbf6b;
            color: #000;
            text-align: center;
            height: 26px;
            line-height: 26px;
            border-radius: 10px;
            width: 160px;
            // animation: shake 4s ease-in-out infinite;
          }
        }
      }
    }
    .infor_inform {
      .report {
        margin-top: 10px;
        width: calc(100% - 60px);
        margin-left: 20px;
        background-color: #606060;
        padding: 10px 20px;
        font-size: 14px;
        height: 530px;
        overflow: auto;
        border-radius: 10px;
        .tag_container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          .tag {
            margin-left: 0;
            cursor: pointer;
            height: 20px;
            line-height: 20px;
            border-radius: 20px;
            min-width: 50px;
            max-width: 100px;
            height: 24px;
            text-align: center;
            font-size: 14px;
            line-height: 24px;
          }
          .tag:hover {
            color: #087790;
            border-color: #087790;
          }
          .active {
            color: #087790;
            border-color: #087790;
          }
        }
        .report_content::-webkit-scrollbar {
          display: none;
        }

        .report_content::-webkit-scrollbar {
          width: 0 !important;
        }
        /*IE 10+*/
        .report_content {
          -ms-overflow-style: none;
        }
        /*Firefox*/
        .report_content {
          overflow: -moz-scrollbars-none;
        }
        .report_content {
          height: 450px;
          overflow: scroll;
          .report_item {
            height: 50px;
            display: flex;
            cursor: pointer;
            margin-top: 20px;
            .report_right {
              font-size: 12px;

              // padding-left: 20px;
              height: 40px;
              width: calc(100% - 40px);
              .title {
                color: #fff;
                font-size: 12px;
                font-weight: 700;
                width: 100%;
                height: 20px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .content {
                width: 100%;
                height: 20px;
                margin-top: 5px;
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
  }
}
</style>
