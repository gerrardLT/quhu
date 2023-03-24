<template>
  <div class="auction_container">
    <div class="auction">
      <div class="auction_header">
        <div
          v-for="(item, i) in activationList"
          :key="i"
          @click="tabDetail(item, i)"
        >
          <div :class="{ active: isActive === i, item }">
            <img :src="item.image" alt="" />
          </div>
          <div class="label">{{ item.text }}</div>
        </div>
      </div>
      <div class="auction_content">
        <div class="shop">
          <!-- <el-col :span="12"></el-col>
          <el-col :span="12"></el-col> -->
          <el-empty description="暂无数据"></el-empty>
        </div>
        <!-- <div class="detail">
          <el-empty description="暂无数据"></el-empty>
        </div>
        <div class="task">
          <el-empty description="暂无数据"></el-empty>
        </div>
        <div class="my">
          <el-empty description="暂无数据"></el-empty>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Auction',
  data() {
    return {
      isActive: 0,
      activationList: [
        {
          image: require('../../assets/activation-shop.png'),
          text: '拍卖商城'
        },
        {
          image: require('../../assets/activation-detail.png'),
          text: '拍卖明细'
        },
        {
          image: require('../../assets/activation-task.png'),
          text: '拍卖中'
        },
        {
          image: require('../../assets/activation-my.png'),
          text: '我的拍卖'
        }
      ]
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
.auction_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 200px;
  margin-top: 20px;
  background-color: #d0d0d0;
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
.auction_content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 320px);
}
</style>
