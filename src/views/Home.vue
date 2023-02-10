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
    <div class="swiper_container">
      <el-carousel :interval="4000" type="card" height="200px" width="500px">
        <el-carousel-item v-for="item in swiperList" :key="item.id">
          <img :src="item.url" height="250px" alt="">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="special_container">
      这是专栏精选
    </div>
  </div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  name: 'Home',
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
    return {
      // 左侧菜单数据
      swiperList: [
        {
          id: 0,
          url: require('../assets/first.jpeg'),
          name: ''
        },
        {
          id: 1,
          url: require('../assets/second.jpg'),
          name: ''
        },
        {
          id: 3,
          url: require('../assets/third.jpg'),
          name: ''
        },
        {
          id: 4,
          url: require('../assets/fourth.jpeg'),
          name: ''
        }
      ]
    }
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

<style scoped>
.home_container {
  height: 100%;
  width: 100%;
}
.swiper_container {
  width: 100%;
}
.special_container {
  width: 100%;
  height: 400px;
}
</style>
