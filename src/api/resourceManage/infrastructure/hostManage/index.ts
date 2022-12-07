import { request } from '@/utils/request';

// 获取主机管理-列表
export function getHostMangeList(query: API.PageParams) {
  return request<API.HostManageListResult>({
    url: 'cmdb/host/',
    method: 'get',
    params: query,
  });
}

// 获取主机管理-详情
export function getHostMangeDetails(id: number) {
  return request<API.HostManageListResult>({
    url: `cmdb/host/${id}`,
    method: 'get',
  });
}
