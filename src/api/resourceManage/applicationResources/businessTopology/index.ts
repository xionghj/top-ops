import { request } from '@/utils/request';

// 业务拓扑-树
export function getCMDBBusinessTree(query: API.PageParams) {
  return request({
    url: '/cmdb/business/tree/',
    method: 'get',
    params: query,
  });
}
// 业务拓扑-业务树-子业务
export function getCMDBBusinessTreeChildren(id: string) {
  return request({
    url: `/cmdb/business/tree/${id}/children/`,
    method: 'get',
  });
}
