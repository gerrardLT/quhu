<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-27 04:17:54
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-29 15:00:26
 * @FilePath: \quhu\src\views\my\Integral.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="invite_container">
    <div class="link">
      {{ $t('invite.invite_link') }}：{{
        'https://app.onlyfun.city/login?invitedId=' + userInfo.invitedId
      }}
    </div>
    <el-button type="danger" round @click="copy($event)">{{
      $t('invite.copy_invite_link')
    }}</el-button>
        <div style="margin-top: 20px">
      <div class="invite_title"><div> {{ $t('invite.invite_report') }}</div><div> {{ $t('invite.invited_number')+invitations }}</div></div>
      <el-table
        :data="inviteList"
        style="width: 100%"
        height="500"
        v-loading="tableLoading"
      >
        <el-table-column
          prop="id"
          :label="$t('invite.id')"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="user_name"
          :label="$t('invite.user_name')"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="steem_id" :label="$t('invite.steem_id')" width="150">
        </el-table-column>
        <!-- <el-table-column prop="avatar" :label="$t('invite.avatar')" width="150">
          <template slot-scope="scope">
              <img style="width: 50px;height: 50px;" :src="scope.row.avatar" alt="">
            </template>
        </el-table-column> -->

        <el-table-column prop="mint" :label="$t('invite.mint')">
        </el-table-column>
      </el-table>
    </div>
    <div class="record-page">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="20"
        :page-count="pageInfo.max_page"
        layout="total, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
import { get_invite } from '@/api/user/user'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      inviteList:[],
      invitations:0,
      tableLoading:false,
      currentPage:1,
      pageInfo: {}
    }
  },
  created() {},
  mounted() {
    this.getInvite(1)
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    },
  },
  methods: {
    copy(e) {
      clipboard(
        'https://app.onlyfun.city/login?invitedId=' + this.userInfo.invitedId,
        e
      )
      this.$message.success(this.$t('invite.copy_success'))
    },
    handleCurrentChange(v) {
      this.getInvite(v)
    },
    async getInvite(page){
      this.tableLoading = true
      const res = await get_invite({
          id:
            this.loginType === 'eth'
              ? this.userInfo.eth_account
              : this.userInfo.user,
          token: getToken(),
          page
        })
        if (res && res.success === 'ok') {
          this.pageInfo = {
          max_page: res.max_page,
          page: res.page
        }
          this.invitations = res.invitations
          this.inviteList = res.data
      }
      this.tableLoading = false
     

    }
  }
}
</script>

<style scoped>
.invite_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.link {
  margin-bottom: 20px;
}
.invite_title{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
