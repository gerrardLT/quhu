<template>
  <div class="login_container">
    <div class="login_box">
      <img
        class="logo_container animate__animated animate__backInRight animate__slow"
        src="../assets/quhu-transparant.png"
        alt=""
      />
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rule="rules"
        label-width="0px"
        class="login_form"
      >
        <div class="form_container">
          <!-- 账号 -->
          <el-form-item prop="user">
            <el-input
              prefix-icon="el-icon-user"
              v-model="loginForm.user"
              :placeholder="$t('login.input_account')"
              clearable
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password" class="password">
            <el-input
              show-password
              prefix-icon="el-icon-lock"
              v-model="loginForm.password"
              :placeholder="$t('login.input_password')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="inviteCode" class="invite">
            <el-input v-if="invitedId" v-model="invitedId" disabled>
              <template slot="prepend">{{ $t('login.invitedId') }}：</template>
            </el-input>
          </el-form-item>
        </div>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button class="btn" type="primary" @click="passwordLogin">{{
            userType === 'login' ? $t('login.login') : $t('login.register')
          }}</el-button>
          <div class="login_area">
            <div class="wallet_login" @click="walletLogin">
              {{ $t('login.wallet_login') }}
            </div>
            <div class="register_btn" @click="toggle">
              {{
                userType === 'login'
                  ? $t('login.register_account')
                  : $t('login.account_login')
              }}
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'Vuex'
import MD5 from 'MD5'
import { login, register } from '@/api/store/login'
import { setToken } from '@/utils/auth'
import { Loading } from 'element-ui'
export default {
  mounted() {
    this.invitedId = this.$route.query.invitedId
    this.userType = 'login'
    if (this.invitedId) {
      this.userType = 'register'
    }
    const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))

    this.loginForm.user = (userInfo && userInfo.user) || ''
  },
  data() {
    return {
      invitedId: '',
      userType: 'login',
      // 这是登录表单的数据绑定对象
      loginForm: {
        user: '',
        password: ''
      },
      passwordStatus: 'hide',
      statusImgUrl: '../../assets/img/showPassword.jpeg',
      statusType: 'password',
      // 这是表单验证规则对象
      rules: {
        user: [
          {
            pattern: '/^[a-zA-Z0-9_-]{4,16}$/',
            required: true,
            message: this.$t('login.input_correct_account'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},

  methods: {
    ...mapActions({
      getUser: 'getUserInfo'
    }),
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    walletLogin() {
      // this.loginType = 'wallet'
      const self = this
      if (window.ethereum) {
        if (typeof window.ethereum.isMetaMask === 'undefined') {
          self.$message.error(self.$t('login.install') + ' MetaMask！')
        } else {
          window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .catch(function (reason) {
              self.$message.error(self.$t('login.error') + reason.message)
            })
            .then(function (accounts) {
              // console.log('account', accounts)
              const web3 = new self.Web3(
                self.Web3.givenProvider || 'ws://some.local-or-remote.node:8546'
              )
              web3.eth.personal.sign(
                web3.utils.utf8ToHex('welcome to quhu'),
                accounts[0],
                (err, res) => {
                  if (err) {
                    self.$message.error(
                      self.$t('login.sign_error') + err.message
                    )
                  } else {
                    console.log('签名后的数据：', res)
                    login({
                      type: 'eth',
                      data: [accounts[0], res]
                    }).then((data) => {
                      setToken(data.token)
                      self.$message.success(self.$t('login.login_success'))
                      localStorage.setItem('login-type', 'eth')
                      self.$store.dispatch('getUserInfo', {
                        id: accounts[0],
                        token: data.token
                      })
                    })
                  }
                }
              )
            })
        }
      } else {
        self.$message.error(self.$t('login.install') + ' MetaMask！')
      }
    },
    passwordLogin() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const user = this.loginForm.user.trim()
        const password = this.loginForm.password.trim()
        const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,16}$/
        const pwdReg =
          /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,16}$/
        if (user === '') {
          this.$message.error(this.$t('login.input_account'))
        } else if (password === '') {
          this.$message.error(this.$t('login.input_password'))
        } else if (!reg.test(user)) {
          this.$message.error(this.$t('login.account_tip'))
        } else if (!pwdReg.test(password)) {
          this.$message.error(this.$t('login.password_tip'))
        } else {
          const loading = Loading.service({
            text: this.$t('login.login_success'),
            spinner: 'el-icon-loading ElementLoading',
            background: 'rgba(0, 0, 0, 0.2)'
          })
          if (this.userType === 'login') {
            login({
              type: 'password',
              data: [user, MD5(password)]
            }).then((data) => {
              if (loading) {
                loading.close()
              }
              setToken(data.token)
              localStorage.setItem('login-type', 'password')
              this.$message.success(this.$t('login.login_success'))
              this.$store.dispatch('getUserInfo', {
                id: user,
                token: data.token
              })
            })
          }

          if (this.userType === 'register') {
            register({
              user: user,
              password: MD5(password),
              eth_account: '',
              captcha: '',
              invitedId: this.invitedId || ''
            }).then((data) => {
              if (loading) {
                loading.close()
              }
              if (data.success === 'ok') {
                this.loginForm = {
                  user,
                  password
                }
                this.$message.success(this.$t('login.register_success'))
                this.toggle()
              }
            })
          }
        }
      })
    },
    toggle() {
      this.resetLoginForm()
      if (this.userType === 'login') {
        this.userType = 'register'
      } else {
        this.userType = 'login'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@media only screen and (max-width: 500px) {
  .logo_container {
    width: 200px !important;
    height: 100px !important;
    top: 20px;
  }
  .login_box {
    height: 500px !important;
    width: auto !important;
    right: 50px !important;
    top: 150px;
  }
  .login_form {
    bottom: -20px !important;
  }
  .login_container {
    transform: scale(0.5);
    transform-origin: top left;
    width: 100%;
  }
  ::v-deep .el-input--prefix .el-input__inner {
    width: 200px;
  }
  .btns .btn {
    width: 200px !important;
  }
  .login_area .register_btn {
    position: absolute;
    left: 130px;
  }
}
@media only screen and (max-height: 700px) {
  .login_box {
    top: 100px !important;
  }
}
.login_container {
  background-image: url('../assets/fox-login.png');
  // background-image: url('../assets/quhu-bglogo.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
  color: #fff;
  position: relative;
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.3);
}
.logo_container {
  width: 400px;
  height: 200px;
  position: absolute;
  box-shadow: #c0c0c0;
}
.login_box {
  position: relative;
  // color: #c0c0c0;
  width: 80%;
  display: flex;
  justify-content: center;
  max-width: 500px;
  min-width: 250px;
  height: 600px;
  // background-color: #fff;
  border-radius: 3px;
  position: absolute;
  right: 200px;
  bottom: 20%;
  backdrop-filter: blur(20px);
  // color: #fff;
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.3);
  opacity: 0.8;
  border-radius: 30px;
  // transform: translate(-50%, -50%);
}

.avatar_box {
  height: 100px;
  width: 100px;
  /* border: 1px solid #eee; */
  /* border-radius: 50%; */
  /* padding: 10px; */
  /* box-shadow: 0 0 10px #ddd; */
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  /* background-color: #fff;s */
}

img {
  display: block;
  width: 100px;
  height: 100px;
  /* border-radius: 50%; */
  /* background-color: #eee; */
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  padding-left: 10%;
}
.invite {
  display: flex;
}
.btns {
  position: relative;
  max-width: 400px;
}
::v-deep .el-input-group__prepend {
  position: absolute;
  background-color: #525357;
  left: 20px;
  top: 50%;
  transform: translate(0, -50%);
}
::v-deep .el-form-item {
  margin-top: 50px;
}
::v-deep .el-input {
  font-size: 16px;
}
::v-deep .el-input--prefix .el-input__inner {
}
::v-deep .el-input__prefix {
  left: 15px;
  top: 2px;
}
::v-deep .el-button--primary {
  background-color: #101010;
  border-color: #fff;
}
::v-deep .el-button {
  font-size: 16px;
}
::v-deep .el-input__inner {
  padding-left: 50px;
  height: 50px;
  width: 400px;
  border-radius: 30px;
  background-color: #525357;
  border: 1px solid #525357;
  color: #fff;
}
::v-deep .el-input.is-disabled .el-input__inner {
  background-color: #525357;
  padding-left: 80px;
}
::v-deep .el-input-group__prepend {
  padding-left: 0px;
  border: none;
}
::v-deep .el-form-item__content {
  width: 400px;
}
::v-deep .el-input__suffix {
  right: 10px;
}
.btns .btn {
  // margin-top: 20px;
  width: 400px;
  height: 50px;
  border-radius: 30px;
}
.form_container {
  position: relative;
}
.form_container .password {
  position: relative;
}
.password .status_img {
  width: 13px;
  height: 10px;
  position: absolute;
  right: 10px;
  bottom: 15px;
  cursor: pointer;
}
.register_btn {
  cursor: pointer;
  color: $mainColor;
  font-size: 16px;
}

.login_area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.login_area .wallet_login {
  display: inline-block;
  cursor: pointer;
  color: #000;
  font-size: 16px;
}
.login_area .wallet_login:hover {
  color: $mainColor;
}
.form_container .register_btn:hover {
  color: $mainColor;
}
</style>
