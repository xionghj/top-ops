import { request } from '@/utils/request';

// 数据中心-列表
export function getIdcMangeList(query: API.PageParams) {
  return request<API.IbcManageListResult>({
    url: '/cmdb/idc/',
    method: 'get',
    params: query,
  });
}
// 数据中心-新增机房
export function addIdc(data: API.PageParams) {
  return request({
    url: `/cmdb/idc/`,
    method: 'post',
    data,
  });
}
// 数据中心-机房编辑
export function editIdc(id: number, data: API.PageParams) {
  return request({
    url: `/cmdb/idc/${id}/`,
    method: 'put',
    data,
  });
}
// 数据中心-机柜详情
export function getIdcDetails(id: number) {
  return request({
    url: `/cmdb/idc/${id}/`,
    method: 'get',
  });
}
