import { request } from '@/utils/request';

// 业务管理-列表
export function getCMDBBusinessList(query: API.PageParams) {
  return request({
    url: '/cmdb/business/',
    method: 'get',
    params: query,
  });
}
// 业务管理-创建业务
export function addCMDBBusiness(data: API.PageParams) {
  return request({
    url: '/cmdb/business/',
    method: 'post',
    data,
  });
}
// 业务管理-编辑业务
export function editCMDBBusiness(id: number, data: API.PageParams) {
  return request({
    url: `/cmdb/business/${id}/`,
    method: 'put',
    data,
  });
}
// 业务管理-业务详情
export function getCMDBBusinessDetails(id: number) {
  return request({
    url: `/cmdb/business/${id}/`,
    method: 'get',
  });
}

// 业务管理-设置业务关系
export function setBusinessRelation(id: number, data: API.PageParams) {
  return request({
    url: `/cmdb/business/${id}/relation/`,
    method: 'post',
    data,
  });
}
// 业务管理-父子业务-获取父业务详情
export function getParentBusinessDetails(id: number) {
  return request({
    url: `/cmdb/business/${id}/parent/`,
    method: 'get',
  });
}
// 业务管理-父子业务-获取添加业务列表
export function getChildrenBusinessList(id: number, query: API.PageParams) {
  return request({
    url: `/cmdb/business/${id}/list/`,
    method: 'get',
    params: query,
  });
}
// 业务管理-父子业务-获取子业务列表
export function getBusinessChildrenList(id: number, query: API.PageParams) {
  return request({
    url: `/cmdb/business/${id}/children/`,
    method: 'get',
    params: query,
  });
}
