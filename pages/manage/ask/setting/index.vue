<template>
  <div>
    <user-page title="系统管理" :show-explain="false" :right-options="false"></user-page>
    <el-tabs
      v-model="editableTabsValue"
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <el-card>
          {{ item.content }}
        </el-card>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import UserPage from '~/components/ask/UserPage'
export default {
  name: 'index',
  components: { UserPage },
  layout: "admin",
  head: {
    titleTemplate: '系统管理 - 管理中心  - %s',
  },
  data(){
    return{
      loading:true,
      editableTabsValue: '2',
      editableTabs: [
        {
          title: '基础设置',
          name: '1',
          content: '基础设置',
        },
        {
          title: '导航设置',
          name: '2',
          content: '导航设置',
        },
        {
          title: '广告设置',
          name: '3',
          content: '广告设置',
        },
      ],
      tabIndex: 2,
    }
  },
  mounted() {
    // this.getList()
  },
  methods:{
    removeTab(){

    }
  }
}
</script>

<style scoped>

</style>
