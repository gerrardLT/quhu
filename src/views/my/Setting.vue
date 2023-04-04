<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-27 04:20:57
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 10:23:01
 * @FilePath: \quhu\src\views\my\Setting.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <Info></Info>
    <div class="setting_container">
      <div class="setting_tab">
        <el-tabs type="border-card">
          <el-tab-pane class="tab_content" label="基本信息">
            <el-form
              :model="baseInfoForm"
              :rules="baseRules"
              ref="baseFormRef"
              label-width="100px"
            >
              <!-- <el-form-item label="昵称" prop="nickName" style="width: 400px">
                <el-input v-model="baseInfoForm.nickName" clearable></el-input>
              </el-form-item> -->
              <el-form-item label="用户名" prop="user" style="width: 400px">
                <el-input
                  v-model="baseInfoForm.user"
                  clearable
                  :disabled="userChanged"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" style="width: 400px">
                <el-input
                  v-model="baseInfoForm.password"
                  clearable
                  type="password"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item class="save_btn">
                <el-button
                  type="primary"
                  v-if="!userChanged"
                  style="margin-right: 80px"
                  @click="save"
                  >保存</el-button
                >
                <el-button type="primary" @click="bindEthAccount"
                  >绑定ETH账号</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane class="tab_content" label="安全设置">
            <el-form
              :model="safeInfoForm"
              :rules="safeRules"
              ref="safeFormRef"
              label-width="100px"
            >
              <el-form-item
                label="原密码"
                prop="oldPassword"
                v-if="!isEthLogin"
                style="width: 400px"
              >
                <el-input
                  v-model="safeInfoForm.oldPassword"
                  clearable
                  type="password"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item
                label="新密码"
                prop="newPassword"
                style="width: 400px"
              >
                <el-input
                  v-model="safeInfoForm.newPassword"
                  clearable
                  type="password"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item
                label="确认密码"
                prop="passwordAgain"
                style="width: 400px"
              >
                <el-input
                  v-model="safeInfoForm.passwordAgain"
                  clearable
                  type="password"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="savePwd">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane class="tab_content" label="退出登录">
            <div class="login_out">
              <div class="title">
                <svg
                  :style="{
                    width: '50px',
                    height: '50px'
                  }"
                >
                  <use xlink:href="#icon-sign-out" rel="external nofollow" />
                </svg>
                <span style="margin-left: 20px">
                  您确定要退出吗？
                  <br />
                  退出后内容将不再保存！
                </span>
              </div>
              <div class="btns">
                <el-button type="primary" @click="confirmLoginOut"
                  >确定</el-button
                >
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon/index'
import Info from './component/info.vue'
import MD5 from 'MD5'
import { bindEth, changePwd } from '@/api/user/user'
import { getToken } from '@/utils/auth'
import { Loading } from 'element-ui'

export default {
  components: {
    Info
  },
  data() {
    const validate = (value, type, cb) => {
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,12}$/
      if (value.trim() === '') {
        cb('请输入要修改的' + type)
      } else {
        if (!reg.test(value)) {
          cb('请输入2到12位字符的汉字，字母，数字，下划线')
        } else {
          cb()
        }
      }
    }
    // const validateNick = (rule, value, callback) => {
    //   validate(value, '昵称', callback)
    // }
    const validateUserName = (rule, value, callback) => {
      validate(value, '用户名', callback)
    }
    return {
      baseInfoForm: {
        user:
          JSON.parse(localStorage.getItem('quhu-userInfo')).user === 'none'
            ? ''
            : JSON.parse(localStorage.getItem('quhu-userInfo')).user,
        password: ''
      },
      safeInfoForm: {
        oldPassword: '',
        newPassword: '',
        passwordAgain: ''
      },
      safeRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        passwordAgain: [
          { required: true, message: '请再次确认密码', trigger: 'blur' }
        ]
      },
      baseRules: {
        user: [{ validator: validateUserName, trigger: 'blur' }]
      },
      currentChange: ''
    }
  },
  computed: {
    isEthLogin() {
      return localStorage.getItem('login-type') === 'eth'
    },
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    userChanged() {
      return this.userInfo.user !== 'none'
    }
  },
  created() {},
  mounted() {
    //       this.$nextTick(() => {
    //             this.baseInfoForm = {
    //   user: this.userInfo.user
    // }
    //   })
  },
  methods: {
    confirmLoginOut() {
      this.$store.dispatch('loginOutFalse')
    },
    save() {
      this.$refs.baseFormRef.validate((valid) => {
        if (valid) {
          this.handleReport()
        } else {
          return false
        }
      })
    },
    savePwd() {
      this.$refs.safeFormRef.validate((valid) => {
        if (valid) {
          this.updatePwd()
        } else {
          return false
        }
      })
    },
    updatePwd() {
      const self = this
      const token = getToken()
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = localStorage.getItem('login-type')

      if (this.safeInfoForm.newPassword === this.safeInfoForm.passwordAgain) {
        if (loginType === 'password') {
          const loading = Loading.service({
            text: '加载中...',
            spinner: 'el-icon-loading ElementLoading',
            background: 'rgba(0, 0, 0, 0.2)'
          })
          changePwd({
            id: userInfo.user,
            token,
            old_password: MD5(this.safeInfoForm.oldPassword),
            new_password: MD5(this.safeInfoForm.newPassword),
            sign: ''
          }).then((res) => {
            if (res && res.success === 'ok') {
              if (loading) {
                loading.close()
              }
              self.$message.success('修改成功！')
              this.safeInfoForm = {
                oldPassword: '',
                newPassword: '',
                passwordAgain: ''
              }
            }
          })
        } else if (loginType === 'eth') {
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
                    web3.utils.utf8ToHex('change password'),
                    accounts[0],
                    (err, res) => {
                      if (err) {
                        self.$message.error('签名失败，因为' + err.message)
                      } else {
                        changePwd({
                          id: accounts[0],
                          token,
                          sign: res,
                          old_password: MD5(self.safeInfoForm.oldPassword),
                          new_password: MD5(self.safeInfoForm.newPassword)
                        }).then((res) => {
                          self.$message.success('密码修改成功！')
                          this.safeInfoForm = {
                            oldPassword: '',
                            newPassword: '',
                            passwordAgain: ''
                          }
                        })
                      }
                    }
                  )
                })
            }
          } else {
            self.$message.error('请安装 MetaMask！')
          }
        }
      } else {
        this.$message.error('密码不一致，请重新输入')
      }
    },
    callMeta(fn, signType) {
      const self = this
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .catch(function (reason) {
          self.$message.error('出错了！' + reason.message)
        })
        .then(function (accounts) {
          // console.log('account', accounts)
          const web3 = new self.Web3(
            self.Web3.givenProvider || 'ws://some.local-or-remote.node:8546'
          )
          web3.eth.personal.sign(
            web3.utils.utf8ToHex(signType),
            accounts[0],
            (err, res) => {
              fn(err, res, accounts)
            }
          )
        })
    },
    handleSign(err, res) {
      const self = this
      if (err) {
        self.$message.error('签名失败，因为' + err.message)
      } else {
        self.$store.dispatch('updateUser', {
          // user_name: self.baseInfoForm.nickName,
          user: self.baseInfoForm.user,
          password: '',
          sign: res
        })
      }
    },
    handleReport() {
      // const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{2,9}$/
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const self = this
      if (this.isEthLogin) {
        if (window.ethereum) {
          if (typeof window.ethereum.isMetaMask === 'undefined') {
            self.$message.error('请安装 MetaMask！')
          } else {
            self.callMeta(self.handleSign, 'change')
          }
        } else {
          self.$message.error('请安装 MetaMask！')
        }
      } else {
        this.$store.dispatch('updateUser', {
          // user_name: self.baseInfoForm.nickName,
          user: self.baseInfoForm.user,
          password: MD5(self.baseInfoForm.password)
        })
        this.baseInfoForm = {
          password: ''
        }
      }
    },
    bindEthAccount() {
      const token = getToken()
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const self = this
      if (this.baseInfoForm.password.trim() === '') {
        self.$message.error('请输入密码！')
        return
      } else {
        this.callMeta(async (err, res, account) => {
          if (err) {
            self.$message.error('签名失败，因为' + err.message)
          } else {
            const loading = Loading.service({
              text: '加载中...',
              spinner: 'el-icon-loading ElementLoading',
              background: 'rgba(0, 0, 0, 0.2)'
            })
            const result = await bindEth({
              id: userInfo.user,
              token,
              password: MD5(this.baseInfoForm.password),
              eth_account: account[0],
              sign: res
            })
            if (res && res.success === 'ok') {
              self.$message.success('绑定成功！')
            }
            if (loading) {
              loading.close()
            }
          }
        }, 'eth')
      }
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

<style scoped lang="scss">
.save_btn {
  display: flex;
  justify-content: center;
}
.tab_content {
  height: 500px;
  display: flex;
  justify-content: center;
  padding-top: 50px;
  .login_out {
    width: 800px;
    height: 350px;
    background-color: #cecece;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .title {
      width: 400px;
      justify-content: center;
      margin-bottom: 40px;
      display: flex;
    }
    .btns {
      display: flex;
      justify-content: center;
      width: 400px;
    }
  }
}
.setting_container {
  /* height: 100vh;
  background: #fff; */
}
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
