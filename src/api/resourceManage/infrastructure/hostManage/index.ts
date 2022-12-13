import { request } from '@/utils/request';

// 获取主机管理-列表
export function getHostMangeList(query: API.PageParams) {
  return request<API.HostManageListResult>({
    url: 'cmdb/host/',
    method: 'get',
    params: query,
  });
}

// 获取主机管理详情-基本信息
export function getHostMangeDetails(id: number) {
  return request({
    url: `cmdb/host/${id}/`,
    method: 'get',
  });
}
// 获取主机管理详情-负责人
export function getHostOwner(id: number, query: API.PageParams) {
  return request({
    url: `cmdb/host/${id}/owner/`,
    method: 'get',
    params: query,
  });
}
// 获取主机管理详情-添加负责人
export function hostOwner(id: number, data: API.PageParams) {
  return request({
    url: `cmdb/host/${id}/owner/`,
    method: 'post',
    data,
  });
}

// 获取主机-所属机柜详情
export function getHostRack(id: number) {
  return request({
    url: `cmdb/host/${id}/rack/`,
    method: 'get',
  });
}
// 获取主机-机柜设置
export function hostRackSettings(id: number, data: API.PageParams) {
  return request({
    url: `cmdb/host/${id}/rack/`,
    method: 'post',
    data,
  });
}
// 获取主机-所属机柜
export function getHostRackList(id: number, query: API.PageParams) {
  return request({
    url: `cmdb/host/${id}/rack/list/`,
    method: 'get',
    params: query,
  });
}
