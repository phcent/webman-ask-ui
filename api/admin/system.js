import * as config from '@/config'
const baseUrl = config.API_ROOT;

// 操作日志
export const urlAdminSysLog = baseUrl + '/api/v0/admin/log';
// 菜单管理
export const urlAdminSysMenu = baseUrl + '/api/v0/admin/menu';
// 权限组
export const urlAdminSysTeam = baseUrl + '/api/v0/admin/team';
// 提现
// /update/{id} 提现变更PUT 传参 status 1通过 2拒绝 为2时拒绝理由refuse_reason必填
export const urlAdminSysCash = baseUrl + '/api/v0/admin/cash';
// 会员管理
export const urlAdminSysUser = baseUrl + '/api/v0/admin/user';
