import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import Stats from "three/examples/jsm/libs/stats.module";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import ky from "kyouka";
import * as dat from "dat.gui";
import imagesLoaded from "imagesloaded";
import gsap from "gsap";
import { Maku, getScreenFov } from "maku.js";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
const particleExplodeVertexShader = `
vec4 permute(vec4 x){return mod(((x*34.)+1.)*x,289.);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}

float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    
    // First corner
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    
    // Other corners
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    
    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1=x0-i1+1.*C.xxx;
    vec3 x2=x0-i2+2.*C.xxx;
    vec3 x3=x0-1.+3.*C.xxx;
    
    // Permutations
    i=mod(i,289.);
    vec4 p=permute(permute(permute(
                i.z+vec4(0.,i1.z,i2.z,1.))
                +i.y+vec4(0.,i1.y,i2.y,1.))
                +i.x+vec4(0.,i1.x,i2.x,1.));
                
                // Gradients
                // ( N*N points uniformly over a square, mapped onto an octahedron.)
                float n_=1./7.;// N=7
                vec3 ns=n_*D.wyz-D.xzx;
                
                vec4 j=p-49.*floor(p*ns.z*ns.z);//  mod(p,N*N)
                
                vec4 x_=floor(j*ns.z);
                vec4 y_=floor(j-7.*x_);// mod(j,N)
                
                vec4 x=x_*ns.x+ns.yyyy;
                vec4 y=y_*ns.x+ns.yyyy;
                vec4 h=1.-abs(x)-abs(y);
                
                vec4 b0=vec4(x.xy,y.xy);
                vec4 b1=vec4(x.zw,y.zw);
                
                vec4 s0=floor(b0)*2.+1.;
                vec4 s1=floor(b1)*2.+1.;
                vec4 sh=-step(h,vec4(0.));
                
                vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
                vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
                
                vec3 p0=vec3(a0.xy,h.x);
                vec3 p1=vec3(a0.zw,h.y);
                vec3 p2=vec3(a1.xy,h.z);
                vec3 p3=vec3(a1.zw,h.w);
                
                //Normalise gradients
                vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
                p0*=norm.x;
                p1*=norm.y;
                p2*=norm.z;
                p3*=norm.w;
                
                // Mix final noise value
                vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
                m=m*m;
                return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),
                dot(p2,x2),dot(p3,x3)));
            }
            
            vec3 snoiseVec3(vec3 x){
                return vec3(snoise(vec3(x)*2.-1.),
                snoise(vec3(x.y-19.1,x.z+33.4,x.x+47.2))*2.-1.,
                snoise(vec3(x.z+74.2,x.x-124.5,x.y+99.4)*2.-1.)
            );
        }
        
        vec3 curlNoise(vec3 p){
            const float e=.1;
            vec3 dx=vec3(e,0.,0.);
            vec3 dy=vec3(0.,e,0.);
            vec3 dz=vec3(0.,0.,e);
            
            vec3 p_x0=snoiseVec3(p-dx);
            vec3 p_x1=snoiseVec3(p+dx);
            vec3 p_y0=snoiseVec3(p-dy);
            vec3 p_y1=snoiseVec3(p+dy);
            vec3 p_z0=snoiseVec3(p-dz);
            vec3 p_z1=snoiseVec3(p+dz);
            
            float x=p_y1.z-p_y0.z-p_z1.y+p_z0.y;
            float y=p_z1.x-p_z0.x-p_x1.z+p_x0.z;
            float z=p_x1.y-p_x0.y-p_y1.x+p_y0.x;
            
            const float divisor=1./(2.*e);
            return normalize(vec3(x,y,z)*divisor);
        }
        
        uniform float uTime;
        uniform float uProgress;
        varying vec2 vUv;
        
        void main(){
            vec3 noise=curlNoise(vec3(position.x*.02,position.y*.008,uTime*.05));
            vec3 distortion=vec3(position.x*2.,position.y,1.)*noise*uProgress;
            vec3 newPos=position+distortion;
            vec4 modelPosition=modelMatrix*vec4(newPos,1.);
            vec4 viewPosition=viewMatrix*modelPosition;
            vec4 projectedPosition=projectionMatrix*viewPosition;
            gl_Position=projectedPosition;
            gl_PointSize=2.;
            
            vUv=uv;
        }
`;

const particleExplodeFragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform sampler2D uTexture;

varying vec2 vUv;

void main(){
    vec4 color=texture2D(uTexture,vUv);
    if(color.r<.1&&color.g<.1&&color.b<.1){
        discard;
    }
    gl_FragColor=color;
}
`;
var calcAspect = function (el) { return el.clientWidth / el.clientHeight; };
var getNormalizedMousePos = function (e) {
    return {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
    };
};
var preloadImages = function (sel) {
    if (sel === void 0) { sel = "img"; }
    return new Promise(function (resolve) {
        imagesLoaded(sel, { background: true }, resolve);
    });
};
var MouseTracker = /** @class */ (function () {
    function MouseTracker() {
        this.mousePos = new THREE.Vector2(0, 0);
        this.mouseSpeed = 0;
    }
    // 追踪鼠标位置
    MouseTracker.prototype.trackMousePos = function () {
        var _this = this;
        window.addEventListener("mousemove", function (e) {
            _this.setMousePos(e);
        });
        window.addEventListener("touchstart", function (e) {
            _this.setMousePos(e.touches[0]);
        }, { passive: false });
        window.addEventListener("touchmove", function (e) {
            _this.setMousePos(e.touches[0]);
        });
    };
    // 设置鼠标位置
    MouseTracker.prototype.setMousePos = function (e) {
        var _a = getNormalizedMousePos(e), x = _a.x, y = _a.y;
        this.mousePos.x = x;
        this.mousePos.y = y;
    };
    // 追踪鼠标速度
    MouseTracker.prototype.trackMouseSpeed = function () {
        var _this = this;
        // https://stackoverflow.com/questions/6417036/track-mouse-speed-with-js
        var lastMouseX = -1;
        var lastMouseY = -1;
        var mouseSpeed = 0;
        window.addEventListener("mousemove", function (e) {
            var mousex = e.pageX;
            var mousey = e.pageY;
            if (lastMouseX > -1) {
                mouseSpeed = Math.max(Math.abs(mousex - lastMouseX), Math.abs(mousey - lastMouseY));
                _this.mouseSpeed = mouseSpeed / 100;
            }
            lastMouseX = mousex;
            lastMouseY = mousey;
        });
        document.addEventListener("mouseleave", function () {
            _this.mouseSpeed = 0;
        });
    };
    return MouseTracker;
}());
var Base = /** @class */ (function () {
    function Base(sel, debug) {
        if (debug === void 0) { debug = false; }
        this.debug = debug;
        this.container = document.querySelector(sel);
        this.perspectiveCameraParams = {
            fov: 75,
            near: 0.1,
            far: 100
        };
        this.orthographicCameraParams = {
            zoom: 2,
            near: -100,
            far: 1000
        };
        this.cameraPosition = new THREE.Vector3(0, 3, 10);
        this.lookAtPosition = new THREE.Vector3(0, 0, 0);
        this.rendererParams = {
            alpha: true,
            antialias: true
        };
        this.mouseTracker = new MouseTracker();
    }
    // 初始化
    Base.prototype.init = function () {
        this.createScene();
        this.createPerspectiveCamera();
        this.createRenderer();
        this.createMesh({});
        this.createLight();
        this.createOrbitControls();
        this.createDebugUI();
        this.addListeners();
        this.setLoop();
    };
    // 创建场景
    Base.prototype.createScene = function () {
        var scene = new THREE.Scene();
        this.scene = scene;
    };
    // 创建透视相机
    Base.prototype.createPerspectiveCamera = function () {
        var _a = this, perspectiveCameraParams = _a.perspectiveCameraParams, cameraPosition = _a.cameraPosition, lookAtPosition = _a.lookAtPosition;
        var fov = perspectiveCameraParams.fov, near = perspectiveCameraParams.near, far = perspectiveCameraParams.far;
        var aspect = calcAspect(this.container);
        var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.copy(cameraPosition);
        camera.lookAt(lookAtPosition);
        this.camera = camera;
    };
    // 创建正交相机
    Base.prototype.createOrthographicCamera = function () {
        var _a = this, orthographicCameraParams = _a.orthographicCameraParams, cameraPosition = _a.cameraPosition, lookAtPosition = _a.lookAtPosition;
        var left = orthographicCameraParams.left, right = orthographicCameraParams.right, top = orthographicCameraParams.top, bottom = orthographicCameraParams.bottom, near = orthographicCameraParams.near, far = orthographicCameraParams.far;
        var camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        camera.position.copy(cameraPosition);
        camera.lookAt(lookAtPosition);
        this.camera = camera;
    };
    // 更新正交相机参数
    Base.prototype.updateOrthographicCameraParams = function () {
        var container = this.container;
        var _a = this.orthographicCameraParams, zoom = _a.zoom, near = _a.near, far = _a.far;
        var aspect = calcAspect(container);
        this.orthographicCameraParams = {
            left: -zoom * aspect,
            right: zoom * aspect,
            top: zoom,
            bottom: -zoom,
            near: near,
            far: far,
            zoom: zoom
        };
        // console.log(aspect,this.orthographicCameraParams)
    };
    // 创建渲染
    Base.prototype.createRenderer = function () {
        var rendererParams = this.rendererParams;
        var renderer = new THREE.WebGLRenderer(rendererParams);
        renderer.setClearColor(0x000000, 0);
        this.container.appendChild(renderer.domElement);
        this.renderer = renderer;
        this.resizeRendererToDisplaySize();
    };
    // 调整渲染器尺寸
    Base.prototype.resizeRendererToDisplaySize = function () {
        var renderer = this.renderer;
        renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    // 创建网格
    Base.prototype.createMesh = function (meshObject, container) {
        if (container === void 0) { container = this.scene; }
        var _a = meshObject.geometry, geometry = _a === void 0 ? new THREE.BoxGeometry(1, 1, 1) : _a, _b = meshObject.material, material = _b === void 0 ? new THREE.MeshStandardMaterial({
            color: new THREE.Color("#d9dfc8")
        }) : _b, _c = meshObject.position, position = _c === void 0 ? new THREE.Vector3(0, 0, 0) : _c;
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        container.add(mesh);
        return mesh;
    };
    // 创建光源
    Base.prototype.createLight = function () {
        var dirLight = new THREE.DirectionalLight(new THREE.Color("#ffffff"), 0.5);
        dirLight.position.set(0, 50, 0);
        this.scene.add(dirLight);
        var ambiLight = new THREE.AmbientLight(new THREE.Color("#ffffff"), 0.4);
        this.scene.add(ambiLight);
    };
    // 创建轨道控制
    Base.prototype.createOrbitControls = function () {
        var controls = new OrbitControls(this.camera, this.renderer.domElement);
        var lookAtPosition = this.lookAtPosition;
        controls.target.copy(lookAtPosition);
        controls.update();
        this.controls = controls;
    };
    // 创建调试UI
    Base.prototype.createDebugUI = function () {
        var axisHelper = new THREE.AxesHelper();
        this.scene.add(axisHelper);
        var stats = Stats();
        this.container.appendChild(stats.dom);
        this.stats = stats;
    };
    // 监听事件
    Base.prototype.addListeners = function () {
        this.onResize();
    };
    // 监听画面缩放
    Base.prototype.onResize = function () {
        var _this = this;
        window.addEventListener("resize", function (e) {
            var aspect = calcAspect(_this.container);
            var camera = _this.camera;
            camera.aspect = aspect;
            camera.updateProjectionMatrix();
            _this.resizeRendererToDisplaySize();
            if (_this.shaderMaterial) {
                _this.shaderMaterial.uniforms.uResolution.value.x = window.innerWidth;
                _this.shaderMaterial.uniforms.uResolution.value.y = window.innerHeight;
            }
        });
    };
    // 动画
    Base.prototype.update = function () {
        console.log("animation");
    };
    // 渲染
    Base.prototype.setLoop = function () {
        var _this = this;
        this.renderer.setAnimationLoop(function () {
            _this.update();
            if (_this.controls) {
                _this.controls.update();
            }
            if (_this.stats) {
                _this.stats.update();
            }
            if (_this.composer) {
                _this.composer.render();
            }
            else {
                _this.renderer.render(_this.scene, _this.camera);
            }
        });
    };
    return Base;
}());
export var ParticleExplode = /** @class */ (function (_super) {
    __extends(ParticleExplode, _super);
    function ParticleExplode(sel, debug) {
        var _this = _super.call(this, sel, debug) || this;
        _this.clock = new THREE.Clock();
        _this.cameraPosition = new THREE.Vector3(0, 0, 1500);
        var fov = getScreenFov(_this.cameraPosition.z);
        _this.perspectiveCameraParams = {
            fov: fov,
            near: 0.1,
            far: 5000
        };
        _this.image = document.querySelector("img");
        // console.log(_this.clock,_this.cameraPosition,_this.perspectiveCameraParams)
        _this.params = {
            exposure: 1,
            bloomStrength: 0,
            bloomThreshold: 0,
            bloomRadius: 0
        };
        _this.isOpen = false;
        return _this;
    }
    // 初始化
    ParticleExplode.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.createScene();
                        this.createPerspectiveCamera();
                        this.createRenderer();
                        this.createParticleExplodeMaterial();
                        return [4 /*yield*/, preloadImages()];
                    case 1:
                        _a.sent();
                        this.createMaku();
                        this.createPostprocessingEffect();
                        this.createClickEffect();
                        this.createLight();
                        this.mouseTracker.trackMousePos();
                        this.createOrbitControls();
                        // this.createDebugPanel();
                        this.addListeners();
                        this.setLoop();
                        return [2 /*return*/];
                }
            });
        });
    };
    // 创建材质
    ParticleExplode.prototype.createParticleExplodeMaterial = function () {
        var particleExplodeMaterial = new THREE.ShaderMaterial({
            vertexShader: particleExplodeVertexShader,
            fragmentShader: particleExplodeFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: {
                    value: 0
                },
                uMouse: {
                    value: new THREE.Vector2(0, 0)
                },
                uResolution: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                },
                uProgress: {
                    value: 0
                },
                uTexture: {
                    value: null
                }
            }
        });
        this.particleExplodeMaterial = particleExplodeMaterial;
    };
    // 创建点
    ParticleExplode.prototype.createMaku = function () {
        var _a = this, image = _a.image, particleExplodeMaterial = _a.particleExplodeMaterial, scene = _a.scene;
        var maku = new Maku(image, particleExplodeMaterial, scene, {
            meshType: "points",
            segments: {
                width: 128,
                height: 128
            }
        });
        maku.setPosition();
        this.maku = maku;
    };
    // 创建后期特效
    ParticleExplode.prototype.createPostprocessingEffect = function () {
        var renderScene = new RenderPass(this.scene, this.camera);
        var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = this.params.bloomThreshold;
        bloomPass.strength = this.params.bloomStrength;
        bloomPass.radius = this.params.bloomRadius;
        this.bloomPass = bloomPass;
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);
    };
    // 创建点击效果
    ParticleExplode.prototype.createClickEffect = function () {
        var _this = this;
        var material = this.maku.mesh.material;
        // console.log(this.maku,material)
        this.maku.el.addEventListener("click", function () {
            if (!_this.isOpen) {
                gsap.to(material.uniforms.uProgress, {
                    value: 3,
                    duration: 1
                });
                _this.isOpen = true;
            }
            else {
                gsap.to(material.uniforms.uProgress, {
                    value: 0,
                    duration: 1
                });
                _this.isOpen = false;
            }
        });
    };
    // 动画
    ParticleExplode.prototype.update = function () {
        var elapsedTime = this.clock.getElapsedTime();
        var mousePos = this.mouseTracker.mousePos;
        if (this.maku) {
            var material = this.maku.mesh.material;
            material.uniforms.uTime.value = elapsedTime;
            material.uniforms.uMouse.value = mousePos;
        }
        this.bloomPass.strength = this.params.bloomStrength;
    };
    // 创建调试面板
    ParticleExplode.prototype.createDebugPanel = function () {
        var gui = new dat.GUI();
        var material = this.maku.mesh.material;
        var uniforms = material.uniforms;
        var params = this.params;
        gui
            .add(uniforms.uProgress, "value")
            .min(0)
            .max(3)
            .step(0.01)
            .name("progress");
        gui.add(params, "bloomStrength").min(0).max(10).step(0.01);
    };
    return ParticleExplode;
}(Base));

export const start = function () {
    const particleExplode = new ParticleExplode(".particle-explode", false);
    particleExplode.init();
};

