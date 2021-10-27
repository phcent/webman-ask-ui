import * as config from '@/config'
const baseUrl = config.API_ROOT;

// /(index,create,update,destroy) cms管理-文章管理 cate文章分类
export const urlExtendCmsArticle = baseUrl + '/api/extend/cms/admin/article';
// /(index,create,update,destroy) cms管理-分类管理
export const urlExtendCmsCategory = baseUrl + '/api/extend/cms/admin/category';
// /(index,create,update,destroy) cms管理-案例管理
export const urlExtendCmsCase = baseUrl + '/api/extend/cms/admin/case';
// /(index,create,update,destroy) cms管理-经销商管理
export const urlExtendCmsSeller = baseUrl + '/api/extend/cms/admin/seller';

// /(index,create,update,destroy) cms管理-文档管理
// /(cateList,cateCreate,cateUpdate,cateDestroy) cms管理-文档管理-文档分类
// /(copy,copyAll) cms管理-文档管理-复制文档 post
// /(oldList（id）,oldDestroy) cms管理-文档管理-文档历史记录
// /oldRecovery/{id} cms管理-文档管理-文档历史记录恢复
// /recovery/{id} cms管理-文档管理-回收站  delete为清除 id为0时为清除全部  put为还原
export const urlExtendCmsWiki = baseUrl + '/api/extend/cms/admin/wiki';
