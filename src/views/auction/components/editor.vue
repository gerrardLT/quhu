<template>
  <div class="write_container">
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      spellcheck="false"
      class="quill-editor"
    >
    </quill-editor>
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
import { sha256 } from '@/utils/ecc/src/hash'
import Signature from '@/utils/ecc/src/signature'
import { actObj } from '@/utils/act'
import axios from 'axios'
import { decrypt } from '@/utils/ascill'

export default {
  name: 'Write',
  props: {
    quillContent: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileUpload: {},
      fileList: [],
      actionUrl: 'https://steemitimages.com/',
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
        placeholder: this.$t('publish.content_tip'),
        theme: 'snow'
      }
    }
  },
  async created() {},
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
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .ql-container {
  min-height: 300px;
  background-color: #fff;
}
</style>
