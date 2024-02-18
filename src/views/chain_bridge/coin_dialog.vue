<template>
  <div class="coin_list_container">
    <div v-if="!isExpand">
      <div class="ChooseChain__Wrapper-sc-3e09771a-0 ePsPCl">
        <div
          :class="{
            'GradientBorderButton__Wrapper-sc-3f147dcd-0': true,
            dpplCs: true,
            active: selectedNetIndex === index
          }"
          @click="selectNet(index)"
          v-for="(net, index) in netList"
          :key="index"
          transform="1"
        >
          <button :class="{ active: selectedNetIndex === index }">
            <div
              :class="{
                item: true,
                'SwapTooltip__SwapTooltipWrapper-sc-c2f6a320-0': true,
                bBLEIb: true,
                active: selectedNetIndex === index
              }"
            >
              <img class="icon" width="36" height="36" :src="net.icon" alt="" />
            </div>
          </button>
        </div>

        <div v-if="false">
          <div
            class="GradientBorderButton__Wrapper-sc-3f147dcd-0 dpplCs false"
            @click="expandNetList"
          >
            <button class="false">
              <div class="item name">+{{ netList.length - 5 }}</div>
            </button>
          </div>
        </div>
      </div>
      <div class="style__SearchWrapper-sc-ba7bc79b-0 bReJrc">
        <input
          type="text"
          class="search"
          @input="searchToken"
          :placeholder="
            $t('bridge.search_token') +
            ' ' +
            (this.selectedNetIndex &&
              netList[this.selectedNetIndex] &&
              netList[this.selectedNetIndex].name)
          "
        /><img
          class="search-icon"
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTkuNTIxMTY1NHB4IiBoZWlnaHQ9IjE5LjUyMTE2NTRweCIgdmlld0JveD0iMCAwIDE5LjUyMTE2NTQgMTkuNTIxMTY1NCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDx0aXRsZT5zZWFyY2g8L3RpdGxlPgogICAgPGcgaWQ9IumhtemdouaUueeJiCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InN3YXBfU291cmNlLVRva2VuIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTk4LjIyOTI2OSwgLTIyNy4yMjkyNjkpIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0xMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTgwLjAwMDAwMCwgODIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ic2VhcmNoIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNi4wMDAwMDAsIDE0My4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjEuNTMwNjI1LDIwLjQ2OTM3NSBMMTYuODM2NTYyNSwxNS43NzYyNSBDMTkuNjYyOTEyNywxMi4zODMwMzYgMTkuMzIwNDQzNSw3LjM2NjkzMzc4IDE2LjA1OTEzMzQsNC4zODkzNDg1NSBDMTIuNzk3ODIzMywxLjQxMTc2MzMyIDcuNzcxMzQxNzksMS41MjU5OTgzNyA0LjY0ODY3MDA4LDQuNjQ4NjcwMDggQzEuNTI1OTk4MzcsNy43NzEzNDE3OSAxLjQxMTc2MzMyLDEyLjc5NzgyMzMgNC4zODkzNDg1NSwxNi4wNTkxMzM0IEM3LjM2NjkzMzc4LDE5LjMyMDQ0MzUgMTIuMzgzMDM2LDE5LjY2MjkxMjcgMTUuNzc2MjUsMTYuODM2NTYyNSBMMjAuNDY5Mzc1LDIxLjUzMDYyNSBDMjAuNjU4OTQ5MSwyMS43MjAxOTkxIDIwLjkzNTI1OTMsMjEuNzk0MjM2MSAyMS4xOTQyMjIyLDIxLjcyNDg0NzIgQzIxLjQ1MzE4NTIsMjEuNjU1NDU4MyAyMS42NTU0NTgzLDIxLjQ1MzE4NTIgMjEuNzI0ODQ3MiwyMS4xOTQyMjIyIEMyMS43OTQyMzYxLDIwLjkzNTI1OTMgMjEuNzIwMTk5MSwyMC42NTg5NDkxIDIxLjUzMDYyNSwyMC40NjkzNzUgWiBNMy43NSwxMC41IEMzLjc1LDYuNzcyMDc3OTQgNi43NzIwNzc5NCwzLjc1IDEwLjUsMy43NSBDMTQuMjI3OTIyMSwzLjc1IDE3LjI1LDYuNzcyMDc3OTQgMTcuMjUsMTAuNSBDMTcuMjUsMTQuMjI3OTIyMSAxNC4yMjc5MjIxLDE3LjI1IDEwLjUsMTcuMjUgQzYuNzczNzkxMzcsMTcuMjQ1ODY2NyAzLjc1NDEzMzM1LDE0LjIyNjIwODYgMy43NSwxMC41IEwzLjc1LDEwLjUgWiIgaWQ9IuW9oueKtiIgZmlsbD0iIzZCN0Q4RSIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
          alt=""
        />
      </div>
      <div class="style__TokenListWrapper-sc-ff399f65-0 jMKdeW">
        <div class="infinite-scroll-component__outerdiv">
          <div
            class="infinite-scroll-component token-list"
            style="height: 55vh; overflow: auto"
          >
            <div
              class="GradientBorderButton__Wrapper-sc-3f147dcd-0 giOGQX"
              @click="selectNetToken(token, i)"
              v-for="(token, i) in tokenList"
              :key="i"
            >
              <button class="">
                <div class="style__TokenListItemWrapper-sc-9b498917-0 bOCHgd">
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                    class="token-list-item"
                  >
                    <div
                      class="coin-info"
                      style="display: flex; align-items: center; width: 150px"
                    >
                      <img :src="token.logoURI" alt="" />
                      <div class="coin-desc">
                        <p
                          class="tit"
                          style="display: flex; align-items: center"
                        >
                          <span>{{ token.symbol }}</span>
                        </p>
                        <p
                          class="address"
                          style="display: flex; align-items: center"
                        >
                          <!-- <el-tooltip placement="bottom">
                            <div slot="content">
                              <div>
                                {{ token.address
                                }}<i
                                  style="margin-left: 5px"
                                  :class="
                                    token.isCopyed
                                      ? 'el-icon-success'
                                      : 'el-icon-copy-document'
                                  "
                                  @click="copy(token.address, $event, token)"
                                ></i
                                ><i
                                  style="margin-left: 5px"
                                  class="el-icon-s-promotion"
                                  @click="toBlock(token)"
                                ></i>
                              </div>
                            </div>
                            <span>{{ token.name }}</span>
                          </el-tooltip> -->
                          <span>{{ token.name }}</span>
                        </p>
                      </div>
                    </div>
                    <div
                      class="token-balance-price"
                      style="
                        display: flex;
                        align-items: center;
                        flex-direction: row;
                        justify-content: flex-end;
                      "
                    >
                      <div>{{ token.balance }}</div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
            <div class="warning-token">
              <img
                style="width: 20px; height: 20px"
                src="../../assets/bridge/blue-warning.png"
                alt="warning-token"
              />{{ $t('bridge.search_for_more') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="style__SearchWrapper-sc-ba7bc79b-0 bReJrc">
        <input
          @input="searchNet"
          type="text"
          class="search"
          :placeholder="$t('bridge.search_from_chain')"
        /><img
          class="search-icon"
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTkuNTIxMTY1NHB4IiBoZWlnaHQ9IjE5LjUyMTE2NTRweCIgdmlld0JveD0iMCAwIDE5LjUyMTE2NTQgMTkuNTIxMTY1NCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDx0aXRsZT5zZWFyY2g8L3RpdGxlPgogICAgPGcgaWQ9IumhtemdouaUueeJiCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InN3YXBfU291cmNlLVRva2VuIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTk4LjIyOTI2OSwgLTIyNy4yMjkyNjkpIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0xMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTgwLjAwMDAwMCwgODIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ic2VhcmNoIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNi4wMDAwMDAsIDE0My4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjEuNTMwNjI1LDIwLjQ2OTM3NSBMMTYuODM2NTYyNSwxNS43NzYyNSBDMTkuNjYyOTEyNywxMi4zODMwMzYgMTkuMzIwNDQzNSw3LjM2NjkzMzc4IDE2LjA1OTEzMzQsNC4zODkzNDg1NSBDMTIuNzk3ODIzMywxLjQxMTc2MzMyIDcuNzcxMzQxNzksMS41MjU5OTgzNyA0LjY0ODY3MDA4LDQuNjQ4NjcwMDggQzEuNTI1OTk4MzcsNy43NzEzNDE3OSAxLjQxMTc2MzMyLDEyLjc5NzgyMzMgNC4zODkzNDg1NSwxNi4wNTkxMzM0IEM3LjM2NjkzMzc4LDE5LjMyMDQ0MzUgMTIuMzgzMDM2LDE5LjY2MjkxMjcgMTUuNzc2MjUsMTYuODM2NTYyNSBMMjAuNDY5Mzc1LDIxLjUzMDYyNSBDMjAuNjU4OTQ5MSwyMS43MjAxOTkxIDIwLjkzNTI1OTMsMjEuNzk0MjM2MSAyMS4xOTQyMjIyLDIxLjcyNDg0NzIgQzIxLjQ1MzE4NTIsMjEuNjU1NDU4MyAyMS42NTU0NTgzLDIxLjQ1MzE4NTIgMjEuNzI0ODQ3MiwyMS4xOTQyMjIyIEMyMS43OTQyMzYxLDIwLjkzNTI1OTMgMjEuNzIwMTk5MSwyMC42NTg5NDkxIDIxLjUzMDYyNSwyMC40NjkzNzUgWiBNMy43NSwxMC41IEMzLjc1LDYuNzcyMDc3OTQgNi43NzIwNzc5NCwzLjc1IDEwLjUsMy43NSBDMTQuMjI3OTIyMSwzLjc1IDE3LjI1LDYuNzcyMDc3OTQgMTcuMjUsMTAuNSBDMTcuMjUsMTQuMjI3OTIyMSAxNC4yMjc5MjIxLDE3LjI1IDEwLjUsMTcuMjUgQzYuNzczNzkxMzcsMTcuMjQ1ODY2NyAzLjc1NDEzMzM1LDE0LjIyNjIwODYgMy43NSwxMC41IEwzLjc1LDEwLjUgWiIgaWQ9IuW9oueKtiIgZmlsbD0iIzZCN0Q4RSIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
          alt=""
        />
      </div>
      <button
        @click="back"
        border="transparent"
        color="white"
        type="button"
        class="styles__ButtonWrapper-sc-3c26b54d-0 hSZzEk choose_back"
      >
        <img
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2LjAgMTYuMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PGNsaXBQYXRoIGlkPSJpMCI+PHBhdGggZD0iTTEyODAsMCBMMTI4MCw3MjAgTDAsNzIwIEwwLDAgTDEyODAsMCBaIj48L3BhdGg+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9ImkxIj48cGF0aCBkPSJNMTMsMCBDMTMuNTUyMjg0NywtMS4wMTQ1MzA2M2UtMTYgMTQsMC40NDc3MTUyNSAxNCwxIEMxNCwxLjU1MjI4NDc1IDEzLjU1MjI4NDcsMiAxMywyIEwxLDIgQzAuNDQ3NzE1MjUsMiA2Ljc2MzUzNzUxZS0xNywxLjU1MjI4NDc1IDAsMSBDLTYuNzYzNTM3NTFlLTE3LDAuNDQ3NzE1MjUgMC40NDc3MTUyNSwxLjAxNDUzMDYzZS0xNiAxLDAgTDEzLDAgWiI+PC9wYXRoPjwvY2xpcFBhdGg+PGNsaXBQYXRoIGlkPSJpMiI+PHBhdGggZD0iTTksMCBDOS41NTIyODQ3NSwtMS4wMTQ1MzA2M2UtMTYgMTAsMC40NDc3MTUyNSAxMCwxIEMxMCwxLjU1MjI4NDc1IDkuNTUyMjg0NzUsMiA5LDIgTDEsMiBDMC40NDc3MTUyNSwyIDYuNzYzNTM3NTFlLTE3LDEuNTUyMjg0NzUgMCwxIEMtNi43NjM1Mzc1MWUtMTcsMC40NDc3MTUyNSAwLjQ0NzcxNTI1LDEuMDE0NTMwNjNlLTE2IDEsMCBMOSwwIFoiPjwvcGF0aD48L2NsaXBQYXRoPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDQ5LjAgLTE0MC4wKSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2kwKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDI1LjAgMTEyLjApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wIDI4LjApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjAgNi45MDAwNTYxMTgxNTM3NjkpIj48ZyB0cmFuc2Zvcm09IiI+PGcgY2xpcC1wYXRoPSJ1cmwoI2kxKSI+PHBvbHlnb24gcG9pbnRzPSIwLDAgMTQsMCAxNCwyIDAsMiAwLDAiIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiI+PC9wb2x5Z29uPjwvZz48L2c+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuOTAxOTU5NTY0NjI4NjkyIDYuNDg1ODQyNTU1NzgwNjk4KSByb3RhdGUoNDUuMDAwMDAwMDAwMDAwMDEpIj48ZyBjbGlwLXBhdGg9InVybCgjaTIpIj48cG9seWdvbiBwb2ludHM9IjAsMi44NDIxNzA5NGUtMTQgMTAsMi44NDIxNzA5NGUtMTQgMTAsMiAwLDIgMCwyLjg0MjE3MDk0ZS0xNCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIj48L3BvbHlnb24+PC9nPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjkwMTk1OTU2NDYyODY5MiA5LjMxNDI2OTY4MDUyNjg0Mykgcm90YXRlKC00NS4wMDAwMDAwMDAwMDAwMSkgc2NhbGUoMS4wIC0xLjApIj48ZyBjbGlwLXBhdGg9InVybCgjaTIpIj48cG9seWdvbiBwb2ludHM9Ii01LjY4NDM0MTg5ZS0xNCwwIDEwLDAgMTAsMiAtNS42ODQzNDE4OWUtMTQsMiAtNS42ODQzNDE4OWUtMTQsMCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIj48L3BvbHlnb24+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9zdmc+"
          width="12"
          height="12"
          style="vertical-align: text-bottom"
          alt=""
        />
      </button>
      <div class="ChainList__Wrapper-sc-3535783-0 fhqRAV">
        <div class="flex flex-col chain-scroll-list">
          <div
            v-for="(net, index) in netList"
            :key="index"
            @click="selectNet(index)"
            :class="{
              'GradientBorderButton__Wrapper-sc-3f147dcd-0': true,
              gKAlvf: true,
              active: selectedNetIndex === index
            }"
          >
            <button :class="{ active: selectedNetIndex === index }">
              <div :class="{ icon: true, active: selectedNetIndex === index }">
                <img :src="net.icon" alt="" /><span class="name">{{
                  net.name
                }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bridgeList from './bridge_list.js'
import { cloneDeep } from 'lodash'
import { getChainTokens } from '@/api/bridge/bridge.js'
import clipboard from '@/utils/clipboard'
import axios from 'axios'

export default {
  name: 'CoinDialog',
  components: {},
  props: {
    selectToken: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    fromToken: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentToken: this.selectToken,
      isExpand: false,
      bridgeList,
      selectedNetIndex: 0,
      selectedTokenIndex: 0,
      rawInput: '',
      netList: [],
      tokenList: [
        // {
        //   assetId: -1,
        //   address: '',
        //   symbol: 'ETH',
        //   decimals: 18,
        //   chainId: 10,
        //   chainName: 'ETH',
        //   name: 'ETH',
        //   logoURI:
        //     'https://coming-website.s3.us-east-2.amazonaws.com/icon_ETH.png',
        //   priceUsd: '0',
        //   source: 'ETH',
        //   orderType: 0,
        //   riskCount: 0,
        //   visibility: 100,
        //   isCopyed: false,
        //   balance: 0
        // }
      ]
    }
  },
  computed: {
    computedInput: {
      // 获取器
      get() {
        // 在这里可以进行一些转换处理
        return this.rawInput.toUpperCase() // 例如将输入转换为大写
      },
      // 设置器
      set(newValue) {
        this.rawInput = newValue
      }
    }
  },
  async created() {
    await this.getAllChainTokens()
  },
  mounted() {},
  methods: {
    cloneList() {
      this.cloneNetList = cloneDeep(this.netList)
      this.cloneTokenList = cloneDeep(this.tokenList)
      // console.log(this.selectToken)
    },
    // getBalance(postAddress, params, cb) {
    //   return axios
    //     .post(postAddress, params, {
    //       headers: {
    //         'Access-Control-Allow-Origin': '*',
    //         'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
    //         'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    //         'Content-Type': 'application/json'
    //       }
    //     })
    //     .then((response) => {
    //       cb(response)
    //     })
    // },
    async getAllChainTokens() {
      const res = await getChainTokens()

      if (res && res.success === 'ok') {
         if (this.type === 'to') {
           res.data.chains = res.data.chains.filter((ele) => {
            console.log(ele,this.fromToken.net)
             return ele.name !== this.fromToken.net.name
           })
         }
         console.log(res.data.chains)
        res.data.chains.forEach((element, index) => {
          this.netList.push({
            blockExplorerUrls: element.blockExplorerUrls,
            name: element.name,
            icon: element.logoURI,
            tokens: element.tokens
          })
          if (element.name === this.selectToken.net.name) {
            this.selectedNetIndex = index
          }
          if (index === this.selectedNetIndex) {
            this.postAddress = element.rpcUrls
          }
        })
        this.selectNet(this.selectedNetIndex)
        this.cloneList()
      }
    },
    toBlock(token) {
      window.open(
        this.netList[this.selectedNetIndex].blockExplorerUrls +
          '/address/' +
          token.address,
        '_blank'
      )
    },
    copy(key, e, token) {
      clipboard(key, e, 'no_tip')
      token.isCopyed = true
      this.tokenList.forEach((element) => {
        if (token.name !== element.name && token.address !== element.address) {
          element.isCopyed = false
        }
      })
      this.$forceUpdate()
    },
    back() {
      this.isExpand = false
    },
    expandNetList() {
      this.isExpand = true
    },
    selectNet(v) {
      this.selectedNetIndex = v
      this.getNetToken()

      if (this.isExpand) {
        this.moveToFirst(this.netList, this.selectedNetIndex)
        this.selectedNetIndex = 0
        this.back()
      }
    },
    getNetToken() {
      const account = sessionStorage.getItem('walletAccount')
      this.tokenList = this.netList[this.selectedNetIndex].tokens
      // if (this.type === 'from') {
      //   this.tokenList = this.netList[this.selectedNetIndex].tokens
      // } else {
      //   this.tokenList = this.netList[this.selectedNetIndex].tokens.filter(
      //     (ele) => {
      //       return ele.name === this.fromToken.token.name
      //     }
      //   )
      // }

      this.tokenList.forEach((element, index) => {
        element.isCopyed = false
      })

      this.cloneList()
    },
    moveToFirst(array, index) {
      if (index >= 0 && index < array.length) {
        // 从数组中移除元素
        let element = array.splice(index, 1)[0]
        // 将元素添加到数组的开头
        array.unshift(element)
      }
    },
    selectNetToken(v) {
      this.$emit(
            'updateToken',
            {
              token: { ...v },
              net: this.cloneNetList[this.selectedNetIndex]
            },
             this.netList
          )
          this.$emit('close')
    },
    searchNet(e) {
      let arr = []
      if (e.target.value) {
        this.cloneNetList.forEach((element) => {
          if (this.fuzzySearch(e.target.value, element.name)) {
            arr.push(element)
          }
        })
      } else {
        arr = [...this.cloneNetList]
      }
      this.netList = arr
      console.log(this.netList)
    },
    searchToken(e) {
      let arr = []
      if (e.target.value) {
        this.cloneTokenList.forEach((element) => {
          if (this.fuzzySearch(e.target.value, element.symbol)) {
            arr.push(element)
          }
        })
      } else {
        arr = [...this.cloneTokenList]
      }
      this.tokenList = arr
    },
    fuzzySearch(query, text) {
      // 将输入转换为小写以进行不区分大小写的比较
      query = query.toLowerCase().trim()
      text = text.toLowerCase().trim()

      // 包含性检查
      return text.includes(query)

      // 正则表达式检查
      // 将查询分割成字符数组，然后使用'.*'将每个字符连接起来
      // 这样，可以在字符间匹配任意数量的其他字符
      // let pattern = query.split("").join('.*');
      // let regex = new RegExp(pattern);
      // return regex.test(text);
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog--center .el-dialog__body {
  padding: 20px 0;
}
.ePsPCl {
  display: flex;
  flex-direction: row;
  // place-content: center space-evenly;
  // justify-content: space-between;
  // width: 50%;
  margin: 0px 0px 16px;
}
.ePsPCl .name {
  width: 54px;
  height: 40px;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
}

.dpplCs {
  width: fit-content;
  margin-left: 10px;
  width: 56px;
  height: 56px;
}
.dpplCs button {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  color: rgb(255, 255, 255);
  transition: all 0.5s ease 0s;
  font-size: 14px;
  background-image: linear-gradient(132deg, rgb(36, 45, 63), rgb(36, 45, 63));
  border: 0px solid transparent;
  border-radius: 12px;
  padding: 1px;
  font-weight: 400;
  line-height: 18px;
}
.dpplCs button::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    135deg,
    rgb(30, 204, 203),
    rgb(80, 120, 234)
  );
  opacity: 0;
  transition: opacity 0.2s ease 0s;
  pointer-events: none;
  z-index: -1;
  border-radius: 12px;
}
.ePsPCl .item {
  background: rgb(26, 35, 52);
  cursor: pointer;
  padding: 9px;
  border-radius: 12px;
  height: 36px;
}
.ePsPCl .icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
.dpplCs button.active {
  background-image: linear-gradient(
    135deg,
    rgb(30, 204, 203),
    rgb(80, 120, 234)
  );
}
.bReJrc {
  position: relative;
  display: inline-block;
  width: 100%;
  padding: 0px 16px;
  margin-bottom: 8px;
}
.bReJrc input {
  box-sizing: border-box;
  width: 92%;
  height: 60px;
  padding-left: 32px;

  background: rgb(20, 25, 40);
  font-size: 18px;
  font-weight: 400;
  margin-left: 0px;
  color: rgb(255, 255, 255);
  outline: none;
  border: none;
  border-bottom: 1px solid rgb(45, 55, 70);
}
.bReJrc .search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
}
.jMKdeW {
  width: 100%;
}
.jMKdeW .infinite-scroll-component {
  padding: 0px 16px;
  overflow-y: scroll;
}
.jMKdeW .token-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.giOGQX {
  width: 100%;
}
.giOGQX button {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  color: rgb(255, 255, 255);
  transition: all 0.5s ease 0s;
  font-size: 14px;
  background-image: linear-gradient(132deg, rgb(20, 25, 40), rgb(20, 25, 40));
  border: 0px solid transparent;
  border-radius: 12px;
  padding: 1px;
  font-weight: 400;
  line-height: 18px;
}
.giOGQX button::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    135deg,
    rgb(30, 204, 203),
    rgb(80, 120, 234)
  );
  opacity: 0;
  transition: opacity 0.2s ease 0s;
  pointer-events: none;
  z-index: -1;
  border-radius: 12px;
}
.bOCHgd {
  width: 100%;
  position: relative;
  border-radius: 12px;
}
.bOCHgd .token-list-item {
  height: 58px;
  padding: 0px 12px;
  background: rgb(20, 25, 40);
  border-radius: 12px;
}
.bOCHgd .token-list-item .coin-info img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}
.bOCHgd .token-balance-price {
  position: relative;
}
.bOCHgd .token-list-item .coin-info p.tit {
  line-height: 20px;
  font-size: 16px;
  color: rgb(255, 255, 255);
}
p {
  margin: 0;
  padding: 0;
}
.bOCHgd .token-list-item .coin-info p.tit > span {
  font-weight: 500;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: start;
}
.bOCHgd .token-list-item .coin-info p.tit .content {
  opacity: 0;
}
.bOCHgd .token-list-item .coin-info p.address {
  height: 17px;
  line-height: 17px;
  font-size: 12px;
  font-weight: 400;
  color: rgb(107, 125, 142);
}
.bOCHgd .token-list-item .coin-info p.address > span {
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: start;
}
.bOCHgd:hover {
  cursor: pointer;
  background: rgb(32, 50, 77);
}

.GradientBorderButton__Wrapper-sc-3f147dcd-0
  button:not(
    .GradientBorderButton__Wrapper-sc-3f147dcd-0 button:disabled
  ):hover::before {
  opacity: 0.4;
}
.GradientBorderButton__Wrapper-sc-3f147dcd-0
  button:not(
    .GradientBorderButton__Wrapper-sc-3f147dcd-0 button:disabled
  ):hover {
  backdrop-filter: blur(10px);
}
.dpplCs button:hover .icon {
  background: rgb(27, 37, 60);
}
.giOGQX button:hover .token-list-item {
  background: rgb(27, 37, 60);
}
.jMKdeW .warning-token {
  background: rgb(16, 34, 59);
  border-radius: 12px;
  border: 1px solid rgb(13, 50, 92);
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  padding: 17px 12px;
  font-size: 14px;
  font-weight: 500;
  color: rgb(107, 125, 142);
  line-height: 18px;
  margin-bottom: 12px;
}
.jMKdeW .warning-token > img {
  margin-right: 8px;
}
.bOCHgd .token-list-item .coin-info p:hover {
  opacity: 0.5;
  border-radius: 12px;
}
.fhqRAV {
  display: flex;
  flex-direction: column;
  place-content: center start;
  width: 92%;
  padding: 0px 16px;
  background: rgb(20, 25, 40);
  height: 65vh;
  -webkit-box-pack: start;
}
.fhqRAV .chain-scroll-list {
  overflow-y: scroll;
  gap: 8px;
  grid-template-columns: repeat(2, 1fr);
  display: grid;
}
.fhqRAV .active {
  border-radius: 12px;
  background: rgb(32, 50, 77);
}
.gKAlvf {
  width: 100%;
}
.gKAlvf button.active {
  background-image: linear-gradient(
    135deg,
    rgb(30, 204, 203),
    rgb(80, 120, 234)
  );
}
.GradientBorderButton__Wrapper-sc-3f147dcd-0
  button:not(
    .GradientBorderButton__Wrapper-sc-3f147dcd-0 button:disabled
  ):hover {
  backdrop-filter: blur(10px);
}
.fhqRAV .active {
  border-radius: 12px;
  background: rgb(32, 50, 77);
}
.gKAlvf button {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  color: rgb(255, 255, 255);
  transition: all 0.5s ease 0s;
  font-size: 14px;
  background-image: linear-gradient(132deg, rgb(36, 45, 63), rgb(36, 45, 63));
  border: 0px solid transparent;
  border-radius: 12px;
  padding: 1px;
  font-weight: 400;
  line-height: 18px;
}
.GradientBorderButton__Wrapper-sc-3f147dcd-0
  button:not(
    .GradientBorderButton__Wrapper-sc-3f147dcd-0 button:disabled
  ):hover::before {
  opacity: 0.4;
}
.gKAlvf button::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    135deg,
    rgb(30, 204, 203),
    rgb(80, 120, 234)
  );
  opacity: 0;
  transition: opacity 0.2s ease 0s;
  pointer-events: none;
  z-index: -1;
  border-radius: 12px;
}
.gKAlvf button:hover .icon {
  background: rgb(27, 37, 60);
}
.fhqRAV .icon {
  width: 100%;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  padding: 17px 12px;
  cursor: pointer;
  background: rgb(24, 30, 48);
  border-radius: 12px;
}
.fhqRAV .icon > img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.fhqRAV .name {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  line-height: 20px;
  margin-left: 12px;
}
.choose_back {
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
}
.choose_back:hover {
  opacity: 0.5;
}
.hSZzEk {
  position: absolute;
  top: 20px;
  left: 20px;
  height: auto;
  border: transparent;
  color: white;
  cursor: pointer;
  --antd-wave-shadow-color: #38dcbf;
  background: rgb(36, 44, 62) !important;
}

.chain-scroll-list::-webkit-scrollbar {
  display: none;
}

.chain-scroll-list::-webkit-scrollbar {
  width: 0 !important;
}
/*IE 10+*/
.chain-scroll-list {
  -ms-overflow-style: none;
}
/*Firefox*/
.chain-scroll-list {
  overflow: -moz-scrollbars-none;
}
</style>
