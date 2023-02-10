<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-27 12:57:39
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 02:17:02
 * @FilePath: \quhu\src\views\my\changePwd.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="change_pwd">
    <el-input class="pwd_input" v-if="!isEthLogin" v-model="old_password" placeholder="请输入旧密码" show-password clearable></el-input>
    <el-input class="pwd_input" v-model="new_password" placeholder="请输入新密码" show-password clearable></el-input>
    <el-input class="pwd_input" v-model="pwd_again" placeholder="请再次输入新密码" show-password clearable></el-input>
    <el-button class="pwd_btn" type="primary" @click="updatePwd">提交</el-button>
  </div>
</template>

<script>
import { changePwd } from '@/api/user/user'
import { getToken } from '@/utils/auth'
import MD5 from 'MD5'
export default {
  data() {
    return {
      old_password: '',
      new_password: '',
      pwd_again: ''
    }
  },
  computed: {
    isEthLogin() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')).user === 'none'
    }
  },
  created() {},
  mounted() {},
  methods: {
    updatePwd() {
      const self = this
      const token = getToken()
      const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))
      const loginType = sessionStorage.getItem('login-type')
      if (this.new_password === this.pwd_again) {
        if (loginType === 'password') {
          changePwd({
            id: userInfo.user,
            token,
            old_password: MD5(this.old_password),
            new_password: MD5(this.new_password),
            sign: ''
          }).then((res) => {
            // this.$isTabPage = false
            this.$router.go(-1)
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
                          old_password: MD5(self.old_password),
                          new_password: MD5(self.new_password)
                        }).then((res) => {
                          self.$message.success('密码修改成功！')
                          self.$router.push('/setting')
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
    }
  }
}
</script>

<style scoped>
.change_pwd {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 20px;
}
.pwd_input {
  margin-top: 10px;
}
.pwd_btn {
  margin-top: 10px;
  width: 50%;
}
</style>
