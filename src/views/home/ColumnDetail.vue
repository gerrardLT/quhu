<template>
  <div>
    <div class="columnDetail_container">
      <el-row type="flex" class="subscriptions">
        <el-col :span="18">
          <div class="sub_name">{{ detail_info.subscriptions_name }}</div>
        </el-col>
        <el-col :span="6" class="sub_image">
          <img :src="detail_info.image" alt="" />
        </el-col>
      </el-row>
      <el-row type="flex" class="introduce">
        <el-col :span="24">
          <div class="intro_title">专栏介绍</div>
          <div>{{ detail_info.introduction }}</div>
        </el-col>
      </el-row>
      <el-row type="flex" class="add_column" justify="center" align="middle">
        <el-button
          v-if="!isJoined"
          class="add_btn"
          type="primary"
          @click="apply"
          round
        >
          价格：{{ detail_info.price }}
          <br />
          <br />
          申请加入
        </el-button>
        <el-button
          v-if="isJoined"
          slot="reference"
          class="remove_btn"
          type="primary"
          @click="removeSub"
          round
        >
          退出专栏
        </el-button>
        <el-dialog
          title="退出提示"
          :visible.sync="removePopVisible"
          width="30%"
          center
        >
          <span>确认退出当前专栏吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="remove">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>
    </div>
  </div>
</template>

<script>
import { subscriptions, addColumn, removeColumn } from '@/api/special/special'
import { getToken } from '@/utils/auth'

const defaultImg = require(`../../assets/quhu-logo.jpg`)
export default {
  name: 'ColumnDetail',
  created() {
    this.getDetail()
  },
  mounted() {},
  data() {
    return {
      detail_info: {
        subscriptions_name: '',
        master: '',
        introduction: '',
        image: defaultImg,
        price: '',
        time_stamp: ''
      },
      removePopVisible: false
    }
  },
  computed: {
    isJoined() {
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      if (
        userInfo.buy_article.join.indexOf(
          this.detail_info.subscriptions_name
        ) !== -1 ||
        userInfo.buy_article.my.indexOf(this.detail_info.subscriptions_name) !==
          -1
      ) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    removeSub() {
      this.removePopVisible = true
    },
    async remove() {
      const { subscriptions_name } = this.detail_info
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = localStorage.getItem('login-type')
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        subscriptions_name
      }
      const res = await removeColumn(params)
      // console.log(res)
      if (res && res.success === 'ok') {
        this.$message.success('退出专栏成功')
      } else {
        this.$message.error(res.error)
      }
    },
    async getDetail() {
      const subscriptions_name = this.$route.query.subName
      const params = {
        type: 'info',
        subscriptions_name
      }
      const res = await subscriptions(params)

      if (res && res.success === 'ok') {
        this.detail_info = res.data
      }
      if (!this.detail_info.image) {
        this.detail_info.image = defaultImg
      }
    },
    async apply() {
      const { subscriptions_name } = this.detail_info
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = localStorage.getItem('login-type')
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name
      }
      const res = await addColumn(params)
      console.log(res)
      if (res && res.success === 'ok') {
        this.$message.success('加入专栏成功')
        this.$router.go(-1)
      } else {
        this.$message.error(res.error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.columnDetail_container {
  padding: 20px 50px;
  margin: 50px;
  border: 1px solid #e4e4e4;
  background-color: #fff;
  .subscriptions {
    border-bottom: 1px dashed #e4e4e4;
    padding: 10px 0;
    .sub_name {
    }
    .sub_image {
      margin: 0 auto;
      width: 80px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .introduce {
    margin-top: 20px;
    height: 200px;
    border-bottom: 1px dashed #e4e4e4;
    margin-bottom: 20px;
    .intro_title {
      margin-bottom: 20px;
    }
  }
  .add_column {
    height: 200px;
    .add_btn {
      width: 200px;
      height: 80px;
      background-color: #54bcbd;
    }
    .remove_btn {
      width: 200px;
      height: 80px;
    }
  }
}
</style>
