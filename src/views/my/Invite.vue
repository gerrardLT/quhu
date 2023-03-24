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
    <el-button type="danger" round @click="copy($event)"
      >复制邀请链接</el-button
    >
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
  methods: {
    copy(e) {
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      clipboard(
        'https://app.onlyfun.city/#/login?invitedId=' + userInfo.invitedId,
        e
      )
      // clipboard(
      //   'http://localhost:8888/#/login?invitedId=' + userInfo.invitedId,
      //   e
      // )
      this.$message.success('复制成功！')
    }
  }
}
</script>

<style scoped>
.invite_container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
