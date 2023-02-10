<template>
  <div>
    <div class="comment-box" style="margin-bottom: 10px; padding-top: 8px;" v-for="(v,i) in asideChildren" :key="i">
      <div class="comment-item-container">
        <div class="text"><span class="comment group-owner-light">ywnwa</span><span>：</span><span class="sticky">置顶</span><span parsetype="pure" class="text">123123</span></div>
        <div class="operations">
          <div class="time">2023-01-29 22:36</div>
          <div class="operation"><span>取消置顶</span><span class="space">删除</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AsideItem',
  props: {
    asideChildren: {
      type: Array
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped></style>
