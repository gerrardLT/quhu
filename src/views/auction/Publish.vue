<template>
  <div class="publish_container">
    <div class="flex margin-10">
      <span class="prefix">商品标题：</span>
      <el-input
        maxlength="20"
        placeholder="请输入商品标题"
        v-model="product.title"
      >
      </el-input>
    </div>
    <div class="flex margin-10">
      <span class="prefix">起拍价：</span>
      <el-input placeholder="请输入起拍价" v-model="product.starting_price">
      </el-input>
    </div>
    <div class="flex margin-10">
      <span class="prefix">最小加价幅度：</span>
      <el-input placeholder="请输入最小加价幅度" v-model="product.increase">
      </el-input>
    </div>
    <div class="flex margin-10">
      <span class="prefix">币种选择：</span>
      <el-select
        class="price_select"
        v-model="product.coins"
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
    <div class="flex margin-10">
      <span class="prefix">拍卖开始时间：</span>
      <el-date-picker
        v-model="product.start.start_date"
        type="date"
        :picker-options="pickerOptions"
        placeholder="选择日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="timestamp"
      >
      </el-date-picker>
      <span>&nbsp;-&nbsp;</span>
      <el-time-picker
        v-model="product.start.start_time"
        :picker-options="{
          selectableRange: '00:00:00 - 23:59:59'
        }"
        placeholder="选择时间"
        format="HH:mm:ss"
        value-format="timestamp"
      >
      </el-time-picker>
    </div>
    <div class="flex margin-10">
      <span class="prefix">拍卖结束时间：</span>
      <el-date-picker
        v-model="product.end.end_date"
        :picker-options="pickerOptions"
        type="date"
        placeholder="选择日期"
        format="yyyy 年 MM 月 dd 日"
        value-format="timestamp"
      >
      </el-date-picker>
      <span>&nbsp;-&nbsp;</span>
      <el-time-picker
        v-model="product.end.end_time"
        :picker-options="{
          selectableRange: '00:00:00 - 23:59:59'
        }"
        placeholder="选择时间"
        format="HH:mm:ss"
        value-format="timestamp"
      >
      </el-time-picker>
    </div>
    <div class="description">
      <div class="prefix" style="margin-bottom: 10px">拍卖商品描述：</div>
      <Editor ref="editor" :quillContent="product.body"></Editor>
    </div>

    <div style="margin-top: 20px">
      <div style="margin-bottom: 10px">商品首图：</div>
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :action="product.actionUrl"
        :http-request="onUploadHandler"
        v-loading="uploadLoading"
      >
        <img v-if="product.image" :src="product.image" class="avatar-img" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>

    <span slot="footer" class="footer">
      <el-button @click="reset">重置</el-button>
      <el-button class="sub_confirm" type="primary" @click="submit">{{
        $route.query.author ? '编辑' : '发布'
      }}</el-button>
    </span>
  </div>
</template>

<script>
import axios from 'axios'
import { sha256 } from '@/utils/ecc/src/hash'
import Signature from '@/utils/ecc/src/signature'
import { actObj } from '@/utils/act'
import { getToken } from '@/utils/auth'
import { decrypt } from '@/utils/ascill'
import { auction_post, get_auction_detail } from '@/api/auction/auction'
import { Loading } from 'element-ui'
import Editor from './components/editor.vue'
export default {
  name: 'publish',
  components: {
    Editor
  },
  data() {
    return {
      uploadLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      product: {
        title: '',
        start: {
          start_date: '',
          start_time: ''
        },
        end: {
          end_date: '',
          end_time: ''
        },
        coins: 'poys',
        actionUrl: 'https://steemitimages.com/',
        image: '',
        starting_price: '',
        increase: '',
        body: ''
      },

      payTypes: [
        {
          value: 'poys',
          label: 'poys'
        },
        {
          value: 'ofc',
          label: 'ofc'
        },
        {
          value: 'busd',
          label: 'busd'
        },
        {
          value: 'bnb',
          label: 'bnb'
        }
      ]
    }
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    }
  },
  created() {
    console.log(this.$route.query)
    if (this.$route.query.author) {
      this.getAuctionDetail()
    }
  },
  mounted() {},
  methods: {
    eval(fn) {
      const Fn = Function
      return new Fn('return ' + fn)()
    },
    disabledDate(time) {
      return time.getTime() < Date.now() - 8.64e7
    },
    getEditorContent() {
      console.log(this.$refs['editor'].content)
    },
    async getAuctionDetail() {
      const params = this.$route.query
      const res = await get_auction_detail({
        id: 1,
        jsonrpc: '2.0',
        method: 'call',
        params: [
          'database_api',
          'get_content',
          [params.author, params.permlink]
        ]
      })
      if (res && res.result) {
        const metadata = this.eval(res.result.json_metadata)
        console.log(metadata)
        const body = this.eval(res.result.body)
        this.product = {
          title: res.result.title,
          start: {
            start_date: this.getCurrentDateTimestamp(
              new Date(metadata.start_time * 1000)
            ),
            start_time: metadata.start_time * 1000
          },
          end: {
            end_date: this.getCurrentDateTimestamp(
              new Date(metadata.end_time * 1000)
            ),
            end_time: metadata.end_time * 1000
          },
          coins: metadata.coins,
          actionUrl: 'https://steemitimages.com/',
          image: metadata.image,
          starting_price: metadata.starting_price,
          increase: metadata.increase,
          body: body.body
        }
        this.$refs['editor'].content = body.body
      }
    },
    reset() {
      this.product = {
        title: '',
        start: {
          start_date: '',
          start_time: ''
        },
        end: {
          end_date: '',
          end_time: ''
        },
        coins: 'poys',
        actionUrl: 'https://steemitimages.com/',
        image: '',
        starting_price: '',
        increase: '',
        body: ''
      }
      this.$refs['editor'].content = ''
    },
    async submit() {
      console.log(this.product)
      const query = this.$route.query
      const loading = Loading.service({
        text: '加载中...',
        spinner: 'el-icon-loading ElementLoading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      let { title, coins, increase, starting_price, image, start, end } =
        this.product
      const reg = /^[1-9]\d*$/

      let startTime = Math.round(
        (start.start_date +
          start.start_time -
          this.getCurrentDateTimestamp(new Date())) /
          1000
      )

      //   console.log(startTime)
      let endTime = Math.round(
        (end.end_date +
          end.end_time -
          this.getCurrentDateTimestamp(new Date())) /
          1000
      )
      //   console.log(endTime)
      if (!title.trim()) {
        this.$message.warning('请输入商品名')
        return
      }
      if (!starting_price) {
        this.$message.warning('请输入起拍价')
        return
      }
      if (!increase) {
        this.$message.warning('请输入加价幅度')
        return
      }
      if (!coins) {
        this.$message.warning('请选择币种')
        return
      }
      if (!start.start_date) {
        this.$message.warning('请选择开始日期')
        return
      }
      if (!start.start_time) {
        this.$message.warning('请选择开始时间')
        return
      }
      if (!end.end_date) {
        this.$message.warning('请选择结束日期')
        return
      }
      if (!end.end_time) {
        this.$message.warning('请选择结束时间')
        return
      }
      if (!image) {
        this.$message.warning('请上传图片')
        return
      }
      //   console.log(Number(this.starting_price), Number(this.increase))
      if (!reg.test(Number(starting_price))) {
        this.$message.warning('请输入数字')
        return
      }
      if (!reg.test(Number(increase))) {
        this.$message.warning('请输入数字')
        return
      }
      const params = {
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        title,
        body: this.$refs['editor'].content,
        start_time: startTime,
        end_time: endTime,
        coins,
        increase,
        starting_price,
        image
      }
      if (query.author) {
        params.permlink = [query.author, query.permlink]
      }
      console.log(params)
      const res = await auction_post(params)
      if (res && res.success === 'ok') {
        this.$message.success('发布成功！')
        this.$router.push('/myAuction')
      }
      if (loading) {
        loading.close()
      }
    },
    getCurrentDateTimestamp(currentDate) {
      let year = currentDate.getFullYear()
      let month = currentDate.getMonth() + 1 //月份从0开始，所以要加1
      let day = currentDate.getDate()

      // 格式化日期
      let formattedDate = year + '-' + month + '-' + day
      console.log(formattedDate)
      // 转换为时间戳
      let timestamp = new Date(formattedDate).getTime()
      return timestamp
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
      this.uploadLoading = true
      console.log(e)
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
                    self.product.image = res.data.url
                    this.uploadLoading = false
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

<style scoped lang="scss">
.publish_container {
  margin-left: 40px;
}
.flex {
  display: flex;
  align-items: center;
}
.margin-10 {
  margin-bottom: 10px;
}
.prefix {
  display: inline-block;
  width: 120px;
  min-width: 120px;
}
.avatar-uploader {
  width: 180px;
  height: 180px;
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
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 180px;
  line-height: 180px;
  text-align: center;
}
.avatar-img {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
.footer {
  margin-top: 50px;
  display: flex;
  justify-content: space-evenly;
}
</style>
