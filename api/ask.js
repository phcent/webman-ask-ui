import * as config from '@/config'
const baseUrl = config.API_ROOT;

/****************/
export const urlWebAskIndex = baseUrl + '/api/v1/web/index';
// 前台问题
/*
/index 问题首页列表get
/show/{id} 问题详情get
/create 新增问题get,post
/update/{id} 修改问题get,put
/destroy/{id} 删除问题delete
/close/{id} 关闭问题delete
/open/{id} 打开问题post
/config/{id} 问题设置 post 传参style,hot_sort,top_sort
/my/{id} 个人主页我的提问列表get
* */
export const urlWebAskQuestion = baseUrl + '/api/v1/web/question';

export const urlUserAskQuestion = baseUrl + '/api/v1/web/user/question';
// 发布回答 post 传参content，question_id
// /index/{id} 获取问题回答列表 order(default,date)排序
// /show/{id} 获取回答评论列表 order(default,date)排序
// /adopt 采纳最佳答案 post 传参 question_id,answer_id
export const urlWebAskAnswer = baseUrl + '/api/v1/web/answer';


/*
/index 文章首页列表get
/show/{id} 文章详情get
/create 新增文章get,post
/update/{id} 修改文章get,put
/destroy/{id} 删除文章delete
/config/{id} 问题设置 post 传参style,hot_sort,top_sort
/my/{id} 个人主页我的文章列表get
* */
export const urlWebAskArticle = baseUrl + '/api/v1/web/article';
export const urlUserAskArticle = baseUrl + '/api/v1/web/user/article';

// /create回复/评论 post 传参content，theme_id,type(1回答 2文章),reply_user_id
// 获取文章评论列表 /index/{id} order(new,hot)排序
export const urlUserAskReply = baseUrl + '/api/v1/web/reply';
// 专家
export const urlUserAskExperts = baseUrl + '/api/v1/web/experts';
// 话题 /index  话题列表 /show/{id}  话题详情 /list/{id}  话题数据 type(question,article)
export const urlUserAskTags = baseUrl + '/api/v1/web/tags';


//用户卡片
export const urlWebAskCard = baseUrl + '/api/v1/web/ajax/card';
//查询标签
export const urlWebAskTags = baseUrl + '/api/v1/web/ajax/tags';
//查询用户
export const urlWebAskUser = baseUrl + '/api/v1/web/ajax/user';
//关注 post,delete 传参theme_id ,type(user,question
export const urlWebAskFollow = baseUrl + '/api/v1/web/ajax/follow';
//顶踩操作 post新操作 delete 是取消  传参theme_id 项目编号；conduct ('up','down')行为； type(1,2,3,4) 类型 1是问题 2是文章 3是回答 4是评论
export const urlWebAskDigg = baseUrl + '/api/v1/web/ajax/digg';
// 收藏 post,delete 传参theme_id ,type(1问题 2文章 3回答)
export const urlWebAskCollection = baseUrl + '/api/v1/web/ajax/collection';
// 签到
export const urlWebAskSignin = baseUrl + '/api/v1/web/ajax/signin';



// /{id} 我的主页 我的关注列表 get  type(user,question)
export const urlUserAskFollow = baseUrl + '/api/v1/web/user/follow';
// /{id} 我的主页 我的动态列表
export const urlUserAskIndex = baseUrl + '/api/v1/web/user/index';
// /{id} 我的主页 我的粉丝列表
export const urlUserAskFans = baseUrl + '/api/v1/web/user/fans';
// /{id} 我的主页 我的回答
export const urlUserAskAnswer = baseUrl + '/api/v1/web/user/answer';
