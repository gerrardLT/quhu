<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-27 04:20:57
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 10:23:01
 * @FilePath: \quhu\src\views\my\Setting.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="setting_container">
    <el-row type="flex" class="row-bg user_space" justify="center">
      <el-col :span="4" class="user_avatar">
        <img src="../../assets/defaultAvatarUrl.png" alt="" />
      </el-col>
    </el-row>
    <div v-for="(item) in list" :key="item.id">
      <el-row class="row-bg">
        <div class="setting-bar" @click="handleChange(item)">
          <div class="content">
            <div class="menu">
              {{item.title}}
            </div>
          </div>
          <div class="arrow">
            <span class="name_text" v-if="item.userSpace">{{   userInfo[item.userSpace] === 'none'?'': userInfo[item.userSpace]  }}</span>
            <Icon name="arrowR" />
          </div>
        </div>
      </el-row>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" center :before-close="closeDialog" class="dialogBox border-radius" width="80%">
      <el-input class="input" v-if="currentChange==='user'" v-model="user" placeholder="请输入用户名" clearable></el-input>
      <el-input class="input" v-if="currentChange==='user_name'" v-model="user_name" placeholder="请输入昵称" clearable></el-input>
      <el-input v-if="!isEthLogin" v-model="password" placeholder="请输入密码" show-password clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="handleReport">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import Icon from '@/components/Icon/index'
import MD5 from 'MD5'
import { mapState } from 'vuex'

export default {
  components: {
    Icon
  },
  data() {
    return {
      dialogVisible: false,
      user: '',
      user_name: '',
      password: '',
      currentChange: '',
      list: [
        {
          id: 0,
          title: '修改昵称',
          userSpace: 'user_name'
        },
        {
          id: 1,
          title: '修改用户名',
          userSpace: 'user'
        },
        {
          id: 2,
          title: '修改密码'
        },
        {
          id: 3,
          title: '退出登录'
        },
        {
          id: 4,
          title: '注销'
        }
      ]
    }
  },
  computed: {
    isEthLogin() {
      return localStorage.getItem('login-type') === 'eth'
    },
    ...mapState({
      userInfo: (state) => state.userInfo
    })
  },
  created() {},
  mounted() {
    // console.log(this.$store.state)
    // console.log(this.userInfo)
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false
      this.user = ''
      this.user_name = ''
      this.password = ''
    },
    handleReport() {
      // const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{2,9}$/
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const self = this
      if (this.currentChange === 'user') {
        if (!this.validate(this.user)) {
          return
        }
      }

      if (this.currentChange === 'user_name') {
        if (!this.validate(this.user_name)) {
          return
        }
      }
      if (this.isEthLogin) {
        if (window.ethereum) {
          if (typeof window.ethereum.isMetaMask === 'undefined') {
            self.$message.error('请安装 MetaMask！')
          } else {
            window.ethereum
              .request({ method: 'eth_requestAccounts' })
              .catch(function (reason) {
                self.$message.error('出错了！' + reason.message)
              })
              .then(function (accounts) {
                // console.log('account', accounts)
                const web3 = new self.Web3(
                  self.Web3.givenProvider ||
                    'ws://some.local-or-remote.node:8546'
                )
                web3.eth.personal.sign(
                  web3.utils.utf8ToHex('change'),
                  accounts[0],
                  (err, res) => {
                    if (err) {
                      self.$message.error('签名失败，因为' + err.message)
                    } else {
                      if (self.currentChange === 'user_name') {
                        self.$store.dispatch('updateUser', {
                          user_name: self.user_name,
                          password: '',
                          sign: res,
                          type: 'user_name'
                        })
                      }
                      if (self.currentChange === 'user') {
                        self.$store.dispatch('updateUser', {
                          user: self.user,
                          password: '',
                          sign: res,
                          type: 'user'
                        })
                      }
                      self.closeDialog()
                    }
                  }
                )
              })
          }
        } else {
          self.$message.error('请安装 MetaMask！')
        }
      } else {
        const { user_name, user, password } = this

        if (this.currentChange === 'user_name') {
          if (this.validate(this.user_name.trim())) {
            this.$store.dispatch('updateUser', {
              user_name,
              password: MD5(password),
              type: 'user_name'
            })
          } else {
            return
          }
        }
        if (this.currentChange === 'user') {
          if (this.validate(this.user.trim())) {
            this.$store.dispatch('updateUser', {
              user,
              password: MD5(password),
              type: 'user'
            })
          } else {
            return
          }
        }
        self.closeDialog()
      }
    },
    validate(value) {
      let flag = true
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,12}$/
      if (this.currentChange === 'user') {
        if (value.trim() === '') {
          this.$message.error('请输入要修改的用户名')
          flag = false
        } else {
          flag = true
        }
      }
      if (this.currentChange === 'user_name') {
        if (value.trim() === '') {
          this.$message.error('请输入要修改的昵称')
          flag = false
        } else {
          flag = true
        }
      }
      if (!reg.test(value)) {
        this.$message.error('请输入2到12位字符的汉字，字母，数字，下划线')
        flag = false
      } else {
        flag = true
      }
      return flag
    },
    handleChange(val) {
      if (val.id === 0) {
        // 昵称修改
        this.currentChange = 'user_name'
        this.dialogVisible = true
      }

      if (val.id === 1) {
        // 用户名修改
        this.currentChange = 'user'
        this.dialogVisible = true
      }

      if (val.id === 2) {
        // 密码修改
        this.$router.push('/changePwd')
      }

      if (val.id === 3) {
        // 退出登录
        this.$store.dispatch('loginOutFalse')
      }

      // if (val.id === 4) {
      //   // 注销
      //   this.$store.dispatch('loginOutFalse')
      // }
    }
  },

  watch: {
    userInfo: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>
.border-radius {
  border-radius: 10px;
}
.input {
  margin-bottom: 10px;
}
.dialogBox {
  min-width: 200px;
}
.setting-bar {
  height: 50px;
  background: #fff;
  padding: 0 10px;
  position: relative;
  display: flex;
}
/* .row-bg {
  border: 0.5px solid #c0c0c0;
} */
.user_space {
  padding: 20px 0;
}
.user_avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.user_avatar img {
  width: 60px;
  height: 60px;
  vertical-align: middle;
  border-radius: 50%;
}
.setting-bar:active {
  background: #f9f9f9;
}

.content {
  display: flex;
  align-items: center;
}
.name_text {
  /* line-height: 60px;
  height: 60px; */
  margin-right: 20px;
}
.icon {
  width: 24px;
  height: 24px;
  /* border-radius: 6px; */
  /* background: #F3F7F8; */
}

.menu {
  font-family: PingFangSC-Regular;
  font-size: 15px;
  font-weight: 700;
  line-height: 20px;
  margin-left: 10px;
  letter-spacing: 1px;
  color: rgba(0, 0, 0, 0.8);
}
.line {
  height: 12px;
  background: #f2f8f8;
}
.arrow {
  width: auto;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: absolute;
  right: 20px;
}
</style>
