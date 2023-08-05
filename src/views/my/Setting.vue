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
          <el-tab-pane class="tab_content" :label="$t('setting.base_info')">
            <el-form
              :model="baseInfoForm"
              :rules="baseRules"
              ref="baseFormRef"
              label-width="100px"
            >
              <el-form-item
                :label="$t('setting.user_name')"
                prop="user"
                style="width: 400px"
              >
                <el-input
                  v-model="baseInfoForm.user"
                  clearable
                  :disabled="userChanged"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('setting.password')"
                prop="password"
                style="width: 400px"
              >
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
                  >{{ $t('setting.save') }}</el-button
                >
                <el-button type="primary" @click="bindEthAccount">{{
                  $t('setting.bind_eth')
                }}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane class="tab_content" :label="$t('setting.safe_set')">
            <el-form
              :model="safeInfoForm"
              :rules="safeRules"
              ref="safeFormRef"
              label-width="100px"
            >
              <el-form-item
                :label="$t('setting.old_pass')"
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
                :label="$t('setting.new_pass')"
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
                :label="$t('setting.confirm_pass')"
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
                <el-button type="primary" @click="savePwd">{{
                  $t('setting.save')
                }}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane class="tab_content" :label="$t('setting.exit_login')">
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
                  {{ $t('setting.exit_tip1') }}

                  <br />
                  {{ $t('setting.exit_tip2') }}
                </span>
              </div>
              <div class="btns">
                <el-button type="primary" @click="confirmLoginOut">{{
                  $t('setting.confirm')
                }}</el-button>
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
        cb(this.$t('setting.input_change') + type)
      } else {
        if (!reg.test(value)) {
          cb(this.$t('setting.input_tip'))
        } else {
          cb()
        }
      }
    }
    const validateUserName = (rule, value, callback) => {
      validate(value, this.$t('setting.user_name'), callback)
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
          {
            required: true,
            message: this.$t('setting.input_old_pass'),
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: this.$t('setting.input_new_pass'),
            trigger: 'blur'
          }
        ],
        passwordAgain: [
          {
            required: true,
            message: this.$t('setting.re_confirm_pass'),
            trigger: 'blur'
          }
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
      const pwdReg =
        /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,16}$/
      if (
        !pwdReg.test(this.safeInfoForm.newPassword) ||
        !pwdReg.test(this.safeInfoForm.passwordAgain)
      ) {
        this.$message.error(this.$t('setting.pass_tip'))
        return
      }

      if (this.safeInfoForm.newPassword === this.safeInfoForm.passwordAgain) {
        if (loginType === 'password') {
          const loading = Loading.service({
            text: this.$t('message.loading'),
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
              self.$message.success(self.$t('setting.change_success'))
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
              self.$message.error(self.$t('setting.install') + ' MetaMask！')
            } else {
              window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .catch(function (reason) {
                  self.$message.error(self.$t('setting.error') + reason.message)
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
                        self.$message.error(
                          self.$t('setting.sign_fail') + err.message
                        )
                      } else {
                        changePwd({
                          id: accounts[0],
                          token,
                          sign: res,
                          old_password: MD5(self.safeInfoForm.oldPassword),
                          new_password: MD5(self.safeInfoForm.newPassword)
                        }).then((res) => {
                          self.$message.success(
                            self.$t('setting.change_success')
                          )
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
            self.$message.error(self.$t('setting.install') + ' MetaMask！')
          }
        }
      } else {
        this.$message.error(this.$t('setting.fail_tip'))
      }
    },
    callMeta(fn, signType) {
      const self = this
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .catch(function (reason) {
          self.$message.error(self.$t('setting.error') + reason.message)
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
        self.$message.error(self.$t('setting.sign_fail') + err.message)
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
            self.$message.error(self.$t('setting.install') + ' MetaMask！')
          } else {
            self.callMeta(self.handleSign, 'change')
          }
        } else {
          self.$message.error(self.$t('setting.install') + ' MetaMask！')
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
        self.$message.error(self.$t('setting.input_pass_tip'))
        return
      } else {
        this.callMeta(async (err, res, account) => {
          if (err) {
            self.$message.error(self.$t('setting.sign_fail') + err.message)
          } else {
            const loading = Loading.service({
              text: this.$t('message.loading'),
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
              self.$message.success(self.$t('setting.bind_success'))
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
::v-deep .el-button--primary {
  background-color: #087790;
  border-color: #087790;
}
::v-deep
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #087790;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #087790;
}
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
