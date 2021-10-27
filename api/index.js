import * as config from '@/config'
const baseUrl = config.API_ROOT;

export const urlGetSmsCode = baseUrl + '/api/v1/web/auth/code'; // 获取注册1 登入2 找回密码3 验证码
export const urlPostReg = baseUrl + '/api/v1/web/auth/reg'; // 注册
export const urlPostForget = baseUrl + '/api/v1/web/auth/forget'; //找回密码

export const urlAdminSystemArticle = baseUrl + '/api/v0/admin/article'; // 系统管理-文章管理

export const urlUpload = '';

//会员中心
