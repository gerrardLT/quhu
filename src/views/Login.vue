<template>
  <div class="login_container">
    <div class="login_box">
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
              placeholder="请输入账号"
              clearable
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password" class="password">
            <el-input
              show-password
              prefix-icon="el-icon-lock"
              v-model="loginForm.password"
              placeholder="请输入密码"
              clearable
            ></el-input>
          </el-form-item>
          <div class="login_area">
            <div class="wallet_login" @click="walletLogin">钱包登录</div>
          </div>
          <div class="register_btn" @click="toggle">
            {{ userType === 'login' ? '注册账号' : '登  录' }}
          </div>
        </div>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button class="btn" type="primary" @click="passwordLogin">{{
            userType === 'login' ? '登 录' : '注册账号'
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MD5 from 'MD5'
import { login, register } from '@/api/store/login'
import { setToken } from '@/utils/auth'
export default {
  mounted() {
    this.invitedId = this.$route.query.invitedId
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
            message: '请输入正确的账号',
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
                self.Web3.givenProvider || 'ws://some.local-or-remote.node:8546'
              )
              web3.eth.personal.sign(
                web3.utils.utf8ToHex('welcome to quhu'),
                accounts[0],
                (err, res) => {
                  if (err) {
                    self.$message.error('签名失败，因为' + err.message)
                  } else {
                    console.log('签名后的数据：', res)
                    login({
                      type: 'eth',
                      data: [accounts[0], res]
                    }).then((data) => {
                      setToken(data.token)
                      self.$message.success('登录成功！')
                      localStorage.setItem('login-type', 'eth')
                      self.$store.dispatch('getUserInfo', {
                        id: accounts[0],
                        token: data.token
                      })
                    })
                  }
                }
              )

              // const abi = [
              //   {
              //     inputs: [
              //       {
              //         internalType: 'uint256',
              //         name: '_number',
              //         type: 'uint256'
              //       }
              //     ],
              //     name: 'translate',
              //     outputs: [],
              //     stateMutability: 'nonpayable',
              //     type: 'function'
              //   },
              //   {
              //     inputs: [],
              //     name: 'require',
              //     outputs: [
              //       {
              //         internalType: 'uint256',
              //         name: '',
              //         type: 'uint256'
              //       }
              //     ],
              //     stateMutability: 'view',
              //     type: 'function'
              //   }
              // ]
              // const myContract = new web3.eth.Contract(
              //   abi,
              //   '0x80956B0051dAe6faccE420C18272B29BeE626429',
              //   {
              //     from: accounts[0], // 默认交易发送地址
              //     gasPrice: '20000000000' // 以 wei 为单位的默认 gas 价格，当前价格为 20 gwei
              //   }
              // )
              // console.log(accounts)
              // myContract.methods
              //   .translate(123)
              //   .send({ from: accounts[0] })
              //   .on('transactionHash', function (hash) {
              //     console.log(hash)
              //   })
              //   .on('confirmation', function (confirmationNumber, receipt) {})
              //   .on('receipt', function (receipt) {
              //     // receipt 相关例子
              //     console.log(receipt)
              //   })
              //   .on('error', function (error, receipt) {
              //     // 如果交易被网络拒绝并带有交易收据，则第二个参数将是交易收据。
              //     console.log(error, receipt)
              //   })
            })
        }
      } else {
        self.$message.error('请安装 MetaMask！')
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
          this.$message.error('请输入账号')
        } else if (password === '') {
          this.$message.error('请输入密码')
        } else if (!reg.test(user)) {
          this.$message.error('请输入2到16位字符的汉字，字母，数字，下划线')
        } else if (!pwdReg.test(password)) {
          this.$message.error(
            '密码应为字母，数字，特殊符号(~!@#$%^&*()_.)，两种及以上组合，8-16位字符串，如：xyl37@baa'
          )
        } else {
          if (this.userType === 'login') {
            login({
              type: 'password',
              data: [user, MD5(password)]
            }).then((data) => {
              setToken(data.token)
              localStorage.setItem('login-type', 'password')
              this.$message.success('登录成功！')
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
              if (data.success === 'ok') {
                this.loginForm = {
                  user,
                  password
                }
                this.$message.success('注册成功！')
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
.login_container {
  background-image: url('../assets/bg.jpg');
  // background-image: url('../assets/quhu-bglogo.jpg');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
  // background-color: #101010;
  color: #fff;
}

.login_box {
  position: relative;
  // color: #c0c0c0;
  width: 80%;
  max-width: 500px;
  min-width: 250px;
  height: 300px;
  // background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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

.login_area {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  right: 10px;
  // top: 10px;
}

.login_area .wallet_login {
  display: inline-block;
  cursor: pointer;
}
.login_area .wallet_login:hover {
  color: $mainColor;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}
::v-deep .el-form-item {
  margin-top: 50px;
}
::v-deep .el-input {
  font-size: 16px;
}
::v-deep .el-input--prefix .el-input__inner {
  padding-left: 50px;
  height: 50px;
  border-radius: 30px;
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
  background-color: #525357;
  border: 1px solid #525357;
  color: #fff;
}
.btns .btn {
  margin-top: 20px;
  width: 450px;
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
.form_container .register_btn {
  position: absolute;
  left: 10px;
  cursor: pointer;
}

.form_container .register_btn:hover {
  color: $mainColor;
}
</style>
