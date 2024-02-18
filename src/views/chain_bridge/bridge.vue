<template>
  <div class="swap_container">
    <div
      class="styles__HeaderWrapper-sc-3f950c4d-0 cFNzUD flex justify-between"
    >
      <div class="flex head-left" style="align-items:center">
        <img style="width:174px;height:58px" src="../../assets/quhu-transparant.png" alt="" />
        <ul class="style__NavWrapper-sc-c58ec3f7-0 cEPshw flex">
          <li v-for="item in navList" :key="item.id">
            <div @click="handleTab(item)">
              <span :class="{ active: selectedNavIndex === item.id }">{{
                item.name
              }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="flex justify-between connect-group">
        <div @click="historyVisible = true" class="GradientBorderButton__Wrapper-sc-3f147dcd-0 dNCeWx"><button class=""><div class="history-btn"><img style="height:12px" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTJweCIgaGVpZ2h0PSIxMHB4IiB2aWV3Qm94PSIwIDAgMTIgMTAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aGlzdG9yeTwvdGl0bGU+CiAgICA8ZyBpZD0i6aG16Z2i5pS554mIIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0ic3dhcF/mnKrpgInmi6l0b2tlbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyMjYuMDAwMDAwLCAtMjQuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjcuNTEwMzQyLCA3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Imhpc3RvcnkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExOTYuNDg5NjU4LCAxNC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTQsMy41IEwxNCw0LjUgQzE0LDQuNzc2MTQyMzcgMTMuNzc2MTQyNCw1IDEzLjUsNSBMNiw1IEM1LjcyMzg1NzYzLDUgNS41LDQuNzc2MTQyMzcgNS41LDQuNSBMNS41LDMuNSBDNS41LDMuMjIzODU3NjMgNS43MjM4NTc2MywzIDYsMyBMMTMuNSwzIEMxMy43NzYxNDI0LDMgMTQsMy4yMjM4NTc2MyAxNCwzLjUgWiBNMy41LDMgTDIuNSwzIEMyLjIyMzg1NzYzLDMgMiwzLjIyMzg1NzYzIDIsMy41IEwyLDQuNSBDMiw0Ljc3NjE0MjM3IDIuMjIzODU3NjMsNSAyLjUsNSBMMy41LDUgQzMuNzc2MTQyMzcsNSA0LDQuNzc2MTQyMzcgNCw0LjUgTDQsMy41IEM0LDMuMjIzODU3NjMgMy43NzYxNDIzNywzIDMuNSwzIFogTTEzLjUsNyBMNiw3IEM1LjcyMzg1NzYzLDcgNS41LDcuMjIzODU3NjMgNS41LDcuNSBMNS41LDguNSBDNS41LDguNzc2MTQyMzcgNS43MjM4NTc2Myw5IDYsOSBMMTMuNSw5IEMxMy43NzYxNDI0LDkgMTQsOC43NzYxNDIzNyAxNCw4LjUgTDE0LDcuNSBDMTQsNy4yMjM4NTc2MyAxMy43NzYxNDI0LDcgMTMuNSw3IFogTTMuNSw3IEwyLjUsNyBDMi4yMjM4NTc2Myw3IDIsNy4yMjM4NTc2MyAyLDcuNSBMMiw4LjUgQzIsOC43NzYxNDIzNyAyLjIyMzg1NzYzLDkgMi41LDkgTDMuNSw5IEMzLjc3NjE0MjM3LDkgNCw4Ljc3NjE0MjM3IDQsOC41IEw0LDcuNSBDNCw3LjIyMzg1NzYzIDMuNzc2MTQyMzcsNyAzLjUsNyBaIE0xMy41LDExIEw2LDExIEM1LjcyMzg1NzYzLDExIDUuNSwxMS4yMjM4NTc2IDUuNSwxMS41IEw1LjUsMTIuNSBDNS41LDEyLjc3NjE0MjQgNS43MjM4NTc2MywxMyA2LDEzIEwxMy41LDEzIEMxMy43NzYxNDI0LDEzIDE0LDEyLjc3NjE0MjQgMTQsMTIuNSBMMTQsMTEuNSBDMTQsMTEuMjIzODU3NiAxMy43NzYxNDI0LDExIDEzLjUsMTEgWiBNMy41LDExIEwyLjUsMTEgQzIuMjIzODU3NjMsMTEgMiwxMS4yMjM4NTc2IDIsMTEuNSBMMiwxMi41IEMyLDEyLjc3NjE0MjQgMi4yMjM4NTc2MywxMyAyLjUsMTMgTDMuNSwxMyBDMy43NzYxNDIzNywxMyA0LDEyLjc3NjE0MjQgNCwxMi41IEw0LDExLjUgQzQsMTEuMjIzODU3NiAzLjc3NjE0MjM3LDExIDMuNSwxMSBaIiBpZD0i5b2i54q2IiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+" width="12" height="10" alt=""></div></button></div>
        
        <div class="GradientBorderButton__Wrapper-sc-3f147dcd-0 eGWLjo" >
          <button class="">
            <div @click="openCollect" class="css-1930ebu" >
              <span v-if="!account"> {{ $t('bridge.connect_wallet') }}</span>
              <div style="display:flex;align-items:center;justify-content:space-between;width:160px" v-else>
                <img style="width:24px;height:24px;" :src="currentNetToken.from.net.icon" alt="">
                <span>{{ account.slice(0,5)+'...'+ account.slice(account.length-5,account.length) }}</span>
                <img style="width:16px;height:16px;" :src="currentWallet.icon" alt="">
              </div>
              </div>
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <div class="Container__Wrapper-sc-d0d30003-0 bARrkJ">
        <div v-if="chooseType === 'config-same'">
          <div class="PanelContainer__Wrapper-sc-fce2e135-0 keoxvU">
            <div class="PanelContainer__Container-sc-fce2e135-1 gxJOKH">
              <div class="IntraSlippageContent__Wrapper-sc-df97f858-0 ejaPnJ">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
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
                  <div class="css-1jsn3rg">Setting</div>
                  <div class="placeholder"></div>
                </div>
                <div
                  class="slippage-box"
                  style="display: flex; flex-direction: column"
                >
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    "
                  >
                    <div
                      style="
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                      "
                    >
                      <img
                        class="icon"
                        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTYuMjU0OTAycHgiIGhlaWdodD0iMTVweCIgdmlld0JveD0iMCAwIDE2LjI1NDkwMiAxNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDx0aXRsZT5TbGlkZXJzPC90aXRsZT4KICAgIDxnIGlkPSLljZXpk77ogZrlkIgiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJzd2FwX+a7keeCuS/nvZHnu5zpgInmi6kiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzcuODcwMDk4LCAtMTgxLjUwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTYuMDAwMDAwLCAxMDguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uEIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMC4wMDAwMDAsIDY2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJTbGlkZXJzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgNS4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTUsOC4yMDMxMjUgTDUsMy4xMjUgQzUsMi43Nzk4MjIwMyA0LjcyMDE3Nzk3LDIuNSA0LjM3NSwyLjUgQzQuMDI5ODIyMDMsMi41IDMuNzUsMi43Nzk4MjIwMyAzLjc1LDMuMTI1IEwzLjc1LDguMjAzMTI1IEMyLjY0MzgwMzIzLDguNDg2MzU2MTIgMS44NzAwOTc5Niw5LjQ4MzExOTQ3IDEuODcwMDk3OTYsMTAuNjI1IEMxLjg3MDA5Nzk2LDExLjc2Njg4MDUgMi42NDM4MDMyMywxMi43NjM2NDM5IDMuNzUsMTMuMDQ2ODc1IEwzLjc1LDE2Ljg3NSBDMy43NSwxNy4yMjAxNzggNC4wMjk4MjIwMywxNy41IDQuMzc1LDE3LjUgQzQuNzIwMTc3OTcsMTcuNSA1LDE3LjIyMDE3OCA1LDE2Ljg3NSBMNSwxMy4wNDY4NzUgQzYuMTA2MTk2NzcsMTIuNzYzNjQzOSA2Ljg3OTkwMjA0LDExLjc2Njg4MDUgNi44Nzk5MDIwNCwxMC42MjUgQzYuODc5OTAyMDQsOS40ODMxMTk0NyA2LjEwNjE5Njc3LDguNDg2MzU2MTIgNSw4LjIwMzEyNSBaIE00LjM3NSwxMS44NzUgQzMuNjg0NjQ0MDYsMTEuODc1IDMuMTI1LDExLjMxNTM1NTkgMy4xMjUsMTAuNjI1IEMzLjEyNSw5LjkzNDY0NDA2IDMuNjg0NjQ0MDYsOS4zNzUgNC4zNzUsOS4zNzUgQzUuMDY1MzU1OTQsOS4zNzUgNS42MjUsOS45MzQ2NDQwNiA1LjYyNSwxMC42MjUgQzUuNjI1LDExLjMxNTM1NTkgNS4wNjUzNTU5NCwxMS44NzUgNC4zNzUsMTEuODc1IFogTTEwLjYyNSw0LjQ1MzEyNSBMMTAuNjI1LDMuMTI1IEMxMC42MjUsMi43Nzk4MjIwMyAxMC4zNDUxNzgsMi41IDEwLDIuNSBDOS42NTQ4MjIwMywyLjUgOS4zNzUsMi43Nzk4MjIwMyA5LjM3NSwzLjEyNSBMOS4zNzUsNC40NTMxMjUgQzguMjY4ODAzMjMsNC43MzYzNTYxMiA3LjQ5NTA5Nzk2LDUuNzMzMTE5NDcgNy40OTUwOTc5Niw2Ljg3NSBDNy40OTUwOTc5Niw4LjAxNjg4MDUzIDguMjY4ODAzMjMsOS4wMTM2NDM4OCA5LjM3NSw5LjI5Njg3NSBMOS4zNzUsMTYuODc1IEM5LjM3NSwxNy4yMjAxNzggOS42NTQ4MjIwMywxNy41IDEwLDE3LjUgQzEwLjM0NTE3OCwxNy41IDEwLjYyNSwxNy4yMjAxNzggMTAuNjI1LDE2Ljg3NSBMMTAuNjI1LDkuMjk2ODc1IEMxMS43MzExOTY4LDkuMDEzNjQzODggMTIuNTA0OTAyLDguMDE2ODgwNTMgMTIuNTA0OTAyLDYuODc1IEMxMi41MDQ5MDIsNS43MzMxMTk0NyAxMS43MzExOTY4LDQuNzM2MzU2MTIgMTAuNjI1LDQuNDUzMTI1IFogTTEwLDguMTI1IEM5LjMwOTY0NDA2LDguMTI1IDguNzUsNy41NjUzNTU5NCA4Ljc1LDYuODc1IEM4Ljc1LDYuMTg0NjQ0MDYgOS4zMDk2NDQwNiw1LjYyNSAxMCw1LjYyNSBDMTAuNjkwMzU1OSw1LjYyNSAxMS4yNSw2LjE4NDY0NDA2IDExLjI1LDYuODc1IEMxMS4yNSw3LjU2NTM1NTk0IDEwLjY5MDM1NTksOC4xMjUgMTAsOC4xMjUgWiBNMTguMTI1LDEzLjEyNSBDMTguMTIzOTIyMywxMS45ODUxMDAyIDE3LjM1MzI4OTUsMTAuOTg5Njk5NSAxNi4yNSwxMC43MDMxMjUgTDE2LjI1LDMuMTI1IEMxNi4yNSwyLjc3OTgyMjAzIDE1Ljk3MDE3OCwyLjUgMTUuNjI1LDIuNSBDMTUuMjc5ODIyLDIuNSAxNSwyLjc3OTgyMjAzIDE1LDMuMTI1IEwxNSwxMC43MDMxMjUgQzEzLjg5MzgwMzIsMTAuOTg2MzU2MSAxMy4xMjAwOTgsMTEuOTgzMTE5NSAxMy4xMjAwOTgsMTMuMTI1IEMxMy4xMjAwOTgsMTQuMjY2ODgwNSAxMy44OTM4MDMyLDE1LjI2MzY0MzkgMTUsMTUuNTQ2ODc1IEwxNSwxNi44NzUgQzE1LDE3LjIyMDE3OCAxNS4yNzk4MjIsMTcuNSAxNS42MjUsMTcuNSBDMTUuOTcwMTc4LDE3LjUgMTYuMjUsMTcuMjIwMTc4IDE2LjI1LDE2Ljg3NSBMMTYuMjUsMTUuNTQ2ODc1IEMxNy4zNTMyODk1LDE1LjI2MDMwMDUgMTguMTIzOTIyMywxNC4yNjQ4OTk4IDE4LjEyNSwxMy4xMjUgWiBNMTUuNjI1LDE0LjM3NSBDMTQuOTM0NjQ0MSwxNC4zNzUgMTQuMzc1LDEzLjgxNTM1NTkgMTQuMzc1LDEzLjEyNSBDMTQuMzc1LDEyLjQzNDY0NDEgMTQuOTM0NjQ0MSwxMS44NzUgMTUuNjI1LDExLjg3NSBDMTYuMzE1MzU1OSwxMS44NzUgMTYuODc1LDEyLjQzNDY0NDEgMTYuODc1LDEzLjEyNSBDMTYuODc1LDEzLjgxNTM1NTkgMTYuMzE1MzU1OSwxNC4zNzUgMTUuNjI1LDE0LjM3NSBaIiBpZD0i5b2i54q2IiBmaWxsPSIjNkI3RDhFIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgeD0iMCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
                        alt=""
                      />
                      <div class="css-qolih7">Slippage Tolerance</div>
                    </div>
                    <div class="slippage-value">
                      <div
                        class="style__ColoredFrame-sc-f6213b9-1 dAMTVt"
                        style="margin-right: 8px; display: inline-block"
                      >
                        <div class="gradient-border">
                          <div
                            class="SlippageItem__SlipPageWrapper-sc-3d7e71c2-0 bvnxHw source-input"
                          >
                            <input
                              inputmode="decimal"
                              title="Token Amount"
                              autocomplete="off"
                              autocorrect="off"
                              type="text"
                              pattern="^[0-9]*[.,]?[0-9]*$"
                              placeholder="0.0"
                              minlength="1"
                              maxlength="79"
                              spellcheck="false"
                              class="NumericalInput__StyledInput-sc-1b49fd61-0 fWwMfG"
                              value="0.1"
                              style="
                                font-size: 14px;
                                height: 16px;
                                min-width: 28px;
                                padding: 5px 8px;
                                color: rgb(255, 255, 255);
                                line-height: 17px;
                                text-align: center;
                                font-weight: 400;
                              "
                            />
                          </div>
                        </div>
                      </div>
                      <span>%</span>
                    </div>
                  </div>
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    "
                  >
                    <div
                      style="
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: center;
                      "
                    >
                      <img
                        class="icon"
                        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTcuNTAwODUzNXB4IiBoZWlnaHQ9IjE2LjI1MDM2MThweCIgdmlld0JveD0iMCAwIDE3LjUwMDg1MzUgMTYuMjUwMzYxOCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDx0aXRsZT5BbGFybTwvdGl0bGU+CiAgICA8ZyBpZD0i5Y2V6ZO+6IGa5ZCIIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0ic3dhcF/mu5Hngrkv572R57uc6YCJ5oupIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTc3LjI0OTYzOCwgLTIyMS4yNDk2MzgpIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0xMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU2LjAwMDAwMCwgMTA4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCA2Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iQWxhcm0iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA0Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEwLDIuNSBDNS44NTc4NjQzOCwyLjUgMi41LDUuODU3ODY0MzggMi41LDEwIEMyLjUsMTQuMTQyMTM1NiA1Ljg1Nzg2NDM4LDE3LjUgMTAsMTcuNSBDMTQuMTQyMTM1NiwxNy41IDE3LjUsMTQuMTQyMTM1NiAxNy41LDEwIEMxNy40OTUyNjQyLDUuODU5ODI3NiAxNC4xNDAxNzI0LDIuNTA0NzM1ODEgMTAsMi41IFogTTEwLDE2LjI1IEM2LjU0ODIyMDMxLDE2LjI1IDMuNzUsMTMuNDUxNzc5NyAzLjc1LDEwIEMzLjc1LDYuNTQ4MjIwMzEgNi41NDgyMjAzMSwzLjc1IDEwLDMuNzUgQzEzLjQ1MTc3OTcsMy43NSAxNi4yNSw2LjU0ODIyMDMxIDE2LjI1LDEwIEMxNi4yNDYxMjUxLDEzLjQ1MDE3MzQgMTMuNDUwMTczNCwxNi4yNDYxMjUxIDEwLDE2LjI1IFogTTQuODE3MTg3NSwyLjMxNzE4NzUgTDIuMzE3MTg3NSw0LjgxNzE4NzUgQzIuMTU5MjA5MTIsNC45NzUxNjU4OCAxLjkyODk1MDYyLDUuMDM2ODYzNDYgMS43MTMxNDgxNCw0Ljk3OTAzOTM2IEMxLjQ5NzM0NTY2LDQuOTIxMjE1MjYgMS4zMjg3ODQ3NCw0Ljc1MjY1NDM0IDEuMjcwOTYwNjQsNC41MzY4NTE4NiBDMS4yMTMxMzY1NCw0LjMyMTA0OTM4IDEuMjc0ODM0MTIsNC4wOTA3OTA4OCAxLjQzMjgxMjUsMy45MzI4MTI1IEwzLjkzMjgxMjUsMS40MzI4MTI1IEM0LjA5MDc5MDg4LDEuMjc0ODM0MTIgNC4zMjEwNDkzOCwxLjIxMzEzNjU0IDQuNTM2ODUxODYsMS4yNzA5NjA2NCBDNC43NTI2NTQzNCwxLjMyODc4NDc0IDQuOTIxMjE1MjYsMS40OTczNDU2NiA0Ljk3OTAzOTM2LDEuNzEzMTQ4MTQgQzUuMDM2ODYzNDYsMS45Mjg5NTA2MiA0Ljk3NTE2NTg4LDIuMTU5MjA5MTIgNC44MTcxODc1LDIuMzE3MTg3NSBaIE0xOC41NjcxODc1LDQuODE3MTg3NSBDMTguNDQ5OTU3Myw0LjkzNDU0ODE1IDE4LjI5MDg4MDgsNS4wMDA0OTE2NiAxOC4xMjUsNS4wMDA0OTE2NiBDMTcuOTU5MTE5Miw1LjAwMDQ5MTY2IDE3LjgwMDA0MjcsNC45MzQ1NDgxNSAxNy42ODI4MTI1LDQuODE3MTg3NSBMMTUuMTgyODEyNSwyLjMxNzE4NzUgQzE0LjkzODU5OTEsMi4wNzI5NzQwOCAxNC45Mzg1OTkxLDEuNjc3MDI1OTIgMTUuMTgyODEyNSwxLjQzMjgxMjUyIEMxNS40MjcwMjU5LDEuMTg4NTk5MTEgMTUuODIyOTc0MSwxLjE4ODU5OTEgMTYuMDY3MTg3NSwxLjQzMjgxMjUgTDE4LjU2NzE4NzUsMy45MzI4MTI1IEMxOC42ODQ1NDgyLDQuMDUwMDQyNjYgMTguNzUwNDkxNyw0LjIwOTExOTIyIDE4Ljc1MDQ5MTcsNC4zNzUgQzE4Ljc1MDQ5MTcsNC41NDA4ODA3OCAxOC42ODQ1NDgyLDQuNjk5OTU3MzQgMTguNTY3MTg3NSw0LjgxNzE4NzUgTDE4LjU2NzE4NzUsNC44MTcxODc1IFogTTE0LjM3NSw5LjM3NSBDMTQuNzIwMTc4LDkuMzc1IDE1LDkuNjU0ODIyMDMgMTUsMTAgQzE1LDEwLjM0NTE3OCAxNC43MjAxNzgsMTAuNjI1IDE0LjM3NSwxMC42MjUgTDEwLDEwLjYyNSBDOS42NTQ4MjIwMywxMC42MjUgOS4zNzUsMTAuMzQ1MTc4IDkuMzc1LDEwIEw5LjM3NSw1LjYyNSBDOS4zNzUsNS4yNzk4MjIwMyA5LjY1NDgyMjAzLDUgMTAsNSBDMTAuMzQ1MTc4LDUgMTAuNjI1LDUuMjc5ODIyMDMgMTAuNjI1LDUuNjI1IEwxMC42MjUsOS4zNzUgTDE0LjM3NSw5LjM3NSBaIiBpZD0i5b2i54q2IiBmaWxsPSIjNkI3RDhFIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgeD0iMCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
                        alt=""
                      />
                      <div class="css-qolih7">Swap Expired Time</div>
                    </div>
                    <div class="slippage-value">
                      <div
                        class="style__ColoredFrame-sc-f6213b9-1 dAMTVt inline-block"
                        style="margin-right: 8px"
                      >
                        <div class="gradient-border">
                          <div
                            class="SlippageItem__SlipPageWrapper-sc-3d7e71c2-0 bvnxHw source-input"
                          >
                            <input
                              inputmode="decimal"
                              title="Token Amount"
                              autocomplete="off"
                              autocorrect="off"
                              type="text"
                              pattern="^[0-9]*[.,]?[0-9]*$"
                              placeholder="0.0"
                              minlength="1"
                              maxlength="79"
                              spellcheck="false"
                              class="NumericalInput__StyledInput-sc-1b49fd61-0 fWwMfG"
                              value="5"
                              style="
                                font-size: 14px;
                                height: 16px;
                                min-width: 28px;
                                padding: 5px 8px;
                                color: rgb(255, 255, 255);
                                line-height: 17px;
                                text-align: center;
                                font-weight: 400;
                              "
                            />
                          </div>
                        </div>
                      </div>
                      <span>min</span>
                    </div>
                  </div>
                </div>
                <div class="css-ktp6ev">Transaction Mode</div>
                <div class="gas-box" style="display: flex; flex-direction: row">
                  <div
                    class="GradientBorderButton__Wrapper-sc-3f147dcd-0 dsxjan active"
                  >
                    <button class="active">
                      <div
                        class="transaction-item"
                        style="
                          display: flex;
                          flex-direction: column;
                          justify-content: center;
                          align-items: center;
                        "
                      >
                        <div class="css-ktp6ev">Standard</div>
                      </div>
                    </button>
                  </div>
                </div>
                <!-- <div class="css-ktp6ev">Special Setting</div>
                <div class="flex flex-col setting-box">
                  <div class="flex items-center justify-between">
                    <div class="flex flex-row justify-start items-center">
                      <img
                        class="icon"
                        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTVweCIgaGVpZ2h0PSIxNC45OTk5MTIzcHgiIHZpZXdCb3g9IjAgMCAxNSAxNC45OTk5MTIzIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPkFpcnBsYW5lPC90aXRsZT4KICAgIDxnIGlkPSLljZXpk77ogZrlkIgiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJzd2FwX+a7keeCuS/nvZHnu5zpgInmi6kiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzguNTAwMDAwLCAtNTY4LjUwMDA0NCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTYuMDAwMDAwLCAxMDguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwLjAwMDAwMCwgNDIxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJBaXJwbGFuZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDM3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTYuNjY1NDIxMywyLjUwMDA0Mzg4IEwxNi43Njk5NDk3LDIuNTA2NTY2NjMgQzE3LjIyNjYyNzcsMi41NjM2NTEzOCAxNy41NTA1NjIsMi45ODAxMzgzMiAxNy40OTM0NzcyLDMuNDM2ODE2MjYgTDE1LjkxODA3MTQsMTYuMDQwMDYzMiBDMTUuODEzNzUzMSwxNi44NzQxMDk3IDE1LjEwNDc5MzgsMTcuNDk5OTU2MSAxNC4yNjQyODM0LDE3LjQ5OTk1NjEgTDUuNzM1Njk5ODksMTcuNDk5OTU2MSBDNC44OTUxNTY5NiwxNy40OTk5NTYxIDQuMTg2MTc2ODgsMTYuODc0MDgyNSA0LjA4MTkyMSwxNi4wNDAwMDIyIEwyLjUwNjUyMjc3LDMuNDM2ODE2MjYgQzIuNDQ5NDM4MDIsMi45ODAxMzgzMiAyLjc3MzM3MjMxLDIuNTYzNjUxMzggMy4yMzAwNTAyNSwyLjUwNjU2NjYzIEMzLjY4NjcyODE5LDIuNDQ5NDgxODkgNC4xMDMyMTUxNCwyLjc3MzQxNjE4IDQuMTYwMjk5ODgsMy4yMzAwOTQxMiBMNC43NjI1NjgzMSw4LjA0OTM1OTQyIEM0Ljg1NDY0NDEyLDguMDE3Nzg0NjkgNC45NDgyNTIyMyw3Ljk4NjY2NjU3IDUuMDQzMTA2MzQsNy45NTYyMDczOCBDNS40NjI1NzgxMyw3LjgyMTUwODE5IDUuODczMTgxNzUsNy43MTA0NTYxNiA2LjI2NTUyNzczLDcuNjMxMTI0NTYgQzYuNzIwODQwNTcsNy41MzkwNjExOCA3LjEzOTExNTI2LDcuNDkyMTEwNyA3LjUxNzc0NzQxLDcuNTAwMTc4MTcgQzguNTgxMTA1Nyw3LjUyMjc5MjQ0IDkuMjY0MDAxNSw3Ljc4NjIzNDg4IDEwLjQwMzQwOTgsOC40NDUyMzEwNiBMMTAuNDUxMDc3LDguNDcyODIyNDMgTDEwLjUxNTYwNTIsOC41MTAxMzk4MSBDMTAuNTI3OTAwNiw4LjUxNzI0NDkgMTAuNTQyNjIxLDguNTI1NzQ5NjIgMTAuNTYyMjQ4Myw4LjUzNzA4OTIzIEMxMS40MDQzMzgxLDkuMDIyNzE1NDMgMTEuODM5NzIwNiw5LjE4MTQ2OTI0IDEyLjQ4MDkyNiw5LjE2Njc3MTI3IEMxMi43MzM0NDkyLDkuMTYwOTk4NiAxMy4wNDQ1OTA0LDkuMTE5MDk5NTMgMTMuMzk4MTAwMiw5LjA0NDg3NjA3IEMxMy43MDg4NzU3LDguOTc5NjI1MTggMTQuMDQyNTk1Miw4Ljg5MTYwODQxIDE0LjM4Nzk0MjgsOC43ODY0OTQzNSBDMTQuNjYzMTM3OSw4LjcwMjczMjc0IDE0LjkzMDE5MDYsOC42MTI5MzQwNiAxNS4xNzg2MTEzLDguNTIzMDU1MDUgTDE1LjgzOTcwMDEsMy4yMzAwOTQxMiBDMTUuODkyMzkzNywyLjgwODU0NTI1IDE2LjI1MTMyMzUsMi41MDAxMDM0IDE2LjY2NTQyMTMsMi41MDAwNDM4OCBaIE03LjQ4MjI3Nzc2LDkuMTY2NDQ3ODYgQzcuMjQxMjA4MjIsOS4xNjEzMTE0MiA2Ljk0MDAxODU5LDkuMTk1MTE5MzQgNi41OTU4MzYwNSw5LjI2NDcxMjM5IEM2LjI2OTY3Mjg2LDkuMzMwNjYxOTYgNS45MTcxNTc3OCw5LjQyNjAwMzMzIDUuNTUyNjY2NCw5LjU0MzA0NzQyIEM1LjM1Mjc3MDgxLDkuNjA3MjM3MTQgNS4xNTgyOTI3Miw5LjY3NTAwNzU2IDQuOTczNjI4MzIsOS43NDM2MDg1OSBMNS43MzU2OTg2MywxNS44MzMyODQxIEwxNC4yNjQyODM0LDE1LjgzMzMwOSBMMTQuOTQ5MTk2NSwxMC4zNTc2MDkyIEMxNC45MjM5NTUzLDEwLjM2NTQyMDUgMTQuODk4NjM1MSwxMC4zNzMxOTI0IDE0Ljg3MzI0MTQsMTAuMzgwOTIxNiBDMTQuNDgzNzYzNiwxMC40OTk0Njc2IDE0LjEwMzU2OTksMTAuNTk5NzQxNyAxMy43NDA1NjQ5LDEwLjY3NTk1ODggQzEzLjI5NDU2NTksMTAuNzY5NjAxNCAxMi44ODYyMzI4LDEwLjgyNDU4ODYgMTIuNTE5MDY3NSwxMC44MzI5ODE5IEMxMS41MDAwOTk3LDEwLjg1NjMzOTEgMTAuODEzODMwMiwxMC42MDYxMDQyIDkuNzI5NjM3OTIsOS45ODA4NTk1NyBDOS42NDg1MzkzNyw5LjkzNDAwNTAyIDkuNjQ4NTM5MzcsOS45MzQwMDUwMiA5LjU2ODk4NjI4LDkuODg3OTU0MjQgQzguNjUzMzgwMDksOS4zNTgzOTc4MiA4LjE5NTEwMzgxLDkuMTgxNjA3NDIgNy40ODIyNzc3Niw5LjE2NjQ0Nzg2IFoiIGlkPSLlvaLnirbnu5PlkIgiIGZpbGw9IiM2QjdEOEUiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
                        alt=""
                      />
                      <div class="css-qolih7">Dynamic Pathfinding</div>
                    </div>
                    <div class="special-setting">
                      <button
                        type="button"
                        role="switch"
                        aria-checked="true"
                        class="ant-switch ant-switch-checked"
                      >
                        <div class="ant-switch-handle"></div>
                        <span class="ant-switch-inner"></span>
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex flex-row justify-start items-center">
                      <img
                        class="icon"
                        src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTMuNzVweCIgaGVpZ2h0PSIxNy43MjAwNTE3cHgiIHZpZXdCb3g9IjAgMCAxMy43NSAxNy43MjAwNTE3IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPkFpcnBsYW5lPC90aXRsZT4KICAgIDxnIGlkPSLljZXpk77ogZrlkIgiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJzd2FwX+a7keeCuS/nvZHnu5zpgInmi6kiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzkuMTI1MDAwLCAtNjA1LjEzOTk3NCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTYuMDAwMDAwLCAxMDguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwLjAwMDAwMCwgNDIxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJBaXJwbGFuZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDc1LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNOS4xOTQ1NjU3NiwxLjk0NTQzMTAzIEM5LjE5NDU2NTc2LDEuNTAwNTkzMjkgOS41NTUxNjg4MSwxLjEzOTk3NDEzIDEwLjAwMDAyMjcsMS4xMzk5NzQxMyBMMTMuMjIxODUwMiwxLjEzOTk3NDEzIEMxMy42NjY3MDQxLDEuMTM5OTc0MTMgMTQuMDI3MzA3MSwxLjUwMDU5MzI5IDE0LjAyNzMwNzEsMS45NDU0MzEwMyBDMTQuMDI3MzA3MSwyLjM5MDI2ODc2IDEzLjY2NjcwNDEsMi43NTA4ODc5MiAxMy4yMjE4NTAyLDIuNzUwODg3OTIgTDExLjk0NDU1NjcsMi43NTA4ODc5MiBMMTUuODA1MDMxMSw2LjYxMTM1NDIzIEMxNy4yMzE2NTYzLDguMDM3OTg3NTQgMTcuMjMxNjU2MywxMC4zNTEwOTg3IDE1LjgwNTAzMTEsMTEuNzc3NzIzOSBDMTQuMzc4MzI1MywxMy4yMDQzNDkyIDEyLjA2NTI5NDcsMTMuMjA0MzQ5MiAxMC42Mzg2Njk0LDExLjc3NzcyMzkgTDguMjIyMjc0NTcsOS4zNjEzNTMyMyBDNy40MjQ3MTkyMSw4LjU2Mzc4OTgxIDYuMTMxNjMwNjUsOC41NjM3ODk4MSA1LjMzNDA3NTI4LDkuMzYxMzUzMjMgQzQuNTM2NTI3OTcsMTAuMTU4OTE2NiA0LjUzNjUyNzk3LDExLjQ1MTk5NzEgNS4zMzQwODMzNCwxMi4yNDk1NjA2IEw4Ljc3NzI1ODU0LDE1LjY5MjcyNzcgQzguOTEwNDAwNTYsMTUuNjU3MjA3MSA5LjA1MDIyNzg4LDE1LjYzODE5ODMgOS4xOTQ1NjU3NiwxNS42MzgxOTgzIEMxMC4wODQxOTI5LDE1LjYzODE5ODMgMTAuODA1NDc5NiwxNi4zNTk0MDQ0IDEwLjgwNTQ3OTYsMTcuMjQ5MTEyMSBDMTAuODA1NDc5NiwxOC4xMzg4MTk4IDEwLjA4NDE5MjksMTguODYwMDI1OSA5LjE5NDU2NTc2LDE4Ljg2MDAyNTkgQzguMzA0ODY2MTIsMTguODYwMDI1OSA3LjU4MzYzNTg1LDE4LjEzODgxOTggNy41ODM2MzU4NSwxNy4yNDkxMTIxIEM3LjU4MzYzNTg1LDE3LjEwNDc3NDIgNy42MDI2MDQzNiwxNi45NjQ5NDY5IDcuNjM4MTk3NSwxNi44MzE4ODU0IEw0LjE5NDk5MDA5LDEzLjM4ODYzNzcgQzIuNzY4MzQwNjcsMTEuOTYyMDEyNSAyLjc2ODMzMjYxLDkuNjQ4OTAxMzQgNC4xOTQ5OTAwOSw4LjIyMjI3NjA4IEM1LjYyMTY0NzU2LDYuNzk1NjE4NjEgNy45MzQ3MTAzNSw2Ljc5NTYxODYxIDkuMzYxMzc1ODgsOC4yMjIyNzYwOCBMMTEuNzc3NzQ2NiwxMC42Mzg2NDY4IEMxMi41NzUzMSwxMS40MzYyMTAyIDEzLjg2ODM5MDUsMTEuNDM2MjEwMiAxNC42NjU5NTM5LDEwLjYzODY0NjggQzE1LjQ2MzUxNzMsOS44NDEwODMzNSAxNS40NjM1MTczLDguNTQ4MDAyODUgMTQuNjY1OTUzOSw3Ljc1MDQ0NzQ5IEwxMC44MDU0Nzk2LDMuODg5OTczMTIgTDEwLjgwNTQ3OTYsNS4xNjcyNTg2MiBDMTAuODA1NDc5Niw1LjYxMjA5NjM1IDEwLjQ0NDg3NjUsNS45NzI3MTU1MSAxMC4wMDAwMjI3LDUuOTcyNzE1NTEgQzkuNTU1MTY4ODEsNS45NzI3MTU1MSA5LjE5NDU2NTc2LDUuNjEyMDk2MzUgOS4xOTQ1NjU3Niw1LjE2NzI1ODYyIEw5LjE5NDU2NTc2LDEuOTQ1NDMxMDMgWiIgaWQ9Iui3r+W+hCIgZmlsbD0iIzZCN0Q4RSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
                        alt=""
                      />
                      <div class="css-qolih7">Router With Tax</div>
                    </div>
                    <div class="special-setting">
                      <button
                        type="button"
                        role="switch"
                        aria-checked="false"
                        disabled=""
                        class="ant-switch ant-switch-disabled"
                      >
                        <div class="ant-switch-handle"></div>
                        <span class="ant-switch-inner"></span>
                      </button>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div v-if="chooseType === 'config-cross'">
          <div class="PanelContainer__Wrapper-sc-fce2e135-0 keoxvU">
            <div class="PanelContainer__Container-sc-fce2e135-1 gxJOKH">
              <div class="SlippageContent__Wrapper-sc-571f5e48-0 hcqOwc">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <button
                    @click="back"
                    border="transparent"
                    color="white"
                    type="button"
                    class="styles__ButtonWrapper-sc-3c26b54d-0 hSZzEk choose_back"
                  >
                    <img
                      style="vertical-align: text-bottom"
                      src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDE2LjAgMTYuMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGRlZnM+PGNsaXBQYXRoIGlkPSJpMCI+PHBhdGggZD0iTTEyODAsMCBMMTI4MCw3MjAgTDAsNzIwIEwwLDAgTDEyODAsMCBaIj48L3BhdGg+PC9jbGlwUGF0aD48Y2xpcFBhdGggaWQ9ImkxIj48cGF0aCBkPSJNMTMsMCBDMTMuNTUyMjg0NywtMS4wMTQ1MzA2M2UtMTYgMTQsMC40NDc3MTUyNSAxNCwxIEMxNCwxLjU1MjI4NDc1IDEzLjU1MjI4NDcsMiAxMywyIEwxLDIgQzAuNDQ3NzE1MjUsMiA2Ljc2MzUzNzUxZS0xNywxLjU1MjI4NDc1IDAsMSBDLTYuNzYzNTM3NTFlLTE3LDAuNDQ3NzE1MjUgMC40NDc3MTUyNSwxLjAxNDUzMDYzZS0xNiAxLDAgTDEzLDAgWiI+PC9wYXRoPjwvY2xpcFBhdGg+PGNsaXBQYXRoIGlkPSJpMiI+PHBhdGggZD0iTTksMCBDOS41NTIyODQ3NSwtMS4wMTQ1MzA2M2UtMTYgMTAsMC40NDc3MTUyNSAxMCwxIEMxMCwxLjU1MjI4NDc1IDkuNTUyMjg0NzUsMiA5LDIgTDEsMiBDMC40NDc3MTUyNSwyIDYuNzYzNTM3NTFlLTE3LDEuNTUyMjg0NzUgMCwxIEMtNi43NjM1Mzc1MWUtMTcsMC40NDc3MTUyNSAwLjQ0NzcxNTI1LDEuMDE0NTMwNjNlLTE2IDEsMCBMOSwwIFoiPjwvcGF0aD48L2NsaXBQYXRoPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDQ5LjAgLTE0MC4wKSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2kwKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDI1LjAgMTEyLjApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wIDI4LjApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjAgNi45MDAwNTYxMTgxNTM3NjkpIj48ZyB0cmFuc2Zvcm09IiI+PGcgY2xpcC1wYXRoPSJ1cmwoI2kxKSI+PHBvbHlnb24gcG9pbnRzPSIwLDAgMTQsMCAxNCwyIDAsMiAwLDAiIHN0cm9rZT0ibm9uZSIgZmlsbD0iI0ZGRkZGRiI+PC9wb2x5Z29uPjwvZz48L2c+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuOTAxOTU5NTY0NjI4NjkyIDYuNDg1ODQyNTU1NzgwNjk4KSByb3RhdGUoNDUuMDAwMDAwMDAwMDAwMDEpIj48ZyBjbGlwLXBhdGg9InVybCgjaTIpIj48cG9seWdvbiBwb2ludHM9IjAsMi44NDIxNzA5NGUtMTQgMTAsMi44NDIxNzA5NGUtMTQgMTAsMiAwLDIgMCwyLjg0MjE3MDk0ZS0xNCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIj48L3BvbHlnb24+PC9nPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjkwMTk1OTU2NDYyODY5MiA5LjMxNDI2OTY4MDUyNjg0Mykgcm90YXRlKC00NS4wMDAwMDAwMDAwMDAwMSkgc2NhbGUoMS4wIC0xLjApIj48ZyBjbGlwLXBhdGg9InVybCgjaTIpIj48cG9seWdvbiBwb2ludHM9Ii01LjY4NDM0MTg5ZS0xNCwwIDEwLDAgMTAsMiAtNS42ODQzNDE4OWUtMTQsMiAtNS42ODQzNDE4OWUtMTQsMCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjRkZGRkZGIj48L3BvbHlnb24+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9zdmc+"
                      width="12"
                      height="12"
                      alt=""
                    />
                  </button>
                  <div class="css-1xwrzfl">滑点容忍度</div>
                  <div class="placeholder"></div>
                </div>
                <div class="css-10u3r7">
                  如果估计报价和执行价格之间的差异超过您选择的滑点容忍度，交易将被撤销。
                </div>
                <div class="css-1edk4wa">跨链交易</div>
                <div
                  class="advanced-item source-chain source-chain"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <p>源链</p>
                  <div class="slippage-value">
                    <div
                      class="style__ColoredFrame-sc-f6213b9-1 dAMTVt"
                      style="margin-right: 8px; display: inline-block"
                    >
                      <div class="gradient-border">
                        <div
                          class="SlippageItem__SlipPageWrapper-sc-b3ba841f-0 duLlOr source-input"
                        >
                          <input
                            @input="inputFromSlip"
                            disabled
                            inputmode="decimal"
                            title="Token Amount"
                            autocomplete="off"
                            autocorrect="off"
                            type="text"
                            pattern="^[0-9]*[.,]?[0-9]*$"
                            placeholder="0.0"
                            minlength="1"
                            maxlength="79"
                            spellcheck="false"
                            class="NumericalInput__StyledInput-sc-1b49fd61-0 fWwMfG"
                            value="3"
                            style="
                              font-size: 14px;
                              height: 16px;
                              min-width: 28px;
                              padding: 5px 8px;
                              color: rgb(255, 255, 255);
                              line-height: 17px;
                              text-align: center;
                              font-weight: 400;
                            "
                          />
                        </div>
                      </div>
                    </div>
                    <span>%</span>
                  </div>
                </div>
                <div
                  class="advanced-item source-chain destination-chain"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  "
                >
                  <p>目的链</p>
                  <div class="slippage-value">
                    <div
                      class="style__ColoredFrame-sc-f6213b9-1 dAMTVt"
                      style="margin-right: 8px; display: inline-block"
                    >
                      <div class="gradient-border">
                        <div
                          class="SlippageItem__SlipPageWrapper-sc-b3ba841f-0 duLlOr source-input"
                        >
                          <input
                            @input="inputToSlip"
                            disabled
                            inputmode="decimal"
                            title="Token Amount"
                            autocomplete="off"
                            autocorrect="off"
                            type="text"
                            pattern="^[0-9]*[.,]?[0-9]*$"
                            placeholder="0.0"
                            minlength="1"
                            maxlength="79"
                            spellcheck="false"
                            class="NumericalInput__StyledInput-sc-1b49fd61-0 fWwMfG"
                            value="3"
                            style="
                              font-size: 14px;
                              height: 16px;
                              min-width: 28px;
                              padding: 5px 8px;
                              color: rgb(255, 255, 255);
                              line-height: 17px;
                              text-align: center;
                              font-weight: 400;
                            "
                          />
                        </div>
                      </div>
                    </div>
                    <span>%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center">
          <div class="PanelContainer__Wrapper-sc-fce2e135-0 keoxvU">
            <div class="PanelContainer__Container-sc-fce2e135-1 gxJOKH">
              <div
                class="ContainerTitle__ContainerTitleWrapper-sc-67bcf960-0 hmheVP"
              >
                <div class="manage">
                  <!-- <svg
                    width="21.002"
                    height="19.505"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
                  >
                    <g fill="none" fill-rule="evenodd">
                      <path
                        d="M20.809 7.803a.75.75 0 0 0-.365-.506l-2.797-1.594-.011-3.152a.75.75 0 0 0-.265-.57A10.492 10.492 0 0 0 13.928.043a.75.75 0 0 0-.605.055l-2.821 1.577L7.678.095A.75.75 0 0 0 7.07.04a10.492 10.492 0 0 0-3.438 1.946.75.75 0 0 0-.266.569l-.014 3.154L.557 7.302a.75.75 0 0 0-.365.506 9.982 9.982 0 0 0 0 3.897.75.75 0 0 0 .365.506l2.796 1.594.011 3.153c.001.22.098.428.266.57a10.492 10.492 0 0 0 3.442 1.937c.2.068.42.048.606-.055l2.824-1.582 2.823 1.58a.742.742 0 0 0 .607.055 10.51 10.51 0 0 0 3.439-1.944.75.75 0 0 0 .265-.569l.014-3.155 2.797-1.593a.75.75 0 0 0 .364-.507 9.982 9.982 0 0 0-.002-3.892Zm-10.307 5.699a3.75 3.75 0 1 1 0-7.5 3.75 3.75 0 0 1 0 7.5Z"
                        fill="#B2E0DF"
                        fill-rule="nonzero"
                      ></path>
                      <path d="M-1.498-2.248h24v24h-24z"></path>
                    </g>
                  </svg> -->
                  <div class="slippage" >
                    <div class="css-10b2kzp" :title="$t('bridge.max_slippage')">3 %</div>
                  </div>
                </div>
                <el-tabs
                  v-model="activeTabName"
                  class=""
                  type="card"
                  @tab-click="handleTradeSwitch"
                >
                  <el-tab-pane :label="$t('bridge.cross_bridge')" name="first">
                    <div
                      class="CrossSwapChainAndToken__Wrapper-sc-7481b09d-0 hvxVgX"
                    >
                      <div
                        @click="openCoinDialog('from')"
                        class="SwapChainAndToken__Wrapper-sc-14c5e73-0 hMQdau"
                      >
                        <div class="style__ContentWrapper-sc-6538d67c-1 eUfuKh">
                          <div class="title">{{$t('bridge.native_chain_token')}}</div>
                          <div class="info">
                            <div
                              width="30"
                              class="DoubleIcon__DoubleIconWrapper-sc-e5cf7743-0 jMKBlT"
                            >
                              <img
                                class="token-symbol"
                                :src="currentNetToken.from.token.logoURI"
                                width="30"
                                height="30"
                                style="border-radius: 50%"
                              /><img
                                class="chain-symbol"
                                :src="currentNetToken.from.net.icon"
                                width="16"
                                height="16"
                              />
                            </div>
                            <div class="selected chain_token">
                              {{ currentNetToken.from.token.symbol
                              }}<span class="chain">
                                on {{ currentNetToken.from.net.name }}</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="switch" style="margin:2px 0">
                        <div
                          class="GradientBorder__GradientBorderWrapper-sc-a57c90bf-0 itTzND switch-bg"
                          v-if="switchEnter"
                        ></div>
                        <div
                          class="switch-icon"
                          @click="switchNet"
                          @mouseenter="switchEnter = true"
                          @mouseleave="switchEnter = false"
                          style="
                            width: 33.6px;
                            height: 33.6px;
                            transition: all 0.5s ease 0s;
                          "
                        >
                          <img
                            class="icon"
                            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+YXJyb3dfZXhjaGFuZ2U8L3RpdGxlPgogICAgPGRlZnM+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSIxMDAlIiB5MT0iODguMjgxMjUlIiB4Mj0iMCUiIHkyPSIxOS4xMjEzMDc4JSIgaWQ9ImxpbmVhckdyYWRpZW50LTEiPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNTQ3MEVDIiBvZmZzZXQ9IjAlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiM0NThBRTMiIG9mZnNldD0iMzAuNzgzOTMzNiUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzExRTFDNCIgb2Zmc2V0PSI3NC41ODQwNDQlIj48L3N0b3A+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNEOEZGRUQiIG9mZnNldD0iMTAwJSI+PC9zdG9wPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0i6aG16Z2i5pS554mIIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5YWo5bGA6KeE6IyDIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTQ4LjAwMDAwMCwgLTEzNTAuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJhcnJvd19leGNoYW5nZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTU2LjAwMDAwMCwgMTM1OC4wMDAwMDApIHJvdGF0ZSgtOTAuMDAwMDAwKSB0cmFuc2xhdGUoLTk1Ni4wMDAwMDAsIC0xMzU4LjAwMDAwMCkgdHJhbnNsYXRlKDk0OC4wMDAwMDAsIDEzNTAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiBmaWxsPSIjRDhEOEQ4IiBvcGFjaXR5PSIwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjAwMDAwMCwgOC4wMDAwMDApIHJvdGF0ZSgtMjcwLjAwMDAwMCkgdHJhbnNsYXRlKC04LjAwMDAwMCwgLTguMDAwMDAwKSAiIHg9Ii0xLjEzNjg2ODM4ZS0xMyIgeT0iMS40MjEwODU0N2UtMTMiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTEyLDMgQzEyLjU1MjI4NDcsMyAxMywzLjQ0NzcxNTI1IDEzLDQgTDEzLDEwIEwxNS41OTk3MDYxLDEwIEMxNS43NjE1NzU2LDkuOTk5ODU1NTMgMTUuOTA3NTYyOSwxMC4xMTA1OTU3IDE1Ljk2OTUyNDksMTAuMjgwNTMwMiBDMTYuMDMxNDg2OSwxMC40NTA0NjQ2IDE1Ljk5NzIwNTgsMTAuNjQ2MDg1MSAxNS44ODI2ODMsMTAuNzc2MDgxMSBMMTIuMjgyOTc2OSwxNC44NjY2OTc0IEMxMi4yMDc5NTU3LDE0Ljk1MjA0NDUgMTIuMTA2MTU1LDE1IDEyLDE1IEMxMS44OTM4NDUsMTUgMTEuNzkyMDQ0MywxNC45NTIwNDQ1IDExLjcxNzAyMzEsMTQuODY2Njk3NCBMOC4xMTczMTY5NSwxMC43NzYwODExIEM4LjAwMjc5NDIyLDEwLjY0NjA4NTEgNy45Njg1MTMwNywxMC40NTA0NjQ2IDguMDMwNDc1MDcsMTAuMjgwNTMwMiBDOC4wOTI0MzcwNywxMC4xMTA1OTU3IDguMjM4NDI0MzksOS45OTk4NTU1MyA4LjQwMDI5Mzg1LDEwIEwxMSwxMCBMMTEsNCBDMTEsMy40NDc3MTUyNSAxMS40NDc3MTUzLDMgMTIsMyBaIE00LDEzIEM0LjU1MjI4NDc1LDEzIDUsMTIuNTUyMjg0NyA1LDEyIEw1LDYgTDcuNTk5NzA2MTUsNiBDNy43NjE1NzU2MSw2LjAwMDE0NDQ3IDcuOTA3NTYyOTMsNS44ODk0MDQyOCA3Ljk2OTUyNDkzLDUuNzE5NDY5ODUgQzguMDMxNDg2OTMsNS41NDk1MzU0MiA3Ljk5NzIwNTc4LDUuMzUzOTE0ODYgNy44ODI2ODMwNSw1LjIyMzkxODkgTDQuMjgyOTc2OSwxLjEzMzMwMjU4IEM0LjIwNzk1NTcyLDEuMDQ3OTU1NDggNC4xMDYxNTUwMywxIDQsMSBDMy44OTM4NDQ5NywxIDMuNzkyMDQ0MjgsMS4wNDc5NTU0OCAzLjcxNzAyMzEsMS4xMzMzMDI1OCBMMC4xMTczMTY5NTIsNS4yMjM5MTg5IEMwLjAwMjc5NDIyMzk4LDUuMzUzOTE0ODYgLTAuMDMxNDg2OTI5Myw1LjU0OTUzNTQyIDAuMDMwNDc1MDY4NCw1LjcxOTQ2OTg1IEMwLjA5MjQzNzA2NjEsNS44ODk0MDQyOCAwLjIzODQyNDM5Myw2LjAwMDE0NDQ3IDAuNDAwMjkzODUyLDYgTDMsNiBMMywxMiBDMywxMi41NTIyODQ3IDMuNDQ3NzE1MjUsMTMgNCwxMyBaIiBpZD0i5b2i54q257uT5ZCIIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjAwMDAwMCwgOC4wMDAwMDApIHJvdGF0ZSgtMjcwLjAwMDAwMCkgdHJhbnNsYXRlKC04LjAwMDAwMCwgLTguMDAwMDAwKSAiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
                            alt=""
                          />
                        </div>
                      </div>
                      <div
                        @click="openCoinDialog('to')"
                        class="SwapChainAndToken__Wrapper-sc-14c5e73-0 djHyGt"
                      >
                        <div class="style__ContentWrapper-sc-6538d67c-1 eUfuKh">
                          <div class="title">{{$t('bridge.target_chain_token')}}</div>
                          <div class="info">
                            <div
                              width="30"
                              class="DoubleIcon__DoubleIconWrapper-sc-e5cf7743-0 jMKBlT"
                            >
                              <img
                                class="token-symbol"
                                :src="currentNetToken.to.token.logoURI"
                                width="30"
                                height="30"
                                style="border-radius: 50%"
                              /><img
                                class="chain-symbol"
                                :src="currentNetToken.to.net.icon"
                                width="16"
                                height="16"
                              />
                            </div>
                            <div class="selected chain_token">
                              {{ currentNetToken.to.token.symbol
                              }}<span class="chain">
                                on {{ currentNetToken.to.net.name }}</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="swap-value">
                        <div
                          class="style__ChainAndTokenWrapper-sc-6538d67c-0 ckXvFL"
                        >
                          <div
                            class="style__ContentWrapper-sc-6538d67c-1 eUfuKh"
                            style="padding: 12px 16px"
                          >
                            <div class="title">{{$t('bridge.send') }}</div>
                            <div
                              class="SwapInfo__SwapInfoWrapper-sc-dd8919b7-0 jFkCKs"
                            >
                              <div class="left">
                                <div class="icon">
                                  <div
                                    width="30"
                                    class="DoubleIcon__DoubleIconWrapper-sc-e5cf7743-0 jMKBlT"
                                  >
                                    <img
                                      class="token-symbol"
                                      :src="currentNetToken.from.token.logoURI"
                                      width="30"
                                      height="30"
                                      style="border-radius: 50%"
                                    /><img
                                      class="chain-symbol"
                                      :src="currentNetToken.from.net.icon"
                                      width="16"
                                      height="16"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div class="right">
                                <div class="row">
                                  <input
                                    @input="inputFromValue"
                                    
                                    inputmode="decimal"
                                    :title="fromValue"
                                    autocomplete="off"
                                    autocorrect="off"
                                    type="text"
                                    pattern="^[0-9]*[.,]?[0-9]*$"
                                    :placeholder="$t('bridge.input')"
                                    minlength="1"
                                    maxlength="79"
                                    spellcheck="false"
                                    class="NumericalInput__StyledInput-sc-1b49fd61-0 fWwMfG"
                                    :value="fromValue"
                                    style="
                                      min-width: 198px;
                                      max-width: 250px;
                                      font-size: 20px;
                                      color: rgb(255, 255, 255);
                                      white-space: nowrap;
                                      overflow: hidden;
                                      text-overflow: ellipsis;
                                    "
                                  />
                                  <button @click="setMax" class="style__StyledBalanceMax-sc-8b589f82-1 fiUEuK">MAX</button>
                                </div>
                                <div class="row">
                                  <div class="css-1viy94i" :title="fromValue*currentNetToken.from.token.priceUsd">$ {{ fromValue*currentNetToken.from.token.priceUsd || 0 }}</div>
                                  <div class="css-1viy94i" :title="currentNetToken.from.token.balance">{{ $t('bridge.balance') }}: {{ currentNetToken.from.token.balance || 0 }}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="swap-value">
                        <div
                          class="style__ChainAndTokenWrapper-sc-6538d67c-0 ckXvFL"
                        >
                          <div
                            class="style__ContentWrapper-sc-6538d67c-1 eUfuKh"
                            style="padding: 12px 16px"
                          >
                            <div class="title">{{$t('bridge.receive') }}</div>
                            <div
                              class="SwapInfo__SwapInfoWrapper-sc-dd8919b7-0 jFkCKs"
                            >
                              <div class="left">
                                <div class="icon">
                                  <div
                                    width="30"
                                    class="DoubleIcon__DoubleIconWrapper-sc-e5cf7743-0 jMKBlT"
                                  >
                                    <img
                                      class="token-symbol"
                                      :src="currentNetToken.to.token.logoURI"
                                      width="30"
                                      height="30"
                                      style="border-radius: 50%"
                                    /><img
                                      class="chain-symbol"
                                      :src="currentNetToken.to.net.icon"
                                      width="16"
                                      height="16"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div class="right">
                                <div class="row">
                                  <input
                                    @input="inputFromValue"
                                    inputmode="decimal"
                                    :title="fromValue"
                                    autocomplete="off"
                                    autocorrect="off"
                                    type="text"
                                    pattern="^[0-9]*[.,]?[0-9]*$"
                                    minlength="1"
                                    maxlength="79"
                                    spellcheck="false"
                                    class="NumericalInput__StyledInput-sc-1b49fd61-0 fWwMfG"
                                    :value="Number(fromValue)-Number(currentNetToken.to.token.fee)"
                                    disabled
                                    style="
                                      min-width: 198px;
                                      max-width: 250px;
                                      font-size: 20px;
                                      color: rgb(255, 255, 255);
                                      white-space: nowrap;
                                      overflow: hidden;
                                      text-overflow: ellipsis;
                                    "
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
<div class="RecipientAddress__RecipientWrapper-sc-d047c8bd-0 fSaIwF animate__animated animate__fadeInDown animate__faster">
  <div style="display:flex;flex-direction:row;align-items:center" class="input-address">
    <div class="css-1j2nt6a">{{ $t('bridge.receive_address') }}

    </div>
    <img width="16" src="" alt="" class="SwapTooltip__SwapTooltipWrapper-sc-c2f6a320-0 bBLEIb" style="margin-left: 4px;">
  </div>
  <div class="search">
    <el-input
      @input="inputAddressValue"
      clearable
      placeholder="0x0000..."
      v-model="addressValue"
      :popper-append-to-body="false"
      :disabled="addressDisabled"
    >

     </el-input>
  </div>
</div>
                    <div
                        v-if="!account || swapDisabled"
                      class="ErrorWarning__Wrapper-sc-991892c0-0 dDAAhQ"
                    >
                      <div class="error-icon">
                        <img
                          width="24"
                          height="24"
                          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbl9mYWlsdXJlPC90aXRsZT4KICAgIDxnIGlkPSLlj4zpkrHljIUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJzd2FwX+S6pOaYk+atpemqpOadoSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY5LjAwMDAwMCwgLTg5MS4wMDAwMDApIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUzLjAwMDAwMCwgNTk3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Imljb25fZmFpbHVyZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYuMDAwMDAwLCAyOTQuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEyLDI0IEM1LjM4Mzc4Mzc4LDI0IDAsMTguNjE2MjE2MiAwLDEyIEMwLDUuMzgzNzgzNzggNS4zODM3ODM3OCwwIDEyLDAgQzE4LjYxNjIxNjIsMCAyNCw1LjM4Mzc4Mzc4IDI0LDEyIEMyNCwxOC42MTYyMTYyIDE4LjYxNjIxNjIsMjQgMTIsMjQgWiIgaWQ9IuWQiOW5tuW9oueKtiIgZmlsbD0iI0ZGNDE4OSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNy4zMDMzMDA5LDYuNjk2Njk5MTQgQzE3Ljg4OTA4NzMsNy4yODI0ODU1OCAxNy44ODkwODczLDguMjMyMjMzMDUgMTcuMzAzMzAwOSw4LjgxODAxOTQ4IEwxNC4xMjAzNTkzLDExLjk5OTM1OTMgTDE3LjMwMzMwMDksMTUuMTgxOTgwNSBDMTcuODg5MDg3MywxNS43Njc3NjcgMTcuODg5MDg3MywxNi43MTc1MTQ0IDE3LjMwMzMwMDksMTcuMzAzMzAwOSBDMTYuNzE3NTE0NCwxNy44ODkwODczIDE1Ljc2Nzc2NywxNy44ODkwODczIDE1LjE4MTk4MDUsMTcuMzAzMzAwOSBMMTEuOTk5MzU5MywxNC4xMjAzNTkzIEw4LjgxODAxOTQ4LDE3LjMwMzMwMDkgQzguMjMyMjMzMDUsMTcuODg5MDg3MyA3LjI4MjQ4NTU4LDE3Ljg4OTA4NzMgNi42OTY2OTkxNCwxNy4zMDMzMDA5IEM2LjExMDkxMjcsMTYuNzE3NTE0NCA2LjExMDkxMjcsMTUuNzY3NzY3IDYuNjk2Njk5MTQsMTUuMTgxOTgwNSBMOS44NzgzNTkzMSwxMS45OTkzNTkzIEw2LjY5NjY5OTE0LDguODE4MDE5NDggQzYuMTEwOTEyNyw4LjIzMjIzMzA1IDYuMTEwOTEyNyw3LjI4MjQ4NTU4IDYuNjk2Njk5MTQsNi42OTY2OTkxNCBDNy4yODI0ODU1OCw2LjExMDkxMjcgOC4yMzIyMzMwNSw2LjExMDkxMjcgOC44MTgwMTk0OCw2LjY5NjY5OTE0IEwxMS45OTkzNTkzLDkuODc4MzU5MzEgTDE1LjE4MTk4MDUsNi42OTY2OTkxNCBDMTUuNzY3NzY3LDYuMTEwOTEyNyAxNi43MTc1MTQ0LDYuMTEwOTEyNyAxNy4zMDMzMDA5LDYuNjk2Njk5MTQgWiIgaWQ9IuW9oueKtue7k+WQiCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
                          alt="error"
                        />
                      </div>
                      <div class="error-container" >
                        <div class="error-title css-1vl6u1l">
                          {{ errorBlock[errorType].title }}
                        </div>
                        <div class="error-content css-82dlr9">
                          {{ errorBlock[errorType].content }}
                        </div>
                      </div>
                    </div>
                    <div class="swap-bottom flex items-center">
                      <div
                        class="GradientBorderButton__Wrapper-sc-3f147dcd-0 iIErwq false"
                      >
                        <button
                          class="false"
                          @click="openCollect"
                          v-if="!account"
                        >
                          <div
                            class="btn"
                            style="
                              display: flex;
                              align-items: center;
                              height: 24px;
                              cursor: pointer;
                            "
                          >
                            <div class="button_text active">{{ $t('bridge.connect_wallet') }}</div>
                          </div>
                        </button>
                        <el-button
                        @click="swap"
                        class="false"
                    size="small"
                    plain
                    type="primary"
                    :disabled="swapDisabled"
                    :loading="swapLoading"
                    v-else
                    >                          <div
                            class="btn"
                            style="
                              display: flex;
                              align-items: center;
                              height: 24px;
                              cursor: pointer;
                            "
                          >
                            <div class="button_text active">{{$t('bridge.trade')}}</div>
                          </div></el-button
                  >
                        <!-- <button
                          class="false"
                          @click="swap"



                        >
                          <div
                            class="btn"
                            style="
                              display: flex;
                              align-items: center;
                              height: 24px;
                              cursor: pointer;
                            "
                          >
                            <div class="button_text active">{{$t('bridge.trade')}}</div>
                          </div>
                        </button> -->
                      </div>
                      <div
                      v-if="false"
                        class="GradientBorderButton__Wrapper-sc-3f147dcd-0 hXxaqs false"
                      >
                        <button class="false">
                          <div
                          @click="switchAddress"
                            class="ToggleManually__Wrapper-sc-39763d24-0 jaGDCx false"
                          >
                            <img
                              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Q2FyZGhvbGRlcjwvdGl0bGU+CiAgICA8ZyBpZD0i5Y+M6ZKx5YyFIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5Zyw5Z2A6ZSZ6K+vIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzg4LjAwMDAwMCwgLTY5MS4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MjUuMDAwMDAwLCAxMTEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTI4IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wMDAwMDAsIDU2OC41MDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iQ2FyZGhvbGRlciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzM5LjAwMDAwMCwgMTEuNTAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIHg9IjAiIHk9IjAiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjYsNiBMNiw2IEM0LjM0MzkzMTA0LDYuMDAxODk0MzMgMy4wMDE4OTQzMyw3LjM0MzkzMTA0IDMsOSBMMywyMyBDMy4wMDE4OTQzMywyNC42NTYwNjkgNC4zNDM5MzEwNCwyNS45OTgxMDU3IDYsMjYgTDI2LDI2IEMyNy42NTYwNjksMjUuOTk4MTA1NyAyOC45OTgxMDU3LDI0LjY1NjA2OSAyOSwyMyBMMjksOSBDMjguOTk4MTA1Nyw3LjM0MzkzMTA0IDI3LjY1NjA2OSw2LjAwMTg5NDMzIDI2LDYgWiBNMTguOTQwMDYzOCwxNS42MDA5NTI1IEMxOC42NTQxMjM4LDE2Ljk5NzM0MzggMTcuNDI1NDE4OSwxOCAxNi4wMDAwNTIyLDE4IEMxNC41NzQ2ODU1LDE4IDEzLjM0NTkzOCwxNi45OTc0NTY2IDEzLjA1OTkzODgsMTUuNjAxMDc3NSBDMTIuODY4NjQyNywxNC42NzA4MjQ2IDEyLjA1MDkxMTQsMTQuMDAyNDEwNCAxMS4xMDExOTYyLDE0IEw1LDE0IEw1LDEyIEwyNywxMiBMMjcsMTQgTDIwLjg5ODgwMzcsMTQgQzE5Ljk0OTEyOTcsMTQuMDAyNDA0NiAxOS4xMzE0MTU5LDE0LjY3MDc1MzEgMTguOTQwMDYzOCwxNS42MDA5NTI1IFogTTYsOCBMMjYsOCBDMjYuNTUyMDIyOSw4LjAwMDYzMTY3IDI2Ljk5OTM2ODMsOC40NDc5NzcxMSAyNyw5IEwyNywxMCBMNSwxMCBMNSw5IEM1LjAwMDYzMTY3LDguNDQ3OTc3MTEgNS40NDc5NzcxMSw4LjAwMDYzMTY3IDYsOCBMNiw4IFoiIGlkPSLlvaLnirYiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
                              alt=""
                            />
                          </div>
                        </button>
                      </div>
                    </div>
                  </el-tab-pane>
                  <!-- <el-tab-pane label="同链兑换" name="second"></el-tab-pane> -->
                </el-tabs>
              </div>
            </div>
          </div>
        </div>

        <div class="multiRoute-close">
          <div class="MultiRoute__ListWrapper-sc-8b1ad1e3-0 lkeFgm">
            <div class="">
              <div class="refresh">
                <div
                  class="ant-progress ant-progress-circle ant-progress-status-normal ant-progress-default"
                  role="progressbar"
                >
                  <div
                    class="ant-progress-inner"
                    style="width: 24px; height: 24px; font-size: 9.6px"
                  >
                    <svg
                      class="ant-progress-circle"
                      viewBox="-50 -50 100 100"
                      role="presentation"
                    >
                      <circle
                        class="ant-progress-circle-trail"
                        r="44"
                        cx="0"
                        cy="0"
                        stroke="#4d586a"
                        stroke-linecap="round"
                        stroke-width="12"
                        style="
                          stroke: rgb(77, 88, 106);
                          stroke-dasharray: 276.46px, 276.46;
                          stroke-dashoffset: 0;
                          transform: rotate(-90deg);
                          transform-origin: 0px 0px;
                          transition: stroke-dashoffset 0.3s ease 0s,
                            stroke-dasharray 0.3s ease 0s, stroke 0.3s ease 0s,
                            stroke-width 0.06s ease 0.3s, opacity 0.3s ease 0s;
                          fill-opacity: 0;
                        "
                      ></circle>
                      <circle
                        class="ant-progress-circle-path"
                        r="44"
                        cx="0"
                        cy="0"
                        stroke-linecap="round"
                        stroke-width="12"
                        opacity="1"
                        style="
                          stroke: rgb(12, 245, 239);
                          stroke-dasharray: 276.46px, 276.46;
                          stroke-dashoffset: 19.823;
                          transform: rotate(-90deg);
                          transform-origin: 0px 0px;
                          transition: stroke-dashoffset 0s ease 0s,
                            stroke-dasharray 0s ease 0s, stroke ease 0s,
                            stroke-width ease 0.3s, opacity ease 0s;
                          fill-opacity: 0;
                        "
                      ></circle>
                      <circle
                        class="ant-progress-circle-path"
                        r="44"
                        cx="0"
                        cy="0"
                        stroke-linecap="round"
                        stroke-width="12"
                        opacity="0"
                        style="
                          stroke: rgb(82, 196, 26);
                          stroke-dasharray: 276.46px, 276.46;
                          stroke-dashoffset: 276.45;
                          transform: rotate(-90deg);
                          transform-origin: 0px 0px;
                          transition: stroke-dashoffset 0s ease 0s,
                            stroke-dasharray 0s ease 0s, stroke ease 0s,
                            stroke-width ease 0.3s, opacity ease 0s;
                          fill-opacity: 0;
                        "
                      ></circle>
                    </svg>
                  </div>
                </div>
                <span class="title">{{$t('bridge.will_receive')}}: </span>
              </div>
              <div
                class="sort__Drop-sc-6eb3a421-0 fvkKVu ant-dropdown-trigger"
                style="cursor: pointer"
              >
                <img
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbl9yZWNvbW1lbmQ8L3RpdGxlPgogICAgPGcgaWQ9IuWPjOmSseWMhSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Iui3r+W+hOmAieaLqTJfdGlwcyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwMDcuMDAwMDAwLCAtMjAxLjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk5MS4wMDAwMDAsIDE3Ny4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMTciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAxMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0iaWNvbl9yZWNvbW1lbmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2LjAwMDAwMCwgMTIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSLot6/lvoQiIHBvaW50cz0iNi4wMzQ5NjI5NiAxMC4xMDU0ODE1IDEuNjg0MTQ4MTUgMTAuMTA1NDgxNSAxLjY4NDE0ODE1IDE2IDAgMTYgMCAwIDEwLjEwNDg4ODkgMCA5Ljk2NTAzNzA0IDEuNjg0MTQ4MTUgMTYgMS42ODQxNDgxNSAxMy40NzM3Nzc4IDYuNzM2NTkyNTkgMTYgMTEuNzg5NjI5NiA1Ljg5NDUxODUyIDExLjc4OTYyOTYiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
                  alt=""
                /><span class="name">{{$t('bridge.recommend')}}</span
                ><img
                  class="icon-close"
                  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTQuMTQyMTk3MXB4IiBoZWlnaHQ9IjE0LjE0MjE5NzFweCIgdmlld0JveD0iMCAwIDE0LjE0MjE5NzEgMTQuMTQyMTk3MSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDx0aXRsZT7nvJbnu4QgNjwvdGl0bGU+CiAgICA8ZyBpZD0i6aG16Z2i5pS554mIIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5YWo5bGA6KeE6IyDIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTA5LjkyODkwMSwgLTE0NjYuOTI4OTAxKSI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMTkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDUwNS4wMDAwMDAsIDE0NjMuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQuMDAwMDAwLCA0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIHg9IjAiIHk9IjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDxwb2x5bGluZSBpZD0i6Lev5b6EIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjAwMDAwMCwgNy4wMDAwMDApIHJvdGF0ZSgtMzE1LjAwMDAwMCkgdHJhbnNsYXRlKC04LjAwMDAwMCwgLTcuMDAwMDAwKSAiIHBvaW50cz0iMTIgMyAxMS42Mjg0MjcxIDEwLjYyODQyNzEgNCAxMSI+PC9wb2x5bGluZT4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <div class="style__FooterWrapper-sc-34567d84-0 kkPbjm">
        <p class="copyright">Powered by ONLY</p>
        <ul class="link-imgs flex">
          <li>
            <a href="" target="_blank"
              ><img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDhweCIgaGVpZ2h0PSI0OXB4IiB2aWV3Qm94PSIwIDAgNDggNDkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+dHdpdHRlckAyeDwvdGl0bGU+CiAgICA8ZyBpZD0i5LyY5YyWMS4wIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i57yW57uELTI1IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC4wMDAwMDgsIDAuMzczNjU4KSIgZmlsbD0iI0Q2RURGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9InR3aXR0ZXIiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTI0LDAgQzEwLjc0NTE2NTIsMCAwLDEwLjc0NTEyOTkgMCwyMy45OTk5MTk0IEMwLDM3LjI1NDcwOSAxMC43NDUxNjUyLDQ3Ljk5OTgzODkgMjQsNDcuOTk5ODM4OSBDMzcuMjU0ODMxMiw0Ny45OTk4Mzg5IDQ4LDM3LjI1NDcwOSA0OCwyMy45OTk5MTk0IEM0OCwxNy42MzQ3NDUxIDQ1LjQ3MTQzMjQsMTEuNTMwMjcxNiA0MC45NzA1NTk2LDcuMDI5NDEzNjYgQzM2LjQ2OTY4NjksMi41Mjg1NTU2OCAzMC4zNjUxOTM1LDAgMjQsMCBaIE0zMy41ODQ5OTc1LDIwLjI2NDkzMiBDMzMuNTg0OTk3NSwyMC40NzQ5MzEzIDMzLjU4NDk5NzUsMjAuNjg0OTMwNiAzMy41ODQ5OTc1LDIwLjkwOTkyOTggQzMzLjU4MjA3NDQsMjYuMDMzNzg2NCAzMC43ODUxNTQ2LDMwLjc0ODI0NjQgMjYuMjg5Njc2OSwzMy4yMDY4NDkxIEMyMS43OTQxOTkyLDM1LjY2NTQ1MTkgMTYuMzE1NzQ0NiwzNS40NzY4NDIgMTEuOTk5OTk5MSwzMi43MTQ4OTAyIEMxNC42MDg2MTk3LDMzLjAyMzI1MTIgMTcuMjMzNTg0NywzMi4yOTAyMDM4IDE5LjMwNDk5ODUsMzAuNjc0ODk3IEMxNy4xOTcwNDcsMzAuNjM1NjAyOCAxNS4zNDY4NjcsMjkuMjYxNTMyMyAxNC42OTk5OTg5LDI3LjI1NDkwODUgQzE1LjAwNjQxNTYsMjcuMzE0NTIzNyAxNS4zMTc4MzY4LDI3LjM0NDY2MTEgMTUuNjI5OTk4OCwyNy4zNDQ5MDgyIEMxNi4wNzEyMTcxLDI3LjM0NTM2MTMgMTYuNTEwMzc4LDI3LjI4NDc4NzYgMTYuOTM0OTk4NywyNy4xNjQ5MDg4IEMxNC42MzQ0ODM5LDI2LjcwMTI2NTQgMTIuOTc4NjczOSwyNC42ODE2ODU3IDEyLjk3NDk5OSwyMi4zMzQ5MjUgTDEyLjk3NDk5OSwyMi4zMzQ5MjUgQzEzLjY2MDYwMjgsMjIuNzE0NDY4NyAxNC40MjY3MzY2LDIyLjkyNTI4MzMgMTUuMjA5OTk4OCwyMi45NDk5MjMgQzEzLjA1MTE1MjYsMjEuNDk0MzI2MyAxMi4zOTQ1NzE2LDE4LjYxMTk0NTQgMTMuNzA5OTk5LDE2LjM2NDk0NTEgQzE2LjIxNDkwNzEsMTkuNDQ5MjY5OSAxOS45MTE2NjM5LDIxLjMyNDkwNDQgMjMuODc5OTk4MiwyMS41MjQ5Mjc4IEMyMy4zNzUwNzA2LDE5LjM1MjI3NjYgMjQuMzkwMjg4MSwxNy4xMTEwMzAyIDI2LjM1NjQ4MTcsMTYuMDU3NzE1NyBDMjguMzIyNjc1MywxNS4wMDQ0MDEyIDMwLjc1MDk4MDMsMTUuNDAwOTA5NCAzMi4yNzk5OTc2LDE3LjAyNDk0MjkgQzMzLjM4NTkzMzMsMTYuODA3MTcxIDM0LjQ0NjMxMjUsMTYuNDAxMjg1NSAzNS40MTQ5OTczLDE1LjgyNDk0NjkgQzM1LjA0Njc2ODEsMTYuOTY5NTEzMyAzNC4yNzMzNTM4LDE3Ljk0MDI3ODUgMzMuMjM5OTk3NSwxOC41NTQ5Mzc3IEMzNC4xOTYyNzA0LDE4LjQxMjA1OTEgMzUuMTI2MjYzNSwxOC4xMjkwMTg2IDM1Ljk5OTk5OTEsMTcuNzE0OTQwNSBDMzUuMzUxODk4OSwxOC43MDA4ODEgMzQuNTM0MjY2NCwxOS41NjQyMTY4IDMzLjU4NDk5NzUsMjAuMjY0OTMyIFoiIGlkPSLlvaLnirYiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
                alt=""
            /></a>
          </li>
          <li>
            <a href="" target="_blank"
              ><img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDhweCIgaGVpZ2h0PSI0OXB4IiB2aWV3Qm94PSIwIDAgNDggNDkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+dGVsZWdyYW1AMng8L3RpdGxlPgogICAgPGcgaWQ9IuS8mOWMljEuMCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Iue8lue7hC0yNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE5Mi4wMDAwMDgsIDAuMzczNjU4KSIgZmlsbD0iI0Q2RURGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9InRlbGVncmFtIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTEuOTk5OTg1LCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTI0LDAgQzM3LjI1ODA2MTcsMCA0OCwxMC43NDE4OTk0IDQ4LDIzLjk5OTkxOTQgQzQ4LDM3LjI1NzkzOTUgMzcuMjU4MDYxNyw0Ny45OTk4Mzg5IDI0LDQ3Ljk5OTgzODkgQzEwLjc0MTkzNDcsNDcuOTk5ODM4OSAwLDM3LjI1NzkzOTUgMCwyMy45OTk5MTk0IEMwLDEwLjc0MTg5OTQgMTAuNzQxOTM0NywwIDI0LDAgWiBNMjQuOTM3MTkwOCwxMy4xODA1NDExIEwyNC42MDg2NTEsMTMuMjg1MDc2MiBDMjMuNTA0NTQxNywxMy44MzcxMjkgMjIuMzMzNDE3OCwxNC40MjEyMzIyIDIxLjE1MjcyNDgsMTUuMDA5MTAwOSBMMjAuNTA4MTA2OCwxNS4zMjk5NiBDMTUuMzQ5MDk1LDE3Ljg5NzEwMDEgMTAuMjA2NzU3NiwyMC40MzgwMTU5IDkuODU0MjI2MDcsMjAuNjAyNTMwMSBDOC45NzMxNDE5OSwyMS4xNTUwNzI2IDguNTQwMDY2NzYsMjIuMTI1NzU1MiA4LjQzNTUzMTM2LDIzLjMzNTM3NTIgQzguMzMwOTk1OTcsMjUuMzA2NjA3NyA5LjMwMTY4MTgyLDI3LjM4MjM3NTIgMTAuODM5ODQ1NSwyOC4xNDM5ODc4IEwxOS42OTU0ODcyLDMyLjcyODU5NjcgQzE5Ljg4OTYyNDQsMzQuMDg3NTUyNCAyMS4wNTQ0NDc0LDM1LjExNzk2OTQgMjIuNDI4MzQxMiwzNS4xMzI5MDMgQzIzLjk1MTU3MTMsMzUuMTMyOTAzIDI1LjI2NTczMDcsMzMuOTM4MjE2NiAyNS4yNjU3MzA3LDMyLjQwMDA1NzkgTDM0Ljk4NzUyMjgsMjcuMTU4MzcxNSBDMzUuNTQwMDY3LDI3LjU5MTQ0NTMgMzYuMDc3Njc3NywyNy43MTA5MTM5IDM2LjczNDc1NzMsMjcuNzEwOTEzOSBDMzguMjg3ODU0NywyNy42ODEwNDY4IDM5LjU0MjI3OTUsMjYuNDI2NjI2MSAzOS41NzIxNDY3LDI0Ljg3MzUzMzggQzM5LjM3ODAwOTYsMjMuNTU5Mzc4OSAzOC4xODMzMTkzLDIyLjM2NDY5MjUgMzYuNjQ1MTU1NSwyMi4zNjQ2OTI1IEMzNS4wOTIwNTgyLDIyLjM5NDU1OTcgMzMuODM3NjMzNCwyMy42NDg5ODAzIDMzLjgwNzc2NjEsMjUuMjAyMDcyNiBDMzMuODA3NzY2MSwyNS41MzA2MTEzIDMzLjgwNzc2NjEsMjUuODU5MTUwMSAzMy45MTIzMDE1LDI2LjA4MzE1MzggTDI0LjYyMzU4NDYsMzAuOTk2MzAxNCBDMjMuNzQyNTAwNSwyOS43MjY5NDcyIDIxLjk4MDMzMjQsMjkuNDEzMzQyIDIwLjcxMDk3NCwzMC4yOTQ0MjMyIEMyMC4zMzc2MzMzLDMwLjU2MzIyNzYgMjAuMDI0MDI3MSwzMC45MDY3IDE5LjgxNDk1NjMsMzEuMzI0ODQwMiBMMTEuNTExODU4OCwyNi45NDkzMDE0IEMxMC42NDU3MDg0LDI2LjUxNjIyNzYgOS45ODg2Mjg3MywyNC45NzgwNjg5IDEwLjA5MzE2NDEsMjMuNjYzOTEzOSBDMTAuMDkzMTY0MSwyMy4wMDY4MzY0IDEwLjQyMTcwNCwyMi40NjkyMjc2IDEwLjc1MDI0MzgsMjIuMjQ1MjIzOSBDMTAuOTg5MTgxOCwyMi4xNDA2ODg4IDExLjI3MjkyMDgsMjIuMTQwNjg4OCAxMS41MTE4NTg4LDIyLjI0NTIyMzkgTDExLjYxNjM5NDIsMjIuMjQ1MjIzOSBDMTIuNDYxODIwNSwyMi43MDg0Njk2IDE0LjA4MTg4NTksMjMuNTUxMTc1IDE1Ljc2MDkyNTcsMjQuNDIyNDc0IEwxNi4yOTIyNzQ0LDI0LjY5ODE2MjIgQzE4Ljc3MzI1OTUsMjUuOTg1MzIzNiAyMS4yMTg3MTczLDI3LjI1NDM3MzEgMjEuMzM4MTg2NCwyNy4zODIzNzUyIEMyMS43NzEyNjE2LDI3LjYwNjM3ODkgMjIuMDk5ODAxNCwyNy43MTA5MTM5IDIyLjg2MTQxNjUsMjcuMjc3ODQwMSBMMzcuODM5ODQ1OCwxOS41MjczMTI0IEMzOC4wOTM3MTc1LDE5LjQwNzg0MzggMzguMjcyOTIxLDE5LjE1Mzk3MjkgMzguMjcyOTIxLDE4Ljg3MDIzNDkgQzM4LjI3MjkyMSwxOC40MzcxNjExIDM3LjgzOTg0NTgsMTguMjEzMTU3NCAzNy44Mzk4NDU4LDE4LjIxMzE1NzQgQzM2Ljk1ODc2MTcsMTcuNzgwMDgzNiAzNS42NTk1MzYxLDE3LjIyNzU0MTIgMzQuNDQ5OTEyMiwxNi41NzA0NjM3IEMzMS43MTcwNTgxLDE1LjI1NjMwODcgMjguNjU1NjY0MywxMy44Mzc2MTg2IDI3LjIzNjk2OTYsMTMuMTgwNTQxMSBDMjYuNTM1MDg5MSwxMi43NjI0MDA5IDI1LjY1NDAwNSwxMi43NjI0MDA5IDI0LjkzNzE5MDgsMTMuMTgwNTQxMSBaIE0yMi4zMzg3Mzk1LDMxLjY1MzM3ODkgQzIyLjgxNjYxNTYsMzEuNjUzMzc4OSAyMy4yMTk4MjM2LDMyLjA0MTY1MiAyMy4yMTk4MjM2LDMyLjUzNDQ2MDEgQzIzLjIxOTgyMzYsMzMuMDEyMzM0NyAyMi44MzE1NDkyLDMzLjQxNTU0MTMgMjIuMzM4NzM5NSwzMy40MTU1NDEzIEMyMS44OTc2MjMxLDMzLjQxNTU0MTMgMjEuNTIwMTI5MiwzMy4wODQ3MDUxIDIxLjQ2NDY2MzQsMzIuNjQ2MjAwMyBMMjEuNDU3NjU1NCwzMi41MzQ0NjAxIEMyMS40NDI3MjE4LDMyLjA1NjU4NTYgMjEuODMwOTk2MSwzMS42NjgzMTI1IDIyLjMwODg3MjIsMzEuNjUzMzc4OSBMMjIuMzM4NzM5NSwzMS42NTMzNzg5IEwyMi4zMzg3Mzk1LDMxLjY1MzM3ODkgWiBNMzYuNjQ1MTU1NSwyNC4zMjA5OTE0IEMzNy4xMjMwMzE3LDI0LjMyMDk5MTQgMzcuNTExMzA2LDI0LjY5NDMzMDkgMzcuNTExMzA2LDI1LjE3MjIwNTQgTDM3LjUxMTMwNiwyNS4yMDIwNzI2IEwzNy41MTEzMDYsMjUuMjAyMDcyNiBDMzcuNDk2MzcyNCwyNS42Nzk5NDcxIDM3LjEyMzAzMTcsMjYuMDUzMjg2NiAzNi42NDUxNTU1LDI2LjA4MzE1MzggQzM2LjE2NzI3OTQsMjYuMDgzMTUzOCAzNS43NzkwMDUxLDI1LjcwOTgxNDMgMzUuNzY0MDcxNSwyNS4yMzE5Mzk4IEwzNS43NjQwNzE1LDI1LjIwMjA3MjYgTDM1Ljc2NDA3MTUsMjUuMjAyMDcyNiBDMzUuNzkzOTM4NywyNC43MzkxMzE2IDM2LjE2NzI3OTQsMjQuMzY1NzkyMSAzNi42NDUxNTU1LDI0LjMyMDk5MTQgWiIgaWQ9IuW9oueKtiI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
                alt=""
            /></a>
          </li>
          <li>
            <a href="" target="_blank"
              ><img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDhweCIgaGVpZ2h0PSI0OXB4IiB2aWV3Qm94PSIwIDAgNDggNDkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Z2l0aHViQDJ4PC90aXRsZT4KICAgIDxnIGlkPSLkvJjljJYxLjAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLnvJbnu4QtMjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yODguMDAwMDA4LCAwLjM3MzY1OCkiIGZpbGw9IiNENkVERkYiPgogICAgICAgICAgICA8ZyBpZD0iZ2l0aHViIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyODguMDAwMDExLCAwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTI0LjAwMDA3ODcsMCBDMzcuMjU0OTU2MiwwIDQ4LjAwMDE1NzUsMTAuNzQ1MTY2IDQ4LjAwMDE1NzUsMjQgQzQ4LjAwMDE1NzUsMzcuMjU0ODM0IDM3LjI1NDk1NjIsNDggMjQuMDAwMDc4Nyw0OCBDMTAuNzQ1MjAxMyw0OCAwLDM3LjI1NDgzNCAwLDI0IEMwLDEwLjc0NTE2NiAxMC43NDUyMDEzLDAgMjQuMDAwMDc4NywwIFogTTI0LjAwMDAyMzYsNy40MzEzMTc5NCBDMjEuODA2OTcyNSw3LjQyNDcyMDM3IDE5LjYzNTY0MzMsNy44NjU4ODk4NiAxNy42MTkxMTUsOC43Mjc5MzgzMyBDMTUuNTg3NDcwMyw5LjU5NDQyMTIzIDEzLjgzOTY4MzgsMTAuNzU5NTc2MyAxMi4zNzU4MTk2LDEyLjIyMzQzNTcgQzEwLjkxMDg2NTEsMTMuNjg4Mzg1NCA5Ljc0NTcwNjE5LDE1LjQzNjEzNDEgOC44ODAzMTA3MywxNy40NjY3MTM5IEM4LjAxNDg4MzIsMTkuNDk3MjkzNyA3LjU4MTY1NjM2LDIxLjYyNDI2NyA3LjU4MTY1NjM2LDIzLjg0OTc4MjIgQzcuNTgxNjU2MzYsMjcuMzk4MjIyMiA4LjYwMjczNzcxLDMwLjU4NzYwNzkgMTAuNjQzOTcwNSwzMy40MjAwMjM1IEMxMi42ODYxNjUyLDM2LjI1MjQzOTEgMTUuMzMxMTI1NywzOC4yMzUzNjczIDE4LjU4MDkwNDIsMzkuMzY4Nzc2MSBDMTguNzA5MDc2NSwzOS4zODk5NDAzIDE4LjgxNjA1MjQsMzkuNDAwNTIyNCAxOC45MDE4NjQxLDM5LjQwMDUyMjQgQzE4Ljk3NDA5MzEsMzkuNDAzNjE5OSAxOS4wNDU4MTgzLDM5LjM4NzE1NjYgMTkuMTA5NDY2NiwzOS4zNTI4NzA4IEMxOS4xNjM0OTk3LDM5LjMyMDAzNDIgMTkuMjA2OTE4NiwzOS4yODgyNTU4IDE5LjIzODY5NzEsMzkuMjU1NDE5MSBDMTkuMjcwNDc1NiwzOS4yMjM2NDA3IDE5LjI5MTY3MiwzOS4xNzA2NjYgMTkuMzAyMjU0MiwzOS4wOTY1MjcxIEMxOS4zMTI4MzYzLDM5LjAyMDI3MTcgMTkuMzE4MTI3NCwzOC45NjcyOTcgMTkuMzE4MTI3NCwzOC45MzU1MTg2IEwxOS4zMTgxMjc0LDM4LjkzNTUxODYgTDE5LjMxODEyNzQsMzUuNzEzMjk2MyBDMTguNTI2ODcxMSwzNS43OTgwNDk0IDE3LjgyMTQyNjUsMzUuNzkyNzI2MyAxNy4yMDE3NjE0LDM1LjY5NzQyMzEgQzE2LjU4MjA5NjMsMzUuNjAxMDI5NyAxNi4wOTU5MjY2LDM1LjQ1MDYwMzMgMTUuNzQzMTg4MiwzNS4yNDgyOTI1IEMxNS4zOTA0NDk5LDM1LjA0NDkyMzQgMTUuMDgwMDcyMiwzNC43OTM4NzA3IDE0LjgxMzE0NTUsMzQuNDk0MDc2MiBDMTQuNTQ1MTYwNSwzNC4xOTU0MDQgMTQuMzYyOTg3MiwzMy45MjIwOTY4IDE0LjI2NzY1MTYsMzMuNjc2MzY3MiBDMTQuMTY3NjcwNywzMy40MjE1Mjc3IDE0LjA3MTYxODMsMzMuMTY1MTY0MiAxMy45Nzk1Mjg1LDMyLjkwNzM2ODEgQzEzLjg4MzEwMjcsMzIuNjQwNDEwMSAxMy44MjM4MTA2LDMyLjQ4NDcyNDggMTMuODAyNjE0MiwzMi40NDIzMzIyIEMxMy42MDk4NTg3LDMyLjEyMTQwNTQgMTMuMzIxNzAzNSwzMS44Mjc5OTIyIDEyLjkzNzIxODcsMzEuNTYwMDA4MSBDMTIuNTUxNjQzNiwzMS4yOTMwNTAyIDEyLjI2MzU1MjYsMzEuMDc5MDk5MSAxMi4wNzA3NjUxLDMwLjkxOTE0ODggQzExLjg3OTAzNTcsMzAuNzU4MTQwMyAxMS44NTY4MTMyLDMwLjYwMzQ4MTEgMTIuMDA3MjA4LDMwLjQ1NDE0NDkgQzEzLjA3NTk3MzIsMjkuODk4MDM4NyAxNC4yODM1MjQ5LDMwLjYwMzQ4MTEgMTUuNjMwODg5MiwzMi41Njk0NDU4IEMxNi4zNTc1MzAyLDMzLjY2MDQ2MiAxNy42Mjk2OTcxLDMzLjk4MTQyMDggMTkuNDQ3MzU3OSwzMy41MzMzODA0IEMxOS42NDkxNDYsMzIuNjc2OTI0NyAyMC4wOTQyNDcsMzEuODk3MDczNCAyMC43MjkwNDg4LDMxLjI4Nzc1OTIgQzE4LjI0OTM2MjIsMzAuODM4NjI4NSAxNi40MTA1MDUxLDI5LjkxOTIzNSAxNS4yMTM1Njc2LDI4LjUyOTQ4MjUgQzE0LjAxNjU5ODEsMjcuMTQwODIwMyAxMy40MTgxMjk0LDI1LjQ1MTMwNTMgMTMuNDE4MTI5NCwyMy40NjMwODYgQzEzLjQxODEyOTQsMjEuNjAzMDcwNyAxNC4wMDYwMTYsMTkuOTg5ODQzMSAxNS4xODE3NTcsMTguNjIxMjg2OSBDMTQuNzExNDYwNiwxNy4yMzE1NjY1IDE0Ljc3NTAxNzcsMTUuNzY3NzA3MSAxNS4zNzM0ODY0LDE0LjIyODYxODUgQzE1Ljk5NDI0MTgsMTQuMTg1MTY3NiAxNi42ODkwNzIyLDE0LjMwODA0ODUgMTcuNDU4MTA2LDE0LjU5NzIyODggQzE4LjIyODE2NTksMTQuODg1MzUxIDE4Ljc2NzMxMDQsMTUuMTMxMDgwNiAxOS4wNzc3MjAyLDE1LjMzNDQ0OTYgQzE5LjM4NzAwNzYsMTUuNTM3ODUwNyAxOS42NjAyODM2LDE1LjcyNDI4ODMgMTkuODk1NDMxOCwxNS44OTU4NDY5IEMyMS4xMTQ2MjM4LDE1LjU1MzcyMzkgMjIuNDg3Mzg1MywxNS4zODIxMzMyIDI0LjAxNjk4NzEsMTUuMzgyMTMzMiBDMjUuNTQ0NDA4NCwxNS4zODIxMzMyIDI2LjkyODg3NDQsMTUuNTUzNzIzOSAyOC4xNjkyMzA3LDE1Ljg5NTg0NjkgQzI4LjQ0NjczOTYsMTUuNzAzMDkyIDI4Ljc1NzExNzMsMTUuNDk5NjkwOSAyOS4wOTgyMTUzLDE1LjI4NTcwNzcgQzI5LjQ0MTM5NzYsMTUuMDcyODE0OCAyOS45NjQ2Njg5LDE0Ljg0Mjk1ODQgMzAuNjcwMTQ1NywxNC41OTcyMjg4IEMzMS4zNzU1OTAzLDE0LjM1MTQ5OTMgMzIuMDI3MDAxOSwxNC4yNDk3ODI3IDMyLjYyNjU2MDksMTQuMjkyMTc1MyBDMzMuMjAyODA3MSwxNS44MTAwNjc2IDMzLjI3ODAwNDUsMTcuMjUyNzYyOCAzMi44NTAwNjg3LDE4LjYyMTMxOSBDMzQuMDQ4MDY0NCwxOS45ODg3ODQ5IDM0LjY0NjUzMzEsMjEuNjAzMDcwNyAzNC42NDY1MzMxLDIzLjQ2MzExODEgQzM0LjY0NjUzMzEsMjUuNDUxMzM3MyAzNC4wMzY0MjQsMjcuMTQ2MTExMyAzMi44MTgyOTAyLDI4LjU0NjQ0NiBDMzEuNjAwMTI0MywyOS45NDY3NDg1IDI5Ljc2MTI2NzIsMzAuODU5ODI0OCAyNy4zMDI3NzcsMzEuMjg3NzU5MiBDMjguMjIyMjA1NiwzMi4yMDcxODQ3IDI4LjY4MTkxOTksMzMuMzE5Mzk3MiAyOC42ODE5MTk5LDM0LjYyMjI4MDEgTDI4LjY4MTkxOTksMzQuNjIyMjgwMSBMMjguNjgxOTE5OSwzOC43NTg2MDQ4IEMyOC42ODU2ODkyLDM4Ljc5MjU5NzMgMjguNjk2NTEyOSwzOC44MjU0Mjg3IDI4LjcxMzY5ODQsMzguODU0OTk4MyBDMjguNzExNzA1NCwzOC45NTEyOTE0IDI4LjcxNzAxMTcsMzkuMDQ3NTk3MSAyOC43Mjk1NzE2LDM5LjE0MzA4ODQgQzI4Ljc0MDE1MzgsMzkuMjA3NzAzNCAyOC43ODg4OTU4LDM5LjI3MjMxODUgMjguODc0NzA3NCwzOS4zMzU4NzUzIEMyOC45NTk0Mjg4LDM5LjM5OTQ2NDIgMjkuMDg3NjAxMSwzOS40MzEyMTA1IDI5LjI1OTE5MjIsMzkuNDMxMjEwNSBDMzIuNTMwMTY3MSwzOC4zMjAwNTYzIDM1LjIwNzkzMjMsMzYuMzM3MTYwMSAzNy4yOTE0OTM2LDMzLjQ4MzU0ODIgQzM5LjM3NjA4MTEsMzAuNjI4ODc4MSA0MC40MTg1MDExLDI3LjQxNzIzOCA0MC40MTg1MDExLDIzLjg0NzYwMTYgQzQwLjQyNDE1MzMsMjEuNjU1MTQwMyAzOS45ODIyNDUxLDE5LjQ4NDU4MzkgMzkuMTE5NzM2NSwxNy40Njg4OTQ1IEMzOC4yNTQzNzMxLDE1LjQzNzI1NjQgMzcuMDg5MTgyMSwxMy42ODk0NzU3IDM1LjYyNDIyNzcsMTIuMjI1NjE2MyBDMzQuMTYwMzYzNSwxMC43NjA2NjY2IDMyLjQxMjU3Nyw5LjU5NTUxMTUxIDMwLjM4MDkzMjMsOC43MzAwODY4MiBDMjguMzUwMzQ1OCw3Ljg2MzYzNTk4IDI2LjIyMzM5NzYsNy40MzEzMTc5NCAyNC4wMDAwMjM2LDcuNDMxMzE3OTQgWiIgaWQ9IuW9oueKtue7k+WQiCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
                alt=""
            /></a>
          </li>
          <li>
            <a href="" target="_blank"
              ><img
                src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjRweCIgaGVpZ2h0PSIyNXB4IiB2aWV3Qm94PSIwIDAgMjQgMjUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+ZGlzY29yZEAyeDwvdGl0bGU+CiAgICA8ZyBpZD0i5LyY5YyWMS4wLzEuMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InRyYW5zZmVyLeWFsyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc0OC4wMDAwMDAsIC02NDUuMDAwMDAwKSIgZmlsbD0iI0Q2RURGRiIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9ImRpc2NvcmQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc0OC4wMDAwMDgsIDY0NS41MDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMiwwIEMxNS4xODI1OTc5LDAgMTguMjM0ODQ0OCwxLjI2NDI4MjA4IDIwLjQ4NTI4MTQsMy41MTQ3MTg2MyBDMjIuNzM1NzE3OSw1Ljc2NTE1NTE3IDI0LDguODE3NDAyMTIgMjQsMTIgQzI0LDE4LjYyNzQxNyAxOC42Mjc0MTcsMjQgMTIsMjQgQzUuMzcyNTgzLDI0IDAsMTguNjI3NDE3IDAsMTIgQzAsNS4zNzI1ODMgNS4zNzI1ODMsMCAxMiwwIFogTTE0LjI4Nzk0MDcsNi41MDA4MjIyNSBDMTQuMjczOTY5MSw2LjQ5ODI2NTM4IDE0LjI1OTkzNyw2LjUwMTc4MDE4IDE0LjI0OTA4OTksNi41MDk4NTQ3MSBMMTQuMjM1NjEzMiw2LjUyNTE5ODc0IEMxNC4xMzYyMzYsNi43MDI3NTAxMyAxNC4wNDI5Njg1LDYuODgzNTE2NCAxMy45NTU5NjM2LDcuMDY3MTg4ODQgTDEzLjgzMDE3MjUsNy4zNDQ4Mzg1NiBDMTIuNzY5MzcyMyw3LjE4NjMyNTYyIDExLjY5MjYyMjEsNy4xNjY1MTE1IDEwLjYyNzgzMzQsNy4yODUzOTYxNiBMMTAuMTcyMzA5Myw3LjM0NDgzODg2IEMxMC4wOTEwNzA3LDcuMTU3ODYyNDQgMTAuMDAyODg1MSw2Ljk3MzkyMjk0IDkuOTA3OTM4NTUsNi43OTMzOTA1OSBMOS43NjA0NzExNSw2LjUyNTE5MzcxIEM5Ljc1MzMzNTQyLDYuNTEzMjMwNjQgOS43NDE3MjY0LDYuNTA0OTQ1NDQgOS43Mjg1OTI3LDYuNTAxNzEwODkgTDkuNzA4MTE3MTcsNi41MDA4MTg2NSBDOC43NDQwMDUyOSw2LjY2NDQ0NjkyIDcuODAxOTQwMyw2LjkzMzI5NTc3IDYuODk5MjY0NDcsNy4zMDIwNjg2NiBMNi40NTEyODkyNyw3LjQ5NDc1NzU4IEM2LjQ0MjQxMDEyLDcuNDk4NDYzIDYuNDM0OTE4MDUsNy41MDQ3ODk3MyA2LjQyOTg0NzAyLDcuNTEyODY0NzggQzQuNDMyNDA1ODEsMTAuNDQ5MTcwNiAzLjgzMTUxNzY5LDEzLjMxNTk1MzcgNC4wMzg2NTc1NCwxNi4xNDcyNzQgTDQuMDY2MTEwNzMsMTYuNDczODA5NCBMNC4wNzI3MTc5MywxNi40OTQzMDYzIEw0LjA3MjcxNzkzLDE2LjQ5NDMwNjMgTDQuMDg2OTI3NjIsMTYuNTEwNjQwMiBDNS4xNzM5Njk4NSwxNy4zMDI5MzU3IDYuMzc2OTYyNjIsMTcuOTI2NDU0MiA3LjY1Mzg2NTc3LDE4LjM2MDI5MjMgTDguMDgyMTc5OTEsMTguNDk3ODUxMSBDOC4wOTU5OTE2NiwxOC41MDE5Mjk1IDguMTEwNTQ5NjUsMTguNTAwMDc4MiA4LjEyMjU3ODcsMTguNDkzMzUzNyBMOC4xMzgzMTYxOCwxOC40Nzk3NDM4IEM4LjM2OTcwNjgsMTguMTY5ODIxNiA4LjU4MTMyNjQzLDE3Ljg0NjIwNTYgOC43NzIwMDI0MiwxNy41MTA3NzM2IEw4Ljk1NTY1Mzc4LDE3LjE3MTQ3MjMgQzguOTY4Mjk5ODUsMTcuMTQ2OTMzNiA4Ljk1ODM0MzE2LDE3LjExNjk0OTYgOC45MzM0MTQ5MiwxNy4xMDQ1MDEyIEw4LjkyNzkyNTk4LDE3LjEwMjE1MDkgQzguNjA0NjEwNTQsMTYuOTgwMzc2MyA4LjI4OTAyNTQ5LDE2LjgzOTgzNSA3Ljk4MjgyNDQ3LDE2LjY4MTMwMjIgTDcuNjc5ODEyNywxNi41MTY4MDEgQzcuNjU1MzkxNjYsMTYuNTAyNjY5MSA3LjY0NzIzMjU4LDE2LjQ3MTcyNTIgNy42NjE1ODg4MywxNi40NDc2ODU4IEw3LjY2NzQ1ODE0LDE2LjQzOTc0MjggTDcuNjY3NDU4MTQsMTYuNDM5NzQyOCBMNy42NzQ3NzkwMywxNi40MzMwNjgzIEw3Ljc5OTgzMDQ4LDE2LjMzODg4OTMgTDcuNzk5ODMwNDgsMTYuMzM4ODg5MyBMNy45MjI2NDM4NSwxNi4yNDE4OTgyIEM3LjkzNzE1NTg4LDE2LjIzMDEzMjUgNy45NTcxODY3LDE2LjIyNzQ3NTggNy45NzQzNDQ3MiwxNi4yMzUwNDEgQzEwLjQ4ODA5MDgsMTcuMzY0MzM4NCAxMy4yMDEyNTQzLDE3LjQwOTUxMDMgMTUuNzAzNTMyOCwxNi4zNzA1NTY3IEwxNi4wMTUxODk2LDE2LjIzNTA0MSBMMTYuMDQyMjg1NSwxNi4yMzA2OTI1IEwxNi4wNDIyODU1LDE2LjIzMDY5MjUgTDE2LjA2NzU0MzQsMTYuMjQxMjgxOSBMMTYuMTkwNTgzNCwxNi4zMzg2ODgxIEwxNi4xOTA1ODM0LDE2LjMzODY4ODEgTDE2LjMxNjAzNCwxNi40MzMwNjgyIEMxNi4zMzg3MDc1LDE2LjQ0OTc2MDYgMTYuMzQzMzQxMiwxNi40ODEzODU2IDE2LjMyNjM4MzgsMTYuNTAzNzA0NyBMMTYuMzE5NjU1NSwxNi41MTA5NjMyIEwxNi4zMTE2MjY1LDE2LjUxNjgwMDIgQzE2LjAxMjU0NjgsMTYuNjg4Njc0NiAxNS43MDI4MDgsMTYuODQxNjcyMiAxNS4zODQyODk3LDE2Ljk3NDkxMjMgTDE1LjA2MjkxNDUsMTcuMTAxNTM0IEMxNS4wMzY1NzkxLDE3LjExMTM5OTEgMTUuMDIzMzU0MSwxNy4xNDA0MTE5IDE1LjAzMzM3NTksMTcuMTY2MzM1OSBMMTUuMDM0NDY2NywxNy4xNjg5MzU4IEwxNS4wMzU3MDI4LDE3LjE3MTQ3MDEgQzE1LjIxNTI0MTEsMTcuNTEyNjYyNSAxNS40MTM2NzEyLDE3Ljg0Mzc4NDggMTUuNjMwMDY0MiwxOC4xNjMzNTM0IEwxNS44NTI0MTA0LDE4LjQ3OTAxNTcgQzE1Ljg2MDg1NiwxOC40OTA2NzE1IDE1Ljg3MzcxODYsMTguNDk3OTEyNiAxNS44ODc1MzY0LDE4LjQ5OTU4MjkgTDE1LjkwODU0NjksMTguNDk3NzY1NyBDMTcuMjAzNjgyMSwxOC4xMDc2NjY0IDE4LjQyOTM4ODUsMTcuNTI0MzE4NyAxOS41NDMxODU2LDE2Ljc2ODgxNjQgTDE5LjkxMDI0ODIsMTYuNTEwNjM1MiBDMTkuOTIyMTYwNSwxNi41MDIwNzcyIDE5LjkyOTc0NjYsMTYuNDg4ODc5NiAxOS45MzEwNjQ2LDE2LjQ3NDQyMDggQzIwLjI1MTQzMTUsMTMuMjE0Mjc3NCAxOS40NDE3OTk5LDEwLjM2NTI1MTEgMTcuNzc3OTE5NSw3LjgyODg5ODgxIEwxNy41NjU1MDMzLDcuNTEzNDg1NzYgTDE3LjU1NjgwNTcsNy41MDIyODc1NCBMMTcuNTU2ODA1Nyw3LjUwMjI4NzU0IEwxNy41NDQ3MTQyLDcuNDk0NzM1NzQgQzE2LjY1NTUzOSw3LjA5MzE0NzUgMTUuNzI0MjMxMiw2Ljc5MDMyMjA4IDE0Ljc2ODAzMzcsNi41OTE1MjY1IEwxNC4yODc5NDA3LDYuNTAwODIyMjUgWiBNOS4zNDY2OTg1OCwxMS41MTE2Mzk3IEMxMC4xNTM5MTIzLDExLjUxMTYzOTcgMTAuNzk3MjA3MSwxMi4yMzAwMzQ2IDEwLjc4NDYwODQsMTMuMDk4NDAzMSBDMTAuNzg0NjA4NCwxMy45NzMwNjYyIDEwLjE0NzU5OTQsMTQuNjg1MjIgOS4zNDY2OTg1OCwxNC42ODUyMiBDOC41NTgzNDIwMywxNC42ODUyMiA3LjkwODc2MTQ5LDEzLjk3MzA2NjIgNy45MDg3NjE0OSwxMy4wOTg0NTY3IEM3LjkwODc2MTQ5LDEyLjIyMzg0NzEgOC41NDU3NDMzNSwxMS41MTE2Mzk3IDkuMzQ2Njk4NTgsMTEuNTExNjM5NyBaIE0xNC42NjMxOCwxMS41MTE2Mzk3IEMxNS40NzA0NDgyLDExLjUxMTYzOTcgMTYuMTEzNzE1OCwxMi4yMzAwMzQ2IDE2LjEwMTExNzEsMTMuMDk4NDAzMSBDMTYuMTAxMTE3MSwxMy45NzMwNjYyIDE1LjQ3MDQ0ODIsMTQuNjg1MjIgMTQuNjYzMTgsMTQuNjg1MjIgQzEzLjg3NDg1MDcsMTQuNjg1MjIgMTMuMjI1MjcwMiwxMy45NzMwNjYyIDEzLjIyNTI3MDIsMTMuMDk4NDU2NyBDMTMuMjI1MjcwMiwxMi4yMjM4NDcxIDEzLjg2MjI1MiwxMS41MTE2Mzk3IDE0LjY2MzE4LDExLjUxMTYzOTcgWiIgaWQ9IuW9oueKtue7k+WQiCI+PC9wYXRoPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4="
                alt=""
            /></a>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
      :title="$t('bridge.connect_wallet')"
      :visible.sync="walletVisible"
      width="400px"
      destroy-on-close
      custom-class="dialog"
      center
      :before-close="handleWalletClose"
    >
    <div
          style="
            color: rgb(107, 125, 142);
            position: absolute;
            bottom: 20px;
            text-align: center;
            font-size: 12px;
            word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    padding:0 10px;
          "
        >
          
          {{ $t('bridge.agree') }}
          <router-link
            :to="{path:'/home'}"
          ><span style="color: rgb(178, 224, 223); cursor: pointer" 
            >{{ $t('bridge.term_of_service') }}</span
          > </router-link>
          &nbsp;{{ $t('bridge.and') }}
          <router-link
            :to="{path:'/home'}"
          > <span style="color: rgb(178, 224, 223); cursor: pointer"
            >{{ $t('bridge.private_policy') }}</span
          ></router-link>
         
        </div>
      <div v-if="walletVisible" class="collect">
        <div v-for="wallets in walletsList" :key="wallets.name">
          <div style="margin-bottom: 20px; display: flex; align-items: center">
            <svg
              :style="{
                fill:
                account
                    ? 'rgb(56, 220, 191)'
                    : '#fff',
                width: '24px',
                height: '24px',
                marginRight: '8px'
              }"
            >
              <use
                :xlink:href="
                    account
                    ? '#icon-net_open'
                    : '#icon-net_close'
                "
                rel="external nofollow"
              />
            </svg>
            <span>{{ wallets.name }}</span>
          </div>
          <div
            class="disconnect"
            style="position: absolute; right: 8px; top: 4px; font-size: 12px;cursor: pointer;"
            v-if="account"
            @click="disconnect(wallets)"
          >
          {{ $t('bridge.disconnect') }}
          </div>
          <div class="current_net" v-if="account">
            <div class="current_container">
              <span
                style="
                  position: absolute;
                  right: 20px;
                  color: rgb(56, 220, 191);
                "
                >{{ account.slice(0,5)+'...'+ account.slice(account.length-5,account.length)}}</span
              >
              <img
                style="margin-right: 10px; width: 20px; height: 20px"
                :src="currentWallet.icon"
                alt=""
              />
              <div>{{ currentWallet.name }}</div>
            </div>
          </div>
          <div class="wallet" v-else>
            <div
              v-for="wallet in wallets.value"
              class="item"
              @click="connect(wallet)"
              :key="wallet.id"
            >
              <img
                style="margin-right: 10px; width: 20px; height: 20px"
                :src="wallet.icon"
                alt=""
              />
              <div>{{ wallet.name }}</div>
            </div>
          </div>
        </div>

      </div>
    </el-dialog>
    <el-dialog
      :title="dialog.config[dialog.type].title"
      :visible.sync="dialog.visible"
      :width="dialog.config[dialog.type].width"
      destroy-on-close
      custom-class="dialog"
      center
      :before-close="handleClose"
    >

      <div>
        <CoinDialog
          v-if="dialog.visible"
          :type="dialog.type"
          :selectToken="currentNetToken[ dialog.type ]"
          :fromToken="currentNetToken['from']"
          @updateToken="updateToken"
          @close="handleClose"
        ></CoinDialog>
      </div>

    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="historyVisible"
      custom-class="history_dialog"
      destroy-on-close
      width="1100px"
    >
    <History v-if="historyVisible" :fromData="currentNetToken.from"></History>
  </el-dialog>
    
  </div>
</template>

<script>
import bridgeList from './bridge_list.js'
import walletIcon from './wallet_icon.js'
import CoinDialog from './coin_dialog.vue'
import History from './history.vue'
import { cloneDeep,debounce } from 'lodash'
import {getChainTokens,getAddress} from '@/api/bridge/bridge.js'
import connectWallet from '@/utils/connectwallet'
import axios from 'axios'
export default {
  name: 'Bridge',
  components: {
    CoinDialog,
    History
  },
  data() {
    return {
      walletVisible:false,
      addressDisabled:false,
      swapLoading:false,
      fromValue:0,
      addressVisible:false,
      addressValue:'',
      historyVisible:false,
      selectedNavIndex: 0,
      activeTabName: 'first',
      chooseType: '',
      errorType: 'no_accept_address',
      swapDisabled: true,
      switchEnter: false,
      account:'',
      onlyAddress:'',
      currentNetToken:{
        from: {
        net: {
          name:'only',
          icon:'https://app.onlyfun.city/assets/img/ofc.0480a50a.png'
        },
        token: {
          name:'ETH',
          logoURI:'https://coming-website.s3.us-east-2.amazonaws.com/icon_ETH.png',

        }
      },
      to: {
        net: {
          name:'optimism',
          icon:"https://coming-website.s3.us-east-2.amazonaws.com/icon_Optimism_network.png"
        },
        token: {
          name:'ETH',
          logoURI:'https://coming-website.s3.us-east-2.amazonaws.com/icon_ETH.png'
        }
      },
      },


      errorBlock: {
        no_accept_address: {
          title: this.$t('bridge.no_address') ,
          content:this.$t('bridge.no_address_content') 
        },
        no_amount: {
          title: this.$t('bridge.no_enough_balance') ,
          content: this.$t('bridge.no_enough_balance_content')
        },
        invalid_address: {
          title: this.$t('bridge.invalid_address') ,
          content: this.$t('bridge.invalid_address_content')
        },
        invalid_token: {
          title: this.$t('bridge.invalid_token') ,
          content: this.$t('bridge.invalid_token_content')
        }
      },
      currentWallet: {
        name: 'MetaMask',
        icon: walletIcon.MetaMask
      },

      walletsList:
      [
        {
          name: 'EVM Wallets',
          value: [
            {
              name: 'MetaMask',
              id: 1,
              icon: walletIcon.MetaMask,
              networkList:[
            {
                name:'Only Network Mainnet',
                rpc:['https://api.onlyfun.city'],
                chainId:12345,
                nativeCurrency: {
          name: 'ONLY',
          symbol: 'ONLY', // 2-6 characters long
          decimals: 18,
        },
        explorers:[{url:'https://app.onlyfun.city'}]
            }
        ],
            }
          ],

        }
      ],
      dialog: {
        visible: false,
        type: 'collect',
        config: {
          collect: {
            width: '400px',
            title: this.$t('bridge.connect_wallet')
          },
          from: {
            width: '450px',
            title: this.$t('bridge.native_chain_token')
          },
          to: {
            width: '450px',
            title: this.$t('bridge.target_chain_token')
          }
        }
      },
      navList: [
        {
          id: 0,
          name: 'swap'
        },
        // {
        //   id: 1,
        //   name: 'history'
        // }
      ]
    }
  },
  computed: {},
  async created() {
    await this.storageAccount()
    await this.getAllChainTokens()
    
    if(sessionStorage.getItem('walletAccount')){
      this.swapDisabled = false
      await this.getAddress(sessionStorage.getItem('walletAccount'))
      await this.getRealtimeTokenData()
      this.judgeOnly()
    this.interval =  setInterval(()=>{
      if(sessionStorage.getItem('walletAccount')){
        this.getRealtimeTokenData()
      }
       
    },10000)
 }
  },
  mounted() {
    this.$i18n.locale = 'en'
  },
  destroyed(){
    clearInterval(this.interval)
  },
  methods: {
    handleWalletClose(){
      this.walletVisible = false
    },
     formatNumber(num) {
    return parseFloat(num.toFixed(6)).toString().replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.$/, "");
},
judgeOnly(){
  if(this.currentNetToken.to.net.name ==='only'){
    this.addressValue = this.onlyAddress
    this.addressDisabled = true
  }else {
    this.addressValue = this.account
    this.addressDisabled = false
  }
},
    isCurrentWalletType(v){
      let flag = false
      v.forEach(element => {
        if(element.name === this.currentWallet.name){
          flag = true
        }
      });
      return flag
    },
    toHex (num) {
  return "0x" + num.toString(16);
},

inputAddressValue(v){
  if(v){
    this.swapDisabled = false
  }else {
    this.swapDisabled = true
  }

},
    async addToNetwork({ address, chain, rpc }) {
  try {
    if (window.ethereum) {
      if (!address) {
        const account =  await connectWallet();
      if(account.address){
        this.account = account.address
          sessionStorage.setItem('walletAccount',account.address)
        }
      }

      const rpcUrls = rpc ? [rpc] : chain.rpc.map((r) => r?.url ?? r)

      const params = {
        chainId: this.toHex(chain.chainId), // A 0x-prefixed hexadecimal string
        chainName: chain.name,
        nativeCurrency: {
          name: chain.nativeCurrency.name,
          symbol: chain.nativeCurrency.symbol, // 2-6 characters long
          decimals: chain.nativeCurrency.decimals,
        },
        rpcUrls,
        blockExplorerUrls: [
          chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url
            ? chain.explorers[0].url
            : chain.infoURL,
        ],
      };

      const result = await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [params, address],
      });

      return result;
    } else {
      throw new Error("No Ethereum Wallet");
    }
  } catch (error) {
    return false;
  }
},
handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts.
        console.log('Please connect to MetaMask.')
        this.account = ''
        sessionStorage.removeItem('walletAccount')
        sessionStorage.removeItem('onlyAddress')
      } else if (accounts[0] !== this.account) {
        // Reload your interface with accounts[0].
        this.account = accounts[0]
        this.judgeOnly()
        sessionStorage.setItem('walletAccount', accounts[0])
        this.getAddress(sessionStorage.getItem('walletAccount'))
      }
    },
storageAccount(){
  if (sessionStorage.getItem('walletAccount')) {
      this.account = sessionStorage.getItem('walletAccount')
    }
    window.ethereum.on('accountsChanged', this.handleAccountsChanged)
},
async getAddress(address){
  const res = await getAddress({address})
  if(res && res.success==='ok'){
    this.onlyAddress = res.data
    sessionStorage.setItem('onlyAddress',this.onlyAddress)
  }
},
async connect(wallet){

  await this.addToNetwork({address:this.account.address,chain:wallet.networkList[0]})
  await this.getAddress(sessionStorage.getItem('walletAccount'))
  this.currentWallet = wallet
  this.getRealtimeTokenData()
  this.swapDisabled =false
  this.addressVisible = true
  this.judgeOnly()
},
disconnect(wallets){
  this.account = ''
  this.errorType = 'no_accept_address'
  sessionStorage.removeItem('walletAccount')
  sessionStorage.removeItem('onlyAddress')
  this.getAllChainTokens()
},
    async getAllChainTokens(){
      const res = await getChainTokens()
      if(res && res.success ==='ok'){
        res.data.chains.forEach((element) => {
          if(element.name ==='only'){
            this.currentNetToken.from.net ={
              name:element.name,
              icon:element.logoURI
            }
            element.tokens.forEach(ele => {
            if(ele.symbol ==='USDT'){
            this.currentNetToken.from.token =ele
          }
          });
          }
          if(element.name ==='binance'){
            this.currentNetToken.to.net ={
              name:element.name,
              icon:element.logoURI
            }
            element.tokens.forEach(ele => {
            if(ele.symbol ==='USDT'){
            this.currentNetToken.to.token =ele
          }
          });
          }
          
        })

      }
    },
  //  async getChainTokens(){
  //    const res = await axios
  //       .post('https://app.onlyfun.city/chaintokens.json', {}, {
  //         headers: {
  //           'Access-Control-Allow-Origin': '*',
  //           'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
  //           'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
  //           'Content-Type': 'application/json'
  //         }
  //       }) 
  //   console.log(res)
  //   },
    getBalance(postAddress, params, cb) {
      return axios
        .post(postAddress, params, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          cb(response)
        })
    },
    getNetToken() {
      const account = sessionStorage.getItem('walletAccount')
      const str = account?
        '0x70a08231000000000000000000000000' +
        account.split('0x')[1].toLowerCase() :''
      const addressMap = {
        binance: 'https://bsc-dataseed3.ninicoin.io/',
        optimism: 'https://rpc.ankr.com/optimism',
        only: 'https://api.onlyfun.city'
      }
      const baseCur =['OPTIMISMETH','BNB','ONLY']
      const tokenList  = [this.currentNetToken.from.token,this.currentNetToken.to.token]

      tokenList.forEach((element, index) => {
        this.getBalance(
          addressMap[element.chainName],
          baseCur.includes(element.name)
            ? {
                id: 3268473356637326,
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [account, 'latest']
              }
            : {
                id: '3c38acf4',
                jsonrpc: '2.0',
                method: 'eth_call',
                params: [{ to: element.address, data: str }, 'latest']
              },
          (response) => {
            if (response.data) {
                element.balance =
                  Number((parseInt(response.data.result, 16) / Math.pow(10, element.decimals)).toFixed(6)) 
                 
              } else {
                element.balance = 0.000000
              }
            this.$forceUpdate()
          }
        )
      })


    },
    getRealtimeTokenData(){
      this.getNetToken()
    },
    inputFromValue(e){
      this.fromValue = e.target.value
      this.fromValue = this.fromValue.replace(/[^0-9.]/g, '').replace(/^(\d*\.?)|(\d*)\.?/g, "$1$2")
      this.judgeOnly()
      if(this.account || sessionStorage.getItem('walletAccount')){
        if(this.fromValue){
          if(Number(this.fromValue)<=Number(this.currentNetToken.from.token.balance) && Number(this.fromValue)>=Number(this.currentNetToken.to.token.fee)){
            if(this.addressValue){
              // if(this.currentNetToken.from.token.symbol!==this.currentNetToken.to.token.symbol){

              // }
                this.swapDisabled =false
          }else {
            if(this.currentNetToken.to.net.name !=='only'){
              this.swapDisabled = true
            this.errorType = 'no_accept_address'
            }else {
              this.swapDisabled = false
            }
          }
  }else {
    this.swapDisabled = true
    this.errorType = 'no_amount'
  }
        }else {
          this.swapDisabled = true
          this.errorType = 'no_amount'

        }
  }else {
    if(this.currentNetToken.to.net.name !=='only'){
              this.swapDisabled = true
              this.errorType = 'no_accept_address'
    }
  }
},
setMax(){
  this.fromValue = this.currentNetToken.from.token.balance
},
    switchAddress(){
      if(this.currentNetToken.to.net.name !=='only'){
        this.addressVisible = !this.addressVisible
      }
    },
    back() {
      if (this.chooseType === 'config-cross') {
        this.chooseType = 'swap-cross'
      }
      if (this.chooseType === 'config-same') {
        this.chooseType = 'swap-same'
      }
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
    updateToken(v,netList){
      this.currentNetToken[this.dialog.type] = v
      
      this.judgeOnly()
      this.getRealtimeTokenData()
      
      if(this.dialog.type === 'from'){
        this.fromValue = 0
        if(v.net.name ==='only'){
          netList.forEach(element => {
          if(element.name === 'binance'){
            this.currentNetToken.to.net = element
            element.tokens.forEach(ele => {
                if(ele.symbol === v.token.symbol){
                  this.currentNetToken.to.token = ele
            } 
              });
          }
  
       });
}else {
  netList.forEach(element => {
          if(element.name === 'only'){
            this.currentNetToken.to.net = element
            element.tokens.forEach(ele => {
                if(ele.symbol === v.token.symbol){
                  this.currentNetToken.to.token = ele
            } 
              });
          }
  
       });
}
      }
      if(this.account || sessionStorage.getItem('walletAccount')){
        if(this.currentNetToken.to.token.symbol !== this.currentNetToken.from.token.symbol){
        this.errorType = 'invalid_token'
        this.swapDisabled = true
      }else {
        if(Number(this.fromValue)<=Number(this.currentNetToken.from.token.balance) && Number(this.fromValue)>=Number(this.currentNetToken.to.token.fee)){
          if(this.addressValue){
                this.swapDisabled =false
          }else {
            if(this.currentNetToken.to.net.name !=='only'){
              this.swapDisabled = true
            this.errorType = 'no_accept_address'
            }else {
              this.swapDisabled = false
            }
          }
         
        }else {
          this.swapDisabled = true
    this.errorType = 'no_amount'
        }
        
      }
}else {
  this.swapDisabled = true
  this.errorType = 'no_accept_address'
}


      //  console.log(cloneToken)
      //  if(this.dialog.type === 'from'){
      //   this.currentNetToken.to = cloneToken
      //  }
      //  if(this.dialog.type === 'to'){
      //   this.currentNetToken.from = cloneToken
      // }
      // if(this.dialog.type === 'from'){
      //   switch (v.net.name) {
      //     case 'binance':
      //     case 'optimism':
      //     allData[0].forEach(element => {
      //       if(element.name==='only'){
      //         cloneToken.net = element
      //       }
      //     });

      //       break;
      //       case 'only':
      //       allData[0].forEach(element => {
      //       if(element.name==='bsc'){
      //         cloneToken.net = element
      //       }
      //     });
      //       break;
      //     default:
      //       break;
      //   }


      // }
      // if(this.dialog.type === 'to'){
      //   switch (v.net.name) {
      //     case 'binance':
      //     case 'optimism':
      //     allData[0].forEach(element => {
      //       if(element.name==='only'){
      //         cloneToken.net = element
      //       }
      //     });

      //       break;
      //       case 'only':
      //       allData[0].forEach(element => {
      //       if(element.name==='bsc'){
      //         cloneToken.net = element
      //       }
      //     });
      //       break;
      //     default:
      //       break;
      //   }
      //   allData[1].forEach(element => {
      //       if(element.symbol === v.token.symbol){
      //         cloneToken.token = element
      //       } 
      //     });
      // }
      console.log(v,this.dialog.type,this.currentNetToken)
    },
    stringToHex(str) {
    var hexStr = '';
    for (var i = 0; i < str.length; i++) {
        var hex = str.charCodeAt(i).toString(16);
        hexStr += hex;
    }
    return hexStr;
},
 convertToHex(num) {  
  const hex = num.toString(16);  
  return hex.padStart(64, '0');  
},
async switchToCurNet(params) {
    if (window.ethereum) {
        try {
            // BSC 主网的链 ID 是 0x38
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: params.id }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: params.id,
                            rpcUrl: params.rpcUrl
                            // 这里可以添加更多网络参数，例如 chainName, nativeCurrency, blockExplorerUrls 等
                        }],
                    });
                } catch (addError) {
                    console.error(addError);
                }
            }
            console.error(switchError);
        }
    } else {
        console.error('MetaMask is not installed!');
    }
},

    swap: debounce( async function() {
      if(this.currentNetToken.to.token.symbol !== this.currentNetToken.from.token.symbol){
        this.errorType = 'invalid_token'
        this.swapDisabled = true
        return
      }
      if (
        Number(this.fromValue) <=
        Number(this.currentNetToken.from.token.balance || 0)
      ) {
                const self = this
                self.swapLoading = true
                const fromAddress = this.account
                const web3 = new this.Web3(window.ethereum)
                const map = {
                  binance:{
                    id:'0x38',
                    rpcUrl:'https://bsc-dataseed.binance.org/'
                  },
                  optimism:{
                    id:'0xA',
                    rpcUrl:'https://mainnet.optimism.io'
                  },
                  only:{
                    id:12345,
                    rpcUrl:'https://app.onlyfun.city'
                  },
                }
                const chainMap={
                  binance:'bsc',
                  optimism:'op',
                  only:'only'
                }
                const toNetName = this.currentNetToken.to.net.name
                const fromNetName = this.currentNetToken.from.net.name
                const {chainName,symbol} =this.currentNetToken.to.token
                const fromToken = this.currentNetToken.from.token
                const chainName_from = fromToken.name
                const symbol_from = fromToken.symbol
                const revAddress = toNetName ==='only'?sessionStorage.getItem('onlyAddress') :this.addressValue
                const chain_name = toNetName ==='only'?chainMap[fromNetName]:chainMap[toNetName]
                const symbol1= toNetName ==='only'?symbol_from:symbol
                let options ={}

                const data = {chain:chain_name,op:"bridge",tick:symbol1.toLowerCase(),to:[{recv: revAddress,amt:Number(this.fromValue)}]}

                const optionData =this.stringToHex(('data:,'+JSON.stringify(data))) 
                console.log(data)
                if (!fromAddress) {
                  return
                }

                if(toNetName ==='only'){
                  switch (fromNetName) {
                    case 'optimism':
                    case 'binance':
                     await this.switchToCurNet(map[fromNetName])
                      break;
                    default:
                      break;
                  }
                // 母币转账
                if(this.currentNetToken.from.token.name ==='OPTIMISMETH' || this.currentNetToken.from.token.name ==='BNB'){
                  
                  options = {
                  from: fromAddress.toLowerCase(),
                  to: revAddress,
                  value: 0,
                  gas:100000,
                }
                let estimate = web3.eth.estimateGas(options)
                estimate+=61000
                const gasPrice = await web3.eth.getGasPrice()
                options.gasPrice = gasPrice
                }else {
                  let str1 = '0xa9059cbb000000000000000000000000'
                  let str2 = revAddress.split('0x')[1].toLowerCase()
                  let str3 =this.convertToHex(Number((this.fromValue)*Math.pow(10, fromToken.decimals)) )
                  let len = str3.length
                  let s = ''
                  for (let index = 0; index < 64 - len; index++) {
                  s += '0'
                    }
                    let hexData = str1+str2+s+str3
                    console.log(str3)
                  options = {
                  from: fromAddress.toLowerCase(),
                  to: this.currentNetToken.from.token.address,
                  value:0,
                  data: hexData,
                  gas:100000,
                }
                let estimate = web3.eth.estimateGas(options)
                estimate+=61000
                const gasPrice = await web3.eth.getGasPrice()
                options.gasPrice = gasPrice
                }
                }else {

                  await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.toHex(12345) }],
            });
                options = {
                  from: fromAddress.toLowerCase(),
                  to: fromAddress.toLowerCase(),
                  value: Number(this.fromValue),
                  data: optionData,
                  gas:100000,
                }
                let estimate = web3.eth.estimateGas(options)
                estimate+=61000
                const gasPrice = await web3.eth.getGasPrice()
                options.gasPrice = gasPrice
                }

                console.log(options)
                web3.eth
                  .sendTransaction(options)
                  .on('error', function (error) {
                    self.swapLoading = false
                    console.error('error', error)
                  })
                  .on('transactionHash', function (hash) {
                    self.swapLoading = false
                    console.log(hash)
                  })
                  .then(function () {

                  })
      } else {
        // this.$message.error(this.$t('mining.ofc_tip'))
      }
    },500),
    setSlippage() {
      this.chooseType = 'config-cross'
    },
    getWalletTypeList(v) {
      console.log(v,this.currentWallet)
      const res = []
      if (v.length > 0) {
        v.forEach((element) => {
          res.push(element.name)
        })
      }
      return res
    },
    openCollect() {
     this.walletVisible =true
    },
    openCoinDialog(type) {
      this.dialog.type = type
      this.dialog.visible = true
    },
    async handleTab(v) {
      this.selectedNavIndex = v.id
    },
    handleTradeSwitch() {},
    handleClose() {
      this.dialog.visible = false
    },
    getNetImg(v) {
      switch (v) {
        case 'ethereum':
        case 'arbitrum':
        case 'optimism':
        case 'aptos':
        case 'zksync era':
        case 'sui':
        case 'starknet':
        case 'linea':
        case 'base':
        case 'solana':
        case 'scroll':
        case 'bevm':
        case 'manta':
        case 'avalanche':
          return bridgeList[v]
        case 'binance':
        case 'opbnb':
        case 'bnb chain':
          return bridgeList['binance']
        case 'polygon':
        case 'polygon-test':
        case 'polygon zkevm test':
        case 'polygon zkevm':
          return bridgeList['polygon']

        case 'select':
        default:
          return ''
      }
    },
    switchNet(v) {
      const cloneTo = cloneDeep(this.currentNetToken.to)
      this.currentNetToken.to = this.currentNetToken.from
      this.currentNetToken.from = cloneTo
      this.judgeOnly()
    },
    inputFromSlip(e){
      console.log(e.target.value)
    },
    inputToSlip(e){
      console.log(e.target.value)
    }
  },
  watch: {
    '$i18n.locale': {
      handler(newVal, oldVal) {
        this.errorBlock= {
        no_accept_address: {
          title: this.$t('bridge.no_address') ,
          content:this.$t('bridge.no_address_content') 
        },
        no_amount: {
          title: this.$t('bridge.no_enough_balance') ,
          content: this.$t('bridge.no_enough_balance_content')
        },
        invalid_address: {
          title: this.$t('bridge.invalid_address') ,
          content: this.$t('bridge.invalid_address_content')
        },
        invalid_token: {
          title: this.$t('bridge.invalid_token') ,
          content: this.$t('bridge.invalid_token_content')
        }
      }
      },
      deep: true,
      immediate: true
    }

  }
}
</script>
<style lang="scss" scoped>
::v-deep .swap_container  .el-input__inner{
  background: rgb(21, 28, 46);
    width: 337px;
    border: none;
    height: 24px;
    color: #fff;
    padding: 0;
}
::v-deep .search  .el-input__inner{
  background: rgb(21, 28, 46);
    width: 337px;
    border: none;
    height: 24px;
    color: #fff;
    padding: 0;
}

::v-deep .el-input.is-active .el-input__inner, .el-input__inner:focus{
  border-color: none;
}
::v-deep .el-tabs--card > .el-tabs__header {
  border: none;
}
::v-deep .history_dialog .el-dialog__body{
  padding: 20px 10px;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__nav {
  border: rgb(30, 37, 49) solid 1px;
  background: rgb(14, 17, 26);
  border-radius: 12px;
  padding: 4px;
}
::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
  border: none;
  color: white;
  // width: 100px;
  height: 30px;
  line-height: 30px;
  &:hover {
    color: rgb(100, 116, 133);
  }
}

::v-deep .el-tabs--card > .el-tabs__header .el-tabs__item {
  border: none;
}
::v-deep .el-tabs__item.is-active {
  background: rgb(26, 34, 53);
  border-radius: 8px;
  outline: rgb(30, 37, 49) solid 1px;
  color: rgb(100, 116, 133);
}
::v-deep .el-dialog {
  background: rgb(20, 25, 40);
  border-radius: 16px;
  margin-top: 5vh !important;
  overflow: hidden;
  height: calc(100% - 100px);
  min-height: 600px;
}

::v-deep .history_dialog .el-dialog__header{
  padding: 20px 10px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
  color: rgb(255, 255, 255);
}
::v-deep .dialog .el-dialog__body {
  padding: 10px;
}
.collect {
  color: rgb(255, 255, 255);
  font-size: 14px;
  height: calc(95vh - 150px);
  position: relative;
}
.current_net {
  .current_container {
    display: flex;
    align-items: center;
    position: relative;
    height: 30px;
    width: 95%;
    padding: 10px 0 10px 4%;
    border: 0px solid transparent;
    border-radius: 12px;
    transition: all 0.5s ease 0s;
    background: rgb(26, 35, 52);
    cursor: pointer;
    margin-bottom: 10px;
    &::before {
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
      opacity: 0.4;
      transition: opacity 0.2s ease 0s;
      pointer-events: none;
      border-radius: 12px;
    }
  }
}
.wallet {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  .item {
    display: flex;
    align-items: center;
    width: 43%;
    min-width: 150px;
    height: 30px;
    padding: 10px 0 10px 4%;
    border: 0px solid transparent;
    border-radius: 12px;
    transition: all 0.5s ease 0s;
    background-image: linear-gradient(132deg, rgb(36, 45, 63), rgb(36, 45, 63));
    cursor: pointer;
    &:hover {
      background-image: linear-gradient(
        135deg,
        rgb(30, 204, 203, 0.4),
        rgb(80, 120, 234, 0.4)
      );
    }
  }
}
.disconnect:hover{
  color: rgb(6, 204, 199);
    text-decoration: underline;
}
.flex {
  display: flex;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  justify-content: center;
}
.swap_container {
  background-color: rgb(0,0,0,0.85) !important;
  background-image: url('../../assets/bridge/body-background.png')  !important;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment:fixed;
  background-position:center;
}
.gVzNhG {
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  animation: 1s ease 0s 1 normal none running fade;
  display: flex;
  flex-direction: column;
}
.cFNzUD {
  position: relative;
  top: 0px;
  z-index: 10;
  width: 100%;
  height: 58px;
  line-height: 58px;
  padding: 0px 21px 0px 24px;
  min-width: 1000px;
}
.cFNzUD .head-left {
  height: 58px;
  -webkit-box-align: center;
  align-items: center;
}
.cEPshw {
  display: flex;
  margin: 0;
}
.cFNzUD .head-left .logo {
  width: 146px;
  height: 38px;
}
.cEPshw li {
  margin-right: 16px;
}
.cEPshw .active {
  color: white;
  background: rgba(103, 161, 248, 0.2);

  border-radius: 12px;
  backdrop-filter: blur(11px);
  border: 1px solid transparent;
}
.cEPshw li span {
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  text-transform: capitalize;
  line-height: 22px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  border: 1px solid transparent;
  padding: 8px 16px;
  color: #94e9ed;
}
.cEPshw li span {
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  text-transform: capitalize;
  line-height: 22px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  border: 1px solid transparent;
  padding: 8px 16px;
  color: #94e9ed;
  
}
.cEPshw li span:hover {
  background: rgb(34, 107, 153);
  border-radius: 12px;
  border: 1px solid transparent;
}
.cFNzUD .connect-group {
  height: 40px;
  line-height: 40px;
  margin-right: 60px;
  margin-top: 10px;
}
.eGWLjo {
  margin-left: 8px;
}
.eGWLjo button {
  border-radius: 12px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  color: rgb(255, 255, 255);
  transition: all 0.5s ease 0s;
  font-size: 14px;
  background-image: linear-gradient(
    314deg,
    rgb(84, 112, 236) 0%,
    rgb(69, 138, 227) 31%,
    rgb(17, 225, 196) 75%,
    rgb(216, 255, 237) 100%
  );
  border: 0px solid transparent;
  padding: 8px;
}
.eGWLjo button::before {
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
.css-1930ebu {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 14px;
  color: white;
  font-weight: 400;
  line-height: 18px;
  cursor: pointer;
}
.dNCeWx {
  margin-left: 8px;
  width: 40px;
  height: 40px;
}
.dNCeWx button {
  border-radius: 12px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  color: rgb(255, 255, 255);
  transition: all 0.5s ease 0s;
  font-size: 14px;
  background-image: linear-gradient(
    135deg,
    rgb(30, 204, 203),
    rgb(80, 120, 234)
  );
  border: 0px solid transparent;
  width: 40px;
  height: 40px;
  padding: 1px;
  cursor: pointer;
}
.dNCeWx button:hover {
  opacity: 0.4;
}

.iIErwq button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
  background-image: linear-gradient(132deg, rgb(21, 28, 46), rgb(21, 28, 46));
  border: 1px solid rgb(36, 45, 63);
  color: rgb(107, 125, 142);
}
.GradientBorderButton__Wrapper-sc-3f147dcd-0 button[data-v-56a88db2]:not(.GradientBorderButton__Wrapper-sc-3f147dcd-0 button:disabled):hover {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
}
.GradientBorderButton__Wrapper-sc-3f147dcd-0 button:not(.GradientBorderButton__Wrapper-sc-3f147dcd-0 button:disabled):hover::before {
    opacity: 0.4;
}
// .dNCeWx button::before {
//   content: '';
//   position: absolute;
//   top: 0px;
//   left: 0px;
//   width: 100%;
//   height: 100%;
//   background-image: linear-gradient(
//     135deg,
//     rgb(120, 242, 232),
//     rgb(178, 216, 248)
//   );
//   opacity: 0;
//   transition: opacity 0.2s ease 0s;
//   pointer-events: none;
//   z-index: -1;
//   border-radius: 12px;
// }
.cFNzUD .connect-group .history-btn {
  width: 10px;
  height: 10px;
  border-radius: 12px;
}
.bARrkJ {
  display: flex;
  flex-direction: row;
  -webkit-box-align: flex-start;
  align-items: flex-start;
  -webkit-box-pack: center;
  justify-content: center;
  margin-top: 20px;
}
.keoxvU {
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  z-index: 3;
  width: 422px;
}
.gxJOKH {
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  // width: 100%;
  height: fit-content;
  background: rgb(10, 18, 37);
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(60px);
}
.hmheVP {
  display: flex;
  flex-direction: row;
  -webkit-box-pack: justify;
  justify-content: space-between;
  position: relative;
}
.hmheVP .manage {
  position: absolute;
  right: 0px;
  top: 10px;
  z-index: 100;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  cursor: pointer;
}
.hmheVP .manage:hover {
  opacity: 0.5;
}
.hmheVP .manage .icon {
  position: absolute;
  right: 56px;
  top: 2px;
}
.hmheVP .manage .slippage {
  display: flex;
  flex-direction: row;
  -webkit-box-pack: center;
  justify-content: center;
  width: 44px;
  height: 24px;
  padding: 4px 2px;
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDMuMTg5NjQwN3B4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCA0My4xODk2NDA3IDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPmNhc2U8L3RpdGxlPgogICAgPGcgaWQ9IumhtemdouaUueeJiCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InN3YXBf5pyq6YCJ5oupdG9rZW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC01NjguODEwMzU5LCAtMTI2LjAwMDAwMCkiIGZpbGw9IiMxNTFDMkUiIHN0cm9rZT0iIzI0MkQzRiI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjEwLjAwMDAwMCwgMTAyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzMxLjAwMDAwMCwgMjQuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTY1LDAuNSBDNjYuNTE4NzgzMSwwLjUgNjcuODkzNzgzMSwxLjExNTYwODQ3IDY4Ljg4OTA4NzMsMi4xMTA5MTI3IEM2OS44ODQzOTE1LDMuMTA2MjE2OTQgNzAuNSw0LjQ4MTIxNjk0IDcwLjUsNiBMNzAuNSwxOCBDNzAuNSwxOS41MTg3ODMxIDY5Ljg4NDM5MTUsMjAuODkzNzgzMSA2OC44ODkwODczLDIxLjg4OTA4NzMgQzY3Ljg5Mzc4MzEsMjIuODg0MzkxNSA2Ni41MTg3ODMxLDIzLjUgNjUsMjMuNSBMMzguNzkwNzM2OCwyMy41IEMzNy4xNjg3MjEyLDIzLjUgMzUuNjI5NDE0MSwyMi43ODQwMzMyIDM0LjU4NDM4NDksMjEuNTQzNTI5OCBMMjkuNjA0MDA3NywxNS42MzE1NjYxIEMyOC43NDg2NzI3LDE0LjYxNjIzOTUgMjguMzE3MDc0MywxMy4zNjc4NTk3IDI4LjMxMDQzNzEsMTIuMTE3MjI0NSBDMjguMzAzOCwxMC44NjY1ODk0IDI4LjcyMjEyNDEsOS42MTM2OTg5OCAyOS41NjY2MzQ1LDguNTg5MzUxMyBMMzQuNTg1ODM4NCwyLjUwMTMxNDk3IEMzNS42MzA2MzM5LDEuMjM0MDMxNzIgMzcuMTg3MTI0OSwwLjUgMzguODI5NTYzNSwwLjUgWiIgaWQ9ImNhc2UiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
  background-repeat: no-repeat;
}
.keoxvU {
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  z-index: 3;
  width: 422px;
}
.gxJOKH {
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  // width: 100%;
  height: fit-content;
  background: rgb(10, 18, 37);
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(60px);
}
.ejaPnJ {
  width: 382px;
  min-height: 438px;
}
.ejaPnJ .choose_back {
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
}
.ejaPnJ .choose_back:hover {
  opacity: 0.5;
}
.ejaPnJ .slippage-box .slippage-value span {
  display: flex;
  width: 25px;
  padding: 0px 8px;
  color: rgb(178, 224, 223);
}
.hSZzEk {
  height: auto;
  border: transparent;
  color: white;
  border-radius: 12px;
  cursor: pointer;
  --antd-wave-shadow-color: #38dcbf;
  background: rgb(36, 44, 62) !important;
}
.css-1jsn3rg {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 16px;
  font-weight: 500;
  line-height: 21px;
  color: #fff;
}
.ejaPnJ .slippage-box {
  margin: 24px 0px;
  gap: 12px;
}
.ejaPnJ .slippage-box .icon {
  margin-right: 8px;
}
.fWwMfG {
  background: transparent;
  width: 0px;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  font-size: 24px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  appearance: textfield;
}
.css-qolih7 {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 14px;
  color: rgb(107, 125, 142);
  line-height: 18px;
}
.ejaPnJ .slippage-box .slippage-value {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: rgb(255, 255, 255);
  line-height: 17px;
}
.dAMTVt .gradient-border {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgb(26, 34, 53);
  position: relative;
  border-radius: 8px;
  z-index: 1;
}
.dAMTVt .gradient-border > div {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  background: rgb(26, 34, 53);
  width: 100%;
  height: 100%;
}
.ejaPnJ .slippage-box .slippage-value .source-input {
  border-radius: 8px;
}
.css-ktp6ev {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 16px;
  color: white;
  line-height: 21px;
}
.ejaPnJ .gas-box {
  padding: 16px 0px;
  gap: 16px;
  -webkit-box-pack: justify;
  justify-content: space-between;
}
.dsxjan button {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  color: rgb(255, 255, 255);
  transition: all 0.5s ease 0s;
  font-size: 14px;
  background-image: linear-gradient(
    132deg,
    rgba(110, 186, 255, 0.21),
    rgba(110, 186, 255, 0.21)
  );
  border: 0px solid transparent;
  border-radius: 12px;
  padding: 1px;
}
.dsxjan button.active {
  background-image: linear-gradient(
    135deg,
    rgb(30, 204, 203),
    rgb(80, 120, 234)
  );
}
.ejaPnJ .gas-box .transaction-item {
  width: 180px;
  height: 48px;
  background: rgb(21, 28, 46);
  border-radius: 12px;
}
.css-ktp6ev {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 16px;
  color: white;
  line-height: 21px;
}
.css-ktp6ev {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 16px;
  color: white;
  line-height: 21px;
}
.ejaPnJ .setting-box {
  margin: 18px 0px;
  gap: 8px;
}
.css-qolih7 {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 14px;
  color: rgb(107, 125, 142);
  line-height: 18px;
}
.css-10b2kzp {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 12px;
  font-weight: 400;
  color: rgb(178, 224, 223);
  line-height: 16px;
}
.keoxvU {
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  z-index: 3;
  width: 422px;
}
.gxJOKH {
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  height: fit-content;
  background: rgb(10, 18, 37);
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(60px);
}
.hcqOwc {
  width: 382px;
  min-height: 438px;
}
.css-10u3r7 {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  padding: 24px 0px 32px;
  font-size: 14px;
  font-weight: 400;
  color: rgb(107, 125, 142);
  line-height: 17px;
}
.css-1xwrzfl {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 20px;
  font-weight: 500;
  color: white;
  line-height: 24px;
}
.hcqOwc .choose_back {
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
}
.hcqOwc .choose_back:hover {
  opacity: 0.5;
}
.djHyGt:hover {
  background-size: cover;
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzkwcHgiIGhlaWdodD0iOTcuMDAxNzE1M3B4IiB2aWV3Qm94PSIwIDAgMzkwIDk3LjAwMTcxNTMiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+RGVzdGluYXRpb24gY2FzZV9ob3ZlcjwvdGl0bGU+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBkPSJNNDAyLDE4MSBMNDAyLDI0NiBDNDAyLDI1Mi42Mjc0MTcgMzk2LjYyNzQxNywyNTggMzkwLDI1OCBMMzIsMjU4IEMyNS4zNzI1ODMsMjU4IDIwLDI1Mi42Mjc0MTcgMjAsMjQ2IEwyMCwxODEgQzIwLDE3NC4zNzI1ODMgMjUuMzcyNTgzLDE2OSAzMiwxNjkgQzgxLjAwMjg4OSwxNjkgMTMwLjAwNTc3OCwxNjkgMTc5LjAwODY2NywxNjkgQzE3OS4yMDI1NTUsMTY5IDE3OS40MDM4MDMsMTY5IDE3OS42MTI0MTMsMTY5IEMxODUuNTk4NTc4LDE2OC45MjE3MDIgMTkxLjMwNTgwNSwxNzEuNTI3NDIgMTk1LjE2NTEyNCwxNzYuMTA0MDk1IEMxOTUuODMxODA0LDE3Ni44OTQzMTEgMTk2LjQ3MjY4NCwxNzcuNTQwNzU4IDE5Ny4wODc3NjIsMTc4LjA0MzQzOCBDMjAwLjg3ODY1NCwxODEuMTQxNTg1IDIwNS43MjIyOTksMTgzIDIxMSwxODMgQzIxNi4zNzkyMiwxODMgMjIxLjMwNzUyNSwxODEuMDY5NDAzIDIyNS4xMjk4MjIsMTc3Ljg2MzI4NCBDMjI1LjY4NjUwOCwxNzcuMzk2MzQgMjI2LjI2NTU5NCwxNzYuODA2Njg4IDIyNi44NjcwODMsMTc2LjA5NDMyOCBDMjMwLjY5NzQ0NywxNzEuNTYwNTMzIDIzNi4zNDMyOTEsMTY4Ljk2MTQzNSAyNDIuMjc4Mzk4LDE2OSBDMjQyLjM3MzYyMywxNjkgMjQyLjQ2NzEzMywxNjkgMjQyLjU1ODkyOSwxNjkgQzI5MS43MDU5NTMsMTY5IDM0MC44NTI5NzYsMTY5IDM5MCwxNjkgQzM5Ni42Mjc0MTcsMTY5IDQwMiwxNzQuMzcyNTgzIDQwMiwxODEgWiIgaWQ9InBhdGgtMSI+PC9wYXRoPgogICAgICAgIDxmaWx0ZXIgeD0iLTEuNiUiIHk9Ii02LjclIiB3aWR0aD0iMTAzLjElIiBoZWlnaHQ9IjExMy41JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBpZD0iZmlsdGVyLTIiPgogICAgICAgICAgICA8ZmVPZmZzZXQgZHg9IjAiIGR5PSIwIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIj48L2ZlT2Zmc2V0PgogICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyIiBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVHYXVzc2lhbkJsdXI+CiAgICAgICAgICAgIDxmZUNvbXBvc2l0ZSBpbj0ic2hhZG93Qmx1ck91dGVyMSIgaW4yPSJTb3VyY2VBbHBoYSIgb3BlcmF0b3I9Im91dCIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlQ29tcG9zaXRlPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMC4wNzQ1MDk4MDM5ICAgMCAwIDAgMCAwLjg3MDU4ODIzNSAgIDAgMCAwIDAgMC43NzI1NDkwMiAgMCAwIDAgMC41IDAiIHR5cGU9Im1hdHJpeCIgaW49InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb2xvck1hdHJpeD4KICAgICAgICA8L2ZpbHRlcj4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLpobXpnaLmlLnniYgiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJzd2FwX+acqumAieaLqXRva2VuIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNjY0LjAwMDAwMCwgLTI2Ni45OTgyODUpIj4KICAgICAgICAgICAgPGcgaWQ9IkRlc3RpbmF0aW9uLWNhc2VfaG92ZXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0OC4wMDAwMDAsIDEwMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDx1c2UgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMSIgZmlsdGVyPSJ1cmwoI2ZpbHRlci0yKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICA8cGF0aCBzdHJva2U9IiMyNDJEM0YiIHN0cm9rZS13aWR0aD0iMSIgZD0iTTE3OS42MTg5NTIsMTY5LjQ5OTk1NyBDMTg1LjQ1NTQ2NCwxNjkuNDIzNjE3IDE5MS4wMjAwMzksMTcxLjk2NDE1IDE5NC43ODI5NjMsMTc2LjQyNjUxMiBDMTk1LjQ3MjE5NywxNzcuMjQzNDYxIDE5Ni4xMzU1MTcsMTc3LjkxMDk0NCAxOTYuNzcxMzU3LDE3OC40MzA1OTEgQzIwMC42NDg0NjQsMTgxLjU5OTE5OSAyMDUuNjAyMjQsMTgzLjUgMjExLDE4My41IEMyMTYuNTAxNTc0LDE4My41IDIyMS41NDE5MjcsMTgxLjUyNTM5MyAyMjUuNDUxMTQ3LDE3OC4yNDYzNjQgQzIyNi4wMjcwNjEsMTc3Ljc2MzI5MiAyMjYuNjI2ODEyLDE3Ny4xNTM5MSAyMjcuMjQ5MDIyLDE3Ni40MTcwMDggQzIzMC45ODM2NTEsMTcxLjk5NjUzIDIzNi40ODgzODIsMTY5LjQ2MjM4OCAyNDIuMjc4Mzk4LDE2OS41IEwzOTAsMTY5LjUgQzM5My4xNzU2MzcsMTY5LjUgMzk2LjA1MDYzNywxNzAuNzg3MTgxIDM5OC4xMzE3MjgsMTcyLjg2ODI3MiBDNDAwLjIxMjgxOSwxNzQuOTQ5MzYzIDQwMS41LDE3Ny44MjQzNjMgNDAxLjUsMTgxIEw0MDEuNSwyNDYgQzQwMS41LDI0OS4xNzU2MzcgNDAwLjIxMjgxOSwyNTIuMDUwNjM3IDM5OC4xMzE3MjgsMjU0LjEzMTcyOCBDMzk2LjA1MDYzNywyNTYuMjEyODE5IDM5My4xNzU2MzcsMjU3LjUgMzkwLDI1Ny41IEwzMiwyNTcuNSBDMjguODI0MzYyNywyNTcuNSAyNS45NDkzNjI3LDI1Ni4yMTI4MTkgMjMuODY4MjcyLDI1NC4xMzE3MjggQzIxLjc4NzE4MTMsMjUyLjA1MDYzNyAyMC41LDI0OS4xNzU2MzcgMjAuNSwyNDYgTDIwLjUsMTgxIEMyMC41LDE3Ny44MjQzNjMgMjEuNzg3MTgxMywxNzQuOTQ5MzYzIDIzLjg2ODI3MiwxNzIuODY4MjcyIEMyNS45NDkzNjI3LDE3MC43ODcxODEgMjguODI0MzYyNywxNjkuNSAzMiwxNjkuNSBaIiBzdHJva2UtbGluZWpvaW49InNxdWFyZSIgZmlsbD0iIzE1MUMyRSIgZmlsbC1ydWxlPSJldmVub2RkIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==') !important;
}
.hMQdau:hover {
  background-size: cover;
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzkwcHgiIGhlaWdodD0iOTcuMDA0Mzg4MXB4IiB2aWV3Qm94PSIwIDAgMzkwIDk3LjAwNDM4ODEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+c291cmNlIGNhc2VfaG92ZXI8L3RpdGxlPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggZD0iTTQwMiw3NiBMNDAyLDE0MS4wMDAxNDggQzQwMiwxNDcuNjI3NTY1IDM5Ni42Mjc0MTcsMTUzLjAwMDE0OCAzOTAsMTUzLjAwMDE0OCBDMzQwLjg4MjgxMiwxNTMuMDAwMTQ4IDI5MS43NjU2MjUsMTUzLjAwMDE0OCAyNDIuNjQ4NDM4LDE1My4wMDAxNDggQzI0Mi41MzQxMjYsMTUzLjAwMDE0OCAyNDIuNDE3MTc2LDE1My4wMDAxNDggMjQyLjI5NzU5LDE1My4wMDAxNDggQzIzNi4zNDk1MDUsMTUzLjA0ODAwMSAyMzAuNjg4NDc5LDE1MC40NDY0MDIgMjI2Ljg1MzM4OCwxNDUuODk5NTI2IEMyMjYuMjI5MjQsMTQ1LjE2MDI4IDIyNS42Mjg2NTUsMTQ0LjU1MDkxMiAyMjUuMDUxNjMyLDE0NC4wNzE0MjEgQzIyMS4yNDA0MjUsMTQwLjkwNDQxIDIxNi4zNDI2MTIsMTM5IDIxMSwxMzkgQzIwNS43MzExMTcsMTM5IDIwMC44OTQ4NDEsMTQwLjg1MjIxIDE5Ny4xMDY3NzMsMTQzLjk0MTAyOCBDMTk2LjQ4NTk3LDE0NC40NDcyMzUgMTk1LjgzOTAxOCwxNDUuMDk5MzgxIDE5NS4xNjU5MTUsMTQ1Ljg5NzQ2NiBDMTkxLjI2OTc3MSwxNTAuNTE1NDA0IDE4NS40OTQ3NTIsMTUzLjEyNDMzIDE3OS40NTQwNjYsMTUzLjAwMDE0OCBDMTc5LjMyOTk2LDE1My4wMDAxNDggMTc5LjIxNjIyMywxNTMuMDAwMTQ4IDE3OS4xMTI4NTQsMTUzLjAwMDE0OCBDMTMwLjA3NTIzNiwxNTMuMDAwMTQ4IDgxLjAzNzYxOCwxNTMuMDAwMTQ4IDMyLDE1My4wMDAxNDggQzI1LjM3MjU4MywxNTMuMDAwMTQ4IDIwLDE0Ny42Mjc1NjUgMjAsMTQxLjAwMDE0OCBMMjAsNzYgQzIwLDY5LjM3MjU4MyAyNS4zNzI1ODMsNjQgMzIsNjQgTDM5MCw2NCBDMzk2LjYyNzQxNyw2NCA0MDIsNjkuMzcyNTgzIDQwMiw3NiBaIiBpZD0icGF0aC0xIj48L3BhdGg+CiAgICAgICAgPGZpbHRlciB4PSItMS42JSIgeT0iLTYuNyUiIHdpZHRoPSIxMDMuMSUiIGhlaWdodD0iMTEzLjUlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItMiI+CiAgICAgICAgICAgIDxmZU9mZnNldCBkeD0iMCIgZHk9IjAiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjIiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUdhdXNzaWFuQmx1cj4KICAgICAgICAgICAgPGZlQ29tcG9zaXRlIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBvcGVyYXRvcj0ib3V0IiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiPjwvZmVDb21wb3NpdGU+CiAgICAgICAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwLjA3NDUwOTgwMzkgICAwIDAgMCAwIDAuODcwNTg4MjM1ICAgMCAwIDAgMCAwLjc3MjU0OTAyICAwIDAgMCAwLjUgMCIgdHlwZT0ibWF0cml4IiBpbj0ic2hhZG93Qmx1ck91dGVyMSI+PC9mZUNvbG9yTWF0cml4PgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGcgaWQ9IumhtemdouaUueeJiCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InN3YXBf5pyq6YCJ5oupdG9rZW4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02NjQuMDAwMDAwLCAtMTYyLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0ic291cmNlLWNhc2VfaG92ZXIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0OC4wMDAwMDAsIDEwMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDx1c2UgZmlsbD0iYmxhY2siIGZpbGwtb3BhY2l0eT0iMSIgZmlsdGVyPSJ1cmwoI2ZpbHRlci0yKSIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICA8cGF0aCBzdHJva2U9IiMyNDJEM0YiIHN0cm9rZS13aWR0aD0iMSIgZD0iTTM5MCw2NC41IEMzOTMuMTc1NjM3LDY0LjUgMzk2LjA1MDYzNyw2NS43ODcxODEzIDM5OC4xMzE3MjgsNjcuODY4MjcyIEM0MDAuMjEyODE5LDY5Ljk0OTM2MjcgNDAxLjUsNzIuODI0MzYyNyA0MDEuNSw3NiBMNDAxLjUsMTQxLjAwMDE0OCBDNDAxLjUsMTQ0LjE3NTc4NSA0MDAuMjEyODE5LDE0Ny4wNTA3ODUgMzk4LjEzMTcyOCwxNDkuMTMxODc2IEMzOTYuMDUwNjM3LDE1MS4yMTI5NjYgMzkzLjE3NTYzNywxNTIuNTAwMTQ4IDM5MCwxNTIuNTAwMTQ4IEwyNDIuMjkzNTY3LDE1Mi41MDAxNjQgQzIzNi40OTQyNDMsMTUyLjU0NjgyMSAyMzAuOTc0NzczLDE1MC4wMTAzMjYgMjI3LjIzNTQyOSwxNDUuNTc2OTY3IEMyMjYuNTg5ODU1LDE0NC44MTIzNDMgMjI1Ljk2Nzk4MSwxNDQuMTgyNzgzIDIyNS4zNzExODgsMTQzLjY4Njg2NCBDMjIxLjQ3MzMwOSwxNDAuNDQ3ODMgMjE2LjQ2NDEzOCwxMzguNSAyMTEsMTM4LjUgQzIwNS42MTEyNTgsMTM4LjUgMjAwLjY2NTAxOSwxNDAuMzk0NDU2IDE5Ni43OTA3OTksMTQzLjU1MzUyMyBDMTk2LjE0OTA4OSwxNDQuMDc2Nzc4IDE5NS40Nzk1MjYsMTQ0Ljc1MDA4NiAxOTQuNzgzNzU5LDE0NS41NzUwNDIgQzE5MC45ODM4MzEsMTUwLjA3ODk0IDE4NS4zNTA4NzcsMTUyLjYyMjgwMyAxNzkuNDU5MjM3LDE1Mi41MDAxNDggTDMyLDE1Mi41MDAxNDggQzI4LjgyNDM2MjcsMTUyLjUwMDE0OCAyNS45NDkzNjI3LDE1MS4yMTI5NjYgMjMuODY4MjcyLDE0OS4xMzE4NzYgQzIxLjc4NzE4MTMsMTQ3LjA1MDc4NSAyMC41LDE0NC4xNzU3ODUgMjAuNSwxNDEuMDAwMTQ4IEwyMC41LDc2IEMyMC41LDcyLjgyNDM2MjcgMjEuNzg3MTgxMyw2OS45NDkzNjI3IDIzLjg2ODI3Miw2Ny44NjgyNzIgQzI1Ljk0OTM2MjcsNjUuNzg3MTgxMyAyOC44MjQzNjI3LDY0LjUgMzIsNjQuNSBaIiBzdHJva2UtbGluZWpvaW49InNxdWFyZSIgZmlsbD0iIzE1MUMyRSIgZmlsbC1ydWxlPSJldmVub2RkIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==') !important;
}
.ckXvFL:hover {
  box-shadow: rgba(19, 222, 197, 0.5) 0px 0px 4px 0px;
}
.hSZzEk {
  height: auto;
  border: transparent;
  color: white;
  border-radius: 12px;
  cursor: pointer;
  --antd-wave-shadow-color: #38dcbf;
  background: rgb(36, 44, 62) !important;
}
.css-1edk4wa {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  padding-bottom: 24px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  line-height: 20px;
}
.hcqOwc .advanced-item {
  margin-bottom: 24px;
}
.hcqOwc .advanced-item p {
  font-size: 14px;
  font-weight: 400;
  color: rgb(178, 224, 223);
  line-height: 17px;
  margin-bottom: 0px;
}
.hcqOwc .advanced-item .slippage-value {
  font-size: 14px;
  font-weight: 400;
  color: rgb(255, 255, 255);
  line-height: 17px;
}
.hcqOwc .advanced-item .slippage-value span {
  padding: 0px 8px;
  color: rgb(178, 224, 223);
}
.dAMTVt .gradient-border {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgb(26, 34, 53);
  position: relative;
  border-radius: 8px;
  z-index: 1;
}
.hcqOwc .advanced-item .slippage-value .source-input {
  border-radius: 8px;
}
.dAMTVt .gradient-border > div {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  background: rgb(26, 34, 53);
  width: 100%;
  height: 100%;
}
.hcqOwc .advanced-item .slippage-value {
  font-size: 14px;
  font-weight: 400;
  color: rgb(255, 255, 255);
  line-height: 17px;
}
.fiUEuK {
    width: fit-content;
    background-color: rgb(34, 41, 53);
    border: 1px solid transparent;
    font-size: 12px;
    color: rgb(255, 255, 255);
    line-height: 15px;
    font-weight: 500;
    cursor: pointer;
    padding: 4px 8px;
    margin-bottom: 5px;
    border-radius: 8px !important;
}
.css-1edk4wa {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  padding-bottom: 24px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  line-height: 20px;
}
.hvxVgX {
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  margin: 0;
  width: 100%;
}
.hMQdau {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  width: 390px;
  height: 94px;
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzkwcHgiIGhlaWdodD0iOTdweCIgdmlld0JveD0iMCAwIDM5MCA5NyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDx0aXRsZT5zb3VyY2UgY2FzZTwvdGl0bGU+CiAgICA8ZyBpZD0i6aG16Z2i5pS554mIIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0ic3dhcF/mnKrpgInmi6l0b2tlbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIyNi4wMDAwMDAsIC0xNjIuMDAwMDc0KSI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjEwLjAwMDAwMCwgMTAyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9InNvdXJjZS1jYXNlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNi4wMDAwMDAsIDYwLjAwMDA3NCkiPgogICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIGZpbGw9IiNEOEQ4RDgiIG9wYWNpdHk9IjAiIHg9IjAiIHk9IjAiIHdpZHRoPSIzOTAiIGhlaWdodD0iOTciPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzc0LDQuNDk5OTI2MDkgQzM3Ny4xNzU2MzcsNC40OTk5MjYwOSAzODAuMDUwNjM3LDUuNzg3MTA3NDQgMzgyLjEzMTcyOCw3Ljg2ODE5ODExIEMzODQuMjEyODE5LDkuOTQ5Mjg4NzggMzg1LjUsMTIuODI0Mjg4OCAzODUuNSwxNS45OTk5MjYxIEwzODUuNSw4MS4wMDAwNzM5IEMzODUuNSw4NC4xNzU3MTEyIDM4NC4yMTI4MTksODcuMDUwNzExMiAzODIuMTMxNzI4LDg5LjEzMTgwMTkgQzM4MC4wNTA2MzcsOTEuMjEyODkyNiAzNzcuMTc1NjM3LDkyLjUwMDA3MzkgMzc0LDkyLjUwMDA3MzkgTDIyNi4yOTM1NjcsOTIuNTAwMDkwMSBDMjIwLjQ5NDI0Myw5Mi41NDY3NDY5IDIxNC45NzQ3NzMsOTAuMDEwMjUxOCAyMTEuMjM1NDI5LDg1LjU3Njg5MyBDMjEwLjU4OTg1NSw4NC44MTIyNjkzIDIwOS45Njc5ODEsODQuMTgyNzA5NSAyMDkuMzcxMTg4LDgzLjY4Njc5MDQgQzIwNS40NzMzMDksODAuNDQ3NzU2MiAyMDAuNDY0MTM4LDc4LjQ5OTkyNjEgMTk1LDc4LjQ5OTkyNjEgQzE4OS42MTEyNTgsNzguNDk5OTI2MSAxODQuNjY1MDE5LDgwLjM5NDM4MTggMTgwLjc5MDc5OSw4My41NTM0NDkzIEMxODAuMTQ5MDg5LDg0LjA3NjcwMzggMTc5LjQ3OTUyNiw4NC43NTAwMTE3IDE3OC43ODM3NTksODUuNTc0OTY3OSBDMTc0Ljk4MzgzMSw5MC4wNzg4NjU4IDE2OS4zNTA4NzcsOTIuNjIyNzI5MyAxNjMuNDU5MjM3LDkyLjUwMDA3MzkgTDE2LDkyLjUwMDA3MzkgQzEyLjgyNDM2MjcsOTIuNTAwMDczOSA5Ljk0OTM2MjY5LDkxLjIxMjg5MjYgNy44NjgyNzIwMiw4OS4xMzE4MDE5IEM1Ljc4NzE4MTM0LDg3LjA1MDcxMTIgNC41LDg0LjE3NTcxMTIgNC41LDgxLjAwMDA3MzkgTDQuNSwxNS45OTk5MjYxIEM0LjUsMTIuODI0Mjg4OCA1Ljc4NzE4MTM0LDkuOTQ5Mjg4NzggNy44NjgyNzIwMiw3Ljg2ODE5ODExIEM5Ljk0OTM2MjY5LDUuNzg3MTA3NDQgMTIuODI0MzYyNyw0LjQ5OTkyNjA5IDE2LDQuNDk5OTI2MDkgWiIgc3Ryb2tlPSIjMjQyRDNGIiBmaWxsPSIjMTUxQzJFIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-box-align: flex-start !important;
  align-items: flex-start !important;
  -webkit-box-pack: flex-start !important;
  justify-content: flex-start !important;
}
.eUfuKh {
  display: flex;
  flex-direction: column;
  -webkit-box-pack: justify;
  justify-content: space-between;
  width: 100%;
  padding: 16px 22px;
}
.eUfuKh .title {
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: rgb(107, 125, 142);
  margin-bottom: 10px;
}
.eUfuKh .info {
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: flex-start;
  justify-content: flex-start;
}
.jMKBlT {
  position: relative;
  min-width: 32px;
  width: 30px;
  margin-right: 20px;
}
.jMKBlT .chain-symbol {
  position: absolute;
  bottom: 0px;
  right: -4px;
  box-shadow: rgba(0, 0, 0, 0.23) 0px 2px 3px 0px;
  border-radius: 50%;
}
.eUfuKh .chain_token {
  font-size: 18px;
  font-weight: 400;
  line-height: 21px;
  color: rgb(178, 224, 223);
}
.eUfuKh .chain_token .chain {
  color: rgb(107, 125, 142);
}
.hvxVgX .switch {
  position: relative;
}
.hvxVgX .switch .switch-bg {
  width: 35px;
  height: 35px;
  position: absolute;
  border-radius: 50%;
  top: -10.5px;
  left: -0.5px;
  z-index: -1;
  box-shadow: rgba(56, 220, 191, 0.4) 0px 0px 10px 0px;
}
.itTzND::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  height: calc(100% + 2px);
  width: calc(100% + 2px);
  background-image: linear-gradient(
    60deg,
    rgb(30, 204, 203),
    rgb(80, 120, 234)
  );
  border-radius: 50%;
  box-shadow: rgba(19, 222, 197, 0.5) 0px 0px 4px 0px;
  z-index: -1;
  background-size: 300% 300%;
  cursor: pointer;
}
.hvxVgX .switch .switch-icon {
  border: 1px solid rgb(36, 45, 63);
  border-radius: 50%;
  width: fit-content;
  background: rgb(21, 28, 46);
  margin: -10px 0px -13px;
}
.hvxVgX .switch .switch-icon .icon {
  margin: 8px;
}
.djHyGt {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  width: 390px;
  height: 94px;
  background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzkwcHgiIGhlaWdodD0iOTdweCIgdmlld0JveD0iMCAwIDM5MCA5NyIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDx0aXRsZT5EZXN0aW5hdGlvbiBjYXNlPC90aXRsZT4KICAgIDxnIGlkPSLpobXpnaLmlLnniYgiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJzd2FwX+acqumAieaLqXRva2VuIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI2LjAwMDAwMCwgLTI2Ni45OTk5MjYpIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTAuMDAwMDAwLCAxMDIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iRGVzdGluYXRpb24tY2FzZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYuMDAwMDAwLCAxNjQuOTk5OTI2KSI+CiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgZmlsbD0iI0Q4RDhEOCIgb3BhY2l0eT0iMCIgeD0iMCIgeT0iMCIgd2lkdGg9IjM5MCIgaGVpZ2h0PSI5NyIgcng9IjIiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTYzLjYxODk1Miw0LjUwMDAzMTE0IEMxNjkuNDU1NDY0LDQuNDIzNjkwNTEgMTc1LjAyMDAzOSw2Ljk2NDIyNDI0IDE3OC43ODI5NjMsMTEuNDI2NTg2MiBDMTc5LjQ3MjE5NywxMi4yNDM1MzQ4IDE4MC4xMzU1MTcsMTIuOTExMDE4IDE4MC43NzEzNTcsMTMuNDMwNjY1MiBDMTg0LjY0ODQ2NCwxNi41OTkyNzMyIDE4OS42MDIyNCwxOC41MDAwNzM5IDE5NSwxOC41MDAwNzM5IEMyMDAuNTAxNTc0LDE4LjUwMDA3MzkgMjA1LjU0MTkyNywxNi41MjU0NjY2IDIwOS40NTExNDcsMTMuMjQ2NDM4IEMyMTAuMDI3MDYxLDEyLjc2MzM2NTkgMjEwLjYyNjgxMiwxMi4xNTM5ODM5IDIxMS4yNDkwMjIsMTEuNDE3MDgyIEMyMTQuOTgzNjUxLDYuOTk2NjA0MzYgMjIwLjQ4ODM4Miw0LjQ2MjQ2MjIxIDIyNi4yNzgzOTgsNC41MDAwNzM5MSBMMzc0LDQuNTAwMDczOTEgQzM3Ny4xNzU2MzcsNC41MDAwNzM5MSAzODAuMDUwNjM3LDUuNzg3MjU1MjUgMzgyLjEzMTcyOCw3Ljg2ODM0NTkyIEMzODQuMjEyODE5LDkuOTQ5NDM2NTkgMzg1LjUsMTIuODI0NDM2NiAzODUuNSwxNi4wMDAwNzM5IEwzODUuNSw4MS4wMDAwNzM5IEMzODUuNSw4NC4xNzU3MTEyIDM4NC4yMTI4MTksODcuMDUwNzExMiAzODIuMTMxNzI4LDg5LjEzMTgwMTkgQzM4MC4wNTA2MzcsOTEuMjEyODkyNiAzNzcuMTc1NjM3LDkyLjUwMDA3MzkgMzc0LDkyLjUwMDA3MzkgTDE2LDkyLjUwMDA3MzkgQzEyLjgyNDM2MjcsOTIuNTAwMDczOSA5Ljk0OTM2MjY5LDkxLjIxMjg5MjYgNy44NjgyNzIwMiw4OS4xMzE4MDE5IEM1Ljc4NzE4MTM0LDg3LjA1MDcxMTIgNC41LDg0LjE3NTcxMTIgNC41LDgxLjAwMDA3MzkgTDQuNSwxNi4wMDAwNzM5IEM0LjUsMTIuODI0NDM2NiA1Ljc4NzE4MTM0LDkuOTQ5NDM2NTkgNy44NjgyNzIwMiw3Ljg2ODM0NTkyIEM5Ljk0OTM2MjY5LDUuNzg3MjU1MjUgMTIuODI0MzYyNyw0LjUwMDA3MzkxIDE2LDQuNTAwMDczOTEgWiIgc3Ryb2tlPSIjMjQyRDNGIiBmaWxsPSIjMTUxQzJFIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-box-align: flex-start !important;
  align-items: flex-start !important;
  -webkit-box-pack: flex-start !important;
  justify-content: flex-start !important;
}
.hvxVgX .swap-value {
  margin-top: 12px;
  width: 99%;
}
.ckXvFL {
  display: flex;
  flex-direction: column;
  background: rgb(21, 29, 46);
  border: 1px solid rgb(36, 45, 63);
  border-radius: 12px;
  cursor: pointer;
  box-shadow: transparent 0px 0px 4px 0px;
  -webkit-box-align: flex-start !important;
  align-items: flex-start !important;
  -webkit-box-pack: flex-start !important;
  justify-content: flex-start !important;
}
.jFkCKs {
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
}
.jFkCKs .left {
  display: flex;
  flex-direction: row;
}
.jFkCKs .right {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-left: -10px;
}
.jFkCKs .row {
  display: flex;
  flex-direction: row;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  margin-left: 12px;
  color: rgb(107, 125, 142);
}
.css-1viy94i {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 14px;
  font-weight: 400;
  color: rgb(107, 125, 142);
  line-height: 17px;
  max-width: 150px;
  white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.kphtfG {
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 382px;
  gap: 10px;
  height: 0px;
  transition: all 0.3s ease 0s;
  overflow: hidden;
  margin-top: 0px;
  background: rgb(21, 28, 46);
  border-radius: 12px;
  border: 0px;
  box-shadow: transparent 0px 0px 4px 0px;
}
.kphtfG .input-address {
  width: 100%;
  padding: 14px 16px 0px;
}
.css-1j2nt6a {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 14px;
  font-weight: 400;
  color: rgb(107, 125, 142);
  line-height: 17px;
  padding: 0px 4px 0px 0px;
}
.kphtfG .search {
  width: 100%;
  padding: 0px 16px 14px;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
}
.kphtfG .search input {
  background: rgb(21, 28, 46);
  width: 337px;
}
.fSaIwF {
    display: flex;
    margin-left: 1px;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    width: 99%;
    gap: 10px;
    height: fit-content;
    transition: all 0.3s ease 0s;
    overflow: hidden;
    margin-top: 16px;
    background: rgb(21, 28, 46);
    border-radius: 12px;
    border: 1px solid rgb(36, 45, 63);
    box-shadow: transparent 0px 0px 4px 0px;
}
.css-1j2nt6a {
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    font-size: 14px;
    font-weight: 400;
    color: rgb(107, 125, 142);
    line-height: 17px;
    padding: 0px 4px 0px 0px;
}
.bBLEIb {
    cursor: pointer;
}
.css-1j2nt6a {
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    font-size: 14px;
    font-weight: 400;
    color: rgb(107, 125, 142);
    line-height: 17px;
    padding: 0px 4px 0px 0px;
}
.fSaIwF .search {
    width: 92%;
    padding: 0px 16px 14px;
    display: flex;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
}

.fSaIwF:hover {
    box-shadow: rgba(19, 222, 197, 0.5) 0px 0px 4px 0px;
}
.fSaIwF .search input {
    background: rgb(21, 28, 46);
    width: 337px;
    outline: none;
    color: #fff;
}
.fSaIwF .input-address {
    width: 92%;
    padding: 14px 16px 0px;
}
.dDAAhQ {
  display: flex;
  align-items: flex-start;
  border-radius: 12px;
  background: rgb(27, 23, 49);
  height: fit-content;
  padding: 16px;
  border: 1px solid rgb(69, 38, 68);
  margin-top: 16px;
  transition: all 0.3s ease 0s;
  overflow: hidden;
}
.dDAAhQ .error-icon {
  margin-right: 8px;
}
.css-1vl6u1l {
  box-sizing: border-box;
  margin: 0px 0px 8px;
  min-width: 0px;
  font-size: 16px;
  color: white;
  line-height: 20px;
}
.css-82dlr9 {
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  max-width: 298px;
  font-weight: 400;
  line-height: 17px;
}
.keoxvU .swap-bottom {
  margin-top: 24px;
  gap: 16px;
  width: 100%;
}
.iIErwq {
  width: 100%;
}
.iIErwq button {
  border-radius: 12px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  color: rgb(255, 255, 255);
  transition: all 0.5s ease 0s;
  font-size: 14px;
  background-image: linear-gradient(
    314deg,
    rgb(84, 112, 236) 0%,
    rgb(69, 138, 227) 31%,
    rgb(17, 225, 196) 75%,
    rgb(216, 255, 237) 100%
  );
  border: 0px solid transparent;
  padding: 12px;
  cursor: pointer;
}
.iIErwq button::before {
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
.hXxaqs {
  width: fit-content;
}
.hXxaqs button {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 100%;
  color: rgb(255, 255, 255);
  transition: all 0.5s ease 0s;
  font-size: 14px;
  background-image: linear-gradient(132deg, rgb(31, 39, 55), rgb(31, 39, 55));
  border: 0px solid transparent;
  border-radius: 12px;
  padding: 1px;
  font-weight: 400;
  line-height: 18px;
}
.hXxaqs button::before {
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
.jaGDCx {
  border-radius: 12px;
  padding: 7px 7px 3px;
  cursor: pointer;
}
.jaGDCx.active,
.jaGDCx:hover {
  background: rgb(21, 28, 46);
}
.GradientBorderButton__Wrapper-sc-3f147dcd-0 button:not(.GradientBorderButton__Wrapper-sc-3f147dcd-0 button:disabled):hover{
  backdrop-filter: blur(10px);
  opacity: 0.8;
}
.bARrkJ .multiRoute-close {
  transition: all 0.2s ease 0s;
  width: 0px;
  height: 0px;
  overflow: hidden;
}
.lkeFgm {
  width: 592px;
  background: rgb(10, 18, 37);
  border-radius: 16px;
  z-index: 2;
  padding-bottom: 24px;
}
.fvkKVu {
  display: flex;
  flex-direction: row;
  background: rgb(21, 28, 46);
  border-radius: 12px;
  border: 1px solid rgb(36, 45, 63);
  padding: 14px 12px;
  -webkit-box-align: center;
  align-items: center;
}
.fvkKVu > img {
  width: 12px;
  height: 12px;
  transition: all 0.2s ease 0s;
}
.fvkKVu .name {
  font-size: 14px;
  font-weight: 500;
  color: rgb(255, 255, 255);
  line-height: 17px;
  margin: 0px 8px;
  min-width: 87px;
  text-align: center;
}
.iVegGl {
  position: absolute;
  top: 0px;
  overflow: hidden;
  width: 100vw;
  height: 100%;
  background: linear-gradient(
    rgba(0, 106, 157, 0.79) 0%,
    rgba(5, 12, 36, 0) 100%
  );
  z-index: -1;
}
.kkPbjm {
  position: relative;
  width: 100%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  padding-top: 65px;
  padding-bottom: 50px;
}
.kkPbjm .copyright {
  width: 100%;
  line-height: 15px;
  margin-bottom: 15px;
  font-size: 12px;
  text-align: center;
  color: rgba(214, 237, 255, 0.4);
}
.kkPbjm .link-imgs li {
  margin-right: 24px;
}
.kkPbjm .link-imgs li img {
  width: 24px;
  height: 24px;
}
</style>
