<template>
  <div>
    <div class="except_container">
      <div class="title">
        <h2>{{ $t('except.tip1') }}</h2>
        <h4>
          {{ $t('except.tip2') }}
        </h4>
        <h4>{{ $t('except.tip3') }}</h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Except',
  created() {},
  mounted() {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.except_container {
  width: 100vw;
  height: 100vh;
  color: #fff;
  display: flex;
  justify-content: center;
  background: url('../../assets/404.png') no-repeat center center;
  background-color: $mainColor;
  .title {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
