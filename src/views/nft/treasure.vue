<template>
  <div ontouchstart="" class="open-body">
    <div class="wrapper">
      <div class="bg rotate"></div>
      <div class="open-has">
        <h3 class="title-open">
          恭喜你，<br />成功领取<span class="user">Bootstrap模板库</span
          >发的全民飞机大战宝箱
        </h3>
        <div class="mod-chest">
          <div class="chest-close show">
            <div class="gift"></div>
            <div class="tips"><i class="arrow"></i></div>
          </div>
          <div class="chest-open">
            <div class="mod-chest-cont open-cont">
              <div class="content">
                <div class="gift">
                  <div class="icon">
                    <img src="static/picture/chest-icon-zuan.png" />
                  </div>
                  x 500
                </div>
                <div class="func">
                  <button class="chest-btn">查看详情并提取</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="open-none" style="display: none">
        <h3>你来晚啦，下次早点吧！</h3>
        <div class="mod-chest">
          <div class="chest-open show"></div>
        </div>
        <div class="func"><button class="chest-btn">查看领取详情</button></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Treasure',
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {
    init() {
      $('.chest-close').click(function () {
        $(this).addClass('shake')
        var that = this
        this.addEventListener(
          'webkitAnimationEnd',
          function () {
            $(that).closest('.open-has').addClass('opened')
            setTimeout(function () {
              $(that).removeClass('show')
              $(that).closest('.mod-chest').find('.chest-open').addClass('show')
              setTimeout(function () {
                $('.chest-open').addClass('blur')
              }, 500)
            }, 200)
          },
          false
        )
      })
    }
  }
}
</script>

<style scoped lang="scss">
/** * 原子类 */ /*常用文字颜色*/
.ui-txt-black {
  color: black;
}
.ui-txt-gray {
  color: gray;
}
.ui-txt-lightgray {
  color: #a6a6a6;
}
.ui-txt-blue {
  color: #0079ff;
} /** * 1px border hack */
.ui-border-top {
  border-top: 1px solid #c8c7cc;
}
.ui-border-btm {
  border-bottom: 1px solid #c8c7cc;
}
.ui-border-tb {
  border-top: #c8c7cc 1px solid;
  border-bottom: #c8c7cc 1px solid;
  background-image: none;
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .ui-border-top {
    border-top: none;
  }
  .ui-border-btm {
    border-bottom: none;
  } /*方法1*/
  .ui-border-top {
    background-position: left top;
    background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(0.5, rgba(0, 0, 0, 0)),
      color-stop(0.5, #c8c7cc),
      to(#c8c7cc)
    );
  }
  .ui-border-btm {
    background-position: left bottom;
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0.5, rgba(0, 0, 0, 0)),
      color-stop(0.5, #c8c7cc),
      to(#c8c7cc)
    );
  }
  .ui-border-top,
  .ui-border-btm {
    background-repeat: repeat-x;
    background-size: 100% 1px;
  }
  .ui-border-tb {
    background: -webkit-gradient(
          linear,
          left bottom,
          left top,
          color-stop(0.5, transparent),
          color-stop(0.5, #c8c7cc),
          to(#c8c7cc)
        )
        left top repeat-x,
      -webkit-gradient(
          linear,
          left top,
          left bottom,
          color-stop(0.5, transparent),
          color-stop(0.5, #c8c7cc),
          to(#c8c7cc)
        ) left bottom repeat-x;
    border-top: 0;
    border-bottom: 0;
  }
  .ui-border-tb {
    background-size: 100% 1px;
    -wekit-background-size: 100% 1px;
  }
} /** * 垂直上下居中 */
.ui-center {
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-box-pack: center;
  -webkit-box-align: center;
  text-align: center;
}

/*button*/
body {
  background: #fff4d2;
  background-size: 320px auto;
}
select {
  -webkit-appearance: none;
  -webkit-padding-end: 20px;
  -webkit-padding-start: 6px;
  background: url('../../assets/fox.jpg') no-repeat #fff right 0px;
  background-size: 34px auto;
  border: #cfba8a 1px solid;
  box-sizing: border-box;
  width: 100%;
  height: 33px;
  outline: none;
  font-size: 12px;
  color: #9e702f;
  padding: 0px 8px;
}
input[type='text'] {
  -webkit-appearance: none;
  border: #cfba8a 1px solid;
  border: #cfba8a 1px solid;
  box-sizing: border-box;
  width: 100%;
  height: 33px;
  outline: none;
  font-size: 12px;
  color: #9e702f;
  padding: 0px 8px;
}
.c-orange {
  color: #ff5400;
}
.c-red {
  color: #cd0000;
}
.c-gray {
  color: rgba(134, 85, 0, 0.7);
}
.chest-btn {
  width: 100%;
  display: block;
  color: #fff;
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#ffa200),
    to(#ffa200)
  );
  height: 44px;
  line-height: 44px;
  border-radius: 3px;
  font-size: 17px;
}
.chest-btn:active {
  background-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#f09902),
    to(#f09902)
  );
}
.btn-weak {
  background: #ff9600;
}
.btn-weak:active {
  background: #ec8c03;
}
.wrapper .ui-border-top {
  border-top: 1px solid #eccf88;
}
.wrapper .ui-border-btm {
  border-bottom: 1px solid #eccf88;
}
.wrapper .ui-border-tb {
  border-top: #eccf88 1px solid;
  border-bottom: #eccf88 1px solid;
  background-image: none;
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .wrapper .ui-border-top {
    border-top: 0;
  }
  .wrapper .ui-border-btm {
    border-bottom: 0;
  }
  .wrapper .ui-border-top {
    background-position: left top;
    background-image: -webkit-gradient(
      linear,
      left bottom,
      left top,
      color-stop(0.5, rgba(0, 0, 0, 0)),
      color-stop(0.5, #eccf88),
      to(#eccf88)
    );
  }
  .wrapper .ui-border-btm {
    background-position: left bottom;
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0.5, rgba(0, 0, 0, 0)),
      color-stop(0.5, #eccf88),
      to(#eccf88)
    );
  }
  .wrapper .ui-border-top,
  .wrapper .ui-border-btm {
    background-repeat: repeat-x;
    background-size: 100% 1px;
  }
  .wrapper .ui-border-tb {
    background: -webkit-gradient(
          linear,
          left bottom,
          left top,
          color-stop(0.5, transparent),
          color-stop(0.5, #eccf88),
          to(#eccf88)
        )
        left top repeat-x,
      -webkit-gradient(
          linear,
          left top,
          left bottom,
          color-stop(0.5, transparent),
          color-stop(0.5, #eccf88),
          to(#eccf88)
        ) left bottom repeat-x;
    border-top: 0;
    border-bottom: 0;
  }
  .wrapper .ui-border-tb {
    background-size: 100% 1px;
    -wekit-background-size: 100% 1px;
  }
}
.mod-chest-cont {
  background: url('../../assets/card.png') center top no-repeat,
    url('../../assets/card.png') center bottom no-repeat;
  background-size: 276px auto;
  width: 276px;
  margin: 27px auto 118px;
  position: relative;
}
.mod-chest-cont:before {
  width: 100%;
  position: absolute;
  top: 12px;
  bottom: 80px;
  left: 0px;
  content: '';
  background: #fff;
  border-left: #e59c00 1px solid;
  border-right: #e59c00 1px solid;
  box-sizing: border-box;
}
.mod-chest-cont .content {
  position: relative;
  z-index: 2;
  padding: 13px;
}
.mod-chest-cont h3 {
  color: #865500;
  font-size: 15px;
}
.mod-chest {
  position: relative;
  width: 100%;
}
.mod-chest .chest-close {
  width: 320px;
  height: 135px;
  opacity: 0;
  position: relative;
  z-index: 1;
  position: absolute;
  left: 50%;
  top: 0px;
  margin-left: -160px;
}
.mod-chest .chest-close .gift {
  width: 320px;
  height: 135px;
  background: url('../../assets/nft/close_blue.jpg') no-repeat 0px 0px;
  background-size: 320px auto;
  position: absolute;
  left: 0;
  top: 0px;
}
.mod-chest .chest-open {
  width: 320px;
  height: 150px;
  background: url('../../assets/nft/close_blue.jpg') no-repeat 0px -137px;
  background-size: 320px auto;
  opacity: 0;
  position: relative;
  z-index: 1;
  position: absolute;
  left: 0px;
  top: 0px;
}
.mod-chest .chest-open .mod-chest-cont {
  position: absolute;
  bottom: -27px;
  left: 50%;
  margin-left: -138px;
}
.mod-chest .show {
  z-index: 2;
  opacity: 1;
}
.chest-icon-zuan {
  position: relative;
  width: 50px;
  overflow: visible;
  height: 0px;
  vertical-align: middle;
  display: inline-block;
}
.chest-icon-zuan:after {
  display: block;
  content: '';
  width: 75px;
  height: 50px;
  position: absolute;
  top: -30px;
  left: 0px;
  background: url('../../assets/nft/close_green.jpg') 0px 0px no-repeat;
  background-size: 75px auto;
  left: -10px;
}
.icon-state-doing,
.icon-state-finish,
.icon-state-expired {
  display: block;
  width: 112px;
  height: 45px;
  background: url('../../assets/nft/close_purple.jpg') 0px 0px no-repeat;
  background-size: 112px auto;
}
.icon-state-doing {
  background-position: 0px -45px;
}
.icon-state-expired {
  background-position: 0px -90px;
}
.icon-gift-xin,
.icon-gift-zuan {
  position: relative;
  width: 15px;
  overflow: visible;
  height: 0px;
  vertical-align: middle;
  display: inline-block;
  margin: 0px 3px;
}
.icon-gift-xin:after,
.icon-gift-zuan:after {
  display: block;
  content: '';
  width: 15px;
  height: 13px;
  position: absolute;
  top: -8px;
  left: 0px;
  background: url('../../assets/nft/close_purple.jpg') 0px 0px no-repeat;
  background-size: 100px auto;
}
.icon-gift-xin:after {
  background-position: -20px 0px;
}
.icon-dot {
  width: 6px;
  height: 6px;
  display: inline-block;
  overflow: hidden;
  background: #ff0000;
  border-radius: 6px;
}
.ui-round {
  -webkit-mask: url('../../assets/nft/close_purple.jpg') 0px 0px no-repeat;
  -webkit-mask-size: 100% auto;
}

.wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
}
.open-body {
  width: 100%;
  overflow: hidden;
  position: fixed;
}
.open-body .bg {
  position: absolute;
  z-index: 1;
  background: url('../../assets/nft/close_purple.jpg') 0px 0px no-repeat;
  background-size: 452px auto;
  width: 452px;
  height: 510px;
  max-height: 100%;
  left: 50%;
  margin-left: -226px;
  top: -25px;
}
.open-body .bg.rotate {
  -webkit-animation: rotate 10s infinite linear;
}
.open-has {
  position: relative;
  z-index: 2;
  height: 450px;
  width: 320px;
  margin: 0px auto;
}
.open-has .title-close {
  opacity: 1;
  -webkit-transition: all 0.5s;
  width: 100%;
  text-align: center;
}
.open-has .title-open {
  opacity: 0;
  -webkit-transition: all 0.5s;
  position: absolute;
  top: 0px;
  left: 0px;
  text-align: center;
  width: 100%;
}
.open-has h3 {
  color: #865500;
  font-size: 15px;
  text-align: center;
  padding-top: 75px;
  padding-bottom: 33px;
}
.open-has h3 .user {
  color: #ff5400;
  margin: 0px 5px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  position: relative;
  white-space: nowrap;
  vertical-align: top;
}
.open-has .title-close .user {
}
.mod-chest .chest-close .tips {
  width: 166px;
  height: 60px;
  background: url('../../assets/nft/close_purple.jpg') 0px 0px no-repeat;
  background-size: 190px auto;
  position: absolute;
  left: 70px;
  top: 145px;
  -webkit-transition: all 0.5s;
}
.mod-chest .chest-close .tips .arrow {
  width: 26px;
  height: 60px;
  background: url('../../assets/nft/close_purple.jpg') right 0px no-repeat;
  background-size: 190px auto;
  position: absolute;
  display: block;
  top: 0px;
  right: -28px;
  -webkit-animation: move 0.7s linear infinite alternate;
}
.mod-chest .chest-close:after {
  width: 320px;
  height: 300px;
  position: absolute;
  top: -100px;
  left: -61px;
  content: '';
  display: block;
}
.mod-chest .chest-close:active {
  -webkit-transform: scale(1.05);
  -webkit-transition: all 0.3s;
}
.mod-chest .chest-close.shake .gift {
  -webkit-animation: shake 1.2s linear;
  -webkit-animation-fill-mode: forwards;
}
.mod-chest .chest-close.shake .tips {
  opacity: 0;
}
.mod-chest .chest-open {
}
.mod-chest .chest-open.blur:after {
  width: 320px;
  height: 68px;
  background: url('../../assets/nft/close_purple.jpg') no-repeat 0px 0px;
  background-size: 320px auto;
  position: relative;
  z-index: 1;
  position: absolute;
  left: 0px;
  top: -5px;
  content: '';
  display: block;
}
.open-has.opened .title-open {
  opacity: 1;
}
.open-has.opened .title-close {
  opacity: 0;
} /*.open-has.opened .mod-chest{-webkit-transform:translate(0px,150px);}*/
.open-has.opened .mod-chest .chest-open {
  -webkit-transform: translate(0px, 150px);
}
.open-has .mod-chest-cont {
  padding: 30px 0px 50px;
  text-align: center;
  overflow: hidden;
  opacity: 0;
  -webkit-transform: translate(
    0px,
    30px
  ); /*-webkit-transition:all .3s .3s;-webkit-transition:all .3s .3s cubic-bezier(.53,1.5,.69,1.81);*/
  z-index: 9;
  -webkit-animation-fill-mode: forwards;
}
.open-has .chest-open.show .mod-chest-cont {
  /*-webkit-transform:translate(0px,0px);opacity: 1;*/
  -webkit-animation: move2 0.2s 0s linear;
  -webkit-animation-fill-mode: forwards;
}
.open-has .mod-chest-cont .gift {
  color: #ff6000;
  font-size: 24px;
  line-height: 30px;
  padding-bottom: 30px;
}
.open-has .mod-chest-cont .gift .icon {
  width: 58px;
  height: 0px;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}
.open-has .mod-chest-cont .gift img {
  width: 75px;
  height: 50px;
  position: absolute;
  top: -28px;
  left: -5px;
}
.open-none {
  position: relative;
  z-index: 2;
  height: 450px;
  width: 320px;
  margin: 0px auto;
}
.open-none .mod-chest {
  height: 150px;
}
.open-none h3 {
  font-size: 15px;
  color: #865500;
  text-align: center;
  padding-top: 35px;
  padding-bottom: 40px;
}
.open-none .func {
  padding: 18px 35px 30px;
}
@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes move {
  0% {
    -webkit-transform: translate(0px, 0px);
  }
  100% {
    -webkit-transform: translate(0px, -5px);
  }
}
@-webkit-keyframes move2 {
  0% {
    -webkit-transform: translate(0px, 30px);
    opacity: 0;
  }
  70% {
    -webkit-transform: translate(0px, -20px);
    opacity: 1;
  }
  100% {
    -webkit-transform: translate(0px, 0px);
    opacity: 1;
  }
}
@-webkit-keyframes shake {
  0% {
    transform: scale(1);
    -webkit-transform: scale3d(1, 1, 1);
  }
  6% {
    -webkit-transform: scale(0.9) rotate(-8deg);
    -webkit-transform: scale3d(1, 1, 1) rotate(0, 0, 1, -8deg);
  }
  18%,
  30%,
  42% {
    -webkit-transform: scale(1.1) rotate(8deg);
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 8deg);
  }
  12%,
  24%,
  36%,
  48% {
    -webkit-transform: scale(1.1) rotate(-8deg);
    -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -8deg);
  }
  54% {
    -webkit-transform: scale(1);
    -webkit-transform: scale3d(1, 1, 1);
  }
  60% {
    -webkit-transform: scale(1);
    -webkit-transform: scale3d(1, 1, 1);
  }
  80% {
    -webkit-transform: scale(1) translate(0px, 150px);
    -webkit-transform: scale3d(1, 1, 1) translate3d(0px, 150px, 0);
  }
  90% {
    -webkit-transform: scale(1) translate(0px, 130px);
    -webkit-transform: scale3d(1, 1, 1) translate3d(0px, 130px, 0);
  }
  100% {
    -webkit-transform: scale(1) translate(0px, 150px);
    -webkit-transform: scale3d(1, 1, 1) translate3d(0px, 150px, 0);
  }
}
.chest-notice {
  text-align: center;
  font-size: 12px;
  line-height: 20px;
  position: relative;
  color: #ff6000;
  padding-bottom: 10px;
}
.chest-notice input {
  position: relative;
  top: 3px;
}
</style>
