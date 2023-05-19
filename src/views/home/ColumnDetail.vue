<template>
  <div>
    <div class="columnDetail_container">
      <div class="tool_bar">
        <el-page-header @back="goBack" class="back" title="返回首页">
        </el-page-header>

        <div class="share" v-if="isMyColumn">
          <Dropdown :options="options" v-model="inviteType" :drop="dropDown">
          </Dropdown>
          <i
            class="el-icon-share share-icon"
            :title="`点击复制${inviteType}链接`"
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
            <span>专栏成员数：{{ detail_info.member || 0 }}人</span>
          </div>
          <div class="create_time">
            <span v-if="detail_info.time_stamp"
              >专栏成立时间：{{ transformTime(detail_info.time_stamp) }}</span
            >
            <el-skeleton v-else :rows="1" />
          </div>
        </el-col>
        <el-col
          :span="6"
          class="sub_image"
          title="点击可修改专栏封面，请尽量上传方形图片，否则可能图片失真"
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
          <div class="owner">
            <div class="owner_img">
              <img :src="detail_info.master.avatar" alt="" />
            </div>
            <div>
              {{ detail_info.master.user_name }}
            </div>
          </div>
          <div class="members">
            <span>专栏成员数：{{ detail_info.member || 0 }}人</span>
          </div>
          <div class="create_time">
            <span v-if="detail_info.time_stamp"
              >专栏成立时间：{{ transformTime(detail_info.time_stamp) }}</span
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
          <div
            class="intro_title"
            @click="showIntro = !showIntro"
            title="点击可修改专栏简介"
          >
            <span>专栏介绍 </span>
            <svg
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
            :rows="2"
            placeholder="请输入内容"
            v-model="detail_info.introduction"
            @blur="showIntro = false"
          >
          </el-input>
          <div v-else>{{ detail_info.introduction }}</div>
        </el-col>
      </el-row>
      <el-row type="flex" class="introduce" v-else>
        <el-col :span="24">
          <div class="intro_title">
            <span>专栏介绍 </span>
          </div>
          <div>{{ detail_info.introduction }}</div>
        </el-col>
      </el-row>
      <el-row class="set" v-if="isMyColumn">
        <div class="coinType common_set">
          <el-tag>订阅本专栏所需币种</el-tag>
          <el-select
            class="price_select"
            v-model="detail_info.currency"
            clearable
            placeholder="请选择币种"
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
          <el-tag>订阅本专栏所需币种数</el-tag>
          <el-input
            style="width: 220px"
            placeholder="请输入专栏价格"
            v-model="detail_info.price"
          >
          </el-input>
        </div>
        <div class="authority common_set">
          <el-tag>专栏发文权限</el-tag>
          <div class="radio">
            <el-radio v-model="detail_info.allow" label="self">自己</el-radio>
            <el-radio v-model="detail_info.allow" label="all">所有人</el-radio>
          </div>
        </div>
        <div class="public common_set">
          <el-tag>是否公开专栏</el-tag>
          <div class="radio">
            <el-radio v-model="detail_info.public" label="public"
              >公开</el-radio
            >
            <el-radio v-model="detail_info.public" label="hide">隐藏</el-radio>
          </div>
        </div>
        <div class="save_container">
          <el-button class="save_btn" type="primary" @click="saveSet" round>
            保存
          </el-button>
        </div>
      </el-row>
      <el-row class="set" v-else>
        <div class="subscribe_time common_set">
          <el-tag>订阅时长（可叠加）</el-tag>
          <el-select
            class="price_select"
            v-model="detail_info.month"
            clearable
            placeholder="请选择订阅时长"
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
              订阅到期时间：{{ transformTime(expires) }}</span
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
            订阅（{{
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
          价格：{{
            (detail_info.price === '0'
              ? '0'
              : keepThreeNum((detail_info.price / 12) * detail_info.month)) +
            detail_info.currency
          }}
          <br />
          <br />
          申请加入
        </el-button>
        <el-button
          v-else
          class="remove_btn"
          type="primary"
          @click="removeSub"
          round
        >
          退出专栏
        </el-button>
        <el-dialog
          title="退出提示"
          :visible.sync="removePopVisible"
          :close-on-click-modal="false"
          width="30%"
          center
          round
        >
          <span
            >当只有最后一位成员时退出专栏将自动解散。确认退出当前专栏吗？</span
          >
          <span slot="footer" class="dialog-footer">
            <el-button @click="removePopVisible = false">取 消</el-button>
            <el-button type="primary" @click="remove">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="提示"
          :visible.sync="confirmVisible"
          width="30%"
          center
          round
          :close-on-click-modal="false"
        >
          <span>{{ tips }} </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="confirmVisible = false">取 消</el-button>
            <el-button type="primary" @click="apply(inviteCode)"
              >确 定</el-button
            >
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
      inviteType: '分享',
      inviteCode: '',
      subscribeType: '',
      confirmVisible: false,
      actionUrl: '',
      showIntro: false,
      payTypes: ['poys', 'ofc', 'busd', 'bnb'],
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
        public: true
      },
      options: ['分享', '邀请'],
      currentInfo: {},
      removePopVisible: false,
      isJoined: false,
      subscribeTimeList: [
        { label: '1个月', value: 1 },
        { label: '3个月', value: 3 },
        { label: '6个月', value: 6 },
        { label: '9个月', value: 9 },
        { label: '12个月', value: 12 }
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
        tip = '是否应邀加入该专栏？'
      } else {
        tip =
          '确认花费' +
          (this.detail_info.price === '0'
            ? '0'
            : this.keepThreeNum(
                (this.detail_info.price / 12) * this.detail_info.month
              )) +
          this.detail_info.currency +
          (this.subscribeType === 'again' ? '续订该专栏吗？' : '加入该专栏吗？')
      }
      return tip
    }
  },
  methods: {
    transformTime,
    async dropDown() {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const subscriptions_name = this.$route.query.subName
      if (this.isMyColumn) {
        if (this.inviteType === '邀请') {
          const loading = Loading.service({
            text: '加载中...',
            spinner: 'el-icon-loading ElementLoading',
            background: 'rgba(0, 0, 0, 0.2)'
          })
          const inviteCodeRes = await invite({
            id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
            token: getToken(),
            subscriptions_name
          })
          if (inviteCodeRes && inviteCodeRes.success === 'ok') {
            this.inviteCode = inviteCodeRes.data.invitedcode
            console.log(this.inviteCode)
          }
          if (loading) {
            loading.close()
          }
        }
      }
    },
    copyInviteCode(e) {
      const link =
        this.inviteType === '分享'
          ? window.location.href
          : window.location.href + '&inviteCode=' + this.inviteCode
      clipboard(link, e)
      this.$message.success('复制成功！')
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
      this.$EventBus.$emit('changeTab', { name: 'home' }, 0)
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
        this.$message.error('上传头像图片大小不能超过 2MB!')
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
        allow
      } = this.detail_info

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
        price: price + currency
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
      const loading = Loading.service({
        text: '加载中...',
        spinner: 'el-icon-loading ElementLoading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      const res = await subscriptions(params)

      if (res && res.success === 'ok') {
        this.$message.success('设置成功')
      } else {
        this.$message.error('设置失败！请重新设置')
      }
      if (loading) {
        loading.close()
      }
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
        this.$message.success('退出专栏成功')
      } else {
        this.$message.error(res.error)
      }
      this.removePopVisible = false

      this.$EventBus.$emit('changeTab', { name: 'home' }, 0)
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
      const loading = Loading.service({
        text: '加载中...',
        spinner: 'el-icon-loading ElementLoading',
        background: 'rgba(0, 0, 0, 0.2)'
      })

      if (this.subscribeType === 'again') {
        const res = await add2Column(params)

        if (res && res.success === 'ok') {
          const currentInfo = await this.getUser()

          this.$message.success('订阅成功')
        }
      } else {
        const res = await addColumn(params)

        if (res && res.success === 'ok') {
          this.$message.success('加入专栏成功')
          this.$router.go(-1)
        }
      }
      this.confirmVisible = false
      if (loading) {
        loading.close()
      }
    }
  },
  watch: {
    expires: {
      handler(newVal, oldVal) {},
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
::v-deep .type_select .el-input__suffix {
}
.back {
  margin-bottom: 20px;
}
.columnDetail_container {
  padding: 20px 50px;
  margin: 50px;
  border: 1px solid #e4e4e4;
  background-color: #fff;
  .subscriptions {
    border-bottom: 1px dashed #e4e4e4;
    padding: 10px 0;
    .members {
      color: #c0c0c0;
      margin-bottom: 20px;
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
          width: 30px;
          height: 30px;
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
    height: 200px;
    border-bottom: 1px dashed #e4e4e4;
    margin-bottom: 20px;
    .intro_title {
      margin-bottom: 20px;
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
      width: 200px;
      height: 80px;
      background-color: #54bcbd;
    }
    .remove_btn {
      width: 200px;
      height: 80px;
      background-color: #54bcbd;
    }
  }
}
</style>
