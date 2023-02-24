<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-27 07:41:10
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 04:14:45
 * @FilePath: \quhu\src\components\tabs\Tabs.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->e
<template>
  <div>
    <div class="Frame_top">
      <div class="Nav_wrap">
        <div class="woo-panel-main woo-panel-bottom Nav_panel" style="border-color: #f9f9f9; background-color: #fff;">
          <div class="woo-box-flex woo-box-alignCenter Nav_main">
            <div class="woo-box-flex woo-box-alignCenter Nav_left">
              <a href="/" aria-label="quhu" class="Nav_logoWrap">
                <img src="../../assets/quhu.png" alt="">
              </a>
            </div>
            <div class="Nav_mid">
              <div class="tab" ref="tabRef" v-for="(item,index) in list" :key="item.id" id="item.id" @click="tabClick(item,index)" :title="item.text">
                <div class="svg_container">
                  <svg ref="svgRef" :style="{'fill':color?color:'','width':'25px','height':'25px'}">
                    <use :xlink:href="'#icon-'+item.icon" rel="external nofollow" />
                  </svg>
                </div>
                <div v-if="activeName === item.name" class="woo-tab-item-border"></div>
              </div>
            </div>
            <div class="Nav_right">
              <div class="login_btn" v-if="!isLogin">登录</div>
              <!-- <div class="register_btn">注册</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'Tabs',
  components: {},
  mounted() {
    const self = this
    window.addEventListener(
      'popstate',
      function (e) {
        const path = e.currentTarget.location.hash.replace('#/', '')
        self.activeName = path
        self.toggleStyle(self.nameList.indexOf(path))
      },
      false
    )
    if (sessionStorage.getItem('tabName')) {
      this.activeName = sessionStorage.getItem('tabName')
      const path = this.$route.path.replace('/', '')
      this.toggleStyle(this.nameList.indexOf(path))
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   console.log(to, from)
  // },
  data() {
    return {
      list: [
        {
          id: 0,
          icon: 'home',
          text: '首页',
          name: 'home'
        },
        {
          id: 1,
          icon: 'article',
          text: '热门',
          name: 'article'
        },
        {
          id: 2,
          icon: 'auction',
          text: '竞拍',
          name: 'auction'
        },
        {
          id: 3,
          icon: 'my',
          text: '我的',
          name: 'my'
        }
      ],
      nameList: ['home', 'article', 'auction', 'my'],
      activeName: 'home',
      color: ''
    }
  },
  computed: {
    isLogin() {
      return getToken()
    }
  },
  methods: {
    tabClick(v, i) {
      this.activeName = v.name
      sessionStorage.setItem('tabName', v.name)
      if (this.$route.path !== '/' + this.activeName) {
        this.toggleStyle(i)
        this.$router.push('/' + this.activeName)
      } else {
        // location.reload()
      }
    },
    toggleStyle(i) {
      if (this.$refs.tabRef) {
        document.documentElement.scrollTop = 0
        this.$refs.tabRef.forEach((val, index, arr) => {
          if (index === i) {
            this.$refs.tabRef[index].style.color = '#4fbdd4'
            this.$refs.svgRef[index].style.fill = '#4fbdd4'
          } else {
            this.$refs.tabRef[index].style.color = ''
            this.$refs.svgRef[index].style.fill = ''
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.Nav_panel,
.Nav_wrap {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.Nav_wrap {
  position: fixed;
  z-index: 888;
  left: 0;
  top: 0;
  width: 100%;
  height: 80px;
  padding-top: 0;
  border-top: 2px solid #4fbdd4;
  background-color: transparent;
  -webkit-box-shadow: none;
  box-shadow: none;
  display: flex;
}
.Nav_panel {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: contain;
  background-image: none;
}
.woo-panel-bottom {
  border-bottom: 1px solid #f9f9f9;
}
.Nav_main {
  max-width: 1250px;
  height: 100%;
  margin: auto;
}
.woo-box-alignCenter {
  align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
}
.woo-box-flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.Nav_left {
  width: 200px;
  margin-right: 8px;
}
.Nav_logoWrap {
  position: relative;
  display: inline-block;
  cursor: pointer;
  img {
    width: 120px;
    height: 40px;
  }
}
.Nav_logo {
  width: 90px;
  height: 38px;
}
.Nav_mid {
  width: 750px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998;
  height: 100%;
}
.svg_container {
  margin-top: 10px;
  height: 60px;
  border-radius: 4px;
}
.svg_container:hover {
  background: #d3d3d5;
}
.woo-tab-item-border {
  background-color: #4fbdd4;
  bottom: 0;
  height: 0.125rem;
  left: 0;
  position: absolute;
  width: 100%;
}
.Nav_right {
  width: auto;
  position: absolute;
  right: 20px;
  .login_btn {
    width: 60px;
    height: 30px;
    background-color: #4fbdd4;
    color: #fff;
    border-radius: 15px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    cursor: pointer;
  }
  .register_btn {
    width: 60px;
    height: 30px;
    border-radius: 15px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    cursor: pointer;
    margin-left: 10px;
  }
}
.tab {
  flex: 1;
  height: 100%;
  cursor: pointer;
  text-align: center;
  line-height: 60px;
  position: relative;
}

svg {
  vertical-align: sub;
}
.tab span {
  margin-left: 5px;
}
</style>
