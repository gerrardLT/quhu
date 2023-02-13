<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-12 14:01:22
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 03:26:24
 * @FilePath: \quhu\src\views\Home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div class="invite_container">

    </div>
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'Invite',
  created() {
    // if (this.$route.query.user) {
    //   this.$store.dispatch('getUserInfo', {
    //     id: decodeURIComponent(this.$route.query.user),
    //     token: getToken()
    //   })
    // }
  },
  mounted() {
    console.log(this.$store.state)
  },
  data() {
    return {}
  },
  methods: {
    logout() {
      // window.sessionStorage.clear()
      // this.$router.push('/login')
      // this.$message.warning('已退出')
    }
  }
}
</script>

<style scoped lang="scss">
.invite_container {
}
</style>
