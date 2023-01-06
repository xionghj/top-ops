import { request } from '@/utils/request';

// 集群管理-列表
export function getClusterList(query: API.PageParams) {
  return request({
    url: '/cmdb/cluster/',
    method: 'get',
    params: query,
  });
}
// 集群管理-创建集群
export function addCluster(data: API.PageParams) {
  return request({
    url: '/cmdb/cluster/',
    method: 'post',
    data,
  });
}
// 集群管理-编辑应用
export function editCluster(id: string, data: API.PageParams) {
  return request({
    url: `/cmdb/cluster/${id}/`,
    method: 'put',
    data,
  });
}
// 集群管理-集群详情
export function getClusterDetails(id: number) {
  return request({
    url: `/cmdb/cluster/${id}/`,
    method: 'get',
  });
}

// 应用-应用集群-设置集群主机
export function setClusterHost(id: string, data: API.PageParams) {
  return request({
    url: `/cmdb/cluster/${id}/hosts/`,
    method: 'post',
    data,
  });
}

// 应用-应用集群-获取主机列表
export function getClusterHostsList(id: string, query: API.PageParams) {
  return request({
    url: `/cmdb/cluster/${id}/hosts/list/`,
    method: 'get',
    params: query,
  });
}
// 应用-集群管理-删除集群
export function deleteCluster(id: string) {
  return request({
    url: `/cmdb/cluster/${id}/`,
    method: 'delete',
  });
}
