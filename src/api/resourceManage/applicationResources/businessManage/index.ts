import { request } from '@/utils/request';

// 业务管理-列表
export function getCMDBBusinessList(query: API.PageParams) {
  return request({
    url: '/cmdb/business/',
    method: 'get',
    params: query,
  });
}
