import * as config from '@/config'
const baseUrl = config.API_ROOT;

// 举报
// /api/v1/user/report/create 新增举报 get获取 post提交  传参type(1,2,3,4,5),theme_id,reason
export const urlUserAskReport = baseUrl + '/api/v1/user/report';
/**** 会员中心 ****/
//提现日志
  // /create 申请提现get,post  ('amount','bank_name',  'bank_user', 'bank_account')
export const urlUserAskCash = baseUrl + '/api/v1/user/cash';

//  我的主页 我的收藏列表 get  type区分
export const urlUserAskCollection = baseUrl + '/api/v1/user/collection';

// 我的积分日志
export const urlUserAskPoints = baseUrl + '/api/v1/user/points/log';
// 我的私信/index 列表 get /read/{id} 设为已读 post id为0时为全部设为已读
// /create 发送私信 post 传参content,to_user_id /destroy/{id} 删除私信
export const urlUserAskMessage = baseUrl + '/api/v1/user/message';
// 我的通知 /index 列表 get /read/{id} 设为已读 post id为0时为全部设为已读 /destroy/{id} 删除通知
export const urlUserAskNotice = baseUrl + '/api/v1/user/notice';
// 个人资料get获取 post提交（name，nick_name，description）
export const urlUserAskInfoProfile = baseUrl + '/api/v1/user/info/profile';
//  修改密码 post old_password，password，password_confirmation
export const urlUserAskInfoPwd = baseUrl + '/api/v1/user/info/pwd';
//  签到 /index 列表 /create 签到 post
export const urlUserAskSignin = baseUrl + '/api/v1/user/signin';
