import * as config from './config';
export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '象讯科技[官网]',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:site_name',hid: 'og:site_name',name: 'og:site_name',content: '象讯科技[官网]'},
      { property: 'og:title',hid: 'og:title',name: 'og:title',content: '象讯科技[官网]'},
      { property: 'og:description',hid: 'og:description',name: 'og:description',content: '象讯科技-商城系统开发，erp系统开发，软件定制.象讯官方热线400-8298-669'},
      { hid: 'description', name: 'description', content: '象讯科技-商城系统开发，erp系统开发，软件定制.象讯官方热线400-8298-669.' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  styleResources: {
    scss: "@/assets/css/variable.scss"
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'remixicon/fonts/remixicon.css',
    '@/assets/css/phcent.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src:'@/plugins/element-ui',ssr:true },
    { src:'@/plugins/axios',ssr:true },
    { src:'@/plugins/swipe',ssr:false },
    { src:'@/plugins/wangEditor',ssr:false },
    { src: '@/plugins/vue-mavon-editor', ssr: false },
    { src:'@/plugins/vue-inject',ssr:false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/svg',

  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/auth-next',
    '@nuxtjs/style-resources'
  ],
  // styleResources: {
  //   scss: "./assets/css/variable.scss"
  // },
  server: {
    port: 3033, // default: 3000
    host: '0.0.0.0', // default: localhost,
    timing: false
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true, // 表示开启代理
    // prefix: '/dev', // 表示给请求url加个前缀 /api
    proxyHeaders: false,
    credentials: false // 表示跨域请求时是否需要使用凭证
  },
  proxy: {
    '/dev': {
      target: 'http://192.168.2.36:8787',
      pathRewrite: { '^/dev': '' }
    },
    // '/api': {
    //   target: 'http://192.168.2.218:86/', // 目标接口域名
    //   changeOrigin: true, // 表示是否跨域
    //   pathRewrite: {
    //     '^/api': '', // 把 /api 替换成‘’
    //   }
    // }
  },
  auth:{
    strategies: {
      'laravelJWT': {
        provider: 'laravel/jwt',
        url: config.API_ROOT,
        endpoints: {
          login: { url: '/api/v1/web/auth/login', method: 'post' },
          refresh: { url: '/api/v1/web/auth/refresh', method: 'post' },
          user: { url: '/api/v1/web/auth/me', method: 'get' },
          logout: { url: '/api/v1/web/auth/logout', method: 'post' }
        },
        token: {
          property: 'access_token',
          maxAge: 60 * 60
        },
        refreshToken: {
          maxAge: 20160 * 60
        },
      },
    }
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    cache: true,
    parallel: true,
    babel:{
      plugins: [
        [ "component", {"libraryName": "element-ui",  "styleLibraryName": "theme-chalk"}]
      ]
    }
    // transpile: [/^element-ui/]
  }
}
