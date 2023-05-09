<template>
  <div class="casting_container">
    <div class="casting">
      <el-page-header @back="goBack" class="back" title="返回">
      </el-page-header>
      <div class="topic">
        物品栏<span style="font-size: 14px"
          >&nbsp;&nbsp;&nbsp;当前已选中&nbsp;&nbsp;{{
            'common：' +
            cardTypeLength.common +
            ' uncommon：' +
            cardTypeLength.uncommon +
            '张' +
            ' rare：' +
            cardTypeLength.rare +
            '张' +
            ' epic：' +
            cardTypeLength.epic +
            '张' +
            ' legendary：' +
            cardTypeLength.legendary +
            '张'
          }}
        </span>
        <span class="point_num" @click="pointCast">纪念值：{{ point }}</span>
      </div>

      <div class="top">
        <div class="type">
          <el-tag
            v-for="(type, index) in cardTypes"
            :key="type"
            class="type_item animate__animated animate__bounceIn"
            type="info"
            :class="{ active: activeIndex === index }"
            @click="toggle(type, index)"
            effect="dark"
          >
            {{ type }}
          </el-tag>
        </div>
        <div class="cast">
          <el-button
            type="primary"
            class="type_item animate__animated animate__bounceIn"
            @click="castNft('cast')"
            round
            plain
            >铸造</el-button
          >
          <el-button
            type="primary"
            class="type_item animate__animated animate__bounceIn"
            @click="castNft('advanced_cast')"
            round
            plain
            >高级铸造</el-button
          >
        </div>
      </div>
      <el-checkbox
        @change="handleCheckAllChange"
        v-model="checkAllStatus[activeIndex]"
        v-if="currentType !== 'other'"
        class="check_all"
        >全选</el-checkbox
      >

      <div class="middle" v-loading="cardLoading">
        <div
          v-for="item in showCards"
          :key="item.id"
          class="nft animate__animated animate__flipInX"
          :title="item.name"
          @click="handleCardClick(item)"
        >
          <div class="nft_name">{{ item.name }}</div>
          <div class="nft_img">
            <img :src="item.image" alt="" />
          </div>
          <div class="nft_bottom">
            <div class="nft_rarity">{{ item.rarity }}</div>
            <div v-if="item.point">{{ '面值：' + item.point }}</div>
            <div class="check_box" v-if="item.rarity">
              <el-checkbox
                v-model="item.checked"
                class="checkbox-btn"
                @change="
                  (v) => {
                    changeCardCheck(v, item)
                  }
                "
              ></el-checkbox>
            </div>

            <div class="check_box" v-else-if="!item.rarity && !item.point">
              <span>共{{ item.num }}个</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom"></div>
    </div>
    <Animation
      v-if="showAnimation"
      :card-name="castCardType"
      :card-img="cardImg"
    >
    </Animation>
    <el-dialog title="" :visible.sync="castVisible" width="30%">
      <span>{{ cardTips }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="castVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCast">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Animation from './animation.vue'
import { getToken } from '@/utils/auth'
import {
  get_card,
  advanced_fusion,
  fusion,
  open,
  debris,
  get_nft
} from '@/api/nft/nft'
const defaultImg = require('../../assets/fox.jpg')
import { ABI } from '@/utils/abi'
const NFT = require('@/utils/nft.json')
console.log(NFT)
export default {
  name: 'Inventory',
  components: {
    Animation
  },
  data() {
    return {
      cardLoading: false,
      point: 0,
      cardTips: '',
      castVisible: false,
      checkedTreasure: '',
      showAnimation: false,
      sign: '',
      address: '',
      nonce: 0,
      activeIndex: 0,
      isIndeterminate: true,
      checkedCards: [],
      cards: [],
      advanced_cards: [],
      cardList: [],
      showCards: [],
      cardTypes: [
        'all',
        'common',
        'uncommon',
        'rare',
        'epic',
        'legendary',
        'other'
      ],
      filterCards: [],
      checkAllStatus: [false, false, false, false, false, false],
      cardTypeLength: {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0
      },
      castCardType: '',
      cardImg: '',
      currentType: '',
      otherCard: {
        debris_white: {
          num: 0
        },
        debris_green: {
          num: 0
        },
        debris_blue: {
          num: 0
        },
        debris_purple: {
          num: 0
        },
        debris_gold: {
          num: 0
        },
        open_white: {
          num: 0
        },
        open_white: {
          num: 0
        },
        open_green: {
          num: 0
        },
        open_blue: {
          num: 0
        },
        open_purple: {
          num: 0
        },
        open_gold: {
          num: 0
        },
        close_white: {
          num: 0
        },
        close_white: {
          num: 0
        },
        close_green: {
          num: 0
        },
        close_blue: {
          num: 0
        },
        close_purple: {
          num: 0
        },
        close_gold: {
          num: 0
        }
      }
    }
  },
  created() {},
  mounted() {
    this.getCard()
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')) || {}
    },
    loginType() {
      return localStorage.getItem('login-type')
    }
  },
  methods: {
    async getNftIds() {
      const web3 = new this.Web3('https://1rpc.io/bnb')

      const contractABI = NFT

      const contractAddress = '0x525A4964162738c1010e1998AbA190964d95fA9a' // 合约地址

      const contract = new web3.eth.Contract(contractABI, contractAddress)

      const userAddress = sessionStorage.getItem('walletAccount') // 用户地址
      if (userAddress) {
        const nftIds = await contract.methods.getOwnerNFTs(userAddress).call()

        return nftIds
      } else {
        this.$message.waring('请使用metamask连接后刷新页面')
      }
    },
    async getNft(ids) {
      const params = { nft_id: ids }
      const res = await get_nft(params)
      if (res && res.success === 'ok') {
        this.point = res.point
        return res.data
      }
    },
    async getMetaData(type) {
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
              const nonceTypeObj = {
                cast: 'fusion',
                advanced_cast: 'fusion',
                open: 'open',
                debris: 'debris'
              }
              const nonceType = nonceTypeObj[type]
              self.web3 = web3
              self.nonce = Math.floor(Math.random() * 900000 + 100000)
              web3.eth.personal.sign(
                web3.utils.utf8ToHex(nonceType + self.nonce),
                accounts[0],
                (err, res) => {
                  if (err) {
                    self.$message.error('签名失败，因为' + err.message)
                  } else {
                    console.log('签名后的数据：', res)
                    self.sign = res
                    self.address = accounts[0]

                    if (type === 'cast') {
                      self.fusion(res, accounts[0], self.nonce)
                    } else if (type === 'advanced_cast') {
                      self.advanceFusion(res, accounts[0], self.nonce)
                    } else if (type === 'open' || type === 'debris') {
                      self.handleCast(res, accounts[0], self.nonce)
                    }
                  }
                }
              )
            })
        }
      } else {
        self.$message.error('请安装 MetaMask！')
      }
    },
    getCheckedCardsId() {
      const idArr = []
      console.log(this.cardList)
      this.cardList.forEach((element) => {
        if (element.checked === true && element.rarity) {
          idArr.push(element.id)
        }
      })
      return idArr
    },
    validateId(type) {
      this.checkedCards = []
      this.cardList.forEach((element) => {
        if (element.checked === true && element.rarity) {
          this.checkedCards.push(element)
        }
      })
      console.log(this.checkedCards)
      if (type === 'cast') {
        if (this.checkedCards.length !== 16) {
          this.$message.warning(
            '铸造需任意16张nft！当前已选择' + this.checkedCards.length + '张'
          )
          return false
        } else {
          return true
        }
      } else if (type === 'advanced_cast') {
        const commonArr = [],
          uncommonArr = [],
          rareArr = [],
          epicArr = [],
          legendaryArr = []
        this.checkedCards.forEach((item) => {
          if (item.rarity === 'common') {
            commonArr.push(item)
          } else if (item.rarity === 'uncommon') {
            uncommonArr.push(item)
          } else if (item.rarity === 'rare') {
            rareArr.push(item)
          } else if (item.rarity === 'epic') {
            epicArr.push(item)
          } else if (item.rarity === 'legendary') {
            legendaryArr.push(item)
          }
        })

        if (
          uncommonArr.length !== 1 ||
          rareArr.length !== 3 ||
          epicArr.length !== 6 ||
          legendaryArr.length !== 8
        ) {
          this.$message.warning(
            '高级铸造需legendary 8张+epic 6张+rare 3张+uncommon 1张方可合成！'
          )
          return false
        } else {
          return true
        }
      }
    },
    pointCast() {
      if (this.point < 300) {
        this.$message.warning('合成需要300纪念值！')
        return
      }

      this.checkedTreasure = {
        name: 'debris',
        type: 'super_fox'
      }
      this.castVisible = true
      this.cardTips = '确认消耗300纪念值合成吗？'
    },
    handleCardClick(item) {
      //   console.log(item.name)
      this.checkedTreasure = item

      if (item.name.indexOf('debris') !== -1) {
        this.castVisible = true
        if (item.num > 10) {
          this.cardTips = '确认花费10个宝箱碎片合成一个宝箱吗？'
        } else {
          this.$message.warning('需要10个宝箱碎片方可合成！')
          return
        }

        // if (item.point) {
        //   this.cardTips = '确认花费300个纪念币进行合成？'
        // }
      }

      if (item.name.indexOf('Treasure') !== -1 && item.states === 'close') {
        this.castVisible = true
        this.cardTips = '确认打开宝箱吗？'
      }
    },
    confirmCast() {
      this.castVisible = false
      if (this.checkedTreasure.name.indexOf('debris') !== -1) {
        this.getMetaData('debris')
      } else {
        this.getMetaData('open')
      }
    },
    async handleCast(sign, address, nonce) {
      console.log(this.checkedTreasure)
      if (this.checkedTreasure.name.indexOf('debris') !== -1) {
        //碎片及纪念值

        const res = await debris({
          id:
            this.loginType === 'eth'
              ? this.userInfo.eth_account
              : this.userInfo.user,
          token: getToken(),
          address,
          sign,
          nonce,
          type:
            this.checkedTreasure.type === 'super_fox'
              ? 'super_fox'
              : 'debris_' + this.checkedTreasure.type
        })
        if (res && res.success === 'ok') {
          this.$message.success(
            '恭喜你获得' + this.checkedTreasure.type + '宝箱一个！'
          )
          this.checkedTreasure.num -= 10
          this.getCard()
        }
      } else {
        const res = await open({
          id:
            this.loginType === 'eth'
              ? this.userInfo.eth_account
              : this.userInfo.user,
          token: getToken(),
          address,
          sign,
          nonce,
          nft_id: this.checkedTreasure.id
        })
        if (res && res.success === 'ok') {
          let text = ''
          res.data.attributes.forEach((item) => {
            if (item.trait_type === 'prize') {
              text += '、' + item.value
            }
          })
          this.$message.success('恭喜你获得' + text + '！')
          this.checkedTreasure.num -= 1
          this.getCard()
        }
      }
    },
    castNft(type) {
      this.getCheckedCardsId()
      if (!this.validateId(type)) {
        return
      }

      this.getMetaData(type)
    },
    async fusion(sign, address, nonce) {
      const arr = this.getCheckedCardsId()

      const params = {
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        address,
        sign,
        nonce,
        nft_id: arr
      }

      const res = await fusion(params)
      if (res && res.success === 'ok') {
        this.showAnimation = true
        this.cardImg = res.data.image
        this.castCardType = res.data.name
        this.checkedCards = []
      }
    },
    async advanceFusion(sign, address, nonce) {
      const arr = this.getCheckedCardsId()
      const params = {
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        address,
        sign,
        nonce,
        nft_id: arr
      }
      const res = await advanced_fusion(params)
      if (res && res.success === 'ok') {
        this.showAnimation = true
        this.cardImg = res.data.image
        this.castCardType = res.data.name
        this.checkedCards = []
      }
    },
    toggle(type, index) {
      this.activeIndex = index
      this.currentType = type
      this.checkAllStatus[this.activeIndex] = this.checkAllStatus[0]
      let flag = true
      const otherCards = []
      Object.keys(this.otherCard).forEach((item) => {
        if (this.otherCard[item].id) {
          otherCards.push(this.otherCard[item])
        }
      })
      let filterCards = this.cardList.filter((item) => {
        return item.rarity === type
      })
      let anniversaryCards = this.cardList.filter((item) => {
        return item.point
      })
      this.filterCards = filterCards
      if (type === 'all') {
        this.showCards = this.cardList
      } else if (type === 'other') {
        this.showCards = otherCards.concat(anniversaryCards)
      } else {
        this.showCards = filterCards
      }
      this.showCards.forEach((item) => {
        if (!item.checked) {
          flag = false
        }
        this.checkAllStatus[this.activeIndex] = flag
      })
    },
    changeCardCheck(v, item) {
      if (v) {
        this.cardTypeLength[item.rarity] = this.cardTypeLength[item.rarity] + 1
      } else {
        this.cardTypeLength[item.rarity] = this.cardTypeLength[item.rarity] - 1
      }
    },
    handleCheckAllChange(v) {
      if (v) {
        if (this.cardTypes[this.activeIndex] === 'all') {
          this.cardTypeLength = {
            common: 0,
            uncommon: 0,
            rare: 0,
            epic: 0,
            legendary: 0
          }
          this.cardList.forEach((item) => {
            this.cardTypeLength[item.rarity] += 1
          })
        } else {
          this.cardTypeLength[this.cardTypes[this.activeIndex]] +=
            this.showCards.length
        }

        this.showCards.forEach((item, i) => {
          if (
            item.rarity === this.cardTypes[this.activeIndex] ||
            this.cardTypes[this.activeIndex] === 'all'
          ) {
            item.checked = true
          }
        })
      } else {
        if (this.cardTypes[this.activeIndex] === 'all') {
          this.cardList.forEach((item) => {
            this.cardTypeLength[item.rarity] = 0
          })
        } else {
          this.cardTypeLength[this.cardTypes[this.activeIndex]] = 0
        }

        this.showCards.forEach((item, i) => {
          if (
            item.rarity === this.cardTypes[this.activeIndex] ||
            this.cardTypes[this.activeIndex] === 'all'
          ) {
            item.checked = false
          }
        })
      }
      this.checkAllStatus[this.activeIndex] = v
    },
    handlecheckedCardsChange() {},
    goBack() {
      this.$EventBus.$emit('changeTab', { name: 'nft' }, 1)
    },
    async getCard() {
      //   this.cardLoading = true
      //   const res = await get_card({})
      //   this.cards = res.data.card_16
      //   this.advanced_cards = res.data.card_18
      //   let result = await this.getNft(this.cards.concat(this.advanced_cards))
      const ids = await this.getNftIds()

      let result = await this.getNft(ids)

      //   const mock = [
      //     {
      //       nft_id: 395,
      //       name: 'Commemorative coin # 0',
      //       description:
      //         "The Cyber Fox are a very unique being, representing an independent thinking, anti-traditional and freedom-seeking attitude. They not only have the agility and dexterity of foxes, but also incorporate a lot of high-tech elements, such as mechanized bodies and advanced electronic devices. Cyber Foxes are the world's only hope for redemption from rebellion.",
      //       image:
      //         'https://cdn.steemitimages.com/DQmdJ6yGBLjKDj1yQzWKbRoDKW4ZctymMwGRKJt8y2vcr5D/bi1.jpg',
      //       attributes: [{ trait_type: 'point', value: 1 }]
      //     },
      //     {
      //       nft_id: 401,
      //       name: 'Commemorative coin # 1',
      //       description:
      //         "The Cyber Fox are a very unique being, representing an independent thinking, anti-traditional and freedom-seeking attitude. They not only have the agility and dexterity of foxes, but also incorporate a lot of high-tech elements, such as mechanized bodies and advanced electronic devices. Cyber Foxes are the world's only hope for redemption from rebellion.",
      //       image:
      //         'https://cdn.steemitimages.com/DQmdJ6yGBLjKDj1yQzWKbRoDKW4ZctymMwGRKJt8y2vcr5D/bi1.jpg',
      //       attributes: [{ trait_type: 'point', value: 5 }]
      //     },
      //     {
      //       nft_id: 403,
      //       name: 'Commemorative coin # 2',
      //       description:
      //         "The Cyber Fox are a very unique being, representing an independent thinking, anti-traditional and freedom-seeking attitude. They not only have the agility and dexterity of foxes, but also incorporate a lot of high-tech elements, such as mechanized bodies and advanced electronic devices. Cyber Foxes are the world's only hope for redemption from rebellion.",
      //       image:
      //         'https://cdn.steemitimages.com/DQmdJ6yGBLjKDj1yQzWKbRoDKW4ZctymMwGRKJt8y2vcr5D/bi1.jpg',
      //       attributes: [{ trait_type: 'point', value: 5 }]
      //     },
      //     {
      //       nft_id: 396,
      //       name: 'debris_white # 0',
      //       description:
      //         "The Cyber Fox are a very unique being, representing an independent thinking, anti-traditional and freedom-seeking attitude. They not only have the agility and dexterity of foxes, but also incorporate a lot of high-tech elements, such as mechanized bodies and advanced electronic devices. Cyber Foxes are the world's only hope for redemption from rebellion.",
      //       image:
      //         'https://cdn.steemitimages.com/DQmcXydBLfFF4KPG5WySaFHHLo6UvAjT4w4WDkTwoV62crH/open_w.jpg',
      //       attributes: [{ trait_type: 'debris', value: 'white' }]
      //     },
      //     {
      //       nft_id: 397,
      //       name: 'Treasure box # 0',
      //       description:
      //         "The Cyber Fox are a very unique being, representing an independent thinking, anti-traditional and freedom-seeking attitude. They not only have the agility and dexterity of foxes, but also incorporate a lot of high-tech elements, such as mechanized bodies and advanced electronic devices. Cyber Foxes are the world's only hope for redemption from rebellion.",
      //       image:
      //         'https://cdn.steemitimages.com/DQmSVcn55SqodwMaXuesBMnK47yL4Gz37WUESTqvYxZhFgL/open_w.jpg',
      //       attributes: [
      //         { trait_type: 'treasure box', value: 'white' },
      //         { trait_type: 'states', value: 'open' },
      //         { trait_type: 'prize', value: '1000poys' }
      //       ]
      //     },
      //     {
      //       nft_id: 399,
      //       name: 'Treasure box # 0',
      //       description:
      //         "The Cyber Fox are a very unique being, representing an independent thinking, anti-traditional and freedom-seeking attitude. They not only have the agility and dexterity of foxes, but also incorporate a lot of high-tech elements, such as mechanized bodies and advanced electronic devices. Cyber Foxes are the world's only hope for redemption from rebellion.",
      //       image:
      //         'https://cdn.steemitimages.com/DQmSVcn55SqodwMaXuesBMnK47yL4Gz37WUESTqvYxZhFgL/close_w.jpg',
      //       attributes: [
      //         { trait_type: 'treasure box', value: 'white' },
      //         { trait_type: 'states', value: 'close' }
      //       ]
      //     },
      //     {
      //       name: 'Cyber Fox # 2',
      //       description:
      //         "The Cyber Fox are a very unique being, representing an independent thinking, anti-traditional and freedom-seeking attitude. They not only have the agility and dexterity of foxes, but also incorporate a lot of high-tech elements, such as mechanized bodies and advanced electronic devices. Cyber Foxes are the world's only hope for redemption from rebellion.",
      //       image:
      //         'https://cdn.steemitimages.com/DQmPRmj1kf8Mh8LuWer9dbcD8uWiHopoamYRCfGdVganCBz/fox%20(1).jpg',
      //       attributes: [
      //         {
      //           trait_type: 'body',
      //           value: 'flesh'
      //         },
      //         {
      //           trait_type: 'equip',
      //           value: 'Combat Uniform'
      //         },
      //         {
      //           trait_type: 'decoration',
      //           value: 'Gemstone'
      //         },
      //         {
      //           trait_type: 'makeup',
      //           value: 'Tattoos'
      //         },
      //         {
      //           trait_type: 'rarity',
      //           value: 'uncommon'
      //         },
      //         {
      //           trait_type: 'type',
      //           value: 1
      //         }
      //       ],
      //       nft_id: 333
      //     }
      //   ]
      //   for (let index = 0; index < 10; index++) {
      //     result.push({
      //       nft_id: 398,
      //       name: 'Treasure box # 0',
      //       description:
      //         "The Cyber Fox are a very unique being, representing an independent thinking, anti-traditional and freedom-seeking attitude. They not only have the agility and dexterity of foxes, but also incorporate a lot of high-tech elements, such as mechanized bodies and advanced electronic devices. Cyber Foxes are the world's only hope for redemption from rebellion.",
      //       image:
      //         'https://cdn.steemitimages.com/DQmSVcn55SqodwMaXuesBMnK47yL4Gz37WUESTqvYxZhFgL/close_w.jpg',
      //       attributes: [
      //         { trait_type: 'treasure box', value: 'white' },
      //         { trait_type: 'states', value: 'close' }
      //       ]
      //     })
      //     result.push({
      //       nft_id: 394,
      //       name: 'debris_white # 0',
      //       description:
      //         "The Cyber Fox are a very unique being, representing an independent thinking, anti-traditional and freedom-seeking attitude. They not only have the agility and dexterity of foxes, but also incorporate a lot of high-tech elements, such as mechanized bodies and advanced electronic devices. Cyber Foxes are the world's only hope for redemption from rebellion.",
      //       image:
      //         'https://cdn.steemitimages.com/DQmcXydBLfFF4KPG5WySaFHHLo6UvAjT4w4WDkTwoV62crH/open_w.jpg',
      //       attributes: [{ trait_type: 'debris', value: 'white' }]
      //     })
      //   }
      //   result = result.concat(mock)

      result.forEach((ele) => {
        ele.content = {}
        if (ele.attributes) {
          ele.attributes.forEach((attr) => {
            let type, states, prize, rarity, point, debris
            if (attr.trait_type === 'treasure box') {
              type = attr.value
              ele.content.type = attr.value
            }
            if (attr.trait_type === 'states') {
              states = attr.value
              ele.content.states = attr.value
            }
            if (attr.trait_type === 'prize') {
              prize = attr.value
              ele.content.prize = attr.value
            }
            if (attr.trait_type === 'rarity') {
              rarity = attr.value
              ele.content.rarity = attr.value
            }
            if (attr.trait_type === 'point') {
              point = attr.value
              ele.content.point = attr.value
            }
            if (attr.trait_type === 'debris') {
              debris = attr.value
              ele.content.debris = attr.value
            }
          })
        }
      })

      result.forEach((element) => {
        if (element.content) {
          const content = element.content
          if (content.rarity) {
            this.cardList.push({
              checked: false,
              image: element.image,
              name: element.name,
              rarity: content.rarity,
              id: element.nft_id
            })
          }

          if (content.point) {
            this.cardList.push({
              image: element.image,
              name: element.name,
              point: content.point,
              id: element.nft_id
            })
          }

          if (content.debris) {
            this.otherCard['debris_' + content.debris].num += 1
            this.otherCard['debris_' + content.debris].image = element.image
            this.otherCard['debris_' + content.debris].name = element.name
            this.otherCard['debris_' + content.debris].id = element.nft_id
            this.otherCard['debris_' + content.debris].type = content.debris
          }

          if (content.states && content.type && !content.prize) {
            this.otherCard[content.states + '_' + content.type].num += 1
            this.otherCard[content.states + '_' + content.type].image =
              element.image
            this.otherCard[content.states + '_' + content.type].name =
              element.name
            this.otherCard[content.states + '_' + content.type].id =
              element.nft_id
            this.otherCard[content.states + '_' + content.type].type =
              content.type
            this.otherCard[content.states + '_' + content.type].states =
              content.states
          }
          if (content.states && content.type && content.prize) {
            this.otherCard[content.states + '_' + content.type].num += 1
            this.otherCard[content.states + '_' + content.type].image =
              element.image
            this.otherCard[content.states + '_' + content.type].name =
              element.name
            this.otherCard[content.states + '_' + content.type].id =
              element.nft_id
            this.otherCard[content.states + '_' + content.type].prize =
              content.prize
            this.otherCard[content.states + '_' + content.type].type =
              content.type
            this.otherCard[content.states + '_' + content.type].states =
              content.states
          }
        }
      })
      Object.keys(this.otherCard).forEach((item) => {
        if (this.otherCard[item].id) {
          this.cardList.push(this.otherCard[item])
        }
      })

      console.log(this.cardList)
      this.showCards = this.cardList
      this.cardLoading = false
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-tag--dark.el-tag--info {
  border-radius: 20px;
  min-width: 60px;
  height: 35px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
::v-deep .el-button--primary.is-plain {
  color: #087790;
}
::v-deep .el-button--primary.is-plain:focus,
.el-button--primary.is-plain:hover {
  background-color: #087790;
  color: #fff;
}
.active {
  background-color: #087790;
  font-weight: bold;
}
::v-deep .el-tag--dark.el-tag--info:hover {
  background-color: #087790;
}
::-webkit-scrollbar {
  width: 0.75rem;
  height: 0.75rem;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0.375rem #999;
  border-radius: 0.625rem;
  background-color: #f5f5f5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 0.625rem;
  box-shadow: inset 0 0 0.375rem #999;
  background-color: #333;
}
.casting_container {
  .casting {
    // display: flex;
    // justify-content: center;
    position: relative;
    padding: 20px 10% 0;
    .back {
      padding-left: calc(10% + 20px);
      margin-bottom: 40px;
    }
    .topic {
      width: 80%;
      padding-left: calc(10% + 20px);
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      position: relative;
      .point_num {
        position: absolute;
        right: 50px;
        top: 5px;
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
      }
    }
    .top {
      height: 60px;
      width: 80%;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      padding-left: calc(10% + 20px);
      position: relative;
      .type {
        .type_item {
          margin-right: 10px;
        }
      }
      .cast {
        position: absolute;
        right: 40px;
        .type_item {
          margin-right: 10px;
        }
      }
    }
    .check_all {
      padding-left: calc(10% + 20px);
      margin-bottom: 20px;
    }
    .middle {
      display: flex;
      padding-left: 10%;
      flex-wrap: wrap;
      width: 80%;
      max-height: 800px;
      overflow-y: auto;
      overflow-x: hidden;

      .nft {
        width: calc(13.33% - 40px);
        margin: 0 20px 20px 20px;
        padding: 20px;
        background: rgba(63, 114, 175, 0.07);
        border-radius: 15px;
        min-width: 110px;
        cursor: pointer;
        &:hover {
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.07);
          background-color: #fff;
          transform: translate(0, -10px);
          transition: all 0.3s ease;
        }
        .nft_name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 20px;
          //   overflow: hidden;
          //   white-space: nowrap;
          //   text-overflow: ellipsis;
        }
        .nft_img {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          img {
            border-radius: 15px;
            min-width: 80px;
            min-height: 80px;
            max-width: 200px;
            max-height: 200px;
            vertical-align: middle;
          }
        }
        .nft_bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .nft_rarity {
          }
          .check_box {
          }
        }
      }
    }
    .bottom {
    }
  }
}
</style>
