import { request } from '@/utils/request';

// 机柜管理-列表
export function getRackMangeList(query: API.PageParams) {
  return request<API.RackManageListResult>({
    url: 'cmdb/rack/',
    method: 'get',
    params: query,
  });
}
// 机柜管理-新增机柜
export function addRack(data: API.PageParams) {
  return request({
    url: `/cmdb/rack/`,
    method: 'post',
    data,
  });
}
// 机柜管理-机柜编辑
export function editRack(id: number, data: API.PageParams) {
  return request({
    url: `/cmdb/rack/${id}/`,
    method: 'put',
    data,
  });
}
// 机柜管理-机柜详情
export function getRackDetails(id: number) {
  return request({
    url: `/cmdb/rack/${id}/`,
    method: 'get',
  });
}
