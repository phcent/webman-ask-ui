<template>
 <div>
   <el-menu  class="el-menu-vertical-demo" router>
     <template v-for="(menu,index1) in menu">
       <el-menu-item  :index="menu.path" v-if="!menu.item || menu.item.length < 1">
         <span slot="title">{{ menu.name }}</span>
       </el-menu-item>
       <el-submenu :index="menu.path" v-else>
         <template slot="title">
           <span>{{ menu.name }}</span>
         </template>
         <template v-for="(menu2,index2) in menu.item">
           <el-menu-item  :index="menu2.path" v-if="!menu2.item || menu2.item.length < 1">
             <span slot="title">{{ menu2.name }}</span>
           </el-menu-item>
           <el-submenu :index="menu2.path" v-else>
             <template slot="title">
               <span>{{ menu2.name }}</span>
             </template>
             <template v-for="(menu3,index3) in menu2.item">
               <el-menu-item  :index="menu3.path">
                 <span slot="title">{{ menu3.name }}</span>
               </el-menu-item>
             </template>
           </el-submenu>
         </template>
       </el-submenu>
     </template>
   </el-menu>
   <div class="p-20"></div>
 </div>
</template>

<script>
export default {
  name: 'PhcentUserMenu',
  data(){
    return {
      menu:[
        { name: '首页',path:'/manage' },
        { name: '系统管理',path:'/manage/system',item:[
            {name: '会员管理',path:'/manage/system/user'},
            {name: '菜单管理',path:'/manage/system/menu'},
            {name: '操作日志',path:'/manage/system/log'},
            {name: '权限组',path:'/manage/system/team'},
            {name: '提现管理',path:'/manage/system/cash'},
            {name: '充值管理',path:'/manage/system/recharge'},
            {name: '积分管理',path:'/manage/system/points'},
          ]
        },
        { name:'CMS管理', path:'/manage/cms', item:[
            {name: '文章管理',path:'/manage/cms/article'},
            {name: '案例管理',path:'/manage/cms/case'},
            {name: '分类管理',path:'/manage/cms/category'},
            {name: '供应商管理',path:'/manage/cms/seller'},
            {name: '文档管理',path:'/manage/cms/wiki'}
          ]
        },
        { name: '社区管理',path:'/manage/ask',item:[
            {name: '系统设置',path:'/manage/ask/setting'},
            {name: '回答管理',path:'/manage/ask/answer'},
            {name: '文章管理',path:'/manage/ask/article'},
            {name: '分类管理',path:'/manage/ask/category'},
            {name: '评论管理',path:'/manage/ask/reply'},
            {name: '动态管理',path:'/manage/ask/dynamic'},
            {name: '消息管理',path:'/manage/ask/message'},
            {name: '通知管理',path:'/manage/ask/notice'},
            {name: '付费订单',path:'/manage/ask/order'},
            {name: '问题管理',path:'/manage/ask/question'},
            {name: '举报管理',path:'/manage/ask/report'},
            {name: '签到管理',path:'/manage/ask/signin'},
            {name: '话题管理',path:'/manage/ask/tags'},
            {name: '感谢管理',path:'/manage/ask/thanks'},
            {name: '会员管理',path:'/manage/ask/user'},
            {name: '会员等级管理',path:'/manage/ask/grade'},
          ]
        },
      ]
    }
  },
  mounted() {
  },
  methods:{

  }
}
</script>
<style scoped lang="scss">
.el-menu-vertical-demo{
  border-right: none;
}
</style>

