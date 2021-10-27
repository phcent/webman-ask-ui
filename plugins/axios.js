import qs from "qs";
import {Notification,Message } from "element-ui";
export default function ({store,req, redirect, app: { $axios }})  {
  $axios.onError(error => {

  })
  $axios.interceptors.request.use(
    data => {
      if (data.method === 'post' || data.method === 'put' || data.method === 'patch') {
        data.data = qs.stringify(data.data);
      }else{
      }
      data.headers['SiteId'] = 1;
      data.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
      return data;
    },
    error => {
      return Promise.reject(error);
    }
  );
  // response拦截器，数据返回后，你可以先在这里进行一个简单的判断
  $axios.interceptors.response.use(response => {
    const code = parseInt(response && response.data.code);
    if(code !== 200){
      Message.error(response.data.msg);
      return Promise.reject(response);
    }
    return response.data;
  },error => {
    if (!error.response) {
      // 请求超时状态
      if (error.message.includes('timeout')) {
        console.log('超时了');
        Message.error('请求超时，请检查网络是否连接正常');
      } else {
        // 可以展示断网组件
        console.log('断网了');
        Message.error('请求失败，请检查网络是否已连接');
      }
    }
    const code = parseInt(error.response && error.response.status)

    if(code === 422){
      const backData = error.response.data;
      let indexi = 1;
      for (let key in backData){
        setTimeout(
          function (){
            Notification({
              title: '操作提示',
              message: backData[key][0],
              type: 'warning',
            })
          }
          , indexi * 10);
        indexi++;
      }
    }else if(code === 402){
      // store.commit('SET_STORE',  {name:'vuex_token',value:''});
      // store.commit('SET_STORE',  {name:'vuex_user',value:{}});
    }

    return Promise.reject(error.response);
  })
}
