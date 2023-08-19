<template>
  <div class="mining_tab_container">
    <div class="tabs">
      <div
        v-for="item in tabList"
        :key="item.id"
        @click="tabClick(item, index)"
        class="tab"
      >
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabIndex: {
      type: Number,
      required: true
    },
    tabList: {
      type: Array,
      required: true
    }
  },
  name: 'MiningTab',
  components: {},
  data() {
    return {}
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    },
    currentPath() {
      return this.$route.path
    }
  },

  created() {},
  mounted() {},
  methods: {
    tabClick() {}
  }
}
</script>

<style scoped lang="scss">
.mining_tab_container {
  .tabs {
    display: flex;
    align-items: center;
    width: 100%;
    .tab {
      min-width: 80px;
      height: 30px;
      display: inline-block;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      margin-right: 20px;
      cursor: pointer;
      &:hover {
        background-color: $mainColor;
        color: #fff;
      }
    }
  }
}
</style>
