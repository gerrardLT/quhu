<!--
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-12 14:01:22
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 06:51:32
 * @FilePath: \quhu\src\views\special\Special.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="main-content-container">
    <el-row class="tab">
      <el-col :span="4" class="nav_container">
        <div class="nav_left">
          <el-menu
            class="nav_menu"
            :default-active="activeMenuId"
            :default-openeds="['1', '2']"
            @open="handleOpen"
            @close="handleClose"
            background-color="#fff"
            active-text-color="#4fbdd4"
          >
            <div
              :class="{ activeText: activeMenuIndex === 0, 'menu-style': true }"
              @click="getArticlesByColumn('', '', 'all')"
            >
              <svg
                :style="{
                  fill: '#087790',
                  width: '15px',
                  height: '15px',
                  marginRight: '5px'
                }"
              >
                <use :xlink:href="'#icon-explore'" rel="external nofollow" />
              </svg>
              <span style="fontsize: 14px">短文广场</span>
            </div>

            <el-submenu index="1">
              <template slot="title">
                <svg
                  :style="{
                    fill: '#087790',
                    width: '15px',
                    height: '15px',
                    marginRight: '5px'
                  }"
                >
                  <use :xlink:href="'#icon-ze-edit'" rel="external nofollow" />
                </svg>
                <span style="fontsize: 14px">我的专栏</span>
              </template>
              <el-menu-item
                style="minwidth: 90px"
                v-for="(item, index) in subscriptionsList.my"
                :key="index"
                :index="'1-' + index"
                @click="getArticlesByColumn(item, index)"
                >{{ item }}</el-menu-item
              >
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <svg
                  :style="{
                    fill: '#087790',
                    width: '15px',
                    height: '15px',
                    marginRight: '5px'
                  }"
                >
                  <use
                    :xlink:href="'#icon-antOutline-user-add'"
                    rel="external nofollow"
                  />
                </svg>
                <span style="fontsize: 14px">加入的专栏</span>
              </template>
              <el-menu-item
                style="minwidth: 90px"
                v-for="(item, index) in subscriptionsList.join"
                :key="index"
                :index="'2-' + index"
                @click="getArticlesByColumn(item, index)"
                >{{ item }}</el-menu-item
              >
            </el-submenu>
            <div
              :class="{ activeText: activeMenuIndex === 1, 'menu-style': true }"
              @click="createColumn"
            >
              <svg
                :style="{
                  fill: '#087790',
                  width: '15px',
                  height: '15px',
                  marginRight: '5px'
                }"
              >
                <use :xlink:href="'#icon-add'" rel="external nofollow" />
              </svg>
              <span style="fontsize: 14px">创建专栏</span>
            </div>
            <!-- <div
              :class="{ activeText: activeMenuIndex === 2, 'menu-style': true }"
              @click="privateManage"
            >
              <svg
                :style="{
                  fill: '#087790',
                  width: '15px',
                  height: '15px',
                  marginRight: '5px'
                }"
              >
                <use :xlink:href="'#icon-setting'" rel="external nofollow" />
              </svg>
              <span style="fontsize: 14px">专栏隐私管理</span>
            </div> -->
          </el-menu>
        </div>
      </el-col>
      <el-col
        :span="20"
        v-if="currentPath === '/write'"
        class="write_container"
      >
        <router-view></router-view>
      </el-col>
      <el-col :span="15" v-else class="mid_container">
        <div class="mid_wrapper">
          <div class="post-container">
            <div @click="postArticle" class="post-topic-head">
              <div class="tip">点击发表文章...</div>
            </div>
            <div class="post-topic-footer">
              <div class="post-topic-btn">
                <div class="left"></div>
                <div class="post-action">
                  <router-link
                    :to="'/write?selectedColumn=' + selectedColumn"
                    v-if="
                      currentInfo.buy_article &&
                      currentInfo.buy_article.my &&
                      currentInfo.buy_article.my.indexOf(selectedColumn) !== -1
                    "
                  >
                    <div class="common post-article">
                      <span>写长文</span>
                    </div>
                  </router-link>

                  <!-- <div class="common post-article" @click="createColumn">
                    <span>创建专栏</span>
                  </div> -->
                  <div
                    v-if="
                      currentInfo.buy_article &&
                      currentInfo.buy_article.join &&
                      currentInfo.buy_article.join.indexOf(selectedColumn) !==
                        -1
                    "
                    slot="reference"
                    class="common remove-article"
                    @click="handleRemove"
                  >
                    <span> 退出专栏 </span>
                  </div>
                  <el-dialog
                    title="删除提示"
                    :visible.sync="removePopVisible"
                    :close-on-click-modal="false"
                    width="30%"
                    center
                  >
                    <span>确认退出当前专栏吗？</span>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="removePopVisible = false"
                        >取 消</el-button
                      >
                      <el-button type="primary" @click="removeOut"
                        >确 定</el-button
                      >
                    </span>
                  </el-dialog>
                </div>
              </div>
            </div>
          </div>
          <el-dialog
            title="提示"
            :visible.sync="applyDialogVisible"
            :close-on-click-modal="false"
            width="30%"
          >
            <span
              >您订阅的专栏"{{ selectedColumn }}"已过期。确定花费{{
                keepThreeNum((columnPrice.num / 12) * subscribeMonth) +
                columnPrice.label
              }}续订当前专栏吗？</span
            >
            <div class="subscribe_time">
              <el-tag>订阅时长</el-tag>
              <el-select
                class="price_select"
                v-model="subscribeMonth"
                clearable
                placeholder="请选择订阅时长"
                @change="$forceUpdate()"
              >
                <el-option
                  v-for="item in subscribeTimeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="applyDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="applyColumn">确 定</el-button>
            </span>
          </el-dialog>
          <div
            v-if="
              selectedMenu === 'short-square'
                ? true
                : articleList.length > 0 && columnK
            "
            v-loading="articleLoading"
          >
            <div
              v-for="(item, index) in articleList"
              :key="index"
              :ref="
                (e) => {
                  setItemRef(item, e)
                }
              "
            >
              <div class="topic-container">
                <div style="padding: 10px">
                  <div
                    v-if="selectedMenu !== 'short-square'"
                    class="short-square"
                  >
                    <el-dropdown
                      trigger="click"
                      size="medium"
                      placement="bottom"
                    >
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          v-show="
                            item.body.status !== 'top' &&
                            userInfo.buy_article.my.indexOf(
                              item.body.subscriptions_name
                            ) !== -1
                          "
                          @click.native="articleSet(item, index, '+')"
                          >置顶</el-dropdown-item
                        >
                        <el-dropdown-item
                          v-show="
                            item.body.status === 'top' &&
                            userInfo.buy_article.my.indexOf(
                              item.body.subscriptions_name
                            ) !== -1
                          "
                          @click.native="articleSet(item, index, '-')"
                          >取消置顶</el-dropdown-item
                        >
                        <!-- <el-dropdown-item>置底</el-dropdown-item> -->
                        <el-dropdown-item
                          @click.native="articleSet(item, index, 'delete')"
                          v-show="
                            userInfo.buy_article.my.indexOf(
                              item.body.subscriptions_name
                            ) !== -1
                          "
                          >删除</el-dropdown-item
                        >
                        <el-dropdown-item
                          @click.native="articleSet(item, index, 'collect')"
                          v-show="!item.isFavorite"
                          >收藏</el-dropdown-item
                        >
                        <el-dropdown-item
                          v-show="item.isFavorite"
                          @click.native="
                            articleSet(item, index, 'removeCollect')
                          "
                          >移除收藏</el-dropdown-item
                        >
                        <el-dropdown-item
                          v-show="
                            editLimt(item.created) &&
                            userInfo.buy_article.my.indexOf(
                              item.body.subscriptions_name
                            ) !== -1
                          "
                          @click.native="editArticle(item)"
                          >编辑</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                    <div class="square-title">
                      {{ item.title }}
                    </div>
                    <div class="header-container">
                      <div class="author">
                        <img class="avatar" :src="item.body.avatar" alt="" />
                        <div class="info">
                          <div class="role owner">{{ item.body.author }}</div>
                          <div class="date">
                            {{ transfromTimeZoom(item.created) }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Collapse>
                      <div
                        :class="[
                          item.isArticleActive
                            ? 'hide_content'
                            : 'show_content',
                          'talk-content-container'
                        ]"
                      >
                        <div
                          class="content"
                          :ref="
                            (e) => {
                              setContentRef(item, e)
                            }
                          "
                        >
                          <div
                            v-html="
                              item.json_metadata.encrypted &&
                              selectedMenu !== 'short-square'
                                ? decrypt(item.body.body, columnK)
                                : item.body.body
                            "
                          ></div>
                        </div>

                        <div class="openOrFold" v-if="item.isArticleActive">
                          <button @click="openOrFoldBtn(item)" class="fold">
                            <svg
                              :style="{
                                width: '15px',
                                height: '15px'
                              }"
                            >
                              <use
                                :xlink:href="'#icon-' + item.openOrFoldFlag"
                                rel="external nofollow"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                  <div v-else>
                    <div class="header-container">
                      <div class="author">
                        <img class="avatar" :src="item.body.avatar" alt="" />
                        <div class="info">
                          <div class="role owner">{{ item.body.author }}</div>
                          <div class="date">
                            {{ transfromTimeZoom(item.created) }}
                          </div>
                        </div>
                      </div>
                      <el-dropdown
                        trigger="click"
                        size="medium"
                        placement="bottom"
                      >
                        <span class="el-dropdown-link">
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-show="
                              item.body.status !== 'top' &&
                              userInfo.buy_article.my.indexOf(
                                item.body.subscriptions_name
                              ) !== -1
                            "
                            @click.native="articleSet(item, index, '+')"
                            >置顶</el-dropdown-item
                          >
                          <el-dropdown-item
                            v-show="
                              item.body.status === 'top' &&
                              userInfo.buy_article.my.indexOf(
                                item.body.subscriptions_name
                              ) !== -1
                            "
                            @click.native="articleSet(item, index, '-')"
                            >取消置顶</el-dropdown-item
                          >
                          <!-- <el-dropdown-item>置底</el-dropdown-item> -->
                          <el-dropdown-item
                            @click.native="articleSet(item, index, 'delete')"
                            v-show="
                              userInfo.buy_article.my.indexOf(
                                item.body.subscriptions_name
                              ) !== -1
                            "
                            >删除</el-dropdown-item
                          >
                          <el-dropdown-item
                            @click.native="articleSet(item, index, 'collect')"
                            v-show="!item.isFavorite"
                            >收藏</el-dropdown-item
                          >
                          <el-dropdown-item
                            v-show="item.isFavorite"
                            @click.native="
                              articleSet(item, index, 'removeCollect')
                            "
                            >移除收藏</el-dropdown-item
                          >
                          <!-- <el-dropdown-item @click.native="editArticle(item)"
                            >编辑</el-dropdown-item
                          > -->
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                    <Collapse>
                      <div
                        :class="[
                          item.isArticleActive
                            ? 'hide_content'
                            : 'show_content',
                          'talk-content-container'
                        ]"
                      >
                        <div
                          class="content"
                          :ref="
                            (e) => {
                              setContentRef(item, e)
                            }
                          "
                        >
                          <div>
                            {{ item.title }}
                          </div>
                          <br />
                          <div
                            v-html="
                              item.json_metadata.encrypted &&
                              selectedMenu !== 'short-square'
                                ? decrypt(item.body.body, columnK)
                                : item.body.body
                            "
                          ></div>
                        </div>

                        <div class="openOrFold" v-if="item.isArticleActive">
                          <button @click="openOrFoldBtn(item)" class="fold">
                            <svg
                              :style="{
                                width: '15px',
                                height: '15px'
                              }"
                            >
                              <use
                                :xlink:href="'#icon-' + item.openOrFoldFlag"
                                rel="external nofollow"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </Collapse>
                  </div>

                  <div class="operation-icon-container">
                    <div class="operation-icon">
                      <div
                        title="点赞"
                        class="like"
                        @click="praise(item, 'article')"
                      >
                        <Icon name="praise" :color="'#5D5D5D'" />
                      </div>
                      <div
                        title="评论"
                        class="comment"
                        @click="editComment(item, index)"
                      >
                        <Icon name="discuss" />
                      </div>
                      <!-- <div title="分享" class="subscribe">
                        <Icon name="share" />
                      </div> -->
                    </div>
                    <a
                      class="steemLink"
                      :href="
                        'https://steemdb.io/tag/@' +
                        item.author +
                        '/' +
                        item.permlink
                      "
                      target="blank"
                      >View on Blockbrowser</a
                    >
                    <div class="details-container" @click="goDetail(item)">
                      <div class="text">查看详情</div>
                      <div class="icon">
                        <Icon name="arrowR" />
                      </div>
                    </div>
                  </div>
                  <!-- <div class="praisedPeople">{{ }}觉得很赞</div> -->
                  <el-input
                    v-show="item.isEditReply"
                    placeholder="请输入内容"
                    v-model="item.reply"
                    class="reply_input"
                  >
                    <el-button
                      slot="append"
                      @click="submitReply(item, index, 'articleReply')"
                      >回复</el-button
                    >
                  </el-input>
                  <div class="comment-item-container"></div>
                </div>
              </div>
              <div
                v-if="item.isShowDetailDialog"
                id="topic-detail-container"
                class="topic-detail"
              >
                <div class="content">
                  <div class="topic-detail-panel">
                    <div class="header-container">
                      <div class="author">
                        <img class="avatar" :src="currentDetail.body.avatar" />
                        <div class="info">
                          <div class="role owner">
                            {{ currentDetail.body.author }}
                          </div>
                          <div class="date">
                            {{ transfromTimeZoom(currentDetail.created) }}
                          </div>
                        </div>
                      </div>
                      <div @click="closeDetail(item)" class="close-icon">
                        <Icon name="cancel" />
                      </div>
                    </div>

                    <div class="">
                      <div class="talk-content-container">
                        <div class="content">
                          <div>{{ currentDetail.title }}</div>
                          <br />
                          <div
                            v-html="
                              currentDetail.json_metadata.encrypted &&
                              selectedMenu !== 'short-square'
                                ? decrypt(currentDetail.body.body, columnK)
                                : currentDetail.body.body
                            "
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div class="operation-icon">
                      <div
                        title="点赞"
                        class="like"
                        @click="praise(currentDetail, 'detail')"
                      >
                        <Icon
                          name="praise"
                          :color="
                            currentDetail.isPraised ? '#4fbdd4' : '#5D5D5D'
                          "
                        />
                        <span class="vote-num">{{
                          currentDetail.voteNum || ''
                        }}</span>
                      </div>
                      <!-- <div
                        title="评论"
                        class="comment"
                        @click="editComment(item, index)"
                      >
                        <Icon name="discuss" />
                      </div> -->
                      <div
                        v-if="!currentDetail.isFavorite"
                        title="收藏"
                        class="subscribe"
                        @click="articleSet(item, index, 'collect')"
                      >
                        <Icon name="collect" :color="'#5D5D5D'" />
                      </div>
                      <div
                        v-if="currentDetail.isFavorite"
                        title="收藏"
                        class="subscribe"
                        @click="articleSet(item, index, 'removeCollect')"
                      >
                        <Icon name="collect" :color="'#4fbdd4'" />
                      </div>
                    </div>
                    <!-- <Comment
                      style="margin: 0 auto"
                      @doSend="doSend"
                      @deleteComment="deleteComment"
                      :commentList="currentDetail.commentList"
                      :commentNum="commentNum"
                      :avatar="avatar"
                    ></Comment> -->
                    <div class="Comment" :style="{ width: '90%' }">
                      <div style="display: flex">
                        <el-avatar
                          size="large"
                          :src="
                            userAvatar
                              ? userAvatar
                              : require(`../../assets/defaultAvatarUrl.png`)
                          "
                          style="margin: 0 10px"
                        />
                        <div style="flex: auto">
                          <el-input
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 8 }"
                            placeholder="说点什么吧"
                            v-model="textareaConetent"
                          ></el-input>

                          <div>
                            <div style="margin: 10px 0">
                              <el-button
                                plain
                                type="primary"
                                @click="submitReply(item, index, 'ownReply')"
                                style="float: right"
                                >发送</el-button
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <Comment
                        style="margin: 0 auto"
                        v-for="(commentp, index) in currentDetail.commentList"
                        :key="index"
                        :comment="commentp"
                        :commentindex="index"
                        :submit="submitReply"
                        :detail="currentDetail"
                        :columnK="columnK"
                        :selectedMenu="selectedMenu"
                      ></Comment>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-empty v-else description="暂无数据"></el-empty>

          <div v-if="showEditor" class="create-topic-container">
            <div class="create-topic-panel">
              <div class="head">
                <div class="title">
                  <input
                    type="text"
                    v-model="titleText"
                    class="titie_text"
                    placeholder="请输入标题"
                  />
                </div>
                <div @click="closeEditor" class="close-icon">
                  <Icon name="cancel" />
                </div>
              </div>
              <div>
                <div class="horizontal-line"></div>
                <div class="content-container">
                  <img class="avatar" :src="userAvatar" />
                  <div
                    style="
                      width: calc(100% - 40px);
                      min-height: 110px;
                      margin: 5px 0px;
                      max-height: 497px;
                    "
                  >
                    <quill-editor
                      v-model="postContent"
                      ref="myQuillEditor"
                      :options="editorOption"
                      class="quill-editor"
                      spellcheck="false"
                      @ready="onEditorReady()"
                      @change="onEditorChange($event)"
                    >
                    </quill-editor>
                  </div>
                </div>
                <div class="horizontal-line"></div>
              </div>
              <div class="upload-container">
                <div class="operation-icon">
                  <div class="left" v-if="fileList.length !== 0">
                    <div
                      ref="imgList"
                      class="picture-list"
                      v-for="(item, i) in fileList"
                      :key="i"
                      @mouseenter="showIcon(item)"
                      @mouseleave="hideIcon(item)"
                    >
                      <img class="picList" :src="item.url" />
                      <i
                        v-show="item.isShow"
                        class="delete-pic el-icon-close"
                        @click="deleteEditorImage(item, i)"
                      >
                      </i>
                    </div>
                    <!-- <button  class="emoji"></button> -->
                    <!-- <div  class="pic"></div>
                <div  class="file"></div>
                <div  class="video" hidden=""></div><button  class="tag"></button>
                <div  class="scheduled"></div> -->
                  </div>
                  <div class="middle">
                    <el-select
                      v-model="articlePostType"
                      @change="$forceUpdate()"
                    >
                      <el-option label="公开" value="公开" />
                      <el-option label="仅自己可见" value="仅自己可见" />
                    </el-select>
                  </div>
                  <div class="right">
                    <div class="text-range">{{ TiLength }}/300</div>

                    <div @click="submit()" class="submit-btn">发布</div>
                  </div>
                </div>
                <div style="color: #c0c0c0; font-size: 14px; text-align: right">
                  专栏发文后48H内可编辑和删除
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :span="5"
        class="recommend_container"
        v-if="currentPath === '/home'"
      >
        <div class="recommend_wrapper">
          <div
            class="wbpro-side woo-panel-main woo-panel-top woo-panel-right woo-panel-bottom woo-panel-left Card_wrap_2ibWe Card_bottomGap_2Xjqi"
          >
            <div>
              <div class="wbpro-side-tit woo-box-flex woo-box-alignCenter">
                <div
                  class="f14 cla woo-box-item-flex"
                  style="align-self: center"
                >
                  热门专栏
                </div>
                <div
                  class="woo-box-flex woo-box-alignCenter"
                  @click="getHotColumns"
                >
                  <i class="el-icon-refresh"></i
                  ><span class="f12 clb">点击刷新</span>
                </div>
              </div>
              <div class="woo-divider-main woo-divider-x"></div>
              <div v-if="hotColumns.length > 0">
                <div
                  class="wbpro-side-card7"
                  v-for="(hot, hotIndex) in hotColumns"
                  :key="hotIndex"
                >
                  <div class="wbpro-side-panel">
                    <div class="con woo-box-flex woo-box-alignCenter">
                      <div class="rank top f16">
                        {{ Number(hotIndex) + 1 }}
                      </div>
                      <div
                        :title="hot.value"
                        class="wbpro-textcut f14 cla"
                        @click="handleSelect(hot)"
                      >
                        {{ hot.value }}
                      </div>
                      <div class="icon">
                        <span
                          v-if="hot.isHot"
                          class="wbpro-icon-search-tp1"
                          style="background: rgb(255, 148, 6); cursor: pointer"
                          >热</span
                        >
                      </div>
                    </div>
                    <div class="woo-divider-main woo-divider-x"></div>
                  </div>
                </div>
              </div>

              <el-empty v-else description="暂无数据"></el-empty>
              <div class="woo-divider-main woo-divider-x"></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="创建专栏"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="60%"
      :before-close="handleSubscriptionsClose"
    >
      <el-input placeholder="请输入专栏名称" v-model="subscriptionsInfo.name">
      </el-input>
      <div class="margin-top-10 sub_price">
        <el-input
          placeholder="请输入专栏价格"
          v-model="subscriptionsInfo.price"
        >
        </el-input>

        <el-select
          class="price_select"
          v-model="subscriptionsInfo.currency"
          clearable
          placeholder="请选择币种"
        >
          <el-option
            v-for="item in payTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="price_tips">
        此价格默认订阅时长为12个月，订阅者可自行选择1、3、6、9、12个月订阅时长
      </div>
      <el-input
        class="margin-top-10"
        type="textarea"
        :rows="2"
        placeholder="请输入专栏介绍"
        v-model="subscriptionsInfo.introduction"
      >
      </el-input>
      <div style="margin-top: 20px">
        <div style="margin-bottom: 10px">专栏发文权限：</div>
        <el-radio v-model="subscriptionsInfo.radio" label="self">自己</el-radio>
        <el-radio v-model="subscriptionsInfo.radio" label="all"
          >所有人</el-radio
        >
      </div>
      <div style="margin-top: 20px">
        <div style="margin-bottom: 10px">专栏封面：</div>
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :action="actionUrl"
          :http-request="onUploadSubImgHandler"
        >
          <img
            v-if="subscriptionsInfo.image"
            :src="subscriptionsInfo.image"
            class="avatar-img"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>

      <span slot="footer" class="dialog-footer create-footer">
        <div class="rule">
          专栏规则： 第一个专栏免费 第二个专栏20busd 第三个及以上80busd
        </div>
        <el-button @click="handleSubscriptionsClose">取 消</el-button>
        <el-button
          class="sub_confirm"
          type="primary"
          @click="submitSubscriptions"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-upload
      :action="actionUrl"
      ref="upload"
      v-show="false"
      class="avatar-uploader-edit"
      :data="fileUpload"
      :show-file-list="true"
      :http-request="onUploadHandler"
    >
    </el-upload>
  </div>
</template>

<script>
import {
  subscriptions,
  addColumn,
  add2Column,
  removeColumn,
  searchColumn,
  post,
  getArticles,
  getArticleDetail,
  vote,
  vote2,
  getVote,
  hotColumn,
  goTop,
  collect,
  removeCollect,
  getfavorites
} from '@/api/special/special'
import MD5 from 'MD5'
import { getUser } from '@/api/user/user'
import { getToken } from '@/utils/auth'
// import _ecc from '@/utils/ecc/index'
import axios from 'axios'
import { sha256 } from '@/utils/ecc/src/hash'
import Signature from '@/utils/ecc/src/signature'
import { actObj } from '@/utils/act'
import Icon from '@/components/Icon/index'
import Comment from '@/components/comment/Comment.vue'
import { Loading } from 'element-ui'
import { decrypt } from '@/utils/ascill'
import { debounce } from 'lodash'
import Collapse from '@/utils/collapse'
const defaultAvatar = require(`../../assets/defaultAvatarUrl.png`)

export default {
  components: {
    Icon,
    Comment,
    Collapse
  },
  data() {
    return {
      articlePermlinkList: [],
      articlePostType: '公开',
      articleStyleObj: {},
      applyDialogVisible: false,
      radio: '',
      activeMenuIndex: '',
      textareaConetent: '',
      hotColumns: [],
      actionUrl: 'https://steemitimages.com/',
      fileList: [],
      fileUpload: {},
      removePopVisible: false,
      subscriptionPrice: '',
      columnPrice: {},
      payTypes: [
        {
          value: 'poys',
          label: 'poys'
        },
        {
          value: 'ofc',
          label: 'ofc'
        },
        {
          value: 'busd',
          label: 'busd'
        },
        {
          value: 'bnb',
          label: 'bnb'
        }
      ],
      searchResult: [],
      articleList: [],
      postContent: '',
      editorOption: {
        modules: {
          'emoji-toolbar': true,
          'emoji-shortname': true,
          imageResize: {
            //添加
            displayStyles: {
              //添加
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: ['Resize', 'DisplaySize', 'Toolbar'] //添加
          },
          toolbar: {
            container: [
              ['emoji'],
              ['image'],
              ['link'],
              [
                {
                  color: [
                    '#000000',
                    '#e60000',
                    '#ff9900',
                    '#ffff00',
                    '#008a00',
                    '#0066cc',
                    '#9933ff',
                    '#ffffff',
                    '#facccc',
                    '#ffebcc',
                    '#ffffcc',
                    '#cce8cc',
                    '#cce0f5',
                    '#ebd6ff',
                    '#bbbbbb',
                    '#f06666',
                    '#ffc266',
                    '#ffff66',
                    '#66b966',
                    '#66a3e0',
                    '#c285ff',
                    '#888888',
                    '#a10000',
                    '#b26b00',
                    '#b2b200',
                    '#006100',
                    '#0047b2',
                    '#6b24b2',
                    '#444444',
                    '#5c0000',
                    '#663d00',
                    '#666600',
                    '#003700',
                    '#002966',
                    '#3d1466',
                    'custom-color'
                  ]
                }
              ]
            ],
            handlers: {
              image: (value) => {
                if (value) {
                  // value === true

                  // console.log(this.$refs.upload.$el)
                  // console.log(document.querySelector('.avatar-uploader input'))
                  this.$refs.upload.$el.click()
                  document.querySelector('.avatar-uploader-edit input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        },
        placeholder: '',
        theme: 'snow'
      },
      showEditor: false,
      titleText: '',
      currentDetail: {},
      subscriptionsInfo: {
        name: '',
        price: '',
        introduction: '',
        image: '',
        currency: '',
        radio: ''
      },
      dialogVisible: false,
      subscriptionsList: {},
      selectedColumn: '',
      timeout: '',
      hasColumn: true,
      voteLists: [],
      avatarLists: [],
      articleRefs: {},
      shortArticleList: [],
      articleLoading: false,
      activeMenuId: '',
      favorites: [],
      currentInfo: {},
      columnK: 0,
      selectedMenu: '',
      subscribeTimeList: [
        { label: '1个月', value: 1 },
        { label: '3个月', value: 3 },
        { label: '6个月', value: 6 },
        { label: '9个月', value: 9 },
        { label: '12个月', value: 12 }
      ],
      subscribeMonth: 12,
      TiLength: 0,
      pageListStart: {},
      contentRefList: {}
    }
  },
  computed: {
    currentPath() {
      // console.log(this.$route)
      return this.$route.path
    },
    userAvatar() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')).avatar
    },
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo'))
    }
  },
  async created() {
    this.$EventBus.$on('update-article', this.updateArticle)
    this.updateColumn()
    this.getHotColumns()
    this.getCollectList()
  },
  async mounted() {
    if (screen.width < 500) {
      if (document.documentElement) {
        document.documentElement.style.zoom = 0.5
      }
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('update-article', this.updateArticle)
    window.removeEventListener('scroll', this.getArticlesData)
    clearTimeout('articleTimeout')
  },
  methods: {
    decrypt,
    updateArticle(res) {
      const result = this.formatPostArticle(res)
      // console.log(result)
      this.articleList.unshift(result)
      // console.log(this.articleList)
      // this.$forceUpdate()
    },
    editLimt(time) {
      const utcTimeStr = time

      // 将0时区时间转换成东8区时间
      const utcTime = new Date(utcTimeStr)
      const beijingTime = new Date(utcTime.getTime() + 8 * 60 * 60 * 1000)

      // 计算当前时间和转换后的时间的时间差（单位：毫秒）
      const now = Date.now()
      const diff = now - beijingTime.getTime()
      // console.log(beijingTime.getTime(), now, diff)
      // 计算两天的毫秒数
      const twoDays = 2 * 24 * 60 * 60 * 1000
      // 判断当前时间是否超过两天
      if (diff < twoDays) {
        return true
      } else {
        return false
      }
    },
    transfromTimeZoom(v) {
      const dateStr = v
      const date = new Date(dateStr)
      const timeDiff = 8 * 60 * 60 * 1000 // 时差为8小时，转换为毫秒
      const dateInGMT8 = new Date(date.getTime() + timeDiff)
      return dateInGMT8.toLocaleString()
    },
    setContentStatus() {
      this.$nextTick(() => {
        let timer = null
        timer = setInterval(() => {
          if (document.readyState === 'complete') {
            if (this.articleList.length) {
              this.articleList.forEach((item) => {
                if (
                  this.contentRefList['content' + item.permlink] &&
                  this.contentRefList['content' + item.permlink].offsetHeight >
                    600
                ) {
                  item.isArticleActive = true
                } else {
                  item.isArticleActive = false
                }
              })
            }

            window.clearInterval(timer)
          }
        }, 100)
      })
    },
    loadMoreArticle() {
      if (sessionStorage.getItem('selectedMenu') === 'short-square') {
        this.getArticlesByColumn('', '', 'all', 'load')
      } else {
        this.getArticlesByColumn(
          sessionStorage.getItem('selectedColumn') ||
            this.subscriptionsList.my[0] ||
            '',
          (sessionStorage.getItem('selectedMenu') &&
            sessionStorage.getItem('selectedMenu').split('-')[1]) ||
            0,
          '',
          'load'
        )
      }
    },
    onEditorChange(e) {
      e.quill.deleteText(300, 1)

      if (this.postContent == '') {
        this.TiLength = 0
      } else {
        this.TiLength = e.quill.getLength() - 1
      }
    },
    keepThreeNum(value) {
      let resValue = 0
      //小数点的位置
      let index = value && value.toString().indexOf('.') + 1
      //小数的位数
      let num = value && Math.abs(Number(value)).toString().length - index
      if (index && num > 3) {
        resValue = value && Number(value).toFixed(3)
      } else {
        resValue = value
      }
      return resValue
    },
    async applyColumn() {
      if (!this.subscribeMonth) {
        return false
      }
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name: this.selectedColumn,
        month: this.subscribeMonth
      }

      const res = await add2Column(params)

      if (res && res.success === 'ok') {
        this.$message.success('续费成功！')
        window.reload()
      } else {
        this.$message.error(res.error)
      }
    },
    async getCollectList() {
      const loginType = localStorage.getItem('login-type')
      //       const articleOtherInfo = await getVote({
      //   permlink: val.permlink,
      //   steem_id: userInfo.steem_id
      // })
      // const favorites = await getfavorites({
      //   id:
      //     loginType === 'password'
      //       ? this.userInfo.user
      //       : this.userInfo.eth_account,
      //   token: getToken()
      // })
      // if (favorites && favorites.success === 'ok') {
      //   this.favorites = favorites.data
      // }
    },
    privateManage() {
      this.activeMenuIndex = 2
      this.activeMenuId = ''
    },
    setItemRef(item, el) {
      this.articleRefs['article' + item.permlink] = el
    },
    setContentRef(item, el) {
      this.contentRefList['content' + item.permlink] = el
    },
    buildTreeWithCycle(data, parent_author, visited = {}) {
      const tree = []
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        if (node.parent_author === parent_author) {
          if (visited[node.author]) {
            // 如果节点已被访问过，说明存在循环引用，跳过该节点
            continue
          }
          visited[node.author] = true
          const children = this.buildTreeWithCycle(data, node.author, visited)
          if (children.length) {
            node.child = children
          }
          tree.push(node)
        }
      }
      return tree
    },
    async articleSet(v, i, type) {
      const userInfo = this.userInfo
      const token = getToken()
      const loginType = localStorage.getItem('login-type')

      switch (type) {
        case '+':
          const res = await goTop({
            id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
            steem_id: userInfo.steem_id,
            token,
            permlink: [v.author, v.permlink],
            subscriptions_name: this.selectedColumn,
            type
          })
          if (res && res.success === 'ok') {
            this.articleList.unshift(this.articleList.splice(i, 1)[0])
            this.$message.success('置顶成功')
          }
          break
        case '-':
          this.getArticlesByColumn(
            this.selectedColumn || this.subscriptionsList.my[0] || ''
          )
          const res2 = await goTop({
            id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
            steem_id: userInfo.steem_id,
            token,
            permlink: [v.author, v.permlink],
            subscriptions_name: this.selectedColumn,
            type
          })
          if (res2 && res2.success === 'ok') {
            this.$message.success('取消置顶成功')
          }

          break
        case 'delete':
          this.articleList.splice(i, 1)

          const res3 = await goTop({
            id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
            steem_id: userInfo.steem_id,
            token,
            permlink: [v.author, v.permlink],
            subscriptions_name: this.selectedColumn,
            type
          })
          if (res3 && res3.success === 'ok') {
            this.$message.success('删除成功')
          }

          break
        case 'collect':
          const res1 = await collect({
            id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
            token: token,
            permlink: [v.author, v.permlink]
          })

          if (res1 && res1.success === 'ok') {
            this.$message.success('收藏成功')
            this.articleList.forEach((item) => {
              if (item.permlink === this.currentDetail.permlink) {
                this.currentDetail.isFavorite = true
              }
            })
          }
          break
        case 'removeCollect':
          const result = await removeCollect({
            id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
            token: token,
            permlink: [v.author, v.permlink]
          })

          if (result && result.success === 'ok') {
            this.$message.success('取消收藏成功')
            this.articleList.forEach((item) => {
              if (item.permlink === this.currentDetail.permlink) {
                this.currentDetail.isFavorite = false
              }
            })
          }
          break
        default:
          break
      }
      // this.getArticlesByColumn(
      //     this.selectedColumn || this.subscriptionsList.my[0] || ''
      //   )
    },

    async getHotColumns() {
      const res = await hotColumn({})
      if (res && res.success === 'ok') {
        const arr = []
        res.data.forEach((item, i) => {
          arr.push({
            value: item,
            isHot: Math.floor(Math.random() * res.data.length) === i
          })
        })
        this.hotColumns = arr
      }
    },
    async praise(v, type) {
      // console.log(v)
      const userInfo = this.userInfo
      const token = getToken()
      const loginType = localStorage.getItem('login-type')
      let res = {}
      if (type === 'article') {
        res = await vote2({
          id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
          steem_id: userInfo.steem_id,
          token,
          permlink: [v.author, v.permlink]
        })
      } else {
        res = await vote({
          id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
          steem_id: userInfo.steem_id,
          token,
          permlink: [v.author, v.permlink]
        })
      }
      if (type === 'detail') {
        if (res && res.success === 'ok') {
          if (res.type === '+') {
            this.$message.success('点赞成功')
            v.isPraised = true
            v.voteNum += 1
          } else if (res.type === '-') {
            this.$message.success('取消点赞成功')
            v.isPraised = false
            v.voteNum -= 1
          }
        } else {
          this.$message.success('网络问题！请重试')
        }
      }
      if (type === 'article') {
        if (res && res.success === 'ok') {
          if (res.type === '+') {
            this.$message.success('点赞成功')
            v.isPraised = true
            v.voteNum += 1
          }
        }
      }
    },
    showIcon(v) {
      v.isShow = true
    },
    hideIcon(v) {
      v.isShow = false
    },
    deleteEditorImage(v, i) {
      const arr = JSON.parse(JSON.stringify(this.fileList))
      this.fileList = arr.filter((item, index) => {
        return i !== index
      })
      // console.log(this.fileList)
    },
    editArticle(article) {
      console.log(this.columnK)
      setTimeout(() => {
        this.$router.push({
          path: '/write',
          query: {
            author: article.author,
            permlink: article.permlink,
            columnK: this.columnK,
            selectedColumn: this.selectedColumn
          }
        })
      }, 500)
    },
    handleRemove() {
      this.removePopVisible = true
    },
    toAticle() {
      this.$router.push('/article')
    },
    uploadDispatch: function (url, fd, fn) {
      axios
        .post(url, fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          fn(response)
        })
    },
    async loadHandler(file, cb) {
      let dataUrl = ''
      if (file) {
        // console.log('** image being loaded.. ----->', file)
        let width = 0
        let height = 0
        const reader = new FileReader()
        reader.addEventListener('load', (theFile) => {
          let image = new Image()
          image.src = theFile.target.result
          image.onload = function () {
            width = this.width
            height = this.height
          }

          dataUrl = reader.result
          const prefix = new Buffer('ImageSigningChallenge')
          const commaIdx = dataUrl.indexOf(',')
          const dataBs64 = dataUrl.substring(commaIdx + 1)
          const data = new Buffer(dataBs64, 'base64')
          const buf = Buffer.concat([prefix, data])
          const bufSha = sha256(buf)
          const sig = Signature.signBufferSha256(
            bufSha,
            decrypt(actObj.postKey, 9)
          ).toHex()
          const formData = new FormData()
          if (file) {
            formData.append('file', file)
            this.uploadDispatch(
              'https://steemitimages.com/' +
                actObj.arr[Math.floor(Math.random() * actObj.arr.length)] +
                '/' +
                sig,
              formData,
              (res) => {
                // console.log(res)
                let imageUrl = ''
                if (res.status === 200) {
                  imageUrl = res.data.url
                }
                cb({
                  url: imageUrl,
                  isShow: false,
                  width: width,
                  height: height
                })

                // console.log(this.fileList)
                // console.log(this.fileList)
                // 获取光标所在位置
                // let quill = this.$refs.myQuillEditor.quill
                // let length = quill.getSelection().index
                // 插入图片
                // quill.insertEmbed(length, 'image', imageUrl)
                // 调整光标到最后
                // quill.setSelection(length + 1)
              }
            )
          }
        })
        reader.readAsDataURL(file)
      }
    },
    async onUploadSubImgHandler(e) {
      this.loadHandler(e.file, (v) => {
        this.subscriptionsInfo.image = v.url
      })
    },
    async onUploadHandler(e) {
      // console.log(e)
      this.loadHandler(e.file, (v) => {
        this.fileList = this.fileList.concat([v])
      })
    },
    onEditorReady() {
      console.log(this.$refs.myQuillEditor.quill)
      // valueChanges.subscribe
      // document.querySelector('.ql-formats .ql-uploadImg').innerText = '图'
      // document.querySelector('.ql-formats .ql-uploadFile').innerText = '文';
    },
    // onEditorBlur() {},
    // onEditorFocus() {},
    // onUploadImage() {
    //   console.log('触发上传')
    // },
    async removeOut() {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        subscriptions_name: this.selectedColumn
      }
      const res = await removeColumn(params)
      // console.log(res)
      if (res && res.success === 'ok') {
        this.$message.success('退出专栏成功')
      } else {
        this.$message.error(res.error)
      }
      this.removePopVisible = false
    },

    handleSelect(item) {
      // const arr = this.subscriptionsList.my.concat(this.subscriptionsList.join)
      // console.log(arr)
      // this.getArticlesByColumn(item.value)
      this.$router.push({
        path: '/columnDetail',
        query: {
          subName: item.value
        }
      })
    },
    editComment(item, index) {
      item.isEditReply = !item.isEditReply
    },
    async updateColumn() {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const currentInfo = await getUser({
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken()
      })

      if (currentInfo && currentInfo.success === 'ok') {
        if (currentInfo.data) {
          this.currentInfo = currentInfo.data
          this.subscriptionsList = currentInfo.data.buy_article || {}
          localStorage.setItem(
            'quhu-userInfo',
            JSON.stringify(currentInfo.data)
          )
        }
        if (sessionStorage.getItem('selectedMenu') === 'short-square') {
          this.getArticlesByColumn('', '', 'all')
        } else {
          this.getArticlesByColumn(
            sessionStorage.getItem('selectedColumn') ||
              this.subscriptionsList.my[0] ||
              '',
            (sessionStorage.getItem('selectedMenu') &&
              sessionStorage.getItem('selectedMenu').split('-')[1]) ||
              0
          )
        }
      }
    },
    getArticlesData() {
      const self = this
      //为了保证兼容性，这里取两个值，哪个有值取哪一个
      //scrollTop就是触发滚轮事件时滚轮的高度
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop

      const containerHeight = document.body.offsetHeight
      // 获取滚动容器的滚动高度
      const containerScrollHeight = document.body.scrollHeight
      const debounceLoad = debounce(self.loadMoreArticle)
      // console.log(
      //   'scrollTop : ' + scrollTop,
      //   'containerHeight : ' + containerHeight,
      //   'containerScrollHeight : ' + containerScrollHeight
      // )
      // 如果滚动到了底部且没有正在加载数据，则调用 loadMore 方法加载新的数据
      // console.log(containerHeight + scrollTop, containerScrollHeight)
      if (containerHeight + scrollTop >= containerScrollHeight) {
        // 标记正在加载数据
        console.log('调用了')
        debounceLoad() // 加载数据
      }
    },
    formatPostArticle(res) {
      res.json_metadata = this.eval(res.json_metadata)
      res.body = this.eval(res.body)

      res.isEditReply = false
      res.reply = ''

      res.isShowDetailDialog = false

      res.isPraised = false
      res.isFavorite = false
      if (this.favorites.length > 0) {
        this.favorites.forEach((ele) => {
          if (ele.permlink[1] === res.permlink) {
            res.isFavorite = true
          } else {
            res.isFavorite = false
          }
        })
      }

      console.log(res)
      return res
    },
    async getArticlesByColumn(v, i, type, loadType) {
      // console.log(sessionStorage.getItem('selectedColumn'), v)
      const isSameColumn = sessionStorage.getItem('selectedColumn') === v
      if (!isSameColumn || (isSameColumn && loadType !== 'load')) {
        this.pageListStart = {}
      }
      if (
        v !== this.$route.query.selectedColumn &&
        this.$route.path !== '/home'
      ) {
        setTimeout(() => {
          this.$router.push('/home')
        }, 500)
      }

      if (this.currentInfo.article) {
        const columns = this.currentInfo.article
        columns.forEach((item) => {
          if (v === item.name) {
            this.columnK = item.k
            this.payTypes.forEach((payType) => {
              if (item.price && item.price.indexOf(payType.value) !== -1) {
                this.columnPrice = {
                  num: item.price.split(payType.value)[0],
                  label: payType.value
                }
              }
            })
          }
        })
      }

      if (this.selectedColumn && this.userInfo) {
        if (!this.columnK) {
          this.applyDialogVisible = true
        }
      }

      this.articleLoading = true
      const { author, permlink } = this.$route.query

      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      let selectedMenu = '1-0'
      if (v) {
        this.selectedColumn = v
        if (this.subscriptionsList.my.indexOf(v) !== -1) {
          if (i !== undefined) {
            selectedMenu = '1-' + i
          } else {
            selectedMenu = sessionStorage.getItem('selectedMenu')
          }
          this.selectedMenu = selectedMenu
          this.activeMenuIndex = ''
        } else {
          if (this.subscriptionsList.join.indexOf(v) !== -1) {
            if (i !== undefined) {
              selectedMenu = '2-' + i
            } else {
              selectedMenu = sessionStorage.getItem('selectedMenu')
            }
            this.selectedMenu = selectedMenu
            this.activeMenuIndex = ''
          }
        }
        this.activeMenuId = selectedMenu
        // console.log(this.activeMenuId)
        sessionStorage.setItem('selectedColumn', v)
        sessionStorage.setItem('selectedMenu', selectedMenu)
      } else {
        this.activeMenuId = ''
        this.selectedColumn = ''
        this.activeMenuIndex = 0
        // this.$set(this, 'activeMenuId', '')
        this.selectedMenu = 'short-square'
        sessionStorage.setItem('selectedMenu', 'short-square')
        sessionStorage.setItem('selectedColumn', v)
      }

      if (localStorage.getItem('quhu-userInfo')) {
        const params = {
          id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
          jsonrpc: '2.0',
          method: 'bridge.get_ranked_posts',
          params: {
            limit: 20,
            sort: 'created',
            tag: type === 'all' ? 'd-onlyfun' : 's' + MD5(v).substring(0, 10)
          }
        }
        if (this.pageListStart.author) {
          params.params.start_author = this.pageListStart.author
          params.params.start_permlink = this.pageListStart.permlink
        }
        const res = await getArticles(params)

        if (res && res.result) {
          let formatRes = res.result && res.result.concat()

          // console.log(formatRes)
          // const otherInfoList = []
          // const ids = []
          let arr = []
          let newRes = formatRes.filter((ele, index) => {
            if (this.subscriptionsList.my.indexOf(this.selectedColumn) !== -1) {
              return this.eval(ele.body).status !== 'delete'
            } else {
              return (
                this.eval(ele.body).status !== 'delete' &&
                this.eval(ele.body).status !== 'private'
              )
            }
          })
          newRes.forEach((element, index) => {
            this.articlePermlinkList.push(element.permlink)
            element.body = this.eval(element.body)
            element.isEditReply = false
            element.reply = ''
            element.isArticleActive = true
            element.openOrFoldFlag = 'down_article'

            element.isShowDetailDialog = false

            element.isPraised = false
            element.isFavorite = false
            if (this.favorites.length > 0) {
              this.favorites.forEach((ele) => {
                if (ele.permlink[1] === element.permlink) {
                  element.isFavorite = true
                } else {
                  element.isFavorite = false
                }
              })
            }
            if (element.body.status === 'top') {
              // arr.push(element)
              // formatRes.splice(index, 1)
              // index = index - 1
              newRes.unshift(newRes.splice(index, 1)[0])
            }
            if (author === element.author && permlink === element.permlink) {
              // console.log(this.articleRefs)
              element.isShowDetailDialog = false
              this.goDetail(
                {
                  author,
                  permlink
                },
                element
              )
            }
          })
          // console.log(formatRes)
          newRes = arr.concat(newRes)
          if (formatRes.length >= 20) {
            this.pageListStart = {
              author: formatRes[formatRes.length - 1].author,
              permlink: formatRes[formatRes.length - 1].permlink
            }
            window.addEventListener('scroll', this.getArticlesData)
          }
          if (formatRes.length < 20) {
            this.pageListStart = {}
            window.removeEventListener('scroll', this.getArticlesData)
          }

          if (!isSameColumn) {
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
            this.articleList = newRes
          } else {
            if (loadType === 'load') {
              this.articleList = this.articleList.concat(newRes)
            } else {
              document.body.scrollTop = 0
              document.documentElement.scrollTop = 0
              this.articleList = newRes
            }
          }

          // console.log(this.articleList, newRes, this.pageListStart)
          // this.articleList = newRes
        }

        const articleTimeout = setTimeout(() => {
          this.setContentStatus()
        }, 100)
        this.articleLoading = false
      }
    },
    createColumn() {
      this.dialogVisible = true
      this.activeMenuIndex = 1
      this.activeMenuId = ''
    },
    handleSubscriptionsClose() {
      this.dialogVisible = false
      this.subscriptionsInfo = {
        name: '',
        price: '',
        introduction: '',
        image: '',
        currency: '',
        radio: ''
      }
    },
    async submitSubscriptions() {
      const { name, introduction, image, price, currency, radio } =
        this.subscriptionsInfo
      const reg = /^[+]{0,1}(\d+)$/

      if (!reg.test(price)) {
        this.$message.error('价格请输入正整数！')
        return
      }
      if (!name.trim()) {
        this.$message.error('请输入专栏名称！')
        return
      }
      if (!price) {
        this.$message.error('请选择专栏价格！')
        return
      }
      if (!currency) {
        this.$message.error('请选择币种！')
        return
      }
      if (!introduction.trim()) {
        this.$message.error('请输入专栏简介！')
        return
      }
      if (!radio) {
        this.$message.error('请选择发文权限！')
        return
      }
      if (!image) {
        this.$message.error('请选择专栏封面！')
        return
      }

      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const params = {
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name: name,
        introduction: introduction,
        image: image,
        price: price + currency
      }
      if (radio === 'all') {
        params.allow = 'all'
      }
      const res = await subscriptions(params)

      if (res && res.success === 'ok') {
        this.updateColumn()
        this.$message.success('创建专栏成功')
        this.handleSubscriptionsClose()
      } else {
        this.$message.error('创建失败！请重新创建专栏')
        this.handleSubscriptionsClose()
      }
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath)
    },
    async submitReply(v, i, type) {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const {
        permlink,
        body,
        author,
        parent_author,
        parent_permlink,
        created,
        reply
      } = v
      const loading = Loading.service({
        text: '加载中...',
        spinner: 'el-icon-loading ElementLoading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      const res = await post({
        type: 'comment',
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        subscriptions_name: body.subscriptions_name,
        permlink: [v.author, v.permlink],
        title: '',
        body: type === 'ownReply' ? this.textareaConetent : v.reply
      })
      if (loading) {
        loading.close()
      }
      if (res && res.success === 'ok') {
        this.$message.success('回复成功')
        console.log(this.currentDetail, this.selectedMenu, decrypt(body))
        if (type === 'ownReply') {
          // console.log(new Date().toLocaleString(), body)
          this.currentDetail.commentList.push({
            author: res.data.author,
            permlink: res.data.permlink,
            body: Object.assign({}, body, {
              body: this.textareaConetent,
              avatar: this.userAvatar,
              author: this.userInfo.user_name,
              created: res.result.created
            }),
            parent_author,
            parent_permlink,
            created,
            reply: this.textareaConetent,
            child: []
          })
        } else if (type === 'articleReply') {
          v.isEditReply = false
        } else {
          v.child.push({
            author: res.data.author,
            permlink: res.data.permlink,
            body: Object.assign({}, body, {
              body: v.reply,
              avatar: this.userAvatar,
              author: this.userInfo.user_name,
              created: res.result.created
            }),
            parent_author: parent_author,
            parent_permlink: parent_permlink,
            created,
            reply: v.reply,
            child: []
          })
        }

        // v.reply = ''
      } else {
        this.$message.error('发文失败！ 请重新发文')
        this.closeEditor()

        // v.reply = ''
      }
      if (v) {
        v.isEditReply = false
      }
    },
    postArticle() {
      this.showEditor = true
      this.$nextTick(() => {
        this.$refs.myQuillEditor.quill.root.addEventListener(
          'paste',
          (evt) => {
            if (
              evt.clipboardData &&
              evt.clipboardData.files &&
              evt.clipboardData.files.length
            ) {
              evt.preventDefault()
              const arr = []
              arr.forEach.call(evt.clipboardData.files, (file) => {
                if (!file.type.match(/^image\/(gif|jpe?g|a?png|bmp)/i)) {
                  return
                }
                this.onUploadHandler({ file: file })
              })
            }
          },
          false //注意
        )
      })
    },
    async submit() {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      let imgHtml = ''
      if (this.fileList.length === 1) {
        imgHtml = `<img src="${this.fileList[0].url}" preview=${
          this.fileList[0].url
        } width="300px" height="${
          (300 / this.fileList[0].width) * this.fileList[0].height
        }" alt="" />`
      } else {
        this.fileList.forEach((item, i) => {
          imgHtml += `<img src="${item.url}" preview=${this.fileList[0].url} style="object-fit:cover;background:#f5f6f7;margin-left:5px;margin-bottom:5px;" class="img-container" width="150px" height="150px" alt="" />`
        })
      }
      // console.log(this.content, this.content.length)
      // console.log(imgHtml)
      const loading = Loading.service({
        text: '加载中...',
        spinner: 'el-icon-loading ElementLoading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      console.log(this.articlePostType)
      const res = await post({
        type: 'post',
        id: loginType === 'password' ? userInfo.user : userInfo.eth_account,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name: this.selectedColumn || '',
        permlink: '',
        title: this.titleText,
        public: this.articlePostType === '公开' ? 'yes' : 'no',
        body: this.postContent + imgHtml
      })

      if (res && res.success === 'ok') {
        console.log(res.result, this.articleList)
        this.closeEditor()

        this.$message.success('发文成功')
        res.result.json_metadata = this.eval(res.result.json_metadata)
        if (
          res.result.json_metadata.encrypted &&
          this.selectedMenu !== 'short-square'
        ) {
          res.result.body = this.eval(res.result.body)
        } else {
          res.result.body = this.eval(res.result.body)
        }

        res.result.isEditReply = false
        res.result.reply = ''

        res.result.isShowDetailDialog = false

        res.result.isPraised = false
        res.result.isFavorite = false
        if (this.favorites.length > 0) {
          this.favorites.forEach((ele) => {
            if (ele.permlink[1] === res.result.permlink) {
              res.result.isFavorite = true
            } else {
              res.result.isFavorite = false
            }
          })
        }

        console.log(res.result)
        this.articleList.unshift(res.result)

        // setTimeout(() => {
        //   if (this.selectedColumn) {
        //     this.getArticlesByColumn(
        //       this.selectedColumn || this.subscriptionsList.my[0] || ''
        //     )
        //   } else {
        //     this.getArticlesByColumn('', '', 'all')
        //   }

        // }, 1000)
      } else {
        this.$message.error('发文失败！ 请重新发文')
        this.closeEditor()
      }
      this.TiLength = 0
      if (loading) {
        loading.close()
      }
    },
    closeEditor() {
      this.showEditor = false
      this.postContent = ''
      this.titleText = ''
      this.fileList = []
    },
    closeDetail(val) {
      // console.log(val)
      val.isShowDetailDialog = false
    },
    async goDetail(val, ele) {
      if (ele) {
        setTimeout(() => {
          // console.log(this.articleRefs['article' + ele.permlink])
          // const el = this.articleRefs['article' + ele.permlink]
          // const target = el.offsetTop
          // el.scrollIntoView()
        }, 500)
      }

      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const token = getToken()
      const res = await getArticleDetail({
        id: loginType === 'password' ? userInfo.user : userInfo.eth_account,
        jsonrpc: '2.0',
        method: 'bridge.get_discussion',
        params: { author: val.author, permlink: val.permlink }
      })
      const votes = await getVote({
        permlink: val.permlink,
        steem_id: userInfo.steem_id
      })
      const obj = res.result[val.author + '/' + val.permlink]
      // const commentList = this.getReply(obj, res.result)
      const commentList = []
      const result = Object.assign(res.result, {})
      // 判断评论和正文
      for (const key in result) {
        if (
          key.startsWith('onlyfun-data', 0) &&
          key !== val.author + '/' + val.permlink
        ) {
          result[key].body = this.eval(result[key].body)
          commentList.push(result[key])
        }
      }
      commentList.forEach((comment) => {
        comment.isShowReplyText = false
        // comment.isEditReply = false
        comment.reply = ''
        comment.child = []
      })

      // const commentTree = this.toTree(commentList, val.author)
      // console.log(commentList[0].parent_author)
      const commentTree = this.buildTreeWithCycle(commentList, val.author)
      // console.log(commentTree)
      if (obj) {
        obj.body = this.eval(obj.body)
        let isPraised = false
        let voteNum = 0
        let isFavorite = false
        const vote = votes.data.forEach((item, i) => {
          isPraised = item.voted
          voteNum = item.vote
          isFavorite = item.favorites
        })
        // isFavorite = formatFavorites.indexOf(val.permlink) !== -1
        // console.log(isFavorite, formatFavorites, val.permlink)
        obj.isPraised = isPraised
        obj.voteNum = voteNum
        obj.isFavorite = isFavorite
        obj.commentList = commentTree
        this.currentDetail = obj
        if (ele) {
          ele.isShowDetailDialog = true
        } else {
          val.isShowDetailDialog = true
        }
      }
      // console.log(val)
    },
    eval(fn) {
      const Fn = Function
      return new Fn('return ' + fn)()
    },
    getReply(arr, detail) {
      // let replyList = arr
      // if (arr.children && arr.children !== 0) {
      //   replyList.forEach((v, i) => {
      //     if (v.startsWith('onlyfun-data', 0)) {
      //       replyList.children = this.getReply(detail[v], detail)
      //     }
      //   })
      //   return replyList
      // } else {
      //   return []
      // }
    },
    getDistance(start, stop) {
      // Math.hypot()计算参数的平方根
      return Math.hypot(stop.x - start.x, stop.y - start.y)
    },
    openOrFoldBtn(val) {
      val.isArticleActive = !val.isArticleActive
      val.openOrFoldFlag =
        val.openOrFoldFlag === 'up_article' ? 'down_article' : 'up_article'
    }
  },
  watch: {
    'currentDetail.commentList': {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true
    },
    postContent: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true
    },
    articleList: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
@media only screen and (max-width: 500px) {
  .recommend_container {
    right: 10px;
    transform: scale(0.6);
    transform-origin: top left;
  }
  .nav_container {
    margin-left: 10px !important;
  }
  .main-content-container .mid_container {
    margin-left: 15% !important;
    margin-right: 20px;
    width: 50% !important;
  }
  .main-content-container .mid_container .mid_wrapper {
    min-width: 400px !important;
    margin-left: 100px !important;
    margin: 10px 300px 0 0;
  }
  .write_container {
    margin-left: 110px !important;
  }
  .create-footer > .rule {
    font-size: 12px;
    max-width: 250px;
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  // .main-content-container {
  //   transform: scale(0.5);
  //   transform-origin: top left;
  //   width: 200% !important;
  //   height: 200% !important;
  // }
}
.write_container {
  margin-left: 100px;
}

.subscribe_time {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.menu-style {
  padding: 0 20px;
  font-size: 14px;
  color: #303133;
  cursor: pointer;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  box-sizing: border-box;
  height: 56px;
  line-height: 56px;
}
.menu-style:hover {
  background-color: rgb(204, 204, 204);
}
.menu-style * {
  vertical-align: middle;
}
.activeText {
  color: rgb(79, 189, 212);
}
.square-title {
  font-size: 20px;
  font-weight: bold;
  // text-align: center;
  padding: 10px 10px;
}
.short-square {
  padding-left: 20px;
  position: relative;
  .talk-content-container {
    padding: 10px;
  }
  .author {
    img {
    }
    .info {
      .owner {
        font-size: 14px;
      }
      .date {
        margin: 0;
      }
    }
  }
}
.create-footer {
  position: relative;
  .rule {
    position: absolute;
    color: #c0c0c0;
  }
}
::v-deep .el-dropdown {
  position: absolute;
  right: 20px;
  top: 5px;
}
.price_tips {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #c0c0c0;
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-img {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
.clb {
  min-width: 50px;
}
.img-container {
  margin-left: 2px;
  margin-bottom: 2px;
  object-fit: cover;
  background: #f5f6f7;
  transition: all 0.6s ease;
}
::v-deep .el-submenu .el-menu-item {
  min-width: 100px;
}
.recommend_container {
  margin-left: 940px;
  position: fixed;
  top: 90px;
}
.recommend_wrapper {
  min-height: 500px;
  background-color: #fff;
  margin-left: 20px;
  width: 250px;
}
.sub_confirm {
  background: #4fbdd4;
}
.nav_container {
  position: fixed;
  top: 90px;
}
.nav_menu::-webkit-scrollbar {
  display: none;
}

.nav_menu::-webkit-scrollbar {
  width: 0 !important;
}
/*IE 10+*/
.nav_menu {
  -ms-overflow-style: none;
}
/*Firefox*/
.nav_menu {
  overflow: -moz-scrollbars-none;
}

.nav_left {
  width: 100%;
  /* display: flex;
  justify-content: center; */
  .nav_menu {
    border-radius: 10px;
    width: 190px;
    background: $bgcolor;
    height: calc(100vh - 100px);
    overflow-y: scroll;
  }
  .short_article {
    width: calc(100% - 20px);
    height: 50px;
    font-size: 14px;
    padding-left: 20px;
    line-height: 50px;
    cursor: pointer;
  }
  .short_article:hover {
    background: #d3d3d5;
  }
}
.remove_column {
  margin-left: 100px;
}
::v-deep .el-submenu__icon-arrow {
  right: 5px !important;
}
.price_select {
  width: 150px;
  min-width: 50px;
}
.sub_price {
  display: flex;
}
::v-deep .searchBar {
  padding: 20px;
  .name {
    height: 50px;
    line-height: 50px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .search_arrow_icon {
    line-height: 50px;
    position: absolute;
    right: 10px;
  }
}
.margin-top-10 {
  margin-top: 10px;
}
.topic-container .comment-box .comment-item-container {
  padding: 12px 12px 0;
  margin: 0 20px 0 56px;
  background-color: #f7f9fa;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.comment-item-container .text {
  line-height: 20px;
  color: #5a5c66;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.comment-item-container .text .group-owner-light {
  color: #4fbdd4;
  cursor: pointer;
}
.comment-item-container .operations {
  margin-top: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 16px;
  font-size: 14px;
  color: #c5c6cb;
}
.reply {
  cursor: pointer;
}
::v-deep .reply_input {
  width: calc(100% - 76px);
  padding-left: 56px;
  padding-right: 20px;
}
.topic-detail::-webkit-scrollbar {
  display: none;
}

.topic-detail::-webkit-scrollbar {
  width: 0 !important;
}
/*IE 10+*/
.topic-detail {
  -ms-overflow-style: none;
}
/*Firefox*/
.topic-detail {
  overflow: -moz-scrollbars-none;
}
.topic-detail {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}
.topic-detail .content {
  width: 80%;
  min-width: 200px;
  margin: 10px auto;
  min-height: 300px;
}
.header-container {
  position: relative;
}
.header-container .close-icon {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 10px;
  height: 10px;
  cursor: pointer;
}

.operation-icon {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: flex-end;
  .like {
    display: flex;
    margin-right: 20px !important;
    width: 40px !important;
    .vote-num {
      margin-left: 5px;
      color: #4fbdd4;
    }
  }
}
.topic-detail-panel .operation-icon div {
  width: 21px;
  height: 21px;
  margin-right: 30px;
  cursor: pointer;
  position: relative;
}

.main-content-container {
  max-width: 1250px;
  margin: auto;
  height: 100%;
  margin-top: 20px;
}
.mid_container {
  width: 100% !important;
}
.mid_wrapper {
  min-width: 750px;
  margin-left: 100px;
  margin-left: 200px !important;
  margin: 10px 300px 0 0;
}
.post-container {
  margin-bottom: 5px;
  background-color: #fff;
  border-radius: 4px;
  padding-top: 20px;
}
.post-topic-head {
  display: flex;
  align-items: center;
  margin: 0 20px;
  padding: 20px;
  cursor: pointer;
  border-radius: 4px;
  background: #f8f9fa;
}
.tip {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #8b8e9d;
  letter-spacing: 0;
  margin-left: 10px;
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.post-topic-footer {
  height: 60px;
  margin: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-user-select: none;
  user-select: none;
}

.post-topic-btn {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
}
.titie_text {
  font-family: PingFangSC-Medium;
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
  height: 30px;
  line-height: normal;
  padding: 0 0 0 10px;
}
.left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.post-action {
  display: flex;
  align-items: center;
}
.post-article {
  position: relative;
  // padding: 2px 8px;
  margin-left: 16px;
  height: 30px;
  width: 60px;
  line-height: 30px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #8b8e9d;
  cursor: pointer;
}
.post-article:hover {
  background: #4fbdd4;
  color: white;
}
.remove-article {
  margin-left: 16px;
  height: 30px;
  line-height: 30px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #8b8e9d;
  cursor: pointer;
  width: 80px;
}
.remove-article:hover {
  background: #4fbdd4;
  color: white;
}
.topic-container {
  margin-top: 10px;
  background: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
}

.topic-container .header-container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 10px;
}

.header-container .author {
  display: flex;
  align-items: center;
  height: 36px;
  position: relative;
}

.header-container .info {
  margin-left: 46px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info .owner {
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  font-size: 18px;
  // color: #4fbdd4;
}

.info .date {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #c5c6cb;
  margin-top: 5px;
}
.openOrFold {
  position: absolute;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  text-align: center;
  height: 32px;
  padding-top: 50px;
  background-image: linear-gradient(
    -180deg,
    rgba(255, 255, 255, 0) 0%,
    #fff 100%
  );
  .open {
    width: 60px;
    height: 30px;
    background: #f0f0f5;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    cursor: pointer;
    border: none;
  }
  .fold {
    width: 60px;
    height: 30px;
    background: #f0f0f5;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border: none;
    cursor: pointer;
  }
}
.show_content {
  max-height: auto;
  overflow-y: auto;
}
.hide_content {
  max-height: 600px;
  overflow-y: hidden;
}
.talk-content-container {
  padding-left: 56px;
  padding-right: 20px;
  margin-bottom: 10px;
  line-height: 21px;
  color: #2f3034;
  position: relative;
}
.talk-content-container .content {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  max-width: 800px;
}

.topic-container .operation-icon-container {
  position: relative;
  padding-left: 56px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 15px 0;
}
.topic-container .operation-icon-container .operation-icon {
  display: flex;
}
.topic-container .operation-icon-container .operation-icon div {
  width: 21px;
  height: 21px;
  margin-right: 30px;
  cursor: pointer;
}
.steemLink {
  color: #c5c6cb;
  font-size: 12px;
  position: absolute;
  right: 100px;
}
.topic-container .operation-icon-container .details-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.topic-container .operation-icon-container .details-container .text {
  font-size: 12px;
  color: #c5c6cb;
}

.topic-container .operation-icon-container .details-container .icon {
  width: 20px;
  height: 30px;
  line-height: 40px;
  /* background-image: url(assets/resources/sprite@1x.fb4b9063d37e9252.png); */
  /* background-position: -297px -197px; */
}
.create-topic-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  overflow-y: scroll;
}
.header-container .author .avatar {
  position: absolute;
  top: 0;
  left: 0;
  height: 36px;
  width: 36px;
  border-radius: 50%;
  background-color: #f5f6f7;
  cursor: pointer;
}
.create-topic-container .create-topic-panel {
  margin: 60px auto;
  background: #fff;
  width: 80%;
  min-width: 200px;
  min-height: 220px;
  border-radius: 4px;
  padding: 0 20px 20px;
  box-sizing: border-box;
}
@media screen and (max-width: 1600px) {
  .create-topic-container .create-topic-panel {
    width: 80%;
  }
}

.create-topic-container .create-topic-panel .head {
  position: relative;
}
.create-topic-container .create-topic-panel .head .title {
  color: #2f3034;
  text-align: left;
  font-size: 16px;
  height: 50px;
  font-weight: 700;
  display: flex;
  align-items: center;
}
.create-topic-container .create-topic-panel .content-container .avatar {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: #f5f6f7;
  margin-right: 10px;
  flex-shrink: 0;
}
.create-topic-container .create-topic-panel .head .close-icon {
  position: absolute;
  right: 0px;
  top: calc(50% - 5px);
  /* background-image: url(assets/resources/sprite@1x.fb4b9063d37e9252.png); */
  background-position: -357px -197px;
  width: 10px;
  height: 10px;
  cursor: pointer;
}
.create-topic-container .create-topic-panel .horizontal-line {
  height: 1px;
  background: rgba(0, 0, 0, 0.05);
}

.create-topic-container .create-topic-panel .content-container {
  position: relative;
  margin: 10px 0;
  display: flex;
}

.quill-editor .ql-container {
  border: none;
  font-family: PingFangSC-Regular;
  font-size: 14px !important;
}

.quill-editor .ql-container .ql-editor {
  padding: 0;
  color: #2f3034;
  line-height: 20px;
}
.ql-editor {
  box-sizing: border-box;
  counter-reset: list-0 list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8
    list-9;
  height: 100%;
  outline: none;
  overflow-y: auto;
  tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.upload-container {
  position: relative;
}
.upload-container .operation-icon {
  height: 80px;
}
.create-topic-container .create-topic-panel .operation-icon {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  -webkit-user-select: none;
  user-select: none;
}
.create-topic-container .create-topic-panel .operation-icon .left {
  display: flex;
  align-items: center;
  position: relative;
  flex-flow: row wrap;
  max-width: 600px;
  .picture-list {
    width: 100px;
    height: 100px;
    position: relative;
    border-radius: 10px;
    margin-left: 10px;
    .delete-pic {
      width: 16px;
      height: 16px;
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      top: 2px;
      right: 2px;
      text-align: center;
      &:hover {
        color: #4fbdd4;
        background: rgba(79, 189, 212, 0.1);
        /* background: rgba(255,130,0,.1); */
      }
    }

    img {
      width: 100px;
      height: 100px;
      border-radius: 10px;
      opacity: 0.7;
      object-fit: cover;
    }
    &:hover {
      background: black;
      opacity: 0.8;
    }
  }
  .picture-list:hover {
    background: black;
  }
}

.create-topic-container .create-topic-panel .operation-icon .right {
  // display: flex;
  position: absolute;
  right: 0;
  top: 0;
}
.upload-container .image-list-container {
  margin-top: 10px;
  margin-bottom: 4px;
  width: 318px;
}

.middle {
  position: absolute;
  right: 50px;
  top: 30px;
}
::v-deep .middle .el-input input {
  height: 30px;
  width: 90px;
  border: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.create-topic-container .create-topic-panel .operation-icon .right .text-range {
  margin-right: 16px;
  font-size: 12px;
  color: #c5c6cb;
  height: 24px;
  line-height: 24px;
  text-align: center;
  margin-bottom: 10px;
}
.create-topic-container .create-topic-panel .operation-icon .right .submit-btn {
  min-width: 50px;
  height: 24px;
  padding: 0 6px;
  box-sizing: border-box;
  line-height: 24px;
  text-align: center;
  background: #4fbdd4;
  box-shadow: 0 1px 2px #0000000d;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
}

.topic-detail .content .topic-detail-panel {
  background: #fff;
  border-radius: 4px;
  padding: 20px 30px 30px;
  overflow-y: scroll;
}
.el-col {
  margin-bottom: 20px;
}
.el-col:last-child {
  margin-bottom: 0;
}
.special_container {
  padding: 40px;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.empty {
  width: 100%;
  height: 140px;
  background: url('../../assets/quhu.png') no-repeat center center;
  background-size: 140px 140px;
}
.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
.wbpro-side-tit {
  height: 40px;
  line-height: 40px;
  padding: 0 18px;
  display: flex;
  position: relative;
}
.f16 {
  font-size: 16px;
}
.wbpro-side .f14 {
  cursor: pointer;
  width: 172px;
  font-size: 14px;
}
.wbpro-side-panel {
  padding: 0 18px;
  /* position: absolute; */
}
.wbpro-side-card7 .con {
  position: relative;
  height: 40px;
  padding: 0 30px 0 24px;
}
.wbpro-side-card7 .top {
  color: #f26d5f;
}
.wbpro-side-card7 .rank {
  position: absolute;
  top: 50%;
  left: 0;
  width: 20px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  text-align: center;
  color: #ff8200;
}
.wbpro-side-card7 .wbpro-textcut {
  margin-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wbpro-side .f12 {
  cursor: pointer;
  margin-left: 4px;
  font-size: 12px;
  line-height: 16px;
}
.wbpro-side-card7 .icon {
  position: absolute;
  right: 0;
  top: 50%;
  margin: -10px 0 0;
}
.wbpro-icon-search-tp1 {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background: rgb(255, 148, 6);
}
.woo-box-alignCenter {
  align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
}
.woo-box-flex {
  display: flex;
}
</style>
