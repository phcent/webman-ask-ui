<template>
  <div>
    <div class="phcent-ask-header phcent-ask-box">
      <div class="wrapper flex">
        <div class="phcent-ask-header--logo">
          <phcent-svg name="phcent-logo" size="4rem" />
        </div>
        <div class="nav-list">
            <nuxt-link class="nav-list-item" to="/">首页</nuxt-link>
            <nuxt-link class="nav-list-item" to="/question">问答</nuxt-link>
            <nuxt-link class="nav-list-item" to="/article">文章</nuxt-link>
            <nuxt-link class="nav-list-item" to="/tags">话题</nuxt-link>
            <nuxt-link class="nav-list-item" to="/expert">专家</nuxt-link>
        </div>
        <div class="phcent-ask-header-search">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="searchWord"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容" @focus="inputWidth = '100%'" @blur="inputWidth = 'auto'"
            @select="handleSelect" :style="{'width': inputWidth,'transition':'width 2s ease-in-out'}">
            <i class="el-input__icon ri-search-2-line m-t-0" slot="prefix"></i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.title }}</div>
              <span class="addr">{{ item.address }}</span>
            </template>
          </el-autocomplete>
        </div>
        <div class="nav-list">
            <el-dropdown>
              <nuxt-link class="nav-list-item" to=""><i class="ri-notification-3-line"></i></nuxt-link>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>您有 <el-badge type="success" :value="12" /> 个问题待采纳</el-dropdown-item>
                <el-dropdown-item>您有 <el-badge type="error" :value="12" /> 条私信待阅读</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          <el-dropdown v-if="$auth.loggedIn">
            <nuxt-link class="nav-list-item" to="/user">会员中心</nuxt-link>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><nuxt-link to="/user">
                <i class="ri-user-3-fill phcent-icon"></i>个人中心</nuxt-link></el-dropdown-item>
              <el-dropdown-item><nuxt-link :to="{name:'u-id',params:{id:$auth.user.id}}">
                <i class="ri-home-4-fill phcent-icon"></i>我的主页</nuxt-link></el-dropdown-item>
              <el-dropdown-item><nuxt-link :to="{name:'u-id-question',params:{id:$auth.user.id}}">
                <i class="ri-question-fill phcent-icon"></i>我的问题</nuxt-link></el-dropdown-item>
              <el-dropdown-item><nuxt-link :to="{name:'u-id-article',params:{id:$auth.user.id}}">
                <i class="ri-file-text-fill phcent-icon"></i>我的文章</nuxt-link></el-dropdown-item>
              <el-dropdown-item><nuxt-link :to="{name:'user-collection'}">
                <i class="ri-bookmark-fill phcent-icon"></i>我的收藏</nuxt-link></el-dropdown-item>
              <el-dropdown-item><nuxt-link to="">
                <i class="ri-logout-box-r-fill phcent-icon"></i>退出</nuxt-link></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

            <el-dropdown v-else>
              <nuxt-link class="nav-list-item" to="/auth/login">会员中心</nuxt-link>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><nuxt-link to="/auth/login"><i class="ri-login-circle-line phcent-icon"></i>登录</nuxt-link></el-dropdown-item>
                <el-dropdown-item><nuxt-link to="/auth/register"><i class="ri-registered-line phcent-icon"></i>注册</nuxt-link></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
      </div>

    </div>
    <div class="phcent-ask-main">
      <nuxt/>
    </div>
    <easy-footer />
  </div>
</template>

<script>
import PhcentSvg from "~/components/PhcentSvg";
import EasyFooter from "~/components/layout/EasyFooter";
export default {
  name: "ask",
  components: {EasyFooter, PhcentSvg},
  data() {
    return {
      restaurants: [],
      searchWord: '',
      inputWidth:'auto'
    };
  },
  methods:{
    querySearch(queryString, cb) {
      var restaurants = this.loadAll();
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadAll() {
      return [
        { "title": "这是一个文章", "author": "象讯-校长","type":"article","id":"1" },
      ];
    },
    handleSelect(item) {
      console.log(item);
    },
  }
}
</script>
<style lang="scss" scoped>
::v-deep .phcent-ask-footer{
  position: relative;
}
</style>
