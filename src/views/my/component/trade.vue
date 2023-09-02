<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="$t('trade.trade_system')">
      <el-form :model="form" label-width="80px" ref="form">
        <el-form-item :label="$t('trade.coin_quantity')">
          <el-input v-model.number="form.quantity"></el-input>
        </el-form-item>
        <el-form-item :label="$t('trade.select_coin')">
          <el-select v-model="form.selectedCurrency">
            <el-option
              v-for="item in currencies"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('trade.coin_balance')">
          {{ form.balance }}
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">{{
          $t('trade.cancel')
        }}</el-button>
        <el-button type="primary" @click="exchange">{{
          $t('trade.exchange')
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Trade',
  data() {
    return {
      dialogVisible: false,
      form: {
        quantity: null,
        selectedCurrency: '',
        balance: ''
      },
      currencies: [
        { value: 'poys', label: 'POYS' },
        { value: 'usdt', label: 'USDT' },
        { value: 'ofc', label: 'OFC' }
      ],
      balances: {
        poys: 100,
        usdt: 200,
        ofc: 300
      }
    }
  },
  methods: {
    exchange() {
      // 根据选择的币种计算兑换后的余额
      if (this.form.selectedCurrency === 'poys') {
        this.form.balance = (this.balances.usdt / 2) * this.form.quantity
      } else if (this.form.selectedCurrency === 'usdt') {
        this.form.balance = this.balances.poys * this.form.quantity * 2
      } else if (this.form.selectedCurrency === 'ofc') {
        this.form.balance = this.balances.usdt * this.form.quantity
      }
      // 触发父组件的兑换事件
      this.$emit('exchange', this.form)
      // 关闭对话框
      this.dialogVisible = false
    }
  }
}
</script>
