<template>
  <div class="official_banner">
    <div class="office_tab">
      <div class="tab_btns">
        <div
          :class="{ tab_btn: true, active: activeIndex === tab.index }"
          v-for="tab in tabBtns"
          :key="tab.id"
          @click="tabClick(tab)"
        >
          <span class="tab_text"
            ><span class="text">{{ tab.text }}</span>
          </span>
        </div>
      </div>

      <div class="sort">
        <el-select v-model="sortType" @change="changeSort">
          <el-option :label="$t('office_banner.newest')" :value="$t('office_banner.newest')" />
        </el-select>
      </div>
    </div>
    <div class="office_content">
      <div v-show="activeIndex === 0">
        <div @click="goLink(item)" v-for="item in noticeList" :key="item.post_id" class="notice">
          <img class="avatar" :src="item.body.avatar" alt="" />
          <div class="square-title">
            <div class="title">
              <div class="left">{{ item.title }}</div>
              <div class="right">{{ transfromTimeZoom(item.created) }}</div>
            </div>
            <div class="content">
              {{ item.body.body }}
            </div>
            <div class="name">
              {{ item.body.subscriptions_name }}
            </div>
          </div>
        </div>
      </div>
      <div v-show="activeIndex === 1" class="new"></div>
    </div>
  </div>
</template>

<script>
import { getArticles } from '@/api/special/special'
import { decrypt } from '@/utils/ascill'
export default {
  name: 'official',
  components: {},
  data() {
    return {
      activeIndex: 0,
      sortType: '',
      tabBtns: [
        {
          index: 0,
          id: 'inform',
          text: this.$t('office_banner.offical_inform')
        },
        {
          index: 1,
          id: 'renew',
          text: this.$t('office_banner.renew')
        }
      ],
      noticeList: []
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
    this.getNotice()
  },
  mounted() {},
  methods: {
    decrypt,
    goLink(v){
      console.log(v)
      this.$bus.$emit('changeTab', { name: 'home' }, 0, {
        selectedColumn:v.body.subscriptions_name
        })
    },
    transfromTimeZoom(v) {
      const dateStr = v
      const date = new Date(dateStr)
      const timeDiff = 8 * 60 * 60 * 1000 // 时差为8小时，转换为毫秒
      const dateInGMT8 = new Date(date.getTime() + timeDiff)
      return dateInGMT8.toLocaleString()
    },
    eval(fn) {
      const Fn = Function
      return new Fn('return ' + fn)()
    },
    goHome() {
      this.$router.push({
        path: '/home'
      })
    },
    changeSort() {},
    tabClick(tab) {
      this.activeIndex = tab.index
    },
    async getNotice() {
      this.$loading.show()
      const params = {
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        jsonrpc: '2.0',
        method: 'bridge.get_ranked_posts',
        params: {
          sort: 'created',
          tag: 'sa1b863fa31'
        }
      }
      const res = await getArticles(params)
      const columns = this.userInfo.article
      let columnK = 0
      columns.forEach((item) => {
        if (item.name === this.$t('office_banner.offical_inform')) {
          columnK = item.k
        }
      })
      this.$loading.hide()
      if (res && res.result) {
        res.result.forEach((element) => {
          element.body = this.eval(element.body)
          element.body.body = this.decrypt(element.body.body, columnK).match(
            /<p>([\s\S]*?)<\/p>.*?<p>([\s\S]*?)<\/p>/
          )[2]
        })
        this.noticeList = res.result
      }
    }
    
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
::v-deep .el-input__inner {
  width: 100px;
}
.official_banner {
  padding: 40px 120px 0 120px;
  // background-color: #f6f9f9;
  background-color: $bgcolor;
  height: 100vh;
  .office_tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tab_btns {
      display: flex;
      align-items: center;
      .tab_btn {
        margin-right: 20px;
        height: 40px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #bfbfbf;
        cursor: pointer;

        .tab_text {
          position: relative;
          &::before {
            position: absolute;
            top: -20px;
            content: '\2022'; /* 使用 Unicode 代码表示小圆点 */
            font-weight: bold; /* 可选，根据需要调整 */
            font-size: 40px;
          }
          span.text {
            padding-left: 20px;
          }
        }
        &:hover {
          color: $mainColor;
        }
      }
      .active {
        color: $mainColor;
      }
    }
    .sort {
    }
  }
  .office_content {
    margin-top: 20px;
    .notice {
      display: flex;
      border-bottom: 1px solid #c0c0c0;
      .avatar {
        width: 200px;
        height: 124px;
        cursor: pointer;
      }
      .square-title {
        width: 100%; /* 设置元素宽度 */
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-right: 20px;
        font-size: 14px;
        color: #999999;
        div {
          margin-top: 6px;
        }
        .title {
          display: flex;
          justify-content: space-between;
          .left {
            cursor: pointer;
            font-size: 16px;
            color: #666666;
            font-weight: bold;
            &:hover {
              color: $mainColor;
            }
          }
        }
        .content {
          cursor: pointer;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          -webkit-line-clamp: 2;
        }
        .name {
          width: 80px;
          text-align: center;
          border: 1px solid #999999;
          border-radius: 2px;
          margin-top: 20px;
          &:hover {
            border: 1px solid $mainColor;
            color: $mainColor;
          }
        }
      }
    }
    .new {
    }
  }
}
</style>
