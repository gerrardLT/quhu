<template>
  <div class="main-content-container">
    <div class="backtop" @click="scrolltoTop" v-show="isBottom" style="right: 30px; bottom: 50px;"><i class="el-icon-caret-top"></i></div>
    <el-row
      class="tab"
      :style="
        currentPath === '/write' ? { paddingTop: '0' } : { paddingTop: '10px' }
      "
    >
      <el-col
        :span="2"
        class="nav_container"
        :style="currentPath === '/write' ? { top: '100px' } : { top: '95px' }"
      >
        <div class="nav_left">
          <!-- <img
            style="width: 100%; object-fit: cover"
            src="../../assets/logo.png"
            alt=""
          /> -->
          <el-menu
            class="nav_menu"
            :style="
              currentPath === '/write'
                ? { minHeight: '700px' }
                : { minHeight: '0' }
            "
            :default-active="activeMenuId"
            @open="handleOpen"
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
        :span="22"
        v-if="currentPath === '/write'"
        class="write_container"
      >
        <router-view></router-view>
      </el-col>
      <el-col :span="18" v-else class="mid_container">
        <div class="mid_wrapper">
          <div class="swiper" ref="swiper" v-show="currentPath === '/home'">
            <el-carousel height="100px">
              <el-carousel-item
                v-for="item in advertisementList"
                :key="item.title"
              >
                <router-link
                  :to="{
                    path: '/official_banner'
                  }"
                >
                  <img
                    class="advertise_image"
                    style="width: 100%; object-fit: cover"
                    :src="item.image"
                    :title="item.title"
                    alt=""
                /></router-link>
              </el-carousel-item>
            </el-carousel>
          </div>
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
          <div class="article_class" v-if="selectedMenu !== 'short-square' ">
            <!-- <div :class="{'article_type_item':true,'active':typeSelected ===$t('home.default') }">
              <div @click="filterArticle()">{{ $t('home.default') }}</div>
            </div> -->
            <div v-for="(typeItem,typeIndex) in articleTypeList" :key="typeItem" :class="{'article_type_item':true,'active':typeItem ===typeSelected }" >
              <div @click="filterArticle(typeItem,typeIndex)">{{ typeItem }}</div>
            </div>
            <div class="go_column" v-if="userInfo.buy_article.my.indexOf(selectedColumn)!==-1">
              <div @click="handleSelect({value:selectedColumn })" :title="$t('home.go_column')"><i class="el-icon-setting"></i></div>
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
            class="article_list custom-loading-container"
          >
            <div
              v-loading="articleLoading"
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
                        <el-popover placement="top" width="200" trigger="hover">
                          <div class="author-column-intro">
                            <img
                              class="author-column-img"
                              :src="item.body.avatar"
                              alt=""
                            />
                            <div
                              class="author-column-name"
                              @click="goInfo(item)"
                            >
                              {{ item.body.author }}
                            </div>
                            <div class="author-column-id">
                              {{ $t('home.user_id') }}：{{
                                item.json_metadata.steem_id
                              }}
                            </div>
                            <div class="author-column-special">
                              <span
                                v-if="
                                  currentUserInfo.data.article &&
                                  currentUserInfo.data.article.length > 0
                                "
                                >{{ currentUserInfo.self?$t('home.your_column'): $t('home.his_column') }}：</span
                              >

                              <span
                                v-if="
                                  currentUserInfo.data.article &&
                                  currentUserInfo.data.article.length > 0
                                "
                                v-loading="searchUserColumnLoading"
                              >
                                <span
                                  class="author-column-special-text"
                                  v-for="(txt, k) in currentUserInfo.data
                                    .article"
                                  :key="txt.name"
                                  @click="handleSelect({ value: txt.name })"
                                >
                                  {{
                                    k === 0 ? txt.name : '、' + txt.name
                                  }}</span
                                >
                              </span>

                              <span style="color: #5d5d5d" v-else>{{
                                $t('home.column_tip')
                              }}</span>
                            </div>
                            <div class="follow" v-if="!currentUserInfo.self">
                              <span
                                v-if="!currentUserInfo.follow"
                                @click="togglefollow(item)"
                                >{{ '+' + $t('home.follow') }}</span
                              >
                              <span v-else @click="togglefollow(item)">{{
                                $t('home.unfollow')
                              }}</span>
                            </div>
                          </div>
                          <img
                            slot="reference"
                            class="avatar"
                            :src="item.body.avatar"
                            alt=""
                            @click="goInfo(item)"
                            @mouseenter="
                              getOtherUserInfo(item.json_metadata.steem_id)
                            "
                          />
                        </el-popover>
                        <!-- <img class="avatar" :src="item.body.avatar" alt="" /> -->
                        <div class="info">
                          <div class="role owner" @click="goInfo(item)">{{ item.body.author }}</div>
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
                        <el-popover placement="top" width="200" trigger="hover">
                          <div class="author-column-intro">
                            <img
                              class="author-column-img"
                              :src="item.body.avatar"
                              alt=""
                            />
                            <div
                              class="author-column-name"
                              @click="goInfo(item)"
                            >
                              {{ item.body.author }}
                            </div>
                            <div class="author-column-id">
                              {{ $t('home.user_id') }}：{{
                                item.json_metadata.steem_id
                              }}
                            </div>
                            <div class="author-column-special">
                              <span v-if="searchUserColumn.length > 0"
                                >{{currentUserInfo.self?$t('home.your_column'): $t('home.his_column') }}：</span
                              >

                              <span
                                v-if="
                                  currentUserInfo.data.article &&
                                  currentUserInfo.data.article.length > 0
                                "
                                v-loading="searchUserColumnLoading"
                              >
                                <span
                                  class="author-column-special-text"
                                  v-for="(txt, k) in currentUserInfo.data
                                    .article"
                                  :key="txt.name"
                                  @click="handleSelect({ value: txt.name })"
                                >
                                  {{
                                    k === 0 ? txt.name : '、' + txt.name
                                  }}</span
                                >
                              </span>

                              <span style="color: #5d5d5d" v-else>{{
                                $t('home.column_tip')
                              }}</span>
                            </div>
                            <div class="follow" v-if="!currentUserInfo.self">
                              <span
                                v-if="!currentUserInfo.follow"
                                @click="togglefollow(item)"
                                >{{ '+' + $t('home.follow') }}</span
                              >
                              <span v-else @click="togglefollow(item)">{{
                                $t('home.unfollow')
                              }}</span>
                            </div>
                          </div>
                          <img
                            slot="reference"
                            class="avatar"
                            :src="item.body.avatar"
                            alt=""
                            @click="goInfo(item)"
                            @mouseenter="
                              getOtherUserInfo(item.json_metadata.steem_id)
                            "
                          />
                        </el-popover>
                        <div class="info">
                          <div class="role owner" @click="goInfo(item)">{{ item.body.author }}</div>
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
                        @mouseenter="item.mouseActivePraise = true"
                        @mouseleave="item.mouseActivePraise = false"
                      >
                        <Icon
                          name="praise"
                          style="transition: all 0.1s linear"
                          :class="{
                            like_animation: item.isPraised
                          }"
                          :color="
                            item.isPraised
                              ? '#fda956'
                              : item.mouseActivePraise
                              ? '#087790'
                              : 'grey'
                          "
                        />
                        <span class="vote-num">{{ item.voteNum || '' }}</span>
                      </div>
                      <div
                        :title="$t('home.comment')"
                        class="comment"
                        @click="editComment(item, index)"
                        @mouseenter="item.mouseActiveComment = true"
                        @mouseleave="item.mouseActiveComment = false"
                      >
                        <Icon
                          style="transition: all 0.1s linear"
                          name="discuss"
                          :color="item.mouseActiveComment ? '#087790' : 'grey'"
                        />
                      </div>
                      <div
                        v-if="!item.favorites"
                        :title="$t('home.favorite')"
                        class="subscribe"
                        @click="articleSet(item, index, 'collect')"
                        @mouseenter="item.mouseActiveFavorites = true"
                        @mouseleave="item.mouseActiveFavorites = false"
                      >
                        <Icon
                          style="transition: all 0.1s linear"
                          name="collect"
                          :color="
                            item.mouseActiveFavorites ? '#087790' : 'grey'
                          "
                        />
                      </div>
                      <div
                        v-else
                        :title="$t('home.favorite')"
                        class="subscribe"
                        @click="articleSet(item, index, 'removeCollect')"
                      >
                        <Icon name="collect" :color="'#fda956'" />
                      </div>
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
                  </div>
                  <div
                    class="praisedPeople"
                    v-if="item.list && item.list.length > 0"
                  >
                    <div
                      class="vote_people"
                      v-for="(people, num) in item.list"
                      :key="people"
                    >
                      <span @click="goInfo(item)">{{ people }}</span>
                      {{ num === item.list.length - 1 ? '' : '、' }}
                    </div>
                    <span style="margin-left: 10px; color: grey">{{
                      $t('home.feel_nice')
                    }}</span>
                  </div>

                  <div
                    v-if="item.isEditReply"
                    class="comment-item-container"
                    style="padding: 10px"
                  >
                    <div class="Comment" :style="{ width: '100%' }">
                      <div style="display: flex">
                        <el-avatar
                          size="small"
                          :src="
                            userAvatar
                              ? userAvatar
                              : require(`../../assets/defaultAvatarUrl.png`)
                          "
                          style="margin: 0 10px"
                        />
                        <div style="flex: auto">
                          <textarea
                            ref="myTextarea"
                            @input="editorSuply"
                            class="el-textarea__inner"
                            maxlength="200"
                            v-model.lazy="textareaConetent"
                            :placeholder="$t('home.say_something')"
                            style="
                              min-height: 30px;
                              font-size: 16px;
                              color: #2f3034;
                              font-weight: 400;
                              overflow-y: hidden;
                              height: 34px;
                              resize: none;
                            "
                          ></textarea>
                          <div class="picker_container">
                            <span
                              class="iconfont icon-biaoqing"
                              @click="toggleEmojione(item)"
                            >
                              <svg
                                :style="{
                                  width: '20px',
                                  height: '20px',
                                  marginRight: '15px'
                                }"
                              >
                                <use
                                  :xlink:href="'#icon-emoji'"
                                  rel="external nofollow"
                                />
                              </svg>
                            </span>
                            <Picker
                              v-show="item.showPicker"
                              :data="emojiIndex"
                              set="twitter"
                              @select="showEmoji"
                              class="my-picker"
                            />
                            <div style="margin: 10px 0">
                              <!-- <div class="text-range">{{ $refs.myTextarea[0] }}/200</div> -->
                              <el-button
                                plain
                                type="primary"
                                @click="
                                  submitReply(
                                    item,
                                    item.currentDetail,
                                    'ownReply'
                                  )
                                "
                                class="suply_btn"
                                style="
                                  float: right;
                                  width: 80px;
                                  font-size: 14px;
                                "
                                size="small"
                                >{{ $t('home.comment') }}</el-button
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        v-loading="item.replyLoading"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                      >
                        <Comment
                          class="comment-index"
                          style="margin: 0 auto"
                          v-for="(commentp, index) in item.currentDetail &&
                          item.currentDetail.commentList"
                          :key="index"
                          :comment="commentp"
                          :commentindex="index"
                          :submit="submitReply"
                          :detail="item.currentDetail"
                          :columnK="columnK"
                          :selectedMenu="selectedMenu"
                        ></Comment>
                      </div>
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
                <el-select
                    class="select_article_type"
                    :placeholder="$t('home.select_article_type_tip')"
                      v-model="ArticleTypeSelected"
                      @change="selectArticleType"
                    >
                      <el-option
                        v-for="article_type in articleTypeList.filter(type=>type!==$t('home.default'))"
                        :key="article_type"
                        :label="article_type"
                        :value="article_type"
                      />
                    </el-select>
              </div>
              <div>
                <div class="horizontal-line"></div>
                <div class="content-container">
                  <img class="avatar" :src="userAvatar" />
                  <ShortPost ref="short_post" @upload="uploadImg"></ShortPost>
                </div>
                <div class="horizontal-line"></div>
              </div>
              <div class="upload-container">
                
                <div
                  class="operation-icon"
                  ref="operation_icon"
                  @click="closeEmoji"
                >
                  <div class="left" v-if="fileList.length !== 0">
                    <div
                      ref="imgList"
                      class="picture-list"
                      v-for="(item, i) in fileList"
                      :key="i"
                      v-loading="item.loading"
                    >
                      <img class="picList" :src="item.url" />
                      <i
                        class="delete-pic el-icon-close"
                        @click="deleteEditorImage(item, i)"
                      >
                      </i>
                    </div>
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
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :span="4"
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
                  <i class="el-icon-refresh" style="color: #c0c0c0"></i
                  ><span
                    class="f12 clb"
                    style="
                      display: inline-block;
                      color: #c0c0c0;
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
              <div v-if="hotColumns.length > 0" class="hot_container">
                <div
                  class="wbpro-side-card7"
                  v-for="(hot, hotIndex) in hotColumns"
                  :key="hotIndex"
                >
                  <div class="wbpro-side-panel">
                    <div class="con woo-box-flex woo-box-alignCenter">
                      <div v-if="hotIndex === 0">
                        <svg
                          :style="{
                            fill: '#EE9611',
                            width: '20px',
                            height: '20px',
                            marginRight: '15px'
                          }"
                          :class="{
                            'rank-top': [0, 1, 2].indexOf(hotIndex) !== -1,
                            rank: true,
                            top: true,
                            f16: true
                          }"
                        >
                          <use
                            :xlink:href="'#icon-fire'"
                            rel="external nofollow"
                          />
                        </svg>
                      </div>
                      <div
                        :class="{
                          'rank-top': [1, 2, 3].indexOf(hotIndex) !== -1,
                          rank: true,
                          top: true,
                          f16: true
                        }"
                        v-else
                      >
                        {{ Number(hotIndex) }}
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
                <!-- <svg
                  :style="{
                    fill: '#EE9611',
                    width: '25px',
                    height: '25px',
                    marginRight: '15px'
                  }"
                >
                  <use :xlink:href="'#icon-ring1'" rel="external nofollow" />
                </svg> -->
                <img
                  src="../../assets/radio.png"
                  style="width: 25px; height: 25px"
                  alt=""
                  class="animate__animated animate__heartBeat animate__slower"
                />

                <span
                  class="hot_text"
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
      <input
        type="text"
        v-model.lazy="subscriptionsInfo.name"
        :placeholder="$t('home.title_tip')"
        class="el-textarea__inner"
        style="height: 40px"
      />

      <div class="margin-top-10 sub_price">
        <input
          type="text"
          :placeholder="$t('home.column_price_tip')"
          v-model.lazy="subscriptionsInfo.price"
          class="el-textarea__inner"
        />
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

      <textarea
        class="el-textarea__inner margin-top-10"
        v-model.lazy="subscriptionsInfo.introduction"
        :placeholder="$t('home.intro_tip')"
        style="resize: none;"
      ></textarea>
      <div class="tag_tips">
        {{ $t('home.tag_tip') }}
      </div>
      <div class="tags" style="margin-top: 10px; display: flex">
        <el-tag
          effect="plain"
          class="tag"
          style="margin-left: 5px; min-width: 100px"
          :type="tagTypes[i]"
          v-for="(item, i) in tagList"
          :key="i"
          closable
          :title="item"
          @close="handleTagClose(item)"
          >{{ item }}</el-tag
        >

        <input
          type="text"
          class="input-new-tag el-textarea__inner"
          v-if="inputVisible"
          v-model.lazy="inputValue"
          maxlength="12"
          ref="saveTagInput"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button
          v-else-if="tagList.length < 3"
          class="button-new-tag"
          size="small"
          @click="showInput"
          >{{ $t('info.add_label') }}</el-button
        >
      </div>

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
          :accept="'image/*'"
          :show-file-list="false"
          :action="actionUrl"
          :http-request="onUploadSubImgHandler"
          v-loading="createAvatarLoading"
        >
          <img
            v-if="subscriptionsInfo.image"
            :src="subscriptionsInfo.image"
            class="avatar-img"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="rule">
        <div>{{ $t('home.column_rule_tip') }}：</div>
        <div>
          <div class="rule_item">{{ $t('home.column_rule1') }}</div>
          <div class="rule_item">{{ $t('home.column_rule2')+'20 usdt' }}</div>
          <div class="rule_item">{{ $t('home.column_rule3')+'80 usdt' }}</div>
        </div>
          
        </div>
      <span slot="footer" class="dialog-footer create-footer">

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
      :accept="'image/*'"
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
  hotColumn,
  goTop,
  collect,
  removeCollect
} from '@/api/special/special'
import MD5 from 'md5'
import { getUser, follow, unfollow, getOtherUser } from '@/api/user/user'
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
import { encrypt, decrypt } from '@/utils/ascill'
import { debounce } from 'lodash'
import Collapse from '@/utils/collapse'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
import data from 'emoji-mart-vue-fast/data/all.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { wrapEmoji, emojiToHtml } from '@/utils/convertEmoji'
let emojiIndex = new EmojiIndex(data)

const defaultAvatar = require(`../../assets/defaultAvatarUrl.png`)

export default {
  components: {
    Icon,
    Comment,
    Collapse,
    Picker,
    ShortPost
  },
  data() {
    return {
      typeSelected: this.$t('home.default'),
      typeSelectedIndex:0,
      isBottom:false,
      createAvatarLoading: false,
      emojiIndex: emojiIndex,
      emojisOutput: '',
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
      inputVisible: false,
      inputValue: '',
      tagList: [],
      ArticleTypeSelected: '',
      tagTypes: ['success', 'warning', 'danger'],
      searchResult: [],
      articleList: [],
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
      currentUserInfo: { data: {} },
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
      updateTimeout: null,
      searchUserColumnLoading: false,
      advertisementList: [
        {
          image: require('@/assets/planet.jpg'),
          title: this.$t('home.office_inform')
        }
      ]
    }
  },
  computed: {
    userInfo() {
      return JSON.parse(localStorage.getItem('quhu-userInfo'))
    },
    articleTypeList(){
      let arr =[this.$t('home.default')]
      if(this.currentInfo.article){
        this.currentInfo.article.forEach((v)=>{
        if(this.selectedColumn === v.name){
          v.item.forEach((item)=>{
            arr.push(item)
          })
        }   
      })
      }

      const newArray = arr.filter(item => item !== "")
      return newArray
    },
    currentPath() {
      // console.log(this.$route)
      return this.$route.path
    },
    userAvatar() {
      return JSON.parse(localStorage.getItem('quhu-userInfo')).avatar
    },

    loginType() {
      return localStorage.getItem('login-type')
    }
  },
  async created() {
    this.$bus.$on('update-article', this.updateArticle)
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
    this.$bus.$off('update-article', this.updateArticle)
    window.removeEventListener('scroll', this.getArticlesData)
    clearTimeout('articleTimeout')
  },
  methods: {
    decrypt,
    selectArticleType(v){
      console.log(v)
    },
    filterArticle(v,i){
      this.typeSelected = v
      this.typeSelectedIndex = i
      this.getArticlesByColumn(this.selectedColumn,this.selectedMenu.split('-')[1],'filter','')
    },
    scrolltoTop(){
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    getOtherUserInfo: debounce(async function (steemId) {
      this.searchUserColumnLoading = true
      const id =
        this.loginType === 'eth'
          ? this.userInfo.eth_account
          : this.userInfo.user
      const res = await getOtherUser({
        id,
        steem_id: steemId,
        token: getToken()
      })

      if (res && res.success === 'ok') {
        this.currentUserInfo = res
      }
      this.searchUserColumnLoading = false
    }, 500),
    togglefollow: debounce(function (item) {
      if (this.currentUserInfo.follow) {
        this.unFollow(item)
      } else {
        this.follow(item)
      }
    }, 500),
    async follow(v) {
      const res = await follow({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        steem_id: v.json_metadata.steem_id
      })
      if (res && res.success === 'ok') {
        this.currentUserInfo.follow = !this.currentUserInfo.follow
        this.$message.success(this.$t('home.follow_success_tip'))
      }
    },
    async unFollow(v) {
      const res = await unfollow({
        id:
          this.loginType === 'eth'
            ? this.userInfo.eth_account
            : this.userInfo.user,
        token: getToken(),
        steem_id: v.json_metadata.steem_id
      })
      if (res && res.success === 'ok') {
        this.currentUserInfo.follow = !this.currentUserInfo.follow
        this.$message.success(this.$t('home.follow_cancel_tip'))
      }
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        console.log(this.$refs.saveTagInput)
        this.$refs.saveTagInput.focus()
      })
    },
    async handleInputConfirm() {
      let inputValue = this.inputValue
      // const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      // if (!reg.test(inputValue.trim())) {
      //   this.$message.error(this.$t('info.nick_tip'))
      //   return
      // }
      const arr = [inputValue]
      if (inputValue) {
        this.tagList = this.tagList.concat(arr)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    async handleTagClose(tag) {
      //   const arr = cloneDeep(this.tagList)
      this.tagList.splice(this.tagList.indexOf(tag), 1)
      this.$forceUpdate()
    },
    goInfo(v) {
      console.log(v,this.currentUserInfo)
      this.$router.push({
        path: '/information',
        query: {
          id: v.body.author,
          steemId: v.json_metadata.steem_id
        }
      })
    },
    showEmoji(emoji) {
      this.textareaConetent += emoji.native
    },
    toggleEmojione(item) {
      // this.showPicker = !this.showPicker;
      item.showPicker = !item.showPicker
    },
    closeEmoji(event) {
      const targetElement = event.target
      console.log(targetElement.classList)
      // 检查点击的元素是否是目标子元素
      if (
        targetElement.classList.contains('picList') ||
        targetElement.classList.contains('delete-pic')
      ) {
      } else {
        this.$refs.short_post.closeEmojione()
      }
    },
    closeEmojione(item) {
      item.showPicker = false
    },
    uploadImg() {
      this.$refs.upload.$el.click()
      document.querySelector('.avatar-uploader-edit input').click()
    },
    goLink() {
      this.$bus.$emit('changeTab', { name: 'auction' }, 2)
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
    articleSet: debounce(async function (v, i, type) {
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
            this.$forceUpdate()
            // this.articleList.forEach((item) => {
            //   if (item.permlink === v.currentDetail.permlink) {
            //     v.currentDetail.isFavorite = true
            //     this.$set(v.currentDetail,'favorites',true)
            //   }
            // })
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
            this.$forceUpdate()
            // this.articleList.forEach((item) => {
            //   if (item.permlink === v.currentDetail.permlink) {
            //     v.currentDetail.isFavorite = false
            //   }
            // })
          }
          break
        default:
          break
      }
    }, 500),
    editorSuply(v) {
      const textarea = this.$refs.myTextarea[0]
      // textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    },
    getHotColumns: debounce(async function () {
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
    }, 500),
    praise: debounce(async function (v, type) {
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
    }, 500),
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
    async loadHandler(file, cb,type) {
      let dataUrl = ''

      if (file) {
        // console.log('** image being loaded.. ----->', file)
        let width = 0
        let height = 0
        const reader = new FileReader()
        reader.addEventListener('load', (theFile) => {
          // console.log(theFile)
          let image = new Image()
          image.src = theFile.target.result
          image.onload = function () {
            width = this.width
            height = this.height
          }
          const fileOption = {
            url: '',
            isShow: false,
            width: width,
            height: height,
            loading: true
          }
          if(type!=='sub_img'){
            cb(fileOption)
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
                
                fileOption.url = imageUrl
                fileOption.loading = false
                if(type==='sub_img'){
                  cb(fileOption)
                }
                this.createAvatarLoading = false
              }
            )
          }
        })
        reader.readAsDataURL(file)
      }
    },
    async onUploadSubImgHandler(e) {
      this.createAvatarLoading = true
      this.loadHandler(e.file, (v) => {
        this.subscriptionsInfo.image = v.url
      },'sub_img')
    },
    async onUploadHandler(e) {
      this.loadHandler(e.file, (v) => {
        if (this.fileList.length < 9) {
          this.fileList = this.fileList.concat([v])
        } else {
          this.$message.warning(this.$t('home.max_upload'))
        }
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
    editComment: debounce(function (item, index) {
      item.isEditReply = !item.isEditReply
      this.goDetail(item)
    }, 500),
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
        // console.log('containerScrollHeight==',containerScrollHeight,'containerHeight===',containerHeight,'scrollTop===',scrollTop)
        if(scrollTop >2500){
          self.isBottom = true
        }else {
          self.isBottom = false
        }
        
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
      res.mouseActiveComment = false
      res.mouseActivePraise = false
      res.mouseActiveFavorites = false
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

      return res
    },
    getArticlesByColumn: debounce(async function (v, i, type, loadType) {
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
      // 记录菜单 与文章联动
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
        let tag =''
        if(type === 'all') {
          tag = 'd-onlyfun'
        } else if(type ==='filter'){
          if(this.typeSelectedIndex ===0){
            tag = 's' + MD5(v).substring(0, 10)
          }else {
            tag = 's' + MD5(v).substring(0, 10)+ '_tag' + this.typeSelectedIndex
          }
         
        }else {
          tag = 's' + MD5(v).substring(0, 10)
        }
        const params = {
          id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
          jsonrpc: '2.0',
          method: 'bridge.get_ranked_posts',
          params: {
            limit: 20,
            sort: 'created',
            tag
          }
        }
        if (this.pageListStart.author) {
          params.params.start_author = this.pageListStart.author
          params.params.start_permlink = this.pageListStart.permlink
        }
        const res = await getArticles(params)

        // 处理文章数据
        if (res && res.result) {
          let formatRes = res.result && res.result.concat()
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
            element.showPicker = false
            element.isShowDetailDialog = false
            element.replyLoading = false
            element.isPraised = element.voted
            element.mouseActivePraise = false
            element.mouseActiveComment = false
            element.mouseActiveFavorites = false
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
          // console.log(newRes)
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
    }, 500),
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
        price: price + currency,
        tags: this.tagList
      }
      console.log(params)
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
      console.log(key, keyPath)
    },
    findObjectByPostId(array, postIdToFind, obj) {
      for (let i = 0; i < array.length; i++) {
        const currentObject = array[i]

        if (currentObject.post_id === postIdToFind) {
          currentObject.child.push(obj)
        }

        if (currentObject.child && currentObject.child.length > 0) {
          const foundInChild = this.findObjectByPostId(
            currentObject.child,
            postIdToFind
          )
          if (foundInChild) {
            return foundInChild
          }
        }
      }

      return null
    },
    async submitReply(v, detail, type) {
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
      this.$loading.show()

      const res = await post({
        type: 'comment',
        id: loginType === 'eth' ? userInfo.eth_account : userInfo.user,
        token: getToken(),
        subscriptions_name: body.subscriptions_name,
        permlink: [v.author, v.permlink],
        title: '',
        body: type === 'ownReply' ? this.textareaConetent : v.reply
      })
      this.$loading.hide()
      if (res && res.success === 'ok') {
        this.$message.success(this.$t('home.reply_success'))
        if (type === 'ownReply') {
          if(v.currentDetail){
            v.currentDetail.commentList.unshift({
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
          let commentList = v.currentDetail.commentList
          this.$set(v.currentDetail, 'commentList', commentList)
          this.textareaConetent = ''
          v.showPicker = false
          }else {
            this.$message.error(this.$t('home.edit_comment_tip'))
          }

        } else if (type === 'articleReply') {
          v.isEditReply = false
        } else {
          // this.findObjectByPostId(detail.commentList, v.post_id,{
          //   author: res.data.author,
          //   permlink: res.data.permlink,
          //   body: Object.assign({}, body, {
          //     body: v.reply,
          //     avatar: this.userAvatar,
          //     author: this.userInfo.user_name,
          //     created: res.result.created
          //   }),
          //   parent_author: parent_author,
          //   parent_permlink: parent_permlink,
          //   created,
          //   reply: v.reply,
          //   child: []
          // })
          // console.log(detail.commentList)
          // this.$set(detail,'commentList',detail.commentList)
          v.child.unshift({
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
          let arr = v.child
          v.child = arr
          this.$set(v, 'child', arr)
        }
      } else {
        this.$message.error(this.$t('home.post_fail_tip'))
        this.closeEditor()
      }

    },

    postArticle() {
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
    submit: debounce(async function () {
      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')

      let imgHtml = ''
      if (this.fileList.length === 1) {
        imgHtml = `<img src="${this.fileList[0].url}" preview=${
          this.fileList[0].url
        } width="300px" height="${
          (300 / this.fileList[0].width) * this.fileList[0].height
        }" style="cursor:pointer;" alt="" />`
      } else {
        this.fileList.forEach((item, i) => {
          imgHtml += `<img src="${item.url}" preview=${this.fileList[0].url} style="object-fit:cover;background:#f5f6f7;margin-left:5px;margin-bottom:5px;cursor:pointer;" class="img-container" width="150px" height="150px" alt="" />`
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

      this.$loading.show()
      const tag = this.ArticleTypeSelected
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
        body: this.$refs.short_post.postText + imgHtml,
        [tag !=='' && 'tag' ]:tag
      })

      if (res && res.success === 'ok') {
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
        res.result.mouseActivePraise = false
        res.result.mouseActiveComment = false
        res.result.mouseActiveFavorites = false
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

        
        this.articleList.unshift(res.result)
        console.log(res)
        this.goDetail(
                {
                  author:res.result.author,
                  permlink:res.result.permlink
                }
              )
      } else {
        this.$message.error(this.$t('home.post_fail_tip'))
        this.closeEditor()
      }
      this.$refs.short_post.textLength = 0
      this.$loading.hide()
      // window.location.reload()
    }, 500),
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

      const userInfo = this.userInfo
      const loginType = localStorage.getItem('login-type')
      const token = getToken()
      val.replyLoading = true
      const res = await getArticleDetail({
        id: loginType === 'password' ? userInfo.user : userInfo.eth_account,
        jsonrpc: '2.0',
        method: 'bridge.get_discussion',
        params: { author: val.author, permlink: val.permlink }
      })

      val.replyLoading = false
      const obj = res.result[val.author + '/' + val.permlink]
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
        comment.reply = ''
        comment.child = []
      })
      commentList = commentList.reverse()
      const commentTree = this.buildTreeWithCycle(commentList, val.author)
      // console.log(commentTree)
      if (obj) {
        obj.body = this.eval(obj.body)

        obj.commentList = commentTree
        val.currentDetail = obj
      }
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
    },
    fileList: {
      handler(newVal, oldVal) {
        if (this.$refs.operation_icon) {
          const operation_icon = this.$refs.operation_icon
          const biaoqing = this.$refs.short_post.$refs.biaoqing
          const ql_toolbar = document.querySelector('.short_post .ql-toolbar')
          const middle = document.querySelector('.upload-container .middle')
          const right = document.querySelector('.upload-container .right')
          const my_picker = document.querySelector('.short_post .my-picker')
          if (newVal.length === 0) {
            operation_icon.style.height = '50px'
            biaoqing.style.bottom = '-110px'
            ql_toolbar.style.bottom = '-120px'
            middle.style.top = '10px'
            right.style.top = '10px'
            my_picker.style.top = '205px'
          } else if (newVal.length <= 3) {
            operation_icon.style.height = '130px'
            biaoqing.style.bottom = '-190px'
            ql_toolbar.style.bottom = '-200px'
            middle.style.top = '110px'
            right.style.top = '110px'
            my_picker.style.top = '285px'
          } else if (newVal.length <= 6) {
            operation_icon.style.height = '210px'
            biaoqing.style.bottom = '-270px'
            ql_toolbar.style.bottom = '-280px'
            middle.style.top = '190px'
            right.style.top = '190px'
            my_picker.style.top = '365px'
          } else if (newVal.length <= 9) {
            operation_icon.style.height = '310px'
            biaoqing.style.bottom = '-370px'
            ql_toolbar.style.bottom = '-380px'
            middle.style.top = '280px'
            right.style.top = '280px'
            my_picker.style.top = '445px'
          }
        }
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
    margin-left: 120px !important;
    margin: 10px 300px 0 0;
  }
  .write_container {
    margin-left: 10px !important;
  }
   .rule {
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
::v-deep .author-column-special .el-loading-spinner {
  top: 20px;
}
::v-deep .author-column-special .el-loading-spinner .circular {
  width: 20px;
  height: 20px;
}
::v-deep .el-carousel--horizontal {
  border-radius: 20px;
}
::v-deep .el-menu {
  border-right: none;
}
::v-deep .el-button--primary.is-plain {
  color: #fff;
  background: #ffbf6b;
  border: none;
}
::v-deep .el-button--primary.is-plain:focus,
.el-button--primary.is-plain:hover {
  color: #fff;
}
.picker_container {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  .my-picker {
    position: absolute;
    left: 0;
    top: 40px;
    z-index: 999;
  }
}
.suply_btn {
  width: 100px;
  height: 30px;
}
.suply_btn:hover {
  background-color: #f57f59;
}
.main-content-container {
  .swiper {
    // position: fixed;
    width: 100%;
    max-width: 1250px;
    z-index: 800;
    height: 100px;
    margin-top: 5px;
  }
}
.scale {
  transform: scale(1.2);
}
.rotate {
  transform: rotate(-10deg);
}

.tab {
  padding: 170px 20px 0;
}
.deleteColor {
  color: #f57f59;
}
.write_container {
  margin-left: 110px;
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
  background-color: $bgcolor;
}
.menu-style * {
  vertical-align: middle;
}
.activeText {
  color: rgb(79, 189, 212);
  background-color: #ecf5ff;
}
.square-title {
  font-size: 20px;
  font-weight: bold;
  // text-align: center;
  padding: 10px 10px;
}
.short-square {
  padding-left: 10px;
  position: relative;
  color: #000;
  .talk-content-container {
    padding: 10px;
  }
  .author {
    img {
    }
    .info {
      .owner {
        font-size: 14px;
        font-weight: bolder;
      }
      &:hover {
        color: $menuTextColor;
      }
      .date {
        margin: 0;
      }
    }
  }
}
  .rule {
    display: flex;
    margin-top: 40px;
    color: $menuTextColor;
    font-size: 14px;
    .rule_item{
      margin-bottom: 5px;

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
.tag_tips {
  margin-top: 40px;
  margin-bottom: 10px;
}
.avatar-uploader {
  width: 120px;
  height: 120px;
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
  font-size: 24px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar-img {
  width: 120px;
  height: 120px;
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
::v-deep .el-submenu .el-menu-item:hover {
  background-color: $bgcolor;
}
::v-deep .el-submenu__title:hover {
  background-color: $bgcolor;
}

.recommend_container {
  margin-left: 980px;
  position: fixed;
  top: 95px;
}
.recommend_wrapper {
  min-height: calc(100vh - 110px);
  background-color: $whiteBgColor;
  margin-left: 20px;
  width: 250px;
  position: relative;
  border-radius: 10px;
  &:hover {
    box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.1);
  }
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
      font-size: 14px;
      font-weight: bold;
      width: auto;
      display: inline-block;
      margin-left: 10px;
      background-color: #ffbf6b;
      color: #000;
      text-align: center;
      height: 26px;
      line-height: 26px;
      border-radius: 10px;
      width: 160px;
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
  position: fixed;
  top: 290px;
}
.nav_container:hover {
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
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
  background-color: $whiteBgColor;
  width: 100%;
  border-radius: 20px;
  min-width: 190px;
  padding: 0 1px;
  /* display: flex;
  justify-content: center; */
  .nav_menu {
    width: 190px;
    background: $whiteBgColor;
    height: calc(100vh - 110px);
    border-radius: 10px;
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
  margin-left: 10px;
}
.sub_price {
  display: flex;
}
::v-deep .el-loading-spinner i {
  color: $mainColor;
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
.comment-index {
  padding-bottom: 10px;
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
  color: #fff;
}
.reply {
  cursor: pointer;
}
::v-deep .reply_input {
  width: calc(100% - 76px);
  padding-left: 30px;
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
  color: $menuTextColor;
  text-align: center;
  margin-bottom: 10px;
  cursor: pointer;
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
.follow {
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30px;
}
.follow span {
  background-color: #ff8200;
  display: inline-block;
  text-align: center;
  width: 80px;
  height: 30px;
  line-height: 30px;
  border-radius: 20px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}
.follow span:hover {
  background-color: #ff5900;
}
.author-column-special-text {
  color: #4fbdd4;
  cursor: pointer;
}
.operation-icon {
  display: flex;
  align-items: center;
  justify-content: center;
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
    .vote-num {
      display: inline-block;
      margin-left: 5px;
      color: #fda956;
    }
  }
}

.main-content-container {
  max-width: 1250px;
  margin: auto;
  height: 100%;
  margin-top: 20px;
}
.mid_container {
  // padding-top: 30px;
  // width: 100% !important;
}
.mid_wrapper {
  min-width: 750px;
  margin-left: 100px;
  margin-left: 220px !important;
  margin: 10px 300px 0 0;
  // padding-top: 140px;
}
.backtop:hover {
    background-color: #f2f6fc;
}
.backtop {
    position: fixed;
    background-color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: $fillBlueColor;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 6px rgba(0,0,0,.12);
    cursor: pointer;
    z-index: 5;
}
.post-container {
  margin-top: 10px;
  margin-bottom: 5px;
  background-color: $whiteBgColor;
  border-radius: 20px;
  padding-top: 20px;
  z-index: 10;
}
.post-container:hover {
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.1);
}

.article_class{
  position: relative;
  width: calc(100% - 20px) ;
  height: 44px;
  margin: 10px 0;
  background-color: $whiteBgColor;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 2px 10px;
  justify-content: flex-start;
  flex-wrap:wrap;
  font-size: 14px;
  .active{
    color:  #fff;
    background: #3B4159 !important;
    border-color:#3b4159 !important;
  }
  .article_type_item{
    width: auto;
    max-width: 120px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    padding: 0 10px;
    border-radius: 5px;
    background-color: #F8F9FA;
    margin-right: 5px;
    border: 1px solid #F8F9FA;
    cursor: pointer;
    transition: all 0s ease-in;
    &:hover{
      background-color: rgba(80,166,192,0.1);
      border-color: $menuTextColor;
      color: $menuTextColor;
    }
  }
  .go_column{
    font-size: 20px;
    color: $iconColor;
    position: absolute;
    right: 20px;
    top: calc(50% - 12px);
    cursor: pointer;
  }
}
// .article_class:hover {
//   box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.1);
// }
.article_list {
}
.post-topic-head {
  display: flex;
  align-items: center;
  margin: 0 20px;
  padding: 20px;
  cursor: pointer;
  border-radius: 4px;
  background: $inputBgColor;
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
  height: 80px;
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
.button-new-tag {
  margin-left: 10px;
  height: 26px;
  line-height: 26px;
  padding-top: 0;
  padding-bottom: 0;
  border-radius: 20px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.tag {
  margin-left: 10px;
  height: 26px;
  line-height: 26px;
  padding-top: 0;
  padding-bottom: 0;
  border-radius: 20px;
}
.post-action {
  display: flex;
  align-items: center;
}
.post-article {
  display: inline-block;
  margin-left: 16px;
  padding: 0 10px;
  height: 30px;
  min-width: 80px;
  line-height: 30px;
  text-align: center;
  transition: all 0.2s ease-in;
  position: relative;
  overflow: hidden;
  z-index: 1;
  color: #090909;
  // padding: 0.7em 1.7em;
  font-size: 14px;
  font-weight: bold;
  border-radius: 0.5em;
  background: #e8e8e8;
  border: 1px solid #e8e8e8;
  box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
}
.post-article:active {
  color: #666;
  box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
}

.post-article:before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%) scaleY(1) scaleX(1.25);
  top: 100%;
  width: 140%;
  height: 180%;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  display: block;
  transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
  z-index: -1;
}

.post-article:after {
  content: '';
  position: absolute;
  left: 55%;
  transform: translateX(-50%) scaleY(1) scaleX(1.45);
  top: 180%;
  width: 160%;
  height: 190%;
  background-color: $mainColor;
  border-radius: 50%;
  display: block;
  transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
  z-index: -1;
}

.post-article:hover {
  color: #ffffff;
  border: 1px solid $mainColor;
}

.post-article:hover:before {
  top: -35%;
  background-color: $mainColor;
  transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
}

.post-article:hover:after {
  top: -45%;
  background-color: $mainColor;
  transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
}
.remove-article {
  display: inline-block;
  margin-left: 16px;
  padding: 0 10px;
  height: 30px;
  min-width: 80px;
  line-height: 30px;
  text-align: center;
  transition: all 0.2s ease-in;
  position: relative;
  overflow: hidden;
  z-index: 1;
  color: #090909;
  // padding: 0.7em 1.7em;
  font-size: 14px;
  font-weight: bold;
  border-radius: 0.5em;
  background: #e8e8e8;
  border: 1px solid #e8e8e8;
  box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
}
.text-range {
  font-size: 12px;
  color: grey;
  height: 24px;
  line-height: 24px;
  text-align: right;
}
.remove-article:active {
  color: #666;
  box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
}

.remove-article:before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%) scaleY(1) scaleX(1.25);
  top: 100%;
  width: 140%;
  height: 180%;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  display: block;
  transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
  z-index: -1;
}

.remove-article:after {
  content: '';
  position: absolute;
  left: 55%;
  transform: translateX(-50%) scaleY(1) scaleX(1.45);
  top: 180%;
  width: 160%;
  height: 190%;
  background-color: $mainColor;
  border-radius: 50%;
  display: block;
  transition: all 0.5s 0.1s cubic-bezier(0.55, 0, 0.1, 1);
  z-index: -1;
}

.remove-article:hover {
  color: #ffffff;
  border: 1px solid $mainColor;
}

.remove-article:hover:before {
  top: -35%;
  background-color: $mainColor;
  transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
}

.remove-article:hover:after {
  top: -45%;
  background-color: $mainColor;
  transform: translateX(-50%) scaleY(1.3) scaleX(0.8);
}

.topic-container {
  margin-top: 10px;
  background: $whiteBgColor;
  // background: #fff;
  margin-bottom: 10px;
  border-radius: 10px;
}
.topic-container:hover {
  box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.1);
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
  font-weight: bolder;
}

.owner:hover {
  color: $menuTextColor;
}
.info .date {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: $textColor;
  margin-top: 5px;
}
.openOrFold {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  text-align: center;
  height: 24px;
  padding-top: 50px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  background-image: linear-gradient(
    -180deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 100%
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
  padding-left: 20px;
  padding-right: 10px;
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
  height: 30px;
  margin-right: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.steemLink {
  color: $textColor;
  font-size: 12px;
  position: absolute;
  right: 10px;
}
.steemLink:hover {
  color: $mainColor;
}
.topic-container .operation-icon-container .details-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.topic-container .operation-icon-container .details-container .text {
  font-size: 12px;
  color: $textColor;
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
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 10px;
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
    width: 50%;
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
  right: 0;
  top: calc(50% - 20px);
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
  height: 120px;
}

.upload-container  {
  position: relative;
  margin-top: 40px;
}
.upload-container  .operation-icon {
  height: 50px;
}
.select_article_type{
  width: 100px;
  position: absolute;
  right: 10px;
  top: calc(50% - 17px);
}
::v-deep .select_article_type .el-input__inner{
  border: none;
}
.create-topic-container .create-topic-panel .operation-icon {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  -webkit-user-select: none;
  user-select: none;
}
.create-topic-container .create-topic-panel .operation-icon .left {
  display: flex;
  align-items: center;
  position: relative;
  flex-flow: row wrap;
  max-width: 300px;
  .picture-list {
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 15px;
    margin-left: 10px;
    margin-bottom: 10px;
    .delete-pic {
      width: 16px;
      height: 16px;
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      top: 2px;
      right: 2px;
      text-align: center;
      z-index: 2001;
      &:hover {
        color: #4fbdd4;
        background: rgba(79, 189, 212, 0.1);
        /* background: rgba(255,130,0,.1); */
      }
    }

    img {
      width: 80px;
      height: 80px;
      border-radius: 15px;
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
  right: 60px;
  top: 30px;
}
.icon-biaoqing{
  cursor: pointer;
}
.icon-biaoqing svg{
  fill:$iconColor;
}
.icon-biaoqing svg:hover{
  fill:$iconActiveColor;
}
::v-deep .middle .el-input input {
  height: 30px;
  width: 80px;
  border: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.create-topic-container .create-topic-panel .operation-icon .right .submit-btn {
  min-width: 60px;
  height: 30px;
  padding: 0 6px;
  box-sizing: border-box;
  line-height: 30px;
  text-align: center;
  background: $mainColor;
  box-shadow: 0 1px 2px #0000000d;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: $menuTextColor;
  }
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

.like_animation {
  animation: like_401 400ms ease;
}
@keyframes like_401 {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
