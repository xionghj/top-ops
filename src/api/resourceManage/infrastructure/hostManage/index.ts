import { request } from '@/utils/request';

// 获取主机管理列表
export function getHostMangeList(query: API.PageParams) {
  return request<API.HostManageListResult>({
    url: 'cmdb/host/',
    method: 'get',
    params: query,
  });
}
