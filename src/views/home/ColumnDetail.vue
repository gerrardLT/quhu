<template>
  <div>
    <div class="columnDetail_container">
      <div class="tool_bar">
        <el-page-header
          @back="goBack"
          class="go_back"
          :title="$t('column_detail.go_back')"
        >
        </el-page-header>

        <div class="share" v-if="isMyColumn">
          <Dropdown :options="options" v-model="inviteType" :drop="dropDown">
          </Dropdown>
          <i
            class="el-icon-share share-icon"
            :title="`${$t('column_detail.click_copy')}${inviteType}${$t(
              'column_detail.link'
            )}`"
            @click="copyInviteCode($event)"
          ></i>
        </div>
      </div>

      <el-row
        type="flex"
        class="subscriptions"
        justify="space-between"
        v-if="isMyColumn"
      >
        <el-col :span="18">
          <div class="sub_name">
            <span>{{ detail_info.subscriptions_name }}</span>
            <div
              class="tags"
              style="margin-top: 10px; display: flex"
              v-if="isMyColumn"
            >
              <el-tag
                class="tag"
                style="margin-left: 5px; min-width: 50px"
                :type="tagTypes[i]"
                v-for="(item, i) in detail_info.tags"
                :key="i"
                closable
                :title="item"
                @close="handleTagClose(item)"
                >{{ item }}</el-tag
              >

              <input
                type="text"
                class="input-new-tag el-textarea__inner"
                v-if="inputVisible"
                v-model.lazy="inputValue"
                maxlength="8"
                ref="saveTagInput"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button
                v-else-if="detail_info.tags.length < 4"
                class="button-new-tag"
                size="small"
                @click="showInput"
                >{{ $t('info.add_label') }}</el-button
              >
            </div>
            <div class="tags" style="margin-top: 10px; display: flex" v-else>
              <el-tag
                effect="plain"
                class="tag"
                style="margin-left: 5px; min-width: 50px"
                :type="tagTypes[i]"
                v-for="(item, i) in detail_info.tags"
                :key="i"
                :title="item"
                >{{ item }}</el-tag
              >
            </div>
          </div>
          <div class="owner">
            <div class="owner_img">
              <svg
                :style="{
                  fill: '#087790',
                  width: '30px',
                  height: '15px'
                }"
              >
                <use :xlink:href="'#icon-huangguan'" rel="external nofollow" />
              </svg>
              <img :src="detail_info.master.avatar" alt="" />
            </div>
            <div>
              {{ detail_info.master.user_name }}
            </div>
          </div>
          <div class="members">
            <span
              >{{ $t('column_detail.column_people') }}：{{
                detail_info.member || 0
              }}{{ $t('column_detail.person') }}</span
            >
          </div>
          <div class="create_time">
            <span v-if="detail_info.time_stamp"
              >{{ $t('column_detail.create_time') }}：{{
                transformTime(detail_info.time_stamp)
              }}</span
            >
            <el-skeleton v-else :rows="1" />
          </div>
        </el-col>
        <el-col
          :span="6"
          class="sub_image"
          :title="$t('column_detail.picture_tip')"
        >
          <el-upload
            :action="actionUrl"
            ref="upload"
            :show-file-list="false"
            :http-request="onUploadHandler"
          >
            <img :src="detail_info.image" alt="" />
          </el-upload>
        </el-col>
      </el-row>
      <el-row type="flex" class="subscriptions" justify="space-between" v-else>
        <el-col :span="18">
          <div class="sub_name">
            <span>{{ detail_info.subscriptions_name }}</span>
          </div>
          <div
            class="tags"
            style="margin-top: 10px; margin-bottom: 10px; display: flex"
          >
            <el-tag
              class="tag"
              style="margin-left: 5px; min-width: 50px"
              :type="tagTypes[i]"
              v-for="(item, i) in detail_info.tags"
              :key="i"
              :title="item"
              >{{ item }}</el-tag
            >
          </div>
          <div class="owner">
            <div class="owner_img">
              <img :src="detail_info.master.avatar" alt="" />
            </div>
            <div>
              {{ detail_info.master.user_name }}
            </div>
          </div>

          <div class="members">
            <span
              >{{ $t('column_detail.column_people') }}：{{
                detail_info.member || 0
              }}{{ $t('column_detail.person') }}</span
            >
          </div>
          <div class="create_time">
            <span v-if="detail_info.time_stamp"
              >{{ $t('column_detail.create_time') }}：{{
                transformTime(detail_info.time_stamp)
              }}</span
            >
            <el-skeleton v-else :rows="1" />
          </div>
        </el-col>
        <el-col :span="6" class="sub_image">
          <img :src="detail_info.image" alt="" />
        </el-col>
      </el-row>
      <el-row type="flex" class="introduce" v-if="isMyColumn">
        <el-col :span="24">
          <div class="intro_title" :title="$t('column_detail.intro_tip')">
            <span>{{ $t('column_detail.intro') }} </span>
            <svg
              @click="showIntro = !showIntro"
              :style="{
                fill: '#087790',
                width: '15px',
                height: '15px',
                marginRight: '5px',
                cursor: 'pointer'
              }"
            >
              <use :xlink:href="'#icon-ze-edit'" rel="external nofollow" />
            </svg>
          </div>
          <el-input
            v-if="showIntro"
            type="textarea"
            autosize
            clearable
            :rows="2"
            show-word-limit
            maxlength="200"
            minlength="0"
            :placeholder="$t('column_detail.content_tip')"
            v-model="detail_info.introduction"
            @blur="showIntro = false"
          >
          </el-input>
          <div v-else style="word-wrap: break-word">
            {{ detail_info.introduction }}
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="introduce" v-else>
        <el-col :span="24">
          <div class="intro_title">
            <span>{{ $t('column_detail.intro') }} </span>
          </div>
          <div style="word-wrap: break-word">
            {{ detail_info.introduction }}
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" class="article_tag" v-if="isMyColumn">
        <el-col :span="24">
          <div class="article_tag_title">
            <span>{{ $t('column_detail.tag_title') }} </span>
          </div>
          <div class="tag_container">
            <div :key="tag.id" v-for="(tag, i) in articleTypes">
              <el-tag
                v-if="!tag.inputTagVisible"
                class="tag_item"
                type="info"
                effect="dark"
                :closable="tag.id !== $t('home.essence')"
                @close="handleClose(tag, i)"
                @click="showInputTag(tag, i)"
              >
                {{ tag.value }}
              </el-tag>
              <el-input
                v-else
                style="max-width: 135px; width: auto !important; margin-left: 10px"
                maxlength="8"
                :ref="'articleTag' + i"
                class="input-tag"
                v-model="tag.value"
                size="small"
                @keyup.enter.native="handleTagChange(tag, i)"
                @blur="handleTagChange(tag, i)"
              >
              </el-input>
            </div>
            <el-input
              maxlength="8"
              style="max-width: 135px; width: auto; margin-left: 10px"
              class="input-new-tag"
              v-if="inputTagVisible"
              v-model.trim="inputTagValue"
              size="small"
              @keyup.enter.native="handleTagInputConfirm"
              @blur="handleTagInputConfirm"
            >
            </el-input>
            <el-button
              v-if="!inputTagVisible && articleTypes.length < 6"
              style="margin-left: 10px"
              class="button-new-tag"
              ref="saveArticleTagInput"
              size="small"
              @click="showTagInput"
              >+ New</el-button
            >
          </div>
        </el-col>
      </el-row>
      <el-row class="set" v-if="isMyColumn">
        <div class="coinType common_set">
          <el-tag>{{ $t('column_detail.coin_tip') }}</el-tag>
          <el-select
            class="price_select"
            v-model="detail_info.currency"
            clearable
            :placeholder="$t('column_detail.select_coin')"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="item in payTypes"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div class="amount common_set">
          <el-tag>{{ $t('column_detail.coin_account_tip') }}</el-tag>
          <el-input
            style="width: 220px"
            :placeholder="$t('column_detail.input_column')"
            v-model="detail_info.price"
          >
          </el-input>
        </div>
        <div class="authority common_set">
          <el-tag>{{ $t('column_detail.post_auth') }}</el-tag>
          <div class="radio">
            <el-radio v-model="detail_info.allow" label="self">{{
              $t('column_detail.self')
            }}</el-radio>
            <el-radio v-model="detail_info.allow" label="all">{{
              $t('column_detail.all')
            }}</el-radio>
          </div>
        </div>
        <div class="public common_set">
          <el-tag>{{ $t('column_detail.public_column') }}</el-tag>
          <div class="radio">
            <el-radio v-model="detail_info.public" label="public">{{
              $t('column_detail.public')
            }}</el-radio>
            <el-radio v-model="detail_info.public" label="hide">{{
              $t('column_detail.hide')
            }}</el-radio>
          </div>
        </div>
        <div class="save_container">
          <el-button class="save_btn" type="primary" @click="saveSet" round>
            {{ $t('column_detail.save') }}
          </el-button>
        </div>
      </el-row>
      <el-row class="set" v-else>
        <div class="subscribe_time common_set">
          <el-tag>{{ $t('column_detail.subscribe_time') }}</el-tag>
          <el-select
            class="price_select"
            v-model="detail_info.month"
            clearable
            :placeholder="$t('column_detail.subscribe_time_tip')"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="item in subscribeTimeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="book">
          <div class="create_time" style="margin-bottom: 10px">
            <span v-if="!isMyColumn && expires && detail_info.price !== '0'">
              {{ $t('column_detail.subscribe_end') }}：{{
                transformTime(expires)
              }}</span
            >
            <el-skeleton v-else :rows="1" />
          </div>
          <el-button
            class="save_btn"
            v-if="isJoined && detail_info.price !== '0'"
            type="primary"
            @click="subscribe"
            round
          >
            {{ $t('column_detail.subscribe') }}（{{
              (detail_info.price === '0'
                ? '0'
                : keepThreeNum((detail_info.price / 12) * detail_info.month)) +
              detail_info.currency
            }}）
          </el-button>
        </div>
      </el-row>
      <el-row type="flex" class="add_column" justify="center" align="middle">
        <el-button
          v-if="!isJoined && !isMyColumn"
          class="add_btn"
          type="primary"
          @click="confirmVisible = true"
          round
        >
          {{ $t('column_detail.price') }}：{{
            (detail_info.price === '0'
              ? '0'
              : keepThreeNum((detail_info.price / 12) * detail_info.month)) +
            detail_info.currency
          }}
          <br />
          <br />
          {{ $t('column_detail.apply') }}
        </el-button>
        <el-button
          v-else
          class="remove_btn"
          type="primary"
          @click="removeSub"
          round
        >
          {{ $t('column_detail.exit') }}
        </el-button>
        <el-dialog
          :title="$t('column_detail.exit_tip_text')"
          :visible.sync="removePopVisible"
          :close-on-click-modal="false"
          width="30%"
          center
          round
        >
          <span>{{ $t('column_detail.exit_tip') }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="removePopVisible = false">{{
              $t('column_detail.cancel')
            }}</el-button>
            <el-button type="primary" @click="remove">{{
              $t('column_detail.confirm')
            }}</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :title="$t('column_detail.tip')"
          :visible.sync="confirmVisible"
          width="30%"
          center
          round
          :close-on-click-modal="false"
        >
          <span>{{ tips }} </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="confirmVisible = false">{{
              $t('column_detail.cancel')
            }}</el-button>
            <el-button type="primary" @click="apply(inviteCode)">{{
              $t('column_detail.confirm')
            }}</el-button>
          </span>
        </el-dialog>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { sha256 } from '@/utils/ecc/src/hash'
import Signature from '@/utils/ecc/src/signature'
import { actObj } from '@/utils/act'
import {
  subscriptions,
  addColumn,
  removeColumn,
  add2Column,
  invite
} from '@/api/special/special'
import { getUser } from '@/api/user/user'
import { getToken } from '@/utils/auth'
import { transformTime } from '@/utils/tool'
import { Loading } from 'element-ui'
const defaultImg = require(`../../assets/quhu-logo.jpg`)
import { cloneDeep } from 'lodash'
import clipboard from '@/utils/clipboard'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import { decrypt } from '@/utils/ascill'
export default {
  name: 'ColumnDetail',
  components: {
    Dropdown
  },
  async created() {
    this.getMembers()
    this.getDetail()
    this.userInfo.article.forEach((item) => {
      if (item.name === this.$route.query.subName) {
        this.expires = item.expiry
      }
    })
  },
  mounted() {
    const { inviteCode } = this.$route.query
    if (inviteCode) {
      this.confirmVisible = true
    }
  },
  data() {
    return {
      articleTypes: [],
      inputTagVisible: false,
      inputTagValue: '',
      inputVisible: false,
      inputValue: '',
      tagTypes: ['success', 'warning', 'danger'],
      inviteType: this.$t('column_detail.share'),
      inviteCode: '',
      subscribeType: '',
      confirmVisible: false,
      actionUrl: '',
      showIntro: false,
      payTypes: ['poys', 'op', 'ofc', 'usdt', 'bnb'],
      detail_info: {
        subscriptions_name: '',
        master: '',
        introduction: '',
        image: defaultImg,
        price: '',
        time_stamp: '',
        currency: '',
        allow: 'self',
        month: 12,
        public: true,
        tags: []
      },
      options: [
        this.$t('column_detail.share'),
        this.$t('column_detail.invite')
      ],
      currentInfo: {},
      removePopVisible: false,
      isJoined: false,
      subscribeTimeList: [
        { label: this.$t('column_detail.one_month'), value: 1 },
        { label: this.$t('column_detail.three_month'), value: 3 },
        { label: this.$t('column_detail.six_month'), value: 6 },
        { label: this.$t('column_detail.nine_month'), value: 9 },
        { label: this.$t('column_detail.twelve_month'), value: 12 }
      ],
      expires: 0
    }
  },
  computed: {
    isMyColumn() {
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      return userInfo.buy_article.my.indexOf(this.$route.query.subName) !== -1
    },
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo'))
    },
    tips() {
      let tip = ''
      const { inviteCode } = this.$route.query
      if (inviteCode) {
        tip = this.$t('column_detail.apply_tip')
      } else {
        tip =
          this.$t('column_detail.confirm_spend') +
          (this.detail_info.price === '0'
            ? '0'
            : this.keepThreeNum(
                (this.detail_info.price / 12) * this.detail_info.month
              )) +
          this.detail_info.currency +
          (this.subscribeType === 'again'
            ? this.$t('column_detail.read_column')
            : this.$t('column_detail.apply_column'))
      }
      return tip
    }
  },
  methods: {
    transformTime,
    showInputTag(tag, i) {
      if (tag.id !== this.$t('home.essence')) {
        tag.inputTagVisible = true

        this.articleTypes.forEach((item) => {
          if (item.value !== tag.value) {
            item.inputTagVisible = false
          }
        })
        this.$nextTick((_) => {
          this.$refs['articleTag' + i][0].$refs.input.focus()
        })
        this.$forceUpdate()
      }
    },
    handleClose(tag, i) {
      this.articleTypes.splice(i, 1)
    },

    showTagInput() {
      this.inputTagVisible = true
    },
    handleTagChange(tag) {
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,8}$/
      if(!reg.test(tag.value.trim())){
        this.$message.error(this.$t('column_detail.tag_error'))
        return 
      }
      let arr = []
      this.articleTypes.forEach((item) => {
        if (item.value !== tag.value) {
          arr.push(item.value)
        }
      })
      if (arr.indexOf(tag.value) !== -1) {
        this.$message.error(this.$t('column_detail.tag_dupliate_error'))
        return
      }
      if (tag.value) {
        tag.inputTagVisible = false
      }

      this.$forceUpdate()
    },
    handleTagInputConfirm() {
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{0,8}$/
      let inputTagValue = this.inputTagValue

      if(!reg.test(inputTagValue.trim())){
        this.$message.error(this.$t('column_detail.tag_error'))
        return 
      }
      let arr = []
      this.articleTypes.forEach((item) => {
        arr.push(item.value)
      })

      if (arr.indexOf(inputTagValue) !== -1) {
        this.$message.error(this.$t('column_detail.tag_dupliate_error'))
        return
      }
      if (inputTagValue) {
        this.articleTypes.push({
          inputTagVisible: false,
          value: inputTagValue,
          id: inputTagValue
        })
      }
      this.inputTagVisible = false
      this.inputTagValue = ''
    },
    async handleTagClose(tag) {
      //   const arr = cloneDeep(this.tags)
      this.detail_info.tags.splice(this.detail_info.tags.indexOf(tag), 1)
      this.$forceUpdate()
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },
    async handleInputConfirm() {
      let inputValue = this.inputValue
      // const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      // if (!reg.test(inputValue.trim())) {
      //   this.$message.error(this.$t('info.nick_tip'))
      //   return
      // }
      const arr = [inputValue]
      if (inputValue) {
        this.detail_info.tags = this.detail_info.tags.concat(arr)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    async dropDown() {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const subscriptions_name = this.$route.query.subName
      if (this.isMyColumn) {
        if (this.inviteType === this.$t('column_detail.invite')) {
          this.$loading.show()
          const inviteCodeRes = await invite({
            id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
            token: getToken(),
            subscriptions_name
          })
          if (inviteCodeRes && inviteCodeRes.success === 'ok') {
            this.inviteCode = inviteCodeRes.data.invitedcode
            console.log(this.inviteCode)
          }
          this.$loading.hide()
        }
      }
    },
    copyInviteCode(e) {
      const link =
        this.inviteType === this.$t('column_detail.share')
          ? window.location.href
          : window.location.href + '&inviteCode=' + this.inviteCode
      clipboard(link, e)
      this.$message.success(this.$t('column_detail.copy_success'))
    },

    subscribe() {
      this.subscribeType = 'again'
      this.confirmVisible = true
    },
    async getUser() {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const currentInfo = await getUser({
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken()
      })

      if (currentInfo && currentInfo.success === 'ok') {
        if (currentInfo.data) {
          this.currentInfo = currentInfo.data
          this.currentInfo.article.forEach((item) => {
            if (item.name === this.$route.query.subName) {
              this.expires = item.expiry
            }
          })
          localStorage.setItem(
            'quhu-userInfo',
            JSON.stringify(currentInfo.data)
          )
        }
      }
      return this.currentInfo
    },
    goBack() {
      this.$router.go(-1)
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
    async onUploadHandler(e) {
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = localStorage.getItem('login-type')
      const isLt2M = e.file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error(this.$t('column_detail.avatar_tip'))
      }
      if (isLt2M) {
        let dataUrl = ''
        const self = this
        if (e.file) {
          console.log('** image being loaded.. ----->', e.file)
          let width = 0
          let height = 0
          const reader = new FileReader()
          reader.addEventListener('load', (theFile) => {
            let image = new Image()
            image.src = theFile.target.result
            image.onload = function () {
              // this.height = (this.height / this.width) * 80
              // this.width = 80
              width = this.width
              height = this.height
              // console.log(this.height, this.width)
            }

            dataUrl = reader.result
            const prefix = new Buffer('ImageSigningChallenge')
            const commaIdx = dataUrl.indexOf(',')
            const dataBs64 = dataUrl.substring(commaIdx + 1)
            const data = new Buffer(dataBs64, 'base64')
            const buf = Buffer.concat([prefix, data])
            const bufSha = sha256(buf)
            const sig = Signature.signBufferSha256(
              bufSha,
              decrypt(actObj.postKey, 9)
            ).toHex()
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
                  if (res.status === 200) {
                    self.detail_info.image = res.data.url
                  }
                }
              )
            }
          })
          reader.readAsDataURL(e.file)
        }
      }
    },
    async saveSet() {
      const {
        subscriptions_name,
        introduction,
        image,
        price,
        currency,
        allow,
        tags
      } = this.detail_info
      const articleArr = []
      this.articleTypes.forEach((item) => {
        articleArr.push(item.value)
      })

      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name: subscriptions_name,
        introduction: introduction,
        image: image,
        price: price + currency,
        tags,
        item: articleArr
      }
      if (allow === 'all') {
        params.allow = 'all'
      }

      if (this.detail_info.public === 'public') {
        params.public = true
      } else {
        params.public = false
      }
      // console.log(params)
      this.$loading.show()
      const res = await subscriptions(params)

      if (res && res.success === 'ok') {
        this.$message.success(this.$t('column_detail.set_success'))
      } else {
        this.$message.error(this.$t('column_detail.set_fail'))
      }
      this.$loading.hide()
    },
    removeSub() {
      this.removePopVisible = true
    },
    async remove() {
      const { subscriptions_name } = this.detail_info
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = localStorage.getItem('login-type')
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        subscriptions_name
      }

      const res = await removeColumn(params)
      // console.log(res)
      if (res && res.success === 'ok') {
        this.$message.success(this.$t('column_detail.exit_success_tip'))
      } else {
        this.$message.error(res.error)
      }
      this.removePopVisible = false

      this.goBack()
    },
    keepThreeNum(value) {
      let resValue = 0
      //小数点的位置
      let index = value && value.toString().indexOf('.') + 1
      //小数的位数
      let num = value && Math.abs(Number(value)).toString().length - index
      if (index && num > 3) {
        resValue = value && Number(value).toFixed(3)
      } else {
        resValue = value
      }
      return resValue
    },
    async getMembers(){
      const subscriptions_name = this.$route.query.subName
      const params = {
        type: 'member',
        subscriptions_name
      }

      const res = await subscriptions(params)
      if(res && res.success === 'ok'){
        console.log(res)
      }
    },
    async getDetail() {
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      if (!userInfo) {
        this.$router.push({
          path: '/login',
          query: this.$route.query
        })
      }
      const loginType = localStorage.getItem('login-type')
      const subscriptions_name = this.$route.query.subName
      const params = {
        type: 'info',
        subscriptions_name
      }

      const res = await subscriptions(params)

      if (res && res.success === 'ok') {
        this.detail_info = res.data
        this.detail_info.tags = this.detail_info.tags
        this.detail_info.item = this.detail_info.item.filter(
          (item) => item !== ''
        )
        this.detail_info.item.forEach((item) => {
          this.articleTypes.push({
            inputTagVisible: false,
            value: item,
            id: item
          })
        })
        if (this.detail_info.allow !== 'all') {
          this.detail_info.allow = 'self'
        }

        if (this.detail_info.public === true) {
          this.detail_info.public = 'public'
        } else {
          this.detail_info.public = 'hide'
        }

        if (this.detail_info.price.indexOf('op') !== -1) {
          this.detail_info.currency = 'op'
          this.detail_info.price = this.detail_info.price.split('op')[0]
        }
        this.payTypes.forEach((item) => {
          if (this.detail_info.price.indexOf(item) !== -1) {
            this.detail_info.currency = item
            this.detail_info.price = this.detail_info.price.split(item)[0]
          }
        })

        this.isJoined =
          userInfo.buy_article.join.indexOf(
            this.detail_info.subscriptions_name
          ) !== -1
      }

      if (!this.detail_info.month) {
        this.detail_info.month = 12
      }

      if (!this.detail_info.image) {
        this.detail_info.image = defaultImg
      }
    },
    async apply(v) {
      const { inviteCode } = this.$route.query
      const { subscriptions_name, month } = this.detail_info
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = localStorage.getItem('login-type')
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name,
        month
      }
      console.log(v, inviteCode)
      if (inviteCode) {
        params.invitedcode = inviteCode
      }
      this.$loading.show()

      if (this.subscribeType === 'again') {
        const res = await add2Column(params)

        if (res && res.success === 'ok') {
          const currentInfo = await this.getUser()

          this.$message.success(this.$t('column_detail.read_success'))
        }
      } else {
        const res = await addColumn(params)

        if (res && res.success === 'ok') {
          this.$message.success(this.$t('column_detail.apply_success'))
          this.$router.go(-1)
        }
      }
      this.confirmVisible = false
      this.$loading.hide()
    }
  },
  watch: {
    expires: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true
    },
    '$i18n.locale': {
      handler(newVal, oldVal) {
        this.options = [
          this.$t('column_detail.share'),
          this.$t('column_detail.invite')
        ]
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
.tool_bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .share {
    height: 20px;
    cursor: pointer;
    font-size: 16px;
    .share-icon {
      width: 16px;
      height: 16px;
      font-size: 16px;
    }
  }
}
::v-deep .type_select .el-input__inner {
  border: none;
  width: 50px;
  padding: 0;
}
::v-deep .set .el-tag {
  background-color: #54bcbd;
  border-color: #54bcbd;
  color: white;
}
::v-deep .el-tag .el-icon-close {
  width: 12px;
  height: 12px;
  line-height: 12px;
  top: 0;
  right: -5px;
}
::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #54bcbd;
}
::v-deep .el-radio__input.is-checked .el-radio__inner {
  border-color: #54bcbd;
  background: #54bcbd;
}

.go_back {
  margin-bottom: 10px;
}
.columnDetail_container {
  padding: 20px 50px;
  margin: 50px;
  border: 1px solid #e4e4e4;
  background-color: #fff;
  .subscriptions {
    border-bottom: 1px dashed #e4e4e4;
    padding: 10px 0;
    font-size: 14px;
    .members {
      color: #c0c0c0;
      margin-bottom: 10px;
    }
    .create_time {
      color: #c0c0c0;
    }
    .owner {
      display: flex;
      align-items: center;
      margin-right: 20px;
      margin-bottom: 20px;
      .owner_img {
        margin-right: 20px;
        display: flex;
        flex-direction: column;
        img {
          border-radius: 50%;
          padding-left: 2px;
          width: 24px;
          height: 24px;
          object-fit: cover;
        }
      }
    }
    .sub_name {
      display: flex;
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
      flex-direction: column;
    }
    .button-new-tag {
      margin-left: 10px;
      width: 80px;
      height: 26px;
      line-height: 26px;
      padding-top: 0;
      padding-bottom: 0;
      border-radius: 20px;
      font-size: 10px;
    }
    .tag {
      display: inline-block;
      margin-left: 10px;
      height: 26px;
      line-height: 26px;
      min-width: 80px;
      padding-top: 0;
      padding-bottom: 0;
      border-radius: 20px;
      font-size: 10px;
      display: flex;
      justify-content: center;
    }
    .input-new-tag {
      width: 80px;
      height: 26px;
      margin-left: 10px;
      vertical-align: bottom;
      font-size: 12px;
    }
    .sub_image {
      cursor: pointer;
      width: 80px;
      height: 80px;
      img {
        // width: 100%;
        // height: 100%;
        width: 80px;
        height: 80px;
        // object-fit: cover;
      }
    }
  }
  .introduce {
    margin-top: 20px;
    height: 160px;
    border-bottom: 1px dashed #e4e4e4;
    margin-bottom: 20px;
    .intro_title {
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: bold;
    }
  }
  .article_tag {
    margin-top: 20px;
    border-bottom: 1px dashed #e4e4e4;
    margin-bottom: 20px;
    .article_tag_title {
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: bold;
    }
    .tag_container {
      display: flex;
      margin-bottom: 20px;
      .tag_item {
        margin-left: 10px;
        .input-tag {
        }
      }
    }
  }
  .book {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .set {
    border-bottom: 1px dashed #e4e4e4;
    .common_set {
      display: flex;
      justify-content: space-between;
      height: 100px;
    }
    .coinType {
    }
    .amount {
    }
    .authority {
      .radio {
        width: 150px;
        height: 30px;
        display: flex;
        justify-content: space-between;
      }
    }
    .public {
      .radio {
        width: 150px;
        height: 30px;
        display: flex;
        justify-content: space-between;
      }
    }
    .save_container {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
    }
    .save_btn {
      background-color: #54bcbd;
    }
  }
  .add_column {
    height: 200px;
    .add_btn {
      width: 330px;
      height: 50px;
      background-color: #54bcbd;
    }
    .remove_btn {
      width: 330px;
      height: 50px;
      background-color: #bd3124;
      opacity: 0.8;
    }
  }
}
</style>
