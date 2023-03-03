<template>
  <div class="user_page">
    <div class="user_info">
      <el-row type="flex" class="row-bg avatar_container">
        <el-col :span="4" class="user_avatar">
          <el-upload
            :action="actionUrl"
            ref="upload"
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="onUploadHandler"
          >
            <img :src="imageUrl" alt="" />
          </el-upload>
        </el-col>
        <el-col class="nick_name" :span="8">
          {{ userInfo.user_name === 'none' ? '' : userInfo.user_name }}
        </el-col>
      </el-row>
      <el-row type="flex" class="user_history row-bg pointer">
        <el-col :span="6">
          <div @click="goDetail('history')">
            <svg style="width: 20px; height: 20px">
              <use xlink:href="#icon-foot" rel="external nofollow" />
            </svg>
            <span class="history_text">足迹</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="goDetail('interact')">
            <svg style="width: 20px; height: 20px">
              <use xlink:href="#icon-askAnswer" rel="external nofollow" />
            </svg>
            <span class="history_text">问答</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="goDetail('collect')">
            <svg style="width: 20px; height: 20px">
              <use xlink:href="#icon-collect" rel="external nofollow" />
            </svg>
            <span class="history_text">收藏</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div @click="goDetail('mySpecial')">
            <svg style="width: 20px; height: 20px">
              <use xlink:href="#icon-special" rel="external nofollow" />
            </svg>
            <span class="history_text">专栏</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-for="(item, index) in list" :key="index">
      <Bar :info="item" />
    </div>
    <div class="line"></div>
    <div v-for="item1 in list2" :key="item1.id">
      <Bar :info="item1" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Bar from '@/components/setting-bar/setting-bar.vue'
import axios from 'axios'
import { sha256 } from '@/utils/ecc/src/hash'
import Signature from '@/utils/ecc/src/signature'
import { actObj } from '@/utils/act'
const defaultAvatar = require(`../../assets/defaultAvatarUrl.png`)
import { changeAvatar } from '@/api/user/user'
import { getToken } from '@/utils/auth'
export default {
  name: 'My',
  components: {
    Bar
  },
  created() {
    console.log(this.$route)
    const avatar = JSON.parse(localStorage.getItem('quhu-userInfo')).avatar
    this.imageUrl = this.judgeNone(avatar) ? defaultAvatar : avatar
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    }
  },
  data() {
    return {
      actionUrl: '',
      imageUrl: defaultAvatar,
      list: [
        {
          id: 1,
          icon: 'xingqiubi',
          title: '活跃度',
          url: '/activation',
          showNumber: false
        },
        {
          id: 2,
          icon: 'yqm',
          title: 'token',
          url: '/voucher',
          showNumber: true
        },
        {
          id: 3,
          icon: 'yqm',
          title: '邀请好友',
          url: '/invite',
          showNumber: true
        }
      ],
      list2: [
        {
          id: 4,
          icon: 'change',
          title: '回收站',
          url: '/invite',
          showNumber: false
        },
        {
          id: 5,
          icon: 'kefu',
          title: '帮助与客服',
          url: '/invite',
          showNumber: false
        },
        {
          id: 6,
          icon: 'set',
          title: '设置',
          url: '/setting',
          showNumber: false
        }
      ]
    }
  },
  methods: {
    judgeNone(v) {
      return v === 'none'
    },
    login() {},
    goDetail(url) {
      this.$router.push('/' + url)
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
                    changeAvatar({
                      id:
                        loginType === 'eth'
                          ? userInfo.eth_account
                          : userInfo.user,
                      token: getToken(),
                      user_name: userInfo.user_name,
                      steem_id: userInfo.steem_id,
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
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.user_page {
  width: 100%;
  height: 100vh;
  background: #f2f8f8 !important;
}

.user_info {
  height: 200px;
  padding: 16px 20px 16px 28px;
}
.avatar_container {
  padding: 20px 0;
}
.user_avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.user_avatar img {
  width: 60px;
  height: 60px;
  vertical-align: middle;
  border-radius: 50%;
  object-fit: cover;
}
.nick_name {
  padding-left: 20px;
  display: inline-block;
  line-height: 60px;
  text-align: left;
}
.user_history {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.user_history svg {
  /* width: 30px;
  height: 30px; */
  vertical-align: middle;
}
.user_history .history_text {
  margin-left: 5px;
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
