<template>
  <div>
    <div class="top" style="margin-right: 10px; margin-bottom: 20px">
      <div class="balance">
        <svg
          :style="{
            fill: '#087790',
            width: '30px',
            height: '30px',
            marginRight: '15px'
          }"
        >
          <use :xlink:href="'#icon-pay'" rel="external nofollow" />
        </svg>
        <span class="item">{{ balanceAmount.ofc }} ofc</span>
        <el-divider direction="vertical"></el-divider>
        <span class="item">{{ balanceAmount.poys }} poys</span>
        <el-divider direction="vertical"></el-divider>
        <span class="item">{{ balanceAmount.usdt }} usdt</span>
        <el-divider direction="vertical"></el-divider>
        <span class="item">{{ balanceAmount.bnb }} bnb</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    balanceAmount: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style scoped lang="scss">
.top {
  position: absolute;
  top: 20px;
  right: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .balance {
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
    // min-width: 400px;
    border-radius: 20px;
    border: 1px solid #e4e4e4;
    padding: 0 10px;
    .item {
      min-width: 60px;
    }
  }

  .cart {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    cursor: pointer;
    // border: 1px solid #e4e4e4;
  }
}
</style>
