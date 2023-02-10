<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-27 07:41:10
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 04:14:45
 * @FilePath: \quhu\src\components\tabs\Tabs.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div class="footer_tab" v-if="!isLoginPage">
      <div class="tab" ref="tabRef" v-for="(item,index) in list" :key="item.id" id="item.id" @click="tabClick(item,index)">
        <svg ref="svgRef" :style="{'fill':color?color:'','width':'20px','height':'20px'}">
          <use :xlink:href="'#icon-'+item.icon" rel="external nofollow" />
        </svg>
        <span>{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  components: {},
  mounted() {
    const path = this.$route.path.replace('/', '')
    console.log(path, this.nameList.indexOf(path))
    this.toggleStyle(this.nameList.indexOf(path))
  },
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
          icon: 'special',
          text: '专栏',
          name: 'special'
        },
        // {
        //   id: 2,
        //   icon: 'article',
        //   text: '微文',
        //   name: 'article'
        // },
        // {
        //   id: 3,
        //   icon: 'auction',
        //   text: '竞拍',
        //   name: 'auction'
        // },
        {
          id: 2,
          icon: 'my',
          text: '我的',
          name: 'my'
        }
      ],
      nameList: ['home', 'special', 'my'],
      activeName: 'my',
      color: ''
    }
  },
  computed: {
    isLoginPage() {
      return this.$route.path === '/login'
    }
  },
  methods: {
    tabClick(v, i) {
      this.activeName = v.name
      if (this.$route.path !== '/' + this.activeName) {
        this.toggleStyle(i)
        this.$router.push('/' + this.activeName)
      } else {
        // location.reload()
      }
    },
    toggleStyle(i) {
      if (this.$refs.tabRef) {
        this.$refs.tabRef.forEach((val, index, arr) => {
          if (index === i) {
            this.$refs.tabRef[index].style.color = '#409EFF'
            this.$refs.svgRef[index].style.fill = '#409EFF'
            this.$refs.tabRef[index].style.backgroundColor = '#E4E7ED'
          } else {
            this.$refs.tabRef[index].style.color = ''
            this.$refs.svgRef[index].style.fill = ''
            this.$refs.tabRef[index].style.backgroundColor = 'white'
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.footer_tab {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998;
  background: white;
}

.tab {
  flex: 1;
  height: 40px;
  border-right: 1px solid #c0c0c0;
  border-top: 1px solid #c0c0c0;
  border-bottom: 1px solid #c0c0c0;
  cursor: pointer;
  text-align: center;
  line-height: 40px;
}

svg {
  vertical-align: sub;
}
.tab span {
  margin-left: 5px;
}
</style>
