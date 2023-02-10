<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-20 03:15:08
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-27 09:18:56
 * @FilePath: \quhu\src\components\setting-bar\setting-bar.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="setting-bar" v-if="info" @click="go(info)">
    <div class="content">
      <Icon :name="info.icon" color="blue" />
      <div class="menu">
        {{info.title}}
      </div>
    </div>
    <div class="arrow">
      <Icon name="arrowR" color="blue" />
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon/index'
export default {
  name: 'setting-bar',
  components: {
    Icon
  },
  data() {
    return {}
  },
  props: {
    info: Object
  },
  methods: {
    send() {
      this.$emit('send')
    },
    go(e) {
      this.$router.push(this.info.url)
    }
  }
}
</script>

<style scoped>
.setting-bar {
  height: 56px;
  background: #fff;
  padding: 16px 20px 16px 28px;
  position: relative;
  display: flex;
}
.setting-bar:active {
  background: #f9f9f9;
}

.content {
  display: flex;
  align-items: center;
}
.icon {
  width: 24px;
  height: 24px;
  /* border-radius: 6px; */
  /* background: #F3F7F8; */
}

.menu {
  font-family: PingFangSC-Regular;
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
  margin-left: 10px;
  letter-spacing: 1px;
  color: rgba(0, 0, 0, 0.8);
}

.arrow {
  width: 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  right: 20px;
}
</style>
