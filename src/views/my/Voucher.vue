<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-27 04:17:54
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-29 15:00:54
 * @FilePath: \quhu\src\views\my\Integral.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="wallet">
    <div class="coin-list">
      <div class="coin-title">资产</div>
      <div class="coin-item" v-for="item in coinList" :key="item.id">
        <div class="coin-name">{{ item.name }}</div>
        <div class="balance">{{ item.balance }}</div>
      </div>
    </div>
    <div class="operation">
      <el-button type="primary" around @click="showAddress">充值</el-button>
      <el-button type="primary" around>提现</el-button>
    </div>
    <div v-show="isShowAddress" class="address-container">
      <span>转入地址：{{ address }}</span>
      <i class="el-icon-copy-document" @click="copy(address, $event)"></i>
    </div>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
export default {
  data() {
    return {
      coinList: [
        {
          name: 'OP',
          balance: 1000000000,
          id: 0
        },
        {
          name: 'POYS',
          balance: 0,
          id: 1
        },
        {
          name: 'OFC',
          balance: 0,
          id: 2
        },
        {
          name: 'BUSD',
          balance: 0,
          id: 3
        },
        {
          name: 'BNB',
          balance: 0,
          id: 4
        }
      ],
      address: '',
      isShowAddress: false
    }
  },
  created() {},
  mounted() {},
  methods: {
    showAddress() {
      const address = JSON.parse(
        localStorage.getItem('quhu-userInfo')
      ).deposit_address
      this.address = address
      this.isShowAddress = true
    },
    copy(key, e) {
      clipboard(key, e)
    }
  }
}
</script>

<style scoped lang="scss">
.wallet {
  padding: 50px;
}
.coin-list {
  display: flex;
  align-items: center;
  // justify-content: center;
  flex-direction: column;
  width: 500px;
  position: relative;
}
.coin-title {
  position: absolute;
  left: 0;
  top: -20px;
}
.coin-item {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.coin-name {
  width: 50px;
}
.balance {
  width: 50px;
}
.operation {
  display: flex;
  justify-content: space-around;
  width: 500px;
}
.address-container {
  // width: 500px;
  height: 50px;
  margin-top: 50px;
  // background-color: #c0c0c0;
  // color: #fff;
}
.el-icon-copy-document {
  margin-left: 10px;
}
</style>
