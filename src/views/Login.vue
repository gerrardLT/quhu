<template>
  <div class="login_container">
    <div id="login-three-container"></div>
    <div class="login_box">
      <img
        class="logo_container animate__animated animate__backInRight animate__slow"
        src="../assets/quhu-transparant.png"
        alt=""
      />
      <!-- 登录表单区域 -->
      <img class="login-plane-human" src="@/assets/fox_spaceman.png" alt="" />
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
              @keyup.enter.native="passwordLogin"
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
          <button class="btn" type="button" @click="passwordLogin">
            <strong>
              {{
                userType === 'login' ? $t('login.login') : $t('login.register')
              }}</strong
            >
            <div id="container-stars">
              <div id="stars"></div>
            </div>

            <div id="glow">
              <div class="circle"></div>
              <div class="circle"></div>
            </div>
          </button>

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
import * as THREE from 'three'
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import Stats from 'three/examples/jsm/libs/stats.module.js'
import { mapActions } from 'vuex'
import MD5 from 'md5'
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
    this.init3d()
  },
  data() {
    // 数据
    let container // 容器
    let width // 视口宽度
    let height // 视口高度
    const depth = 1400 // 盒模型的深度
    let scene // 场景
    let Sphere_Group // 球组
    let sphereGeometry // 球体几何
    let sphere // 完整球
    let camera // 相机
    let zAxisNumber // 相机在z轴的位置
    const cameraTarget = new THREE.Vector3(0, 0, 0) // 相机目标点
    let materials = [] // 点材质
    let parameters // 点的参数
    let zprogress // 点在z轴上移动的进度
    let zprogress_second // 第二个几何点在z轴上移动的进度
    let particles_first // 粒子1
    let particles_second // 粒子2
    let particles_init_position // 粒子初始化位置
    let cloudParameter_first // 流动的云对象1
    let cloudParameter_second // 流动的云对象2
    let renderCloudMove_first // 云流动的渲染函数1
    let renderCloudMove_second // 云流动的渲染函数2
    // let stats = new Stats(); // 性能监控
    let renderer // 渲染器
    // let gui = new GUI(); // 调试工具

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
      },
      container,
      width,
      height,
      depth,
      scene,
      Sphere_Group,
      sphereGeometry,
      sphere,
      camera,
      zAxisNumber,
      cameraTarget,
      materials,
      parameters,
      zprogress,
      zprogress_second,
      particles_first,
      particles_second,
      particles_init_position,
      cloudParameter_first,
      cloudParameter_second,
      renderCloudMove_first,
      renderCloudMove_second,
      // stats,
      renderer
      // gui,
    }
  },
  computed: {},
  methods: {
    ...mapActions({
      getUser: 'getUserInfo'
    }),
    init3d() {
      this.container = document.getElementById('login-three-container')
      this.width = this.container.clientWidth
      this.height = this.container.clientHeight
      this.initScene()
      this.initSceneBg()
      this.initCamera()
      this.initLight()
      this.initSphereModal()
      this.initSphereGroup()
      this.particles_init_position = -this.zAxisNumber - this.depth / 2
      this.zprogress = this.particles_init_position
      this.zprogress_second = this.particles_init_position * 2
      this.particles_first = this.initSceneStar(this.particles_init_position)
      this.particles_second = this.initSceneStar(this.zprogress_second)
      this.cloudParameter_first = this.initTubeRoute(
        [
          new THREE.Vector3(-this.width / 10, 0, -this.depth / 2),
          new THREE.Vector3(-this.width / 4, this.height / 8, 0),
          new THREE.Vector3(-this.width / 4, 0, this.zAxisNumber)
        ],
        400,
        200
      )
      this.cloudParameter_second = this.initTubeRoute(
        [
          new THREE.Vector3(this.width / 8, this.height / 8, -this.depth / 2),
          new THREE.Vector3(this.width / 8, this.height / 8, this.zAxisNumber)
        ],
        200,
        100
      )
      this.initRenderer()
      this.initOrbitControls()
      this.animate()
    },
    // 初始化场景
    initScene() {
      this.scene = new THREE.Scene()
      // 在场景中添加雾的效果，Fog参数分别代表‘雾的颜色’、‘开始雾化的视线距离’、刚好雾化至看不见的视线距离’
      this.scene.fog = new THREE.Fog(0x000000, 0, 10000)
    },

    // 初始化背景（盒模型背景，视角在盒子里面，看到的是盒子内部）
    initSceneBg() {
      new THREE.TextureLoader().load(require('@/assets/sky.png'), (texture) => {
        const geometry = new THREE.BoxGeometry(
          this.width,
          this.height,
          this.depth
        ) // 创建一个球形几何体 SphereGeometry
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide
        }) // 创建基础为网格基础材料
        const mesh = new THREE.Mesh(geometry, material)
        this.scene.add(mesh)
      })
    },

    // 初始化轨道控制器
    initOrbitControls() {
      const controls = new OrbitControls(this.camera, this.renderer.domElement)
      // enabled设置为true是可以使用鼠标控制视角
      controls.enabled = false
      controls.update()
    },

    // 初始化相机
    initCamera() {
      const fov = 15
      const distance = this.width / 2 / Math.tan(Math.PI / 12)
      this.zAxisNumber = Math.floor(distance - this.depth / 2)
      this.camera = new THREE.PerspectiveCamera(
        fov,
        this.width / this.height,
        1,
        30000
      )
      /**
       * 这里给z轴的距离加了100，原因是做调整，使得视域更完整
       * 这么做并不代表前面计算错误了，根据前面的计算值并不能很完整的看到
       * 至于原因，我想大概就类似于0.1+0.2不等于0.3吧
       * 所以我自作主张地加了100的值做调整（但是不建议，因为当屏幕足够宽时候会看到边缘）
       */
      // camera.position.set(0, 0, zAxisNumber + 100)
      this.camera.position.set(0, 0, this.zAxisNumber)
      this.camera.lookAt(this.cameraTarget)
      // const helper = new THREE.CameraHelper(camera)
      // helper.update()
      // scene.add(helper)
    },

    //光源
    initLight() {
      const ambientLight = new THREE.AmbientLight(0xffffff, 1)
      // 右下角点光源
      const light_rightBottom = new THREE.PointLight(0x0655fd, 5, 0)
      light_rightBottom.position.set(0, 100, -200)
      this.scene.add(light_rightBottom)
      this.scene.add(ambientLight)
    },

    // 初始化球体模型
    initSphereModal() {
      //材质
      let material = new THREE.MeshPhongMaterial()
      material.map = new THREE.TextureLoader().load(
        require('@/assets/earth_bg.png')
      )
      material.blendDstAlpha = 1
      //几何体
      this.sphereGeometry = new THREE.SphereGeometry(50, 64, 32)
      //模型
      this.sphere = new THREE.Mesh(this.sphereGeometry, material)
    },

    // 初始化组 --- 球体
    initSphereGroup() {
      this.Sphere_Group = new THREE.Group()
      this.Sphere_Group.add(this.sphere)
      this.Sphere_Group.position.x = -450
      this.Sphere_Group.position.y = 280
      this.Sphere_Group.position.z = -600
      this.scene.add(this.Sphere_Group)
    },

    // 初始化流动路径
    initTubeRoute(route, geometryWidth, geometryHeigh) {
      const curve = new THREE.CatmullRomCurve3(route, false)
      const tubeGeometry = new THREE.TubeGeometry(curve, 100, 2, 50, false)
      const tubeMaterial = new THREE.MeshBasicMaterial({
        // color: '0x4488ff',
        opacity: 0,
        transparent: true
      })
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
      this.scene.add(tube)

      const clondGeometry = new THREE.PlaneGeometry(
        geometryWidth,
        geometryHeigh
      )
      const textureLoader = new THREE.TextureLoader()
      const cloudTexture = textureLoader.load(require('@/assets/cloud.png'))
      const clondMaterial = new THREE.MeshBasicMaterial({
        map: cloudTexture,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      })
      const cloud = new THREE.Mesh(clondGeometry, clondMaterial)
      this.scene.add(cloud)
      return {
        cloud,
        curve
      }
    },

    // 初始化场景星星效果
    initSceneStar(initZposition) {
      const geometry = new THREE.BufferGeometry()
      const vertices = []
      const pointsGeometry = []
      const textureLoader = new THREE.TextureLoader()
      const sprite1 = textureLoader.load(require('@/assets/starflake1.png'))
      const sprite2 = textureLoader.load(require('@/assets/starflake2.png'))
      this.parameters = [
        [[0.6, 100, 0.75], sprite1, 50],
        [[0, 0, 1], sprite2, 20]
      ]
      // 初始化500个节点
      for (let i = 0; i < 500; i++) {
        /**
         * const x: number = Math.random() * 2 * width - width
         * 等价
         * THREE.MathUtils.randFloatSpread(width)
         */
        const x = THREE.MathUtils.randFloatSpread(this.width)
        const y = _.random(0, this.height / 2)
        const z = _.random(-this.depth / 2, this.zAxisNumber)
        vertices.push(x, y, z)
      }

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      )

      // 创建2种不同的材质的节点（500 * 2）
      for (let i = 0; i < this.parameters.length; i++) {
        const color = this.parameters[i][0]
        const sprite = this.parameters[i][1]
        const size = this.parameters[i][2]

        this.materials[i] = new THREE.PointsMaterial({
          size,
          map: sprite,
          blending: THREE.AdditiveBlending,
          depthTest: true,
          transparent: true
        })
        this.materials[i].color.setHSL(color[0], color[1], color[2])
        const particles = new THREE.Points(geometry, this.materials[i])
        particles.rotation.x = Math.random() * 0.2 - 0.15
        particles.rotation.z = Math.random() * 0.2 - 0.15
        particles.rotation.y = Math.random() * 0.2 - 0.15
        particles.position.setZ(initZposition)
        pointsGeometry.push(particles)
        this.scene.add(particles)
      }
      return pointsGeometry
    },

    // 渲染星球的自转
    renderSphereRotate() {
      if (this.sphere) {
        this.Sphere_Group.rotateY(0.002)
      }
    },

    // 渲染星星的运动
    renderStarMove() {
      const time = Date.now() * 0.00005
      this.zprogress += 1
      this.zprogress_second += 1

      if (this.zprogress >= this.zAxisNumber + this.depth / 2) {
        this.zprogress = this.particles_init_position
      } else {
        this.particles_first.forEach((item) => {
          item.position.setZ(this.zprogress)
        })
      }
      if (this.zprogress_second >= this.zAxisNumber + this.depth / 2) {
        this.zprogress_second = this.particles_init_position
      } else {
        this.particles_second.forEach((item) => {
          item.position.setZ(this.zprogress_second)
        })
      }

      for (let i = 0; i < this.materials.length; i++) {
        const color = this.parameters[i][0]

        const h = ((360 * (color[0] + time)) % 360) / 360
        this.materials[i].color.setHSL(
          color[0],
          color[1],
          parseFloat(h.toFixed(2))
        )
      }
    },

    // 初始化云的运动函数
    initCloudMove(
      cloudParameter,
      speed,
      scaleSpeed = 0.0006,
      maxScale = 1,
      startScale = 0
    ) {
      let cloudProgress = 0
      return () => {
        if (startScale < maxScale) {
          startScale += scaleSpeed
          cloudParameter.cloud.scale.setScalar(startScale)
        }
        if (cloudProgress > 1) {
          cloudProgress = 0
          startScale = 0
        } else {
          cloudProgress += speed
          if (cloudParameter.curve) {
            const point = cloudParameter.curve.getPoint(cloudProgress)
            if (point && point.x) {
              cloudParameter.cloud.position.set(point.x, point.y, point.z)
            }
          }
        }
      }
    },

    //渲染器
    initRenderer() {
      // 开启抗锯齿
      // 在 css 中设置背景色透明显示渐变色
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      // 定义渲染器的尺寸；在这里它会填满整个屏幕
      this.renderer.setSize(this.width, this.height)
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      this.container.appendChild(this.renderer.domElement)
      // this.container.appendChild(this.stats.dom)
      this.renderCloudMove_first = this.initCloudMove(
        this.cloudParameter_first,
        0.0002
      )
      this.renderCloudMove_second = this.initCloudMove(
        this.cloudParameter_second,
        0.0008,
        0.001
      )
    },

    //动画刷新
    animate() {
      requestAnimationFrame(this.animate)
      this.renderSphereRotate()
      this.renderStarMove()
      this.renderCloudMove_first()
      this.renderCloudMove_second()
      this.renderer.render(this.scene, this.camera)
    },
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
    passwordLogin(e) {
      console.log(e)
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
          this.$loading.show()
          if (this.userType === 'login') {
            login({
              type: 'password',
              data: [user, MD5(password)]
            }).then((data) => {
              this.$loading.hide()
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
        const userInfo = JSON.parse(localStorage.getItem('quhu-userInfo'))

this.loginForm.user = (userInfo && userInfo.user) || ''
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
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
  color: #fff;
  position: relative;
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

#login-three-container {
  width: 100%;
  height: 100%;
}
@keyframes humanMove {
  0% {
    top: -100px;
  }
  25% {
    top: -120px;
  }
  50% {
    top: -100px;
  }
  75% {
    top: -80px;
  }
  100% {
    background: -100px;
  }
}
.login-plane-human {
  position: absolute;
  width: 140px;
  height: 240px;
  right: -100px;
  top: -100px;
  animation: humanMove 8s linear 0s infinite normal;
}
.logo_container {
  width: 400px;
  height: 200px;
  position: absolute;
  box-shadow: #c0c0c0;
}
.login_box {
  position: relative;
  width: 500px;
  display: flex;
  justify-content: center;
  // max-width: 500px;
  // min-width: 250px;
  height: 600px;
  border-radius: 3px;
  position: absolute;
  left: calc(50% - 250px);
  top: calc(50% - 350px);
  // backdrop-filter: blur(20px);
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.8);
  opacity: 0.8;
  border-radius: 30px;
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
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 13rem;
  overflow: hidden;
  height: 3rem;
  background-size: 300% 300%;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
  transition: 0.5s;
  animation: gradient_301 5s ease infinite;
  border: double 4px transparent;
  background-image: linear-gradient(#212121, #212121),
    linear-gradient(
      137.48deg,
      #ffdb3b 10%,
      #fe53bb 45%,
      #8f51ea 67%,
      #0044ff 87%
    );
  background-origin: border-box;
  background-clip: content-box, border-box;
}

#container-stars {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: 0.5s;
  backdrop-filter: blur(1rem);
  border-radius: 5rem;
}

strong {
  z-index: 2;
  font-family: 'Avalors Personal Use';
  font-size: 14px;
  letter-spacing: 5px;
  color: #ffffff;
  text-shadow: 0 0 2px white;
}

#glow {
  position: absolute;
  display: flex;
  width: 12rem;
}

.circle {
  width: 100%;
  height: 30px;
  filter: blur(2rem);
  animation: pulse_3011 4s infinite;
  z-index: -1;
}

.circle:nth-of-type(1) {
  background: rgba(254, 83, 186, 0.636);
}

.circle:nth-of-type(2) {
  background: rgba(142, 81, 234, 0.704);
}

.btn:hover #container-stars {
  z-index: 1;
  background-color: #212121;
}

.btn:hover {
  transform: scale(1.1);
}

.btn:active {
  border: double 4px #fe53bb;
  background-origin: border-box;
  background-clip: content-box, border-box;
  animation: none;
}

.btn:active .circle {
  background: #fe53bb;
}

#stars {
  position: relative;
  background: transparent;
  width: 200rem;
  height: 200rem;
}

#stars::after {
  content: '';
  position: absolute;
  top: -10rem;
  left: -100rem;
  width: 100%;
  height: 100%;
  animation: animStarRotate 90s linear infinite;
}

#stars::after {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
}

#stars::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 170%;
  height: 500%;
  animation: animStar 60s linear infinite;
}

#stars::before {
  background-image: radial-gradient(#ffffff 1px, transparent 1%);
  background-size: 50px 50px;
  opacity: 0.5;
}

@keyframes animStar {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-135rem);
  }
}

@keyframes animStarRotate {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0);
  }
}

@keyframes gradient_301 {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

@keyframes pulse_3011 {
  0% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.75);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
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
::v-deep .el-input--prefix .el-input__inner:focus {
  transform: scale(1.05);
  border: 1px solid #fff;
}
::v-deep .el-input--prefix .el-input__inner {
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.3);
  transition: 300ms ease-in-out;
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
  font-size: 14px;
  transition: 300ms ease-in-out;
}
.register_btn:hover {
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
  color: #fff;
  font-size: 14px;
}
.login_area .wallet_login:hover {
  transition: 300ms ease-in-out;
  color: $mainColor;
  font-size: 16px;
}
.form_container .register_btn:hover {
  color: $mainColor;
}
</style>
