<template>
  <div class="activation_container">
    <div class="activation">
      <div class="activation_header">
        <div
          v-for="(item, i) in activationList"
          :key="i"
          @click="tabDetail(item, i)"
        >
          <div :class="{ item }">
            <img :src="item.image" alt="" />
          </div>
          <div class="label">{{ item.text }}</div>
        </div>
      </div>
      <div class="activation_content">
        <div class="my_header">
          <div class="left_container">
            <div class="title">
              我的活跃度
              <el-tooltip
                class="item"
                effect="dark"
                :content="text"
                placement="top-start"
                popper-class="tool"
              >
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>

            <div class="number">{{ activation }}</div>
          </div>
          <div class="right_container"></div>
        </div>
        <!-- <div class="report">
          <div>积分记录</div>
        </div> -->
      </div>
      <!-- <div class="activation_footer">
        <p>活跃度计算规则：</p>
        <el-table :data="tableData" style="width: 800px">
          <el-table-column prop="type" label="计算方式" width="600px">
          </el-table-column>
          <el-table-column prop="activation" label="额度" width="200px">
          </el-table-column>
        </el-table>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: 0,
      text:
        '登录、消费、专栏发布、创作、点赞评论等都可获得对应活跃度；抄袭、违反反动、黄赌毒会扣减活跃度；' +
        '多账号也会影响活跃度的提升；通过提高活跃度，可获得更多的ofc分配，活跃度在每周分配ofc后清零。',

      // tableData: [
      //   {
      //     type: '创建首个专栏',
      //     activation: '+10'
      //   },
      //   {
      //     type: '第二个及以上专栏',
      //     activation: '+100'
      //   },
      //   {
      //     type: '专栏第一篇文章',
      //     activation: '+50'
      //   },
      //   {
      //     type: '每日创作',
      //     activation: '+10'
      //   },
      //   {
      //     type: '每日满30赞',
      //     activation: '+3'
      //   },
      //   {
      //     type: '每日满15条评论',
      //     activation: '+3'
      //   },
      //   {
      //     type: '邀请1个新用户且完成注册',
      //     activation: '+5'
      //   },
      //   {
      //     type: '所邀请的新用户完成一次充值消费',
      //     activation: '+30'
      //   },
      //   {
      //     type: '购买专栏的相关服务',
      //     activation: '+30'
      //   },
      //   {
      //     type: '抄袭并审核通过',
      //     activation: '-30'
      //   },
      //   {
      //     type: '通用规则',
      //     activation: '每周清零'
      //   }
      // ],
      activationList: [
        // {
        //   image: require('../../assets/activation-shop.png'),
        //   text: '活跃度商城'
        // },
        // {
        //   image: require('../../assets/activation-detail.png'),
        //   text: '活跃度明细'
        // },
        // {
        //   image: require('../../assets/activation-task.png'),
        //   text: '活跃度任务'
        // },
        {
          image: require('../../assets/activation-my.png'),
          text: '我的活跃度'
        }
      ]
    }
  },
  computed: {
    activation() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')).integral
    }
  },
  created() {},
  mounted() {},
  methods: {
    tabDetail(v, i) {
      this.isActive = i
    }
  }
}
</script>

<style scoped lang="scss">
// ::v-deep .tool.el-tooltip__popper.is-dark {
//   max-width: 200px;
// }
.activation_header {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  justify-content: center;
  padding: 20px 100px;
  margin-top: 20px;
  // background-color: #d0d0d0;
  border-radius: 5px;
  .item {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  .active {
    background-color: #daa0a6;
  }
  img {
    width: 60px;
    height: 60px;
  }
  .label {
    margin-top: 20px;
    text-align: center;
  }
}
.activation_content {
  .my_header {
    display: flex;
    background-color: #cecece;
    height: 250px;
    margin-top: 20px;
    .left_container {
      padding: 20px;
      width: 60%;
      .title {
        font-size: 24px;
      }
      .number {
        font-size: 32px;
        font-weight: bold;
        margin-top: 20px;
      }
    }
    .right_container {
      width: calc(40% - 40px);
      background-image: url('../../assets/my-activation.png');
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      height: 100%;
    }
  }
  .activation_footer {
    min-width: 800px;
  }
}
</style>
