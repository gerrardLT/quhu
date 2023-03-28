<template>
  <div class="Comment" :style="{ width: commentWidth }">
    <div style="display: flex">
      <el-avatar
        size="large"
        :src="avatar ? avatar : require(`../../assets/defaultAvatarUrl.png`)"
        style="margin: 0 10px"
      />
      <div style="flex: auto">
        <el-input
          type="textarea"
          :autosize="{ minRows: minRows, maxRows: maxRows }"
          :placeholder="placeholder"
          v-model="textareaMap['initComment']"
        ></el-input>

        <div>
          <div style="margin: 10px 0">
            <!-- <el-button @click="pBodyStatus('initComment')">Emoji表情</el-button> -->
            <el-button
              plain
              type="primary"
              @click="doSend('initComment')"
              style="float: right"
              >发送</el-button
            >
          </div>
        </div>
      </div>
    </div>

    <div v-for="(item, index) in commentList" :key="index">
      <div style="margin-top: 27px; display: flex">
        <el-avatar
          size="large"
          style="margin: 0 10px"
          :src="item.body.avatar ? item.body.avatar : ''"
        ></el-avatar>

        <div style="flex: auto">
          <div style="display: inline-block">
            <strong style="font-size: 16px; margin-right: 10px">{{
              item.body.author
            }}</strong>
          </div>
          <div class="date">{{ item.created.replace('T', '  ') }}</div>

          <div class="reply-content">
            <div>
              <div>{{ item.body.body }}</div>
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
                v-if="!item.isEditReply"
                @click="doReply(item)"
              >
                <i class="el-icon-chat-square"></i>
                回复
              </div>
              <div class="reply-font" v-else @click="cancel(item)">
                <i class="el-icon-chat-square"></i>
                取消回复
              </div>
            </div>
            <div v-if="item.isEditReply">
              <el-input
                type="textarea"
                :autosize="{ minRows: minRows, maxRows: maxRows }"
                :placeholder="placeholder"
                v-model="item.reply"
              ></el-input>

              <div>
                <div style="margin: 10px 0">
                  <!-- <el-button @click="pBodyStatus(index)">Emoji表情</el-button> -->
                  <el-button
                    @click="doSend('initComment', item, index)"
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
              <!-- <div>
                <a href="#" style="text-decoration: none; color: #409eff"
                  >@{{ ritem.targetUser.username }}：</a
                >
              </div> -->
              <div>
                <div>{{ ritem.body.body }}</div>
                <!-- <el-popconfirm
                  title="确定要删除该评论吗？"
                  @confirm="deleteComment(jndex)"
                >
                  <span
                    slot="reference"
                    class="deleteComment"
                    v-show="
                      ritem.commentUser.username === $store.state.user.name ||
                      roleType === 'admin'
                    "
                    ><i class="el-icon-delete" /> 删除</span
                  >
                </el-popconfirm> -->
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
                    <!-- <el-button @click="pBodyStatus(jndex)"
                      >Emoji表情</el-button
                    > -->
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
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    placeholder: {
      type: String,
      default: '说点什么吧'
    },
    minRows: {
      type: Number,
      default: 4
    },
    maxRows: {
      type: Number,
      default: 8
    },
    label: {
      type: String,
      default: '作者'
    },
    commentList: {
      type: Array,
      default: () => []
    },
    commentWidth: {
      type: String,
      default: '90%'
    },
    detail: {
      type: Object
    }
  },
  data() {
    return {
      roleType: '',
      replyMap: {},
      pBodyMap: { initComment: false },
      textareaMap: { initComment: '' },
      avatar: ''
    }
  },
  filters: {
    formatDate(value) {
      return moment(value).format('YYYY-MM-DD HH:mm')
    }
  },
  components: {},
  mounted() {
    // this.roleType = this.$store.state.user.roleType
    this.avatar = JSON.parse(localStorage.getItem('quhu-userInfo')).avatar
  },
  methods: {
    doReply(item) {
      this.$set(item, 'isEditReply', true)
    },
    cancel(item) {
      this.$set(item, 'isEditReply', false)
      this.$set(this, 'textareaMap', '')
    },
    deleteComment(index) {
      this.$emit('deleteComment', index)
    },
    // 参数：评论内容,被评论用户id,父级评论id
    doSend(key, item, i) {
      console.log(item)
      this.$emit('doSend', item, i, this.detail, this.textareaMap[key])
      if (item) {
        this.$set(item, 'isEditReply', false)
      }

      //   this.$set(this.textareaMap, key, '')
      //   this.$set(this.replyMap, key, false)
    },

    pBodyStatus(key) {
      this.$set(this.pBodyMap, key, !this.pBodyMap[key])
    }
  }
}
</script>

<style lang="scss" scoped>
.Comment {
  color: black;
  padding-bottom: 300px;
  .OwO {
    position: relative;
    z-index: 1;
    .OwO-body {
      position: absolute;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 0 4px 4px 4px;
      .OwO-items {
        max-height: 197px;
        overflow-y: scroll;
        padding: 10px;
        .OwO-item {
          background: #f7f7f7;
          padding: 5px 10px;
          border-radius: 5px;
          display: inline-block;
          margin: 0 10px 12px 0;
          transition: 0.3s;
          line-height: 19px;
          font-size: 20px;
          cursor: pointer;
          &:hover {
            background: #eee;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
              0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
          }
        }
      }
    }
  }
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
}
</style>
