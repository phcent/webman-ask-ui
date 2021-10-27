import * as config from '@/config'
const baseUrl = config.API_ROOT;

//分类管理
/**
 *
 * get  获取列表
 * /create get/post  新增分类
 * /update/{id} get/put  编辑分类
 * /{id} delete  删除分类
 */
export const urlAdminAskCategory = baseUrl + '/api/v1/admin/category';

/*
* 常用接口拼接 *
/index  get 列表数据  回收站列表数据带参 dataRecovery
/create  新增数据 get为获取新增数据所需 post为提交数据
/update/{id}  修改数据 get为获取修改数据信息 put为保存数据
/destroy/{id}  删除数据 通常可传ID单数字或1,2,3分隔数字 delete
/recovery/{id}  通常可传ID单数字或1,2,3分隔数字 delete为删除回收站内容  put为还原回收站数据
* */

// 回答管理
export const urlAdminAskAnswer = baseUrl + '/api/v1/admin/answer';
// 问题管理
export const urlAdminAskQuestion = baseUrl + '/api/v1/admin/question';//
// 文章管理
export const urlAdminAskArticle = baseUrl + '/api/v1/admin/article';//
// 评论管理
export const urlAdminAskReply = baseUrl + '/api/v1/admin/reply';//
// 动态管理
export const urlAdminAskDynamic = baseUrl + '/api/v1/admin/dynamic';
// 消息管理
export const urlAdminAskMessage = baseUrl + '/api/v1/admin/message';
// 通知管理
export const urlAdminAskNotice = baseUrl + '/api/v1/admin/notice';
// 举报管理
export const urlAdminAskReport = baseUrl + '/api/v1/admin/report';
// 标签管理
export const urlAdminAskTags = baseUrl + '/api/v1/admin/tags';
// 问答会员管理
export const urlAdminAskUser = baseUrl + '/api/v1/admin/user';
// 签到日志管理
export const urlAdminAskSignin = baseUrl + '/api/v1/admin/signin';
// 问答会员等级管理
export const urlAdminAskGrade = baseUrl + '/api/v1/admin/grade';
// 付费订单管理
export const urlAdminAskOrder = baseUrl + '/api/v1/admin/order';
