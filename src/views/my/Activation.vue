<template>
  <div class="activation_container">
    <div class="activation">
      <div class="activation_header">
        <div
          v-for="(item, i) in activationList"
          :key="i"
          @click="tabDetail(item, i)"
        >
          <div :class="{ item }">
            <img :src="item.image" alt="" />
          </div>
          <div class="label">{{ item.text }}</div>
        </div>
      </div>
      <div class="activation_content">
        <div class="my_header">
          <div class="left_container">
            <div class="title">我的活跃度</div>
            <div class="number">{{ activation }}</div>
          </div>
          <div class="right_container"></div>
        </div>
        <!-- <div class="report">
          <div>积分记录</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: 0,
      activationList: [
        // {
        //   image: require('../../assets/activation-shop.png'),
        //   text: '活跃度商城'
        // },
        // {
        //   image: require('../../assets/activation-detail.png'),
        //   text: '活跃度明细'
        // },
        // {
        //   image: require('../../assets/activation-task.png'),
        //   text: '活跃度任务'
        // },
        {
          image: require('../../assets/activation-my.png'),
          text: '我的活跃度'
        }
      ]
    }
  },
  computed: {
    activation() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')).integral
    }
  },
  created() {},
  mounted() {},
  methods: {
    tabDetail(v, i) {
      this.isActive = i
    }
  }
}
</script>

<style scoped lang="scss">
.activation_header {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  justify-content: center;
  padding: 20px 100px;
  margin-top: 20px;
  // background-color: #d0d0d0;
  border-radius: 5px;
  .item {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  .active {
    background-color: #daa0a6;
  }
  img {
    width: 60px;
    height: 60px;
  }
  .label {
    margin-top: 20px;
    text-align: center;
  }
}
.activation_content {
  .my_header {
    display: flex;
    background-color: #cecece;
    height: 250px;
    margin-top: 20px;
    .left_container {
      padding: 20px;
      width: 60%;
      .title {
        font-size: 24px;
      }
      .number {
        font-size: 32px;
        font-weight: bold;
        margin-top: 20px;
      }
    }
    .right_container {
      width: calc(40% - 40px);
      background-image: url('../../assets/my-activation.png');
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      height: 100%;
    }
  }
}
</style>
