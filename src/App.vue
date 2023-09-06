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
    <el-switch
      class="language"
      v-model="langValue"
      :active-text="active_text"
      :inactive-text="inactive_text"
      @change="translate"
    />
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
    this.setSwitch()
  },
  mounted() {
    if (!this.isTabP) {
      this.$refs.app.style.paddingTop = 0
    }
  },
  data() {
    return {
      langValue: false,
      lang: '',
      active_text: '',
      inactive_text: ''
    }
  },
  computed: {
    isTabP() {
      return this.$route.meta.isTabPage
    }
  },
  methods: {
    setSwitch() {
      this.active_text =
        navigator.language === 'zh' || navigator.language === 'zh-CN'
          ? 'en'
          : '中文'
      this.inactive_text =
        navigator.language === 'zh' || navigator.language === 'zh-CN'
          ? '中文'
          : 'en'
      this.lang =
        navigator.language === 'zh' || navigator.language === 'zh-CN'
          ? 'zh'
          : 'en'
      this.$i18n.locale = this.lang
    },
    translate() {
      this.lang = this.lang === 'zh' || this.lang === 'zh-CN' ? 'en' : 'zh'
      this.$i18n.locale = this.lang
      localStorage.setItem('lang', this.lang)
    }
  },
  watch: {
    isTabP: {
      handler(newVal, oldVal) {
        if (this.$refs.app) {
          if (!this.isTabP) {
            this.$refs.app.style.paddingTop = 0
          } else {
            this.$refs.app.style.paddingTop = '60px'
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style>
.language {
  position: absolute;
  right: 20px;
  top: 30px;
  z-index: 1000;
}

/* ::v-deep .el-switch__label.is-active {
  color: #087790;
} */
</style>
