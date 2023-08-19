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
    <div class="text-range">{{ textLength }}/300</div>
  </div>
</template>

<script>
export default {
  name: 'ShortPost',
  props: {},
  data() {
    return {
      postText: '',
      textLength: 0,
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
              ]
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
        placeholder: '',
        theme: 'snow'
      }
    }
  },
  computed: {},

  created() {},
  mounted() {},
  methods: {
    resetText() {
      this.postText = ''
    },
    onEditorChange(e) {
      e.quill.deleteText(300, 1)
      if (this.postText == '') {
        this.$emit('change', 0)
      } else {
        this.textLength = e.quill.getLength() - 1
        // this.$emit('change', e.quill.getLength() - 1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.short_post {
  width: 100%;
}
.quill-editor .ql-container {
  border: none;
  font-family: PingFangSC-Regular;
  font-size: 14px !important;
}

.quill-editor .ql-container .ql-editor {
  padding: 0;
  color: #2f3034;
  line-height: 20px;
}
.ql-editor {
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
}
.text-range {
  font-size: 12px;
  color: #c5c6cb;
  height: 24px;
  line-height: 24px;
  text-align: right;
}
</style>
