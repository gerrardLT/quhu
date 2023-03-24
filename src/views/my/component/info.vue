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
          <img :src="imageUrl" alt="" />
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
        {{ userInfo.user_name }}
        <svg
          :style="{
            width: '20px',
            height: '20px'
          }"
          @click="changeSex"
        >
          <use :xlink:href="sexTypes[userInfo.sex]" rel="external nofollow" />
        </svg>
      </div>
      <div
        class="introduce"
        v-if="userInfo.profile !== 'none' || userInfo.profile !== ''"
      >
        <el-input
          v-model="profile"
          placeholder="请输入简介"
          maxlength="8"
          v-show="showIntro"
          class="profile"
          @blur="editIntro"
        ></el-input>
        <span v-show="!showIntro" class="intro-text">{{
          userInfo.profile
        }}</span>
        <span v-show="!profile" @click="changeStatus">请输入简介</span>
        <i
          v-show="!showIntro"
          class="el-icon-edit"
          style="margin-left: 5px"
          @click="changeStatus"
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
          @close="handleClose(item)"
          >{{ item }}</el-tag
        >
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button
          v-else-if="tagList.length < 4"
          class="button-new-tag"
          size="small"
          @click="showInput"
          >添加标签</el-button
        >
      </div>
    </div>
    <el-dialog title="性别选择" :visible.sync="sexVisible" width="30%" center>
      <el-radio v-model="sex" label="man">男</el-radio>
      <el-radio v-model="sex" label="woman">女</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="sexVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSex">确 定</el-button>
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
    }
  },
  data() {
    return {
      sexVisible: false,
      sex: '',
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
    changeSex() {
      if (this.sex === 'unknown') {
        this.sexVisible = true
      }
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
      if (res.success === 'ok') {
        this.sexVisible = false
        this.userInfo.sex = this.sex
        localStorage.setItem('quhu-userInfo', JSON.stringify(this.userInfo))
        this.$message.success('修改成功！')
      } else {
        this.sexVisible = false
        this.$message.success('修改失败！')
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
      if (res.success === 'ok') {
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
      if (inputValue) {
        this.tagList.push(inputValue)
        const res = await baseData({
          id:
            this.loginType === 'eth'
              ? this.userInfo.eth_account
              : this.userInfo.user,
          token: getToken(),
          tags: this.tagList
        })
        if (res.success === 'ok') {
          this.userInfo.tags = this.tagList
          localStorage.setItem('quhu-userInfo', JSON.stringify(this.userInfo))
          this.inputVisible = false
          this.inputValue = ''
        }
      }
    },
    async editIntro() {
      if (this.profile.trim() === '') {
        this.$message.error('请输入简介！')
        return
      } else {
        const res = await baseData({
          id:
            this.loginType === 'eth'
              ? this.userInfo.eth_account
              : this.userInfo.user,
          token: getToken(),
          profile: this.profile
        })
        if (res.success === 'ok') {
          this.userInfo.profile = this.profile
          localStorage.setItem('quhu-userInfo', JSON.stringify(this.userInfo))
          this.$message.success('修改成功')
          this.showIntro = !this.showIntro
        } else {
          this.$message.error('修改失败')
        }
      }
    },
    changeStatus() {
      this.showIntro = !this.showIntro
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
              actObj.postKey
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
                      if (res.success === 'ok') {
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
  height: 20px;
  line-height: 20px;
  padding-top: 0;
  padding-bottom: 0;
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
    // opacity: 0.26;
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.user_avatar {
  margin-top: 30px;
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
}
.introduce {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 12px;
}
.profile {
  max-width: 150px;
  cursor: pointer;
}
::v-deep .profile .el-input__inner {
  max-width: 150px;
  height: 20px;
}
.tags {
  margin-top: 5px;
}
.tag {
  margin-left: 20px;
  border-radius: 20px;
  width: 65px;
  height: 26px;
  text-align: center;
  font-size: 12px;
  line-height: 24px;
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
