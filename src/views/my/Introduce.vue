<template>
  <div>
    <div>
      <Info></Info>
    </div>
    <el-row class="special_row">
      <el-col :span="18" class="my_special" v-loading="specialLoading">
        <div class="special_top">
          <span>{{ $t('introduce.my_column') }}</span>
        </div>
        <div v-if="specialList.length > 0" class="special_content">
          <div
            v-for="(item, i) in specialList"
            :key="i"
            class="special_item"
            @click="goColumnDetail(item)"
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
        <el-empty v-else :description="$t('introduce.no_data')"></el-empty>
      </el-col>
      <el-col :span="6" class="collect" v-loading="favoriteLoading">
        <div class="collect_title">{{ $t('introduce.my_collect') }}</div>
        <div v-if="favorites.length > 0" class="collect_content">
          <div
            class="collect_item"
            v-for="(item, i) in favorites"
            :key="i"
            @click="goArticle(item)"
            :title="$t('introduce.to_detail_tip')"
          >
            <!-- <img :src="userInfo.avatar" alt="" class="collect_left" /> -->
            <div class="collect_right">
              <div class="title" :title="item.title">{{ item.title }}</div>
              <div class="content" :title="item.body">{{ item.body }}</div>
            </div>
          </div>
        </div>
        <el-empty v-else :description="$t('introduce.no_data')"></el-empty>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="18" v-loading="trailLoading">
        <el-card class="box-card">
          <div slot="header">
            <span>{{ $t('introduce.new_info') }}</span>
          </div>
          <div v-if="trailList.length > 0" class="trail_container">
            <div
              v-for="(v, i) in trailList"
              :key="i"
              class="trail_item"
              @click="goLink(v, i)"
              :title="$t('introduce.to_detail_tip')"
            >
              <img :src="userInfo.avatar" alt="" />
              <div class="content">
                <div>{{ v.title }}</div>
                <div>{{ transformTime(Number(v.timestamp)) }}</div>
                <div class="detail" v-html="v.body"></div>
              </div>
            </div>
          </div>

          <el-empty v-else :description="$t('introduce.no_data')"></el-empty>
        </el-card>
      </el-col>
      <el-col :span="6" class="report" v-loading="reportLoading">
        <div class="report_title">{{ $t('introduce.inform') }}</div>
        <div class="tag_container">
          <!-- <el-badge :value="noticeLen['upvote']" :max="99">
            <el-tag
            type="info"
            :class="{ tag: true, active: activeTagIndex === 0 }"
            @click="toggleTag('upvote', 0)"
            >{{ $t('introduce.star') }}</el-tag
          >
      </el-badge>
<el-badge :value="noticeLen['replie']" :max="99">
  <el-tag
            type="info"
            :class="{ tag: true, active: activeTagIndex === 1 }"
            @click="toggleTag('replie', 1)"
            >{{ $t('introduce.reply') }}</el-tag
          >
</el-badge>

          <el-badge :value="noticeLen['mentions']" :max="99">
            <el-tag
            type="info"
            :class="{ tag: true, active: activeTagIndex === 2 }"
            @click="toggleTag('mentions', 2)"
            >{{ $t('introduce.mention') }}</el-tag
          >
</el-badge> -->
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
          <div v-for="(v, i) in filterReportList" :key="i" class="report_item">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import Info from './component/info.vue'
import { trail, getUser, notifications } from '@/api/user/user'
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
    this.reportLoading = true

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
    const reports = await notifications({
      id:
        this.loginType === 'eth'
          ? this.userInfo.eth_account
          : this.userInfo.user,
      token: getToken()
    })
    if (reports && reports.success === 'ok') {
      this.reportList = reports.data

      this.filterReportList = this.reportList.filter((item) => {
        this.noticeLen[item.type] += 1
        return item.type === 'upvote'
      })
    }
    this.reportLoading = false
  },
  mounted() {},
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
        arr.push({
          title: e.name,
          image: e.image,
          member: e.member
        })
      })
      return arr
    }
  },
  data() {
    return {
      noticeLen: {
        upvote: 0,
        replie: 0,
        mentions: 0
      },
      trailList: [],
      favorites: [],
      reportList: [],
      filterReportList: [],
      currentInfo: {},
      activeTagIndex: 0,
      specialLoading: false,
      favoriteLoading: false,
      trailLoading: false,
      reportLoading: false
    }
  },
  methods: {
    //     async goDetail(val, ele) {
    //   if (ele) {
    //     setTimeout(() => {
    //       // console.log(this.articleRefs['article' + ele.permlink])
    //       // const el = this.articleRefs['article' + ele.permlink]
    //       // const target = el.offsetTop
    //       // el.scrollIntoView()
    //     }, 500)
    //   }

    //   const userInfo = this.userInfo
    //   const loginType = localStorage.getItem('login-type')
    //   const token = getToken()
    //   const res = await getArticleDetail({
    //     id: loginType === 'password' ? userInfo.user : userInfo.eth_account,
    //     jsonrpc: '2.0',
    //     method: 'bridge.get_discussion',
    //     params: { author: val.author, permlink: val.permlink }
    //   })
    //   const votes = await getVote({
    //     permlink: val.permlink,
    //     steem_id: userInfo.steem_id
    //   })
    //   const obj = res.result[val.author + '/' + val.permlink]
    //   // const commentList = this.getReply(obj, res.result)
    //   let commentList = []
    //   const result = Object.assign(res.result, {})
    //   // 判断评论和正文
    //   for (const key in result) {
    //     if (
    //       key.startsWith('onlyfun-data', 0) &&
    //       key !== val.author + '/' + val.permlink
    //     ) {
    //       result[key].body = this.eval(result[key].body)
    //       commentList.push(result[key])
    //     }
    //   }
    //   commentList.forEach((comment) => {
    //     comment.isShowReplyText = false
    //     // comment.isEditReply = false
    //     comment.reply = ''
    //     comment.child = []
    //   })
    //   commentList = commentList.reverse()
    //   // const commentTree = this.toTree(commentList, val.author)
    //   // console.log(commentList[0].parent_author)
    //   const commentTree = this.buildTreeWithCycle(commentList, val.author)
    //   // console.log(commentTree)
    //   if (obj) {
    //     obj.body = this.eval(obj.body)
    //     let isPraised = false
    //     let voteNum = 0
    //     let isFavorite = false
    //     const vote = votes.data.forEach((item, i) => {
    //       isPraised = item.voted
    //       voteNum = item.vote
    //       isFavorite = item.favorites
    //     })

    //     obj.isPraised = isPraised
    //     obj.voteNum = voteNum
    //     obj.isFavorite = isFavorite
    //     obj.commentList = commentTree
    //     this.currentDetail = obj
    //     if (ele) {
    //       ele.isShowDetailDialog = true
    //     } else {
    //       val.isShowDetailDialog = true
    //     }
    //   }
    //   // console.log(val)
    // },
    //     eval(fn) {
    //   const Fn = Function
    //   return new Fn('return ' + fn)()
    // },
    //     buildTreeWithCycle(data, parent_author, visited = {}) {
    //   const tree = []
    //   for (let i = 0; i < data.length; i++) {
    //     const node = data[i]
    //     if (node.parent_author === parent_author) {
    //       if (visited[node.author]) {
    //         // 如果节点已被访问过，说明存在循环引用，跳过该节点
    //         continue
    //       }
    //       visited[node.author] = true
    //       const children = this.buildTreeWithCycle(data, node.author, visited)
    //       if (children.length) {
    //         node.child = children
    //       }
    //       tree.push(node)
    //     }
    //   }
    //   return tree
    // },
    toggleTag(type, index) {
      this.activeTagIndex = index
      this.filterReportList = this.reportList.filter((ele) => {
        return ele.type === type
      })
    },
    goArticle(data) {
      // window.open(
      //   window.location.host +
      //     `/api/article?author=${data.permlink[0]}&permlink=${data.permlink[1]}`
      // )
      window.open(
        `https://app.onlyfun.city/api/article?author=${data.permlink[0]}&permlink=${data.permlink[1]}`
      )
    },
    copy(e) {
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      clipboard(
        'https://app.onlyfun.city/login?invitedId=' + userInfo.invitedId,
        e
      )
      this.$message.success(this.$t('introduce.copy_success'))
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
    goLink(v, i, type) {
      console.log(v, i)
      if (type === 'trail') {
        if (v.type === 'replie') {
          this.$bus.$emit('changeTab', { name: 'home' }, 0, {
            author: v.perlink[0],
            permlink: v.perlink[1]
          })
        }
      } else {
        this.$bus.$emit('changeTab', { name: 'home' }, 0, {
          author: type === 'trail' ? v.perlink[0] : v.permlink[0],
          permlink: type === 'trail' ? v.perlink[1] : v.permlink[1]
        })
      }
    },
    learnMoreSpecial() {
      this.$bus.$emit('changeTab', { name: 'home' }, 0)
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
::v-deep .box-card {
  max-height: 530px;
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
      height: 300px;
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
    width: calc(25% - 20px);
    margin-left: 20px;
    background-color: #fff;
    padding: 10px 20px;
    font-size: 14px;
    height: 350px;
    .collect_title {
      margin-bottom: 20px;
    }
    .collect_content {
      height: 300px;
      overflow: auto;
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
.report::-webkit-scrollbar {
  display: none;
}

.report::-webkit-scrollbar {
  width: 0 !important;
}
/*IE 10+*/
.report {
  -ms-overflow-style: none;
}
/*Firefox*/
.report {
  overflow: -moz-scrollbars-none;
}
.report {
  margin-top: 10px;
  width: calc(25% - 20px);
  margin-left: 20px;
  background-color: #fff;
  padding: 10px 20px;
  font-size: 14px;
  height: 530px;

  .report_content {
    margin-top: 10px;
    height: calc(100% - 80px);
    overflow: auto;
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
  padding-top: 40px;
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
  min-height: 530px;
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
  min-width: 50px;
  max-width: 100px;
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
