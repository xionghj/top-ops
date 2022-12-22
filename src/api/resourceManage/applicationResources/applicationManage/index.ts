import { request } from '@/utils/request';

// 应用管理-列表
export function getCMDBAppsList(query: API.PageParams) {
  return request({
    url: '/cmdb/apps/',
    method: 'get',
    params: query,
  });
}
// 应用管理-创建应用
export function addCMDBApps(data: API.PageParams) {
  return request({
    url: '/cmdb/apps/',
    method: 'post',
    data,
  });
}
// 应用管理-编辑应用
export function editCMDBApps(id: number, data: API.PageParams) {
  return request({
    url: `/cmdb/apps/${id}/`,
    method: 'put',
    data,
  });
}
// 应用管理-应用详情
export function getCMDBAppsDetails(id: number) {
  return request({
    url: `/cmdb/apps/${id}/`,
    method: 'get',
  });
}

// 应用管理-详情-负责人列表
export function getAppsOwnerList(id: number, query: API.PageParams) {
  return request({
    url: `/cmdb/apps/${id}/owner/list/`,
    method: 'get',
    params: query,
  });
}
// 应用管理-详情-设置负责人
export function setAppsOwner(id: number, data: API.PageParams) {
  return request({
    url: `/cmdb/apps/${id}/owner/list/`,
    method: 'post',
    data,
  });
}

// 应用管理-详情-负责人列表
export function getAppsBusinessDetails(id: number) {
  return request({
    url: `/cmdb/apps/${id}/business/`,
    method: 'get',
  });
}
// 应用管理-详情-设置业务
export function setAppsBusiness(id: number, data: API.PageParams) {
  return request({
    url: `/cmdb/apps/${id}/owner/list/`,
    method: 'post',
    data,
  });
}
