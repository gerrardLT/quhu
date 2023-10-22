<template>
  <div class="recharge_container">
    <!-- <el-page-header @back="goBack"> </el-page-header> -->
    <div class="content">
      <el-steps direction="vertical">
        <el-step :title="$t('recharge.choose_coin')">
          <template slot="description">
            <el-select
              class="coin_select"
              v-model="currency"
              clearable
              :placeholder="$t('column_detail.select_coin')"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in payTypes"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </template>
        </el-step>
        <el-step :title="$t('recharge.choose_net')">
          <template slot="description">
            <el-select
              class="coin_select"
              v-model="net"
              clearable
              disabled
              :placeholder="$t('column_detail.select_coin')"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in netTypes"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </template>
        </el-step>
        <el-step :title="$t('recharge.address')" class="deposit_address">
          <template slot="description" v-if="currency">
            <div class="address">
              {{ userInfo.deposit_address }}
              <i class="el-icon-copy-document" @click="copy($event)"></i>
            </div>
            <div class="min_coin">
              <span>{{ $t('recharge.min_recharge') }}：</span>
              <span>{{ '>' }}{{ min_coin[currency] }}</span>
            </div>
            <el-divider style="width: 400px"></el-divider>
            <div class="rechanrge_tips">
              <div class="item">{{ $t('recharge.tip1') }}</div>
              <div class="item">{{ $t('recharge.tip2') }}</div>
              <div class="item">
                {{ $t('recharge.tip3') }}&nbsp;<span
                  style="cursor: pointer"
                  @click="showAdress"
                  >{{
                    show ? tokens[currency][1] : '***' + tokens[currency][0]
                  }}</span
                >
              </div>
              <div class="item warning">
                <i class="el-icon-warning"></i> {{ $t('recharge.tip4') }}
              </div>
            </div>
          </template>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
export default {
  data() {
    return {
      payTypes: ['poys','op', 'ofc', 'usdt', 'bnb', 'btc', 'eth'],
      netTypes: ['BNB Smart Chain(BEP20)'],
      currency: '',
      net: 'BNB Smart Chain(BEP20)',
      tokens: {  
        poys: ['f2a86', '0x20707c071e841ab879532b450b69079e667f2a86'],
        op: ['00042', '0x4200000000000000000000000000000000000042'],
        usdt: ['97955', '0x55d398326f99059ff775485246999027b3197955'],
        ofc: ['93dd9', '0xee902a8df3f6cdb9f2f95536ed84a4e725793dd9'],
        eth: ['933F8', '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'],
        btc: ['ead9c', '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c'],
        bnb: ['', '']
      },
      min_coin: {
        poys: '1',
        usdt: '0.01',
        ofc: '1',
        eth: '0.0000001',
        btc: '0.0000001',
        bnb: '0.000001',
        op:'0.01'
      },
      show: false
      //   tokens:{
      // poys:"0x20707c071e841ab879532b450b69079e667f2a86",
      // busd:"0x55d398326f99059ff775485246999027b3197955",
      // ofc:"0xee902a8df3f6cdb9f2f95536ed84a4e725793dd9",
      // eth:"0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      // btc:"0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c"
      //     }
    }
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    }
  },
  created() {},
  mounted() {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    copy(e) {
      clipboard(this.userInfo.deposit_address, e)
    },
    showAdress() {
      this.show = !this.show
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-step__title {
  font-size: 20px;
  font-weight: bold;
}
::v-deep .el-input--suffix {
  min-width: 300px;
}
::v-deep .el-divider--horizontal {
  width: 400px;
}
.recharge_container {
  .content {
    padding: 20px 50px;
    .coin_select {
      margin-top: 20px;
      height: 80px;
    }

    .address {
      font-size: 16px;
      height: 40px;
      margin-top: 20px;
      color: rgb(112, 122, 138);
    }
    .rechanrge_tips {
      color: rgb(112, 122, 138);
      font-size: 14px;
      .item {
        height: 40px;
        line-height: 40px;
      }
      .warning {
        color: #e6a23c;
      }
    }
    .min_coin {
      width: 400px;
      color: rgb(112, 122, 138);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }
  }
}
</style>
