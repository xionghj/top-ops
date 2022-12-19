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
