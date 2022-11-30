declare namespace API {
  /** 获取菜单列表参数 */
  type HostManageListResult = {
    count: number;
    next: number | null;
    previous: number | null;
    results: HostManageListItem[];
  };
  type HostManageListItem = {
    agent_status: string;
    cpu_count: string | null;
    creator: string;
    first_owner: string;
    hostname: string | null;
    id: number;
    ip: string;
    mem_size: string | null;
    os_release: string | null;
    second_owner: string;
    updated_at: string;
  };
}
