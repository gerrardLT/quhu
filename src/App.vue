<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-12 14:01:22
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 04:00:23
 * @FilePath: \quhu\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="app" ref="app">
    <!-- 路由占位符 -->
    <router-view> </router-view>
    <Tabs v-if="isTabP"></Tabs>
  </div>
</template>

<script>
import Tabs from '@/components/tabs/Tabs'
export default {
  components: {
    Tabs
  },
  name: 'app',
  created() {
    // 在页面加载时读取sessionStorage
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('store'))
        )
      )
    }
    // 在页面刷新时将store保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  mounted() {
    this.$refs.app.style.paddingBottom = this.$route.meta.isTabPage
      ? '40px'
      : '0'
  },
  computed: {
    isTabP() {
      return this.$route.meta.isTabPage
    }
  },
  watch: {
    isTabP: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true
    }
  }
}
</script>

<style>
</style>
