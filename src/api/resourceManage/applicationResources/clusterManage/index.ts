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
export function editCluster(id: number, data: API.PageParams) {
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
