<template>
  <div>
    <div style="margin-top: 27px; display: flex">
      <el-avatar
        size="large"
        style="margin: 0 10px"
        :src="comment.body.avatar ? comment.body.avatar : ''"
      ></el-avatar>

      <div style="flex: auto">
        <div style="display: inline-block">
          <strong style="font-size: 16px; margin-right: 10px">{{
            comment.body.author
          }}</strong>
        </div>
        <div class="date">
          {{ transfromTimeZoom(comment.created) }}
        </div>

        <div class="reply-content">
          <div>
            <div>
              {{
                comment.json_metadata &&
                comment.json_metadata.encrypted &&
                selectedMenu !== 'short-square'
                  ? decrypt(comment.body.body, columnK)
                  : comment.body.body
              }}
            </div>
            <div
              class="reply-font"
              v-if="!comment.isEditReply"
              @click="doReply(comment)"
            >
              <i class="el-icon-chat-square"></i>
              {{ $t('comment.reply') }}
            </div>
            <div class="reply-font" v-else @click="cancel(comment)">
              <i class="el-icon-chat-square"></i>
              {{ $t('comment.cancel_reply') }}
            </div>
          </div>
          <div v-if="comment.isEditReply">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              :placeholder="$t('home.say_something')"
              v-model.lazy="comment.reply"
            ></el-input>
            <div>
              <div style="margin: 10px 0">
                <!-- <el-button @click="pBodyStatus(index)">Emoji表情</el-button> -->
                <el-button
                  @click="doSend(comment, commentindex)"
                  style="float: right"
                  plain
                  type="primary"
                  >{{ $t('home.send') }}</el-button
                >
              </div>
            </div>
          </div>
        </div>
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
        :columnK="columnK"
        :selectedMenu="selectedMenu"
      ></Comment>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { decrypt } from '@/utils/ascill'
export default {
  name: 'Comment',
  props: {
    label: {
      type: String,
      default: '作者'
    },
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
    }
  },
  data() {
    return {
      roleType: '',
      replyMap: {},
      pBodyMap: { initComment: false },
      textareaMap: { initComment: '' },
      avatar: '',
      momentObj: {},
      updateTimeout: null
    }
  },
  components: {},
  mounted() {
    this.momentObj = moment()
    // this.roleType = this.$store.state.user.roleType
  },
  methods: {
    decrypt,
    // input(v) {
    //   console.log(v)
    //   if (this.updateTimeout) {
    //     clearTimeout(this.updateTimeout)
    //   }

    //   // 设置新的延迟更新，500毫秒后更新数据
    //   this.updateTimeout = setTimeout(() => {
    //     this.inputValue = v
    //   }, 500)
    // },
    transfromTimeZoom(v) {
      const dateStr = v
      const date = new Date(dateStr)
      const timeDiff = 8 * 60 * 60 * 1000 // 时差为8小时，转换为毫秒
      const dateInGMT8 = new Date(date.getTime() + timeDiff)
      return dateInGMT8.toLocaleString()
    },

    doReply(item) {
      this.$set(item, 'isEditReply', true)
    },
    cancel(item) {
      this.$set(item, 'isEditReply', false)
      this.$set(this, 'reply', '')
    },
    deleteComment(index) {
      this.$emit('deleteComment', index)
    },
    // 参数：评论内容,被评论用户id,父级评论id
    doSend(item, i) {
      // this.$emit('submit', item, i, this.detail, this.textareaMap[key])
      this.submit(item, i)
      if (item) {
        this.$set(item, 'isEditReply', false)
        // this.$set(item, 'reply', '')
      }
    },

    pBodyStatus(key) {
      this.$set(this.pBodyMap, key, !this.pBodyMap[key])
    }
  }
}
</script>

<style lang="scss" scoped>
.date {
  font-size: 12px;
  color: grey;
  margin: 6px 0;
}
.deleteComment {
  font-size: 14px;
  color: rgb(109, 88, 88);
  cursor: pointer;
}
.reply-content {
  font-size: 15px;
  .reply-font {
    margin-bottom: 5px;
    color: grey;
    cursor: pointer;
    display: inline-block;
    float: right;
  }
}
</style>
