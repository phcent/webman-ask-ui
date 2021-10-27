<template>
  <div class="wrapper user-page">
    <div class="user-page-left">
      <user-left-nav></user-left-nav>
    </div>
    <div class="user-page-right">
      <div class="blog-page-left-tabs">
        <div class="blog-page-left-tabs-item tabs-on">
          <nuxt-link to="" class="item-a">
            邀请我回答的
          </nuxt-link>
        </div>
        <el-button type="primary" class="add-question" size="small">
          全部标为已读</el-button>
      </div>
      <el-card class="p-l-20 p-r-20">
        <ul class="homepage-list">
          <li v-for="item in 10" class="homepage-list-item flex">
            <author-card>
              <nuxt-link to="">
                <el-avatar :size="50"/>
              </nuxt-link>
            </author-card>
            <div class="flex-1 m-l-10">
              <div>
                <nuxt-link  to="" class="author-name">昵称</nuxt-link>
                <span class="color-info">邀请于</span>
                <span class="color-info m-t-10">四天前</span>

                <div class="float-right">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="与提问者是否采纳无关，回答后即可获赏金￥1.00元"
                    placement="top"
                  >
                    <el-button type="danger" size="mini">赏金:1.00元</el-button>
                  </el-tooltip>
                  <el-button type="primary" size="mini">去回答</el-button>
                  <el-button type="danger" size="mini">删除</el-button>
                </div>
              </div>
              <div class="m-t-10">
                的复活节扩大和地方JFK拉黑就很大了的空间
              </div>
            </div>
          </li>
        </ul>
        <div class="flex flex-col-center m-t-50 m-b-15">
          <el-pagination background
                         @current-change="handleCurrentChange"
                         :current-page = "query.page"
                         :page-size.sync = "query.limit"
                         layout="prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import UserLeftNav from '~/components/ask/UserLeftNav'
import AuthorCard from '~/components/ask/AuthorCard'
export default {
  name: "invite",
  components: { AuthorCard, UserLeftNav },
  layout:"ask",
  head: {
    titleTemplate: '邀请我回答的- 会员中心 - %s',
  },
  data(){
    return{
      total:0,
      query:{
        page:1,
        limit:20,
      },
    }
  },
  methods:{
    handleCurrentChange(val){
      this.$router.push({ query: { page:val } });
    },
  }
}
</script>

<style scoped lang="scss">
.user-page-right{
  .user-card {
    padding: 20px;
  }
}
.homepage{
  background-color: #f8f8f8;
  font-size: 0.35rem;
  &-list{
    &-item{
      border-bottom: 1px dashed #e0e0e0;
      padding: 20px 0 20px;
      .author-name{
        color: #333;
        font-size: 0.4rem;
        &:hover{
          color: $--color-primary;
        }
      }
      .text-muted{
        margin: 10px 0;
        blockquote{
          padding: 8px 17px;
          margin: 0 0 17px;
          font-size: 15px;
          border-left: 5px solid #eeeeee;
          color: $--color-info;
        }
      }
    }
  }
}
</style>

