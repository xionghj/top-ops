declare namespace API {
  /** 登录参数 */
  type LoginParams = {
    username: string;
    password: string;
  };

  /** 登录成功结果 */
  type LoginResult = {
    access: string;
    refresh: string;
  };
  type MenuTreeItem = {
    id: number;
    created_at: string;
    updated_at: string;
    title: string;
    name: string;
    kind: string;
    display: string;
    icon: string;
    code: string;
    path: string;
    component: string;
    parent: string;
    children: MenuTreeItem[];
  };
  /** 获取菜单树 */
  type PermMenu = MenuTreeItem[];
}
