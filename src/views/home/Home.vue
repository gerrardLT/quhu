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
      <el-col :span="3" class="nav_container">
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
              <span style="fontsize: 14px">{{ $t('home.short_corner') }}</span>
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
                <span style="fontsize: 14px">{{ $t('home.my_column') }}</span>
              </template>
              <el-menu-item
                style="minwidth: 90px"
                v-for="(item, index) in subscriptionsList.my"
                :key="index"
                :index="'1-' + index"
                @click="getArticlesByColumn(item, index)"
              >
                <!-- <img
                  :src="require(`../../assets/defaultAvatarUrl.png`)"
                  width="18px"
                  height="18px"
                  alt=""
                /> -->
                {{ item }}</el-menu-item
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
                <span style="fontsize: 14px">{{
                  $t('home.joined_column')
                }}</span>
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
              <span style="fontsize: 14px">{{ $t('home.create_column') }}</span>
            </div>
          </el-menu>
        </div>
      </el-col>
      <el-col
        :span="21"
        v-if="currentPath === '/write'"
        class="write_container"
      >
        <router-view></router-view>
      </el-col>
      <el-col :span="16" v-else class="mid_container">
        <div class="mid_wrapper">
          <div class="post-container">
            <div @click="postArticle" class="post-topic-head">
              <div class="tip">{{ $t('home.post_article') }}</div>
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
                      <span>{{ $t('home.post_long_article') }}</span>
                    </div>
                  </router-link>
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
                    <span> {{ $t('home.exit_column') }} </span>
                  </div>
                  <el-dialog
                    :title="$t('home.delete_tip')"
                    :visible.sync="removePopVisible"
                    :close-on-click-modal="false"
                    width="30%"
                    center
                  >
                    <span>{{ $t('home.exit_tip') }}</span>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="removePopVisible = false">{{
                        $t('home.cancel')
                      }}</el-button>
                      <el-button type="primary" @click="removeOut">{{
                        $t('home.confirm')
                      }}</el-button>
                    </span>
                  </el-dialog>
                </div>
              </div>
            </div>
          </div>
          <el-dialog
            :title="$t('home.tip')"
            :visible.sync="applyDialogVisible"
            :close-on-click-modal="false"
            width="30%"
          >
            <span
              >{{ $t('home.read_tip1') }}"{{ selectedColumn }}"{{
                $t('home.read_tip2')
              }}{{
                keepThreeNum((columnPrice.num / 12) * subscribeMonth) +
                columnPrice.label
              }}{{ $t('home.read_tip3') }}</span
            >
            <div class="subscribe_time">
              <el-tag>{{ $t('home.read_length') }}</el-tag>
              <el-select
                class="price_select"
                v-model="subscribeMonth"
                clearable
                :placeholder="$t('home.read_select_tip')"
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
              <el-button @click="applyDialogVisible = false">{{
                $t('home.cancel')
              }}</el-button>
              <el-button type="primary" @click="applyColumn">{{
                $t('home.confirm')
              }}</el-button>
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
                          >{{ $t('home.top') }}</el-dropdown-item
                        >
                        <el-dropdown-item
                          v-show="
                            item.body.status === 'top' &&
                            userInfo.buy_article.my.indexOf(
                              item.body.subscriptions_name
                            ) !== -1
                          "
                          @click.native="articleSet(item, index, '-')"
                          >{{ $t('home.cancel_top') }}</el-dropdown-item
                        >
                        <!-- <el-dropdown-item>置底</el-dropdown-item> -->

                        <el-dropdown-item
                          @click.native="articleSet(item, index, 'collect')"
                          v-show="!item.favorites"
                          >{{ $t('home.favorite') }}</el-dropdown-item
                        >
                        <el-dropdown-item
                          v-show="item.favorites"
                          @click.native="
                            articleSet(item, index, 'removeCollect')
                          "
                          >{{ $t('home.cancel_favorite') }}</el-dropdown-item
                        >

                        <el-dropdown-item
                          v-show="
                            editLimt(item.created) &&
                            userInfo.buy_article.my.indexOf(
                              item.body.subscriptions_name
                            ) !== -1
                          "
                          @click.native="editArticle(item)"
                          >{{ $t('home.edit') }}</el-dropdown-item
                        >
                        <el-dropdown-item
                          @click.native="articleSet(item, index, 'delete')"
                          v-show="
                            userInfo.buy_article.my.indexOf(
                              item.body.subscriptions_name
                            ) !== -1
                          "
                          class="deleteColor"
                          >{{ $t('home.delete') }}</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                    <div class="square-title">
                      {{ item.title }}
                    </div>
                    <div class="header-container">
                      <div class="author">
                        <el-popover placement="top" width="200" trigger="click">
                          <div class="author-column-intro">
                            <img
                              class="author-column-img"
                              :src="item.body.avatar"
                              alt=""
                            />
                            <div class="author-column-name">
                              {{ item.body.author }}
                            </div>
                            <div class="author-column-id">
                              {{ $t('home.user_id') }}：{{ userInfo.steem_id }}
                            </div>
                            <div class="author-column-special">
                              <span v-if="searchUserColumn.length > 0"
                                >{{ $t('home.his_column') }}：</span
                              >

                              <span v-if="searchUserColumn.length > 0">
                                <span
                                  class="author-column-special-text"
                                  v-for="(txt, k) in searchUserColumn"
                                  :key="txt"
                                  @click="handleSelect({ value: txt })"
                                >
                                  {{ k === 0 ? txt : '、' + txt }}</span
                                >
                              </span>

                              <span style="color: #5d5d5d" v-else>{{
                                $t('home.column_tip')
                              }}</span>
                            </div>
                          </div>
                          <img
                            slot="reference"
                            class="avatar"
                            :src="item.body.avatar"
                            alt=""
                            @click="getUserColumn(item.json_metadata.steem_id)"
                          />
                        </el-popover>
                        <!-- <img class="avatar" :src="item.body.avatar" alt="" /> -->
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
                        <el-popover placement="top" width="200" trigger="click">
                          <div class="author-column-intro">
                            <img
                              class="author-column-img"
                              :src="item.body.avatar"
                              alt=""
                            />
                            <div class="author-column-name">
                              {{ item.body.author }}
                            </div>
                            <div class="author-column-id">
                              {{ $t('home.user_id') }}：{{ userInfo.steem_id }}
                            </div>
                            <div class="author-column-special">
                              <span v-if="searchUserColumn.length > 0"
                                >{{ $t('home.his_column') }}：</span
                              >

                              <span v-if="searchUserColumn.length > 0">
                                <span
                                  class="author-column-special-text"
                                  v-for="(txt, k) in searchUserColumn"
                                  :key="txt"
                                  @click="handleSelect({ value: txt })"
                                >
                                  {{ k === 0 ? txt : '、' + txt }}</span
                                >
                              </span>

                              <span style="color: #5d5d5d" v-else>{{
                                $t('home.column_tip')
                              }}</span>
                            </div>
                          </div>
                          <img
                            slot="reference"
                            class="avatar"
                            :src="item.body.avatar"
                            alt=""
                            @click="getUserColumn(item.json_metadata.steem_id)"
                          />
                        </el-popover>
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
                            >{{ $t('home.top') }}</el-dropdown-item
                          >
                          <el-dropdown-item
                            v-show="
                              item.body.status === 'top' &&
                              userInfo.buy_article.my.indexOf(
                                item.body.subscriptions_name
                              ) !== -1
                            "
                            @click.native="articleSet(item, index, '-')"
                            >{{ $t('home.cancel_top') }}</el-dropdown-item
                          >
                          <!-- <el-dropdown-item>置底</el-dropdown-item> -->

                          <el-dropdown-item
                            @click.native="articleSet(item, index, 'collect')"
                            v-show="!item.favorites"
                            >{{ $t('home.favorite') }}</el-dropdown-item
                          >
                          <el-dropdown-item
                            v-show="item.favorites"
                            @click.native="
                              articleSet(item, index, 'removeCollect')
                            "
                            >{{ $t('home.cancel_favorite') }}</el-dropdown-item
                          >
                          <el-dropdown-item
                            @click.native="articleSet(item, index, 'delete')"
                            v-show="
                              userInfo.buy_article.my.indexOf(
                                item.body.subscriptions_name
                              ) !== -1
                            "
                            class="deleteColor"
                            >{{ $t('home.delete') }}</el-dropdown-item
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
                          <div v-if="item.title">
                            {{ item.title }}
                          </div>
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
                        :title="$t('home.star')"
                        class="like-outer"
                        @click="praise(item, 'article')"
                      >
                        <Icon
                          name="praise"
                          :color="item.isPraised ? '#fda956' : '#5D5D5D'"
                        />
                        <span class="vote-num">{{ item.voteNum || '' }}</span>
                      </div>
                      <div
                        :title="$t('home.comment')"
                        class="comment"
                        @click="editComment(item, index)"
                      >
                        <Icon name="discuss" />
                      </div>
                      <div
                        v-if="!item.favorites"
                        :title="$t('home.favorite')"
                        class="subscribe"
                        @click="articleSet(item, index, 'collect')"
                      >
                        <Icon name="collect" :color="'#5D5D5D'" />
                      </div>
                      <div
                        v-else
                        :title="$t('home.favorite')"
                        class="subscribe"
                        @click="articleSet(item, index, 'removeCollect')"
                      >
                        <Icon name="collect" :color="'#fda956'" />
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
                      <div class="text">{{ $t('home.view_detail') }}</div>
                      <div class="icon">
                        <Icon name="arrowR" />
                      </div>
                    </div>
                  </div>
                  <!-- :style="{
                        color: people === userInfo.steem_id ? '#087790' : ''
                      }" -->
                  <div
                    class="praisedPeople"
                    v-if="item.list && item.list.length > 0"
                  >
                    <div
                      class="vote_people"
                      v-for="(people, num) in item.list"
                      :key="people"
                    >
                      {{ people }}{{ num === item.list.length - 1 ? '' : '、' }}
                    </div>
                    <span style="margin-left: 10px; color: #8b8e9d">{{
                      $t('home.feel_nice')
                    }}</span>
                  </div>
                  <div class="reply_container" v-show="item.isEditReply">
                    <input
                      :placeholder="$t('home.content_tip')"
                      v-model.lazy="item.reply"
                      class="reply_input el-textarea__inner"
                    />
                    <div
                      class="el-input-group__append"
                      @click="submitReply(item, index, 'articleReply')"
                    >
                      {{ $t('home.reply') }}
                    </div>
                  </div>

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

                    <div class="operation-icon" style="margin-bottom: 20px">
                      <div
                        :title="$t('home.star')"
                        class="like"
                        @click="praise(currentDetail, 'detail')"
                      >
                        <Icon
                          name="praise"
                          :color="
                            currentDetail.isPraised ? '#fda956' : '#5D5D5D'
                          "
                        />
                        <span class="vote-num">{{
                          currentDetail.voteNum || ''
                        }}</span>
                      </div>
                      <div
                        v-if="!currentDetail.isFavorite"
                        :title="$t('home.favorite')"
                        class="subscribe"
                        @click="articleSet(item, index, 'collect')"
                      >
                        <Icon name="collect" :color="'#5D5D5D'" />
                      </div>
                      <div
                        v-if="currentDetail.isFavorite"
                        :title="$t('home.favorite')"
                        class="subscribe"
                        @click="articleSet(item, index, 'removeCollect')"
                      >
                        <Icon name="collect" :color="'#fda956'" />
                      </div>
                    </div>
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
                          <textarea
                            class="el-textarea__inner"
                            v-model.lazy="textareaConetent"
                            :placeholder="$t('home.say_something')"
                            style="min-height: 96px"
                          ></textarea>
                          <div>
                            <div style="margin: 10px 0">
                              <el-button
                                plain
                                type="primary"
                                @click="submitReply(item, index, 'ownReply')"
                                style="float: right"
                                >{{ $t('home.send') }}</el-button
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <Comment
                        class="comment-index"
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
          <el-empty v-else :description="$t('home.no_data')"></el-empty>

          <div v-if="showEditor" class="create-topic-container">
            <div class="create-topic-panel">
              <div class="head">
                <div class="title">
                  <input
                    type="text"
                    v-model.lazy="titleText"
                    class="titie_text"
                    :placeholder="$t('home.title_tip')"
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
                  <ShortPost ref="short_post" @upload="uploadImg"></ShortPost>
                  <!-- <div
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
                  </div> -->
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
                      :placeholder="articlePostType"
                      @change="$forceUpdate()"
                    >
                      <el-option
                        :label="$t('home.public')"
                        :value="$t('home.public')"
                      />
                      <el-option
                        :label="$t('home.only_self')"
                        :value="$t('home.only_self')"
                      />
                    </el-select>
                  </div>
                  <div class="right">
                    <div @click="submit()" class="submit-btn">
                      {{ $t('home.publish') }}
                    </div>
                  </div>
                </div>
                <div style="color: #c0c0c0; font-size: 14px; text-align: right">
                  {{ $t('home.publish_tip') }}
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
                  {{ $t('home.hot_column') }}
                </div>
                <div
                  class="woo-box-flex woo-box-alignCenter"
                  @click="getHotColumns"
                >
                  <i class="el-icon-refresh" style="color: #a2a2a2"></i
                  ><span
                    class="f12 clb"
                    style="
                      display: inline-block;
                      color: #a2a2a2;
                      max-width: 50px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    >{{ $t('home.click_refresh') }}</span
                  >
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
                      <div
                        :class="{
                          'rank-top': [0, 1, 2].indexOf(hotIndex) !== -1,
                          rank: true,
                          top: true,
                          f16: true
                        }"
                      >
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
                          >{{ $t('home.hot') }}</span
                        >
                      </div>
                    </div>
                    <div class="woo-divider-main woo-divider-x"></div>
                  </div>
                </div>
              </div>
              <el-empty v-else :description="$t('home.no_data')"></el-empty>
              <div class="hot_auction" @click="goLink">
                <svg
                  :style="{
                    fill: '#EE9611',
                    width: '25px',
                    height: '25px',
                    marginRight: '15px'
                  }"
                >
                  <use :xlink:href="'#icon-ring1'" rel="external nofollow" />
                </svg>
                <span
                  class="hot_text animate__animated animate__heartBeat animate__slower"
                  >{{ $t('home.hot_auction') }}</span
                >
              </div>
              <div class="woo-divider-main woo-divider-x"></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="$t('home.create_column')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="60%"
      :before-close="handleSubscriptionsClose"
    >
      <el-input
        :placeholder="$t('home.column_name_tip')"
        v-model="subscriptionsInfo.name"
      >
      </el-input>
      <div class="margin-top-10 sub_price">
        <el-input
          :placeholder="$t('home.column_price_tip')"
          v-model="subscriptionsInfo.price"
        >
        </el-input>

        <el-select
          class="price_select"
          v-model="subscriptionsInfo.currency"
          clearable
          :placeholder="$t('home.column_coin_tip')"
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
        {{ $t('home.price_tip') }}
      </div>
      <el-input
        class="margin-top-10"
        type="textarea"
        :rows="2"
        :placeholder="$t('home.intro_tip')"
        v-model="subscriptionsInfo.introduction"
      >
      </el-input>
      <div style="margin-top: 20px">
        <div style="margin-bottom: 10px">{{ $t('home.auth_tip') }}</div>
        <el-radio v-model="subscriptionsInfo.radio" label="self">{{
          $t('home.self')
        }}</el-radio>
        <el-radio v-model="subscriptionsInfo.radio" label="all">{{
          $t('home.all')
        }}</el-radio>
      </div>
      <div style="margin-top: 20px">
        <div style="margin-bottom: 10px">{{ $t('home.column_picture') }}</div>
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
          {{ $t('home.column_rule') }}
        </div>
        <el-button @click="handleSubscriptionsClose">{{
          $t('home.cancel')
        }}</el-button>
        <el-button
          class="sub_confirm"
          type="primary"
          @click="submitSubscriptions"
          >{{ $t('home.confirm') }}</el-button
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
  getVote,
  hotColumn,
  goTop,
  collect,
  removeCollect
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
import ShortPost from './ShortPost.vue'
import { Loading } from 'element-ui'
import { decrypt } from '@/utils/ascill'
import { debounce } from 'lodash'
import Collapse from '@/utils/collapse'
const defaultAvatar = require(`../../assets/defaultAvatarUrl.png`)

export default {
  components: {
    Icon,
    Comment,
    Collapse,
    ShortPost
  },
  data() {
    return {
      searchUserColumn: [],
      articlePermlinkList: [],
      articlePostType: this.$t('home.public'),
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
          value: 'usdt',
          label: 'usdt'
        },
        {
          value: 'bnb',
          label: 'bnb'
        }
      ],
      searchResult: [],
      articleList: [],
      // postContent: '',
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
        { label: this.$t('home.one_month'), value: 1 },
        { label: this.$t('home.three_month'), value: 3 },
        { label: this.$t('home.six_month'), value: 6 },
        { label: this.$t('home.nine_month'), value: 9 },
        { label: this.$t('home.twelve_month'), value: 12 }
      ],
      subscribeMonth: 12,
      pageListStart: {},
      contentRefList: {},
      updateTimeout: null
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
    uploadImg() {
      this.$refs.upload.$el.click()
      document.querySelector('.avatar-uploader-edit input').click()
    },
    goLink() {
      this.$EventBus.$emit('changeTab', { name: 'auction' }, 2)
    },
    async getUserColumn(name) {
      this.searchUserColumn = []
      const res = await searchColumn({
        subscriptions_name: name
      })

      if (res && res.success === 'ok') {
        const len = res.data.length
        this.searchUserColumn = res.data.splice(1, len - 1)
        console.log(this.searchUserColumn)
      }
    },
    updateArticle(res) {
      const result = this.formatPostArticle(res)
      // console.log(result)
      this.articleList.unshift(result)
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
                    200
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
        this.$message.success(this.$t('home.reread_success'))
        window.reload()
      } else {
        this.$message.error(res.error)
      }
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
            this.$message.success(this.$t('home.top_success'))
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
            this.$message.success(this.$t('home.cancel_top_success'))
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
            this.$message.success(this.$t('home.delete_success'))
          }

          break
        case 'collect':
          const res1 = await collect({
            id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
            token: token,
            permlink: [v.author, v.permlink]
          })

          if (res1 && res1.success === 'ok') {
            this.$message.success(this.$t('home.favorite_success'))
            v.favorites = true
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
            this.$message.success(this.$t('home.cancel_favorite_success'))
            v.favorites = false
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
            isHot: false
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
      res = await vote({
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        steem_id: userInfo.steem_id,
        token,
        permlink: [v.author, v.permlink]
      })

      if (res && res.success === 'ok') {
        if (res.type === '+') {
          this.$message.success(this.$t('home.star_success'))
          if (v.list) {
            v.list.push(userInfo.steem_id)
          }
          v.isPraised = true
          v.voteNum += 1
        } else if (res.type === '-') {
          this.$message.success(this.$t('home.cancel_star_success'))
          if (v.list) {
            v.list = v.list.filter((item) => {
              return item !== userInfo.steem_id
            })
          }
          v.isPraised = false
          v.voteNum -= 1
        }
      } else {
        this.$message.success(this.$t('home.network_error_tip'))
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
        this.$message.success(this.$t('home.exit_column_tip'))
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
      if (this.$route.path === '/home') {
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
          // console.log('调用了')
          debounceLoad() // 加载数据
        }
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
      console.log(this.favorites)
      if (this.favorites.length > 0) {
        this.favorites.forEach((ele) => {
          if (ele.permlink[1] === res.permlink) {
            res.isFavorite = true
          } else {
            res.isFavorite = false
          }
        })
      }

      // console.log(res)
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

            element.isPraised = element.voted
            element.isFavorite = element.favorites
            // element.isFavorite = false
            element.voteNum = element.vote
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
        this.$message.error(this.$t('home.price_integar_tip'))
        return
      }
      if (!name.trim()) {
        this.$message.error(this.$t('home.column_name_tip'))
        return
      }
      if (!price) {
        this.$message.error(this.$t('home.price_select_tip'))
        return
      }
      if (!currency) {
        this.$message.error(this.$t('home.coin_select_tip'))
        return
      }
      if (!introduction.trim()) {
        this.$message.error(this.$t('home.intro_tip'))
        return
      }
      if (!radio) {
        this.$message.error(this.$t('home.post_auth_tip'))
        return
      }
      if (!image) {
        this.$message.error(this.$t('home.column_picture_select_tip'))
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
        this.$message.success(this.$t('home.create_success_tip'))
        this.handleSubscriptionsClose()
      } else {
        this.$message.error(this.$t('home.create_fail_tip'))
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
        text: this.$t('message.loading'),
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
        this.$message.success(this.$t('home.reply_success'))
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
        this.$message.error(this.$t('home.post_fail_tip'))
        this.closeEditor()

        // v.reply = ''
      }
      if (v) {
        v.isEditReply = false
      }
    },

    postArticle() {
      // this.$router.push({
      //   path: '/write',
      //   query: {
      //     selectedColumn: this.selectedColumn
      //   }
      // })

      console.log(this.selectedColumn)
      const userInfo = this.userInfo
      let flag = true
      userInfo.article.forEach((item) => {
        if (this.selectedColumn === item.name) {
          if (
            item.allow[0] === this.userInfo.steem_id ||
            item.allow === 'all'
          ) {
            flag = true
          } else {
            flag = false
          }
        }
      })
      if (!flag) {
        this.$message.warning(this.$t('home.have_no_right'))
        return
      }
      this.showEditor = true

      this.$nextTick(() => {
        this.$refs.short_post.$refs.myQuillEditor.quill.root.addEventListener(
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
      if (!this.articlePostType) {
        this.$message.error(this.$t('home.select_post_status_tip'))
        return
      }
      if (!(this.$refs.short_post.postText + imgHtml)) {
        this.$message.error(this.$t('home.post_content_tip'))
        return
      }

      // if (!(this.postContent + imgHtml)) {
      //   this.$message.error(this.$t('home.post_content_tip'))
      //   return
      // }
      // console.log(this.content, this.content.length)
      // console.log(imgHtml)
      const loading = Loading.service({
        text: this.$t('message.loading'),
        spinner: 'el-icon-loading ElementLoading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      console.log(this.$refs.short_post.postText)
      const res = await post({
        type: 'post',
        id: loginType === 'password' ? userInfo.user : userInfo.eth_account,
        token: getToken(),
        user_name: userInfo.user_name,
        steem_id: userInfo.steem_id,
        subscriptions_name: this.selectedColumn || '',
        permlink: '',
        title: this.titleText,
        public: this.articlePostType === this.$t('home.public') ? 'yes' : 'no',
        body: this.$refs.short_post.postText + imgHtml
      })

      if (res && res.success === 'ok') {
        console.log(res.result, this.articleList)
        this.closeEditor()

        this.$message.success(this.$t('home.post_success'))
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
        res.result.isPraised = false
        res.result.isFavorite = false
        res.result.favorites = false
        res.result.voteNum = 0
        res.result.vote = 0
        res.result.list = []
        res.result.isShowDetailDialog = false

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
      } else {
        this.$message.error(this.$t('home.post_fail_tip'))
        this.closeEditor()
      }
      this.$refs.short_post.textLength = 0
      if (loading) {
        loading.close()
      }
    },
    closeEditor() {
      this.showEditor = false
      this.$refs.short_post.resetText()
      // this.postContent = ''
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
      let commentList = []
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
      commentList = commentList.reverse()
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
    // postContent: {
    //   handler(newVal, oldVal) {},
    //   deep: true,
    //   immediate: true
    // },
    articleList: {
      handler(newVal, oldVal) {},
      deep: true,
      immediate: true
    },
    '$i18n.locale': {
      handler(newVal, oldVal) {
        this.articlePostType = this.$t('home.public')
      },
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
.deleteColor {
  color: #f57f59;
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
.reply_container {
  display: flex;
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
  min-height: 600px;
  background-color: #fff;
  margin-left: 20px;
  width: 250px;
  position: relative;
  border-radius: 10px;
  .hot_auction {
    position: absolute;
    bottom: 20px;
    left: 18px;
    cursor: pointer;
    display: flex;
    color: #dd2222;
    margin-top: 20px;
    align-items: center;
    .hot_text {
      font-size: 18px;
      font-weight: bold;
      width: auto;
      display: inline-block;
      // animation: shake 4s ease-in-out infinite;
    }
  }
}
@keyframes shake {
  0% {
    font-size: 14px;
  }
  50% {
    font-size: 16px;
  }
  100% {
    font-size: 14px;
  }
}

.sub_confirm {
  background: #4fbdd4;
}
.nav_container {
  width: 10%;
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
::v-deep .el-input-group__append {
  padding: 0 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
::v-deep .reply_input {
  width: calc(100% - 76px);
  padding-left: 10px;
  padding-right: 20px;
  border-radius: 0;
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
.author-column-intro {
  width: 200px;
  // max-height: 100px;
  // height: 100px;
  position: relative;
  padding-top: 35px;
}
.author-column-img {
  position: absolute;
  top: -25px;
  left: calc(50% - 25px);
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
.author-column-name {
  text-align: center;
  margin-bottom: 10px;
}
.author-column-id {
  text-align: center;
  margin-bottom: 10px;
}
.author-column-special {
  text-align: center;
  overflow: hidden;
  // white-space: nowrap;
  text-overflow: ellipsis;
}
.author-column-special-text {
  color: #4fbdd4;
  cursor: pointer;
}
.operation-icon {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .like {
    display: flex;
    margin-right: 20px !important;
    width: 40px !important;
    .vote-num {
      margin-left: 5px;
      color: #fda956;
    }
  }
  .like-outer {
    display: flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    margin-right: 20px;
    // width: 25px !important;
    .vote-num {
      display: inline-block;
      margin-left: 5px;
      color: #fda956;
    }
  }
}
.topic-detail-panel .operation-icon div {
  width: auto;
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
  border-radius: 10px;
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
  padding: 0 10px;
  margin-left: 16px;
  height: 30px;
  min-width: 60px;
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
  padding: 0 10px;
  height: 30px;
  min-width: 80px;
  line-height: 30px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #8b8e9d;
  cursor: pointer;
}
.remove-article:hover {
  background: #4fbdd4;
  color: white;
}
.topic-container {
  margin-top: 10px;
  background: #fff;
  margin-bottom: 10px;
  border-radius: 10px;
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
  max-height: 200px;
  overflow-y: hidden;
}
.talk-content-container {
  padding-left: 56px;
  padding-right: 20px;
  margin-bottom: 10px;
  // line-height: 21px;
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
  padding-left: 30px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  margin-bottom: 10px;
}
.topic-container .operation-icon-container .operation-icon {
  display: flex;
}
.topic-container .operation-icon-container .operation-icon div {
  vertical-align: middle;
  width: auto;
  height: 21px;
  margin-right: 30px;
  cursor: pointer;
}
.steemLink {
  color: #c5c6cb;
  font-size: 12px;
  position: absolute;
  right: 120px;
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
.praisedPeople {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-left: 30px;
  padding-right: 20px;
  margin-bottom: 20px;
  .vote_people {
    color: #567895;
    cursor: pointer;
  }
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
  top: 30px;
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
  font-size: 12px;
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

.wbpro-side-card7 .rank {
  position: absolute;
  top: 50%;
  left: 0;
  width: 20px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  text-align: center;
  color: #ffad33;
  font-weight: bold;
}
.wbpro-side-card7 .rank-top {
  color: #f93a3a;
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
