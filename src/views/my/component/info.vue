<template>
  <div>
    <div class="right_top">
    
      <div class="user_avatar">
        <el-upload
          :action="actionUrl"
          ref="upload"
          class="avatar-uploader"
          :show-file-list="false"
          :http-request="onUploadHandler"
        >
          <img :src="imageUrl" alt="" :title="$t('info.change_avatar')" />
        </el-upload>
        <div class="camera">
          <svg
            :style="{
              width: '10px',
              height: '10px'
            }"
          >
            <use :xlink:href="'#icon-camera'" rel="external nofollow" />
          </svg>
        </div>
      </div>

      <div class="nick_name">
        <el-input
          v-model="user_name"
          :placeholder="$t('info.nickname_change_tip')"
          maxlength="60"
          v-if="showNick"
          class="profile"
          @blur="editNick"
        ></el-input>
        <span
          v-else
          @click="showNickInput"
          :title="$t('info.nickname_change_tip')"
          class="text"
        >
          {{ userInfo.user_name }}</span
        >
        <span v-show="!userInfo.user_name" @click="showNickInput">{{
          $t('info.nickname_tip')
        }}</span>
      </div>
      <div class="steem_id">
        <span>{{ $t('info.user_id') }}：{{ userInfo.steem_id }}</span
        ><i
          style="margin-left: 10px"
          class="el-icon-copy-document"
          @click="copy(userInfo.steem_id, $event)"
        ></i>
      </div>
      <div
        class="introduce"
        v-if="userInfo.profile !== 'none' || userInfo.profile !== ''"
      >
        <el-input
          v-model="profile"
          :placeholder="$t('info.intro_tip')"
          maxlength="60"
          v-show="showIntro"
          class="profile"
          @blur="editIntro"
          ref="intro_input"
        ></el-input>
        <span v-show="!showIntro" class="intro-text">{{
          userInfo.profile
        }}</span>
        <span v-show="!userInfo.profile && !showIntro" @click="changeStatus">{{
          $t('info.intro_tip')
        }}</span>
        <i
          v-show="!showIntro"
          class="el-icon-edit"
          style="margin-left: 5px; cursor: pointer"
          @click="changeStatus"
          :title="$t('info.intro_change_tip')"
        ></i>
      </div>
      <div class="tags">
        <el-tag
          effect="plain"
          class="tag"
          :type="tagTypes[i]"
          v-for="(item, i) in tagList"
          :key="i"
          closable
          :title="item"
          @close="handleClose(item)"
          >{{ item }}</el-tag
        >
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          maxlength="12"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button
          v-else-if="tagList.length < 4"
          class="button-new-tag"
          size="small"
          @click="showInput"
          >{{ $t('info.add_label') }}</el-button
        >
      </div>
    </div>
    <el-dialog
      :title="$t('info.select_gender')"
      :visible.sync="sexVisible"
      :close-on-click-modal="false"
      width="30%"
      center
    >
      <el-radio v-model="sex" label="man">{{ $t('info.male') }}</el-radio>
      <el-radio v-model="sex" label="woman">{{ $t('info.female') }}</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sexVisible = false">{{
          $t('info.cancel')
        }}</el-button>
        <el-button type="primary" @click="confirmSex">{{
          $t('info.confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { sha256 } from '@/utils/ecc/src/hash'
import Signature from '@/utils/ecc/src/signature'
import { actObj } from '@/utils/act'
const defaultAvatar = require(`../../../assets/defaultAvatarUrl.png`)
import { baseData } from '@/api/user/user'
import { getToken } from '@/utils/auth'
import { cloneDeep } from 'lodash'
import clipboard from '@/utils/clipboard'
import { decrypt } from '@/utils/ascill'
export default {
  name: 'Introduce',
  async created() {
    const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
    const loginType = localStorage.getItem('login-type')
    const avatar = userInfo.avatar
    this.imageUrl = this.judgeNone(avatar) ? defaultAvatar : avatar
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    },
    tagList() {
      return this.userInfo.tags || []
    },
    specialList() {
      const arr = []
      this.userInfo.article.forEach((e, i) => {
        if (i < 6) {
          arr.push({
            title: e.name,
            image: e.image,
            member: e.member
          })
        }
      })
      return arr
    },
    favorites() {
      return cloneDeep(this.userInfo.article).splice(0, 6)
    },
    steemId() {
      return this.$store.state.userInfo.steem_id
    }
  },
  data() {
    return {
      showNick: false,
      user_name: '',
      sexVisible: false,
      sex: 'unknown',
      inputVisible: false,
      inputValue: '',
      profile: '',
      showIntro: false,
      actionUrl: '',
      imageUrl: defaultAvatar,
      tagTypes: ['success', 'info', 'warning', 'danger'],
      sexTypes: {
        man: '#icon-if-male',
        woman: '#icon-female',
        unknown: '#icon-xingbie'
      }
    }
  },
  methods: {
    copy(key, e) {
      clipboard(key, e)
    },
    changeSex() {
      console.log(this.sex)
      if (this.sex === 'unknown') {
        this.sexVisible = true
      }
    },
    async editNick() {
      if (this.user_name.trim() === '') {
        this.$message.error(this.$t('info.nickname_tip'))
        return
      } else {
        const res = await baseData({
          id:
            this.loginType === 'eth'
              ? this.userInfo.eth_account
              : this.userInfo.user,
          token: getToken(),
          user_name: this.user_name
        })
        if (res && res.success === 'ok') {
          this.userInfo.user_name = this.user_name
          localStorage.setItem('quhu-userInfo', JSON.stringify(this.userInfo))
          this.$message.success(this.$t('info.change_success'))
          this.showNick = !this.showNick
        } else {
          this.$message.error(this.$t('info.change_fail'))
        }
        this.user_name = ''
      }
    },
    async showNickInput() {
      this.showNick = true
      this.user_name = this.userInfo.user_name
    },
    async confirmSex() {
      console.log(this.sex)
      const res = await baseData({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        sex: this.sex
      })
      if (res && res.success === 'ok') {
        this.sexVisible = false
        this.userInfo.sex = this.sex
        localStorage.setItem('quhu-userInfo', JSON.stringify(this.userInfo))
        this.$message.success(this.$t('info.change_success'))
      } else {
        this.sexVisible = false
        this.$message.success(this.$t('info.change_fail'))
      }
    },
    async handleClose(tag) {
      //   const arr = cloneDeep(this.tagList)
      this.tagList.splice(this.tagList.indexOf(tag), 1)
      this.$forceUpdate()
      const res = await baseData({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        tags: this.tagList
      })
      if (res && res.success === 'ok') {
        this.userInfo.tags = this.tagList
        localStorage.setItem('quhu-userInfo', JSON.stringify(this.userInfo))
      }
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
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
        const res = await baseData({
          id:
            this.loginType === 'eth'
              ? this.userInfo.eth_account
              : this.userInfo.user,
          token: getToken(),
          tags: this.tagList.concat(arr)
        })
        if (res && res.success === 'ok') {
          this.tagList.push(inputValue)
          this.userInfo.tags = this.tagList
          localStorage.setItem('quhu-userInfo', JSON.stringify(this.userInfo))
          this.inputVisible = false
          this.inputValue = ''
        } else {
          this.inputVisible = false
          this.inputValue = ''
        }
      }else{
        this.inputVisible = false
          this.inputValue = ''
      }
    },
    async editIntro() {
      
      if (this.profile.trim() === '') {
        this.userInfo.profile = this.profile
        localStorage.setItem('quhu-userInfo', JSON.stringify(this.userInfo))
        this.showIntro = !this.showIntro
      } else {
        const res = await baseData({
          id:
            this.loginType === 'eth'
              ? this.userInfo.eth_account
              : this.userInfo.user,
          token: getToken(),
          profile: this.profile
        })
        if (res && res.success === 'ok') {
          this.userInfo.profile = this.profile
          localStorage.setItem('quhu-userInfo', JSON.stringify(this.userInfo))
          this.$message.success(this.$t('info.change_success'))
          this.showIntro = !this.showIntro
        } else {
          this.$message.error(this.$t('info.change_fail'))
        }
      }
    },
    changeStatus() {

      this.showIntro = !this.showIntro
      this.$nextTick(() => {
      this.$refs.intro_input.focus()
    })
    },
    judgeNone(v) {
      return v === 'none'
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
      // const isJPG = file.type === 'image/jpeg'
      console.log(e)
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = localStorage.getItem('login-type')
      const isLt2M = e.file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error(this.$t('info.avatar_upload_tip'))
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
                    self.imageUrl = res.data.url
                    userInfo.avatar = self.imageUrl
                    baseData({
                      id:
                        loginType === 'eth'
                          ? userInfo.eth_account
                          : userInfo.user,
                      token: getToken(),
                      image: res.data.url
                    }).then((res) => {
                      console.log(res)
                      if (res && res.success === 'ok') {
                        localStorage.setItem(
                          'quhu-userInfo',
                          JSON.stringify(userInfo)
                        )
                      }
                    })
                  }
                }
              )
            }
          })
          reader.readAsDataURL(e.file)
        }
      }
    }
  },

  watch: {
    tagList: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
.button-new-tag {
  margin-left: 10px;
  height: 26px;
  line-height: 26px;
  padding-top: 0;
  padding-bottom: 0;
  border-radius: 20px;
}
::v-deep .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
  .el-input__inner {
    height: 20px;
  }
}
.report {
  margin-top: 10px;
  width: calc(25% - 20px);
  margin-left: 20px;
  background-color: #fff;
  padding: 10px 20px;
  font-size: 14px;
  height: 400px;
  .report_content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 19px);
  }
}
.pointer {
  cursor: pointer;
}

.right_container {
  padding: 20px;
  .right_top {
    // width: 100%;
    height: 200px;
    background-color: #bfd2d2;
    position: relative;
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

  }
}
.user_avatar {
  margin-top: 25px;
  margin-bottom: 5px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
}
.user_avatar img {
  width: 60px;
  height: 60px;
  vertical-align: middle;
  border-radius: 50%;
  object-fit: cover;
}
.steem_id {
  font-size: 12px;
}
.box-card {
  margin-top: 10px;
  min-height: 400px;
}
.camera {
  width: 15px;
  height: 15px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  right: -2px;
  bottom: -5px;
  text-align: center;
  line-height: 15px;
}
.nick_name {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  .text {
    cursor: pointer;
  }
}
.introduce {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 12px;
}
.profile {
  max-width: 200px;
  cursor: pointer;
}
.intro-text {
  display: inline-block;
  max-width: 200px;
  word-break: break-word;
}
::v-deep .profile .el-input__inner {
  max-width: 150px;
  height: 20px;
}
.tags {
  margin-top: 5px;
  display: flex;
}
.tag {
  margin-left: 20px;
  border-radius: 20px;
  width: 100px;
  height: 26px;
  text-align: center;
  font-size: 12px;
  line-height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.hd-box {
  width: 100%;
  height: auto;
  background: #fff;
}

.hd-top {
  height: 48px;
  padding: 10px 16px 0 0;
}

.green-bnt {
  height: 24px;
  padding: 4px 8px;
  border-radius: 12px;
  background: #edfcf8;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: 0px;
  color: #55b396;
}

.rz {
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.ml-1 {
  margin-left: 5px;
}

.icon {
  width: 24px;
  height: 24px;
}

.tip {
  width: 24px;
  height: 24px;
  /* #ifdef MP-WEIXIN */
  width: 18px;
  height: 18px;
  margin-right: 8px;
  /* #endif */
}

/* hd-user */
.hd-user {
  width: 100%;
  padding: 16px 16px 24px 16px;
}

.stamp {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  border: 1px solid #eeeeee;
  margin-right: 15px;
}

.name {
  font-family: PingFangSC-Semibold;
  font-size: 17px;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: 0px;
  color: rgba(0, 0, 0, 0.8);
}

.label {
  color: #b7b7b7;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: 1px;
  margin-left: 5px;
  color: rgba(0, 0, 0, 0.3);
}

/* hd-bottom */
.hd-bottom {
  margin-top: 24px;
  padding: 0 24px;
}

.line {
  height: 12px;
  background: #f2f8f8;
}

.ml {
  margin-left: 16px;
}
</style>
