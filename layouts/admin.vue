<template>
  <div>
    <div class="phcent-admin-header">

    </div>
    <div class="phcent-admin-body">
      <div class="phcent-admin-body-nav">
        <div class="">

        </div>
        <phcent-user-menu/>
      </div>
      <div class="phcent-admin-body-content">
        <nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import PhcentUserMenu from '~/components/layout/PhcentUserMenu'
export default {
  name: "admin",
  components: { PhcentUserMenu },
  data(){
    return {
      categoryList:[]
    }
  }

}
</script>

<style scoped lang="scss">
.phcent-admin-header{
  height: 2rem;
}
.phcent-admin-body{
  position: relative;
  height: calc(100vh - 2rem);
  display: flex;
  &-nav{
    width: 240px;
    background-color: #fff;
    height: 100%;
    overflow-y: auto;
  }
  &-content{
    width: calc(100% - 240px);
    position: relative;
    padding: 0.5rem;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
