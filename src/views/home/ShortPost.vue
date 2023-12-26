<template>
  <div class="short_post">
    <div
      style="
        width: calc(100% - 40px);
        min-height: 110px;
        margin: 5px 0px;
        max-height: 497px;
      "
    >
      <span class="iconfont icon-biaoqing" ref="biaoqing" @click="toggleEmojione()">
        <svg>
          <use :xlink:href="'#icon-emoji'" rel="external nofollow" />
        </svg>
      </span>

      <Picker
        ref="short_quill"
        v-show="showPicker"
        :data="emojiIndex"
        set="twitter"
        @select="showEmoji"
        class="my-picker"
      />
      <quill-editor
        v-model="postText"
        ref="myQuillEditor"
        :options="editorOption"
        class="quill-editor"
        spellcheck="true"
        @change="onEditorChange($event)"
      >
      </quill-editor>
    </div>
    <div class="text-range">{{ textLength }}/200</div>
    <div class="publish_tip">
      {{ $t('home.publish_tip') }}
    </div>
  </div>
</template>

<script>
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
import data from 'emoji-mart-vue-fast/data/all.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
let emojiIndex = new EmojiIndex(data)
export default {
  name: 'ShortPost',
  components: {
    Picker
  },
  props: {},
  data() {
    return {
      emojiIndex,
      showPicker: false,
      postText: '',
      textLength: 0,
      editorOption: {
        modules: {
          // 'emoji-toolbar': true,
          // 'emoji-shortname': true,
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
              // ['emoji'],
              ['image'],
              ['link']
            ],
            handlers: {
              image: (value) => {
                if (value) {
                  this.$emit('upload')
                } else {
                  this.$parent.quill.format('image', false)
                }
              }
            }
          }
        },
        placeholder: this.$t('home.short_placeholder'),
        theme: 'snow'
      }
    }
  },
  computed: {},

  created() {},
  mounted() {},
  methods: {
    handleKeyDown(e){
      console.log(e)
    },
    showEmoji(emoji) {
      const quill = this.$refs.myQuillEditor.quill;
      quill.insertText(this.textLength, emoji.native);
    },
    toggleEmojione() {
      this.showPicker = !this.showPicker
    },
    closeEmojione() {
      if(this.showPicker){
        this.showPicker = false
      }

    },
    resetText() {
      this.postText = ''
    },
    onEditorChange(e) {
      e.quill.deleteText(200, 1)
      if (this.postText == '') {
        this.textLength = e.quill.getLength() - 1
        this.$emit('change', 0)
      } else {
        this.textLength = e.quill.getLength() - 1
      }
    }
  }
}
</script>

<style scoped lang="scss">
.short_post {
  width: calc(100% - 40px);
}
::v-deep .quill-editor .ql-container {
  border: none;
  font-family: PingFangSC-Regular;
  font-size: 14px !important;
  height: 50px;
}

::v-deep .quill-editor .ql-container .ql-editor {
  padding: 0;
  color: #2f3034;
  line-height: 20px;
}
::v-deep .ql-editor {
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
  padding-top: 0;
}

::v-deep .ql-toolbar.ql-snow {
  position: absolute;
  border: none;
  bottom: -120px;
  left: 30px;
  z-index: 999;
}
::v-deep .ql-container.ql-snow {
  border: none;
}
::v-deep .ql-snow.ql-toolbar button {
  width: 32px;
  height: 32px;
}
::v-deep .ql-snow.ql-toolbar button:hover .ql-stroke {
  stroke: $iconActiveColor;
}
::v-deep .ql-snow.ql-toolbar button:hover .ql-fill {
  fill: $iconActiveColor;
}
::v-deep .ql-snow .ql-stroke {
  stroke: $iconColor;
  stroke-width: 1;
}

::v-deep .ql-snow .ql-fill {
  fill: $iconColor;
}
.icon-biaoqing svg {
  fill: #838383;
  width: 20px;
  height: 20px;
  margin-right: 15px;
}
.icon-biaoqing svg:hover {
  fill: $iconActiveColor;
}

.icon-biaoqing {
  position: absolute;
  bottom: -110px;
  left: 0;
  z-index: 999;
  cursor: pointer;
}

.my-picker {
  position: absolute;
  left: -20px;
  top: 225px;
  z-index: 999;
  width: 200px;
  height: 400px;
}
::v-deep .ql-editor {
  min-height: 120px;
  line-height: 22px !important;
}
.text-range {
  font-size: 12px;
  color: #c5c6cb;
  height: 24px;
  line-height: 24px;
  text-align: right;
  position: absolute;
  right: 0;
  bottom: 0;
}
.publish_tip {
  text-align: right;
  position: absolute;
  right: 0;
  bottom: -35px;
  color: #c0c0c0;
  font-size: 12px;
}
</style>
