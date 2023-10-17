<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-10-11 14:11:13
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-10-14 12:37:02
 * @FilePath: \quhu\src\views\my\Benifit.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="benifit_container">
    <div class="benifit_lists" v-loading="loading" v-if="benifitLists.length >0">
      <el-select class="sort" v-model="sortType" clearable :placeholder="$t('benifit.choose_sort')" @change="changeSort" v-show="visibility">
        <el-option v-for="item in sortList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div class="list" v-for="item in benifitLists" :key="item.ticket_number">
        <div class="left">
          <img src="../../assets/coupon.png" alt="">
          <div class="intro">
            <div class="title">usdt_pool {{item.limit}}{{$t('mining.day')}}{{$t('mining.coupon_list')}}</div>
            <div class="date">{{$t('benifit.expire_time')}}：{{item.expire_time}}</div>
          </div>
        </div>
        <div class="right">
          <div>{{item.value}} USDT</div>
          <div class="go" @click="goStack">{{$t('benifit.to_use')}}</div>
        </div>
      </div>
    </div>
    <el-empty v-else :description="$t('auction_detail.no_data')"></el-empty>
  </div>

</template>

<script>
import { transformTime } from '@/utils/tool'
import { coupon } from '@/api/user/user'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      benifitLists: [],
      sortType: 'timeDown',
      loading: false,
      visibility: false,
      sortList: [
        {
          value: 'timeDown',
          label: this.$t('benifit.time_down')
        },
        {
          value: 'timeUp',
          label: this.$t('benifit.time_up')
        },
        {
          value: 'amountDown',
          label: this.$t('benifit.amount_down')
        },
        {
          value: 'amountUp',
          label: this.$t('benifit.amount_up')
        }
      ]
    }
  },
  created() {
    this.getCoupon()
  },
  mounted() {},
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    }
  },
  methods: {
    transformTime,
    async getCoupon() {
      this.loading = true
      const res = await coupon({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken()
      })
      this.loading = false
      if (res && res.success === 'ok') {
        this.visibility = true
        this.benifitLists = res.data.ok.reverse()
      }
    },
    transformTimeToStamp(timeStr) {
      return Date.parse(timeStr)
    },
    changeSort() {
      this.$forceUpdate()
      switch (this.sortType) {
        case 'timeDown':
          this.benifitLists = this.benifitLists.sort((a, b) => {
            return (
              this.transformTimeToStamp(b.expire_time) -
              this.transformTimeToStamp(a.expire_time)
            )
          })
          break
        case 'timeUp':
          this.benifitLists = this.benifitLists.sort((a, b) => {
            return (
              this.transformTimeToStamp(a.expire_time) -
              this.transformTimeToStamp(b.expire_time)
            )
          })
          break
        case 'amountDown':
          this.benifitLists = this.benifitLists.sort((a, b) => {
            return b.value - a.value
          })
          break
        case 'amountUp':
          this.benifitLists = this.benifitLists.sort((a, b) => {
            return a.value - b.value
          })
          break
        default:
          break
      }
    },
    goStack() {
      this.$router.push({
        path: '/mining',
        query: {
          referer: 'benifit'
        }
      })
    }
  },
  watch: {
    '$i18n.locale': {
      handler(newVal, oldVal) {
        this.sortList = [
          {
            value: 'timeDown',
            label: this.$t('benifit.time_down')
          },
          {
            value: 'timeUp',
            label: this.$t('benifit.time_up')
          },
          {
            value: 'amountDown',
            label: this.$t('benifit.amount_down')
          },
          {
            value: 'amountUp',
            label: this.$t('benifit.amount_up')
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
.benifit_lists::-webkit-scrollbar {
  display: none;
}

.benifit_lists::-webkit-scrollbar {
  width: 0 !important;
}
/*IE 10+*/
.benifit_lists {
  -ms-overflow-style: none;
}
/*Firefox*/
.benifit_lists {
  overflow: -moz-scrollbars-none;
}

.benifit_container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  .benifit_lists {
    width: 60%;
    padding: 70px 30px 20px;
    background-color: #a1afc9;
    border-radius: 20px;
    min-height: 120px;
    max-height: 510px;
    position: relative;
    overflow-y: scroll;
    .sort {
      position: absolute;
      right: 20px;
      top: 10px;
      width: 120px;
    }
    .list {
      width: 100%;
      height: 100px;
      display: flex;
      border-radius: 20px;
      background-color: #fff;
      margin-bottom: 20px;
      .left {
        width: 70%;
        display: flex;
        align-items: center;
        font-size: 12px;
        img {
          width: 100px;
          height: 80px;
          margin-left: 10px;
        }
        .title {
          font-size: 16px;
          margin-bottom: 5px;
        }
        .date {
          color: #8f8f94;
        }
      }
      .right {
        background-color: #f60;
        color: #fff;
        width: 30%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        font-size: 16px;
        .go {
          cursor: pointer;
        }
      }
    }
  }
}
</style>