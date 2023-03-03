<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-12 14:01:22
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 06:51:32
 * @FilePath: \quhu\src\views\special\Special.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="main-content-container">
    <el-row class="tab">
      <el-col :span="4" class="nav_container">
        <div class="nav_left">
          <el-menu
            class="nav_menu"
            :default-active="activeMenuId"
            :default-openeds="['1', '2']"
            @open="handleOpen"
            @close="handleClose"
            background-color="#fff"
            active-text-color="#4fbdd4"
          >
            <div class="short_article" @click="toAticle">我的短文</div>
            <el-submenu index="1">
              <template slot="title">
                <!-- <i class="el-icon-location"></i> -->
                <span style="fontsize: 14px">我的圈子</span>
              </template>
              <el-menu-item
                style="minwidth: 90px"
                v-for="(item, index) in subscriptionsList.my"
                :key="index"
                :index="'1-' + index"
                @click="getArticlesByColumn(item, index)"
                >{{ item }}</el-menu-item
              >
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <!-- <i class="el-icon-menu"></i> -->
                <span style="fontsize: 14px">加入的圈子</span>
              </template>
              <el-menu-item
                style="minwidth: 90px"
                v-for="(item, index) in subscriptionsList.join"
                :key="index"
                :index="'2-' + index"
                @click="getArticlesByColumn(item, index)"
                >{{ item }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </div>
      </el-col>
      <el-col :span="14" class="mid_container">
        <div class="post-container">
          <el-autocomplete
            class="searchBar"
            clearable
            v-model="searchValue"
            :fetch-suggestions="querySearch"
            placeholder="请输入圈子名称"
            @select="handleSelect"
            :popper-append-to-body="false"
          >
            <i class="el-icon-search el-input__icon" slot="suffix"> </i>
            <template slot-scope="{ item }">
              <!-- <i class="el-icon-search search_arrow_icon"> </i> -->
              <div class="name">{{ item.value }}</div>
            </template>
          </el-autocomplete>

          <div @click="postArticle" class="post-topic-head">
            <div class="tip">点击发表主题...</div>
          </div>
          <div class="post-topic-footer">
            <div class="post-topic-btn">
              <div class="left"></div>
              <div class="post-action">
                <div class="common post-article" @click="postArticle">
                  <span>写文章</span>
                </div>
                <div class="common post-article" @click="createColumn">
                  <span>创建圈子</span>
                </div>
                <div
                  slot="reference"
                  class="common post-article"
                  @click="handleRemove"
                >
                  <span v-if="hasColumn"> 退出圈子 </span>
                </div>
                <el-dialog
                  title="删除提示"
                  :visible.sync="removePopVisible"
                  width="30%"
                  center
                >
                  <span>确认退出当前圈子吗？</span>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false"
                      >取 消</el-button
                    >
                    <el-button type="primary" @click="removeOut"
                      >确 定</el-button
                    >
                  </span>
                </el-dialog>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(item, index) in articleList" :key="index">
          <div class="topic-container">
            <div style="padding: 10px">
              <div class="header-container">
                <div class="author">
                  <img class="avatar" :src="item.body.avatar" alt="" />
                  <div class="info">
                    <div class="role owner">{{ item.body.author }}</div>
                    <div class="date">
                      {{ item.created.replace('T', '  ') }}
                    </div>
                  </div>
                </div>
                <el-dropdown trigger="click" size="medium" placement="bottom">
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-show="item.body.status !== 'top'" @click.native="articleSet(item,index,'+')">置顶</el-dropdown-item>
                    <el-dropdown-item v-show="item.body.status==='top'" @click.native="articleSet(item,index,'-')">取消置顶</el-dropdown-item>
                    <el-dropdown-item>置底</el-dropdown-item>
                    <el-dropdown-item @click.native="articleSet(item,index,'delete')">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="talk-content-container">
                <div class="content">
                  <div>{{ item.title }}</div>
                  <br />
                  <div v-html="item.body.body"></div>
                </div>
              </div>
              <div class="operation-icon-container">
                <div class="operation-icon">
                  <!-- <div title="点赞" class="like" @click="praise(item)">
                    <Icon
                      name="praise"
                      :color="item.isPraised ? '#4fbdd4' : '#5D5D5D'"
                    />
                  </div> -->
                  <!-- <div
                    title="评论"
                    class="comment"
                    @click="editComment(item, index)"
                  >
                    <Icon name="discuss" />
                  </div> -->
                  <!-- <div title="收藏" class="subscribe">
                    <Icon name="collect" />
                  </div> -->
                </div>
                <a
                  class="steemLink"
                  :href="
                    'https://steemdb.io/tag/@' +
                    item.author +
                    '/' +
                    item.permlink
                  "
                  target="blank"
                  >View on Blockbrowser</a
                >
                <div class="details-container" @click="goDetail(item, index)">
                  <div class="text">查看详情</div>
                  <div class="icon">
                    <Icon name="arrowR" />
                  </div>
                </div>
              </div>
              <!-- <div class="praisedPeople">{{ }}觉得很赞</div> -->
              <el-input
                v-show="item.isEditReply"
                placeholder="请输入内容"
                v-model="item.reply"
                class="reply_input"
              >
                <el-button slot="append" @click="submitReply(item, index)"
                  >回复</el-button
                >
              </el-input>
              <div class="comment-item-container">
              </div>
            </div>
          </div>
          <div
            v-if="item.isShowDetailDialog"
            id="topic-detail-container"
            class="topic-detail"
          >
            <div class="content">
              <div class="topic-detail-panel">
                <div class="header-container">
                  <div class="author">
                    <img class="avatar" :src="currentDetail.body.avatar" />
                    <div class="info">
                      <div class="role owner">
                        {{ currentDetail.body.author }}
                      </div>
                      <div class="date">
                        {{ currentDetail.created.replace('T', '  ') }}
                      </div>
                    </div>
                  </div>
                  <div @click="closeDetail(item)" class="close-icon">
                    <Icon name="cancel" />
                  </div>
                </div>

                <div class="">
                  <div class="talk-content-container">
                    <div class="content">
                      <div>{{ currentDetail.title }}</div>
                      <br />
                      <div v-html="currentDetail.body.body"></div>
                    </div>
                  </div>
                </div>

                <div class="operation-icon">
                  <div title="点赞" class="like" @click="praise(currentDetail)">
                    <Icon name="praise" :color="currentDetail.isPraised ? '#4fbdd4' : '#5D5D5D'" />
                    <span class="vote-num">{{currentDetail.voteNum || ''}}</span>
                  </div>
                  <div
                    title="评论"
                    class="comment"
                    @click="editComment(item, index)"
                  >
                    <Icon name="discuss" />
                  </div>
                  <div title="收藏" class="subscribe">
                    <Icon name="collect" />
                  </div>
                </div>
                <el-input
                  v-show="item.isEditReply"
                  placeholder="请输入内容"
                  v-model="item.reply"
                  class="reply_input"
                >
                  <el-button slot="append" @click="submitReply(item, index)"
                    >回复</el-button
                  >
                </el-input>
                <div
                  class="comment-box"
                  style="margin-bottom: 10px; padding-top: 8px"
                  v-for="(v, i) in currentDetail.commentList"
                  :key="i"
                >
                  <div class="comment-item-container">
                    <div class="text">
                      <span class="comment group-owner-light">{{
                        v.body.author
                      }}</span
                      ><span>：</span
                      ><span parsetype="pure" class="text">{{
                        v.body.body
                      }}</span>
                    </div>
                    <div class="operations">
                      <div class="time">{{ v.created.replace('T', '  ') }}</div>
                      <!-- <div class="operation"><span class="space">删除</span></div> -->
                    </div>
                  </div>
                </div>
                <!-- <div class="comment-box" style="margin-bottom: 10px; padding-top: 8px;" v-for="(v,i) in item.commentList" :key="i">
                  <Comment :asideChildren="v.children"></Comment>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div v-if="showEditor" class="create-topic-container">
          <div class="create-topic-panel">
            <div class="head">
              <div class="title">
                <input
                  type="text"
                  v-model="titleText"
                  class="titie_text"
                  placeholder="请输入标题"
                />
              </div>
              <div @click="closeEditor" class="close-icon">
                <Icon name="cancel" />
              </div>
            </div>
            <div>
              <div class="horizontal-line"></div>
              <div class="content-container">
                <img class="avatar" :src="userAvatar" />
                <div
                  style="
                    width: calc(100% - 40px);
                    min-height: 110px;
                    margin: 5px 0px;
                    max-height: 497px;
                  "
                >
                  <quill-editor
                    v-model="content"
                    ref="myQuillEditor"
                    :options="editorOption"
                    spellcheck="false"
                    class="quill-editor"
                    @ready="onEditorReady()"
                  >
                  </quill-editor>
                </div>
              </div>
              <div class="horizontal-line"></div>
            </div>
            <div class="upload-container">
              <div class="operation-icon">
                <div class="left" v-if="fileList.length !== 0">
                  <div
                    ref="imgList"
                    class="picture-list"
                    v-for="(item, i) in fileList"
                    :key="i"
                    @mouseenter="showIcon(item)"
                    @mouseleave="hideIcon(item)"
                  >
                    <img class="picList" :src="item.url" />
                    <i
                      v-show="item.isShow"
                      class="delete-pic el-icon-close"
                      @click="deleteEditorImage(item, i)"
                    >
                    </i>
                  </div>
                  <!-- <button  class="emoji"></button> -->
                  <!-- <div  class="pic"></div>
                <div  class="file"></div>
                <div  class="video" hidden=""></div><button  class="tag"></button>
                <div  class="scheduled"></div> -->
                </div>
                <div class="right">
                  <div class="text-range">(4～10000)</div>
                  <div @click="submit" class="submit-btn">发布</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="recommend_container">
          <div
            class="wbpro-side woo-panel-main woo-panel-top woo-panel-right woo-panel-bottom woo-panel-left Card_wrap_2ibWe Card_bottomGap_2Xjqi"
          >
            <div>
              <div class="wbpro-side-tit woo-box-flex woo-box-alignCenter">
                <div
                  class="f14 cla woo-box-item-flex"
                  style="align-self: center"
                >
                  热门圈子
                </div>
                <div class="woo-box-flex woo-box-alignCenter" @click="getHotColumns">
                  <i class="el-icon-refresh"></i
                  ><span class="f12 clb">点击刷新</span>
                </div>
              </div>
              <div class="woo-divider-main woo-divider-x"></div>
              <div
                class="wbpro-side-card7"
                v-for="(hot, hotIndex) in hotColumns"
                :key="hotIndex"
              >
                <div class="wbpro-side-panel">
                  <div class="con woo-box-flex woo-box-alignCenter">
                    <div class="rank top f16">{{ Number(hotIndex) + 1 }}</div>
                    <div title="" class="wbpro-textcut f14 cla" @click="handleSelect(hot)">
                      {{ hot.value }}
                    </div>
                    <div class="icon">
                      <span
                        class="wbpro-icon-search-tp1"
                        style="background: rgb(255, 148, 6);cursor:pointer;"
                        >热</span
                      >
                    </div>
                  </div>
                  <div class="woo-divider-main woo-divider-x"></div>
                </div>
              </div>
              <div class="woo-divider-main woo-divider-x"></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="创建圈子"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleSubscriptionsClose"
    >
      <el-input placeholder="请输入圈子名称" v-model="subscriptionsInfo.name">
      </el-input>
      <div class="margin-top-10 sub_price">
        <el-input
          placeholder="请输入圈子价格"
          v-model="subscriptionsInfo.price"
        >
        </el-input>
        <el-select
          class="price_select"
          v-model="subscriptionsInfo.currency"
          clearable
          placeholder="请选择币种"
        >
          <el-option
            v-for="item in payTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-input
        class="margin-top-10"
        type="textarea"
        :rows="2"
        placeholder="请输入圈子介绍"
        v-model="subscriptionsInfo.introduction"
      >
      </el-input>
      <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      :action="actionUrl"
      :http-request="onUploadSubImgHandler"
      >
      <img v-if="subscriptionsInfo.image" :src="subscriptionsInfo.image" class="avatar-img">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleSubscriptionsClose">取 消</el-button>
        <el-button
          class="sub_confirm"
          type="primary"
          @click="submitSubscriptions"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-upload
      :action="actionUrl"
      ref="upload"
      v-show="false"
      class="avatar-uploader-edit"
      :data="fileUpload"
      :show-file-list="true"
      :http-request="onUploadHandler"
    >
    </el-upload>
  </div>
</template>

<script>
import {
  subscriptions,
  addColumn,
  removeColumn,
  searchColumn,
  post,
  getArticles,
  getArticleDetail,
  vote,
  getVote,
  hotColumn,
  goTop
} from '@/api/special/special'
import MD5 from 'MD5'
import { getUser,getAvatars } from '@/api/user/user'
import { getToken } from '@/utils/auth'
// import _ecc from '@/utils/ecc/index'
import axios from 'axios'
import { sha256 } from '@/utils/ecc/src/hash'
import Signature from '@/utils/ecc/src/signature'
import { actObj } from '@/utils/act'
import Icon from '@/components/Icon/index'
const defaultAvatar = require(`../../assets/defaultAvatarUrl.png`)
export default {
  components: {
    Icon
  },
  data() {
    return {
      hotColumns: [],
      actionUrl: 'https://steemitimages.com/',
      fileList: [],
      fileUpload: {},
      removePopVisible: false,
      subscriptionPrice: '',
      payTypes: [
        {
          value: 'poys',
          label: 'poys'
        },
        {
          value: 'op',
          label: 'op'
        },
        {
          value: 'ofc',
          label: 'ofc'
        }
      ],
      searchResult: [],
      searchValue: '',
      articleList: [],
      content: '',
      editorOption: {
        modules: {
          'emoji-toolbar': true,
          'emoji-shortname': true,
          imageResize: {
            //添加
            displayStyles: {
              //添加
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar'] //添加
          },
          toolbar: {
            container: [
              ['emoji'],
              ['image'],
              ['link'],
              [
                {
                  color: [
                    '#000000',
                    '#e60000',
                    '#ff9900',
                    '#ffff00',
                    '#008a00',
                    '#0066cc',
                    '#9933ff',
                    '#ffffff',
                    '#facccc',
                    '#ffebcc',
                    '#ffffcc',
                    '#cce8cc',
                    '#cce0f5',
                    '#ebd6ff',
                    '#bbbbbb',
                    '#f06666',
                    '#ffc266',
                    '#ffff66',
                    '#66b966',
                    '#66a3e0',
                    '#c285ff',
                    '#888888',
                    '#a10000',
                    '#b26b00',
                    '#b2b200',
                    '#006100',
                    '#0047b2',
                    '#6b24b2',
                    '#444444',
                    '#5c0000',
                    '#663d00',
                    '#666600',
                    '#003700',
                    '#002966',
                    '#3d1466',
                    'custom-color'
                  ]
                }
              ]
            ],
            handlers: {
              image: (value) => {
                if (value) {
                  // value === true

                  // console.log(this.$refs.upload.$el)
                  // console.log(document.querySelector('.avatar-uploader input'))
                  this.$refs.upload.$el.click()
                  document.querySelector('.avatar-uploader-edit input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        },
        placeholder: '请输入正文',
        theme: 'snow'
      },
      showEditor: false,
      titleText: '',
      currentDetail: {},
      subscriptionsInfo: {
        name: '',
        price: '',
        introduction: '',
        image: '',
        currency: ''
      },
      dialogVisible: false,
      subscriptionsList: {},
      selectedColumn: '',
      timeout: '',
      hasColumn: true,
      voteLists: [],
      avatarLists:[]
    }
  },
  computed: {
    userAvatar() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')).avatar
    },
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo'))
    },
    activeMenuId() {
      return sessionStorage.getItem('selectedMenu')
    }
  },
  async created() {
    this.updateColumn()
    this.getHotColumns()
  },
  async mounted() {},
  methods: {
   async articleSet(v,i,type) {
    const userInfo = this.userInfo
      const token = getToken()
      const loginType = localStorage.getItem('login-type')
        const res = await goTop({
          id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
          steem_id: userInfo.steem_id,
          token,
          permlink:[v.author, v.permlink],
          subscriptions_name: this.selectedColumn,
          type
        })

      if(res.success === 'ok') {
        switch (type) {
          case '+':
            const obj = this.articleList[i]
            this.articleList.splice(i,1)
            this.articleList.unshift(obj)
            this.$message.success('置顶成功')
            break;
            case '-':
            this.getArticlesByColumn(
            this.selectedColumn || this.subscriptionsList.my[0] || ''
          )
            break;
            case 'delete':
            this.articleList.splice(i,1)
            this.$message.success('删除成功')
            break;
          default:
            break;
        }
        // this.getArticlesByColumn(
        //     this.selectedColumn || this.subscriptionsList.my[0] || ''
        //   )
      }  
    },
    async getHotColumns() {
      const res = await hotColumn({})
      if (res.success === 'ok') {
        const arr = []
        res.data.forEach((item,i)=>{
          arr.push({value:item})
        })
        this.hotColumns = arr
      }
    },
    async praise(v) {
      // console.log(v)
      const userInfo = this.userInfo
      const token = getToken()
      const loginType = localStorage.getItem('login-type')
        const res = await vote({
          id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
          steem_id: userInfo.steem_id,
          token,
          permlink: v.permlink
        })
        if (res.success === 'ok') {
          if(res.type==='+') {
            this.$message.success('点赞成功')
          v.isPraised = true
          v.voteNum +=1
          }else if(res.type==='-') {
            this.$message.success('取消点赞成功')
            v.isPraised = false
            v.voteNum -=1
          }

        } else {
          this.$message.success('网络问题！请重试')
        }
    },
    showIcon(v) {
      v.isShow = true
    },
    hideIcon(v) {
      v.isShow = false
    },
    deleteEditorImage(v, i) {
      const arr = JSON.parse(JSON.stringify(this.fileList))
      this.fileList = arr.filter((item, index) => {
        return i !== index
      })
      console.log(this.fileList)
    },

    handleRemove() {
      this.removePopVisible = true
    },
    toAticle() {
      this.$router.push('/article')
    },
    uploadDispatch: function (url, fd, fn) {
      axios
        .post(url, fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          fn(response)
        })
    },
    async loadHandler(e,cb) {
      let dataUrl = ''
      if (e.file) {
        console.log('** image being loaded.. ----->', e.file)
        let width = 0
        let height = 0
        const reader = new FileReader()
        reader.addEventListener('load', (theFile) => {
          let image = new Image()
          image.src = theFile.target.result
          image.onload = function () {
            width = this.width
            height = this.height
          }

          dataUrl = reader.result
          const prefix = new Buffer('ImageSigningChallenge')
          const commaIdx = dataUrl.indexOf(',')
          const dataBs64 = dataUrl.substring(commaIdx + 1)
          const data = new Buffer(dataBs64, 'base64')
          const buf = Buffer.concat([prefix, data])
          const bufSha = sha256(buf)
          const sig = Signature.signBufferSha256(bufSha, actObj.postKey).toHex()
          const formData = new FormData()
          if (e.file) {
            formData.append('file', e.file)
            this.uploadDispatch(
              'https://steemitimages.com/' +
                actObj.arr[Math.floor(Math.random() * actObj.arr.length)] +
                '/' +
                sig,
              formData,
              (res) => {
                console.log(res)
                let imageUrl = ''
                if (res.status === 200) {
                  imageUrl = res.data.url
                }
                cb({ url: imageUrl, isShow: false, width: width, height: height })

                
                // console.log(this.fileList)
                // console.log(this.fileList)
                // 获取光标所在位置
                // let quill = this.$refs.myQuillEditor.quill
                // let length = quill.getSelection().index
                // 插入图片
                // quill.insertEmbed(length, 'image', imageUrl)
                // 调整光标到最后
                // quill.setSelection(length + 1)
              }
            )
          }
        })
        reader.readAsDataURL(e.file)
      }
    },
    async onUploadSubImgHandler(e) {
      this.loadHandler(e,(v)=>{
        this.subscriptionsInfo.image = v.url
      }) 
    },
    async onUploadHandler(e) {
      // console.log(e)
      this.loadHandler(e,(v)=>{
        this.fileList = this.fileList.concat([v])
      })  
    },
    onEditorReady() {
      // document.querySelector('.ql-formats .ql-uploadImg').innerText = '图'
      // document.querySelector('.ql-formats .ql-uploadFile').innerText = '文';
    },
    // onEditorBlur() {},
    // onEditorFocus() {},
    // onUploadImage() {
    //   console.log('触发上传')
    // },
    async removeOut() {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        subscriptions_name: this.selectedColumn
      }
      const res = await removeColumn(params)
      // console.log(res)
      if (res.success === 'ok') {
        this.$message.success('退出圈子成功')
      } else {
        this.$message.error(res.error)
      }
      this.removePopVisible = false
    },
    async querySearch(queryString, cb) {
      const res = await searchColumn({
        subscriptions_name: this.searchValue.trim()
      })

      if (res.success === 'ok') {
        this.searchResult = res.data.map((v, i) => {
          v = { value: v }
          return v
        })
        // console.log(this.searchResult)
        cb(this.searchResult)
      }
    },
    handleSelect(item) {
      // const arr = this.subscriptionsList.my.concat(this.subscriptionsList.join)
      // console.log(arr)
      // this.getArticlesByColumn(item.value)
      this.$router.push({
        path: '/columnDetail',
        query: {
          subName: item.value
        }
      })
    },
    editComment(item, index) {
      item.isEditReply = !item.isEditReply
    },
    async updateColumn() {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const currentInfo = await getUser({
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken()
      })
      if (currentInfo.success === 'ok') {
        if (currentInfo.data) {
          this.subscriptionsList = currentInfo.data.buy_article || {}
        }
        this.getArticlesByColumn(sessionStorage.getItem('selectedColumn') || this.subscriptionsList.my[0] || '',sessionStorage.getItem('selectedMenu').split('-')[1] || 0)
      }
    },
    async getArticlesByColumn(v,i) {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      let selectedMenu = '1-0'
      this.selectedColumn = v
      if(this.subscriptionsList.my.indexOf(v)!==-1){
        selectedMenu= '1-'+i
      }else {
        if(this.subscriptionsList.join.indexOf(v)!==-1){
        selectedMenu= '2-'+i
      }
      }

      sessionStorage.setItem('selectedColumn',v)
      sessionStorage.setItem('selectedMenu',selectedMenu)
      this.hasColumn =
        this.subscriptionsList.my.length !== 0 ||
        this.subscriptionsList.join.length !== 0
      if (localStorage.getItem('quhu-userInfo')) {
        const res = await getArticles({
          id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
          jsonrpc: '2.0',
          method: 'bridge.get_ranked_posts',
          params: { sort: 'created', tag: 's' + MD5(v).substring(0, 10) }
        })

        if (res.result) {
          let formatRes = res.result && res.result.concat()
        // const otherInfoList = []
        // const ids = []
        let arr = [];
        formatRes.forEach((element,index) => {
          element.body = this.eval(element.body)
          element.isEditReply = false
          element.reply = ''
          element.isShowDetailDialog = false
          element.isPraised = false
          console.log(element.body.status)
          if(element.body.status === 'top') {
            arr.push(element)
            formatRes.splice(index,1)
            index = index-1
          }
          if(element.body.status === 'delete'){
            formatRes.splice(index,1)
            index = index-1
          }
        })
        formatRes = arr.concat(formatRes)
          this.articleList = formatRes
        }
        
      }
    },
    createColumn() {
      this.dialogVisible = true
    },
    handleSubscriptionsClose() {
      this.dialogVisible = false
      this.subscriptionsInfo = {
        name: '',
        price: '',
        introduction: '',
        image: '',
        currency: ''
      }
    },
    async submitSubscriptions() {
      const { name, introduction, image, price, currency } =
        this.subscriptionsInfo
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const res = await subscriptions({
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name: name,
        introduction: introduction,
        image: image,
        price: price + currency
      })
      if (res.success === 'ok') {
        this.updateColumn()
        this.$message.success('创建圈子成功')
        this.handleSubscriptionsClose()
      } else {
        this.$message.error('创建失败！请重新创建圈子')
        this.handleSubscriptionsClose()
      }
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    async submitReply(v, i) {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const res = await post({
        type: 'comment',
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name: v.body.subscriptions_name,
        permlink: [v.author, v.permlink],
        title: '',
        body: v.reply
      })

      if (res && res.success === 'ok') {
        this.$message.success('回复成功')
        v.isEditReply = false
        // this.currentDetail.commentList.unshift()
        v.reply = ''
      } else {
        this.$message.error('发文失败！ 请重新发文')
        this.closeEditor()
        v.isEditReply = false
        v.reply = ''
      }
    },
    postArticle() {
      this.showEditor = true
    },
    async submit() {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      let imgHtml = ''
      if (this.fileList.length === 1) {
        imgHtml = `<img src="${
          this.fileList[0].url
        }" preview width="300px" height="${
          (300 / this.fileList[0].width) * this.fileList[0].height
        }" alt="" />`
      } else {
        this.fileList.forEach((item, i) => {
          imgHtml += `<img src="${item.url}" preview=${i} style="object-fit:cover;background:#f5f6f7;margin-left:5px;margin-bottom:5px;" class="img-container" width="150px" height="150px" alt="" />`
        })
      }

      // console.log(imgHtml)
      const res = await post({
        type: 'post',
        id: loginType === 'password' ? userInfo.user : userInfo.eth_account,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name:
          this.selectedColumn || this.subscriptionsList.my[0] || '',
        permlink: '',
        title: this.titleText,
        body: this.content + imgHtml
      })

      if (res && res.success === 'ok') {
        setTimeout(() => {
          this.getArticlesByColumn(
            this.selectedColumn || this.subscriptionsList.my[0] || ''
          )
          this.$message.success('发文成功')
          this.closeEditor()
        }, 1000)
      } else {
        this.$message.error('发文失败！ 请重新发文')
        this.closeEditor()
      }
    },
    closeEditor() {
      this.showEditor = false
      this.content = ''
      this.titleText = ''
      this.fileList = []
    },
    closeDetail(val) {
      val.isShowDetailDialog = false
    },
    async goDetail(val, index) {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const res = await getArticleDetail({
        id: loginType === 'password' ? userInfo.user : userInfo.eth_account,
        jsonrpc: '2.0',
        method: 'bridge.get_discussion',
        params: { author: val.author, permlink: val.permlink }
      })
      const votes = await getVote({permlink: val.permlink})
      console.log(votes)
      
      const obj = res.result[val.author + '/' + val.permlink]
      // const commentList = this.getReply(obj, res.result)
      const commentList = []
      const result = Object.assign(res.result, {})
      for (const key in result) {
        if (
          key.startsWith('onlyfun-data', 0) &&
          key !== val.author + '/' + val.permlink
        ) {
          result[key].body = this.eval(result[key].body)
          commentList.push(result[key])
        }
      }
      if (obj) {
        obj.body = this.eval(obj.body)
        obj.body.avatar = ''
        let isPraised = false
        let voteNum = 0
        const vote = votes.data.forEach((item,i)=>{
          isPraised = item.list.indexOf(userInfo.steem_id)!==-1
          voteNum = item.vote
        })
        obj.isPraised = isPraised
        obj.voteNum = voteNum
        this.currentDetail = obj
        this.currentDetail.commentList = commentList
        val.isShowDetailDialog = true
      }
      // console.log(val)
    },
    eval(fn) {
      const Fn = Function
      return new Fn('return ' + fn)()
    },
    getReply(arr, detail) {
      // let replyList = arr
      // if (arr.children && arr.children !== 0) {
      //   replyList.forEach((v, i) => {
      //     if (v.startsWith('onlyfun-data', 0)) {
      //       replyList.children = this.getReply(detail[v], detail)
      //     }
      //   })
      //   return replyList
      // } else {
      //   return []
      // }
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep .el-dropdown {
    position: absolute;
    right: 20px;
    top: 10px;
  }

   ::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-top: 10px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar-img {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
  }
  .clb{
    min-width: 50px;
  }
.img-container {
  margin-left: 2px;
  margin-bottom: 2px;
  object-fit: cover;
  background: #f5f6f7;
  transition: all 0.6s ease;
}
::v-deep .el-submenu .el-menu-item {
  min-width: 100px;
}
.recommend_container {
  min-height: 500px;
  background-color: #fff;
  margin-left: 20px;
}
.sub_confirm {
  background: #4fbdd4;
}
.nav_container {
}
.nav_left {
  width: 100%;
  /* display: flex;
  justify-content: center; */
  .nav_menu {
    border-radius: 10px;
    width: 190px;
    background: $bgcolor;
    height: 800px;
  }
  .short_article {
    width: calc(100% - 20px);
    height: 50px;
    font-size: 14px;
    padding-left: 20px;
    line-height: 50px;
    cursor: pointer;
  }
  .short_article:hover {
    background: #d3d3d5;
  }
}
.remove_column {
  margin-left: 100px;
}
::v-deep .el-submenu__icon-arrow {
  right: 5px !important;
}
.price_select {
  width: 150px;
  min-width: 50px;
}
.sub_price {
  display: flex;
}
::v-deep .searchBar {
  padding: 20px;
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
.margin-top-10 {
  margin-top: 10px;
}
.topic-container .comment-box .comment-item-container {
  padding: 12px 12px 0;
  margin: 0 20px 0 56px;
  background-color: #f7f9fa;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.comment-item-container .text {
  line-height: 20px;
  color: #5a5c66;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.comment-item-container .text .group-owner-light {
  color: #4fbdd4;
  cursor: pointer;
}
.comment-item-container .operations {
  margin-top: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 16px;
  font-size: 14px;
  color: #c5c6cb;
}
.reply_input input {
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.topic-detail {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}
.topic-detail .content {
  width: 80%;
  min-width: 200px;
  margin: 60px auto;
}
.header-container {
  position: relative;
}
.header-container .close-icon {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 10px;
  height: 10px;
  cursor: pointer;
}

.operation-icon {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .like{
    display: flex;
    margin-right: 20px !important;
    width:40px !important;
    .vote-num{
      margin-left: 5px;
      color: #4fbdd4;
    }
  }
}
.topic-detail-panel .operation-icon div {
  width: 21px;
  height: 21px;
  margin-right: 30px;
  cursor: pointer;
  position: relative;
}

.main-content-container {
  max-width: 1250px;
  margin: auto;
  height: 100%;
  margin-top: 40px;
}
.mid_container {
 min-width: 300px;
 }
.post-container {
  margin-bottom: 5px;
  background-color: #fff;
  border-radius: 4px;
}
.post-topic-head {
  display: flex;
  align-items: center;
  margin: 0 20px;
  padding: 20px;
  cursor: pointer;
  border-radius: 4px;
  background: #f8f9fa;
}
.tip {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #8b8e9d;
  letter-spacing: 0;
  margin-left: 10px;
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.post-topic-footer {
  height: 60px;
  margin: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-user-select: none;
  user-select: none;
}

.post-topic-btn {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
}
.titie_text {
  font-family: PingFangSC-Medium;
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
  height: 30px;
  line-height: normal;
  padding: 0;
}
.left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.post-action {
  display: flex;
  align-items: center;
}
.post-article {
  position: relative;
  padding: 2px 8px;
  margin-left: 16px;
  height: 30px;
  line-height: 30px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #8b8e9d;
  cursor: pointer;
}
.post-article:hover {
  background: #4fbdd4;
  color: white;
}
.topic-container {
  margin-top: 10px;
  background: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
}

.topic-container .header-container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 10px;
}

.header-container .author {
  display: flex;
  align-items: center;
  height: 36px;
  position: relative;
}

.header-container .info {
  margin-left: 46px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info .owner {
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  font-size: 18px;
  // color: #4fbdd4;
}

.info .date {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #c5c6cb;
  margin-top: 5px;
}
.talk-content-container {
  padding-left: 56px;
  padding-right: 20px;
  margin-bottom: 10px;
  line-height: 21px;
  color: #2f3034;
}
.talk-content-container .content {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  max-width: 500px;
}

.topic-container .operation-icon-container {
  position: relative;
  padding-left: 56px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 15px 0;
}
.topic-container .operation-icon-container .operation-icon {
  display: flex;
}
.topic-container .operation-icon-container .operation-icon div {
  width: 21px;
  height: 21px;
  margin-right: 30px;
  cursor: pointer;
}
.steemLink {
  color: #c5c6cb;
  font-size: 12px;
  position: absolute;
  right: 100px;
}
.topic-container .operation-icon-container .details-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.topic-container .operation-icon-container .details-container .text {
  font-size: 12px;
  color: #c5c6cb;
}

.topic-container .operation-icon-container .details-container .icon {
  width: 20px;
  height: 30px;
  line-height: 40px;
  /* background-image: url(assets/resources/sprite@1x.fb4b9063d37e9252.png); */
  /* background-position: -297px -197px; */
}
.create-topic-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  overflow-y: scroll;
}
.header-container .author .avatar {
  position: absolute;
  top: 0;
  left: 0;
  height: 36px;
  width: 36px;
  border-radius: 50%;
  background-color: #f5f6f7;
  cursor: pointer;
}
.create-topic-container .create-topic-panel {
  margin: 60px auto;
  background: #fff;
  width: 80%;
  min-width: 200px;
  min-height: 220px;
  border-radius: 4px;
  padding: 0 20px 20px;
  box-sizing: border-box;
}
@media screen and (max-width: 1600px) {
  .create-topic-container .create-topic-panel {
    width: 80%;
  }
}

.create-topic-container .create-topic-panel .head {
  position: relative;
}
.create-topic-container .create-topic-panel .head .title {
  color: #2f3034;
  text-align: left;
  font-size: 16px;
  height: 50px;
  font-weight: 700;
  display: flex;
  align-items: center;
}
.create-topic-container .create-topic-panel .content-container .avatar {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: #f5f6f7;
  margin-right: 10px;
  flex-shrink: 0;
}
.create-topic-container .create-topic-panel .head .close-icon {
  position: absolute;
  right: 0px;
  top: calc(50% - 5px);
  /* background-image: url(assets/resources/sprite@1x.fb4b9063d37e9252.png); */
  background-position: -357px -197px;
  width: 10px;
  height: 10px;
  cursor: pointer;
}
.create-topic-container .create-topic-panel .horizontal-line {
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
}

.create-topic-container .create-topic-panel .content-container {
  position: relative;
  margin: 10px 0;
  display: flex;
}

.quill-editor .ql-container {
  border: none;
  font-family: PingFangSC-Regular;
  font-size: 14px !important;
}

.quill-editor .ql-container .ql-editor {
  padding: 0;
  color: #2f3034;
  line-height: 20px;
}
.ql-editor {
  box-sizing: border-box;
  counter-reset: list-0 list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8
    list-9;
  height: 100%;
  outline: none;
  overflow-y: auto;
  tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.upload-container {
  position: relative;
}

.create-topic-container .create-topic-panel .operation-icon {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  -webkit-user-select: none;
  user-select: none;
}
.create-topic-container .create-topic-panel .operation-icon .left {
  display: flex;
  align-items: center;
  position: relative;
  flex-flow: row wrap;
  max-width: 600px;
  .picture-list {
    width: 100px;
    height: 100px;
    position: relative;
    border-radius: 10px;
    margin-left: 10px;
    .delete-pic {
      width: 16px;
      height: 16px;
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      top: 2px;
      right: 2px;
      text-align: center;
      &:hover {
        color: #4fbdd4;
        background: rgba(79, 189, 212, 0.1);
        /* background: rgba(255,130,0,.1); */
      }
    }

    img {
      width: 100px;
      height: 100px;
      border-radius: 10px;
      opacity: 0.7;
      object-fit: cover;
    }
    &:hover {
      background: black;
      opacity: 0.8;
    }
  }
  .picture-list:hover {
    background: black;
  }
}

.create-topic-container .create-topic-panel .operation-icon .right {
  display: flex;
  position: absolute;
  right: 0;
}
.upload-container .image-list-container {
  margin-top: 10px;
  margin-bottom: 4px;
  width: 318px;
}
.create-topic-container .create-topic-panel .operation-icon .right .text-range {
  margin-right: 16px;
  font-size: 12px;
  color: #c5c6cb;
  height: 24px;
  line-height: 24px;
  text-align: center;
}
.create-topic-container .create-topic-panel .operation-icon .right .submit-btn {
  min-width: 50px;
  height: 24px;
  padding: 0 6px;
  box-sizing: border-box;
  line-height: 24px;
  text-align: center;
  background: #4fbdd4;
  box-shadow: 0 1px 2px #0000000d;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
}

.topic-detail .content .topic-detail-panel {
  background: #fff;
  border-radius: 4px;
  padding: 20px 30px 30px;
}
.el-col {
  margin-bottom: 20px;
}
.el-col:last-child {
  margin-bottom: 0;
}
.special_container {
  padding: 40px;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.empty {
  width: 100%;
  height: 140px;
  background: url('../../assets/quhu.png') no-repeat center center;
  background-size: 140px 140px;
}
.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
.wbpro-side-tit {
  height: 40px;
  line-height: 40px;
  padding: 0 18px;
  display: flex;
  position: relative;
}
.f16 {
  font-size: 16px;
}
.wbpro-side .f14 {
  cursor: pointer;
  width: 172px;
  font-size: 14px;
}
.wbpro-side-panel {
  padding: 0 18px;
  /* position: absolute; */
}
.wbpro-side-card7 .con {
  position: relative;
  height: 40px;
  padding: 0 30px 0 24px;
}
.wbpro-side-card7 .top {
  color: #f26d5f;
}
.wbpro-side-card7 .rank {
  position: absolute;
  top: 50%;
  left: 0;
  width: 20px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  text-align: center;
  color: #ff8200;
}
.wbpro-side-card7 .wbpro-textcut {
  margin-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wbpro-side .f12 {
  cursor: pointer;
  margin-left: 4px;
  font-size: 12px;
  line-height: 16px;
}
.wbpro-side-card7 .icon {
  position: absolute;
  right: 0;
  top: 50%;
  margin: -10px 0 0;
}
.wbpro-icon-search-tp1 {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background: rgb(255, 148, 6);
}
.woo-box-alignCenter {
  align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
}
.woo-box-flex {
  display: flex;
}
</style>
