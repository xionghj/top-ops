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
// 数据中心-详情
export function getIdcDetails(id: number) {
  return request({
    url: `/cmdb/idc/${id}/`,
    method: 'get',
  });
}

// 数据中心-获取机柜
export function getIdcRacks(id: number) {
  return request({
    url: `/cmdb/idc/${id}/racks/`,
    method: 'get',
  });
}
// 数据中心-机柜设置
export function idcRacksSettings(id: number, data: API.PageParams) {
  return request({
    url: `cmdb/idc/${id}/racks/`,
    method: 'post',
    data,
  });
}
// 数据中心-允许添加的机柜列表
export function getIdcRacksList(id: number, query: API.PageParams) {
  return request({
    url: `cmdb/idc/${id}/racks/list/`,
    method: 'get',
    params: query,
  });
}
