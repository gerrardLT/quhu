<template>
  <div class="container">
    <div
      class="tips animate__animated animate__zoomIn animate__slow animate__delay-3s"
    >
      {{ $t('animation.exchange') }}{{ cardName }}!
    </div>
    <canvas id="canvas"></canvas>
    <div
      class="img_container animate__animated animate__zoomIn animate__slow animate__delay-3s"
    >
      <img :src="cardImg" alt="" v-if="showCard" class="img" />
    </div>
    <div
      class="back animate__animated animate__zoomIn animate__slow animate__delay-3s"
      @click="back"
    >
      {{ $t('animation.goback') }}
    </div>
  </div>
</template>

<script>
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  PerspectiveCamera,
  Points,
  RawShaderMaterial,
  Scene,
  WebGLRenderer
} from 'Three'
import { OrbitControls } from 'Three/examples/jsm/controls/OrbitControls'
import GUI from 'Three/examples/jsm/libs/lil-gui.module.min.js'
import { TWEEN } from 'Three/examples/jsm/libs/tween.module.min.js'
const defaultImg = require(`../../assets/fox.jpg`)
const imgClip = require(`../../assets/card.png`)
export default {
  name: 'Animation',
  props: {
    cardName: {
      type: String,
      default: ''
    },
    cardImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      img: defaultImg,
      imgClip: imgClip,
      showCard: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    back() {
      this.showCard = false
      document.querySelector('.img_container').style.display = 'none'
      location.reload()
    },
    init() {
      const count = 128 ** 2

      const scene = new Scene()

      const camera = new PerspectiveCamera(
        60,
        innerWidth / innerHeight,
        0.1,
        100
      )
      const canvas = document.querySelector('#canvas')

      camera.position.set(0, 2, 3)

      const renderer = new WebGLRenderer({ canvas })
      renderer.setSize(innerWidth, innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      const orbit = new OrbitControls(camera, canvas)
      orbit.enablePan = false //禁止平移
      orbit.enableZoom = false //禁止缩放
      // ------------------------ //
      // STAR ALPHA TEXTURE

      const ctx = document.createElement('canvas').getContext('2d')
      ctx.canvas.width = ctx.canvas.height = 32

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, 32, 32)

      let grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      grd.addColorStop(0.0, '#fff')
      grd.addColorStop(1.0, '#000')
      ctx.fillStyle = grd
      ctx.beginPath()
      ctx.rect(15, 0, 2, 32)
      ctx.fill()
      ctx.beginPath()
      ctx.rect(0, 15, 32, 2)
      ctx.fill()

      grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      grd.addColorStop(0.1, '#ffff')
      grd.addColorStop(0.6, '#0000')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, 32, 32)

      const alphaMap = new CanvasTexture(ctx.canvas)

      // ------------------------ //
      // GALAXY

      const galaxyGeometry = new BufferGeometry()

      const galaxyPosition = new Float32Array(count * 3)
      const galaxySeed = new Float32Array(count * 3)
      const galaxySize = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        galaxyPosition[i * 3] = i / count
        galaxySeed[i * 3 + 0] = Math.random()
        galaxySeed[i * 3 + 1] = Math.random()
        galaxySeed[i * 3 + 2] = Math.random()
        galaxySize[i] = Math.random() * 2 + 0.5
      }

      galaxyGeometry.setAttribute(
        'position',
        new BufferAttribute(galaxyPosition, 3)
      )
      galaxyGeometry.setAttribute('size', new BufferAttribute(galaxySize, 1))
      galaxyGeometry.setAttribute('seed', new BufferAttribute(galaxySeed, 3))

      const innColor = new Color('#f40')
      const outColor = new Color('#a7f')

      const galaxyMaterial = new RawShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: renderer.getPixelRatio() },
          uBranches: { value: 2 },
          uRadius: { value: 0 },
          uSpin: { value: Math.PI * 0.25 },
          uRandomness: { value: 0 },
          uAlphaMap: { value: alphaMap },
          uColorInn: { value: innColor },
          uColorOut: { value: outColor }
        },

        vertexShader: `
precision highp float;

attribute vec3 position;
attribute float size;
attribute vec3 seed;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uTime;
uniform float uSize;
uniform float uBranches;
uniform float uRadius;
uniform float uSpin;
uniform float uRandomness;

varying float vDistance;

#define PI  3.14159265359
#define PI2 6.28318530718

#include <random, scatter>



void main() {

  vec3 p = position;
  float st = sqrt(p.x);
  float qt = p.x * p.x;
  float mt = mix(st, qt, p.x);

  // Offset positions by spin (farther wider) and branch num
  float angle = qt * uSpin * (2.0 - sqrt(1.0 - qt));
  float branchOffset = (PI2 / uBranches) * floor(seed.x * uBranches);
  p.x = position.x * cos(angle + branchOffset) * uRadius;
  p.z = position.x * sin(angle + branchOffset) * uRadius;

  // Scatter positions & scale down by Y-axis
  p += scatter(seed) * random(seed.zx) * uRandomness * mt;
  p.y *= 0.5 + qt * 0.5;

  // Rotate (center faster)
  vec3 temp = p;
  float ac = cos(-uTime * (2.0 - st) * 0.5);
  float as = sin(-uTime * (2.0 - st) * 0.5);
  p.x = temp.x * ac - temp.z * as;
  p.z = temp.x * as + temp.z * ac;



  vDistance = mt;

  vec4 mvp = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvp;
  gl_PointSize = (10.0 * size * uSize) / -mvp.z;
}
`,

        fragmentShader: `
precision highp float;

uniform vec3 uColorInn;
uniform vec3 uColorOut;
uniform sampler2D uAlphaMap;

varying float vDistance;

#define PI  3.14159265359



void main() {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  float a = texture2D(uAlphaMap, uv).g;
  if (a < 0.1) discard;

  vec3 color = mix(uColorInn, uColorOut, vDistance);
  float c = step(0.99, (sin(gl_PointCoord.x * PI) + sin(gl_PointCoord.y * PI)) * 0.5);
  color = max(color, vec3(c));

  gl_FragColor = vec4(color, a);
}
`,

        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: AdditiveBlending
      })

      const galaxy = new Points(galaxyGeometry, galaxyMaterial)
      galaxy.material.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace(
          '#include <random, scatter>',
          shaderUtils
        )
      }
      scene.add(galaxy)

      // ------------------------ //
      // UNIVERSE

      const universeGeometry = new BufferGeometry()

      const universePosition = new Float32Array((count * 3) / 2)
      const universeSeed = new Float32Array((count * 3) / 2)
      const universeSize = new Float32Array(count / 2)

      for (let i = 0; i < count / 2; i++) {
        universeSeed[i * 3 + 0] = Math.random()
        universeSeed[i * 3 + 1] = Math.random()
        universeSeed[i * 3 + 2] = Math.random()
        universeSize[i] = Math.random() * 2 + 0.5
      }

      universeGeometry.setAttribute(
        'position',
        new BufferAttribute(universePosition, 3)
      )
      universeGeometry.setAttribute(
        'seed',
        new BufferAttribute(universeSeed, 3)
      )
      universeGeometry.setAttribute(
        'size',
        new BufferAttribute(universeSize, 1)
      )

      const shaderUtils = `
float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 scatter (vec3 seed) {
  float u = random(seed.xy);
  float v = random(seed.yz);
  float theta = u * 6.28318530718;
  float phi = acos(2.0 * v - 1.0);

  float sinTheta = sin(theta);
  float cosTheta = cos(theta);
  float sinPhi = sin(phi);
  float cosPhi = cos(phi);

  float x = sinPhi * cosTheta;
  float y = sinPhi * sinTheta;
  float z = cosPhi;

  return vec3(x, y, z);
}
`

      const universeMaterial = new RawShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uSize: galaxyMaterial.uniforms.uSize,
          uRadius: galaxyMaterial.uniforms.uRadius,
          uAlphaMap: galaxyMaterial.uniforms.uAlphaMap
        },

        vertexShader: `
precision highp float;

attribute vec3 seed;
attribute float size;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uTime;
uniform float uSize;
uniform float uRadius;

#define PI  3.14159265359
#define PI2 6.28318530718

#include <random, scatter>

// Universe size factor
const float r = 3.0;
// Scale universe sphere 
const vec3 s = vec3(2.1, 1.3, 2.1);



void main() {

  vec3 p = scatter(seed) * r * s;

  // Sweep to center
  float q = random(seed.zx);
  for (int i = 0; i < 3; i++) q *= q;
  p *= q;

  // Sweep to surface
  float l = length(p) / (s.x * r);
  p = l < 0.001 ? (p / l) : p;

  // Rotate (center faster)
  vec3 temp = p;
  float ql = 1.0 - l;
  for (int i = 0; i < 3; i++) ql *= ql;
  float ac = cos(-uTime * ql);
  float as = sin(-uTime * ql);
  p.x = temp.x * ac - temp.z * as;
  p.z = temp.x * as + temp.z * ac;



  vec4 mvp = modelViewMatrix * vec4(p * uRadius, 1.0);
  gl_Position = projectionMatrix * mvp;

  // Scale up core stars
  l = (2.0 - l) * (2.0 - l);

  gl_PointSize = (r * size * uSize * l) / -mvp.z;
}
`,

        fragmentShader: `
precision highp float;

uniform sampler2D uAlphaMap;

#define PI 3.14159265359

void main() {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  float a = texture2D(uAlphaMap, uv).g;
  if (a < 0.1) discard;

  gl_FragColor = vec4(vec3(1.0), a);
}
`,

        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: AdditiveBlending
      })

      const universe = new Points(universeGeometry, universeMaterial)
      universe.material.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace(
          '#include <random, scatter>',
          shaderUtils
        )
      }
      scene.add(universe)

      // ------------------------ //
      // GUIs

      const gui = new GUI().close()
      const u = galaxyMaterial.uniforms

      gui.add(u.uSize, 'value', 0, 4, 0.01).name('star size')
      gui.add(u.uBranches, 'value', 1, 5, 1).name('branch num')

      const cRadius = gui.add(u.uRadius, 'value', 0, 5, 0.01).name('scale')
      const cSpin = gui.add(u.uSpin, 'value', -12.57, 12.57, 0.01).name('spin')
      const cRandomness = gui
        .add(u.uRandomness, 'value', 0, 1, 0.01)
        .name('scatter')

      gui
        .addColor({ color: innColor.getHexString() }, 'color')
        .name('inn color')
        .onChange((hex) => {
          const { r, g, b } = new Color(hex)
          u.uColorInn.value = [r, g, b]
        })
      gui
        .addColor({ color: outColor.getHexString() }, 'color')
        .name('out color')
        .onChange((hex) => {
          const { r, g, b } = new Color(hex)
          u.uColorOut.value = [r, g, b]
        })
      // ------------------------ //
      // ANIMATION

      new TWEEN.Tween({
        radius: 0,
        spin: 0,
        randomness: 0,
        rotate: 0
      })
        .to({
          radius: 1.618,
          spin: Math.PI * 2,
          randomness: 0.5,
          rotate: Math.PI * 4
        })
        .duration(6000)
        .easing(TWEEN.Easing.Cubic.InOut)
        // .repeat(Infinity)
        // .repeatDelay(1000)
        // .yoyo(true)
        .onUpdate(({ radius, spin, randomness, rotate }) => {
          cRadius.setValue(radius)
          cRadius.updateDisplay()

          cSpin.setValue(spin)
          cSpin.updateDisplay()

          cRandomness.setValue(randomness)
          cRandomness.updateDisplay()

          galaxy.rotation.y = rotate
          universe.rotation.y = rotate / 3
        })
        .onComplete(() => gui.close())
        .start()

      // ------------------------ //
      // LOOPER

      const t = 0.001
      renderer.setAnimationLoop(() => {
        galaxyMaterial.uniforms.uTime.value += t / 2
        universeMaterial.uniforms.uTime.value += t / 3
        TWEEN.update()
        orbit.update()
        renderer.render(scene, camera)
      })

      // ------------------------ //
      // HELPERS

      addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(innerWidth, innerHeight)
      })
    }
  }
}
</script>

<style>
.container {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
}
.lil-gui.autoPlace {
  display: none;
}
#canvas {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  position: fixed;
  top: 0px;
  /* background-image: radial-gradient(
    100px at center,
    red 0%,
    blue 50%,
    yellow 100%
  ); */

  opacity: 1;
}
.img_container {
  width: 800px;
  height: 800px;
  position: fixed;
  left: calc(50% - 400px);
  top: calc(50% - 500px);
  background-image: url('../../assets/card.png');
  background-size: 100%;
  background-repeat: no-repeat;
  text-align: center;
  line-height: 1122px;
  border-radius: 100px;
  opacity: 0.9;
  box-shadow: 100px 100px 100px 100px rgba(0, 0, 0, 0.5);
  transform: perspective(2000px) rotate3d(1, 0, 0, 30deg);
}
.img {
  width: 156px;
  height: 156px;
  vertical-align: center;
}
.back {
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  position: fixed;
  left: calc(50% - 20px);
  top: calc(50% + 180px);
  height: 40px;
}
.tips {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  z-index: 9999;
  width: 100%;
  text-align: center;
  height: 50px;
  line-height: 50px;
  position: fixed;
  /* left: calc(50% - 10px); */
  top: calc(50% - 250px);
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
