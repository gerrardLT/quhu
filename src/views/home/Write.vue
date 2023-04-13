<template>
  <div class="write_container">
    <div class="write_header">
      <div class="title">
        <input
          type="text"
          v-model="titleText"
          class="titie_text"
          placeholder="请输入标题"
          maxlength="60"
          @input="inputTitle"
        />
        <div class="limit">标题字数：{{ titleLength }}/60</div>
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
    <div class="footer">
      <el-button @click="post" type="primary" class="btn">发布</el-button>
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
import { post } from '@/api/special/special'
import { getToken } from '@/utils/auth'
import { sha256 } from '@/utils/ecc/src/hash'
import Signature from '@/utils/ecc/src/signature'
import { actObj } from '@/utils/act'
import axios from 'axios'
import { Loading } from 'element-ui'
export default {
  name: 'Write',
  data() {
    return {
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
        placeholder: '请输入正文',
        theme: 'snow'
      }
    }
  },
  created() {},
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
    async onUploadHandler(e) {
      this.loadHandler(e.file, (v) => {
        this.fileList = this.fileList.concat([v])
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
      console.log(file)
      let dataUrl = ''
      if (file) {
        console.log('** image being loaded.. ----->', file)
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
      // console.log(this.fileList)
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const selectedColumn = this.$route.query.selectedColumn
      const loading = Loading.service({
        text: '加载中...',
        spinner: 'el-icon-loading ElementLoading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      let formatContent = ''
      const imgArr = this.content.split('src="https://cdn.steemitimages.com')
      console.log(imgArr)
      imgArr.forEach((item, i) => {
        if (i === 0) {
          formatContent += item
        } else {
          //   formatContent +=
          //     `preview=${i} class="img-container" width="300px" height="${
          //       (300 / this.fileList[i - 1].width) * this.fileList[i - 1].height
          //     }px"` +
          //     ' src="https://cdn.steemitimages.com' +
          //     item
          // }
          console.log(this.fileList[i - 1].width)
          if (this.fileList[i - 1].width > 600) {
            formatContent +=
              `preview=${i} class="img-container" width="600px" height="${
                (600 / this.fileList[i - 1].width) * this.fileList[i - 1].height
              }px"` +
              ' src="https://cdn.steemitimages.com' +
              item
          } else {
            formatContent +=
              `preview=${i} class="img-container" width="100%" height="100%"` +
              ' src="https://cdn.steemitimages.com' +
              item
          }
        }
      })
      console.log(formatContent)

      const res = await post({
        type: 'post',
        id: loginType === 'password' ? userInfo.user : userInfo.eth_account,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name: selectedColumn,
        permlink: '',
        title: this.titleText,
        body: formatContent
      })
      if (res && res.success === 'ok') {
        setTimeout(() => {
          this.$message.success('发文成功')
          this.$EventBus.$emit('changeTab', { name: 'home' }, 0)
        }, 1000)
      } else {
        this.$message.error('发文失败！ 请重新发文')
      }
      if (loading) {
        loading.close()
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .ql-container {
  min-height: 600px;
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
</style>
