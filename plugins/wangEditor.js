import Vue from 'vue';
import wangEditor from 'wangeditor';

Vue.prototype.$wangEditor = content =>{
  return new wangEditor(content);
}
