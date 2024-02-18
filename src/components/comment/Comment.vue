<template>
  <div>
    <div class="reply_container">
      <el-avatar
        size="small"
        style="margin: 0 10px"
      >
        <img @click="goInfo(comment)" :src="comment.body.avatar ? comment.body.avatar : ''" class="reply_avatar" alt="">
    </el-avatar>

      <div
        style="flex: auto; width: 90%"
        class="reply_box"
        @mouseenter="showReply = true"
        @mouseleave="showReply = false"
      >
        <div>
          <span class="reply_author">{{ comment.body.author }}</span>
          <span>:</span>
          <span>
            <span style="white-space: pre-wrap; word-break: break-all">
              {{
                comment.json_metadata &&
                comment.json_metadata.encrypted &&
                selectedMenu !== 'short-square'
                  ? decrypt(comment.body.body, columnK, 'comment')
                  : comment.body.body
              }}
            </span>
          </span>
        </div>
        <div class="date">
          {{ transfromTimeZoom(comment.created) }}
        </div>
        <span class="reply-font" v-show="showReply" @click="doReply(comment)">
          <i :title="$t('comment.reply')" style="color: #838383" class="el-icon-chat-square"></i>
          <!-- {{ $t('comment.reply') }} -->
        </span>
        <!-- <span class="reply-font" v-else @click="cancel(comment)">
          <i class="el-icon-chat-square"></i>
          {{ $t('comment.cancel_reply') }}
        </span> -->
        <el-dialog
          :title="$t('comment.reply') + '@' + comment.body.author"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          width="40%"
          lock-scroll
          style="border-radius: 20px"
          :before-close="handleClose"
        >
          <div class="reply-content">
            <div>
              <textarea
                ref="suplyTextarea"
                class="el-textarea__inner"
                maxlength="200"
                style="
                  margin-top: 10px;
                  min-height: 68px;
                  font-size: 16px;
                  color: #2f3034;
                  font-weight: 400;
                  overflow-y: hidden;
                  height: 68px;
                  resize: none;
                "
                :placeholder="$t('home.say_something')"
                v-model="comment.reply"
                @input="editContent"
              ></textarea>
              <div class="picker_container">
                <span class="iconfont icon-biaoqing" @click="toggleEmojione">
                  <svg
                    :style="{
                      width: '20px',
                      height: '20px',
                      marginRight: '15px'
                    }"
                  >
                    <use :xlink:href="'#icon-emoji'" rel="external nofollow" />
                  </svg>
                </span>
                <Picker
                  v-show="showPicker"
                  :data="emojiIndex"
                  set="twitter"
                  @select="(e) => showEmoji(comment, e)"
                  class="my-picker"
                />
                <div style="margin: 10px 0">
                  <el-button
                    @click="doSend(comment)"
                    style="float: right; width: 80px; font-size: 14px"
                    class="suply_btn"
                    size="small"
                    plain
                    type="primary"
                    >{{ $t('comment.reply') }}</el-button
                  >
                </div>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
    <div
      v-if="comment.child && comment.child.length"
      style="padding: 10px 0 10px 40px"
    >
      <Comment
        style="margin: 0 auto"
        v-for="(childComment, childIndex) in comment.child"
        :key="childIndex"
        :comment="childComment"
        :commentindex="childIndex"
        :submit="doSend"
        :detail="detail"
        :columnK="columnK"
        :selectedMenu="selectedMenu"
      ></Comment>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { decrypt } from '@/utils/ascill'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
import data from 'emoji-mart-vue-fast/data/all.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
let emojiIndex = new EmojiIndex(data)
export default {
  name: 'Comment',
  props: {
    comment: {
      type: Object,
      required: true
    },
    submit: {
      type: Function,
      required: true
    },
    commentindex: {
      type: Number,
      required: true
    },
    columnK: {
      type: Number,
      required: true
    },
    selectedMenu: {
      type: String,
      required: true
    },
    detail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      roleType: '',
      replyMap: {},
      textareaMap: { initComment: '' },
      avatar: '',
      momentObj: {},
      updateTimeout: null,
      emojiIndex,
      showPicker: false,
      showReply: false,
      dialogVisible: false
    }
  },
  computed: {
    currentPath() {
      // console.log(this.$route)
      return this.$route.path
    },
    userAvatar() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')).avatar
    },
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo'))
    }
  },
  components: {
    Picker
  },
  mounted() {
    this.momentObj = moment()
    // this.roleType = this.$store.state.user.roleType
  },
  methods: {
    decrypt,
    errorHandler(){
      return true
    },
    goInfo(v) {
      // console.log(v)
      this.$router.push({
        path: '/information',
        query: {
          steemId: v.json_metadata.steem_id
        }
      })
    },
    editContent(){
      const textarea = this.$refs.suplyTextarea
      textarea.style.height = textarea.scrollHeight + 'px'
    },
    handleClose() {
      this.dialogVisible = false
    },
    showEmoji(comment, emoji) {
      console.log(comment.reply, emoji)
      comment.reply += emoji.native
     (comment, 'reply', comment.reply)
      this.$forceUpdate()
    },
    toggleEmojione() {
      this.showPicker = !this.showPicker
    },
    closeEmojione() {
      this.showPicker = false
    },
    transfromTimeZoom(v) {
      const dateStr = v
      const date = new Date(dateStr)
      const timeDiff = 8 * 60 * 60 * 1000 // 时差为8小时，转换为毫秒
      const dateInGMT8 = new Date(date.getTime() + timeDiff)
      return dateInGMT8.toLocaleString()
    },

    doReply(item) {
      console.log(item)
      this.$set(item, 'isEditReply', true)
      this.dialogVisible = true
      this.$forceUpdate()
    },
    cancel(item) {
      this.$set(item, 'isEditReply', false)
      this.$set(this, 'reply', '')
      this.showPicker = false
      this.dialogVisible = false
      this.$forceUpdate()
    },
    deleteComment(index) {
      this.$emit('deleteComment', index)
    },
    // 参数：评论内容,被评论用户id,父级评论id
    async doSend(item) {
      if (item.reply) {
        if (item) {
          this.$set(item, 'isEditReply', false)
        }
        await this.submit(item, this.detail)
        await this.cancel(item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-button--primary.is-plain {
  color: #fff !important;
  background: #ffbf6b;
  border: none;
}
::v-deep .el-button--primary.is-plain:focus,
.el-button--primary.is-plain:hover {
  color: #fff;
  background-color: #f57f59;
}
::v-deep .el-dialog {
  border-radius: 20px;
  font-size: 14px;
}
::v-deep .el-dialog .el-dialog__body{
  padding-top: 20px;
}
.picker_container {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  .my-picker {
    position: absolute;
    left: 0;
    top: 50px;
    z-index: 999;
  }
}
.reply_container {
  margin-top: 5px;
  display: flex;
  .reply_avatar{
    cursor: pointer;
    &:hover{
      background: rgba(0,0,0,0.1);
      transform: scale(1.1);
    }
  }
  .reply_box {
    position: relative;
    .reply-font {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-bottom: 5px;
      color: #000;
      cursor: pointer;
      display: inline-block;
    }
  }
  .reply_author {
    font-size: 14px;
    margin-right: 10px;
    color: $iconActiveColor;
  }
}
.icon-biaoqing svg{
  cursor: pointer;
  fill:$iconColor;
}
.icon-biaoqing svg:hover{
  fill:$iconActiveColor;
}
.date {
  font-size: 12px;
  color: $textColor;
  margin: 6px 0;
}
.deleteComment {
  font-size: 14px;
  color: #000;
  cursor: pointer;
}
.reply-content {
  font-size: 15px;
  position: relative;
}
</style>
