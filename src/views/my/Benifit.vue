<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-10-11 14:11:13
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-10-11 15:08:28
 * @FilePath: \quhu\src\views\my\Benifit.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="benifit_container">
    <div class="benifit_lists">
      <div class="list" v-for="item in benifitLsits" :key="item.id">
        <div class="left">
          <img src="../../assets/fengwo.jpg" alt="">
          <div class="intro">
            <div class="title">usdt_pool体验金</div>
            <div class="date">{{transformTime(Number(item.startTime))+'~'+transformTime(Number(item.endTime))}}</div>
          </div>
        </div>
        <div class="right">
          <div>{{item.val}} USDT</div>
          <div class="go" @click="goStack">去使用</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { transformTime } from '@/utils/tool'
export default {
  data() {
    return {
      benifitLsits: [
        {
          id: 0,
          val: 200,
          startTime: 12312312312,
          endTime: 123123123123
        }
      ]
    }
  },
  created() {},
  mounted() {},
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    }
  },
  methods: {
    transformTime,
    goStack() {
      this.$router.push({
        path: '/mining'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.benifit_container {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  .benifit_lists {
    width: 70%;
    .list {
      width: 100%;
      height: 100px;
      display: flex;
      border-radius: 20px;
      background-color: #fff;
      .left {
        width: 70%;
        display: flex;
        align-items: center;
        font-size: 12px;
        img {
          width: 60px;
          height: 60px;
          margin-left: 10px;
          margin-right: 10px;
        }
        .title {
          font-size: 14px;
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
        font-size: 14px;
        .go {
          cursor: pointer;
        }
      }
    }
  }
}
</style>