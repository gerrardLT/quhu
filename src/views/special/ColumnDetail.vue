<template>
  <div>
    <div class="columnDetail_container">
      <el-row type="flex" class="subscriptions">
        <el-col :span="18">
          <div class="sub_name">{{ detail_info.subscriptions_name }}</div>
        </el-col>
        <el-col :span="6" class="sub_image">
          <img src="../../assets/defaultAvatarUrl.png" alt="">
        </el-col>
      </el-row>
      <el-row type="flex" class="introduce">
        <el-col :span="24">
          <div class="intro_title">圈子介绍</div>
          <div>{{ detail_info.introduction }}</div>
        </el-col>
      </el-row>
      <el-row type="flex" class="add_column" justify="center">
        <el-button class="add_btn" type="primary" @click="apply" round>
          价格：{{detail_info.price }}
          <br />
          <br />
          申请加入
        </el-button>
        <el-button v-if="!isOwnColumn" class="remove_btn" type="primary" @click="remove" round>
          退出圈子
        </el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { subscriptions, addColumn, removeColumn } from '@/api/special/special'
import { getToken } from '@/utils/auth'
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
        image: '',
        price: '',
        time_stamp: ''
      }
    }
  },
  computed: {
    isOwnColumn() {
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      return this.detail_info.master === userInfo.steem_id
    }
  },
  methods: {
    async remove() {
      const { subscriptions_name } = this.detail_info
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = sessionStorage.getItem('login-type')
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        subscriptions_name
      }
      const res = await removeColumn(params)
      // console.log(res)
      if (res.success === 'ok') {
        this.$message.success('退出圈子成功')
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
      console.log(res)
      if (res.success === 'ok') {
        this.detail_info = res.data
      }
    },
    async apply() {
      const { subscriptions_name } = this.detail_info
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = sessionStorage.getItem('login-type')
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name
      }
      const res = await addColumn(params)
      console.log(res)
      if (res.success === 'ok') {
        this.$message.success('加入圈子成功')
      } else {
        this.$message.error(res.error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.columnDetail_container {
  padding: 10px;
  .subscriptions {
    border-bottom: 1px solid #e4e4e4;
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
    border-bottom: 1px solid #e4e4e4;
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
    }
    .remove_btn {
      width: 200px;
      height: 80px;
    }
  }
}
</style>
