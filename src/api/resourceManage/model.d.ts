declare namespace API {
  /** 获取主机列表参数 */
  type HostManageListResult = {
    count: number;
    next: number | null;
    previous: number | null;
    results: HostManageListItem[];
  };
  // 主机列表 item
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
  /** 机柜列表数据 */
  type RackManageListResult = {
    count: number;
    next: number | null;
    previous: number | null;
    results: RackManageListItem[];
  };
  // 机柜列表 item
  type RackManageListItem = {
    code: string;
    created_at: string;
    creator: string;
    description: string;
    free_unum: number;
    id: number;
    idc: string;
    name: string;
    status: number;
    unum: string;
    updated_at: string;
  };

   /** 数据中心列表数据 */
   type IbcManageListResult = {
    count: number;
    next: number | null;
    previous: number | null;
    results: IbcManageListItem[];
  };
  // 数据中心 item
  type IbcManageListItem = {
    address: string;
    contact: string;
    creator: string;
    id: number;
    name: string;
    short_name: string;
    telephone: string;
    updated_at: string;
    bigId?: string
  };
}
