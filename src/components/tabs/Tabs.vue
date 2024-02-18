<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-27 07:41:10
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 04:14:45
 * @FilePath: \quhu\src\components\tabs\Tabs.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
e
<template>
  <div class="Frame_top">
    <div class="Nav_wrap">
      <div class="woo-panel-main woo-panel-bottom Nav_panel">
        <div class="woo-box-flex woo-box-alignCenter Nav_main">
          <el-col :span="4" class="nav_logo">
            <div class="woo-box-flex woo-box-alignCenter Nav_left">
              <a href="/" aria-label="quhu" class="Nav_logoWrap">
                <img src="../../assets/logo.png" alt="" />
              </a>
            </div>
          </el-col>

          <el-col :span="15">
            <div class="Nav_mid">
              <div
                class="tab"
                ref="tabRef"
                v-for="(item, index) in list"
                :key="item.id"
                id="item.id"
                @click="tabClick(item, index)"
                :title="item.text"
              >
                <div class="svg_container">
                  <svg
                    ref="svgRef"
                    :style="{
                      fill: color ? color : '',
                      width: '25px',
                      height: '25px'
                    }"
                  >
                    <use
                      :xlink:href="'#icon-' + item.icon"
                      rel="external nofollow"
                    />
                  </svg>
                </div>
                <div
                  v-if="activeName === item.name"
                  class="woo-tab-item-border"
                ></div>
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="Nav_right">
              <el-input
                class="searchBar"
                clearable
                v-model="searchValue"
                @input="querySearch"
                @focus="focusSearch"
                :placeholder="$t('tab.input_column_name')"
                :popper-append-to-body="false"
                popper-class="complete_list"
              >
                <svg
                  :style="{
                    width: '20px',
                    height: '20px',
                    marginTop: '10px',
                    position: 'absolute',
                    right: '0'
                  }"
                  slot="suffix"
                >
                  <use
                    :xlink:href="'#icon-' + 'search_multiple'"
                    rel="external nofollow"
                  />
                </svg>
                <!-- <template slot-scope="{ item }">
                 
                  <div class="column_tag">
                    <div class="column_title"></div>
                    <div class="column_item" v-for="column in item[0]" :key="column">
                      {{ column }}
                    </div>
                  </div>
                  <div class="tag">
                    <div class="tag_title"></div>
                    <div class="tag_item" v-for="tag in item[1]" :key="tag">
                      {{ tag }}
                    </div>
                  </div>
                  <div class="user_tag">
                    <div class="tag_title"></div>
                    <div class="tag_item" v-for="user in item[2]" :key="user">
                      {{ user }}
                    </div>
                  </div>
                </template> -->
              </el-input>
              <div >
                <div class="search_result" v-show="showResults" v-if="isSearchFocus && isSearchResult">
                  <div class="search_scroll" v-loading="searchLoading">
                  <div class="column_tag" :style="(searchResult.user_name.length>0 ||searchResult.tags.length>0)? {borderBottom: '1px dashed #838383',marginBottom: '10px'}:{}" v-if="searchResult.subscriptions.length>0">
                    <div class="column_title">
                     <span style="color: #50a6c0;">{{ '“'+searchValue+'”' }}</span> {{  $t('tab.column_title') }}
                    </div>
                    <div
                      class="column_item item"
                      v-for="column in searchResult.subscriptions"
                      :title="column"
                      :key="column"
                      @click="handleColumnSelect(column)"
                    >
                      <svg
                        :style="{
                          width: '20px',
                          height: '20px',
                          marginTop: '10px',
                          position: 'absolute',
                          left: '5px'
                        }"
                        slot="suffix"
                      >
                        <use
                          :xlink:href="'#icon-' + 'search'"
                          rel="external nofollow"
                        /></svg><span >{{ column }}</span>
                    </div>
                  </div>
                  <div class="user_tag" :style="searchResult.tags.length>0? {borderBottom: '1px dashed #838383',marginBottom: '10px'}:{}" v-if="searchResult.user_name.length>0">
                    <div class="user_title">
                      <span style="color: #50a6c0;">{{ '“'+searchValue+'”' }}</span> {{$t('tab.user_title') }}
                    </div>
                    <div
                      class="tag_item item"
                      v-for="user in searchResult.user_name"
                      @click="handleTagSelect(user)"
                      :title="user"
                      :key="user"
                    >
                      <svg
                        :style="{
                          width: '20px',
                          height: '20px',
                          marginTop: '10px',
                          position: 'absolute',
                          left: '5px'
                        }"
                        slot="suffix"
                      >
                        <use
                          :xlink:href="'#icon-' + 'search'"
                          rel="external nofollow"
                        /></svg><span>{{ user }}</span>
                    </div>
                  </div>
                  <div class="tag"  v-if="searchResult.tags.length>0">
                    <div class="tag_title">
                      <span style="color: #50a6c0;">{{ '“'+searchValue+'”' }}</span> {{ $t('tab.tag_title') }}
                    </div>
                    <div
                      class="tag_item item"
                      v-for="tag in searchResult.tags"
                      @click="handleColumnSelect(tag)"
                      :title="tag"
                      :key="tag"
                    >
                      <svg
                        :style="{
                          width: '20px',
                          height: '20px',
                          marginTop: '10px',
                          position: 'absolute',
                          left: '5px'
                        }"
                        slot="suffix"
                      >
                        <use
                          :xlink:href="'#icon-' + 'search'"
                          rel="external nofollow"
                        /></svg><span >{{ tag }}</span>
                    </div>
                  </div>

                </div>
                </div>
                <div class="search_result" v-show="showResults" v-else>
                  <el-empty  v-loading="searchLoading" :description="$t('home.no_data')"></el-empty>
                </div>
              </div>
            </div>
          </el-col>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { searchColumn } from '@/api/special/special'
import { debounce } from 'lodash'

export default {
  name: 'Tabs',
  components: {},
  created() {
    this.$bus.$on('changeTab', (v, index, query) => {
      this.tabClick(v, index, query)
    })
  },
  mounted() {
    const self = this
    const path = this.$route.path.replace('/', '')
    window.addEventListener(
      'popstate',
      function (e) {
        const path1 = e.currentTarget.location.pathname
        // self.toggleStyle(self.nameList.indexOf(path))
        // console.log(self.nameList, path1.replace('/', ''))
        self.tabClick(
          { name: path1.replace('/', '') },
          self.nameList.indexOf(path1.replace('/', ''))
        )
      },
      false
    )
    document.addEventListener('click', this.handleDocumentClick);
    if (sessionStorage.getItem('tabName')) {
      // console.log(this.$route)
      this.activeName = this.$route.query.user
        ? 'home'
        : sessionStorage.getItem('tabName')
    }
    this.toggleStyle(this.nameList.indexOf(path))
    // this.$bus.$off('changeTab')
  },
  beforeDestroy() {
    // 在组件销毁前移除文档点击事件监听器，防止内存泄漏
    document.removeEventListener('click', this.handleDocumentClick);
  },
  data() {
    return {
      searchLoading:false,
      showResults:false,
      list: [
        {
          id: 0,
          icon: 'if-ui-home',
          text: this.$t('tab.home'),
          name: 'home'
        },
        {
          id: 1,
          icon: 'if-ui-art',
          text: this.$t('tab.nft'),
          name: 'nft'
        },
        {
          id: 2,
          icon: 'if-ui-mining',
          text: this.$t('tab.mining'),
          name: 'mining'
        },
        {
          id: 3,
          icon: 'if-court-hammer',
          text: this.$t('tab.auction'),
          name: 'auction'
        },
        {
          id: 4,
          icon: 'if-ui-user',
          text: this.$t('tab.introduce'),
          name: 'introduce'
        }
      ],
      nameList: ['home', 'nft', 'mining', 'auction', 'introduce'],
      activeName: 'home',
      color: '',
      searchValue: '',
      searchResult: {
        subscriptions:[],
        user_name:[],
        tags:[]
      },
      isSearchFocus:false
    }
  },
  computed: {
    isLogin() {
      return getToken()
    },
    isSearchResult(){
      return this.searchResult.subscriptions.length >0 || this.searchResult.user_name.length >0 || this.searchResult.tags.length >0
    }
  },
  methods: {
    handleDocumentClick(event) {

      const resultsContainer = this.$el.querySelector('.search_result'); // 根据实际情况替换选择器
      const searchBarContainer = this.$el.querySelector('.searchBar')
      if (resultsContainer && !resultsContainer.contains(event.target) && !searchBarContainer.contains(event.target)) {
        this.showResults = false
      }
    },
    focusSearch(v){
      this.isSearchFocus = true
      this.showResults = true
    },
    handleTagSelect(item) {
      this.$router.push({
        path: '/information',
        query: {
          steemId:item.split('(')[1].split(')')[0]
        }
      })
      this.isSearchFocus = false
    },
    handleColumnSelect(item) {
      this.$router.push({
        path: '/columnDetail',
        query: {
          subName: item
        }
      })
      this.isSearchFocus = false
    },
    querySearch:debounce(async function(queryString){
      this.showResults = true
      this.searchLoading = true
      if (queryString.trim()) {
        const res = await searchColumn({
          subscriptions_name: this.searchValue.trim()
        })
        this.searchLoading = false
        if (res && res.success === 'ok') {
          this.searchResult = res
        }
        
      }else {
        this.searchResult = {
          subscriptions:[],
          user_name:[],
          tags:[]
        }
      }
      this.searchLoading = false
    },300),
    tabClick(v, i, query) {
      // console.log(v, i, query)
      this.activeName = v.name
      sessionStorage.setItem('tabName', v.name)
      // console.log(this.$route.path, this.activeName)
      this.toggleStyle(i)
      if (this.$route.path !== '/' + this.activeName) {
        this.$router.push({
          path: v.name,
          query: query
        })
      } else {
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
            this.$refs.tabRef[index].style.color = 'rgba(108,108,108,1)'
            this.$refs.svgRef[index].style.fill = 'rgba(108,108,108,1)'
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
@media only screen and (max-width: 500px) {
  .nav_logo {
    width: auto;
  }
  .Nav_mid {
    min-width: 400px !important;
  }
  .complete_list {
    left: auto !important;
  }
}
::v-deep .searchBar {
  // width: calc(100% - 20px);
  .name {
    height: 50px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .search_arrow_icon {
    line-height: 50px;
    position: absolute;
    right: 10px;
  }
}
::v-deep .Nav_right .el-input__inner {
  border-radius: 30px;
  background-color: #f0f1f4;
}
::v-deep .Nav_right .el-input__inner:hover {
  border: 1px solid rgba(0, 0, 0, 0.4);
}
::v-deep .Nav_right .el-input__inner:focus {
  outline: none;
  border: 0.5px solid rgba(0, 0, 0, 0.4);
  box-shadow: -3px -3px 0px rgba(0, 0, 0, 0.8);
}
::v-deep .el-input .el-input__clear {
  position: absolute;
  right: 20px;
}
::v-deep .el-input__inner {
  border-radius: 30px;
}
.Frame_top {
  width: 100%;
}
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
  margin: auto;
}
.Nav_panel {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: contain;
  background-image: none;
  border-color: $whiteBgColor;
  background-color: $whiteBgColor;
}
.woo-panel-bottom {
  border-bottom: 1px solid #f9f9f9;
}
.Nav_main {
  max-width: 1250px;
  height: 100%;
  margin: auto;
  .language {
    position: absolute;
    right: 20px;
    padding-left: 10px;
  }
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
.search_result {
  padding: 10px 0;
  transform-origin: center top;
  z-index: 2109;
  width: 240px;
  margin: 5px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  box-sizing: border-box;
  background-color: #fff;
  position: absolute;
  top: 60px;
  overflow: hidden;
  max-height: 400px;
    overflow-y: auto;
  .search_scroll {
    .column_title,
    .tag_title,
    .user_title {
      margin-bottom: 10px;
      color: $textColor;
      cursor: pointer;
      color: #606266;
    }
    .item {
      padding: 0 30px;
      margin: 0;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      font-size: 16px;
      list-style: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      &:hover {
        background-color: #f8f8fb;
      }
    }
  }

  // position: absolute;
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
    width: 200px;
    height: 84px;
  }
}
.Nav_logo {
  width: 90px;
  height: 38px;
}
.Nav_mid {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998;
  height: 100%;
  min-width: 500px;
  padding-left: 20px;
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
  width: 100%;
  padding-left: 30px;
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
