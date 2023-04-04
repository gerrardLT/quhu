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
          {{ formatDate(comment.created) }}
        </div>

        <div class="reply-content">
          <div>
            <div>{{ comment.body.body }}</div>
            <!-- <el-popconfirm
                title="确定要删除该评论吗？"
                @confirm="deleteComment(index)"
              >
                <span
                  slot="reference"
                  class="deleteComment"
                  v-show="
                    item.username === $store.state.user.name ||
                    roleType === 'admin'
                  "
                  ><i class="el-icon-delete" /> 删除</span
                >
              </el-popconfirm> -->
            <div
              class="reply-font"
              v-if="!comment.isEditReply"
              @click="doReply(comment)"
            >
              <i class="el-icon-chat-square"></i>
              回复
            </div>
            <div class="reply-font" v-else @click="cancel(comment)">
              <i class="el-icon-chat-square"></i>
              取消回复
            </div>
          </div>
          <div v-if="comment.isEditReply">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="说点什么吧"
              v-model="comment.reply"
            ></el-input>

            <div>
              <div style="margin: 10px 0">
                <!-- <el-button @click="pBodyStatus(index)">Emoji表情</el-button> -->
                <el-button
                  @click="doSend(comment, commentindex, detail)"
                  style="float: right"
                  plain
                  type="primary"
                  >发送</el-button
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
        :detail="detail"
      ></Comment>
    </div>
    <!-- <div
        style="padding: 10px 0 10px 40px"
        v-for="(ritem, jndex) in item.children"
        :key="jndex"
      >
        <div style="display: flex">
          <el-avatar
            size="large"
            style="margin: 0 10px"
            :src="ritem.body.avatar ? ritem.body.avatar : avatar"
          ></el-avatar>

          <div style="flex: auto">
            <div style="display: inline-block">
              <strong style="font-size: 16px; margin-right: 10px">{{
                ritem.body.author
              }}</strong>
            </div>
            <div class="date">{{ ritem.created.replace('T', '  ') }}</div>

            <div class="reply-content">

              <div>
                <div>{{ ritem.body.body }}</div>

                <div
                  class="reply-font"
                  v-if="!ritem.isEditReply"
                  @click="doReply(ritem)"
                >
                  <i class="el-icon-chat-square"></i>
                  回复
                </div>
                <div class="reply-font" v-else @click="cancel(ritem)">
                  <i class="el-icon-chat-square"></i>
                  取消回复
                </div>
              </div>

              <div v-if="ritem.isEditReply">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: minRows, maxRows: maxRows }"
                  :placeholder="placeholder"
                  v-model="ritem.reply"
                ></el-input>

                <div>
                  <div style="margin: 10px 0">

                    <el-button
                      @click="doSend('initComment', ritem, jndex)"
                      style="float: right"
                      plain
                      type="primary"
                      >发送</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
  </div>
</template>

<script>
import moment from 'moment'
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
    detail: {
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
    }
  },
  data() {
    return {
      roleType: '',
      replyMap: {},
      pBodyMap: { initComment: false },
      textareaMap: { initComment: '' },
      avatar: '',
      momentObj: {}
    }
  },
  components: {},
  mounted() {
    this.momentObj = moment()
    // this.roleType = this.$store.state.user.roleType
  },
  methods: {
    formatDate(value) {
      return moment().utcOffset(value + '+08:00')
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
      this.submit(item, i, this.detail)
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
