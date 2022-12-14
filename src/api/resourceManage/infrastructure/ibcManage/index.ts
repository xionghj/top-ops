import { request } from '@/utils/request';

// 数据中心-列表
export function getIbcMangeList(query: API.PageParams) {
  return request<API.IbcManageListResult>({
    url: '/cmdb/idc/',
    method: 'get',
    params: query,
  });
}
// 数据中心-新增机柜
export function addRack(data: API.PageParams) {
  return request({
    url: `/cmdb/rack/`,
    method: 'post',
    data,
  });
}
// 数据中心-机柜编辑
export function editRack(id: number, data: API.PageParams) {
  return request({
    url: `/cmdb/rack/${id}/`,
    method: 'put',
    data,
  });
}
// 数据中心-机柜详情
export function getRackDetails(id: number) {
  return request({
    url: `/cmdb/rack/${id}/`,
    method: 'get',
  });
}
