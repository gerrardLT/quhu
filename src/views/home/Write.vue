<template>
  <div class="write_container">
    <div class="write_header">
      <div class="title">
        <input
          type="text"
          v-model="titleText"
          class="titie_text"
          :placeholder="$t('write.title_tip')"
          maxlength="60"
          @input="inputTitle"
        />
        <div class="limit">
          {{ $t('write.title_length') }}：{{ titleLength }}/60
        </div>
      </div>
    </div>
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      spellcheck="false"
      class="quill-editor"
      @ready="onEditorReady()"
    >
    </quill-editor>
    <div
      style="
        color: #EE9611;
        font-size: 14px;
        text-align: right;
        margin-top: 10px;
      "
    >
      {{ $t('write.post_tip') }}
    </div>
    <div class="footer">
      <el-select v-model="articlePostType" @change="$forceUpdate()">
        <el-option :label="$t('write.public')" :value="$t('write.public')" />
        <el-option
          :label="$t('write.only_self')"
          :value="$t('write.only_self')"
        />
      </el-select>
      <el-button @click="post" type="primary" class="btn">{{
        $t('write.post')
      }}</el-button>
    </div>
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
import { post, getArticleDetail } from '@/api/special/special'
import { getToken } from '@/utils/auth'
import { sha256 } from '@/utils/ecc/src/hash'
import Signature from '@/utils/ecc/src/signature'
import { actObj } from '@/utils/act'
import axios from 'axios'
import { Loading } from 'element-ui'
import { decrypt } from '@/utils/ascill'

export default {
  name: 'Write',
  data() {
    return {
      articlePostType: this.$t('write.public'),
      fileUpload: {},
      fileList: [],
      actionUrl: 'https://steemitimages.com/',
      content: '',
      titleText: '',
      titleLength: 0,
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

              ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
              ['blockquote', 'code-block'], // 引用  代码块
              [{ header: 1 }, { header: 2 }], // 1、2 级标题
              [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
              [{ script: 'sub' }, { script: 'super' }], // 上标/下标
              [{ indent: '-1' }, { indent: '+1' }], // 缩进
              [{ direction: 'rtl' }], // 文本方向
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
              [{ align: [] }], // 对齐方式
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
              ],
              ['clean'] // 清除文本格式
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
        placeholder: this.$t('write.content_tip'),
        theme: 'snow'
      }
    }
  },
  async created() {
    const { author, permlink, columnK } = this.$route.query
    if (author && permlink && columnK) {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const res = await getArticleDetail({
        id: loginType === 'password' ? userInfo.user : userInfo.eth_account,
        jsonrpc: '2.0',
        method: 'bridge.get_discussion',
        params: { author, permlink }
      })
      if (res && res.result) {
        const obj = res.result[author + '/' + permlink]
        console.log(obj)
        this.content = decrypt(this.eval(obj.body).body, columnK)
        this.titleText = obj.title
      }
    }
  },
  mounted() {
    this.$refs.myQuillEditor.quill.root.addEventListener(
      'paste',
      (evt) => {
        if (
          evt.clipboardData &&
          evt.clipboardData.files &&
          evt.clipboardData.files.length
        ) {
          evt.preventDefault()
          const arr = []
          arr.forEach.call(evt.clipboardData.files, (file) => {
            if (!file.type.match(/^image\/(gif|jpe?g|a?png|bmp)/i)) {
              return
            }
            this.onUploadHandler({ file: file })
          })
        }
      },
      false //注意
    )
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo'))
    }
  },
  methods: {
    eval(fn) {
      const Fn = Function
      return new Fn('return ' + fn)()
    },
    async onUploadHandler(e) {
      this.loadHandler(e.file, (v) => {
        this.fileList = this.fileList.concat([v])
        console.log(this.fileList)
      })
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
    async loadHandler(file, cb) {
      // console.log(file)
      let dataUrl = ''
      if (file) {
        // console.log('** image being loaded.. ----->', file)
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
          if (file) {
            formData.append('file', file)
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
                cb({
                  url: imageUrl,
                  isShow: false,
                  width: width,
                  height: height
                })

                // 获取光标所在位置
                let quill = this.$refs.myQuillEditor.quill
                let length = quill.getSelection().index
                // 插入图片
                quill.insertEmbed(length, 'image', imageUrl)
                // 调整光标到最后
                quill.setSelection(length + 1)
              }
            )
          }
        })
        reader.readAsDataURL(file)
      }
    },
    onEditorReady() {},
    inputTitle() {
      this.titleLength = this.titleText.length
    },
    async post() {
      const { author, permlink, columnK } = this.$route.query
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const selectedColumn = this.$route.query.selectedColumn
      this.$loading.show()
      let formatContent = ''
      if (columnK) {
        formatContent = this.content
      } else {
        const imgArr = this.content.split('src="https://cdn.steemitimages.com')
        // console.log(imgArr)
        imgArr.forEach((item, i) => {
          if (i === 0) {
            formatContent += item
          } else {
            if (this.fileList.length > 0) {
              if (this.fileList[i - 1].width > 600) {
                formatContent +=
                  `preview=${
                    this.fileList[0].url
                  } class="img-container" width="600px" height="${
                    (600 / this.fileList[i - 1].width) *
                    this.fileList[i - 1].height
                  }px"` +
                  ' style="cursor:pointer;" src="https://cdn.steemitimages.com' +
                  item
              } else {
                formatContent +=
                  `preview=${this.fileList[0].url} style="cursor:pointer;" class="img-container" width="100%" height="100%"` +
                  ' src="https://cdn.steemitimages.com' +
                  item
              }
            } else {
              formatContent = this.content
            }
          }
        })
      }

      const res = await post({
        type: columnK ? 'edit' : 'post',
        id: loginType === 'password' ? userInfo.user : userInfo.eth_account,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name: selectedColumn,
        permlink: columnK ? [author, permlink] : '',
        title: this.titleText,
        public: this.articlePostType === this.$t('write.public') ? 'yes' : 'no',
        body: formatContent
      })
      if (res && res.success === 'ok') {
        // console.log(res)
        // this.$store.commit('GET_POST_ARTICLE', res.result)
        this.$bus.$emit('update-article', res.result)
        setTimeout(() => {
          if (columnK) {
            this.$message.success(this.$t('write.edit_success'))
          } else {
            this.$message.success(this.$t('write.post_success'))
          }
          this.$bus.$emit('changeTab', { name: 'home' }, 0)
        }, 1000)
      } else {
        this.$message.error(this.$t('write.post_fail'))
      }
      this.$loading.hide()
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .ql-container {
  min-height: 500px;
  background-color: #fff;
}
.title {
  color: #2f3034;
  text-align: left;
  font-size: 16px;
  height: 80px;
  font-weight: 700;
  display: flex;
  align-items: center;
  position: relative;
}
.limit {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  color: #c0c0c0;
  font-weight: 400;
  font-size: 12px;
}
.titie_text {
  font-family: PingFangSC-Medium;
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
  height: 40px;
  line-height: normal;
  padding: 0 0 0 10px;
}
.footer {
  display: flex;
  width: 100%;
  height: 50px;
  margin-top: 20px;

  justify-content: flex-end;
  .btn {
    background-color: #087790;
    width: 120px;
    border-radius: 10px;
    font-size: 16px;
  }
}
::v-deep .footer .el-input input {
  height: 50px;
  width: 120px;
  border: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 10px;
  background-color: #fff;
  border-radius: 5px;
}
::v-deep .footer .el-input__suffix{
  right: 10px;
}
::v-deep  .footer .btn.el-button{
  border-radius: 5px;
}
</style>
