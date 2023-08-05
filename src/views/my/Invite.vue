<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-27 04:17:54
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-29 15:00:26
 * @FilePath: \quhu\src\views\my\Integral.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="invite_container">
    <div class="link">
      {{ $t('invite.invite_link') }}：{{
        'https://app.onlyfun.city/login?invitedId=' + userInfo.invitedId
      }}
    </div>
    <el-button type="danger" round @click="copy($event)">{{
      $t('invite.copy_invite_link')
    }}</el-button>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
export default {
  data() {
    return {}
  },
  created() {},
  mounted() {},
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    }
  },
  methods: {
    copy(e) {
      clipboard(
        'https://app.onlyfun.city/login?invitedId=' + this.userInfo.invitedId,
        e
      )
      this.$message.success(this.$t('invite.copy_success'))
    }
  }
}
</script>

<style scoped>
.invite_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.link {
  margin-bottom: 20px;
}
</style>
